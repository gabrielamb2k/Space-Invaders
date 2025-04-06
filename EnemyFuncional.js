 //transformar em const, utilizar curry

//fazer uma funcao para a iomgame e uma para  o enemy
const createImage = (imagemNumber)_ => {
 //colocar aimagem e nova imagem no comeco
    const image = new novaimagem();
    image.src = `images/enemy${imageNumber}.png`;
 return image;
}

  const createEnemy= (x) =>  (y) => (imageNumber)=> {
//colocar aimagem e nova imagem no comeco
    const image = createImage(imageNumber);
    return{
    x: x, //retirar os this, e poo, trocar por :
    y: y,
    width:  44,
    height : 32;
    image
  };
};

//passar o enemy como parametro
  const draw= (enemy) =>(ctx)=> {
    ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
   //retornar para manter o paradigma
   return enemy;
  };

//mover inimigos
  const move = (enemy) => (xVelocity) => (yVelocity) => {
      //extrair o numero da imagem
   const imageScr = enemy.image.scr;
    const imageNumber = 
     imageScr.split('enemy')[1]?.split('.')[0] || '1';
   //retorna um  njovo inimigo com coordenadas atualizadas
    return createEnemy(enemy.x += xVelocity)(enemy.y += yVelocity)(imageNumber);
  };

//detecta colisoes
  collideWith = (enemy) => (sprite) => {
    return (
      enemy.x + enemy.width > sprite.x &&
      enemy.x < sprite.x + sprite.width &&
      enemy.y + enemy.height > sprite.y &&
      enemy.y < sprite.y + sprite.height
    );
  };
export { createEnemy,draw,move,collideWith };
