const express=require("express");
const path=require("path");
const crypto=require("crypto");
const app=express();

app.use(express.json({limit:"30kb"}));
app.use(express.static(__dirname));

const cleanUsername=value=>String(value||"").trim().replace(/^@/,"").replace(/[^a-zA-Z0-9._-]/g,"").slice(0,30);
const safeText=(value,max=500)=>String(value??"unknown").slice(0,max).replace(/[\r\n]/g," ");
const safeNumber=value=>Number.isFinite(Number(value))?Number(value):0;

async function sendTelegram(text){
  const token=String(process.env.TELEGRAM_BOT_TOKEN||"").trim();
  const chat=String(process.env.TELEGRAM_CHAT_ID||"").trim();
  if(!token||!chat){
    console.error("Telegram is not configured: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID.");
    return {sent:false,error:"Telegram environment variables are missing."};
  }
  try{
    const response=await fetch("https://api.telegram.org/bot"+token+"/sendMessage",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({chat_id:chat,text,disable_web_page_preview:true})
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok||data.ok!==true){
      const reason=data?.description||("HTTP "+response.status);
      console.error("Telegram sendMessage failed:",reason);
      return {sent:false,error:reason};
    }
    return {sent:true,error:null};
  }catch(error){
    console.error("Telegram connection error:",error.message);
    return {sent:false,error:error.message};
  }
}

app.get("/health",(req,res)=>res.status(200).json({ok:true,status:"running"}));

app.get("/api/telegram-status",(req,res)=>res.json({ok:true,telegramConfigured:Boolean(String(process.env.TELEGRAM_BOT_TOKEN||"").trim()&&String(process.env.TELEGRAM_CHAT_ID||"").trim())}));

app.post("/api/demo-check",async(req,res)=>{
  const username=cleanUsername(req.body?.username);
  if(!username)return res.status(400).json({ok:false,error:"Please enter a valid username."});
  const raw=req.body?.clientInfo||{};
  const clientInfo={page:safeText(raw.page,100),action:safeText(raw.action,100),language:safeText(raw.language,50),timezone:safeText(raw.timezone,100),screenWidth:safeNumber(raw.screenWidth),screenHeight:safeNumber(raw.screenHeight)};
  const entryId=crypto.randomUUID();
  const timestamp=new Date().toISOString();
  const text=["🎮 Dhanush Games — New Session","","👤 Username: @"+username,"🆔 Session: "+entryId,"🕒 Time: "+timestamp,"📄 Page: "+clientInfo.page,"🎯 Action: "+clientInfo.action,"🌐 Language: "+clientInfo.language,"🕓 Timezone: "+clientInfo.timezone,"📱 Viewport: "+clientInfo.screenWidth+" × "+clientInfo.screenHeight,"🔐 Password data: NOT COLLECTED"].join("\n");
  const notification=await sendTelegram(text);
  res.json({ok:true,username,entryId,timestamp,notificationSent:notification.sent,notificationError:notification.error,passwordCollected:false,passwordTransmitted:false});
});

app.post("/api/game-event",async(req,res)=>{
  const username=cleanUsername(req.body?.username);
  const sessionId=safeText(req.body?.sessionId,80);
  const eventType=safeText(req.body?.eventType,50);
  const data=req.body?.data&&typeof req.body.data==="object"?req.body.data:{};
  if(!username||!sessionId||!eventType)return res.status(400).json({ok:false,error:"Missing game event details."});

  const lines=["🎮 Dhanush Games — Game Event","","👤 Username: @"+username,"🆔 Session: "+sessionId,"🎯 Event: "+eventType,"🕒 Time: "+new Date().toISOString()];
  for(const [key,value] of Object.entries(data)){
    const lower=String(key).toLowerCase();
    if(lower.includes("password")||lower.includes("token"))continue;
    lines.push("• "+safeText(key,60)+": "+safeText(value,500));
  }
  const notification=await sendTelegram(lines.join("\n"));
  res.json({ok:true,notificationSent:notification.sent,notificationError:notification.error});
});

app.post("/api/game-complete",async(req,res)=>{
  const username=cleanUsername(req.body?.username);
  const sessionId=safeText(req.body?.sessionId,80);
  const summary=req.body?.summary||{};
  if(!username||!sessionId)return res.status(400).json({ok:false,error:"Missing session details."});

  const rounds=safeNumber(summary.rounds);
  const games=safeNumber(summary.games);
  const playerScore=safeNumber(summary.playerScore);
  const computerScore=safeNumber(summary.computerScore);
  const draws=safeNumber(summary.draws);
  const truths=safeNumber(summary.truths);
  const dares=safeNumber(summary.dares);
  const text=["🏆 Dhanush Games — DAY COMPLETED","","👤 Username: @"+username,"🆔 Session: "+sessionId,"📅 Completed: "+new Date().toISOString(),"","📊 FINAL SCORE","🎯 RPS rounds: "+rounds,"🎮 Games opened: "+games,"🏆 Player wins: "+playerScore,"🤖 Computer wins: "+computerScore,"🤝 Draws: "+draws,"💬 Truth questions: "+truths,"🔥 Dares: "+dares,"","✅ Session marked complete.","🔐 Password data: NOT COLLECTED"].join("\n");
  const notification=await sendTelegram(text);
  res.json({ok:true,completed:true,notificationSent:notification.sent,notificationError:notification.error});
});

app.use((req,res)=>res.sendFile(path.join(__dirname,"index.html")));

const port=Number(process.env.PORT)||10000;
app.listen(port,"0.0.0.0",()=>console.log("Dhanush Games running on 0.0.0.0:"+port));
