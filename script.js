// script.js - Simplified version with emoji graphics
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game state
let score = 0;
let items = [];
let effects = [];
let gameActive = false;
let animationId;
const targetScore = 30;

// Player properties
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 50,
  speed: 5
};

// Item types
const itemTypes = {
  heart: {
    emoji: "❤️",
    points: 1,
    size: 30,
    color: "#e50914"
  },
  popcorn: {
    emoji: "🍿",
    points: 2,
    size: 35,
    color: "#f5f5f1"
  },
  ticket: {
    emoji: "🎟️",
    points: 3,
    size: 40,
    color: "#d4af37"
  }
};

// Messages
const collectMessages = [
  "Harshilicious!",
  "Harshiboo!",
  "My Love!",
  "Sweetheart!",
  "Movie Time!",
  "Date Night!",
  "Our Show!",
  "Netflix & Chill!"
];

// Initialize game
function init() {
  window.addEventListener("resize", handleResize);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
}

// Start game
function startGame() {
  document.getElementById("start-screen").style.opacity = 0;
  setTimeout(() => {
    document.getElementById("start-screen").style.display = "none";
    canvas.style.display = "block";
    gameActive = true;
    resetGame();
    gameLoop();
  }, 500);
}

// Reset game state
function resetGame() {
  score = 0;
  items = [];
  effects = [];
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  
  // Create initial items
  for (let i = 0; i < 20; i++) {
    spawnItem();
  }
}

// Spawn new item
function spawnItem() {
  if (!gameActive) return;
  
  const types = Object.keys(itemTypes);
  const type = types[Math.floor(Math.random() * types.length)];
  const itemSize = itemTypes[type].size;
  
  items.push({
    x: Math.random() * (canvas.width - itemSize * 2) + itemSize,
    y: Math.random() * (canvas.height * 0.7 - itemSize * 2) + itemSize, // Keep above seats
    type: type,
    size: itemSize,
    rotation: Math.random() * Math.PI * 2,
    collected: false
  });
}

// Draw theater background
function drawBackground() {
  // Theater floor
  ctx.fillStyle = "#221f1f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Screen area
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.2);
  
  // Screen content
  ctx.fillStyle = "#e50914";
  ctx.font = "30px 'Bebas Neue', cursive";
  ctx.textAlign = "center";
  ctx.fillText("NOW PLAYING: OUR LOVE STORY", canvas.width/2, canvas.height * 0.15);
  
  // Seats area
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height * 0.2);
  
  // Draw simple seat markers
  ctx.fillStyle = "#333";
  for (let y = canvas.height * 0.82; y < canvas.height * 0.98; y += 20) {
    for (let x = 50; x < canvas.width - 50; x += 60) {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Draw player character
function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);
  
  // Draw shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath();
  ctx.arc(0, 10, player.size/2, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw player (simple girl emoji)
  ctx.font = `${player.size}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("👧", 0, 0);
  
  ctx.restore();
}

// Draw items
function drawItems() {
  items.forEach(item => {
    if (!item.collected) {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);
      
      // Draw item emoji
      ctx.font = `${item.size}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(itemTypes[item.type].emoji, 0, 0);
      
      ctx.restore();
    }
  });
}

// Rest of the code remains the same as previous version...
// (drawEffects, drawScore, checkCollisions, gameLoop, etc.)
