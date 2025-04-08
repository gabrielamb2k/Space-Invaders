import {
  createEnemyController,
  drawEnemyController,
  collideWithEnemyAndBullet,
  updateEnemyController
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

// Inicialização do canvas
const initCanvas = () => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 600;
  return { canvas, ctx };
};

// Carregar imagem
const loadImage = (src) => {
  const image = new Image();
  image.src = src;
  return image;
};

// Estado inicial do jogo
const createGameState = () => {
  const { canvas, ctx } = initCanvas();
  const background = loadImage("images/space.png");

  // Passar os parâmetros necessários: (canvas, maxBullets, bulletColor, soundEnabled)
  const playerBulletController = createBulletController(canvas, 5, "white", true);
  const enemyBulletController = createBulletController(canvas, 3, "red", false);
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
    didWin: false
  };
};

// Verificação de fim de jogo
const checkGameOver = (state) => {
  if (state.isGameOver) return state;

  const { collided: hitByBullet, controller: updatedEnemyBulletController } =
    checkCollissionController(state.enemyBulletController, state.player);

  const hitByEnemy = collideWithEnemyAndBullet(state.enemyController, state.player);
  const noEnemiesLeft = state.enemyController.enemyRows.length === 0;

  return {
    ...state,
    isGameOver: hitByBullet || hitByEnemy,
    didWin: noEnemiesLeft && !(hitByBullet || hitByEnemy),
    enemyBulletController: updatedEnemyBulletController
  };
};

// Tela de fim de jogo
const displayGameOver = (state) => {
  if (state.isGameOver) {
    const text = state.didWin ? "You Win" : "Game Over";
    const textOffset = state.didWin ? 3.5 : 5;

    state.ctx.fillStyle = "white";
    state.ctx.font = "70px Arial";
    state.ctx.fillText(text, state.canvas.width / textOffset, state.canvas.height / 2);
  }
};

// Loop principal do jogo
const gameLoop = (state) => {
  const updatedState = checkGameOver(state);

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
    const newEnemyBulletController = updateAndDrawBulletController(updatedState.enemyBulletController, updatedState.ctx);

    // Verifica se deve atirar
    const finalPlayerBulletController = keyboardState.shootPressed
      ? shootController(
          newPlayerBulletController,
          newPlayer.x + newPlayer.width / 2,
          newPlayer.y,
          -10
        )
      : newPlayerBulletController;

    requestAnimationFrame(() =>
      gameLoop({
        ...updatedState,
        enemyController: newEnemyController,
        player: newPlayer,
        playerBulletController: finalPlayerBulletController,
        enemyBulletController: newEnemyBulletController,
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
