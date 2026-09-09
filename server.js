const express=require("express");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const path=require("path");
const app=express();

const users=[];
app.use(express.json({limit:"100kb"}));
app.use(express.static(__dirname));

const now=()=>new Date().toISOString();

async function notify(event,username){
  const token=process.env.TELEGRAM_BOT_TOKEN;
  const chat=process.env.TELEGRAM_CHAT_ID;
  if(!token||!chat) return;
  try{
    await fetch("https://api.telegram.org/bot"+token+"/sendMessage",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({chat_id:chat,text:"🔔 "+event+"\n👤 User: "+username+"\n🕒 Time: "+now()})
    });
  }catch(error){
    console.error("Telegram notification error:",error.message);
  }
}

app.get("/health",(req,res)=>res.status(200).json({ok:true,status:"running"}));

app.post("/api/register",async(req,res)=>{
  try{
    const {username,password}=req.body||{};
    if(!username||!password||password.length<8) return res.status(400).json({error:"Use a username and password of at least 8 characters."});
    if(users.some(u=>u.username.toLowerCase()===username.toLowerCase())) return res.status(409).json({error:"Username already exists."});
    users.push({username,passwordHash:await bcrypt.hash(password,12)});
    notify("New registration",username);
    res.status(201).json({ok:true});
  }catch(error){console.error(error);res.status(500).json({error:"Server error."});}
});

app.post("/api/login",async(req,res)=>{
  try{
    const {username,password}=req.body||{};
    const user=users.find(u=>u.username.toLowerCase()===(username||"").toLowerCase());
    if(!user||!(await bcrypt.compare(password||"",user.passwordHash))){
      notify("Failed login attempt",username||"unknown");
      return res.status(401).json({error:"Invalid username or password."});
    }
    notify("Successful login",username);
    const token=jwt.sign({sub:username},process.env.JWT_SECRET||"development-only-change-me",{expiresIn:"1h"});
    res.json({ok:true,token});
  }catch(error){console.error(error);res.status(500).json({error:"Server error."});}
});

app.use((req,res)=>{
  res.sendFile(path.join(__dirname,"index.html"));
});

const port=Number(process.env.PORT)||3000;
app.listen(port,"0.0.0.0",()=>console.log("Creator Glow running on port "+port));