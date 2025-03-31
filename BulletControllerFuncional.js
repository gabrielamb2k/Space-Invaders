import {
  createBullet,
  moveBullet,
  drawBullet,
  checkCollission,
} from "./BulletFuncional.js";

//funcao para controller inicial da bala
const createBulletController =
  (canvas) => (maxBulletsAtATime) => (bulletColor) => (soundEnabled) => {
    const shootSound = new Audio("sounds/shoot.way"); //som da bala
    shootSound.volume = 0.1;
    return {
      canvas,
      maxBulletsAtATime,
      bulletColor,
      soundEnabled,
      shootSound,
      bullets: [], // : -> operador de atribuição de propriedade
      timeTillNextBulletAllowed: 0,
    };
  };

//funcao para controlar o estado das balas
const updateAndDrawBulletController = (controller) => (ctx) => {
  //faz a filtragem das balas que estao na tela
  const filterBullets = controller.bullets.filter(
    (bullet) =>
      bullet.y + bullet.width > 0 && bullet.y <= controller.canvas.height,
  );
  //funcao para desenhar a bala
  filterBullets.map((bullet) => drawBullet(ctx)(moveBullet(bullet)));
  //Atualizar o timer da bala
  const updateTimeTillNextBulletAllowed =
    controller.timeTillNextBulletAllowed > 0
      ? controller.timeTillNextBulletAllowd - 1
      : 0;
  return {
    ...controller,
    bullets: filterBullets,
    timeTillNextBulletAllowes: updateTimeTillNextBulletAllowed,
  };
};

//funcao para controlar a colissao da bala
const checkCollissionController = (controller) => (sprite) => {
  //verifica se ouve uma colissao da nave com a bala
  const bulletThatHitSpriteIndex = controller.bullets.findIndex((bullet) =>
    checkCollission(bullet)(sprite),
  );
  if (bulletThatHitSpriteIndex >= 0) {
    //cria uma nova lista de balas sem a bala que colidiu
    const updateBullets = [
      ...controller.bullets.slice(0, bulletThatHitSpriteIndex),
      ...controller.bullets.slice(bulletThatHitSpriteIndex + 1),
    ];

    return {
      collided: true,
      controller: {
        ...controller,
        bullets: updateBullets,
      },
    };
  }

  return {
    collidded: false,
    controller,
  };
};

//funcao para atirar uma nova bala
const shootController =
  (controller) =>
  (x) =>
  (y) =>
  (velocity) =>
  (timeTillNextBulletAllowed = 0) => {
    //condicao para ver se pode atirar
    if (
      controller.timeTillNextBulletAllowed <= 0 &&
      controller.bullets.length < controller.maxBulletsAtATime
    ) {
      //cria uma nova bala
      const newBullet = createBullet(
        controller.canvas(x)(y)(velocity)(controller.bulletColor),
      );

      // som da bala
      if (soundEnabled) {
        shootSound.currentTime = 0;
        shootSound.play();
      }
      //retorna a nova bala
      return {
        ...controller,
        bullets: [...controller.bullets, newBullet],
        timeTillNextBulletAllowed: timeTillNextBulletAllowed,
      };
    }

    //se nao puder atirar
    return controller;
  };

export {
  createBulletController,
  updateAndDrawBulletController,
  checkCollissionController,
  shootController,
};
