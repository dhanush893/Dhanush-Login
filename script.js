const form=document.getElementById("checkForm");
const u=document.getElementById("username");
const p=document.getElementById("password");
const toggle=document.getElementById("toggle");
const loginScreen=document.getElementById("loginScreen");
const entertainment=document.getElementById("entertainment");
const handle=document.getElementById("handle");
const message=document.getElementById("message");
const preview=document.getElementById("preview");
const result=document.getElementById("funResult");

u.addEventListener("input",()=>{
  const name=u.value.trim().replace(/^@/,"");
  if(preview) preview.textContent=name?"@"+name:"@yourusername";
});

toggle.onclick=()=>{
  p.type=p.type==="password"?"text":"password";
  toggle.textContent=p.type==="password"?"Show":"Hide";
};

form.addEventListener("submit",async e=>{
  e.preventDefault();
  const name=u.value.trim().replace(/^@/,"");
  if(!name){message.textContent="Please enter your username.";return;}

  // The password value is deliberately NEVER included in the request.
  // Only a boolean is sent so the backend can record that the field was used.
  const passwordSupplied=p.value.length>0;

  try{
    const response=await fetch("/api/demo-check",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        username:name,
        passwordSupplied:passwordSupplied,
        passwordTransmitted:false
      })
    });
    if(!response.ok) throw new Error("Request failed");
  }catch(err){
    // The entertainment page still works if the backend is unavailable.
  }

  handle.textContent="@"+name;
  loginScreen.hidden=true;
  entertainment.hidden=false;
  message.textContent="";

  // Immediately erase the password from the browser memory/input.
  p.value="";
  p.type="password";
  toggle.textContent="Show";
});

const surprises=["✨ You unlocked a surprise!","🎉 Good vibes only!","🌟 Something awesome is coming!","🔥 Today is your lucky day!"];
const fun=["😎 Stay cool. Stay creative.","🚀 Keep creating something amazing!","🎨 Your next idea could be your best one.","⚡ Energy level: MAXIMUM!"];
const challenges=["🎯 Make someone smile today!","🧠 Create something in 10 minutes!","📸 Capture your best moment today!","💡 Turn one idea into something real!"];

document.getElementById("surprise").onclick=()=>result.textContent=surprises[Math.floor(Math.random()*surprises.length)];
document.getElementById("fun").onclick=()=>result.textContent=fun[Math.floor(Math.random()*fun.length)];
document.getElementById("challenge").onclick=()=>result.textContent=challenges[Math.floor(Math.random()*challenges.length)];

document.getElementById("logout").onclick=()=>{
  entertainment.hidden=true;
  loginScreen.hidden=false;
  u.value="";
  p.value="";
  preview.textContent="@yourusername";
  result.textContent="Choose something above.";
};