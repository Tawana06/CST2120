//the player controlled penguin
import { Penguin } from './penguin.js';

export class Player extends Penguin {
    constructor(row, col,) {
        super(row, col,'🐧');
    }

    //moving but also solidifying walls so the player can't move through them
    move( mrow, mcol, maze) {
        const newRow = this.row + mrow;
        const newCol = this.col + mcol;

        if (!maze.isWall(newRow, newCol)) {
            this.row = newRow;
            this.col = newCol;
        } 

    } 
}
