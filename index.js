//Version2: Had to wipe my previous build code due to multiple errors, game breaks,
// and inability to add my assets at a specific point. Trying a different method.

//Wrap entire game code in an load event listener so it waits and lets all game assets
//(sprite sheets and images) load fully before it executes the code in the callback function.

window.addEventListener("load", function(){
  const canvas = document.getElementById('canvas1')
  //Declare instance of built-in canvas 2D api that holds all the drawing methods and properties
  //Needed to Animate the game
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 720;

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
        this.y = 0;
      }
      //Use Draw method to draw the Player character. Expects context (canvas) as argument
      draw(context){
        //Draws a rectangle to represent the Player character
          context.fillStyle = 'white';
          context.fillRect(this.x, this.y this.width, this.height);
      }

    }

  }

  //Declare Background class for scrolling or parallax background effects
  class Background {

  }

  //Declare Enemy class for generating enemies on screen
  class Enemy {

  }

  //function responsible for adding, animating, and removing enemies from the screen
  function handleEnemies(){

  }
  //function used to display score, you win, and game over message
  function displayStatusText() {

  }

  //Declare var for input handler class that runs all the code inside the InputHandler Constructor
  //And event listener is applied 
  const input = new InputHandler();

  //Create new instance for the Player
  const Player = new Player();



//function is main animation loop runs at 60 fps, draws, and animates game over and over in loop fashion.
  function animate() {

  }
});
