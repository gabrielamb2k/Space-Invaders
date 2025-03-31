//funcao para criar a bala
const createBullet = (canvas) => (x) => (y) => (velocity) => (bulletColor) => ({
  canvas,
  x,
  y,
  velocity,
  bulletColor,
  width: 5,
  height: 20,
});

//funcao para mover a bala
const moveBullet = (bullet) => ({
  ...bullet,
  y: bullet.y - bullet.velocity,
});

//funcao para desenhar a bala
const drawBullet = (ctx) => (bullet) => {
  ctx.fillStyle = bullet.bulletColor;
  ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  return bullet;
};

//funcao para verificar a colisao
const checkCollission = (bullet) => (sprite) => {
  if (
    bullet.x + bullet.width > sprite.x &&
    bullet.x < sprite.x + sprite.width &&
    bullet.y + bullet.height > sprite.y &&
    bullet.y < sprite.y + sprite.height
  ) {
    return true;
  } else {
    return false;
  }
};

//exporta as funcoes feitas para os outros arquivos
export { createBullet, moveBullet, drawBullet, checkCollission };
