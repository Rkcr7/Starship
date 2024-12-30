function getRandomSpawnInterval(settings) {
  return (
    settings.spawnIntervalMin * 1000 +
    Math.random() *
      (settings.spawnIntervalMax - settings.spawnIntervalMin) *
      1000
  );
}

function generateAsteroidShape(radius) {
  const vertices = 8 + Math.floor(Math.random() * 5);
  const shape = [];
  for (let i = 0; i < vertices; i++) {
    const angle = ((Math.PI * 2) / vertices) * i;
    const variation = 0.7 + Math.random() * 0.6;
    const x = Math.cos(angle) * radius * variation;
    const y = Math.sin(angle) * radius * variation;
    shape.push({ x, y });
  }
  return shape;
}

function displayFloatingText(text, x, y) {
  const floatingText = document.createElement("div");
  floatingText.className = "floating-text";
  floatingText.textContent = text;
  floatingText.style.left = `${x}px`;
  floatingText.style.top = `${y}px`;
  document.body.appendChild(floatingText);
  setTimeout(() => {
    floatingText.remove();
  }, 1000);
}
