var PLAY = 1;
var END = 0;
var gameState = PLAY;
var light_1
var l,l1,l2,l3,l4,l5,l6;
var light, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var fundo

function preload(){
  light_1 = loadAnimation("light.jpg");
  trex_collided = loadAnimation("trex_collided.png");
  fundo=loadImage("noturno1.jpg")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  l = loadImage("l.jpg");
  
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  light = createSprite(50,180,20,50);
  light.addAnimation("light.jpg",light_1);
  light.scale = 0.1;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  light.setCollider("circle",0,0,40);
  light.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(fundo);
  //exibindo pontuação
  text("Score: "+ score, 500,50);
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //mover o solo
    ground.velocityX = -(4+score/100);
    //pontuação
    score = score + Math.round(getFrameRate()/60);
    if(score>0 &&score%300===0){
      checkPointSound.play();
    }
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    text("light yagami, um estudante que tem um livro da morte, agora esta fugindo do melhor detetive do japao",450,50)
    //pular quando a tecla espaço for pressionada
    if(keyDown("space")&& light.y >= 100) {
        light.velocityY = -12;
        jumpSound.play();
    }
    
    //adicionar gravidade
    light.velocityY = light.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(light)){
        gameState = END;
        dieSound.play();
        ///light.velocityY=-12
        //jumpSound.play();
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      light.velocityY = 0
     
      //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     if(mousePressedOver(restart)){
      reset();
      }
   }
  
 
  //impedir que o light caia
  light.collide(invisibleGround);
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(610,165,10,40);
   obstacle.velocityX = -(4+score/100);
    //gerar obstáculos aleatórios
    obstacle.addImage(l)
   
    //atribua dimensão e tempo de vida aos obstáculos           
    obstacle.scale = 0.05;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribua tempo de vida à variável
    cloud.lifetime = 210;
    
    //ajustar a profundidade
    cloud.depth = light.depth;
    light.depth = light.depth + 1;
    
    //adicionando nuvens ao grupo
   cloudsGroup.add(cloud);
    }
}
function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score=0
}

