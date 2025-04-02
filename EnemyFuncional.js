 //transformar em const, utilizar curry
  const createEnemy= (x) =>  (y) => (imageNumber)=> {
//colocar aimagem e nova imagem no comeco
    const image = new novaimagem();
    image.src = `images/enemy${imageNumber}.png`;
    
    return{
    x: x, //retirar os this, e poo, trocar por :
    y: y,
    width:  44,
    height : 32;
    image: image
  }
}

//passar o enemy como parametro
  const draw= (enemy) =>(ctx)=> {
    ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
  }

  const move = (enemy)=>(xVelocity) => (yVelocity) => {
      //extrair o numero da imagem
    const imageNumber = 
      enemy.image.src.split('enemy')[1].split('.')[0];
    return createEnemy{
    enemy.x += xVelocity;
    enemy.y += yVelocity;
    
  }
  }

  collideWith = (enemy) => (sprite) => {
    if (
      enemy.x + enemy.width > sprite.x &&
      enemy.x < sprite.x + sprite.width &&
      enemy.y + enemy.height > sprite.y &&
      enemy.y < sprite.y + sprite.height
    ) {
      return true;
    } else {
      return false;
    }
  }
}
export { createEnemy,draw,move,collideWith }
