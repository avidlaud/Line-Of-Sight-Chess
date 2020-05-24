let board_container = document.querySelector(".board");
let game_information = document.querySelector(".game-information");

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
        this.selected = null;
        this.playerTurn = true;
    }

    selectPiece(event) {
        event.dataTransfer.setData("pos", event.target.parentNode.id.slice(7));
        console.log(event.target.parentNode.id.slice(7));
        /*
        console.log(this.gameboard.getMoves(true));
        let tb = this.gameboard.copyBoard();
        tb.move(tb.getPieceFromPos(8), 16, false);
        console.log(tb);
        console.log(tb.boardWithCheck());
        */
        //console.log(this.gameboard.getMoves(true));
        this.selected = this.gameboard.getPieceFromPos(event.target.parentNode.id.slice(7));
    }

    allowDrop(event) {
        event.preventDefault();
    }

    drop(event) {
        event.preventDefault
        //Dropped on a square or piece
        if(event.target.localName == "img" || event.target.localName == "div") {
            game_information.innerHTML = "";
            //Dropped on a square
            let targetSquare;
            if(event.target.localName == "div") {
                targetSquare = event.target.id.slice(6);

            }
            //Dropped on top of a piece
            else { //(event.target.localName == "img") 
                targetSquare = event.target.parentNode.id.slice(7);
            }
            console.log(targetSquare);
            this.gameboard.getMoves(this.playerTurn).forEach(m => {
                //Find if legal move
                if(m.piece == this.selected && m.startPos == this.gameboard.getPos(this.selected.file, this.selected.rank) && m.endPos == targetSquare) {
                    this.gameboard.move(this.selected, targetSquare, this.playerTurn);
                    //Check if this puts other player in check
                    if(this.gameboard.boardWithCheck(!this.playerTurn)) {
                        game_information.innerHTML += `<h1>Player in Check</h1>`;
                        //Check if checkmate - no valid moves
                        if(this.gameboard.getMoves(!this.playerTurn).length == 0) {
                            game_information.innerHTML += `<h1>Checkmate</h1>`;
                        }
                    }
                    
                    this.playerTurn = !this.playerTurn;
                    this.selected = null;
                }
            });
            this.gameboard.drawBoard();
        }
        console.log(this.gameboard.enPassantSquare);
    }


}

/**
 * Defines a board state
 */

class Board {

    constructor () {
        this.board = [];
    }

    whiteKing;

    blackKing;

    enPassantSquare;

    /**
     * Set up initial board state
     */
    setNewBoard() {
        this.board = [];
        this.board.push(new Rook(Files.A, 8, Players.Black));
        this.board.push(new Knight(Files.B, 8, Players.Black));
        this.board.push(new Bishop(Files.C, 8, Players.Black));
        this.board.push(new Queen(Files.D, 8, Players.Black));
        this.blackKing = new King(Files.E, 8, Players.Black);
        this.board.push(this.blackKing);
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
        this.whiteKing = new King(Files.E, 1, Players.White)
        this.board.push(this.whiteKing);
        this.board.push(new Bishop(Files.F, 1, Players.White));
        this.board.push(new Knight(Files.G, 1, Players.White));
        this.board.push(new Rook(Files.H, 1, Players.White));
        this.enPassantSquare = null;
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

    /**
     * Replace the piece at a position with a new specified piece
     * @param {Number} pos 
     * @param {Piece} newPiece 
     * @returns the piece previously in the position
     */
    replacePiece(pos, newPiece) {
        let oldPiece = this.board[pos];
        this.board.splice(pos, 1, newPiece);
        return oldPiece;
    }

    /**
     * Perform a move on the board
     * @param {Piece} piece the piece to move
     * @param {Number} target board array position to move to
     * @param {Boolean} color player who owns piece
     */
    move(piece, target, color) {
        //Castling
        if(piece.constructor.name == "King" && !piece.hasMoved && (Math.abs(this.getFile(target)-piece.file) > 1)) {
            let castleRank = color ? 1:8;
            //King side castle
            if(this.getFile(target) == 7) {
                //Move rook
                this.replacePiece(this.getPos(6, castleRank), this.getPiece(8, castleRank));
                console.log(this.board);
                this.getPiece(6, castleRank).file = 6;
                this.replacePiece(this.getPos(8, castleRank), null);
                //Move king
                this.replacePiece(this.getPos(7, castleRank), this.getPiece(5, castleRank));
                this.getPiece(7, castleRank).file = 7;
                this.replacePiece(this.getPos(5, castleRank), null);
                this.enPassantSquare = null;
            }
            //Queen side castle
            else {
                //Move rook
                this.replacePiece(this.getPos(4, castleRank), this.getPiece(1, castleRank));
                this.getPiece(4, castleRank).file = 4;
                this.replacePiece(this.getPos(1, castleRank), null);
                //Move king
                this.replacePiece(this.getPos(3, castleRank), this.getPiece(5, castleRank));
                this.getPiece(3, castleRank).file = 3;
                this.replacePiece(this.getPos(5, castleRank), null);
                this.enPassantSquare = null;
            }
        }
        //Pawn promotion
        if(piece.constructor.name == "Pawn" && ((color && this.getRank(target) == 8) || (!color && this.getRank(target) == 1))) {
            let sourcePos = this.getPos(piece.file, piece.rank);
            this.replacePiece(target, new Queen(this.getFile(target), this.getRank(target), color));
            this.replacePiece(sourcePos, null);
            this.enPassantSquare = null;
        }
        else {
            //En Passant
            if(piece.constructor.name == "Pawn" && target == this.enPassantSquare) {
                if(color) { //White en passant - remove pawn one rank down
                    this.replacePiece(this.getPos(this.getFile(target), this.getRank(target)-1), null);
                }
                else { //Black en passant - remove pawn one rank up
                    this.replacePiece(this.getPos(this.getFile(target), this.getRank(target)+1), null);
                }
            }
            let sourcePos = this.getPos(piece.file, piece.rank);
            this.replacePiece(target, piece);
            piece.file = this.getFile(target);
            piece.rank = this.getRank(target);
            piece.hasMoved = true;
            this.replacePiece(sourcePos, null);
            //If pawn moves up twice, set en passant
            if(piece.constructor.name == "Pawn" && (Math.abs(this.getRank(sourcePos) - this.getRank(target)) > 1)) {
                this.enPassantSquare = this.getPos(this.getFile(target), ((this.getRank(sourcePos)+this.getRank(target))/2));
            }
            else {
                this.enPassantSquare = null;
            }
        }
    }

    /**
     * Find all legal moves 
     * @param {Boolean} color 
     * @returns array of legal moves
     */
    getMoves(color) {
        let pieces = this.board.filter(p => p != null).filter(p => p.color == color);
        let legalMoves = [];
        pieces.forEach(p => {
            p.getMoves(this);
            p.moves.forEach(m => {
                //"Play" move and see if it would put own king in check
                let oldPos = this.getPos(p.file, p.rank);
                let testBoard = this.copyBoard();
                let testPiece = testBoard.getPiece(p.file, p.rank);
                testBoard.move(testPiece, m, color);
                if(!testBoard.boardWithCheck(color)) {
                    legalMoves.push(new Move(p, oldPos, m));
                }
            });
        });
        return legalMoves;
    }

    /**
     * Determines if a position is under attack by the enemy
     * @param {Number} pos position to check
     * @param {Boolean} color player who may be "attacked"
     */
    attacked(pos, color) {
        let enemyMoves = [];
        let enemyPieces = this.board.filter(p => p != null).filter(p => p.color != color);
        let isAttacked = false;
        enemyPieces.forEach(p => {
            //Must be handled differently to eliminate infinite recursion
            if(p.constructor.name == "King") {
                if(p.getAttacks(this).filter(m => m == pos).length > 0) {
                    isAttacked = true;
                }
            }
            else if(p.constructor.name == "Pawn") {
                p.getMoves(this);
                if(p.moves.filter(m => ((m == pos) && (this.getFile(m) != p.file))).length > 0) {
                    isAttacked = true;
                }
            }
            else {
                p.getMoves(this);
                if(p.moves.filter(m => m == pos).length > 0) {
                    isAttacked = true;
                }
            }
        })
        return isAttacked;
    }

    /**
     * Determines if there is a check on the board
     * @param {Boolean} color 
     * @returns true if check, false otherwise
     */
    boardWithCheck(color) {
        //Determine position of king
        let myKing = color ? this.whiteKing:this.blackKing;
        let kingPos = this.getPos(myKing.file, myKing.rank);
        //Find if any piece attacks it
        let enemyPieces = this.board.filter(p => p != null).filter(p => p.color != color);
        let underAttack = false;
        enemyPieces.forEach(p => {
            p.getMoves(this);
            p.moves.forEach(m => {
                if(m == kingPos) {
                    underAttack = true;
                    return;
                }
            });
        });
        return underAttack;
    }

    /**
     * Edit the html to display the current board state
     */
    drawBoard() {
        board_container.innerHTML = "";
        this.board.forEach((e, i) => {
            let image = (e === null) ? "":"<img src=images/" + (e.color ? "white":"black") + "-" + e.constructor.name.toLowerCase() + ".png>";
            let squareColor = ((i+Math.floor(i/8))%2===1) ? "dark-square":"light-square";
            //"images/white-pawn.png"
            board_container.innerHTML += `<div id="block_${i}" class="square ${squareColor}" ondragover="game.allowDrop(event)" ondrop="game.drop(event)"><div id="square_${i}" class="square-content" draggable="true" ondragstart="game.selectPiece(event)">${image}</div></div>`;
            if(e != null) {
                e.getMoves(this);
            }
            //console.log(this.getRank(i));
        });
    }

    /**
     * Returns a copy of the current board state
     */
    copyBoard() {
        let copy = new Board();
        this.board.forEach(p => {
            if(p == null) {
                copy.board.push(null);
            }
            else {
                if(p.constructor.name == "King") {
                    if(p.color) {
                        copy.whiteKing = p;
                    }
                    else {
                        copy.blackKing = p;
                    }
                }
                copy.board.push(p.copyPiece());
            }
        });
        return copy;
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

    /**
     * Abstract
     */
    copyPiece() {

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
        //En Passant
        if(board.calcPos(this.file, this.rank, 1, 1, this.color) == board.enPassantSquare || board.calcPos(this.file, this.rank, -1, 1, this.color) == board.enPassantSquare) {
            this.moves.push(board.enPassantSquare);
        }
    }

    copyPiece() {
        return new Pawn(this.file, this.rank, this.color);
    }

    toString() {return "Pawn";}
}

class Knight extends Piece {

    constructor(file, rank, color) {
        super(file, rank, color);
    }

    knightMoves = [[1,2], [1,-2], [2,1], [2,-1], [-1,2], [-1,-2], [-2,1], [-2,-1]];

    getMoves(board) {
        this.board = [];
        this.knightMoves.forEach(e => {
            if(board.legalPosition(this.file + e[0], this.rank + e[1])) {
                let targetPiece = board.getPos(this.file + e[0], this.rank + e[1]);
                if(board.getPieceFromPos(targetPiece) == null) {
                    this.moves.push(targetPiece);
                }
                else if(board.getPieceFromPos(targetPiece).color != this.color) {
                    this.moves.push(targetPiece);
                }
            }
        } );
    }

    copyPiece() {
        return new Knight(this.file, this.rank, this.color);
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
                        ne = false;
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
                        this.moves.push(pnw);
                    }
                    else if(board.getPieceFromPos(pnw).color != this.color) {
                        this.moves.push(pnw);
                        nw = false;
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
                    }
                    else if(board.getPieceFromPos(pse).color != this.color) {
                        this.moves.push(pse);
                        se = false;
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
                        sw = false;
                    }
                    //Ally piece blocking
                    else {
                        sw = false;
                    }
                }
            }
        }
    }

    copyPiece() {
        return new Bishop(this.file, this.rank, this.color);
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
                        n = false;
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
                        e = false;
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
                        s = false;
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
                        w = false;
                    }
                    //Ally piece blocking
                    else {
                        w = false;
                    }
                }
            }
            
        }
    }

    copyPiece() {
        return new Rook(this.file, this.rank, this.color);
    }

    toString() {return "Rook"}
}

class Queen extends Piece {

    constructor(file, rank, color) {
        super(file, rank, color);
    }

    getMoves(board) {
        this.moves = [];
        let n = true;
        let e = true;
        let s = true;
        let w = true;
        let ne = true;
        let nw = true;
        let se = true;
        let sw = true;

        for(let i = 1; i <= 8; i++) {
            if(n) {
                if(board.legalPosition(this.file, this.rank + i)) {
                    let pn = board.getPos(this.file, this.rank + i);
                    if(board.getPieceFromPos(pn) == null) {
                        this.moves.push(pn);
                    }
                    else if(board.getPieceFromPos(pn).color != this.color) {
                        this.moves.push(pn);
                        n = false;
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
                        e = false;
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
                        s = false;
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
                        w = false;
                    }
                    //Ally piece blocking
                    else {
                        w = false;
                    }
                }
            }
            if(ne) {
                if(board.legalPosition(this.file + i, this.rank + i)) {
                    let pne = board.getPos(this.file + i, this.rank + i);
                    if(board.getPieceFromPos(pne) == null) {
                        this.moves.push(pne);
                    }
                    else if(board.getPieceFromPos(pne).color != this.color) {
                        this.moves.push(pne);
                        ne = false;
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
                        this.moves.push(pnw);
                    }
                    else if(board.getPieceFromPos(pnw).color != this.color) {
                        this.moves.push(pnw);
                        nw = false;
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
                    }
                    else if(board.getPieceFromPos(pse).color != this.color) {
                        this.moves.push(pse);
                        se = false;
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
                        sw = false;
                    }
                    //Ally piece blocking
                    else {
                        sw = false;
                    }
                }
            }
        }
    }

    copyPiece() {
        return new Queen(this.file, this.rank, this.color);
    }

    toString() {return "Queen"}
}

class King extends Piece {

    constructor(file, rank, color) {
        super(file, rank, color);
    }

    kingMoves = [[1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1,], [0,-1], [1,-1]];

    getMoves(board) {
        this.moves = [];
        this.kingMoves.forEach(e => {
            if(board.legalPosition(this.file + e[0], this.rank + e[1])) {
                let targetPiece = board.getPos(this.file + e[0], this.rank + e[1]);
                if(board.getPieceFromPos(targetPiece) == null) {
                    this.moves.push(targetPiece);
                }
                else if(board.getPieceFromPos(targetPiece).color != this.color) {
                    this.moves.push(targetPiece);
                }
            }
        } );
        //Castling
        if(!this.hasMoved) {
            let castleRank = this.color ? 1:8;
            //King side castle
            let kingRook = board.getPieceFromPos(board.getPos(8, castleRank));
            if(kingRook != null && kingRook.constructor.name == "Rook" && !kingRook.hasMoved) {
                //Make sure squares aren't under attack
                if(!(board.attacked(board.getPos(this.file, this.rank), this.color) || board.attacked(board.getPos(6, castleRank), this.color) || board.attacked(board.getPos(7, castleRank), this.color))
                    && board.getPiece(6, castleRank) == null && board.getPiece(7, castleRank) == null) {
                    this.moves.push(board.getPos(7, castleRank));
                }
            }
            //Queen side castle
            let queenRook = board.getPieceFromPos(board.getPos(1, castleRank));
            if(queenRook != null && queenRook.constructor.name == "Rook" && !queenRook.hasMoved) {
                //Make sure squares aren't under attack
                if(!(board.attacked(board.getPos(this.file, this.rank), this.color) ||  board.attacked(board.getPos(3, castleRank), this.color) || board.attacked(board.getPos(4, castleRank), this.color))
                    && board.getPiece(2, castleRank) == null && board.getPiece(3, castleRank) == null && board.getPiece(4, castleRank) == null) {
                    this.moves.push(board.getPos(3, castleRank));
                }
            }
        }
    }

    /**
     * Returns only "attacks" by the king to prevent infinite recusion when calculating moves
     * @param {Array} board 
     */
    getAttacks(board) {
        let attacks = [];
        this.kingMoves.forEach(e => {
            if(board.legalPosition(this.file + e[0], this.rank + e[1])) {
                let targetPiece = board.getPos(this.file + e[0], this.rank + e[1]);
                if(board.getPieceFromPos(targetPiece) == null) {
                    attacks.push(targetPiece);
                }
                else if(board.getPieceFromPos(targetPiece).color != this.color) {
                    attacks.push(targetPiece);
                }
            }
        } );
        return attacks;
    }

    copyPiece() {
        return new King(this.file, this.rank, this.color);
    }

    toString() {return "King"}
}

class Move {
    constructor(piece, startPos, endPos) {
        this.piece = piece;
        this.startPos = startPos;
        this.endPos = endPos;
    }
}

game = new LOSChess();
