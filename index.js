//Version2: Had to wipe my previous build code due to multiple errors, game breaks,
// and inability to add my assets at a specific point. Trying a different method.

//Wrap entire game code in an load event listener so it waits and lets all game assets

window.addEventListener('load', function(){
  const canvas = document.getElementById('canvas1')
  //Declare instance of built-in canvas 2D api that holds all the drawing methods and properties
  //Needed to Animate the game
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 720;
  //Declare enemies array to spawn multiple enemies onscreen
  let enemies = []

  //Declare Score
  let score = 0;

  //Declare Game Over
  let gameOver = false;

  //Declare InputHandler class to handle all of the user input on the controller/keyboard
  //Handles multiple keyboard inputs at once
  class InputHandler {
    constructor(){
      //Keeps track of keys pressed in real time (adds and removes keys) as they are pressed and released
      //Can keep track of multiple keys at once with the data put into and taken out the empty array

      this.keys = [];

      //ES6 arrow functions don't bind their own 'this', but they inherit the one from their parent scope.
      //This is called lexical scoping.

      //Listens for user input keydown on these Arrow(Direction) keys
      window.addEventListener('keydown', e => {
        //Conditional to check IF these movement keys are pressed down = True
        if ((e.key === 'ArrowDown' ||
            e.key === 'ArrowUp' || 
            e.key === 'ArrowLeft' || 
            e.key === 'ArrowRight' ) 
            //If indexOf = to -1 it means the element is not present in the array
            && this.keys.indexOf(e.key) === -1 ){
            //If conditional is true, THEN push the Arrow(Direction) key into 
            //the empty array only once
            this.keys.push(e.key);
        }
        
      });
      //Listen for the same keys above user input keyup (key release)
      window.addEventListener('keyup', e => {
        if (e.key === 'ArrowDown' ||
            e.key === 'ArrowUp' || 
            e.key === 'ArrowLeft' || 
            e.key === 'ArrowRight' ){
            //If key up (key release) conditional is true, THEN splice the Arrow(Direction) key out of the array
            this.keys.splice(this.keys.indexOf(e.key), 1);
        }
        
      });
    }

  }

  //Declare Player class to generate player on screen
  class Player {
    //Constructor method will draw, animate, and update the Player character's position on screen
    constructor(gameWidth, gameHeight){
      //Convert arguments into class properties
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
      //This is the dimension of the character sprite sheet.
        this.width = 200;
        this.height = 200;
        this.x = 0;
        this.y = this.gameHeight - this.height;
        //This is the sprite sheet for the Player character referenced in html
        this.image = document.getElementById('playerImage');
        this.frameX = 0;
        //This is the limit in frames horizontally on the player sprite sheet from 0 to 8 
        this.maxFrame = 8;
        this.frameY = 0;
        //This will also affect fps in both player and enemy sprite sheets
        this.fps = 20;
        //This will count
        this.frameTimer = 0;
        //Sets how long the frame interval lasts
        this.frameInterval = 1000/this.fps;

        //Movement speed variable (+ number is right, - number is left)
        this.speed = 0;
        //Vertical velocity variable
        this.vy = 0;

        this.weight = 1;
      }
      //Use Draw method to draw the Player character. Expects context (canvas) as argument
      //Draw method to pass onto canvas in animate function
      draw(context){
        //Draws a rectangle to represent the Player character
          //context.fillStyle = 'white';
          //context.fillRect(this.x, this.y, this.width, this.height);
          //drawing collision hit box for player
          context.strokeStyle = 'white';
          context.strokeRect(this.x, this.y, this.width, this.height);
          //drawing white collision hit circle for player
          context.beginPath();
          context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
          context.stroke();

          //drawing blue collision hit circle represents the center point for player
          context.strokeStyle = 'blue';
          context.beginPath();
          context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
          context.stroke();
          //Method bring sprite sheet into the canvas.
          context.drawImage(this.image, this.frameX * this.width, 
            this.frameY * this.height, this.x, this.y, this.width, this.height);
      }
      //Update method to pass into canvas animate function
      //Updates player movement speed when there is user input
      //Updates player collision with enemies
      update(input, deltaTime, enemies){
          //Collision detection arrow function
          //Using MATH to figure out the distance between the center of both player and enemy hit circles
          enemies.forEach(enemy => {
            const dx = (enemy.x + enemy.width/2) - (this.x + this.width/2);
            const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2);
            //Use Pythagorean theorem
            const distance = Math.sqrt(dx * dx + dy *dy);
            if (distance < enemy.width/2 + this.width/2){
              gameOver = true;
            }
          });
          //Animates Player sprite sheet horizontally
          if (this.frameTimer > this.frameInterval){
            //Animates sprite sheet horizontally.
           if (this.frameX >= this.maxFrame) this.frameX = 0;
           else this.frameX++;
           //Resets frameTimer back to 0 so it can count again
           this.frameTimber = 0;
          } else {
            this.frameTimer += deltaTime;
          }
          //Moves Player to the right at a speed of 5
          if (input.keys.indexOf('ArrowRight') > -1) {
              this.speed = 5;
            //Moves Player to the left at a speed of -5
          } else if (input.keys.indexOf('ArrowLeft') > -1) {
              this.speed = -5;
            //Player upwards (y) movement during a jump is set to 10 
            //&& only if Player is onGround = True
          } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
              this.vy -= 32;
            //Resets Player speed to 0 when "ArrowRight" key is not being pressed
          } else {
              this.speed = 0;
          }
          //Controls horizontal movement
          this.x += this.speed;
          //Sets limits so Player cannot move off screen
          if (this.x < 0) this.x= 0;
          else if (this.x > this.gameWidth - this.width) this.x > this.gameWidth - this.width
          //Controls vertical movement
          this.y += this.vy;
          //Conditional that sets jumping mechanics
          if (!this.onGround()){
            //If Player is not on ground Then gradually add more weight to velocity y
            this.vy += this.weight;
            //When Player is not on ground reset maxFrame to 5 for the jump animation
            this.maxFrame = 5
            //Animates the player jumping sprite animation
            this.frameY = 1;
          } else {
            //If Player is back on the ground, set the velocity y to 0 to stop vertical movement
            this.vy = 0
            //If Player in on the ground set the maxFrame to = 8 for running animation
            this.maxFrame = 8
            //Brings the Player animation sprite back to idle rather than jump.
            this.frameY = 0;
            
          }
          //Set vertical boundary so Player does not fall through the canvas floor after jump.
          if (this.y > this.gameHeight - this.height) this.y -this.gameHeight - this.height
          
    }
    //Method checks if the Player is in the air or standing on the ground
    onGround(){
        return this.y >= this.gameHeight - this.height;
    }
  

  };

  //Declare Background class for scrolling and/or parallax background effects
  //No Time for parallax background right now
  class Background {
      constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        //Fetches image from html by id
        this.image = document.getElementById('backgroundImage');
        this.x = 0;
        this.y = 0;
        //Size of Background Image
        this.width = 2400;
        this.height = 72;
        //Speed of Scrolling Background Image, 20px per frame to the left.
        this.speed = 7;
      }
      //Draw method to pass onto canvas in animate function
      draw(context){
        context.drawImage(this.image, this.x, this.y);
        //Trick/Illusion to create endless background scrolling up is to double up on the image 
        //at the end of the first image
        context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
      }
      //Update method to pass into canvas animate function
      //Update function controls scrolling
      update(){
        this.x -= this.speed;
        //Conditional to check if background scroll has run to the end of the image.
        if (this.x < 0 - this.width) this.x = 0;
      }
    
  };

  //Declare Enemy class for generating enemies on screen (creates a single enemy object)
  class Enemy {
    constructor(gameWidth, gameHeight){
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      //width of enemy sprite sheet in pixels
      this.width = 160;
      //height of enemy sprite sheet in pixels
      this.height = 119;
      //Fetches image from html by id "enemyImage" 
      this.image = document.getElementById('enemyImage');
      //Enemy position onscreen
      this.x = this.gameWidth - 100;
      this.y = this.gameHeight - this.height;
      //Horizontal navigation in sprite sheet
      this.frameX = 0;
      //Used to animate enemy sprite sheet from frame 0 up to frame 5
      this.maxFrame = 5;
      //This will also affect fps in both player and enemy sprite sheets
      this.fps = 20;
      //This will count
      this.frameTimer = 0;
      //Sets how long the frame interval lasts
      this.frameInterval = 1000/this.fps;
      //Speed of enemy
      this.speed = 8;
      //Enemies are initially not deleted until filtered
      this.markedForDeletion = false;
    }
    
    //Draw method to pass onto canvas in animate function
    draw(context){
      //drawing collision hit box for player
      context.strokeStyle = 'white';
      context.strokeRect(this.x, this.y, this.width, this.height);
      //drawing collision hit circle for player
      context.beginPath();
      context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
      context.stroke();
      //blue hit circle represents the center point
      context.strokeStyle = 'blue';
      context.beginPath();
      context.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
      context.stroke();
      context.drawImage(this.image, this.frameX * this.width, 0, 
        this.x, this.y, this.width, this.height)
    }
    //Update method to pass into canvas animate function
    update(deltaTime){
      if (this.frameTimer > this.frameInterval){
          //Animates sprite sheet horizontally.
         if (this.frameX >= this.maxFrame) this.frameX = 0;
         else this.frameX++;
         //Resets frameTimer back to 0 so it can count again
         this.frameTimber = 0;
      } else {
          this.frameTimer += deltaTime;
      }
      //Makes enemy1 scroll to the left constantly by speed of -1
      this.x -= this.speed;
      //Removes enemies from enemy array with filter method
      //Filter is applied when the enemies run off of screen (width)
      if (this.x < 0 - this.width) {
        this.markedForDeletion = true;
        //increase score if enemy is marked for deletion
        score++;
      }
    }
  };

   
  //function responsible for adding, animating, and removing enemies from the screen
  function handleEnemies(deltaTIme){ 
    //Adds new enemy on screen every 2000 milliseconds (2 secs) by pushing it into the enemies array.
    if (enemyTimer > enemyInterval + randomEnemyInterval){
        //Push enemies (enemy1 instances) into empty enemies array
        enemies.push(new Enemy(canvas.width, canvas.height));
        //Randomize the enemy interval 
        randomEnemyInterval - Math.random() * 1000 + 500;
        //Reset the timer back to zero to start the count again. 
        enemyTimer = 0;
      //This method ensures that it will work on both fast an slower computers the same.
    } else {
        enemyTimer += deltaTime;
    }
    enemies.forEach(enemy => {
      //Call enemy.draw method to canvas
      enemy.draw(ctx);
      //Call enemy.update method
      enemy.update(deltaTime);
   });
    //filter() array method creates a new array with all elements that pass the test implemented by the provided function
    enemies = enemies.filter(enemy => !enemy.markedForDeletion);
   
  };
  //function used to display score, you win, and game over message
  function displayStatusText(context) {
    context.font = '40px Helvetica';
    context.fillStyle = 'black';
    //fillText() Method makes text that we want to draw + score, x, y coordinates on screen
    context.fillText('Score: ' + score, 20, 50);
    //Manually created a shadow on text for cosmetic purposes also this method does not cause drop in framerate
    context.fillStyle = 'white';
    context.fillText('Score: ' + score, 20, 52);
    //Display Game Over Text if Player is killed
    if (gameOver){
        context.textAlign = 'center';
        context.fillStyle = 'black';
        context.fillText('GAME OVER, try again!', canvas.width/2, 200);
        //Cosmetic shadow effect on Game Over Text
        context.fillStyle = 'white';
        context.fillText('GAME OVER, try again!', canvas.width/2 + 2, 202);
    }
  };

  //Declare var for input handler class that runs all the code inside the InputHandler Constructor
  //And event listener is applied 
  const input = new InputHandler();

  //Create new instance for the Player
  const player = new Player(canvas.width, canvas.height);
  
  //Create new instance for the Background
  const background = new Background(canvas.width, canvas,height);
  
  //Holds the timestamp from the previous frame
  let lastTime = 0;
  //Counting milliseconds from 0 to a certain limit
  //When it reaches limit it will trigger something and set itself back to 0
  let enemyTimer = 0;
  //Value in milliseconds for the time limit. Adds new enemy on screen every 2000 milliseconds (2 secs).
  let enemyInterval = 2000;
  //Randomizes the enemyInterval between 1000 - 1500 milliseconds
  let randomEnemyInterval = Math.random() * 1000 + 500;

//function is main animation loop runs at 60 fps, draws, and animates game over and over in loop fashion.
  function animate(timeStamp){
    //deltaTime is equal to the difference in milliseconds between timeStamp from this loop and lastTime from prev loop
    //In this case around 60 milliseconds.
    const deltaTime = timeStamp - lastTime;
    //Made equal so I can use it in the next loop
    lastTime = timeStamp;
    //Makes sure to clear the canvas so that the white rectangle doesn't trail.
    ctx.clearRect(0,0,canvas.width, canvas.height);
    //Draw background on canvas
    background.draw(ctx);
    //Animate the scrolling background
    background.update();
    //Call the player by using the draw method
    player.draw(ctx);
    //Animates the Character when there is user input, using the deltaTime update method conditional, and updates collisions between player and enemies
    player.update(input, deltaTime, enemies);
    //Pass deltaTime into handleEnemies function call it.
    //Calls and Animates enemies array
    handleEnemies(deltaTime);
    //Calls displayStatusText function
    displayStatusText(ctx);
    
    //Pass the parent through the requestAnimationFrame to create an endless animation loop
    //Automatically creates a timestamp and passes it to the argument it calls
    //Pauses game if gameOver = true
    //Continues game animations if gameOver = false
    if(!gameOver) requestAnimationFrame(animate);
  }
  //First animation loop does not pass timeStamp so I pass 0 to start
  animate(0);

});

