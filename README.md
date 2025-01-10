# 🚀 StarShip

A modern take on the classic Asteroids arcade game, developed using HTML5 Canvas and JavaScript with the help of Cursor AI IDE.

🎮 **[Play Now](https://starship-cr7.netlify.app)**

![Favicon](public/favicon.ico)

## 🎮 Game Features

- Classic arcade-style gameplay with modern graphics
- Smooth ship controls and physics
- Score tracking and lives system
- Local leaderboard
- Power-up system
- Combo system
- Sound effects with mute option
- Pause functionality

## 🕹️ Controls

- **←** or **A**: Rotate ship left
- **→** or **D**: Rotate ship right
- **↑** or **W**: Thrust forward
- **Spacebar**: Fire weapon
- **P**: Pause/Resume game
- **M**: Toggle sound

## ⚡ Power-Ups

The game features various power-ups that spawn randomly:

1. **Piercing Shot** (Orange) - Bullets pass through asteroids
2. **Shield** (Green) - Temporary invulnerability
3. **Big Shot** (Yellow) - Larger, more powerful bullets
4. **Ghost Ship** (Purple) - Pass through asteroids without damage
5. **Scatter Shot** (Cyan) - Multi-directional shooting

Power-ups last for 15 seconds when collected.

## 🎯 Gameplay Features

- **Near Miss System**: Score bonus for close encounters with asteroids
- **Combo System**: Chain asteroid destructions for bonus points
- **Lives System**: Start with 3 lives, collect extra lives during gameplay
- **Progressive Difficulty**: Game becomes more challenging as your score increases

## 🛠️ Technical Details

The game is built using:
- HTML5 Canvas for rendering
- Vanilla JavaScript for game logic
- CSS for styling
- Custom sound effects and audio system

## 🎨 File Structure

```
Asteroid-Attack/
├── css/
│   └── styles.css
├── js/
│   ├── asteroid.js
│   ├── audio.js
│   ├── collision.js
│   ├── extra_life.js
│   ├── game.js
│   ├── player.js
│   ├── powerup.js
│   ├── projectile.js
│   ├── ui.js
│   └── utils.js
├── public/
│   └── favicon.ico
└── index.html
```

## 🎮 How to Play

1. Open `index.html` in a modern web browser
2. Enter your name
3. Click "Start" to begin
4. Use the controls to navigate and shoot asteroids
5. Collect power-ups to enhance your abilities
6. Try to achieve the highest score possible!

## 🏆 Scoring System

- Small Asteroid Destruction: 100 points
- Medium Asteroid Destruction: 50 points
- Large Asteroid Destruction: 20 points
- Near Miss: 10 points
- Combo Multiplier: Increases with consecutive hits

Created with ❤️ using Cursor AI IDE
