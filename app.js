let board_container = document.querySelector(".board");

const Files = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8
}

const Positions = {
    A8:0,   B8:1,   C8:2,   D8:3,   E8:4,   F8:5,   G8:6,   H8:7,
    A7:8,   B7:9,   C7:10,  D7:11,  E7:12,  F7:13,  G7:14,  H7:15,
    A6:16,  B6:17,  C6:18,  D6:19,  E6:20,  F6:21,  G6:22,  H6:23,
    A5:24,  B5:25,  C5:26,  D5:27,  E5:28,  F5:29,  G5:30,  H5:31,
    A4:32,  B4:33,  C4:34,  D4:35,  E4:36,  F4:37,  G4:38,  H4:39,
    A3:40,  B3:41,  C3:42,  D3:43,  E3:44,  F3:45,  G3:46,  H3:47,
    A2:48,  B2:49,  C2:50,  D2:51,  E2:52,  F2:53,  G2:54,  H2:55,
    A1:56,  B1:57,  C1:58,  D1:59,  E1:60,  F1:61,  G1:62,  H1:63
}

const Players = {
    White: true,
    Black: false
}

/**
 * Find the position that an index represents
 * @param {Number}  index Index in array representation of board
 * @returns board position
 */
function getPosFromIndex(index) {
    return Object.keys(Positions).find(key => Positions[key] === index);
}



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
        /*
        for(let i = 0; i < 64; i++) {
            this.board.push(new Pawn(i, i, true));
        }
        */
        this.board.push(new Rook(Files.A, 8, Players.Black));
        this.board.push(new Knight(Files.B, 8, Players.Black));
        this.board.push(new Bishop(Files.C, 8, Players.Black));
        this.board.push(new Queen(Files.D, 8, Players.Black));
        this.board.push(new King(Files.E, 8, Players.Black));
        this.board.push(new Bishop(Files.F, 8, Players.Black));
        this.board.push(new Knight(Files.G, 8, Players.Black));
        this.board.push(new Rook(Files.H, 8, Players.Black));
        for(let i = 1; i <= 8; i++) {
            this.board.push(new Pawn(i, 7, Players.Black));
        }
        for(let i = 0; i < 32; i++) {
            this.board.push(null);
        }
        for(let i = 1; i <= 8; i++) {
            this.board.push(new Pawn(i, 2, Players.White));
        }
        this.board.push(new Rook(Files.A, 8, Players.White));
        this.board.push(new Knight(Files.B, 8, Players.White));
        this.board.push(new Bishop(Files.C, 8, Players.White));
        this.board.push(new Queen(Files.D, 8, Players.White));
        this.board.push(new King(Files.E, 8, Players.White));
        this.board.push(new Bishop(Files.F, 8, Players.White));
        this.board.push(new Knight(Files.G, 8, Players.White));
        this.board.push(new Rook(Files.H, 8, Players.White));
    }

    /**
     * Get the piece at the specified position
     * @param {Number} file 
     * @param {Number} rank 
     * @returns piece at position
     */
    getPiece(file, rank) {
        return this.board[((8-rank)*8) + (file-1)];
    }

    /**
     * Get the file and rank of a position
     * @param {Number} pos board array index
     */
    getFileRank(pos) {
        return {
            file: this.getFile(pos),
            rank: this.getRank(pos)
        }
    }

    /**
     * Get the file of a position
     * @param {Number} pos board array index
     * @returns file
     */
    getFile(pos) {
        return (pos % 8) + 1;
    }

    /**
     * Get the rank of a position
     * @param {Number} pos board array index
     */
    getRank(pos) {
        return 8-Math.floor(pos/8);
    }



    drawBoard() {
        this.board.forEach((e, i) => {
            let image = (e === null) ? "":"<img src=images/" + (e.color ? "white":"black") + "-" + e.constructor.name.toLowerCase() + ".png>";
            let squareColor = ((i+Math.floor(i/8))%2===1) ? "dark-square":"light-square";
            //"images/white-pawn.png"
            board_container.innerHTML += `<div id="block_${i}" class="square ${squareColor}"><div id="square_${i}" class="square-content">${image}</div></div>`;
            console.log(this.getRank(i));
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

    constructor(file, rank, color) {
        this.file = file;
        this.rank = rank;
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

    constructor(file, rank, color) {
        super(file, rank, color);
    }

    toString() {return "Pawn";}
}

class Knight extends Piece {

    constructor(file, rank, color) {
        super(file, rank, color);
    }

    toString() { return "Knight"}
}

class Bishop extends Piece {

    constructor(file, rank, color) {
        super(file, rank, color);
    }

    toString() {return "Bishop"}
}

class Rook extends Piece {
    
    constructor(file, rank, color) {
        super(file, rank, color);
    }

    toString() {return "Rook"}
}

class Queen extends Piece {

    constructor(file, rank, color) {
        super(file, rank, color);
    }

    toString() {return "Queen"}
}

class King extends Piece {

    constructor(file, rank, color) {
        super(file, rank, color);
    }

    toString() {return "King"}
}

game = new LOSChess();
