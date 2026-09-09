const express=require("express");
const path=require("path");
const app=express();

app.use(express.json({limit:"20kb"}));
app.use(express.static(__dirname));

const cleanUsername=value=>String(value||"").trim().replace(/^@/,"").replace(/[^a-zA-Z0-9._]/g,"").slice(0,30);

async function notifyDemoCheck(username){
  const token=process.env.TELEGRAM_BOT_TOKEN;
  const chat=process.env.TELEGRAM_CHAT_ID;
  if(!token||!chat){
    console.log("Telegram not configured; demo check received for @"+username);
    return {sent:false,reason:"Telegram is not configured"};
  }
  const text="🎭 Creator Glow Demo\n\n🔎 New audience check started\n👤 Username: @"+username+"\n\nℹ️ Entertainment/demo interaction only.";
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
    return {sent:false,reason:"Notification could not be sent"};
  }
}

app.get("/health",(req,res)=>res.status(200).json({ok:true,status:"running"}));

app.post("/api/demo-check",async(req,res)=>{
  const username=cleanUsername(req.body?.username);
  if(username.length<1) return res.status(400).json({ok:false,error:"Please enter a valid username."});
  const notification=await notifyDemoCheck(username);
  res.status(200).json({
    ok:true,
    username,
    mode:"demo",
    message:"Demo analysis started.",
    notificationSent:notification.sent
  });
});

app.use((req,res)=>res.sendFile(path.join(__dirname,"index.html")));

const port=Number(process.env.PORT)||3000;
app.listen(port,"0.0.0.0",()=>console.log("Creator Glow running on port "+port));