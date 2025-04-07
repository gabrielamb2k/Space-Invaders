import { createEnemyController, checkCollision, drawEnemies } from "./EnemyControllerFuncional.js";
import { createPlayer, updateAndDrawPlayer } from "./PlayerFuncional.js";
import { createBulletController, checkCollissionController, updateAndDrawBulletController } from "./BulletControllerFuncional.js";

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


const background = loadImage("images/space.png");
const { canvas, ctx } = createCanvas(600, 600);



const playerBulletController = createBulletController(canvas)(10)("red")( true);
const enemyBulletController = createBulletController(canvas)(4)("white")(false);
const enemyController = createEnemyController(
  canvas,
  enemyBulletController,
  playerBulletController
);


const { enemyRows } = enemyController

const player = createPlayer(canvas, 3, playerBulletController);
// Estado inicial do jogo
let gameState = {
  player: { x: 275, y: 550, lives: 3 },
  bullets: [],
  enemyController,
  enemyBullets: [],
  isGameOver: false,
  didWin: false,
};



// Atualiza a posição dos projéteis


// Renderiza a tela
const render = () => {
  drawBackground (background, 0, 0, canvas.width, canvas.height);
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
const checkGameOver = (player)=> {
  if (isGameOver) {
    return;
  }

  if (checkCollissionController(player)) {
    isGameOver = true;
  }

  if (checkCollision(player)) {
    isGameOver = true;
  }

  if (enemyRows.length === 0) {
    didWin = true;
    isGameOver = true;
  }
  return {player, isGameOver, didWin}
}

let isGameOver = false;
let didWin = false;

const game = ()=>{
  checkGameOver(player)
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  displayGameOver()
  if (!isGameOver) {
    drawEnemies(ctx);
    updateAndDrawPlayer(ctx);
    updateAndDrawBulletController(ctx);
    updateAndDrawBulletController(ctx);
  }
}


const displayGameOver  = ()=> {
  if (isGameOver) {
    let text = didWin ? "You Win" : "Game Over";
    let textOffset = didWin ? 3.5 : 5;

    ctx.fillStyle = "white";
    ctx.font = "70px Arial";
    ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);
  }
}

setInterval(game, 1000 / 60);