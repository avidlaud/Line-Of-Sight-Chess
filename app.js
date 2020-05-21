

function LOSChess() {
    this.board_container = document.querySelector(".board");
    this.board = []
}

LOSChess.createNewBoard = function() {

}

/**
 * Defines a board state
 */

class Board {

    constructor () {
        this.board = [];
    }

    setNewBoard() {
        this.board = [];
        for(let i = 0; i < 64; i++) {
            this.board.push(new Pawn(i, i, true));
        }
        /*
        for(let i = 0; i < 64; i++) {
            this.board.push(i);
        }
        */
    }

    drawBoard() {
        this.board.forEach((e, i) => {
            game.board_container.innerHTML += `<div id="block_${i}" class="square"><div id="square_${i}" class="square-content">${this.board[i]}</div></div>`
        })
    }

    get() {
        return this.board;
    }

}

/**
 * Abstraction of a piece - serves as an abstract superclass to all pieces
 */
class Piece {

    constructor(rank, file, color) {
        this.rank = rank;
        this.file = file;
        this.color = color;
        this.hasMoved = false;
        this.moves = [];
    }

    /**
     * Abstract
     */
    getMoves(board) {

    }

}

class Pawn extends Piece{

    constructor(rank, file, color) {
        super(rank, file, color);
    }

    toString() {
        return "Pawn";
    }
}

game = new LOSChess();
gameboard = new Board();
gameboard.setNewBoard();
gameboard.drawBoard();