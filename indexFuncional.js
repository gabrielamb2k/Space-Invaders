const createCanvas = (width, height) => {
  const canvas = document.getElementById("game");
  canvas.width = width;
  canvas.height = height;
  return { canvas, ctx: canvas.getContext("2d") };
};

const loadImage = (src) => {
  const img = new Image();
  img.src = src;
  return img;
};

// Função para desenhar o fundo
const drawBackground = (ctx, image, width, height) => {
  ctx.drawImage(image, 0, 0, width, height);
};


const { canvas, ctx } = createCanvas(600, 600);
const background = loadImage("images/space.png");


// Estado inicial do jogo
let gameState = {
  player: { x: 275, y: 550, lives: 3 },
  bullets: [],
  enemies: generateEnemies(),
  enemyBullets: [],
  isGameOver: false,
  didWin: false,
};



// Função para desenhar o jogador
const drawPlayer = (player) => {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, 50, 50);
};

// Função para desenhar balas
const drawBullets = (bullets, color) => {
  ctx.fillStyle = color;
  bullets.forEach((b) => ctx.fillRect(b.x, b.y, 5, 10));
};

// Função para desenhar inimigos
const drawEnemies = (enemies) => {
  ctx.fillStyle = "green";
  enemies.forEach((e) => ctx.fillRect(e.x, e.y, 40, 40));
};

// Atualiza a posição dos projéteis
const updateBullets = (bullets, speed) =>
  bullets.map((b) => ({ ...b, y: b.y + speed })).filter((b) => b.y > 0);

// Verifica colisão (simplificada)
const checkCollision = (obj1, obj2) =>
  obj1.x < obj2.x + 40 &&
  obj1.x + 40 > obj2.x &&
  obj1.y < obj2.y + 40 &&
  obj1.y + 40 > obj2.y;

// Verifica se o jogo terminou
const checkGameOver = (state) => {
  if (state.isGameOver) return state;

  const playerHit =
    state.enemyBullets.some((b) => checkCollision(b, state.player)) ||
    state.enemies.some((e) => checkCollision(e, state.player));

  return {
    ...state,
    isGameOver: playerHit || state.enemies.length === 0,
    didWin: state.enemies.length === 0,
  };
};

// Atualiza o estado do jogo
const updateGameState = (state) => {
  if (state.isGameOver) return state;

  return checkGameOver({
    ...state,
    bullets: updateBullets(state.bullets, -5),
    enemyBullets: updateBullets(state.enemyBullets, 2),
    enemies: state.enemies.filter(
      (e) => !state.bullets.some((b) => checkCollision(b, e))
    ),
  });
};

// Renderiza a tela
const render = (state) => {
  drawBackground();
  drawPlayer(state.player);
  drawBullets(state.bullets, "red");
  drawBullets(state.enemyBullets, "white");
  drawEnemies(state.enemies);

  if (state.isGameOver) {
    ctx.fillStyle = "white";
    ctx.font = "70px Arial";
    ctx.fillText(
      state.didWin ? "You Win" : "Game Over",
      canvas.width / 4,
      canvas.height / 2
    );
  }
};

// Loop do jogo
const gameLoop = () => {
  gameState = updateGameState(gameState);
  render(gameState);
  requestAnimationFrame(gameLoop);
};

gameLoop();
