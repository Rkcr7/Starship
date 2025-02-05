// Statistics tracking system
const statistics = {
  currentSession: {
    shotsFired: 0,
    shotsHit: 0,
    asteroidsDestroyed: 0,
    powerUpsCollected: 0,
    timeAlive: 0,
    distanceTraveled: 0,
    nearMisses: 0,
  },
  allTime: {
    totalGames: 0,
    highScore: 0,
    totalPlayTime: 0,
    asteroidsDestroyed: 0,
    accuracy: 0,
  }
};

function updateSessionStats(type, value = 1) {
  if (type in statistics.currentSession) {
    statistics.currentSession[type] += value;
  }
}

function saveAllTimeStats() {
  const current = statistics.currentSession;
  const allTime = statistics.allTime;

  allTime.totalGames++;
  allTime.asteroidsDestroyed += current.asteroidsDestroyed;
  allTime.totalPlayTime += current.timeAlive;
  allTime.accuracy = (current.shotsHit / current.shotsFired) || 0;

  localStorage.setItem('gameStats', JSON.stringify(statistics.allTime));
}

function loadStats() {
  const saved = localStorage.getItem('gameStats');
  if (saved) {
    statistics.allTime = JSON.parse(saved);
  }
}

function resetSessionStats() {
  Object.keys(statistics.currentSession).forEach(key => {
    statistics.currentSession[key] = 0;
  });
}

export { statistics, updateSessionStats, saveAllTimeStats, loadStats, resetSessionStats };