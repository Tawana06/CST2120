
//   sets up the game and draws it

import { Maze } from './maze.js';
import { Player } from './player.js';
import { Computer } from './computer.js';

//Setup the canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let currentLevel = 1;
let bounceOffset = 0;


//The maze data (1 = wall, 0 = path)
// Generates a perfect maze using Recursive Backtracking
function generateMaze(level) {
    // Make sure the size is always an odd number so the maze looks right
    let size = 10 + (level - 1) * 4;
    if (size % 2 === 0) size++; 

    // 1. Fill the entire grid with walls (1)
    const grid = [];
    for (let r = 0; r < size; r++) {
        const row = [];
        for (let c = 0; c < size; c++) {
            row.push(1);
        }
        grid.push(row);
    }

    // 2. Dig the maze starting from cell (1,1)
    const stack = [{ r: 1, c: 1 }];
    grid[1][1] = 0; // Start cell is a path

    const directions = [
        { dr: -2, dc: 0 }, // Up
        { dr: 2, dc: 0 },  // Down
        { dr: 0, dc: -2 }, // Left
        { dr: 0, dc: 2 }   // Right
    ];

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        
        // Find unvisited neighbors
        const unvisitedNeighbors = [];
        for (let d of directions) {
            const newR = current.r + d.dr;
            const newC = current.c + d.dc;
            // Check bounds and if it's still a wall (unvisited)
            if (newR > 0 && newR < size - 1 && newC > 0 && newC < size - 1 && grid[newR][newC] === 1) {
                unvisitedNeighbors.push({ r: newR, c: newC, dr: d.dr, dc: d.dc });
            }
        }

        if (unvisitedNeighbors.length > 0) {
            // Pick a random neighbor
            const next = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
            
            // Knock down the wall between current and next
            grid[current.r + next.dr / 2][current.c + next.dc / 2] = 0;
            // Make the next cell a path
            grid[next.r][next.c] = 0;
            
            // Move to the next cell
            stack.push({ r: next.r, c: next.c });
        } else {
            // Dead end, backtrack
            stack.pop();
        }
    }

    // 3. Make sure the goal cell (bottom right) is a path
    grid[size - 2][size - 2] = 0;

    return grid;
}

//Create the Maze and Player objects
let maze = new Maze(generateMaze(currentLevel));
let player = new Player(1, 2); // Start at row 1, col 2
let computer = new Computer(1, 1); // Starts at the top right
let goal = { row: maze.rows - 2, col: maze.cols - 2 }; // Goal position
let cellSize = canvas.width / maze.cols; // Canvas is 500px wide

//Listen for arrow keys
document.addEventListener('keydown', (event) => {

    // STOP! If there is a win/lose message, don't allow any more moves.
    if (document.getElementById('gameMessage').textContent !== "") {
        return;
    }
    if (event.key === 'ArrowUp') player.move(-1, 0, maze);
    if (event.key === 'ArrowDown') player.move(1, 0, maze);
    if (event.key === 'ArrowLeft') player.move(0, -1, maze);
    if (event.key === 'ArrowRight') player.move(0, 1, maze);

    // Check if the player reached the goal!
    if (player.row === goal.row && player.col === goal.col) {
        const winAudio = document.getElementById('winSound');
        winAudio.currentTime = 0;
        winAudio.play();

        setTimeout(() => {
            winAudio.pause();
            winAudio.currentTime = 0;
        }, 1600); // Stop the sound after 1.6 seconds
        // Increase the level
        currentLevel++;
        
        //Update the text on the screen
        document.getElementById('levelDisplay').textContent = currentLevel;
        
        //Show a message
        document.getElementById('gameMessage').textContent = `🏆 Level Cleared! Get ready for Level ${currentLevel}... 🏆`;
        document.getElementById('gameMessage').className = "success";
        
        // reset the game after a short delay
        setTimeout(() => {

            //Build a new maze!
            maze = new Maze(generateMaze(currentLevel));
            cellSize = canvas.width / maze.cols;
            
            //Update the goal
            goal = { row: maze.rows - 2, col: maze.cols - 2 };
            //Reset the penguins
            player.row = 1;
            player.col = 2;
            computer.row = 1;
            computer.col = 1;
            document.getElementById('gameMessage').textContent = "";
            render();
        }, 2000);
        
        return; // Stop here so the computer doesn't move
    }

    // The computer moves one step every time you move
    computer.move(maze, goal.row, goal.col);


    // Check if the computer reached the goal!
    if (computer.row === goal.row && computer.col === goal.col) {
        document.getElementById('loseSound').play();
        document.getElementById('gameMessage').textContent = "💀 Computer Wins! 💀";
        document.getElementById('gameMessage').className = "error";
    }

    render(); // Redraw the screen after moving
});

//The drawing function
function render() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the maze
    maze.draw(ctx, cellSize);

    // Draw the GOAL flag
    const goalX = goal.col * cellSize;
    const goalY = goal.row * cellSize;
    ctx.font = `${cellSize * 0.7}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚩', goalX + cellSize / 2, goalY + cellSize / 2 + 2);

    // Calculate the bounce animation (moves between -3 and +3 pixels)
    bounceOffset = Math.sin(Date.now() / 150) * 3;
    
    // Draw the player penguin
    const x = player.col * cellSize;
    const y = player.row * cellSize;
    ctx.font = `${cellSize * 0.7}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(player.emoji, x + cellSize / 2, y + cellSize / 2 + 2 + bounceOffset);

    // Draw the computer penguin
    const compX = computer.col * cellSize;
    const compY = computer.row * cellSize;
    ctx.fillText(computer.emoji, compX + cellSize / 2, compY + cellSize / 2 + 2 + bounceOffset);
}

// Draw the game for the first time
render();

//restart button click
document.getElementById('restartButton').addEventListener('click', () => {
    //Put the penguins back at the start
    player.row = 1;
    player.col = 2;
    
    computer.row = 1;
    computer.col = 1;
    
    //Clear the win/lose message so the game unfreezes
    document.getElementById('gameMessage').textContent = "";
    
    //Redraw the screen
    render();
});

// Start background music when the player presses their first key
document.addEventListener('keydown', () => {
    const bgMusic = document.getElementById('bgMusic');
    // Only play if it's paused
    if (bgMusic.paused) {
        bgMusic.volume = 0.3; // Keep it quiet so it's not annoying
        bgMusic.play();
    }
}, { once: true }); // The { once: true } means this only runs one time!

// Tell the browser to redraw the screen 60 times a second for smooth animation
function animationLoop() {
    render();
    requestAnimationFrame(animationLoop);
}

// Start the animation loop
animationLoop();