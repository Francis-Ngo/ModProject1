//import platform from './img/Mod1_Platform_Grass.png';

// Get the canvas element
const canvas = document.querySelector('canvas');

// Get the 2D drawing context
const ctx = canvas.getContext('2d');

// Make canvas width and height match window size

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Make canvas background white
//ctx.fillSTyle = "white"
//ctx.fillRect(0,0, canvas.width, 50)
// Add realistic gravity physics by declaring a variable
const gravity = 0.5;

//Create Sprite Class for pass img for assets through the constructor function ({object inside})
//Wrapped arguments in curly brackets it turns into an object and makes it easier as arguments are more descriptive
//Also we have labels for the arguments, as well as it does not matter what order I pass position or imageSrc through
class Sprite {
    constructor ({position, imageSrc}) {
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
    }
//Draw function for sprites
    draw() {
        //Prevent errors in the console if image isn't loaded
        if (!this.image) return
        ctx.drawImage(this.image, this.position.x, this.position.y)
    }
//Update Method For later use for sprites and player class
    update() {
        this.draw()
    }
}

class Player {
  // Use the constructor method to set all properties for "Player"
  constructor() {
    this.position = {
      x: 100,
      y: 100
    };
    this.velocity = {
      x: 0,
      y: 1
    };
    this.width = 30;
    this.height = 30;
  }

  // Define a method that 'draws' the player on the canvas using player class position
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  // Update the player object's position in real-time
  // Add gravity, which is always in play due to instant updates
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      // Add velocity to gravity to make the fall more smooth and natural
      this.velocity.y += gravity;
    } else {
      // Stop the fall if it passes the canvas.height
      this.velocity.y = 0;
    }
  }
}

// Create a class for platforms for the player object to jump on
class Platform {
    //passes x and y inputs through the constructor so that it makes platforms in different places
  constructor({x, y}) {
    this.position = {
      x,
      y
    };
    this.width = 200;
    this.height = 20;
  }

  // Draw a blue rectangle for the platform
  draw() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

// Create a new player object
const player = new Player();

// Create a new Platforms object [array full of platforms]
// Pass through the platform object another object {}

const platforms = [new Platform({x: 200, y: 100}), new Platform({x: 500, y:200}),
    new Platform({x:800, y: 150})]

// Create a keys object (use it to stop horizontal movement)
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
}

//Declare background const as a Sprite with position and imageSrc arguments.
const background = new Sprite ({
    position: {
        x: 0,
        y: 0,
    }, 
    imageSrc: "./img/platformer_background_3.png",

}) 

//Declare scrollOffset (used for win scenario it will count the pixels for both left (-) and right (+) for distance)
let scrollOffset = 0


// Animate velocity of gravity on player object
function animate() {
  requestAnimationFrame(animate);

  //Update Background
  background.update()


  // Clear the canvas to prevent a banner-like effect and maintain the square shape
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.update();

  // Draw the platforms
  platforms.forEach((platform) => {
    platform.draw();
  })
}
  

  // Conditional: As long as the user holds down the right key,
  // the player object will move horizontally to the right by a velocity of 5
  // && creates a barrier at x = 400
  if (keys.right.pressed && player.position.x <400) {
    player.velocity.x = 5;
    // && creates a barrier at x = 100
  } else if (keys.left.pressed && player.position.x > 100) {
    // Player object will move horizontally to the left by a velocity of 5
    // Use a negative value to move left
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0
//When the right boundary is hit when right key (D) is pressed down
//the platform object will move at a rate of -5 (left)
    if (keys.right.pressed) {
        //scrollOffset += 5;
        platforms.forEach((platform) => {
        platform.position.x -= 5
    })
     
//When the right boundary is hit when left key (A) is pressed down
//the platform object will move at a rate of +5 (right)
  } else if (keys.left.pressed) {
    //scrollOffset -= 5;
    platforms.forEach((platform) => {
    platform.position.x += 5
    })
        
  }
}

  // Conditional for object collision detection.
  // Determines whether or not the bottom of the player object is touching the top of the platform object.
  // Player object will fall if it passes the limit of the platform object position.
  platforms.forEach((platform) => {
   if (
     player.position.y + player.height <= platform.position.y &&
     player.position.y + player.height + player.velocity.y >= platform.position.y &&
     player.position.x + player.width >= platform.position.x && 
     player.position.x <= platform.position.x + platform.width
   ) {
     player.velocity.y = 0;
   }
  })

  if (scrollOffset > 2000) {
    console.log('you win')
  }


animate();

// Event listener listens for user keyboard input ("keydown") to move the player object
// keyCode grabs the key code number, which can be found in the console

addEventListener('keydown', ({ keyCode }) => {
  // Code will run only if a key is pressed down
  // Controls player object movement (velocity)
  switch (keyCode) {
    case 65:
      console.log('left');
      keys.left.pressed = true;
      break;
    case 83:
      console.log('down');
      break;
    case 68:
      console.log('right');
      keys.right.pressed = true;
      break;
    case 87:
      console.log('up');
      // Player object jumps because gravity is always pulling it down
      player.velocity.y -= 20;
      break;
  }
  console.log(keys.right.pressed);
});

addEventListener('keyup', ({ keyCode }) => {
  // Code will run only if a key is released (lifted up)
  // Stops player object movement (velocity = 0)
  switch (keyCode) {
    case 65:
      console.log('left');
      keys.left.pressed = false;
      break;
    case 83:
      console.log('down');
      break;
    case 68:
      console.log('right');
      keys.right.pressed = false;
      break;
    case 87:
      console.log('up');
      player.velocity.y = 0;
      break;
  }
});