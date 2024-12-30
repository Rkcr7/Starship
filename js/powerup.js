const powerUpSettings = {
  duration: 15,
  spawnIntervalMin: 20,
  spawnIntervalMax: 40,
  radius: 10 * baseScale,
  despawnDuration: 10,
};

const POWER_UP_TYPES = [
  { name: "Piercing Shot", color: "orange" },
  { name: "Shield", color: "green" },
  { name: "Big Shot", color: "yellow" },
];

let powerUps = [];
let activePowerUp = null;
let powerUpTimer = 0;
let powerUpStartTime = 0;
let nextPowerUpSpawnTime = 0;

function spawnPowerUp() {
  const now = performance.now();
  if (now >= nextPowerUpSpawnTime && !activePowerUp && powerUps.length === 0) {
    const x = Math.random() * canvasWidth;
    const y = Math.random() * canvasHeight;
    const type =
      POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
    powerUps.push({ x, y, type, spawnTime: now });
    nextPowerUpSpawnTime =
      performance.now() + getRandomSpawnInterval(powerUpSettings);
  }
}

function updatePowerUps() {
  if (activePowerUp) {
    const elapsedTime = performance.now() - powerUpStartTime;
    const remainingTime = Math.max(
      0,
      powerUpSettings.duration * 1000 - elapsedTime
    );
    powerUpTimer = Math.ceil(remainingTime / 1000);
    updatePowerUpTimerDisplay(powerUpTimer);

    if (remainingTime <= 0) {
      activePowerUp = null;
      hidePowerUpIndicator();
    }
  } else {
    spawnPowerUp();
  }

  const now = performance.now();
  for (let i = powerUps.length - 1; i >= 0; i--) {
    if (now - powerUps[i].spawnTime > powerUpSettings.despawnDuration * 1000) {
      powerUps.splice(i, 1);
    }
  }
}

function drawPowerUps() {
  powerUps.forEach((powerUp) => {
    ctx.fillStyle = powerUp.type.color;
    ctx.beginPath();
    ctx.arc(powerUp.x, powerUp.y, powerUpSettings.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.font = `bold ${10 * baseScale}px monospace`;
    ctx.textAlign = "center";
    ctx.fillText(
      powerUp.type.name.substring(0, 1),
      powerUp.x,
      powerUp.y + 4 * baseScale
    );
  });
}