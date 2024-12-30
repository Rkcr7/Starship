let score = 0;
let lives = 3;
let lastAsteroidHitTime = 0;
let combo = 1;
let nearMisses = 0;
let shieldRadius = 25 * Math.min(canvasWidth / 800, canvasHeight / 600);

function checkCollisions() {
  if (!player.is_invulnerable) {
    for (let i = 0; i < asteroids.length; i++) {
      const dx = player.x - asteroids[i].x;
      const dy = player.y - asteroids[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (
        distance < playerSettings.radius + asteroids[i].radius &&
        !(activePowerUp && activePowerUp.name === "Shield")
      ) {
        lives--;
        updateLivesDisplay(lives);
        player.x = canvasWidth / 2;
        player.y = canvasHeight / 2;
        player.velocity_x = 0;
        player.velocity_y = 0;
        player.is_invulnerable = true;
        player.invulnerable_timer = playerSettings.invulnerable_duration;
        shipTrail = [];
        createImpactFlash(player.x, player.y);
        playSound("playerHit");

        if (lives <= 0) {
          gameOver = true;
          showGameOverScreen(score, nearMisses);
          updateLeaderboard();
          displayLeaderboard();
        }
        break;
      } else if (
        distance < playerSettings.radius + asteroids[i].radius + 30 &&
        !asteroids[i].nearMissAwarded
      ) {
        nearMisses++;
        displayFloatingText("Near Miss!", player.x, player.y - 40);
        asteroids[i].nearMissAwarded = true; // Set the flag for this specific asteroid
      } else if (distance > playerSettings.radius + asteroids[i].radius + 50) {
        // Add this condition**
        asteroids[i].nearMissAwarded = false; // Reset the flag when far enough
      }
    }
  }

  for (let i = projectiles.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
      const dx = projectiles[i].x - asteroids[j].x;
      const dy = projectiles[i].y - asteroids[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < projectiles[i].radius + asteroids[j].radius) {
        let points =
          asteroids[j].size_type === 0
            ? 20
            : asteroids[j].size_type === 1
            ? 50
            : 100;
        const now = performance.now();
        if (now - lastAsteroidHitTime < 1000) {
          combo++;
        } else {
          combo = 1;
        }
        lastAsteroidHitTime = now;
        points *= combo;
        score += points;
        updateScoreDisplay(score);
        createImpactFlash(
          projectiles[i].x,
          projectiles[i].y,
          asteroids[j].lastHitTime
        );
        asteroids[j].lastHitTime = now;
        createAsteroidFragments(asteroids[j]);
        playSound("asteroidBreak");
        if (combo > 1) {
          showComboText(combo);
          displayFloatingText(
            `+${points}`,
            asteroids[j].x,
            asteroids[j].y - asteroids[j].radius - 10
          );
        } else {
          displayFloatingText(
            `+${points}`,
            asteroids[j].x,
            asteroids[j].y - asteroids[j].radius - 10
          );
        }

        if (asteroids[j].isSplitter && asteroids[j].size_type < 2) {
          const newSizeIndex = asteroids[j].size_type + 1;
          for (let k = 0; k < 3; k++) {
            spawnAsteroid(newSizeIndex, asteroids[j]);
          }
        } else if (asteroids[j].size_type < 2) {
          const newSizeIndex = asteroids[j].size_type + 1;
          for (let k = 0; k < 2 + Math.floor(Math.random() * 2); k++) {
            spawnAsteroid(newSizeIndex, asteroids[j]);
          }
        }
        asteroids.splice(j, 1);
        if (!projectiles[i].piercing) {
          projectiles.splice(i, 1);
          break;
        }
      }
    }
  }

  for (let i = powerUps.length - 1; i >= 0; i--) {
    const dx = player.x - powerUps[i].x;
    const dy = player.y - powerUps[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < playerSettings.radius + powerUpSettings.radius) {
      activePowerUp = powerUps[i].type;
      powerUpStartTime = performance.now();
      showPowerUpIndicator(
        activePowerUp.name,
        activePowerUp.color,
        powerUpSettings.duration
      );
      playSound("powerUp");
      powerUps.splice(i, 1);
    }
  }

  for (let i = extraLives.length - 1; i >= 0; i--) {
    const dx = player.x - extraLives[i].x;
    const dy = player.y - extraLives[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < playerSettings.radius + extraLives[i].radius) {
      lives++;
      updateLivesDisplay(lives);
      playSound("powerUp"); // Using power up sound for extra life pickup
      extraLives.splice(i, 1);
    }
  }

  if (activePowerUp && activePowerUp.name === "Shield") {
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const dx = player.x - asteroids[i].x;
      const dy = player.y - asteroids[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < shieldRadius + asteroids[i].radius) {
        score +=
          asteroids[i].size_type === 0
            ? 20
            : asteroids[i].size_type === 1
            ? 50
            : 100;
        updateScoreDisplay(score);
        createImpactFlash(
          asteroids[i].x,
          asteroids[i].y,
          asteroids[i].lastHitTime
        );
        createAsteroidFragments(asteroids[i]);
        playSound("asteroidBreak");
        asteroids.splice(i, 1);
      }
    }
  }

  if (asteroids.length === 0 && !gameOver) {
    spawnInitialAsteroids(Math.min(10, 5 + Math.floor(score / 500)));
  }
}

function createImpactFlash(x, y, lastHit) {
  let color = "rgba(255, 255, 0, 0.8)"; // Default yellow
  const now = performance.now();
  if (lastHit) {
    const timeDiff = now - lastHit;
    if (timeDiff < 100) {
      color = "rgba(255, 200, 0, 0.8)"; // Slightly orange
    } else if (timeDiff < 200) {
      color = "rgba(255, 150, 0, 0.8)"; // More orange
    }
  }
  impactFlashes.push({
    x: x,
    y: y,
    radius: 10,
    lifespan: 10,
    color: color,
  });
}

function updateImpactFlashes() {
  for (let i = impactFlashes.length - 1; i >= 0; i--) {
    impactFlashes[i].lifespan--;
    impactFlashes[i].radius += 1;
    if (impactFlashes[i].lifespan <= 0) {
      impactFlashes.splice(i, 1);
    }
  }
}

function createAsteroidFragments(asteroid) {
  const numFragments = 5 + Math.floor(Math.random() * 5);
  for (let i = 0; i < numFragments; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 3;
    asteroidFragments.push({
      x: asteroid.x,
      y: asteroid.y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      radius: 1 + Math.random() * 3,
      lifespan: 30 + Math.floor(Math.random() * 20),
      color: asteroid.colorVariation,
    });
  }
}

function updateAsteroidFragments() {
  for (let i = asteroidFragments.length - 1; i >= 0; i--) {
    asteroidFragments[i].x += asteroidFragments[i].velocityX;
    asteroidFragments[i].y += asteroidFragments[i].velocityY;
    asteroidFragments[i].lifespan--;
    if (asteroidFragments[i].lifespan <= 0) {
      asteroidFragments.splice(i, 1);
    }
  }
}

function drawImpactFlashes() {
  impactFlashes.forEach((flash) => {
    ctx.fillStyle = flash.color;
    ctx.beginPath();
    ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawAsteroidFragments() {
  asteroidFragments.forEach((fragment) => {
    ctx.fillStyle = fragment.color;
    ctx.beginPath();
    ctx.arc(fragment.x, fragment.y, fragment.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}
