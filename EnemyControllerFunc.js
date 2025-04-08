import {
  createEnemy,
  drawE,
  move,
  collideWith
} from "./EnemyFuncional.js";

import {
  MovingDirection
} from "./MovingDirection.js";

const createEnemyController = (canvas, enemyBulletController, playerBulletController) => {
  const enemyMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
    [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  ];
  
  const enemyDeathSound = new Audio("sounds/enemy-death.wav");
  enemyDeathSound.volume = 0.1;

  const state = {
    canvas,
    enemyBulletController,
    playerBulletController,
    enemyDeathSound,
    enemyMap,
    enemyRows: [],
    currentDirection: MovingDirection.right,
    xVelocity: 0,
    yVelocity: 0,
    defaultXVelocity: 1,
    defaultYVelocity: 1,
    moveDownTimerDefault: 30,
    moveDownTimer: 30,
    fireBulletTimerDefault: 100,
    fireBulletTimer: 100
  };

  return createEnemies(state);
};

const draw = (state, ctx) => {
  const state1 = decrementMoveDownTimer(state);
  const state2 = updateVelocityAndDirection(state1);
  const state3 = collissionDetection(state2);
  drawEnemies(state3, ctx);
  const state4 = resetMoveDownTimer(state3);
  return fireBullet(state4);
};


const collissionDetection = (state) => {
  const newEnemyRows = state.enemyRows.map(enemyRow => {
    const newRow = [...enemyRow];
    for (let i = newRow.length - 1; i >= 0; i--) {
      if (collideWithController(state, newRow[i])) {
        state.enemyDeathSound.currentTime = 0;
       // state.enemyDeathSound.play();
        newRow.splice(i, 1);
      }
    }
    return newRow;
  }).filter(enemyRow => enemyRow.length > 0);

  return {
    ...state,
    enemyRows: newEnemyRows
  };
}

const fireBullet = (state) => {
const newFireBulletTimer = state.fireBulletTimer - 1;
  
  if (newFireBulletTimer <= 0) {
    const allEnemies = state.enemyRows.flat();
    if (allEnemies.length > 0) {
      const enemyIndex = Math.floor(Math.random() * allEnemies.length);
      const enemy = allEnemies[enemyIndex];
      state.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
    }
    
    return {
      ...state,
      fireBulletTimer: state.fireBulletTimerDefault
    };
  }
  
  return {
    ...state,
    fireBulletTimer: newFireBulletTimer
  };
}

const resetMoveDownTimer = (state) => {
  if (state.moveDownTimer <= 0) {
    return {
      ...state,
      moveDownTimer: state.moveDownTimerDefault
    };
  }
  return state;
};

const decrementMoveDownTimer = (state) => {
  if (
    state.currentDirection === MovingDirection.downLeft ||
    state.currentDirection === MovingDirection.downRight
  ) {
    return {
      ...state,
      moveDownTimer: state.moveDownTimer - 1
    };
  }
  return state;
};

const updateVelocityAndDirection = (state) => {
  let newState = { ...state };
  
  outerLoop: for (const enemyRow of state.enemyRows) {
    if (enemyRow.length === 0) continue;
    
    if (state.currentDirection === MovingDirection.right) {
      newState = {
        ...newState,
        xVelocity: state.defaultXVelocity,
        yVelocity: 0
      };
      
      const rightMostEnemy = enemyRow[enemyRow.length - 1];
      if (rightMostEnemy.x + rightMostEnemy.width >= state.canvas.width) {
        newState = {
          ...newState,
          currentDirection: MovingDirection.downLeft
        };
        break outerLoop;
      }
    } else if (state.currentDirection === MovingDirection.downLeft) {
      const result = moveDown(newState, MovingDirection.left);
      if (result.changed) {
        newState = result.state;
        break outerLoop;
      }
    } else if (state.currentDirection === MovingDirection.left) {
      newState = {
        ...newState,
        xVelocity: -state.defaultXVelocity,
        yVelocity: 0
      };
      
      const leftMostEnemy = enemyRow[0];
      if (leftMostEnemy.x <= 0) {
        newState = {
          ...newState,
          currentDirection: MovingDirection.downRight
        };
        break outerLoop;
      }
    } else if (state.currentDirection === MovingDirection.downRight) {
      const result = moveDown(newState, MovingDirection.right);
      if (result.changed) {
        newState = result.state;
        break outerLoop;
      }
    }
  }
  
  return newState;
};

const moveDown = (state, newDirection) => {
  const newState = {
    ...state,
    xVelocity: 0,
    yVelocity: state.defaultYVelocity
  };
  
  if (state.moveDownTimer <= 0) {
    return {
      changed: true,
      state: {
        ...newState,
        currentDirection: newDirection
      }
    };
  }
  
  return {
    changed: false,
    state: newState
  };
};

const drawEnemies = (state, ctx) => {
  state.enemyRows.flat().forEach(enemy => {
    enemy.move(state.xVelocity, state.yVelocity);
    enemy.drawE(ctx);
  });
};

const createEnemies = (state) => {
  const enemyRows = [];
  
  state.enemyMap.forEach((row, rowIndex) => {
    enemyRows[rowIndex] = [];
    row.forEach((enemyNumber, enemyIndex) => {
      if (enemyNumber > 0) {
        enemyRows[rowIndex].push(
          createEnemy(enemyIndex * 50, rowIndex * 35, enemyNumber)
        );
      }
    });
  });
  
  return {
    ...state,
    enemyRows
  };
};

const collideWithController = (state, sprite) => {
  return state.enemyRows.flat().some(enemy => collideWith(enemy, sprite));
};

export { createEnemyController, draw, collideWithController };
