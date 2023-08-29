// index.js

// Get the canvas element
const canvas = document.querySelector('canvas');

// Get the 2D drawing context
const ctx = canvas.getContext('2d');

//Makes width entire window width
canvas.width = window.innerWidth;

//Makes width entire window height
canvas.height = window.innerHeight;

class Player {
//Using class constructor method to set all properties for "Player"// 
    constructor() {
        this.position = {
            x: 100,
            y: 100
        };
        this.width = 30;
        this.height = 30;
    };
//Define method that 'draws' the player on canvas that references player class position//
    draw() {
        ctx.fillStyle = "red" 
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// Create new player object
const player = new Player();
player.draw();
