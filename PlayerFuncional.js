//usar let, porque vai ter que alterar o evento, dependendo do estado que ele vai estar
let keyboardState = () => ({
  rightPressed: false,
  leftPressed: false,
  shootPressed: false,
});

//funcao para criar um player
const createPlayer = (canvas, velocity, bulletController) => {
  //imagem da nave
  const image = new Image();
  image.src = "images/player.png";

  //configurar event listernes para o html, para pegar as interacoes do usuario com o teclado
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  //retorna o player 
  return {
    canvas,
    velocity,
    bulletController,
    image,
    x: canvas.width / 2,
    y: canvas.height - 75,
    width: 50,
    height: 48,
  };
};

// Funcoes puras para manipulacao de eventos de teclado
const handleKeyDown = (event) => {
  if (event.code === "ArrowRight") {
    keyboardState = { ...keyboardState, rightPressed: true };
  }
  if (event.code === "ArrowLeft") {
    keyboardState = { ...keyboardState, leftPressed: true };
  }
  if (event.code === "Space") {
    keyboardState = { ...keyboardState, shootPressed: true };
  }
};

const handleKeyUp = (event) => {
  if (event.code === "ArrowRight") {
    keyboardState = { ...keyboardState, rightPressed: false };
  }
  if (event.code === "ArrowLeft") {
    keyboardState = { ...keyboardState, leftPressed: false };
  }
  if (event.code === "Space") {
    keyboardState = { ...keyboardState, shootPressed: false };
  }
};

//funcao para lidar com o tiro
const handleShooting = (player) => {
  if (keyboardState.shootPressed) {
    player.bulletController.shoot(player.x + player.width / 2, player.y, 4, 10);
  }

  return player;
};

//funcao principal para atualizar e desenhar o player
const updateAndDrawPlayer = (player, ctx) => {
  //verifica se deve atirar
  const playerAfterShooting = handleShooting(player);

  //depois move o player
  const playerAfterMoving = movePlayer(playerAfterShooting);

  //depois verifica colisoes com paredes
  const playerAfterCollision = handleWallCollision(playerAfterMoving);

  //desenha a nave
  ctx.drawImage(
    playerAfterCollision.image,
    playerAfterCollision.x,
    playerAfterCollision.y,
    playerAfterCollision.width,
    playerAfterCollision.height,
  );

  //retorna a nave atualizado
  return playerAfterCollision;
};

//funcao para mover o player baseado no estado do teclado
const movePlayer = (player) => {
  //usar let, pois a posicao do player vai mudar
  let newX = player.x;

  //verifica se a tecla pressionada foi para ir para a esquerda ou para a direita
  if (keyboardState.rightPressed) {
    newX += player.velocity;
  } else if (keyboardState.leftPressed) {
    newX -= player.velocity;
  }

  //retorna o nova posicao da nave
  return {
    ...player,
    x: newX,
  };
};

//funcao para verificar e corrigir colisoes com as paredes
const handleWallCollision = (player) => {
  let adjustedPlayerX = player.x;

  //colissao com a parede esquerda
  if (adjustedPlayerX < 0) {
    adjustedPlayerX = 0;
  }

  //colissao com a parede direita
  if (adjustedPlayerX > player.canvas.width - player.width) {
    adjustedPlayerX = player.canvas.width - player.width;
  }

  return {
    ...player,
    x: adjustedPlayerX,
  };
};

//exportar as funcoes para os outros arquivos
export { createPlayer, updateAndDrawPlayer, keyboardState };
