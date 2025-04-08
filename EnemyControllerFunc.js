import {
  createEnemy,
  drawE,
  move,
  collideWith
} from "./EnemyFuncional.js";

import {
  MovingDirection
} from "./MovingDirection.js";

import {
  shootController
} from './BulletControllerFuncional.js     ';

const ENEMY_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
  [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
];

const createEnemyController = (canvas, enemyBulletController, playerBulletController) => {
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
    fireBulletTimerDefault: 100
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
 
  return pipe(
    updateTimers,
    updateMovement,
    handleCollisions,
    handleEnemyShooting
  )(state);
};

const drawEnemyController = (state, ctx) => {
  state.enemyRows.flat().forEach(enemy => {
    drawE(enemy, ctx);
  });
  return state;
};

// Funções auxiliares internas
const updateTimers = (state) => {
  const newFireTimer = state.fireBulletTimer - 1;
  const newMoveTimer = isMovingDown(state) ? state.moveDownTimer - 1 : state.moveDownTimer;
  
  return { ...state, 
    fireBulletTimer: newFireTimer,
    moveDownTimer: newMoveTimer
  };
};

const updateMovement = (state) => {
  if (shouldChangeDirection(state)) {
    return handleDirectionChange(state);
  }
  
  return {
    ...state,
    enemyRows: state.enemyRows.map(row => 
      row.map(enemy => move(enemy, state.xVelocity, state.yVelocity))
    )
  };
};

const handleCollisions = (state) => {

  console.log("Entrou em handleCollisions");
  console.log("Bullets do player:", state.playerBulletController.bullets);
  console.log("Inimigos:", state.enemyRows.flat());
  
  if (!state || !state.enemyRows) {
    console.log("State ou enemyRows undefined em handleCollisions", state);
    return state; // retorna o que veio para não quebrar a pipeline
  }

  const newEnemyRows = state.enemyRows.map(row =>
    row.filter(enemy => !collideWithEnemyAndBullet(state, enemy))
  ).filter(row => row.length > 0);
  
  return { ...state, enemyRows: newEnemyRows };
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
    -3,
    state.fireBulletTimerDefault
  );
  
  return {
    ...state,
    fireBulletTimer: state.fireBulletTimerDefault,
    enemyBulletController: updatedBulletController
  };
};

// Funções de verificação
const isMovingDown = (state) => {
  return [MovingDirection.downLeft, MovingDirection.downRight].includes(state.currentDirection);
};

const shouldChangeDirection = (state) => {
  if (state.currentDirection === MovingDirection.right) {
    return state.enemyRows.some(row => 
      row.some(enemy => enemy.x + enemy.width >= state.canvas.width)
    );
  }
  if (state.currentDirection === MovingDirection.left) {
    return state.enemyRows.some(row => 
      row.some(enemy => enemy.x <= 0)
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
    moveDownTimer: state.moveDownTimerDefault,
    enemyRows: state.enemyRows
  };
};

const collideWithEnemyAndBullet = (state, enemy) => {
  return state.playerBulletController.bullets.some(bullet => 
    collideWith(enemy, bullet)
  );
};



// Função utilitária pipe (simula composição de funções)
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

export { 
  createEnemyController, 
  updateEnemyController, 
  drawEnemyController,
  collideWithEnemyAndBullet 
};