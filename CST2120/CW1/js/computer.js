// Computer.js
// The AI penguin that races the player

import { Penguin } from './penguin.js';

export class Computer extends Penguin {
    constructor(row, col) {
        // We use a different emoji to tell them apart!
        super(row, col, '⛄'); 
    }

    // This finds the shortest path to the goal
    findPath(maze, goalRow, goalCol) {
        // We use a Queue (first in, first out)
        const queue = [{ row: this.row, col: this.col, path: [] }];
        const visited = new Set();
        visited.add(`${this.row},${this.col}`);

        while (queue.length > 0) {
            const current = queue.shift();

            // If we found the goal, return the path!
            if (current.row === goalRow && current.col === goalCol) {
                return current.path;
            }

            // Check all 4 directions (Up, Down, Left, Right)
            const directions = [
                { r: -1, c: 0 }, // Up
                { r: 1, c: 0 },  // Down
                { r: 0, c: -1 }, // Left
                { r: 0, c: 1 }   // Right
            ];

            for (let d of directions) {
                const nextRow = current.row + d.r;
                const nextCol = current.col + d.c;
                const key = `${nextRow},${nextCol}`;

                // If it's not a wall and we haven't been there yet 
                if (!maze.isWall(nextRow, nextCol) && !visited.has(key)) {
                    visited.add(key);
                    // Add to queue, and remember the path we took
                    queue.push({
                        row: nextRow,
                        col: nextCol,
                        path: [...current.path, { row: nextRow, col: nextCol }]
                    });
                }
            }
        }
        return []; // Return empty if no path exists
    }

    // Move one step along the path
    move(maze, goalRow, goalCol) {
        const path = this.findPath(maze, goalRow, goalCol);
        if (path.length > 0) {
            // The first item in the path is our next move
            this.row = path[0].row;
            this.col = path[0].col;
        }
    }
}