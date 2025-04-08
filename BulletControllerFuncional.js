import {
  createBullet,
  moveBullet,
  drawBullet,
  checkCollission,
} from "./BulletFuncional.js";

//funcao para controller inicial da bala
const createBulletController =
  (canvas,maxBulletsAtATime,bulletColor,soundEnabled) => {
    const shootSound = new Audio("sounds/shoot.wav"); //som da bala
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
const updateAndDrawBulletController = (controller, ctx) => {
  // Move as balas e desenha ao mesmo tempo
  const movedBullets = controller.bullets
    .map(moveBullet)
    .filter(
      (bullet) =>
        bullet.y + bullet.height > 0 && bullet.y <= controller.canvas.height
    );

  movedBullets.forEach((bullet) => drawBullet(ctx)(bullet));

  const updateTimeTillNextBulletAllowed =
    controller.timeTillNextBulletAllowed > 0
      ? controller.timeTillNextBulletAllowed - 1
      : 0;

  return {
    ...controller,
    bullets: movedBullets,
    timeTillNextBulletAllowed: updateTimeTillNextBulletAllowed,
  };
};


//funcao para controlar a colissao da bala
const checkCollissionController = (controller,sprite) => {
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
    collided: false,
    controller,
  };
};

//funcao para atirar uma nova bala
const shootController =
  (controller, x, y, velocity, timeTillNextBulletAllowed = 0) => {
    if (
      controller.timeTillNextBulletAllowed <= 0 &&
      controller.bullets.length < controller.maxBulletsAtATime
    ) {
      const newBullet = createBullet(controller.canvas)(x)(y)(velocity)(controller.bulletColor);

      if (controller.soundEnabled) {
        controller.shootSound.currentTime = 0;
        controller.shootSound.play();
      }

      return {
        ...controller,
        bullets: [...controller.bullets, newBullet],
        timeTillNextBulletAllowed: timeTillNextBulletAllowed,
      };
    }

    return controller;
  };


export {
  createBulletController,
  updateAndDrawBulletController,
  checkCollissionController,
  shootController,
};
