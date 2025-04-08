import { shootController } from "./BulletControllerFuncional.js";

// Estado de teclado global (imutável na estrutura, mas mutável nas flags internas)
const keyboardState = {
  rightPressed: false,
  leftPressed: false,
  shootPressed: false,
};

// Cria um novo player
const createPlayer = (canvas, velocity, bulletController) => {
  const image = new Image();
  image.src = "images/player.png";

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  return Object.freeze({
    canvas,
    velocity,
    bulletController,
    image,
    x: canvas.width / 2,
    y: canvas.height - 75,
    width: 50,
    height: 48,
  });
};

// Manipuladores de eventos de teclado
const handleKeyDown = (event) => {
  if (event.code === "ArrowRight") keyboardState.rightPressed = true;
  if (event.code === "ArrowLeft") keyboardState.leftPressed = true;
  if (event.code === "Space") keyboardState.shootPressed = true;
};

const handleKeyUp = (event) => {
  if (event.code === "ArrowRight") keyboardState.rightPressed = false;
  if (event.code === "ArrowLeft") keyboardState.leftPressed = false;
  if (event.code === "Space") keyboardState.shootPressed = false;
};

// Lida com o disparo do jogador
const handleShooting = (player) => {
  if (keyboardState.shootPressed) {
    const updatedBulletController = shootController(
      player.bulletController,
      player.x + player.width / 2,
      player.y,
      -10 // velocidade para cima
    );

    return {
      ...player,
      bulletController: updatedBulletController,
    };
  }

  return player;
};


// Move o jogador com base nas teclas pressionadas
const movePlayer = (player) => {
  let newX = player.x;

  if (keyboardState.rightPressed) newX += player.velocity;
  if (keyboardState.leftPressed) newX -= player.velocity;

  return {
    ...player,
    x: newX,
  };
};

// Corrige colisão com as bordas do canvas
const handleWallCollision = (player) => {
  let newX = player.x;

  if (newX < 0) newX = 0;
  if (newX > player.canvas.width - player.width) {
    newX = player.canvas.width - player.width;
  }

  return {
    ...player,
    x: newX,
  };
};

// Atualiza e desenha o player
const updateAndDrawPlayer = (player, ctx) => {
  const afterShooting = handleShooting(player);
  const afterMoving = movePlayer(afterShooting);
  const finalPlayer = handleWallCollision(afterMoving);

  ctx.drawImage(
    finalPlayer.image,
    finalPlayer.x,
    finalPlayer.y,
    finalPlayer.width,
    finalPlayer.height
  );

  return finalPlayer;
};

// Exporta as funções
export { createPlayer, updateAndDrawPlayer, keyboardState };
