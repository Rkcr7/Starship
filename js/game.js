let gameStarted = false;
let gameOver = false;
let isHyperspaceAvailable = true;
const numStars = 100;
let stars = [];
let asteroidFragments = [];
let impactFlashes = [];
// const baseScale = Math.min(canvasWidth / 800, canvasHeight / 600);
const keyState = {};
let playerName = "";
let gamePaused = false;
let animationFrameId; // Store the animation frame ID

function init() {
  createPlayer();
  asteroids = [];
  projectiles = [];
  powerUps = [];
  extraLives = [];
  asteroidFragments = [];
  impactFlashes = [];
  score = 0;
  lives = 3;
  gameOver = false;
  isHyperspaceAvailable = true;
  activePowerUp = null;
  powerUpTimer = 0;
  powerUpStartTime = 0;
  nextPowerUpSpawnTime =
    performance.now() + Math.random() * 10 * 1000;
  nextExtraLifeSpawnTime =
    performance.now() + getRandomSpawnInterval(extraLifeSettings);
  updateScoreDisplay(score);
  updateLivesDisplay(lives);
  hideGameOverScreen();
  hidePowerUpIndicator();
  lastAsteroidHitTime = 0;
  combo = 1;
  nearMisses = 0;
  spawnInitialAsteroids(5);
  initializeStars();
}

function startGame() {
  hideTitleScreen();
  showGameUI();
  gameStarted = true;
  playerName = playerNameInput.value || "Player";
  init();
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId); // Cancel previous animation frame
  }
  draw();
}

function initializeStars() {
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    });
  }
}

function drawStars() {
  stars.forEach((star) => {
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawInfoGraphics() {
  const x = canvasWidth - 110;
  let y = 30;
  const iconSize = 10 * baseScale;
  const textOffset = 15 * baseScale;

  // Extra Life Icon
  ctx.fillStyle = extraLifeSettings.color;
  ctx.beginPath();
  ctx.arc(x, y, extraLifeSettings.radius / 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - extraLifeSettings.radius / 3, y);
  ctx.lineTo(x + extraLifeSettings.radius / 3, y);
  ctx.moveTo(x, y - extraLifeSettings.radius / 3);
  ctx.lineTo(x, y + extraLifeSettings.radius / 3);
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.font = `bold ${iconSize}px monospace`;
  ctx.textAlign = "left";
  ctx.fillText("Extra Life", x + textOffset, y + iconSize / 3);
  y += 30;

  // Power-up Icons
  POWER_UP_TYPES.forEach((powerUp, index) => {
    ctx.fillStyle = powerUp.color;
    ctx.beginPath();
    ctx.arc(x, y, powerUpSettings.radius / 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.font = `bold ${iconSize}px monospace`;
    ctx.textAlign = "center";
    ctx.fillText(
      powerUp.name.substring(0, 1),
      x,
      y + iconSize / 3
    );
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(powerUp.name, x + textOffset, y + iconSize / 3);
    y += 30;
  });
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  drawStars();

  if (gameStarted && !gameOver && !gamePaused) {
    updatePlayer();
    updateAsteroids();
    updateProjectiles();
    updatePowerUps();
    updateExtraLives();
    updateImpactFlashes();
    updateAsteroidFragments();
    checkCollisions();
    drawPlayer(activePowerUp, shieldRadius);
    drawAsteroids();
    drawProjectiles();
    drawPowerUps();
    drawExtraLives();
    drawImpactFlashes();
    drawAsteroidFragments();
    drawInfoGraphics();
  }
  animationFrameId = requestAnimationFrame(draw); // Store the animation frame ID
}

function resetGame() {
  showTitleScreen();
  gameStarted = false;
  hideGameUI();
  hideGameOverScreen();
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId); // Cancel animation frame on reset
  }
}

function hyperspace() {
  if (isHyperspaceAvailable && gameStarted && !gameOver) {
    player.x = Math.random() * canvasWidth;
    player.y = Math.random() * canvasHeight;
    player.velocity_x = 0;
    player.velocity_y = 0;
    player.is_invulnerable = true;
    player.invulnerable_timer = playerSettings.invulnerable_duration * 2;
    isHyperspaceAvailable = false;
    setTimeout(() => {
      isHyperspaceAvailable = true;
    }, 3000);
  }
}

function updateLeaderboard() {
  gameScores.push({ name: playerName, score: score });
  gameScores.sort((a, b) => b.score - a.score);
  gameScores = gameScores.slice(0, 5);
  localStorage.setItem("gameScores", JSON.stringify(gameScores));
}

function displayLeaderboard() {
  updateLeaderboardDisplay(gameScores);
}

function loadScores() {
  const storedScores = localStorage.getItem("gameScores");
  if (storedScores) {
    gameScores = JSON.parse(storedScores);
  }
}

loadScores();

document.addEventListener("keydown", (e) => {
  keyState[e.code] = true;
  if (gameStarted && e.code === "Space" && !gameOver && !gamePaused) {
    createProjectile(player);
  }
  if (gameStarted && e.code === "Shift" && !gamePaused) {
    hyperspace();
  }
  if (e.code === "KeyR" && gameOver) {
    resetGame();
  }
  if (e.code === "KeyP" && gameStarted && !gameOver) {
    gamePaused = !gamePaused;
    if (gamePaused) {
      showPauseMenu();
    } else {
      hidePauseMenu();
    }
  }
  if (e.code === "Enter" && !gameStarted && titleScreen.style.display === "flex") {
    startGame();
  }
});

document.addEventListener("keyup", (e) => {
  keyState[e.code] = false;
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", resetGame);

drawTitleScreenBackground(drawStars);
