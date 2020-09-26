import React from 'react';
import './chessGame.css';
import {Button, Dropdown, DropdownButton, Table} from 'react-bootstrap';
import {default as ChessBoard} from 'chessboardjsx';
// import {default as STOCKFISH} from 'stockfish';
const STOCKFISH = require("stockfish");
const Chess = require('chess.js');


//TODO: History of game + probability of winning on the right => another neural network :D
//TODO: undo/reset buttons + styles slider on the left
export default class ChessGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentState: null,
            squareStyles: {},
            welcomeDisplay: false,
            againstAI: false,
            whiteHistory: [],
            blackHistory: [],
        }
        this.chess = new Chess();
        this.blackKingPiece = {type: "k", color: "b"};
        this.whiteKingPiece = {type: "k", color: "w"};
        this.previousClickedSqure = "";
    }

    componentDidMount() {
        this.setState({welcomeDisplay: true});
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
        let welcomeDisplay = this.state.welcomeDisplay? "flex" : "none";
        let showBoard = (welcomeDisplay === "none")? "flex" : "none";
        
        return(
            <>
            <div className = "welcomeScreen" style = {{display: welcomeDisplay}}>
                <p> Welcome to Luke's Chess App! :D </p>
                <Button variant = "dark" size = "lg" className = "againstStockFIsh"> 
                {/* onClick = {() => {this.newGame(true)}}  */}
                    Play Against StockFish Engine AI (Coming soon)
                </Button>
                <Button variant = "dark" size = "lg" className = "againstFriendLocally" onClick = {() => {this.newGame(false)}}> 
                    Play Against a Friend Locally
                </Button>
                <Button variant = "dark" size = "lg" className = "againstFriendOnline"> 
                    Play Against a Friend Online (Coming Soon)
                </Button>

            </div>


            <div className = "gameScreen" style = {{display: showBoard}}>
                <div className = "leftBoardPanel">
                            <Button variant = "dark" size = "lg" className = "undoButton" onClick = {this.undoMove}>Undo Move</Button>
                            <Button variant = "dark" size = "lg" className = "resetBoardButton" onClick = {() => {this.newGame(false)}}>Reset Board</Button>
                            <Button variant = "dark" size = "lg" className = "newGameButton" onClick = {this.displayHomeScreen}>Home</Button>
                            {/* <DropdownButton variant = "dark" size = "lg" id = "changeBoardStyle" title = "Change Board Style (Coming Soon)">
                                <Dropdown.Item> style 1 </Dropdown.Item>
                                <Dropdown.Item> style 2 </Dropdown.Item>
                                <Dropdown.Item> style 3 </Dropdown.Item> 
                            </DropdownButton> */}
                </div>

                <div className = "board">
                    
                    <div className = "opponentIndicatorWrapper"> 
                        <div className = "opponentIndicator" style = {{backgroundColor: opponentColor}}>  </div>
                    </div>
                    
                    <div className = "centerBoardPanel">
                        <ChessBoard
                            position = {this.state.currentState} 
                            onDrop = {this.onDrop} 
                            boardStyle = {this.boardStyle}
                            calcWidth = {this.calcWidth}
                            squareStyles = {this.state.squareStyles}
                            onSquareClick = {this.onSquareClick}
                            undo = {this.undoCopy}
                        />
                    </div>
                    
                    <div className = "selfIndicatorWrapper">
                        <div className = "selfIndicator" style = {{backgroundColor: selfColor}}> </div>
                    </div>
                </div>

                <div className = "rightBoardPanel"> 
                    <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>White</th>
                        <th>Black</th>
                        {/* Consider making this the username in the future instead of white/black */}
                        </tr>
                    </thead>
                    <tbody>
                      {this.prepareHistory().map(val => (
                        <tr  key = {val[0]}>
                          <td>{val[0]}</td>
                          <td>{val[1]}</td>
                          <td>{val[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                    </Table>
                </div>

             </div>
             </>
        )
    }

    boardStyle = {
        display: "inline-block",
        boxShadow: '0.5vw 1vh 3vw rgba(0,0,0,0.5)',
        margin: '0 auto 0 auto', //align the board in the center of the screen  
    }

    sidePanelStyles = {
    }

    undoMove = () => {
      this.chess.undo();
      let newSquareStyles = this.updateInCheckStyles();

      let blackHistory = [...this.state.blackHistory];
      let whiteHistory = [...this.state.whiteHistory];
      
      if (this.chess.turn() === "b") { //currently black's turn to move, i.e we just undid black's move
        blackHistory.pop();
      } else {
        whiteHistory.pop();
      }

      this.setState({
        currentState: this.chess.fen(),
        squareStyles: newSquareStyles,
        gameOverDisplay: this.chess.game_over(),
        blackHistory: blackHistory,
        whiteHistory: whiteHistory
      });
    }

    prepareHistory = () => {
      let preparedHistory = [];
      let whiteHistory = [...this.state.whiteHistory]; //creating copies of an array using ES6 spread operator
      let blackHistory = [...this.state.blackHistory];
      
      if (blackHistory.length < whiteHistory.length) {
        blackHistory.push(""); //if black making move, put an empty string into the box
      }


      for (let i = 0; i < whiteHistory.length; i++) {
        let temp = [i+1, whiteHistory[i], blackHistory[i]];
        preparedHistory.push(temp);
      }

      return preparedHistory;
    }

    newGame = againstAI => {
        this.chess = new Chess();
        this.previousClickedSqure = "";
        this.setState({
          currentState: this.chess.fen(), 
          welcomeDisplay: false, 
          againstAI: againstAI,
          whiteHistory: [],
          blackHistory: []
        });
    }

    displayHomeScreen = () => {
      this.setState({welcomeDisplay: true});
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
        if (this.state.againstAI) {
            this.aiMakeMove();
        } else {
          this.updateMoveHistory();
        }
    }

    updateMoveHistory = () => { //update the board and the move history display
      let newSquareStyles = this.updateInCheckStyles();
      switch (this.chess.turn()) {

        case "b": //if white just went, and it's now black's turn: update the pos about where white moved
          let whiteHistory = [...this.state.whiteHistory] //making a copy of whiteHistory using the spread operator
          whiteHistory.push(this.chess.history()[this.chess.history().length - 1]);
          

          this.setState({
            currentState: this.chess.fen(),
            squareStyles: newSquareStyles,
            gameOverDisplay: this.chess.game_over(),
            whiteHistory: whiteHistory,
          })

          break;

        default:
          let blackHistory = [...this.state.blackHistory] //making a copy of blackHistory using the spread operator
          blackHistory.push(this.chess.history()[this.chess.history().length - 1]);
          

          this.setState({
            currentState: this.chess.fen(),
            squareStyles: newSquareStyles,
            gameOverDisplay: this.chess.game_over(),
            blackHistory: blackHistory,

          })
        }
      }
    

    aiMakeMove = () => {
        return new Promise(resolve => {
            this.setState({ currentState: this.chess.fen() });
            resolve();
          }).then(() => this.engineGame().prepareMove());
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
            this.updateMoveHistory();
        }
        this.previousClickedSqure = square;
    }

    //////////////////////////////////STOCKFISH CHESS ENGINE////////////////////////////////////////
    //Code from https://codesandbox.io/s/432vylv590?from-embed=&file=/src/integrations/Stockfish.js:899-6944
    // and also from https://github.com/nmrugg/stockfish.js/blob/master/example/enginegame.js
    engineGame = options => {
        options = options || {};
    
        /// We can load Stockfish via Web Workers or via STOCKFISH() if loaded from a <script> tag.
        let engine =
          typeof STOCKFISH === "function"
            ? STOCKFISH()
            : new Worker(options.stockfishjs || "stockfish.js");
        let evaler =
          typeof STOCKFISH === "function"
            ? STOCKFISH()
            : new Worker(options.stockfishjs || "stockfish.js");
        let engineStatus = {};
        let time = { wtime: 3000, btime: 3000, winc: 1500, binc: 1500 };
        let playerColor = "black";
        let clockTimeoutID = null;
        // let isEngineRunning = false;
        let announced_game_over;
        // do not pick up pieces if the game is over
        // only pick up pieces for White
    
        setInterval(function() {
          if (announced_game_over) {
            return;
          }
    
          if (this.chess.game_over()) {
            announced_game_over = true;
          }
        }, 500);
    
        function uciCmd(cmd, which) {
          // console.log('UCI: ' + cmd);
    
          (which || engine).postMessage(cmd);
        }
        uciCmd("uci");
    
        function clockTick() {
          let t =
            (time.clockColor === "white" ? time.wtime : time.btime) +
            time.startTime -
            Date.now();
          let timeToNextSecond = (t % 1000) + 1;
          clockTimeoutID = setTimeout(clockTick, timeToNextSecond);
        }
    
        function stopClock() {
          if (clockTimeoutID !== null) {
            clearTimeout(clockTimeoutID);
            clockTimeoutID = null;
          }
          if (time.startTime > 0) {
            let elapsed = Date.now() - time.startTime;
            time.startTime = null;
            if (time.clockColor === "white") {
              time.wtime = Math.max(0, time.wtime - elapsed);
            } else {
              time.btime = Math.max(0, time.btime - elapsed);
            }
          }
        }
    
        function startClock() {
          if (this.chess.turn() === "w") {
            time.wtime += time.winc;
            time.clockColor = "white";
          } else {
            time.btime += time.binc;
            time.clockColor = "black";
          }
          time.startTime = Date.now();
          clockTick();
        }
    
        function get_moves() {
          let moves = "";
          let history = this.chess.history({ verbose: true });
    
          for (let i = 0; i < history.length; ++i) {
            let move = history[i];
            moves +=
              " " + move.from + move.to + (move.promotion ? move.promotion : "");
          }
    
          return moves;
        }
    
        const prepareMove = () => {
          stopClock();
          // this.setState({ currentState: this.chess.fen() });
          let turn = this.chess.turn() === "w" ? "white" : "black";
          if (!this.chess.game_over()) {
            // if (turn === playerColor) {
            if (turn !== playerColor) {
              // playerColor = playerColor === 'white' ? 'black' : 'white';
              uciCmd("position startpos moves" + get_moves());
              uciCmd("position startpos moves" + get_moves(), evaler);
              uciCmd("eval", evaler);
    
              if (time && time.wtime) {
                uciCmd(
                  "go " +
                    (time.depth ? "depth " + time.depth : "") +
                    " wtime " +
                    time.wtime +
                    " winc " +
                    time.winc +
                    " btime " +
                    time.btime +
                    " binc " +
                    time.binc
                );
              } else {
                uciCmd("go " + (time.depth ? "depth " + time.depth : ""));
              }
              // isEngineRunning = true;
            }
            if (this.chess.history().length >= 2 && !time.depth && !time.nodes) {
              startClock();
            }
          }
        };
    
        evaler.onmessage = function(event) {
          let line;
    
          if (event && typeof event === "object") {
            line = event.data;
          } else {
            line = event;
          }
    
          // console.log('evaler: ' + line);
    
          /// Ignore some output.
          if (
            line === "uciok" ||
            line === "readyok" ||
            line.substr(0, 11) === "option name"
          ) {
            return;
          }
        };
    
        engine.onmessage = event => {
          let line;
    
          if (event && typeof event === "object") {
            line = event.data;
          } else {
            line = event;
          }
          // console.log('Reply: ' + line);
          if (line === "uciok") {
            engineStatus.engineLoaded = true;
          } else if (line === "readyok") {
            engineStatus.engineReady = true;
          } else {
            let match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
            /// Did the AI move?
            if (match) {
              // isEngineRunning = false;
              this.chess.move({ from: match[1], to: match[2], promotion: match[3] });
              this.setState({ currentState: this.chess.fen() });
              prepareMove();
              uciCmd("eval", evaler);
              //uciCmd("eval");
              /// Is it sending feedback?
            } else if (
              (match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/))
            ) {
              engineStatus.search = "Depth: " + match[1] + " Nps: " + match[2];
            }
    
            /// Is it sending feed back with a score?
            if ((match = line.match(/^info .*\bscore (\w+) (-?\d+)/))) {
              let score = parseInt(match[2], 10) * (this.chess.turn() === "w" ? 1 : -1);
              /// Is it measuring in centipawns?
              if (match[1] === "cp") {
                engineStatus.score = (score / 100.0).toFixed(2);
                /// Did it find a mate?
              } else if (match[1] === "mate") {
                engineStatus.score = "Mate in " + Math.abs(score);
              }
    
              /// Is the score bounded?
              if ((match = line.match(/\b(upper|lower)bound\b/))) {
                engineStatus.score =
                  ((match[1] === "upper") === (this.chess.turn() === "w")
                    ? "<= "
                    : ">= ") + engineStatus.score;
              }
            }
          }
          // displayStatus();
        };
    
        return {
          start: function() {
            uciCmd("ucinewgame");
            uciCmd("isready");
            engineStatus.engineReady = false;
            engineStatus.search = null;
            prepareMove();
            announced_game_over = false;
          },
          prepareMove: function() {
            prepareMove();
          }
        };
      };
}