import {
  createEnemyController,
  updateEnemyController,
  drawEnemyController,
  collideWithPlayer
} from "./EnemyControllerFunc.js";
import {
  createPlayer,
  updateAndDrawPlayer,
  keyboardState,
} from "./PlayerFuncional.js";
import {
  createBulletController,
  updateAndDrawBulletController,
  checkCollissionController,
  shootController,
} from "./BulletControllerFuncional.js";

// inicializa o canvas
const initCanvas = () => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 600;
  return { canvas, ctx };
};

// imagem
const loadImage = (src) => {
  const image = new Image();
  image.src = src;
  return image;
};

// cria um estado inicial do game
const createGameState = () => {
  const { canvas, ctx } = initCanvas();
  const background = loadImage("images/space.png");


  const playerBulletController = createBulletController(canvas, 10, "red", true);
  const enemyBulletController = createBulletController(canvas, 4, "white", false);
  const enemyController = createEnemyController(canvas, enemyBulletController, playerBulletController);
  const player = createPlayer(canvas, 3, playerBulletController);

  return {
    canvas,
    ctx,
    background,
    playerBulletController,
    enemyBulletController,
    enemyController,
    player,
    isGameOver: false,
    didWin: false,
    enemyShootCooldown: 50,
  };
};

const checkGameOver = (state) => {
  if (state.isGameOver) return state;


  const { collided: hitByBullet, controller: updatedEnemyBulletController } =
    checkCollissionController(state.enemyBulletController, state.player);


  const hitByEnemy = collideWithPlayer(state.enemyController, state.player);
  

  const noEnemiesLeft = state.enemyController.enemyRows.length === 0;


  const gameOver = hitByBullet || hitByEnemy;
  const playerWon = noEnemiesLeft && !gameOver;

  return {
    ...state,
    isGameOver: gameOver || playerWon,
    didWin: playerWon,
    enemyBulletController: updatedEnemyBulletController
  };
};


const displayGameOver = (state) => {
  if (state.isGameOver) {
    const text = state.didWin ? "Voce ganhou" : "Voce perdeu";
    const textOffset = state.didWin ? 3.5 : 5;

    state.ctx.fillStyle = "white";
    state.ctx.font = "70px Arial";
    state.ctx.fillText(text, state.canvas.width / textOffset, state.canvas.height / 2);
  }
  return state;
};

const enemyShoot = (state) => {
  const allEnemies = state.enemyController.enemyRows.flat();
  if (allEnemies.length === 0) return state;

  const randomEnemy = allEnemies[Math.floor(Math.random() * allEnemies.length)];

  const newEnemyBulletController = shootController(
    state.enemyBulletController,
    randomEnemy.x + randomEnemy.width / 2,
    randomEnemy.y,
    +3 // velocidade para cima
  );

  return {
    ...state,
    enemyBulletController: newEnemyBulletController
  };
};


const gameLoop = (state) => {
  const updatedState = checkGameOver(state);

  updatedState.ctx.clearRect(
    0,
    0,
    updatedState.canvas.width,
    updatedState.canvas.height
  );

  updatedState.ctx.drawImage(
    updatedState.background,
    0,
    0,
    updatedState.canvas.width,
    updatedState.canvas.height
  );

  displayGameOver(updatedState);

  if (!updatedState.isGameOver) {
    const updatedEnemyController = updateEnemyController(updatedState.enemyController);
    const newEnemyController = drawEnemyController(updatedEnemyController, updatedState.ctx);

    const newPlayer = updateAndDrawPlayer(updatedState.player, updatedState.ctx);
    const newPlayerBulletController = updateAndDrawBulletController(updatedState.playerBulletController, updatedState.ctx);
    

     // Verifica se deve atirar
     const finalPlayerBulletController = keyboardState.shootPressed
     ? shootController(
         newPlayerBulletController,
         newPlayer.x + newPlayer.width / 2,
         newPlayer.y,
         -10
       )
     : newPlayerBulletController;
    

    const newEnemyBulletController = updateAndDrawBulletController(updatedState.enemyBulletController, updatedState.ctx);

    // Reduz temporizador de tiro dos inimigos
    const updatedCooldown = Math.max(0, updatedState.enemyShootCooldown - 1);
    let newEnemyBulletControllerFinal = newEnemyBulletController;
    let resetCooldown = updatedCooldown;

    // Se chegou a 0, atira e reseta o cooldown
    if (updatedCooldown === 0) {
      const tempState = {
        ...updatedState,
        enemyBulletController: newEnemyBulletController
      };
      const afterShootState = enemyShoot(tempState);
      newEnemyBulletControllerFinal = afterShootState.enemyBulletController;
      resetCooldown = 50 + Math.floor(Math.random() * 30); // adiciona variação aleatória
    }


      requestAnimationFrame(() =>
        gameLoop({
          ...updatedState,
          enemyController: newEnemyController,
          player: newPlayer,
          playerBulletController: finalPlayerBulletController,
          enemyBulletController: newEnemyBulletControllerFinal, 
          enemyShootCooldown: resetCooldown,
        })
      );
  }
};

// Inicialização do jogo
const startGame = () => {
  const gameState = createGameState();
  gameLoop(gameState);
};

// Inicia quando o DOM estiver carregado
if (document.readyState === "complete") {
  startGame();
} else {
  window.addEventListener("load", startGame);
}