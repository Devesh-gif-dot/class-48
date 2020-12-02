var PlayerState;
var player,rocks;
var rocksGroup;
var edges;
var bonus,bonusGroup;
var gameState = "Form";
var restart,start,startImg;
var counter;
var score,gameS;
var coinImg,rockImg,shipImg;
var playerLives;
var database,playerCount;
var form,play,player1state,player2state,player1name,player2name;
var player1score,player2score;

function preload() {
  coinImg = loadImage("coin.png");
  rockImg = loadImage("rock.png");
  shipImg = loadImage("spaceship.png");
  startImg = loadImage("start.png");
}
function setup() {
  createCanvas(800,400);
  player = createSprite(100,100,50,50);
  player.shapeColor = "white";
  player.addImage("shipImg",shipImg);
  player.scale = 0.3;
  player.visible = false;

  start = createSprite(400,200,50,50);
  start.addImage("startImg",startImg);
  start.visible = false;

  PlayerState = "normal";
  edges = createEdgeSprites();

  database = firebase.database();
  rocksGroup = createGroup();
  bonusGroup = createGroup();
  playerLives = 3;
  if(gameState==="Form"){
    play = new Player();
    form = new Form();
    form.display()
  }
  restart = createButton("RESTART")
  restart.position(400,350);
  restart.mousePressed(()=>{
    gameState = "Form";
    play.state = "Form";
    play.updateCount(0);
    //Player.updateRank(0);
    location.reload();
    playerLives = 3;
    database.ref('/').update({
      players:null
    })
  })
  score = 0;
  play.getCount();
  
}

function draw() {
  background("black");  
  if(gameState === "start" && playerCount >= 2){
    start.visible = true;
    restart.hide();
    form.hide();
    if(mousePressedOver(start)){
      gameState = "play"
      play.state = "play";
      play.update();
    }
  }else{
    start.visible = false;
  }
  if(gameState === "play" || gameState === "END"){
    form.hide();
  }
  player.bounceOff(edges);
  if(gameState === "play"){
      player.y = mouseY;
      player.visible = true;
      restart.hide();
      createRocks();
      score = score + Math.round(getFrameRate()/60);
      play.score = score;
      play.update();
      text("score: "+ score,700,10);
      if(PlayerState === "normal"){
        Bonus();
      }
      text("Lives: "+playerLives,600,10);
      if(bonusGroup.collide(player)){
        PlayerState = "invincibility";
        counter = 500;
        console.log(counter);
      }
      if(PlayerState === "invincibility"){
        Invincibility();
        text("counter: "+counter,400,10);
        bonusGroup.setVelocityXEach(0);
        bonusGroup.setLifetimeEach(0);
        } 
      if(PlayerState === "normal"&&player.isTouching(rocksGroup)){
        console.log(playerLives);
        rocks.destroy();
        playerLives = playerLives -1;
      }
      
      if(playerLives === 0){
        gameState = "END";
        play.state = "END";
        play.update();
      }

  }
  if(gameState === "END"){
        restart.show();
        rocksGroup.setVelocityXEach(0);
        rocksGroup.setLifetimeEach(-1);
        textSize(30); 
        text("Game Over",350,50);
        text("Score: "+ score,400,150);
        play.update();
        GameEnd();
      }
  if(player1state === "END" && player2state === "END"){
    text(Player1name+player1score,350,250);
    text(player2name+player2score,350,350);
  }    
  play.state = gameState;
  console.log(gameState);
  console.log(play.state);
  drawSprites();

  //console.log(PlayerState);
  
}

function createRocks(){
  if(frameCount%120 === 0){
    rocks = createSprite(900,random(20,380),30,30);
    rocks.addImage("rockImg",rockImg);
    rocks.velocityX = -6;
    rocks.lifetime = 200;
    rocks.shapeColor = "red";
    rocks.scale = 0.2;
    rocks.setCollider("circle",-10,0,200);
    if(score%100 === 0){
       rocks.velocityX = rocks.velocityX+0.5; 
    }
    rocksGroup.add(rocks);

  }
}

function Bonus(){
  var rand = random([300,400,450,500,550]);
  if(frameCount%rand === 0){
    bonus = createSprite(900,random(20,380),30,30);
    bonus.velocityX = -9;
    bonus.lifetime = 150;
    bonus.shapeColor = rgb(212,175,55);
    bonus.addImage("bonusiMG",coinImg);
    bonus.scale = 0.05
    bonus.setCollider("circle",0,0,400);;
    bonusGroup.add(bonus);
  }
}

function GameEnd(){
  gameState === "End";

  bonusGroup.destroyEach();
  rocksGroup.destroyEach();
}
function Invincibility(){
   
  counter = counter - 1;
  if(counter === 0){
   PlayerState = "normal";
    bonusGroup.setVelocityXEach(-9);
    bonusGroup.setLifetimeEach(150);
  }
  console.log(counter);
}