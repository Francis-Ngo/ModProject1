// index.js

// Get the canvas element
const canvas = document.querySelector('canvas');

// Get the 2D drawing context
const ctx = canvas.getContext('2d');

//Makes width entire window width
canvas.width = window.innerWidth;

//Makes width entire window height
canvas.height = window.innerHeight;

//adds realistic gravity physics by declaring var
const gravity = 0.5;
class Player {
//Using class constructor method to set all properties for "Player"// 
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
    };
//Define method that 'draws' the player on canvas that references player class position//
    draw() {
        ctx.fillStyle = "red" 
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
//Updates the player object position in real time
//Adds gravity which is always in play due to instant updates
    update() {
        this.draw();
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        
        if (this.position.y +this.height + this.velocity.y <= canvas.height)
        //adds the velocity to gravity and makes the fall more smooth and natural
            this.velocity.y += gravity
        //Stops the fall if it passes the canvas.height
        else this.velocity.y = 0
    }
}

//Create a class for platforms for player object to jump on
class Platform {
    constructor() {
      this.position = {
        x: 200,
        y: 100
      }

      this.width = 200
      this.height = 20
    }
}
//Draw a blue rectangle for the platform
function draw() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
}
// Create new player object
const player = new Player();
// Create new Platform object
const platform = new Platform();
// Create keys object (using for x = 0 stopping horizontal movement)
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
};


// Animates velocity of gravity on player object
function animate() {
    requestAnimationFrame(animate);
    //Makes sure to clear canvas of banner like effect and maintains the square shape
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    //Draws the platform
    platform.draw();
    //Conditional, as long as (If) user holds down the right key, 
    //player object will move horizontally to the right by a velocity of 5
    if (keys.right.pressed) {
        player.velocity.x = 5
    //Else right pressed = false (key is released and comes up)
    //player object will stop moving horizontally to the right. (velocity = 0)
    } //player object will move horizontally to the left by a velocity of 5
    else if (keys.left.pressed) {
    //Notice a negative 5 will move player object to the left 
    //(if you put positive 5 it will move object to the right)
        player.velocity.x = -5
    //Else left pressed = false (key is released and comes up)
    //player object will stop moving horizontally to the left. (velocity = 0)
    } else player.velocity.x = 0
    //Conditional for Object Collision detection. Determines whether or not the bottom of the 
    // player object is touching the top of the platform object.
    // player object will fall if it passes the limit of the platform position.
    if (player.position.y + player.height <= platform.position.y 
        && player.position.y + player.velocity.y >= platform.position.y 
        && player.position.x + player.width >= platform.position.x) {
        player.velocity.y = 0 && player.position.x <= platform.position.x + platform.width
    }
//This makes player object fall down when it is not on the platform object.
};

animate();

//eventListener listen for user input keyboard commands "key pressed down" to move player object
//keyCode grabs key pressed down the keyCode number which can be found in console

addEventListener('keydown', ({ keyCode }) => {
    //console.log(keyCode)
    //Code will run only if key is pressed down
    //Controls player object movement (velocity)
    switch (keyCode) {
        //Code will run only if the 'a' key (keyCode #65) is pressed down
        case 65: 
        console.log('left')
        keys.left.pressed = true
        break
        //Code will run only if the 's' key (keyCode #83) is pressed down
        case 83: 
        console.log('down')
        break
        //Code will run only if the 'd' key (keyCode #68) is pressed down
        case 68: 
        console.log('right')
        keys.right.pressed = true
        break
        //Code will run only if the 'w' key (keyCode #87) is pressed down
        case 87: 
        console.log('up')
        //player object jumps because gravity is always pulling down on player object
        player.velocity.y -= 20
        break
    }
    console.log(keys.right.pressed)
})

addEventListener('keyup', ({ keyCode }) => {
    //console.log(keyCode)
    //Code will run only if key is released and lifts up (when player stops pressing key down)
    //Stops player object movement (velocity = 0)
    switch (keyCode) {
        //Code will run only if the 'a' key (keyCode #65) is released
        case 65: 
        console.log('left')
        keys.left.pressed = false
        break
        //Code will run only if the 's' key (keyCode #83) is is released
        case 83: 
        console.log('down')
        break
        //Code will run only if the 'd' key (keyCode #68) is is released
        case 68: 
        console.log('right')
        keys.right.pressed = false
        break
        //Code will run only if the 'w' key (keyCode #87) is is released
        console.log('up')
        //player object jumps because gravity is always pulling down on player object
        player.velocity.y = 0
        break
    }
})