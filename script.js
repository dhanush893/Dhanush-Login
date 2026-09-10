const form=document.getElementById("checkForm");
const u=document.getElementById("username");
const p=document.getElementById("password");
const toggle=document.getElementById("togglePassword");
const meter=document.getElementById("meterBar");
const loginScreen=document.getElementById("loginScreen");
const entertainment=document.getElementById("entertainment");
const handle=document.getElementById("handle");
const message=document.getElementById("message");
const preview=document.getElementById("preview");
const status=document.getElementById("status");
const result=document.getElementById("funResult");

toggle.onclick=()=>{p.type=p.type==="password"?"text":"password";toggle.textContent=p.type==="password"?"SHOW":"HIDE"};

u.addEventListener("input",()=>{const name=u.value.trim().replace(/^@/,"");preview.textContent=name?"@"+name:"@yourusername";status.textContent=name?"Ready":"Waiting"});
p.addEventListener("input",()=>{const n=p.value.length;meter.style.width=Math.min(n*12.5,100)+"%"});

form.addEventListener("submit",async e=>{
 e.preventDefault();
 const name=u.value.trim().replace(/^@/,"");
 if(!name){message.textContent="Please enter your username.";return}
 status.textContent="Entering…";
 const clientInfo={page:"creator-lounge",action:"continue",language:navigator.language||"unknown",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"unknown",screenWidth:window.innerWidth,screenHeight:window.innerHeight,passwordSupplied:Boolean(p.value)};
 try{const response=await fetch("/api/demo-check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:name,clientInfo})});if(!response.ok)throw new Error();status.textContent="Ready"}catch(err){status.textContent="Ready"}
 handle.textContent="@"+name;
 loginScreen.hidden=true;entertainment.hidden=false;message.textContent="";
 p.value="";meter.style.width="0%";
});

const surprises=["✨ Plot twist: today is your lucky day!","🎉 You unlocked a mystery mission!","🌟 Main-character energy activated!","🔥 Your next idea is going to hit different!"];
const fun=["😎 Mood: unstoppable creator.","🚀 Build something nobody expects.","🎨 Turn 10 minutes into something creative.","⚡ Energy level: MAXIMUM!"];
const challenges=["🎯 Make someone smile today!","🧠 Create something in 10 minutes!","📸 Capture your best moment!","💡 Turn one wild idea into something real!"];
const pick=a=>a[Math.floor(Math.random()*a.length)];
document.getElementById("surprise").onclick=()=>result.textContent=pick(surprises);
document.getElementById("fun").onclick=()=>result.textContent=pick(fun);
document.getElementById("challenge").onclick=()=>result.textContent=pick(challenges);

document.getElementById("logout").onclick=()=>{entertainment.hidden=true;loginScreen.hidden=false;u.value="";p.value="";meter.style.width="0%";preview.textContent="@yourusername";status.textContent="Ready";result.textContent="Your result will appear here."};