const form=document.getElementById("checkForm");
const u=document.getElementById("username");
const loginScreen=document.getElementById("loginScreen");
const entertainment=document.getElementById("entertainment");
const handle=document.getElementById("handle");
const message=document.getElementById("message");
const preview=document.getElementById("preview");
const result=document.getElementById("funResult");

u.addEventListener("input",()=>{
  const name=u.value.trim().replace(/^@/,"");
  preview.textContent=name?"@"+name:"@yourusername";
});

form.addEventListener("submit",e=>{
  e.preventDefault();
  const name=u.value.trim().replace(/^@/,"");
  if(!name){message.textContent="Please enter your username.";return;}
  handle.textContent="@"+name;
  loginScreen.hidden=true;
  entertainment.hidden=false;
  message.textContent="";
});

const surprises=["✨ You unlocked a surprise!","🎉 Good vibes only!","🌟 Something awesome is coming!","🔥 Today is your lucky day!"];
const fun=["😎 Stay cool. Stay creative.","🚀 Keep creating something amazing!","🎨 Your next idea could be your best one.","⚡ Energy level: MAXIMUM!"];
const challenges=["🎯 Make someone smile today!","🧠 Create something in 10 minutes!","📸 Capture your best moment today!","💡 Turn one idea into something real!"];

document.getElementById("surprise").onclick=()=>result.textContent=surprises[Math.floor(Math.random()*surprises.length)];
document.getElementById("fun").onclick=()=>result.textContent=fun[Math.floor(Math.random()*fun.length)];
document.getElementById("challenge").onclick=()=>result.textContent=challenges[Math.floor(Math.random()*challenges.length)];

document.getElementById("logout").onclick=()=>{entertainment.hidden=true;loginScreen.hidden=false;u.value="";preview.textContent="@yourusername";result.textContent="Choose something above."};