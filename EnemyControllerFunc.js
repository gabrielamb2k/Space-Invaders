import {
  createEnemy,
  drawE,
  moveEnemy,
  collideWith
} from "./EnemyFuncional.js";

import {
  MovingDirection
} from "./MovingDirection.js";

import {
  shootController
} from './BulletControllerFuncional.js';

const ENEMY_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
  [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
];

const createEnemyController = (canvas, enemyBulletController, playerBulletController) => {
  const enemyDeathSound = new Audio("sounds/enemy-death.wav");
  enemyDeathSound.volume = 0.1;
  
  const initialState = {
    canvas,
    enemyBulletController,
    playerBulletController,
    enemyRows: createEnemies(ENEMY_MAP),
    currentDirection: MovingDirection.right,
    xVelocity: 1,
    yVelocity: 0,
    defaultXVelocity: 1,
    defaultYVelocity: 1,
    moveDownTimer: 30,
    moveDownTimerDefault: 30,
    fireBulletTimer: 100,
    fireBulletTimerDefault: 100,
    enemyDeathSound
  };
  
  return initialState;
};

const createEnemies = (enemyMap) => {
  return enemyMap.map((row, rowIndex) => 
    row.map((enemyType, enemyIndex) => 
      enemyType > 0 ? createEnemy(enemyIndex * 50, rowIndex * 35, enemyType) : null
    ).filter(Boolean)
  );
};

const updateEnemyController = (state) => {
  // Usa o pipe para executar as funções de atualização, incluindo fireBullet
  const result = pipe(
    updateTimers,
    updateMovement,
    handleCollisions,
    handleEnemyShooting,
    fireBullet  // Adiciona fireBullet como última etapa
  )(state);
  
  // O resultado pode vir com a estrutura { updatedState, effect } se fireBullet for o último
  const newState = result.updatedState || result; // Se fireBullet retornar o wrapper, extraímos updatedState
  
  // Executa o efeito de disparo, se existir (ou seja, se o timer tiver chegado a zero)
  if (result.effect) {
    result.effect();
  }
  
  return newState;
};



const drawEnemyController = (state, ctx) => {


  // Move todos os inimigos de acordo com as velocidades atuais
  const updatedRows = state.enemyRows.map(row =>
    row.map(enemy => moveEnemy(enemy, state.xVelocity, state.yVelocity))
  );

  // Achata o array usando reduce
  const flattenedEnemies = updatedRows.reduce((acc, row) => acc.concat(row), []);

  // Desenha cada inimigo
  flattenedEnemies.forEach(enemy => {
    drawE(enemy, ctx);
  });
  
  return {
    ...state,
    enemyRows: updatedRows
  };
};

const fireBullet = (state) => {
  const timer = state.fireBulletTimer - 1;

  if (timer > 0) {
    // Retorna o novo estado com o timer decrementado e uma função vazia de efeito
    return {
      updatedState: { ...state, fireBulletTimer: timer },
      effect: () => {}
    };
  } else {
    // O timer foi zerado ou menor que zero, então reiniciamos o timer
    // e preparamos o efeito de disparo.
    const allEnemies = state.enemyRows.flat();
    const enemyIndex = Math.floor(Math.random() * allEnemies.length);
    const enemy = allEnemies[enemyIndex];
    const shootEffect = () =>
      state.enemyBulletController = shootController(
        state,
        enemy.x + enemy.width / 2,
        enemy.y,
        -3
      );

    return {
      updatedState: { ...state, fireBulletTimer: state.fireBulletTimerDefault },
      effect: shootEffect
    };
  }
};




// Funções auxiliares internas
const updateTimers = (state) => {
  const newFireTimer = state.fireBulletTimer - 1;
  const newMoveTimer = isMovingDown(state) ? state.moveDownTimer - 1 : state.moveDownTimer;
  
  return { 
    ...state, 
    fireBulletTimer: newFireTimer,
    moveDownTimer: newMoveTimer
  };
};

const updateMovement = (state) => {
  if (shouldChangeDirection(state)) {
    return handleDirectionChange(state);
  }
  
  return state;
};

const handleCollisions = (state) => {
  let updatedPlayerBulletController = { ...state.playerBulletController };
  let soundPlayed = false;

  const updatedEnemyRows = state.enemyRows
    .map((row) => {
      return row.filter((enemy) => {
        const hitIndex = updatedPlayerBulletController.bullets.findIndex((bullet) =>
          collideWith(enemy, bullet)
        );

        if (hitIndex !== -1) {
          // Remove a bala sem modificar diretamente
          updatedPlayerBulletController = {
            ...updatedPlayerBulletController,
            bullets: [
              ...updatedPlayerBulletController.bullets.slice(0, hitIndex),
              ...updatedPlayerBulletController.bullets.slice(hitIndex + 1),
            ],
          };

          // Toca o som de morte uma vez
          if (!soundPlayed && state.enemyDeathSound) {
            state.enemyDeathSound.currentTime = 0;
            state.enemyDeathSound.play();
            soundPlayed = true;
          }

          return false; // Remove inimigo
        }

        return true; // Mantém inimigo
      });
    })
    .filter((row) => row.length > 0); // Remove linhas vazias

  return {
    ...state,
    enemyRows: updatedEnemyRows,
    playerBulletController: updatedPlayerBulletController,
  };
};


const handleEnemyShooting = (state) => {
  if (state.fireBulletTimer > 0) return state;
  
  const allEnemies = state.enemyRows.flat();
  if (allEnemies.length === 0) return state;
  
  const randomEnemy = allEnemies[Math.floor(Math.random() * allEnemies.length)];
  const updatedBulletController = shootController(
    state.enemyBulletController,
    randomEnemy.x + randomEnemy.width / 2,
    randomEnemy.y,
    3, 
    1  
  );
  
  return {
    ...state,
    fireBulletTimer: state.fireBulletTimerDefault,
    enemyBulletController: updatedBulletController
  };
};


const isMovingDown = (state) => {
  return [MovingDirection.downLeft, MovingDirection.downRight].includes(state.currentDirection);
};

const shouldChangeDirection = (state) => {
  if (state.currentDirection === MovingDirection.right) {
    return state.enemyRows.some(row => 
      row.length > 0 && row[row.length - 1].x + row[row.length - 1].width >= state.canvas.width
    );
  }
  if (state.currentDirection === MovingDirection.left) {
    return state.enemyRows.some(row => 
      row.length > 0 && row[0].x <= 0
    );
  }
  if (isMovingDown(state)) {
    return state.moveDownTimer <= 0;
  }
  return false;
};

const handleDirectionChange = (state) => {
  let newDirection, xVel, yVel;
  
  switch(state.currentDirection) {
    case MovingDirection.right:
      newDirection = MovingDirection.downLeft;
      xVel = 0;
      yVel = state.defaultYVelocity;
      break;
      
    case MovingDirection.downLeft:
      newDirection = MovingDirection.left;
      xVel = -state.defaultXVelocity;
      yVel = 0;
      break;
      
    case MovingDirection.left:
      newDirection = MovingDirection.downRight;
      xVel = 0;
      yVel = state.defaultYVelocity;
      break;
      
    case MovingDirection.downRight:
      newDirection = MovingDirection.right;
      xVel = state.defaultXVelocity;
      yVel = 0;
      break;
  }
  
  return {
    ...state,
    currentDirection: newDirection,
    xVelocity: xVel,
    yVelocity: yVel,
    moveDownTimer: state.moveDownTimerDefault
  };
};


const collideWithPlayer = (state, player) => {
  return state.enemyRows.flat().some(enemy => 
    collideWith(enemy, player)
  );
};


const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

export { 
  createEnemyController, 
  updateEnemyController, 
  drawEnemyController,
  collideWithPlayer
};