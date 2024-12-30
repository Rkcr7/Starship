const asteroidSettings = {
  min_speed: 1 * baseScale,
  max_speed: 3 * baseScale,
  fast_multiplier: 1.5,
  splitter_probability: 0.2,
  sizes: [30 * baseScale, 20 * baseScale, 10 * baseScale],
};

let asteroids = [];

function spawnInitialAsteroids(count) {
  for (let i = 0; i < count; i++) {
    spawnAsteroid(0);
  }
}

function spawnAsteroid(sizeIndex, parentAsteroid) {
  const size = asteroidSettings.sizes[sizeIndex];
  let x, y, angle;
  let velocity_x, velocity_y;
  let isFast = false;
  let isSplitter = false;

  if (parentAsteroid) {
    x = parentAsteroid.x;
    y = parentAsteroid.y;
    angle = Math.random() * Math.PI * 2;
    const speed =
      asteroidSettings.min_speed +
      Math.random() * (asteroidSettings.max_speed - asteroidSettings.min_speed);
    velocity_x = parentAsteroid.velocity_x * 0.5 + Math.cos(angle) * speed;
    velocity_y = parentAsteroid.velocity_y * 0.5 + Math.sin(angle) * speed;
  } else {
    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) {
      x = Math.random() * canvasWidth;
      y = -size;
      angle = Math.random() * Math.PI;
    } else if (edge === 1) {
      x = canvasWidth + size;
      y = Math.random() * canvasHeight;
      angle = Math.random() * Math.PI + Math.PI / 2;
    } else if (edge === 2) {
      x = Math.random() * canvasWidth;
      y = canvasHeight + size;
      angle = Math.random() * Math.PI + Math.PI;
    } else {
      x = -size;
      y = Math.random() * canvasHeight;
      angle = Math.random() * Math.PI - Math.PI / 2;
    }
    const speed =
      asteroidSettings.min_speed +
      Math.random() * (asteroidSettings.max_speed - asteroidSettings.min_speed);
    velocity_x = Math.cos(angle) * speed;
    velocity_y = Math.sin(angle) * speed;
    if (Math.random() < 0.1) isFast = true;
    if (Math.random() < asteroidSettings.splitter_probability)
      isSplitter = true;
  }

  const speedMultiplier = isFast ? asteroidSettings.fast_multiplier : 1;
  const shape = generateAsteroidShape(size);

  asteroids.push({
    x,
    y,
    radius: size,
    velocity_x: velocity_x * speedMultiplier,
    velocity_y: velocity_y * speedMultiplier,
    size_type: sizeIndex,
    shape: shape,
    colorVariation: `rgba(128, 128, 128, ${0.8 + Math.random() * 0.2})`,
    isSplitter: isSplitter,
    nearMissAwarded: false,
    lastHitTime: 0,
  });
}

function updateAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].x += asteroids[i].velocity_x;
    asteroids[i].y += asteroids[i].velocity_y;

    const size = asteroids[i].radius;
    if (asteroids[i].x < 0 - size) asteroids[i].x = canvasWidth + size;
    if (asteroids[i].x > canvasWidth + size) asteroids[i].x = 0 - size;
    if (asteroids[i].y < 0 - size) asteroids[i].y = canvasHeight + size;
    if (asteroids[i].y > canvasHeight + size) asteroids[i].y = 0 - size;
  }
}

function drawAsteroids() {
  asteroids.forEach((asteroid) => {
    ctx.strokeStyle = asteroid.colorVariation;
    ctx.lineWidth = 2;
    ctx.beginPath();
    asteroid.shape.forEach((vertex, index) => {
      const x = asteroid.x + vertex.x;
      const y = asteroid.y + vertex.y;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevVertex = asteroid.shape[index - 1];
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.stroke();
  });
}
