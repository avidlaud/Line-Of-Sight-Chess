let board_container = document.querySelector(".board");

class LOSChess {

    constructor() {
        this.gameboard = new Board();
        this.gameboard.setNewBoard();
        this.gameboard.drawBoard();
    }
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
    }

    drawBoard() {
        this.board.forEach((e, i) => {
            let color = e.color ? "white":"black";
            let type = "images/" + color + "-" + e.constructor.name.toLowerCase() + ".png";
            //"images/white-pawn.png"
            board_container.innerHTML += `<div id="block_${i}" class="square square-color-${(i+Math.floor(i/8))%2}"><div id="square_${i}" class="square-content"><img src=${type}></div></div>`;
            console.log(type);
        });
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

    toString() {return "Pawn";}
}

class Knight extends Piece {

    constructor(rank, file, color) {
        super(rank, file, color);
    }

    toString() { return "Knight"}
}

class Bishop extends Piece {

    constructor(rank, file, color) {
        super(rank, file, color);
    }

    toString() {return "Bishop"}
}

class Rook extends Piece {
    
    constructor(rank, file, color) {
        super(rank, file, color);
    }

    toString() {return "Rook"}
}

class Queen extends Piece {

    constructor(rank, file, color) {
        super(rank, file, color);
    }

    toString() {return "Queen"}
}

class King extends Piece {

    constructor(rank, file, color) {
        super(rank, file, color);
    }

    toString() {return "King"}
}

game = new LOSChess();
