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

// Theater assets
const theaterBackground = new Image();
theaterBackground.src = 'https://assets.codepen.io/3364143/theater-floor.jpg';

const playerSprite = new Image();
playerSprite.src = 'https://assets.codepen.io/3364143/girl-topdown.png';

// Player properties
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 60,
  height: 80,
  speed: 5,
  frame: 0,
  frameCount: 4,
  animationSpeed: 0.2
};

// Item types
const itemTypes = {
  heart: {
    color: "#e50914",
    points: 1,
    emoji: "❤️",
    size: 30,
    image: new Image()
  },
  popcorn: {
    color: "#f5f5f1",
    points: 2,
    emoji: "🍿",
    size: 35,
    image: new Image()
  },
  ticket: {
    color: "#d4af37",
    points: 3,
    emoji: "🎟️",
    size: 40,
    image: new Image()
  }
};

// Load item images
itemTypes.heart.image.src = 'https://assets.codepen.io/3364143/heart-item.png';
itemTypes.popcorn.image.src = 'https://assets.codepen.io/3364143/popcorn-item.png';
itemTypes.ticket.image.src = 'https://assets.codepen.io/3364143/ticket-item.png';

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
  
  // Preload images
  const preloadImages = [theaterBackground, playerSprite, 
                        itemTypes.heart.image, 
                        itemTypes.popcorn.image, 
                        itemTypes.ticket.image];
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
  
  // Create initial items scattered around
  for (let i = 0; i < 20; i++) {
    spawnItem();
  }
}

// Spawn new item at random position
function spawnItem() {
  if (!gameActive) return;
  
  const types = ["heart", "popcorn", "ticket"];
  const weights = [0.5, 0.3, 0.2]; // 50% hearts, 30% popcorn, 20% tickets
  const rand = Math.random();
  let type;
  
  if (rand < weights[0]) type = types[0];
  else if (rand < weights[0] + weights[1]) type = types[1];
  else type = types[2];
  
  const itemSize = itemTypes[type].size;
  
  items.push({
    x: Math.random() * (canvas.width - itemSize * 2) + itemSize,
    y: Math.random() * (canvas.height - itemSize * 2) + itemSize,
    type: type,
    size: itemSize,
    rotation: Math.random() * Math.PI * 2,
    collected: false
  });
}

// Draw theater background
function drawBackground() {
  ctx.save();
  ctx.drawImage(theaterBackground, 0, 0, canvas.width, canvas.height);
  
  // Draw theater screen at top
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.2);
  
  // Draw screen glow
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.2);
  gradient.addColorStop(0, "#6a0dad");
  gradient.addColorStop(1, "#221f1f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.2);
  
  // Draw screen content
  ctx.fillStyle = "#e50914";
  ctx.font = "30px 'Bebas Neue', cursive";
  ctx.textAlign = "center";
  ctx.fillText("NOW PLAYING: OUR LOVE STORY", canvas.width/2, canvas.height * 0.15);
  
  // Draw seats at bottom
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height * 0.2);
  
  // Draw seat rows
  ctx.fillStyle = "#333";
  for (let y = canvas.height * 0.82; y < canvas.height * 0.98; y += 20) {
    for (let x = 50; x < canvas.width - 50; x += 60) {
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  ctx.restore();
}

// Draw player character
function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);
  
  // Draw shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath();
  ctx.ellipse(0, player.height/2 + 5, player.width/2, player.width/6, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw player sprite
  ctx.drawImage(
    playerSprite,
    Math.floor(player.frame) * 64, 0, 64, 80,
    -player.width/2, -player.height/2, player.width, player.height
  );
  
  ctx.restore();
  
  // Update animation frame
  if (keys["ArrowUp"] || keys["ArrowDown"] || keys["ArrowLeft"] || keys["ArrowRight"] ||
      keys["w"] || keys["a"] || keys["s"] || keys["d"]) {
    player.frame = (player.frame + player.animationSpeed) % player.frameCount;
  } else {
    player.frame = 0; // Reset to standing frame when not moving
  }
}

// Draw items
function drawItems() {
  items.forEach(item => {
    if (!item.collected) {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);
      
      // Draw item image
      ctx.drawImage(
        itemTypes[item.type].image,
        -item.size/2, -item.size/2, item.size, item.size
      );
      
      // Add subtle glow
      ctx.shadowColor = itemTypes[item.type].color;
      ctx.shadowBlur = 10;
      ctx.drawImage(
        itemTypes[item.type].image,
        -item.size/2, -item.size/2, item.size, item.size
      );
      ctx.shadowBlur = 0;
      
      ctx.restore();
    }
  });
}

// Draw effects
function drawEffects() {
  effects.forEach((effect, index) => {
    ctx.save();
    ctx.font = "24px 'Bebas Neue', cursive";
    ctx.fillStyle = effect.color;
    ctx.globalAlpha = effect.opacity;
    ctx.textAlign = "center";
    ctx.fillText(effect.text, effect.x, effect.y);
    ctx.restore();
    
    effect.y -= 2;
    effect.opacity -= 0.01;
    
    if (effect.opacity <= 0) {
      effects.splice(index, 1);
    }
  });
}

// Draw score
function drawScore() {
  ctx.save();
  ctx.font = "28px 'Bebas Neue', cursive";
  ctx.fillStyle = "#f5f5f1";
  ctx.textAlign = "left";
  ctx.fillText(`SCORE: ${score}/${targetScore}`, 20, 40);
  
  // Draw progress bar
  ctx.fillStyle = "rgba(34, 31, 31, 0.7)";
  ctx.fillRect(20, 50, 200, 10);
  ctx.fillStyle = "#e50914";
  ctx.fillRect(20, 50, 200 * (score/targetScore), 10);
  
  ctx.restore();
}

// Check collisions
function checkCollisions() {
  items.forEach(item => {
    if (!item.collected) {
      // Check collision with player
      const dx = player.x - item.x;
      const dy = player.y - item.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < (player.width/2 + item.size/2)) {
        // Mark as collected
        item.collected = true;
        
        // Add score
        score += itemTypes[item.type].points;
        
        // Create effect
        if (item.type === "heart") {
          const message = collectMessages[Math.floor(Math.random() * collectMessages.length)];
          effects.push({
            text: message + " " + itemTypes[item.type].emoji,
            x: item.x,
            y: item.y,
            color: itemTypes[item.type].color,
            opacity: 1
          });
        } else {
          effects.push({
            text: "+" + itemTypes[item.type].points + " " + itemTypes[item.type].emoji,
            x: item.x,
            y: item.y,
            color: itemTypes[item.type].color,
            opacity: 1
          });
        }
        
        // Spawn new item to replace this one
        setTimeout(() => {
          spawnItem();
        }, 1000);
      }
    }
  });
}

// Game loop
function gameLoop() {
  if (!gameActive) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw everything
  drawBackground();
  drawItems();
  drawPlayer();
  drawEffects();
  drawScore();
  
  // Update game state
  checkCollisions();
  movePlayer();
  
  // Check win condition
  if (score >= targetScore) {
    endGame();
    return;
  }
  
  animationId = requestAnimationFrame(gameLoop);
}

// End game
function endGame() {
  gameActive = false;
  cancelAnimationFrame(animationId);
  
  canvas.style.opacity = 0;
  setTimeout(() => {
    canvas.style.display = "none";
    const endScreen = document.getElementById("end-screen");
    endScreen.style.display = "flex";
    setTimeout(() => {
      endScreen.style.opacity = 1;
      createConfetti();
    }, 100);
  }, 500);
}

// Create confetti effect
function createConfetti() {
  const colors = ['#e50914', '#d4af37', '#f5f5f1', '#6a0dad'];
  const container = document.getElementById('confetti');
  container.innerHTML = '';
  
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = (5 + Math.random() * 10) + 'px';
    confetti.style.height = (5 + Math.random() * 10) + 'px';
    confetti.style.animationDelay = Math.random() * 5 + 's';
    confetti.style.animationDuration = (3 + Math.random() * 4) + 's';
    container.appendChild(confetti);
  }
}

// Restart game
function restartGame() {
  document.getElementById("end-screen").style.opacity = 0;
  setTimeout(() => {
    document.getElementById("end-screen").style.display = "none";
    startGame();
  }, 500);
}

// Handle keyboard input
let keys = {};
function handleKeyDown(e) {
  keys[e.key] = true;
}

function handleKeyUp(e) {
  keys[e.key] = false;
}

// Move player based on keyboard input
function movePlayer() {
  if (keys["ArrowUp"] || keys["w"] || keys["W"]) {
    player.y = Math.max(player.height/2, player.y - player.speed);
  }
  if (keys["ArrowDown"] || keys["s"] || keys["S"]) {
    player.y = Math.min(canvas.height * 0.8 - player.height/2, player.y + player.speed);
  }
  if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
    player.x = Math.max(player.width/2, player.x - player.speed);
  }
  if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
    player.x = Math.min(canvas.width - player.width/2, player.x + player.speed);
  }
}

// Handle window resize
function handleResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
}

// Initialize game when loaded
window.onload = init;
