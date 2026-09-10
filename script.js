const form=document.getElementById("checkForm");
const username=document.getElementById("username");
const password=document.getElementById("password");
const togglePassword=document.getElementById("togglePassword");
const loginScreen=document.getElementById("loginScreen");
const gameScreen=document.getElementById("gameScreen");
const handle=document.getElementById("handle");
const message=document.getElementById("message");
const logout=document.getElementById("logout");
const createAccount=document.getElementById("createAccount");
const rpsPanel=document.getElementById("rpsPanel");
const truthPanel=document.getElementById("truthPanel");
const rpsResult=document.getElementById("rpsResult");
const truthResult=document.getElementById("truthResult");
const playerScoreEl=document.getElementById("playerScore");
const computerScoreEl=document.getElementById("computerScore");
const drawScoreEl=document.getElementById("drawScore");
const roundCountEl=document.getElementById("roundCount");
const gamesCountEl=document.getElementById("gamesCount");
const truthCountEl=document.getElementById("truthCount");
const dareCountEl=document.getElementById("dareCount");
const truthAnswerBox=document.getElementById("truthAnswerBox");
const truthAnswer=document.getElementById("truthAnswer");
const submitTruth=document.getElementById("submitTruth");
const completeDare=document.getElementById("completeDare");
const finishDay=document.getElementById("finishDay");
const finishMessage=document.getElementById("finishMessage");

let sessionId="";
let currentUsername="";
let playerScore=0;
let computerScore=0;
let drawScore=0;
let roundCount=0;
let gamesPlayed=0;
let truthCount=0;
let dareCount=0;
let currentTruth="";
let currentDare="";
let lastGame="";

const show=(el,visible)=>{el.hidden=!visible};
const postEvent=async(eventType,data={})=>{
  if(!sessionId)return;
  try{
    await fetch("/api/game-event",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({sessionId,username:currentUsername,eventType,data})
    });
  }catch(e){console.warn("Game event could not be recorded:",e.message)}
};

const updateStats=()=>{
  roundCountEl.textContent=roundCount;
  gamesCountEl.textContent=gamesPlayed;
  truthCountEl.textContent=truthCount;
  dareCountEl.textContent=dareCount;
  playerScoreEl.textContent=playerScore;
  computerScoreEl.textContent=computerScore;
  drawScoreEl.textContent=drawScore;
};

togglePassword.onclick=()=>{
  password.type=password.type==="password"?"text":"password";
  togglePassword.textContent=password.type==="password"?"Show":"Hide";
};

form.addEventListener("submit",async e=>{
  e.preventDefault();
  const name=username.value.trim().replace(/^@/,"");
  if(!name){message.textContent="Please enter your username.";return}
  message.textContent="Opening the game lounge…";
  const clientInfo={page:"dhanush-games-login",action:"login-success",language:navigator.language||"unknown",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"unknown",screenWidth:window.innerWidth,screenHeight:window.innerHeight};
  try{
    const response=await fetch("/api/demo-check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:name,clientInfo})});
    const data=await response.json().catch(()=>({}));
    if(!response.ok||!data.ok)throw new Error(data.error||"Backend request failed.");
    currentUsername=name;
    sessionId=data.entryId||crypto.randomUUID();
    handle.textContent="@"+name;
    loginScreen.hidden=true;
    gameScreen.hidden=false;
    password.value="";
    message.textContent="";
    resetSessionStats();
    await postEvent("session-start",{message:"Game session started"});
    showGamePicker();
  }catch(err){message.textContent="⚠ Could not continue: "+(err.message||"request failed")}
});

createAccount.onclick=()=>{message.textContent="Demo profile mode: enter any username to continue.";username.focus()};

function resetSessionStats(){
  playerScore=0;computerScore=0;drawScore=0;roundCount=0;gamesPlayed=0;truthCount=0;dareCount=0;currentTruth="";currentDare="";lastGame="";
  updateStats();
  finishMessage.textContent="";
}

function showGamePicker(){
  show(rpsPanel,false);show(truthPanel,false);show(truthAnswerBox,false);show(completeDare,false);
  document.querySelectorAll(".game-choice").forEach(b=>b.classList.remove("active"));
}

document.querySelectorAll(".game-choice").forEach(button=>{
  button.onclick=()=>{
    document.querySelectorAll(".game-choice").forEach(b=>b.classList.remove("active"));
    button.classList.add("active");
    const game=button.dataset.game;
    show(rpsPanel,game==="rps");show(truthPanel,game==="truth");
    lastGame=game;
    gamesPlayed++;
    updateStats();
    postEvent("game-opened",{game});
  };
});

const moves=["stone","paper","scissor"];
const labels={stone:"🪨 Stone",paper:"📄 Paper",scissor:"✂️ Scissor"};
const computerMove=()=>moves[Math.floor(Math.random()*moves.length)];
const getWinner=(player,computer)=>{
  if(player===computer)return "draw";
  if((player==="stone"&&computer==="scissor")||(player==="paper"&&computer==="stone")||(player==="scissor"&&computer==="paper"))return "player";
  return "computer";
};

document.querySelectorAll("[data-move]").forEach(button=>{
  button.onclick=()=>{
    const player=button.dataset.move;
    const computer=computerMove();
    const winner=getWinner(player,computer);
    roundCount++;
    if(winner==="player")playerScore++;
    else if(winner==="computer")computerScore++;
    else drawScore++;
    updateStats();
    const outcome=winner==="player"?"🎉 You win!":winner==="computer"?"🤖 Computer wins!":"🤝 It's a draw!";
    rpsResult.innerHTML=outcome+"<br><small>Round "+roundCount+" · You: "+labels[player]+" · Computer: "+labels[computer]+"</small>";
    postEvent("rps-round",{round:roundCount,playerMove:player,computerMove:computer,result:winner,playerScore,computerScore,drawScore});
  };
});

const truths=["What is one skill you wish you could master instantly?","What is the funniest thing that happened to you recently?","What is one goal you really want to achieve this year?","Which song can instantly improve your mood?","What is one thing you are secretly proud of?","What is a harmless funny habit you have?"];
const dares=["Do your best movie-star pose for 10 seconds.","Speak like a robot for the next 30 seconds.","Make your funniest face and hold it for 5 seconds.","Create a 5-second victory dance.","Give yourself a dramatic motivational speech.","Pretend to be a sports commentator for 15 seconds."];
const randomItem=a=>a[Math.floor(Math.random()*a.length)];

document.getElementById("truthBtn").onclick=()=>{
  currentTruth=randomItem(truths);currentDare="";truthCount++;updateStats();
  truthResult.textContent="💬 Truth: "+currentTruth;
  truthAnswer.value="";show(truthAnswerBox,true);show(completeDare,false);truthAnswer.focus();
  postEvent("truth-question",{question:currentTruth,truthNumber:truthCount});
};

document.getElementById("dareBtn").onclick=()=>{
  currentDare=randomItem(dares);currentTruth="";dareCount++;updateStats();
  truthResult.textContent="🔥 Dare: "+currentDare;
  show(truthAnswerBox,false);show(completeDare,true);
  postEvent("dare-question",{dare:currentDare,dareNumber:dareCount});
};

submitTruth.onclick=async()=>{
  const answer=truthAnswer.value.trim();
  if(!answer){truthAnswer.focus();return}
  truthResult.innerHTML="✅ Truth answer recorded.<br><small>Thank you for answering!</small>";
  show(truthAnswerBox,false);
  await postEvent("truth-answer",{question:currentTruth,answer:answer.slice(0,500),truthNumber:truthCount});
};

completeDare.onclick=async()=>{
  truthResult.innerHTML="🎉 Dare completed!<br><small>Nice one.</small>";
  show(completeDare,false);
  await postEvent("dare-completed",{dare:currentDare,dareNumber:dareCount});
};

document.getElementById("backToGames").onclick=showGamePicker;
document.getElementById("backToGames2").onclick=showGamePicker;

finishDay.onclick=async()=>{
  if(!currentUsername)return;
  const ok=confirm("Complete today's game session and send the final score/activity summary to the configured Telegram chat?");
  if(!ok)return;
  finishDay.disabled=true;
  finishMessage.textContent="Saving today's final score…";
  try{
    const response=await fetch("/api/game-complete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId,username:currentUsername,summary:{rounds:roundCount,games:gamesPlayed,playerScore,computerScore,draws:drawScore,truths:truthCount,dares:dareCount}})});
    const data=await response.json().catch(()=>({}));
    if(!response.ok||!data.ok)throw new Error(data.error||"Could not save final score");
    finishMessage.textContent=data.notificationSent?"🏆 Day completed and score sent to Telegram.":"🏆 Day completed. Telegram is not configured.";
  }catch(err){finishMessage.textContent="⚠ "+err.message;}
  finishDay.disabled=false;
};

logout.onclick=()=>{
  if(roundCount||truthCount||dareCount){
    const ok=confirm("Exit this session? Your final score will not be marked as completed unless you use Complete Day.");
    if(!ok)return;
  }
  gameScreen.hidden=true;loginScreen.hidden=false;username.value="";password.value="";message.textContent="";resetSessionStats();showGamePicker();
};
