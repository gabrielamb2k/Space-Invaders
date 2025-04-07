<<<<<<< Updated upstream
///importar do Enemy.js
import {
  createEnemy,
  draw,
  collideWith,
  move,
} from "./EnemyFuncional.js";
=======
//importar do Enemy.js

import{
createEnemy,
  draw,
  move,
  collideWith
} from ".EnemyFuncional.js";
>>>>>>> Stashed changes

///importar do Enemy.js

<<<<<<< Updated upstream
const createEnemyController = (
  canvas,
  enemyBulletController,
  playerBulletController,
) => {
  const enemyMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
    [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  ];

  const enemyRows = enemyMap.map((row, rowIndex) =>
    row
      .map((type, colIndex) =>
        type > 0 ? createEnemy(colIndex * 50)(rowIndex * 35) (type) : null,
      )
      .filter(Boolean),
  );

  return {
    canvas,
    enemyRows,
    currentDirection: MovingDirection.right,
    xVelocity: 0,
    yVelocity: 0,
    defaultXVelocity: 1,
    defaultYVelocity: 1,
    moveDownTimerDefault: 30,
    moveDownTimer: 30,
    fireBulletTimerDefault: 100,
    fireBulletTimer: 100,
    enemyBulletController,
    playerBulletController,
    enemyDeathSound: (() => {
      const sound = new Audio("sounds/enemy-death.wav");
      sound.volume = 0.1;
      return sound;
    })(),
=======
import{
  createEnemy,
    draw,
    move,
    collideWith
  } from ".EnemyFuncional.js";
  
  /// Funções auxiliares
  import Enemy from "./Enemy.js";
  import MovingDirection from "./MovingDirection.js";
  
  const createEnemyController = (canvas, enemyBulletController, playerBulletController) => {
    const enemyMap = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
      [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ];
  
    const enemyRows = enemyMap.map((row, rowIndex) =>
      row.map((type, colIndex) => (type > 0 ? createEnemy(colIndex * 50, rowIndex * 35, type) : null)).filter(Boolean)
    );
  
    return {
      canvas,
      enemyRows,
      currentDirection: MovingDirection.right,
      xVelocity: 0,
      yVelocity: 0,
      defaultXVelocity: 1,
      defaultYVelocity: 1,
      moveDownTimerDefault: 30,
      moveDownTimer: 30,
      fireBulletTimerDefault: 100,
      fireBulletTimer: 100,
      enemyBulletController,
      playerBulletController,
      enemyDeathSound: (() => {
        const sound = new Audio("sounds/enemy-death.wav");
        sound.volume = 0.1;
        return sound;
      })(),
    };
>>>>>>> Stashed changes
  };
  
  const updateDirectionAndVelocity = (controller) => {
    for (const row of controller.enemyRows) {
      if (controller.currentDirection === MovingDirection.right) {
        const rightMost = row[row.length - 1];
        if (rightMost.x + rightMost.width >= controller.canvas.width) {
          return { ...controller, currentDirection: MovingDirection.downLeft, xVelocity: 0, yVelocity: controller.defaultYVelocity };
        }
        return { ...controller, xVelocity: controller.defaultXVelocity, yVelocity: 0 };
      }
      if (controller.currentDirection === MovingDirection.left) {
        const leftMost = row[0];
        if (leftMost.x <= 0) {
          return { ...controller, currentDirection: MovingDirection.downRight, xVelocity: 0, yVelocity: controller.defaultYVelocity };
        }
        return { ...controller, xVelocity: -controller.defaultXVelocity, yVelocity: 0 };
      }
      if (controller.currentDirection === MovingDirection.downLeft || controller.currentDirection === MovingDirection.downRight) {
        if (controller.moveDownTimer <= 0) {
          return {
            ...controller,
            currentDirection: controller.currentDirection === MovingDirection.downLeft ? MovingDirection.left : MovingDirection.right,
            xVelocity: controller.currentDirection === MovingDirection.downLeft ? -controller.defaultXVelocity : controller.defaultXVelocity,
            yVelocity: 0,
            moveDownTimer: controller.moveDownTimerDefault,
          };
        }
      }
    }
    return controller;
  };
  
  const moveEnemies = (controller) => {
    const updatedEnemies = controller.enemyRows.map((row) =>
      row.map((enemy) => {
        enemy.move(controller.xVelocity, controller.yVelocity);
        return enemy;
      })
    );
    return { ...controller, enemyRows: updatedEnemies };
  };
  
  const drawEnemies = (ctx, controller) => {
    controller.enemyRows.flat().forEach((enemy) => enemy.draw(ctx));
  };
  
  const checkCollision = (controller) => {
    const newRows = controller.enemyRows.map((row) =>
      row.filter((enemy) => {
        const hit = controller.playerBulletController.collideWith(enemy);
        if (hit) {
          controller.enemyDeathSound.currentTime = 0;
          controller.enemyDeathSound.play();
        }
        return !hit;
<<<<<<< Updated upstream
      }),
    )
    .filter((row) => row.length > 0);

  return { ...controller, enemyRows: newRows };
};

const handleFire = (controller) => {
  if (controller.fireBulletTimer <= 0) {
    const allEnemies = controller.enemyRows.flat();
    const randomEnemy =
      allEnemies[Math.floor(Math.random() * allEnemies.length)];
    controller.enemyBulletController.shoot(
      randomEnemy.x + randomEnemy.width / 2,
      randomEnemy.y,
      -3,
    );
    return {
      ...controller,
      fireBulletTimer: controller.fireBulletTimerDefault,
    };
  }
  return { ...controller, fireBulletTimer: controller.fireBulletTimer - 1 };
};

const updateEnemyController = (controller) => {
  const updated = updateDirectionAndVelocity(controller);
  const moved = moveEnemies(updated);
  const collided = checkCollision(moved);
  return handleFire({ ...collided, moveDownTimer: collided.moveDownTimer - 1 });
};

const enemyCollides = (controller, sprite) => {
  return controller.enemyRows.flat().some((enemy) => enemy.enemyCollidesWith(sprite));
};

export {
  createEnemyController,
  updateEnemyController,
  drawEnemies,
  enemyCollides,
  checkCollision
};
=======
      })
    ).filter((row) => row.length > 0);
  
    return { ...controller, enemyRows: newRows };
  };
  
  const handleFire = (controller) => {
    if (controller.fireBulletTimer <= 0) {
      const allEnemies = controller.enemyRows.flat();
      const randomEnemy = allEnemies[Math.floor(Math.random() * allEnemies.length)];
      controller.enemyBulletController.shoot(randomEnemy.x + randomEnemy.width / 2, randomEnemy.y, -3);
      return { ...controller, fireBulletTimer: controller.fireBulletTimerDefault };
    }
    return { ...controller, fireBulletTimer: controller.fireBulletTimer - 1 };
  };
  
  const updateEnemyController = (controller) => {
    const updated = updateDirectionAndVelocity(controller);
    const moved = moveEnemies(updated);
    const collided = checkCollision(moved);
    return handleFire({ ...collided, moveDownTimer: collided.moveDownTimer - 1 });
  };
  
  const enemyCollidesWith = (controller, sprite) => {
    return controller.enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
  };
  
  export {
    createEnemyController,
    updateEnemyController,
    drawEnemies,
    enemyCollidesWith
  };
  
>>>>>>> Stashed changes
