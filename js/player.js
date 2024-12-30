const playerSettings = {
  x: canvasWidth / 2,
  y: canvasHeight / 2,
  angle: 0,
  velocity_x: 0,
  velocity_y: 0,
  rotation_speed: 0.1,
  acceleration: 0.15 * baseScale,
  friction: 0.985,
  max_speed: 5 * baseScale,
  base_radius: 10 * baseScale,
  front_offset: 18 * baseScale,
  front_width: 3 * baseScale,
  radius: 10 * baseScale,
  is_invulnerable: false,
  invulnerable_timer: 0,
  invulnerable_duration: 200,
  engine_glow_timer: 0,
};

let player;
const trailLength = 30;
let shipTrail = [];

function createPlayer() {
  player = { ...playerSettings };
  shipTrail = [];
}

function updatePlayer() {
  if (keyState["ArrowLeft"] || keyState["KeyA"]) {
    player.angle -= playerSettings.rotation_speed;
  }
  if (keyState["ArrowRight"] || keyState["KeyD"]) {
    player.angle += playerSettings.rotation_speed;
  }
  if (keyState["ArrowUp"] || keyState["KeyW"]) {
    player.velocity_x += Math.cos(player.angle) * playerSettings.acceleration;
    player.velocity_y += Math.sin(player.angle) * playerSettings.acceleration;
    player.engine_glow_timer = 5;
    // Throttle the sound to prevent rapid firing
    if (performance.now() % 5 < 1) {
      playSound("thrust");
    }
  }

  const currentSpeed = Math.sqrt(
    player.velocity_x ** 2 + player.velocity_y ** 2
  );
  if (currentSpeed > playerSettings.max_speed) {
    const ratio = playerSettings.max_speed / currentSpeed;
    player.velocity_x *= ratio;
    player.velocity_y *= ratio;
  }

  player.velocity_x *= playerSettings.friction;
  player.velocity_y *= playerSettings.friction;
  player.x += player.velocity_x;
  player.y += player.velocity_y;

  if (player.x < 0 - playerSettings.front_offset)
    player.x = canvasWidth + playerSettings.front_offset;
  if (player.x > canvasWidth + playerSettings.front_offset)
    player.x = 0 - playerSettings.front_offset;
  if (player.y < 0 - playerSettings.front_offset)
    player.y = canvasHeight + playerSettings.front_offset;
  if (player.y > canvasHeight + playerSettings.front_offset)
    player.y = 0 - playerSettings.front_offset;

  if (player.is_invulnerable) {
    player.invulnerable_timer--;
    if (player.invulnerable_timer <= 0) {
      player.is_invulnerable = false;
    }
  }
  if (activePowerUp && activePowerUp.name === "Ghost Ship") {
    player.is_ghost = true;
  } else {
    player.is_ghost = false;
  }

  shipTrail.push({ x: player.x, y: player.y });
  if (shipTrail.length > trailLength) {
    shipTrail.shift();
  }

  if (player.engine_glow_timer > 0) {
    player.engine_glow_timer--;
  }
}

function drawPlayer(activePowerUp, shieldRadius) {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);

  // Draw the player as a triangle
  ctx.beginPath();
  ctx.moveTo(playerSettings.front_offset, 0); // Front point
  ctx.lineTo(-playerSettings.front_offset / 2, playerSettings.front_offset / 2); // Bottom left
  ctx.lineTo(-playerSettings.front_offset / 2, -playerSettings.front_offset / 2); // Bottom right
  ctx.closePath();
  if (player.is_ghost) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; // Semi-transparent white
  } else {
    ctx.strokeStyle = "white";
  }
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();

  if (activePowerUp && activePowerUp.name === "Shield") {
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.x, player.y, shieldRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (player.is_invulnerable && Math.floor(performance.now() / 100) % 2 === 0) {
    // Optional: visual feedback for invulnerability
  }

  drawShipTrail();
}

function drawShipTrail() {
  ctx.lineWidth = 2;
  for (let i = 0; i < shipTrail.length; i++) {
    let transparency = (i + 1) / shipTrail.length;
    ctx.strokeStyle = `rgba(255, 0, 0, ${transparency})`;

    if (i > 0) {
      ctx.beginPath();
      ctx.moveTo(shipTrail[i - 1].x, shipTrail[i - 1].y);
      ctx.lineTo(shipTrail[i].x, shipTrail[i].y);
      ctx.stroke();
    }
  }
}
