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

let playerScore=0;
let computerScore=0;

const show=(el,visible)=>{el.hidden=!visible};

togglePassword.onclick=()=>{
  password.type=password.type==="password"?"text":"password";
  togglePassword.textContent=password.type==="password"?"Show":"Hide";
};

form.addEventListener("submit",async e=>{
  e.preventDefault();
  const name=username.value.trim().replace(/^@/,"");
  if(!name){message.textContent="Please enter your username.";return}

  message.textContent="Opening the game lounge…";
  const clientInfo={
    page:"dhanush-games-login",
    action:"login-success",
    language:navigator.language||"unknown",
    timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"unknown",
    screenWidth:window.innerWidth,
    screenHeight:window.innerHeight
  };

  try{
    const response=await fetch("/api/demo-check",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username:name,clientInfo})
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok||!data.ok) throw new Error(data.error||"Backend request failed.");

    handle.textContent="@"+name;
    loginScreen.hidden=true;
    gameScreen.hidden=false;
    password.value="";
    message.textContent="";
    showGamePicker();
  }catch(err){
    message.textContent="⚠ Could not continue: "+(err.message||"request failed");
  }
});

createAccount.onclick=()=>{
  message.textContent="Demo profile mode: enter any username to continue.";
  username.focus();
};

function showGamePicker(){
  show(rpsPanel,false);
  show(truthPanel,false);
  document.querySelectorAll(".game-choice").forEach(b=>b.classList.remove("active"));
}

document.querySelectorAll(".game-choice").forEach(button=>{
  button.onclick=()=>{
    document.querySelectorAll(".game-choice").forEach(b=>b.classList.remove("active"));
    button.classList.add("active");
    const game=button.dataset.game;
    show(rpsPanel,game==="rps");
    show(truthPanel,game==="truth");
  };
});

const moves=["stone","paper","scissor"];
const labels={stone:"🪨 Stone",paper:"📄 Paper",scissor:"✂️ Scissor"};
const computerMove=()=>moves[Math.floor(Math.random()*moves.length)];

function getWinner(player,computer){
  if(player===computer)return "draw";
  if((player==="stone"&&computer==="scissor")||(player==="paper"&&computer==="stone")||(player==="scissor"&&computer==="paper"))return "player";
  return "computer";
}

document.querySelectorAll("[data-move]").forEach(button=>{
  button.onclick=()=>{
    const player=button.dataset.move;
    const computer=computerMove();
    const winner=getWinner(player,computer);
    if(winner==="player")playerScore++;
    if(winner==="computer")computerScore++;
    playerScoreEl.textContent=playerScore;
    computerScoreEl.textContent=computerScore;

    const outcome=winner==="player"?"🎉 You win!":winner==="computer"?"🤖 Computer wins!":"🤝 It's a draw!";
    rpsResult.innerHTML=outcome+"<br><small>You: "+labels[player]+" &nbsp; • &nbsp; Computer: "+labels[computer]+"</small>";
  };
});

const truths=[
  "What is one skill you wish you could master instantly?",
  "What is the funniest thing that happened to you recently?",
  "What is one goal you really want to achieve this year?",
  "Which song can instantly improve your mood?",
  "What is one thing you are secretly proud of?"
];
const dares=[
  "Do your best movie-star pose for 10 seconds.",
  "Speak like a robot for the next 30 seconds.",
  "Make your funniest face and hold it for 5 seconds.",
  "Create a 5-second victory dance.",
  "Give yourself a dramatic motivational speech."
];
const randomItem=a=>a[Math.floor(Math.random()*a.length)];

document.getElementById("truthBtn").onclick=()=>{
  truthResult.textContent="💬 Truth: "+randomItem(truths);
};

document.getElementById("dareBtn").onclick=()=>{
  truthResult.textContent="🔥 Dare: "+randomItem(dares);
};

document.getElementById("backToGames").onclick=showGamePicker;
document.getElementById("backToGames2").onclick=showGamePicker;

logout.onclick=()=>{
  gameScreen.hidden=true;
  loginScreen.hidden=false;
  username.value="";
  password.value="";
  message.textContent="";
  playerScore=0;
  computerScore=0;
  playerScoreEl.textContent="0";
  computerScoreEl.textContent="0";
  rpsResult.textContent="Make your move!";
  truthResult.textContent="Your challenge will appear here.";
  showGamePicker();
};
