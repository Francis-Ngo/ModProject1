// Create a new Image instance for the platform
const platform = new Image();

// Set the source (path) of your platform image
platform.src = './img/Mod1_Platform_Grass.png';

// Wait for the image to load
platform.onload = () => {
  console.log(platform);

  // Get the canvas element
  const canvas = document.querySelector('canvas');

  // Get the 2D drawing context
  const ctx = canvas.getContext('2d');

  // Make canvas width and height match window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Add realistic gravity physics by declaring a variable
  const gravity = 0.5;

  // Create Sprite Class for passing an image source through the constructor function
  class Sprite {
    constructor({ position, imageSrc }) {
      this.position = position;
      this.image = new Image();
      this.image.src = imageSrc;
    }

    // Draw function for sprites
    draw() {
      // Prevent errors in the console if the image isn't loaded
      if (!this.image.complete) return;
      ctx.drawImage(this.image, this.position.x, this.position.y);
    }

    // Update Method for later use with sprites and player class
    update() {
      this.draw();
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
    constructor({ x, y, image }) {
      this.position = {
        x,
        y
      };
      this.image = image; // You missed assigning the image
      this.width = 200;
      this.height = 20;
    }

    // Draw a blue rectangle for the platform
    draw() {
      ctx.fillStyle = 'blue';
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  }

  // Create a new Player object
  const player = new Player();

  // Create a new Platforms array
  const platforms = [
    new Platform({ x: 200, y: 100, image: platform }),
    new Platform({ x: 500, y: 200, image: platform }),
    new Platform({ x: 800, y: 150, image: platform })
  ];

  // Create a keys object (use it to stop horizontal movement)
  const keys = {
    right: {
      pressed: false,
    },
    left: {
      pressed: false,
    },
  };

  // Declare background const as a Sprite with position and imageSrc arguments.
  const background = new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    imageSrc: './img/platformer_background_3.png', // You should uncomment this line
  });

  // Declare scrollOffset (used for win scenario it will count the pixels for both left (-) and right (+) for distance)
  let scrollOffset = 0;

  // Animate velocity of gravity on player object
  function animate() {
    requestAnimationFrame(animate);

    // Update Background
    background.update();

    // Clear the canvas to prevent a banner-like effect and maintain the square shape
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();

    // Draw the platforms
    platforms.forEach((platform) => {
      platform.draw();
    });

    // Conditional for horizontal movement
    if (keys.right.pressed && player.position.x < 400) {
      player.velocity.x = 5;
    } else if (keys.left.pressed && player.position.x > 100) {
      player.velocity.x = -5;
    } else {
      player.velocity.x = 0;
    }

    // Conditional for object collision detection.
    platforms.forEach((platform) => {
      if (
        player.position.y + player.height <= platform.position.y &&
        player.position.y + player.height + player.velocity.y >= platform.position.y &&
        player.position.x + player.width >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width
      ) {
        player.velocity.y = 0;
      }
    });

    if (scrollOffset > 2000) {
      console.log('you win');
    }
  }

  animate();
};

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
