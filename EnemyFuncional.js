const createEnemy = (x, y, imageNumber) => {
  const width = 44;
  const height = 32;
  

  const image = new Image();
  image.src = `images/enemy${imageNumber}.png`;
  
  return {
    x,
    y,
    width,
    height,
    imageNumber,
    image
  };
};


const drawEnemy = (enemy, ctx) => {
  ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
};


const moveEnemy = (enemy, xVelocity, yVelocity) => {
  return {
    ...enemy,
    x: enemy.x + xVelocity,
    y: enemy.y + yVelocity
  };
};


const move = (enemy, xVelocity, yVelocity) => {
  enemy.x += xVelocity;
  enemy.y += yVelocity;
  return enemy;
};


const enemyCollideWith = (enemy, sprite) => {
  if (
    enemy.x + enemy.width > sprite.x &&
    enemy.x < sprite.x + sprite.width &&
    enemy.y + enemy.height > sprite.y &&
    enemy.y < sprite.y + sprite.height
  ) {
    return true;
  }
  return false;
};


const drawE = (enemy, ctx) => {
  drawEnemy(enemy, ctx);
};


const collideWith = (enemy, sprite) => {
  return enemyCollideWith(enemy, sprite);
};

export { 
  createEnemy, 
  drawEnemy, 
  moveEnemy, 
  enemyCollideWith,
  drawE,
  move,
  collideWith
};