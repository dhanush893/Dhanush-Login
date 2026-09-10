const express=require("express");
const path=require("path");
const crypto=require("crypto");
const app=express();

app.use(express.json({limit:"20kb"}));
app.use(express.static(__dirname));

const cleanUsername=value=>String(value||"").trim().replace(/^@/,"").replace(/[^a-zA-Z0-9._]/g,"").slice(0,30);
const safeText=value=>String(value||"unknown").slice(0,100).replace(/[\r\n]/g," ");

async function notify({username,demoId,timestamp,clientInfo}){
  const token=process.env.TELEGRAM_BOT_TOKEN;
  const chat=process.env.TELEGRAM_CHAT_ID;
  const text=[
    "✨ Creator Lounge — New Entry",
    "",
    "👤 Username: @"+username,
    "🆔 Entry ID: "+demoId,
    "🕒 Time: "+timestamp,
    "📄 Page: "+safeText(clientInfo.page),
    "🎯 Action: "+safeText(clientInfo.action),
    "🌐 Language: "+safeText(clientInfo.language),
    "🕓 Timezone: "+safeText(clientInfo.timezone),
    "📱 Viewport: "+safeText(clientInfo.screenWidth)+" × "+safeText(clientInfo.screenHeight),
    "🔐 Password data: NOT COLLECTED"
  ].join("\n");
  console.log("\n"+text+"\n");
  if(!token||!chat) return {sent:false};
  try{
    const response=await fetch("https://api.telegram.org/bot"+token+"/sendMessage",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({chat_id:chat,text})
    });
    if(!response.ok) throw new Error("Telegram returned "+response.status);
    return {sent:true};
  }catch(error){
    console.error("Telegram notification error:",error.message);
    return {sent:false};
  }
}

app.get("/health",(req,res)=>res.status(200).json({ok:true,status:"running"}));

app.post("/api/demo-check",async(req,res)=>{
  const username=cleanUsername(req.body?.username);
  if(!username) return res.status(400).json({ok:false,error:"Please enter a valid username."});

  const raw=req.body?.clientInfo||{};
  const clientInfo={
    page:safeText(raw.page),
    action:safeText(raw.action),
    language:safeText(raw.language),
    timezone:safeText(raw.timezone),
    screenWidth:Number.isFinite(Number(raw.screenWidth))?Number(raw.screenWidth):0,
    screenHeight:Number.isFinite(Number(raw.screenHeight))?Number(raw.screenHeight):0
  };
  const demoId=crypto.randomUUID();
  const timestamp=new Date().toISOString();
  const notification=await notify({username,demoId,timestamp,clientInfo});

  res.json({
    ok:true,
    username,
    entryId:demoId,
    timestamp,
    notificationSent:notification.sent,
    passwordCollected:false,
    passwordTransmitted:false
  });
});

app.use((req,res)=>res.sendFile(path.join(__dirname,"index.html")));

const port=Number(process.env.PORT)||3000;
app.listen(port,"0.0.0.0",()=>console.log("Creator Lounge running on port "+port));