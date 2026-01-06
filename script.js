const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIN_SCORE = 11;

// UI
const overlay = document.getElementById("overlay");
const startButton = document.getElementById("startButton");
const onePlayerBtn = document.getElementById("onePlayerBtn");
const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const controlHint = document.getElementById("controlHint");

const playerScoreEl = document.getElementById("playerScore");
const aiScoreEl = document.getElementById("aiScore");

// Cameras
const webcam = document.getElementById("webcam");
const webcamLeft = document.getElementById("webcamLeft");
const webcamRight = document.getElementById("webcamRight");
const rightCam = document.getElementById("rightCam");

// Game state
let running = false;
let gameMode = "single";
let playerScore = 0;
let aiScore = 0;

// Objects
const leftPaddle = { x: 20, y: 220, w: 15, h: 100 };
const rightPaddle = { x: 685, y: 220, w: 15, h: 100 };
let ball = { x: 360, y: 260, r: 8, vx: 5, vy: 4 };

// Hands
let detector;
let leftHandY = 260;
let rightHandY = 260;

// MODE BUTTONS
onePlayerBtn.classList.add("active");

onePlayerBtn.onclick = () => {
  gameMode = "single";
  onePlayerBtn.classList.add("active");
  twoPlayerBtn.classList.remove("active");
  rightCam.classList.add("hidden");
  controlHint.textContent = "Use RIGHT hand";
};

twoPlayerBtn.onclick = () => {
  gameMode = "multi";
  twoPlayerBtn.classList.add("active");
  onePlayerBtn.classList.remove("active");
  rightCam.classList.remove("hidden");
  controlHint.textContent =
    "RIGHT hand → Player 1 | LEFT hand → Player 2";
};

// HAND TRACKING
async function initHands() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });

  webcam.srcObject = stream;
  webcamLeft.srcObject = stream;
  webcamRight.srcObject = stream;

  await webcam.play();

  detector = await handPoseDetection.createDetector(
    handPoseDetection.SupportedModels.MediaPipeHands,
    {
      runtime: "mediapipe",
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
      maxHands: 2
    }
  );

  detectHands();
}

async function detectHands() {
  if (!running) return;

  const hands = await detector.estimateHands(webcam);

  hands.forEach(hand => {
    const y = hand.keypoints[0].y;
    if (hand.handedness === "Left") leftHandY = y;
    if (gameMode === "multi" && hand.handedness === "Right") rightHandY = y;
  });

  requestAnimationFrame(detectHands);
}

// GAME LOGIC
function resetBall() {
    ball.x = 360;
  
    // random Y position (avoid extreme edges)
    ball.y = Math.random() * (520 - 100) + 50;
  
    // random direction
    const dir = Math.random() > 0.5 ? 1 : -1;
    ball.vx = dir * 5;
  
    // random Y speed (not zero, not insane)
    ball.vy = (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1);
  }  

function checkWin() {
  if (playerScore >= WIN_SCORE || aiScore >= WIN_SCORE) {
    running = false;
    overlay.style.display = "flex";

    let winnerText = "";

    if (gameMode === "single") {
      winnerText = playerScore >= WIN_SCORE
        ? "🎉 You Win!"
        : "💀 AI Wins!";
    } else {
      winnerText = playerScore >= WIN_SCORE
        ? "🏆 Player 1 Wins!"
        : "🏆 Player 2 Wins!";
    }

    overlay.innerHTML = `
      <h2>${winnerText}</h2>
      <p class="instructions">First to ${WIN_SCORE} points</p>
      <button id="playAgain" class="start-btn">Play Again</button>
    `;

    document.getElementById("playAgain").onclick = resetGame;
  }
}

function resetGame() {
  overlay.style.display = "flex";
  overlay.innerHTML = `
    <h2>Choose Mode</h2>
    <div class="mode-select">
      <button id="onePlayerBtn">1 Player</button>
      <button id="twoPlayerBtn">2 Player</button>
    </div>
    <button id="startButton">Start Game</button>
  `;
  location.reload(); // safest reset (camera + state)
}

function update() {
  leftPaddle.y = leftHandY - leftPaddle.h / 2;

  if (gameMode === "single") {
    rightPaddle.y +=
      (ball.y - (rightPaddle.y + rightPaddle.h / 2)) * 0.08;
  } else {
    rightPaddle.y = rightHandY - rightPaddle.h / 2;
  }

  leftPaddle.y = Math.max(0, Math.min(520 - leftPaddle.h, leftPaddle.y));
  rightPaddle.y = Math.max(0, Math.min(520 - rightPaddle.h, rightPaddle.y));

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y < 0 || ball.y > 520) ball.vy *= -1;

  if (
    ball.x < leftPaddle.x + leftPaddle.w &&
    ball.y > leftPaddle.y &&
    ball.y < leftPaddle.y + leftPaddle.h
  ) ball.vx *= -1;

  if (
    ball.x > rightPaddle.x &&
    ball.y > rightPaddle.y &&
    ball.y < rightPaddle.y + rightPaddle.h
  ) ball.vx *= -1;

  if (ball.x < 0) {
    aiScore++;
    aiScoreEl.textContent = aiScore;
    resetBall();
    checkWin();
  }

  if (ball.x > 720) {
    playerScore++;
    playerScoreEl.textContent = playerScore;
    resetBall();
    checkWin();
  }
}

function draw() {
  ctx.clearRect(0, 0, 720, 520);

  ctx.fillStyle = "white";
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.w, leftPaddle.h);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.w, rightPaddle.h);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#00ffcc";
  ctx.beginPath();
  ctx.arc(30, leftHandY, 6, 0, Math.PI * 2);
  ctx.fill();

  if (gameMode === "multi") {
    ctx.fillStyle = "#ff6b6b";
    ctx.beginPath();
    ctx.arc(690, rightHandY, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function loop() {
  if (!running) return;
  update();
  draw();
  requestAnimationFrame(loop);
}

// START GAME
startButton.onclick = async () => {
  overlay.style.display = "none";
  running = true;
  playerScore = 0;
  aiScore = 0;
  playerScoreEl.textContent = "0";
  aiScoreEl.textContent = "0";
  await initHands();
  loop();
};
