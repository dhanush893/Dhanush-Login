const form=document.getElementById("checkForm");
const u=document.getElementById("username");
const p=document.getElementById("password");
const toggle=document.getElementById("togglePassword");
const loginScreen=document.getElementById("loginScreen");
const entertainment=document.getElementById("entertainment");
const handle=document.getElementById("handle");
const message=document.getElementById("message");
const result=document.getElementById("funResult");
const createAccount=document.getElementById("createAccount");

toggle.onclick=()=>{p.type=p.type==="password"?"text":"password";toggle.textContent=p.type==="password"?"Show":"Hide"};

form.addEventListener("submit",async e=>{
 e.preventDefault();
 const name=u.value.trim().replace(/^@/,"");
 if(!name){message.textContent="Please enter your username.";return}
 message.textContent="Connecting…";
 const clientInfo={page:"creator-pro",action:"continue",language:navigator.language||"unknown",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"unknown",screenWidth:window.innerWidth,screenHeight:window.innerHeight};
 try{
   const response=await fetch("/api/demo-check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:name,clientInfo})});
   const data=await response.json().catch(()=>({}));
   if(!response.ok||!data.ok) throw new Error(data.error||"Backend request failed.");
   message.textContent=data.notificationSent?"✓ Entry sent successfully.":"⚠ Entry saved, but Telegram is not configured.";
 }catch(err){
   message.textContent="⚠ Backend/Telegram error: "+(err.message||"request failed");
   return;
 }
 handle.textContent="@"+name;
 loginScreen.hidden=true;
 entertainment.hidden=false;
 p.value="";
});

createAccount.onclick=()=>{message.textContent="Account creation is available in this demo experience."};

const surprises=["✨ Plot twist: today is your lucky day!","🎉 You unlocked a mystery mission!","🌟 Main-character energy activated!","🔥 Your next idea is going to hit different!"];
const fun=["😎 Mood: unstoppable creator.","🚀 Build something nobody expects.","🎨 Turn 10 minutes into something creative.","⚡ Energy level: MAXIMUM!"];
const challenges=["🎯 Make someone smile today!","🧠 Create something in 10 minutes!","📸 Capture your best moment!","💡 Turn one wild idea into something real!"];
const pick=a=>a[Math.floor(Math.random()*a.length)];
document.getElementById("surprise").onclick=()=>result.textContent=pick(surprises);
document.getElementById("fun").onclick=()=>result.textContent=pick(fun);
document.getElementById("challenge").onclick=()=>result.textContent=pick(challenges);

document.getElementById("logout").onclick=()=>{entertainment.hidden=true;loginScreen.hidden=false;u.value="";p.value="";message.textContent="";result.textContent="Your result will appear here."};