const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const muteBtn = document.getElementById("mute-btn");
const playerInput = document.getElementById("player-names");
const spinSound = new Audio("spin.mp3");

let players = [];
let arrowAngle = 0;
let isGameRunning = false;
let isMuted = false;

// Resize canvas
function resizeCanvas() {
  const size = Math.min(window.innerWidth * 0.8, 500);
  canvas.width = size;
  canvas.height = size;
}
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  if (players.length > 0) drawGameCircle(players);
});

// Draw game circle
function drawGameCircle(players) {
  const radius = canvas.width / 2 - 10;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const sliceAngle = (2 * Math.PI) / players.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  players.forEach((player, index) => {
    const startAngle = index * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    ctx.fillStyle = index % 2 === 0 ? "#ffcccb" : "#add8e6";
    ctx.fill();
    ctx.stroke();

    const textAngle = startAngle + sliceAngle / 2;
    const textX = centerX + Math.cos(textAngle) * (radius - 40);
    const textY = centerY + Math.sin(textAngle) * (radius - 40);

    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(textAngle + Math.PI / 2);
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(player, 0, 0);
    ctx.restore();
  });

  drawArrow(centerX, centerY, radius);
  drawSpinButton(centerX, centerY);
}

function drawSpinButton(centerX, centerY) {
  const buttonRadius = 40;

  ctx.beginPath();
  ctx.arc(centerX, centerY, buttonRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "#28a745";
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Spin", centerX, centerY);
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const buttonRadius = 40;

  const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);
  if (distance <= buttonRadius && !isGameRunning) {
    spinArrow();
  }
});

function drawArrow(centerX, centerY, radius) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(arrowAngle);

  ctx.beginPath();
  ctx.moveTo(0, -radius + 10);
  ctx.lineTo(10, -radius + 30);
  ctx.lineTo(-10, -radius + 30);
  ctx.closePath();
  ctx.fillStyle = "red";

  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fill();

  ctx.restore();
}

function spinArrow() {
  isGameRunning = true;

  if (!isMuted) {
    spinSound.currentTime = 0;
    spinSound.play();
  }

  const duration = 4000; // Spin duration in milliseconds
  const endAngle = Math.random() * 2 * Math.PI + 10 * Math.PI;
  const startTime = Date.now();

  function animate() {
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < duration) {
      arrowAngle = ((elapsedTime / duration) * endAngle) % (2 * Math.PI);
      drawGameCircle(players);
      requestAnimationFrame(animate);
    } else {
      // Final arrow angle
      arrowAngle = endAngle % (2 * Math.PI);
      drawGameCircle(players);
      isGameRunning = false;
    }
  }

  animate();
}

startBtn.addEventListener("click", () => {
  const playerNames = playerInput.value.trim().split("\n").filter(Boolean);
  if (playerNames.length < 2) {
    alert("Please enter at least two player names.");
    return;
  }
  if (new Set(playerNames).size !== playerNames.length) {
    alert("Duplicate names are not allowed.");
    return;
  }

  players = playerNames;

  playerInput.style.display = "none";
  startBtn.style.display = "none";
  resetBtn.style.display = "inline-block";

  drawGameCircle(players);
});

resetBtn.addEventListener("click", () => {
  players = [];
  arrowAngle = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  playerInput.value = "";

  playerInput.style.display = "block";
  startBtn.style.display = "inline-block";
  resetBtn.style.display = "none";
});

muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? "Unmute Sound" : "Mute Sound";
});
