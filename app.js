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
        this.board.push(new Rook(Files.A, 1, Players.White));
        this.board.push(new Knight(Files.B, 1, Players.White));
        this.board.push(new Bishop(Files.C, 1, Players.White));
        this.board.push(new Queen(Files.D, 1, Players.White));
        this.board.push(new King(Files.E, 1, Players.White));
        this.board.push(new Bishop(Files.F, 1, Players.White));
        this.board.push(new Knight(Files.G, 1, Players.White));
        this.board.push(new Rook(Files.H, 1, Players.White));
    }

    /**
     * Get the array index of a position
     * @param {Number} file 
     * @param {Number} rank 
     */
    getPos(file, rank) {
        return ((8-rank)*8) + (file-1);
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

    /**
     * Get the piece at the specified position
     * @param {Number} file 
     * @param {Number} rank 
     * @returns piece at position
     */
    getPiece(file, rank) {
        return this.board[this.getPos(file, rank)];
    }

    /**
     * Get the piece at an index
     * @param {Number} pos board array index
     */
    getPieceFromPos(pos) {
        return this.board[pos];
    }


    /**
     * Calculate the new position of a piece given a move from the perspective of a player
     * @param {Number} startFile    starting file
     * @param {Number} startRank    starting rank
     * @param {Number} fileMove     number of files to move: + is right, - is left
     * @param {Number} rankMove     number of ranks to move: + is up, - is down
     * @param {Number} color        the player
     * @returns the new position
     */
    calcPos(startFile, startRank, fileMove, rankMove, color) {
        return (color) ? this.getPos(startFile + fileMove, startRank + rankMove):this.getPos(startFile - fileMove, startRank - rankMove);
    }

    /**
     * Checks if a position is on the board
     * @param {Number} file 
     * @param {Number} rank 
     * @returns true is legal, false otherwise
     */
    legalPosition(file, rank) {
        return ((file >= 1) && (file <= 8) && (rank >= 1) && (rank <= 8));
    }


    drawBoard() {
        this.board.forEach((e, i) => {
            let image = (e === null) ? "":"<img src=images/" + (e.color ? "white":"black") + "-" + e.constructor.name.toLowerCase() + ".png>";
            let squareColor = ((i+Math.floor(i/8))%2===1) ? "dark-square":"light-square";
            //"images/white-pawn.png"
            board_container.innerHTML += `<div id="block_${i}" class="square ${squareColor}"><div id="square_${i}" class="square-content">${image}</div></div>`;
            if(e != null) {
                e.getMoves(this);
                console.log(e.moves);
            }
            //console.log(this.getRank(i));
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

    getMoves(board) {
        //Clear past moves
        this.moves= [];
        let oneAhead = board.calcPos(this.file, this.rank, 0, 1, this.color);
        //First move - can move up twice
        if(!this.hasMoved) {
            let twoAhead = board.calcPos(this.file, this.rank, 0, 2, this.color);
            if(board.getPieceFromPos(twoAhead) == null && board.getPieceFromPos(oneAhead) == null) {
                this.moves.push(twoAhead);
            }
        }
        //Move up once
        if(board.getPieceFromPos(oneAhead) == null) {
            this.moves.push(oneAhead);
        }
        //Attacks
        let leftAttack = board.calcPos(this.file, this.rank, -1, 1, this.color);
        if(board.getPieceFromPos(leftAttack) != null && board.getPieceFromPos(leftAttack).color != this.color) {
            this.moves.push(leftAttack);
        }
        let rightAttack = board.calcPos(this.file, this.rank, 1, 1, this.color);
        if(board.getPieceFromPos(rightAttack) != null && board.getPieceFromPos(rightAttack).color != this.color) {
            this.moves.push(rightAttack);
        }
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

    getMoves(board) {
        //Clear past moves
        this.moves = [];
        let ne = true;
        let nw = true;
        let se = true;
        let sw = true;

        for(let i = 1; i <= 9; i++) {
            if(ne) {
                if(board.legalPosition(this.file + i, this.rank + i)) {
                    let pne = board.getPos(this.file + i, this.rank + i);
                    if(board.getPieceFromPos(pne) == null) {
                        this.moves.push(pne);
                    }
                    else if(board.getPieceFromPos(pne).color != this.color) {
                        this.moves.push(pne);
                    }
                    //Ally piece blocking
                    else {
                        ne = false;
                    }
                }
            }
            if(nw) {
                if(board.legalPosition(this.file - i, this.rank + i)) {
                    let pnw = board.getPos(this.file - i, this.rank + i);
                    if(board.getPieceFromPos(pnw) == null) {
                    }
                    else if(board.getPieceFromPos(pnw).color != this.color) {
                    }
                    //Ally piece blocking
                    else {
                        nw = false;
                    }
                }
            }
            if(se) {
                if(board.legalPosition(this.file + i, this.rank - i)) {
                    let pse = board.getPos(this.file + i, this.rank - i);
                    if(board.getPieceFromPos(pse) == null) {
                        this.moves.push(pse);
                        console.log((this.file + i) + "," + (this.rank-i))
                    }
                    else if(board.getPieceFromPos(pse).color != this.color) {
                        this.moves.push(pse);
                    }
                    //Ally piece blocking
                    else {
                        se = false;
                    }
                }
            }
            if(sw) {
                if(board.legalPosition(this.file - i, this.rank - i)) {
                    let psw = board.getPos(this.file - i, this.rank - i);
                    if(board.getPieceFromPos(psw) == null) {
                        this.moves.push(psw);
                    }
                    else if(board.getPieceFromPos(psw).color != this.color) {
                        this.moves.push(psw);
                    }
                    //Ally piece blocking
                    else {
                        sw = false;
                    }
                }
            }
        }
    }

    toString() {return "Bishop"}
}

class Rook extends Piece {
    
    constructor(file, rank, color) {
        super(file, rank, color);
    }

    getMoves(board) {
        this.moves = [];
        let n = true;
        let e = true;
        let s = true;
        let w = true;
        
        for(let i = 1; i <= 8; i++) {
            if(n) {
                if(board.legalPosition(this.file, this.rank + i)) {
                    let pn = board.getPos(this.file, this.rank + i);
                    if(board.getPieceFromPos(pn) == null) {
                        this.moves.push(pn);
                    }
                    else if(board.getPieceFromPos(pn).color != this.color) {
                        this.moves.push(pn);
                    }
                    //Ally piece blocking
                    else {
                        n = false;
                    }
                }
            }
            if(e) {
                if(board.legalPosition(this.file + i, this.rank)) {
                    let pe = board.getPos(this.file + i, this.rank);
                    if(board.getPieceFromPos(pe) == null) {
                        this.moves.push(pe);
                    }
                    else if(board.getPieceFromPos(pe).color != this.color) {
                        this.moves.push(pe);
                    }
                    //Ally piece blocking
                    else {
                        e = false;
                    }
                }
            }
            if(s) {
                if(board.legalPosition(this.file, this.rank - i)) {
                    let ps = board.getPos(this.file, this.rank - i);
                    if(board.getPieceFromPos(ps) == null) {
                        this.moves.push(ps);
                    }
                    else if(board.getPieceFromPos(ps).color != this.color) {
                        this.moves.push(ps);
                    }
                    //Ally piece blocking
                    else {
                        s = false;
                    }
                }
            }
            if(w) {
                if(board.legalPosition(this.file - i, this.rank)) {
                    let pw = board.getPos(this.file - i, this.rank);
                    if(board.getPieceFromPos(pw) == null) {
                        this.moves.push(pw);
                    }
                    else if(board.getPieceFromPos(pw).color != this.color) {
                        this.moves.push(pw);
                    }
                    //Ally piece blocking
                    else {
                        w = false;
                    }
                }
            }
        }
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
