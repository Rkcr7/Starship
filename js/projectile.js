const projectileSettings = {
  speed: 7 * baseScale,
  radius: 2 * baseScale,
  lifespan: 60,
  trailLength: 10,
};

let projectiles = [];

function createProjectile(player) {
  const angle = player.angle;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  let speed = projectileSettings.speed;
  let radius = projectileSettings.radius;
  let piercing = false;

  if (activePowerUp && activePowerUp.name === "Piercing Shot") {
    piercing = true;
  }
  if (activePowerUp && activePowerUp.name === "Big Shot") {
    radius *= 10; // Increased to 5 times bigger
  }

  projectiles.push({
    x: player.x + cos * playerSettings.front_offset,
    y: player.y + sin * playerSettings.front_offset,
    velocity_x: player.velocity_x + cos * speed,
    velocity_y: player.velocity_y + sin * speed,
    lifespan: projectileSettings.lifespan,
    radius: radius,
    trail: [],
    piercing: piercing,
  });
  playSound("fire");
}

function updateProjectiles() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].x += projectiles[i].velocity_x;
    projectiles[i].y += projectiles[i].velocity_y;
    projectiles[i].lifespan--;
    projectiles[i].trail.push({
      x: projectiles[i].x,
      y: projectiles[i].y,
    });
    if (projectiles[i].trail.length > projectileSettings.trailLength) {
      projectiles[i].trail.shift();
    }

    if (
      projectiles[i].x < 0 ||
      projectiles[i].x > canvasWidth ||
      projectiles[i].y < 0 ||
      projectiles[i].y > canvasHeight ||
      projectiles[i].lifespan <= 0
    ) {
      projectiles.splice(i, 1);
    }
  }
}

function drawProjectiles() {
  projectiles.forEach((projectile) => {
    let projectileColor = "lime"; // Default color
    if (activePowerUp) {
      projectileColor = activePowerUp.color; // Use power-up color
    }
    ctx.fillStyle = projectileColor;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(${
      projectileColor === "lime" ? "0, 255, 0" : projectileColor
    }, 0.5)`;
    ctx.lineWidth = 1;
    for (let i = 1; i < projectile.trail.length; i++) {
      ctx.beginPath();
      ctx.moveTo(projectile.trail[i - 1].x, projectile.trail[i - 1].y);
      ctx.lineTo(projectile.trail[i].x, projectile.trail[i].y);
      ctx.stroke();
    }
  });
}
