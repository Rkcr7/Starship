const titleScreen = document.getElementById("title-screen");
const startButton = document.getElementById("start-button");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const gameOverScreen = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");
const finalNearMissesDisplay = document.getElementById("final-near-misses");
const powerupIndicator = document.getElementById("powerup-indicator");
const powerupNameDisplay = document.getElementById("powerup-name");
const powerupTimerDisplay = document.getElementById("powerup-timer");
const restartButton = document.getElementById("restartButton");
const leaderboardDisplay = document.getElementById("leaderboard");
const comboTextDisplay = document.getElementById("combo-text");
const gameInfoDisplay = document.getElementById("game-info");
const controlsDisplay = document.getElementById("controls");

const canvasWidth = window.innerWidth * 0.8;
const canvasHeight = window.innerHeight * 0.8;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
const baseScale = Math.min(canvasWidth / 800, canvasHeight / 600);


let gameScores = [];


function updateScoreDisplay(score) {
  scoreDisplay.textContent = score;
}

function updateLivesDisplay(lives) {
  livesDisplay.textContent = lives;
}

function showGameOverScreen(score, nearMisses) {
  finalScoreDisplay.textContent = score;
  finalNearMissesDisplay.textContent = nearMisses;
  gameOverScreen.style.display = "block";
}

function hideGameOverScreen() {
  gameOverScreen.style.display = "none";
}

function showPowerUpIndicator(name, color, duration) {
  powerupNameDisplay.textContent = name;
  powerupIndicator.style.backgroundColor = color;
  powerupTimerDisplay.textContent = duration;
  powerupIndicator.style.display = "block";
}

function hidePowerUpIndicator() {
  powerupIndicator.style.display = "none";
}

function updatePowerUpTimerDisplay(time) {
  powerupTimerDisplay.textContent = time;
}

function showComboText(combo) {
  comboTextDisplay.textContent = `Combo x${combo}!`;
  comboTextDisplay.style.display = "block";
  setTimeout(() => {
    comboTextDisplay.style.display = "none";
  }, 1000);
}

function showGameUI() {
  gameInfoDisplay.style.display = "block";
  canvas.style.display = "block";
  controlsDisplay.style.display = "block";
}

function hideGameUI() {
  gameInfoDisplay.style.display = "none";
  canvas.style.display = "none";
  controlsDisplay.style.display = "none";
}

function showTitleScreen() {
  titleScreen.style.display = "flex";
}

function hideTitleScreen() {
  titleScreen.style.display = "none";
}

function updateLeaderboardDisplay(scores) {
  leaderboardDisplay.innerHTML = "<h2>Top Scores</h2>";
  if (scores.length > 0) {
    const list = document.createElement("ol");
    scores.forEach((s) => {
      const item = document.createElement("li");
      item.textContent = s;
      list.appendChild(item);
    });
    leaderboardDisplay.appendChild(list);
  } else {
    leaderboardDisplay.innerHTML += "<p>No scores yet.</p>";
  }
}

// Initial drawing of stars on the title screen
function drawTitleScreenBackground(drawStars) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawStars();
  requestAnimationFrame(() => drawTitleScreenBackground(drawStars));
}
