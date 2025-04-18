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

// Função pura: Não tem efeitos colaterais, sempre retorna o mesma saída para os mesmos grupo de entrada 
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

// Função de criação de estado: Retorna um objeto imutável com todo o estado inicial do jogo
// cria um estado inicial do game
const createGameState = () => {
  const { canvas, ctx } = initCanvas();
  const background = loadImage("images/space.png");


  const playerBulletController = createBulletController(canvas, 10, "red", true);
  const enemyBulletController = createBulletController(canvas, 4, "blue", false);
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
//Não modifica o estado, apenas verifica condições e retorna novo estado
const checkGameOver = (state) => {
  if (state.isGameOver) return state;

   // Verifica colisões
  const { collided: hitByBullet, controller: updatedEnemyBulletController } =
    checkCollissionController(state.enemyBulletController, state.player);


  const hitByEnemy = collideWithPlayer(state.enemyController, state.player);
  

  const noEnemiesLeft = state.enemyController.enemyRows.length === 0;


  const gameOver = hitByBullet || hitByEnemy;
  const playerWon = noEnemiesLeft && !gameOver;

  // Retorna novo estado atualizado 
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
    const textOffset = state.didWin ? 5.5 : 5;
    if(text==='Voce ganhou') {
      state.ctx.fillStyle = "green"
    }else{
      state.ctx.fillStyle = "red"
    }
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

   // (limpar canvas)
  updatedState.ctx.clearRect(
    0,
    0,
    updatedState.canvas.width,
    updatedState.canvas.height
  );
  
  //(desenhar background)
  updatedState.ctx.drawImage(
    updatedState.background,
    0,
    0,
    updatedState.canvas.width,
    updatedState.canvas.height
  );

  displayGameOver(updatedState);

  if (!updatedState.isGameOver) {
    // Atualiza o controlador dos inimigos e já passa a controller de balas do jogador
    const updatedEnemyController = updateEnemyController({
      ...updatedState.enemyController,
      playerBulletController: updatedState.playerBulletController
    });

    const newEnemyController = drawEnemyController(updatedEnemyController, updatedState.ctx);

    const newPlayer = updateAndDrawPlayer(updatedState.player, updatedState.ctx);

    // Usa o bulletController atualizado vindo de updateEnemyController
    const newPlayerBulletController = updateAndDrawBulletController(
      updatedEnemyController.playerBulletController,
      updatedState.ctx
    );

    // Esta é uma expressão condicional (ternária) que decide se o jogador atira ou não
    // Verrifica se o botão de tiro (space) foi pressionado 
    const finalPlayerBulletController = keyboardState.shootPressed
      ? shootController(
          newPlayerBulletController,
          newPlayer.x + newPlayer.width / 2,
          newPlayer.y,
          -10 // direção para cima
        )
      : newPlayerBulletController;

    // Atualiza e desenha todas as balas inimigas
    const newEnemyBulletController = updateAndDrawBulletController(
      updatedState.enemyBulletController,
      updatedState.ctx
    );

    // Reduz temporizador de tiro dos inimigos
    const updatedCooldown = Math.max(0, updatedState.enemyShootCooldown - 1);
    let newEnemyBulletControllerFinal = newEnemyBulletController;
    let resetCooldown = updatedCooldown;

    if (updatedCooldown === 0) {
      //Cria um estado temporário com as balas inimigas atualizadas
      const tempState = {
        ...updatedState,
        enemyBulletController: newEnemyBulletController
      };
      const afterShootState = enemyShoot(tempState);
      newEnemyBulletControllerFinal = afterShootState.enemyBulletController;

      //Adiciona variação para tornar o jogo menos previsível
      resetCooldown = 50 + Math.floor(Math.random() * 30);
    }

    // Chama próximo frame com tudo atualizado
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