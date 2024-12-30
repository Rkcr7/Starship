let audioContext; // Initialize audio context lazily

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playSound(type) {
  const audioCtx = getAudioContext();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  gainNode.connect(audioCtx.destination);
  oscillator.connect(gainNode);

  let frequency,
    typeOscillator,
    duration,
    volume = 0.2;

  switch (type) {
    case "thrust":
      frequency = 150 + Math.random() * 50;
      typeOscillator = "sine";
      duration = 0.1; // Short duration, will be called repeatedly
      gainNode.gain.setValueAtTime(volume * 0.3, audioCtx.currentTime); // Lower volume for thrust
      break;
    case "fire":
      frequency = 800 + Math.random() * 300; // Increase frequency for a higher pitch "phish" sound
      typeOscillator = "sine"; // Sine wave can create a cleaner, higher-pitched tone
      duration = 0.1; // Shorten the duration for a quick "phish"
      gainNode.gain.setValueAtTime(volume * 0.05, audioCtx.currentTime); // Significantly reduce the volume
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration
      );
      break;
    case "asteroidBreak":
      frequency = 200 - Math.random() * 80;
      typeOscillator = "triangle";
      duration = 0.3;
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration
      );
      break;
    case "playerHit":
      frequency = 100;
      typeOscillator = "sawtooth";
      duration = 0.5;
      gainNode.gain.setValueAtTime(volume * 0.8, audioCtx.currentTime); // Louder for impact
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration
      );
      break;
    case "powerUp":
      frequency = 300 + Math.random() * 200;
      typeOscillator = "sine";
      duration = 0.4;
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration
      );
      break;
  }

  oscillator.type = typeOscillator;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); // value in hertz
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}
