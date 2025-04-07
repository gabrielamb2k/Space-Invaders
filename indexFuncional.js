import { createEnemyController, draw, collideWithController } from "./EnemyControllerFunc.js";
import { createPlayer, updateAndDrawPlayer, keyboardState } from "./PlayerFuncional.js";
import { createBulletController, updateAndDrawBulletController, checkCollissionController, shootController } from "./BulletControllerFuncional.js";


const initCanvas = () => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 600;
  return { canvas, ctx };
};

const loadImage = (src) => {
  const image = new Image();
  image.src = src;
  return image;
};


const createGameState = () => {
  const { canvas, ctx } = initCanvas();
  const background = loadImage("images/space.png");
  

  const playerBulletController = createBulletController(canvas, 10, "red", true);
  const enemyBulletController = createBulletController(canvas, 4, "white", false);
  const enemyController = createEnemyController(
    canvas,
    enemyBulletController,
    playerBulletController
  );
  const player = createPlayer(canvas, 3, playerBulletController);
  
  
  keyboardState(player);
  
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


const checkGameOver = (state) => {

  if (state.isGameOver) {
    return state;
  }
  

  const hitByBullet = checkCollissionController(state.enemyBulletController, state.player);
  

  const hitByEnemy = collideWithController(state.enemyController, state.player);
  

  const noEnemiesLeft = state.enemyController.enemyRows.length === 0;
  

  if (hitByBullet || hitByEnemy) {
    return {
      ...state,
      isGameOver: false
    };
  }
  
  if (noEnemiesLeft) {
    return {
      ...state,
      isGameOver: false,
      didWin: true
    };
  }
  
  return state;
};


const displayGameOver = (state) => {
  if (state.isGameOver) {
    const text = state.didWin ? "You Win" : "Game Over";
    const textOffset = state.didWin ? 3.5 : 5;
    
    state.ctx.fillStyle = "white";
    state.ctx.font = "70px Arial";
    state.ctx.fillText(text, state.canvas.width / textOffset, state.canvas.height / 2);
  }
};


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

    const newEnemyController = draw(updatedState.enemyController, updatedState.ctx);
    

    const newPlayer = updateAndDrawPlayer(updatedState.player, updatedState.ctx);
    

    const newPlayerBulletController = updateAndDrawBulletController(updatedState.playerBulletController, updatedState.ctx);
    

    const newEnemyBulletController = updateAndDrawBulletController(updatedState.enemyBulletController, updatedState.ctx);
    
 
    if (newPlayer.shootPressed) {
      const updatedPlayerBulletController = shootController(
        newPlayerBulletController,
        newPlayer.x + newPlayer.width / 2,
        newPlayer.y,
        -10
      );
      
      return {
        ...updatedState,
        enemyController: newEnemyController,
        player: newPlayer,
        playerBulletController: updatedPlayerBulletController,
        enemyBulletController: newEnemyBulletController
      };
    }
    

    return {
      ...updatedState,
      enemyController: newEnemyController,
      player: newPlayer,
      playerBulletController: newPlayerBulletController,
      enemyBulletController: newEnemyBulletController
    };
  }
  
  return updatedState;
};


const startGame = () => {
  let gameState = createGameState();
  

  const intervalId = setInterval(() => {
    gameState = gameLoop(gameState);
  }, 1000 / 60);
  
  return intervalId;
};


startGame();