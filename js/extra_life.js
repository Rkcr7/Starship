const extraLifeSettings = {
  spawnIntervalMin: 30,
  spawnIntervalMax: 60,
  radius: 12 * baseScale,
  color: "gold",
  duration: 10, // Duration in seconds
};

let extraLives = [];
let nextExtraLifeSpawnTime = 0;

function spawnExtraLife() {
  const now = performance.now();
  if (now >= nextExtraLifeSpawnTime && extraLives.length === 0) {
    const x = Math.random() * canvasWidth * 0.8 + canvasWidth * 0.1;
    const y = Math.random() * canvasHeight * 0.8 + canvasHeight * 0.1;
    extraLives.push({
      x: x,
      y: y,
      radius: extraLifeSettings.radius,
      spawnTime: now, // Record the time of spawning
    });
    nextExtraLifeSpawnTime =
      performance.now() + getRandomSpawnInterval(extraLifeSettings);
  }
}

function updateExtraLives() {
  spawnExtraLife();
  const now = performance.now();
  for (let i = extraLives.length - 1; i >= 0; i--) {
    if (now - extraLives[i].spawnTime > extraLifeSettings.duration * 1000) {
      extraLives.splice(i, 1);
    }
  }
}

function drawExtraLives() {
  extraLives.forEach((extraLife) => {
    ctx.fillStyle = extraLifeSettings.color;
    ctx.beginPath();
    ctx.arc(extraLife.x, extraLife.y, extraLife.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(extraLife.x - extraLife.radius / 2, extraLife.y);
    ctx.lineTo(extraLife.x + extraLife.radius / 2, extraLife.y);
    ctx.moveTo(extraLife.x, extraLife.y - extraLife.radius / 2);
    ctx.lineTo(extraLife.x, extraLife.y + extraLife.radius / 2);
    ctx.stroke();
  });
}
