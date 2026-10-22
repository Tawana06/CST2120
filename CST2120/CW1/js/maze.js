//this code is for the maze grid and walls

export class Maze {
    constructor(grid) {
        this.grid = grid; // The 2D array of 1s and 0s
        this.rows = grid.length;
        this.cols = grid[0].length;
    }

    // Check if a specific spot is a wall
    isWall(row, col) {
        // If it's outside the grid, treat it like a wall
        if (row < 0 || row >= this.grid.length) return true;
        if (col < 0 || col >= this.grid[0].length) return true;
        
        // Return true if the grid says 1 (wall)
        return this.grid[row][col] === 1;
    }

    // Draw the maze on the canvas
    draw(ctx, cellSize) {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[0].length; col++) {
                const x = col * cellSize;
                const y = row * cellSize;

                //  blue for walls, white for paths
                ctx.fillStyle = this.grid[row][col] === 1 ? '#1bbbdb' : '#ffffff';
                ctx.fillRect(x, y, cellSize, cellSize);
            }
        }
    }
}