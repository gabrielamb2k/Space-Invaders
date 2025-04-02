//importar do Enemy.js

import{
createEnemy,
  draw,
  move,
  collideWith
} from ".EnemyFuncional.js";

//colocar as constantes imutaveis, enemymap, e todas as funcoes padroes, defaults
 const enemyMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
    [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  ];

const defaultXVelocity : 1;
const  defaultYVelocity : 1;
const 
  moveDownTimerDefault : 30;
  const fireBulletTimerDefault : 100;

//funcao para criar inimigo a partir do mapa
const createEnemies = (canvas) => {
  return enemyMap.map((row,rowIndex))=> 
  row.reduce((enemyRow,enemyNumber,enemyIndex) => {
  if(enemyNumber>0){  //se o numero de inimigos for maior do que 0, const enemy
  const enemy = createEnemy(
    (enemyIndex*50)
    (rowInex*35)
    (enemyNumber)
  );
    return [...enemyRow,enemy]; 
  }
    return enemyRow;
  },[])
}

//funcao para criar estado inicial do controlador
 const createEnemyController = (canvas) => (enemyBulletController) =>  (playerBulletController) => {
      const enemyDeathSound = new Audio("sounds/enemy-death.wav");
        enemyDeathSound.volume = 0.1; //nao e puro, mas e necessario par o audio

//criar estado inicial imutavel
const estadoinicial = {
     canvas,
    enemyBulletController,
     playerBulletController,
        enemyRows: createEnemies(canvas),
  currentDirection : MovingDirection.right,
  xVelocity : 0,
  yVelocity : 0,
  moveDownTimer : moveDownTimerDefault,
  fireBulletTimer : FireBulletTimerDefault,
  }
}
return estadoinicial;
}

//funcao para decrementar o timer para baixo 
const decrementMoveDownTimer = (estado) => {
  if(
    estado.currentDirection == MoveDirection.downLeft ||
    estado.currentDirection == MoveDirection.downRight){
    return{ ...estado,
      moveDownTimer : estado.moveDoenTimer - 1}
  }
  return estado;
}

//funcao para resetar o tempo de movimento para baixo
const resetMoveDownTimer = (estado) => {
if(estado.moveDownTimer<=0){
  return{
    ...state,
    moveDownTimer : estado.moveDownTimerDefault
  };
  
}
  return estado; //sempre retornar o estado apos cada funcao
}

//funcao para mover para baixo
const moveDown = (estado) => (newDirection) => {
const novoestado = {
...estado,
  xVelocity : 0,
  yVelocity : estado.defaultYVelocity,
}

  if(estado.moveDownTimer<=0){
  return {
    ...novoestado,
    currentDirection : newDirection //atualizo a direcao para uma nova
  }
  }

return novoestado;
}

//funcao para detectar colisoes 
const collisionDetected = (estado) => {
const filterenemyRow = (enemyRow,playerBulletController,playSound) => {
return enemyRow.filter(enemy => {
const atingido = playerBulletController.collideWith(enemy);
if(atingido) { //se foi atingido toque a musica
playSound()
}
  return !atingido;
}

}

    

//funcao para tocar o som
const playdeathSound = () => {
estado.enemyDeathSound.currentTime : 0;
  estado.enemyDeathSound.play(); //nao e 100% funcional
}

//aplicar filtro em todas as linhas
const newEnemyRows = estado.enemyRows.map(enemyRow=>
  filterenemyRow(enemyRow, estado.playerBulletController,playDeathSound)); //vem das colisoes

//filtra linhas vazias

const filteredEnemyRows = newEnemyRows.filter(row=>row.length > 0); 
  return{
    ...estado
      enemyRows : filteredEnemyRows
};
};

  
//faltam as funcoes para atirar, desenhar e atualizar o desenho, verificar a colisao com sprite , e atualizar velocidade e direcao


  const draw = ((ctx) {
    this.decrementMoveDownTimer();
    this.updateVelocityAndDirection();
    this.collisionDetection();
    this.drawEnemies(ctx);
    this.resetMoveDownTimer();
    this.fireBullet();
  }


  fireBullet() {
    this.fireBulletTimer--;
    if (this.fireBulletTimer <= 0) {
      this.fireBulletTimer = this.fireBulletTimerDefault;
      const allEnemies = this.enemyRows.flat();
      const enemyIndex = Math.floor(Math.random() * allEnemies.length);
      const enemy = allEnemies[enemyIndex];
      this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
    }
  }



  updateVelocityAndDirection() {
    for (const enemyRow of this.enemyRows) {
      if (this.currentDirection == MovingDirection.right) {
        this.xVelocity = this.defaultXVelocity;
        this.yVelocity = 0;
        const rightMostEnemy = enemyRow[enemyRow.length - 1];
        if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
          this.currentDirection = MovingDirection.downLeft;
          break;
        }
      } else if (this.currentDirection === MovingDirection.downLeft) {
        if (this.moveDown(MovingDirection.left)) {
          break;
        }
      } else if (this.currentDirection === MovingDirection.left) {
        this.xVelocity = -this.defaultXVelocity;
        this.yVelocity = 0;
        const leftMostEnemy = enemyRow[0];
        if (leftMostEnemy.x <= 0) {
          this.currentDirection = MovingDirection.downRight;
          break;
        }
      } else if (this.currentDirection === MovingDirection.downRight) {
        if (this.moveDown(MovingDirection.right)) {
          break;
        }
      }
    }
  }

  
  drawEnemies(ctx) {
    this.enemyRows.flat().forEach((enemy) => {
      enemy.move(this.xVelocity, this.yVelocity);
      enemy.draw(ctx);
    });
  }

  happy = () => {};

  createEnemies() {
    this.enemyMap.forEach((row, rowIndex) => {
      this.enemyRows[rowIndex] = [];
      row.forEach((enemyNubmer, enemyIndex) => {
        if (enemyNubmer > 0) {
          this.enemyRows[rowIndex].push(
            new Enemy(enemyIndex * 50, rowIndex * 35, enemyNubmer)
          );
        }
      });
    });
  }

  collideWith(sprite) {
    return this.enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
  }
}
