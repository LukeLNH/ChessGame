import React from 'react';
import './chessGame.css';
import {Button, Dropdown, DropdownButton} from 'react-bootstrap';
import {default as ChessBoard} from 'chessboardjsx';
const Chess = require('chess.js');

//TODO: History of game + probability of winning on the right => another neural network :D
//TODO: undo/reset buttons + styles slider on the left
//TODO: complete onPieceClick
export default class ChessGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentState: null,
            squareStyles: {},
        }
        this.chess = new Chess();
        this.blackKingPiece = {type: "k", color: "b"};
        this.whiteKingPiece = {type: "k", color: "w"};
        this.previousClickedSqure = "";
    }

    componentDidMount() {
        this.setState({currentState: this.chess.fen()});
    }

    //code to locate square that a piece is on from https://github.com/jhlywa/chess.js/issues/174
    get_piece_positions = (piece) => {
        return [].concat(...this.chess.board()).map((p, index) => {
          if (p !== null && p.type === piece.type && p.color === piece.color) {
            return index
          }
        }).filter(Number.isInteger).map((piece_index) => {
          const row = 'abcdefgh'[piece_index % 8]
          const column = Math.ceil((64 - piece_index) / 8)
          return row + column
        })
      }

      

    
    render() {
        let [selfColor, opponentColor] = this.changePlayerTurnColor();
        return(
            <div className = "gameScreen">
                <div className = "opponentIndicatorWrapper"> 
                    <div className = "opponentIndicator" style = {{backgroundColor: opponentColor}}>  </div>
                </div>
                <div className = "board">
                    <div className = "leftBoardPanel">
                        {/* <Button variant = "dark" size = "lg" className = "undoButton">Undo Move</Button>
                        <Button variant = "dark" size = "lg" className = "resetButton">Reset Board</Button>
                        <DropdownButton variant = "dark" size = "lg" id = "changeBoardStyle" title = "Change Board Style">
                            <Dropdown.Item> style 1 </Dropdown.Item>
                            <Dropdown.Item> style 2 </Dropdown.Item>
                            <Dropdown.Item> style 3 </Dropdown.Item> 
                        </DropdownButton> */}
                    </div>
                    <div className = "centerBoardPanel">
                        <ChessBoard
                            position = {this.state.currentState} 
                            onDrop = {this.onDrop} 
                            boardStyle = {this.boardStyle}
                            calcWidth = {this.calcWidth}
                            squareStyles = {this.state.squareStyles}
                            onSquareClick = {this.onSquareClick}
                        />
                    </div>
                    <div className = "rightBoardPanel"> </div>
                </div>
                <div className = "selfIndicatorWrapper">
                    <div className = "selfIndicator" style = {{backgroundColor: selfColor}}> </div>
                </div>
                <div className = "gameButtons">
                {// Reset + undo button + change styles dropdown
                }
                </div>
             </div>
        )
    }

    boardStyle = {
        display: "inline-block",
        boxShadow: '0.5vw 1vh 3vw rgba(0,0,0,0.5)',
        margin: '0 auto 0 auto', //align the board in the center of the screen
    }

    sidePanelStyles = {

    }


    updateInCheckStyles() {
        let squareStyles = {};

        if (this.chess.in_check()) {
            let currentKingSquare;
            if (this.chess.turn() === "b") {
                currentKingSquare = this.get_piece_positions(this.blackKingPiece);
            } else {
                currentKingSquare = this.get_piece_positions(this.whiteKingPiece);
            }
            squareStyles[`${currentKingSquare}`] = {backgroundColor: 'red'}
        }

        return squareStyles;
    }

    calcWidth = ({screenWidth, screenHeight}) => {
        
        if (screenWidth > screenHeight) {
            // this.sidePanelStyles = {
            //     height: `${0.8 * screenHeight}px`,
            //     width: `${(screenWidth - 0.8*screenHeight)/2}px`
            // }
            return 0.8 * screenHeight;
        } else {
            // this.sidePanelStyles = {
            //     height: `${0.8 * screenWidth}px`,
            //     width: `${(screenWidth - 0.8*screenWidth)/2}px`
            // }
            return 0.8 * screenWidth;
        }
        // if (0.8 * screenHeight > screenWidth) return 0.8 * screenWidth;
        // if (0.8 * screenWidth > screenHeight) return 0.8 * screenHeight;
        // return 0.8 * screenWidth;
    }

    onDrop = ({sourceSquare, targetSquare}) => { 
        let move = this.chess.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q"
        });

        //if move is illegal
        if (move === null) return;
        
        //set timeouts here
        //highlight the king's square if its in check
        //ai makes its move
        let newSquareStyles = this.updateInCheckStyles();
        this.setState({
            currentState: this.chess.fen(),
            squareStyles: newSquareStyles
        })

    }

    changePlayerTurnColor = () => {

        if (this.chess.game_over()) {
            //find out who won or if its a tie, display that in a separate screen
            return ["gold", "gold"];
        }
        switch(this.chess.turn()) {
            case "b":
                if (this.chess.in_check()) {
                    return ["honeydew", "red"];
                } else {
                    return ["honeydew", "lawngreen"];
                }
            case "w":
                if (this.chess.in_check()) {
                    return ["red", "honeydew"];
                } else {
                    return ["lawngreen", "honeydew"];
                }
            default:
                return null;

        }
    }

    onSquareClick = (square) => {
        let newSquareStyles = this.updateInCheckStyles();
        
        //get all possible moves from this square
        let moves = this.chess.moves({square: square, verbose: true});

        moves.map((moveObject) => {
            newSquareStyles[`${moveObject.to}`] = {backgroundColor: "rgba(64,224,208,0.4)"}
        })

        let move = this.chess.move({
            from: this.previousClickedSqure,
            to: square,
            promotion: "q"
        });

        if (move === null) {
            this.setState({squareStyles: newSquareStyles});
        } else {
            this.setState({
                squareStyles: newSquareStyles,
                currentState: this.chess.fen(),
            });
        }
        this.previousClickedSqure = square;
    }
}