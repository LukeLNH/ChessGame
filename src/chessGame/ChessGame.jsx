// import React from 'react';
// import PropTypes from 'prop-types';
// import {default as ChessBoard} from 'chessboardjsx';
// const Chess = require('chess.js');
// let chess = new Chess()


// //there was some error installing chessjs and chessboard jsx i think. reinstall when possible

// class GameSpecifications extends React.Component{
//     static propTypes = { children : PropTypes.func} //built in react, ensures all children are functions
//     render() {
//         return(
//             this.props.children({
//                 position: chess.fen(),
//                 onDrop:this.onDrop
//             })
//         );
//     }

//     //not too sure why, but for onDrop, its essential that you name the parameters sourceSquare and targetSquare.
//     //will be undefined if theyre just called source/target
//     onDrop({sourceSquare, targetSquare}) { 
//         let move = chess.move({
//             from: sourceSquare,
//             to: targetSquare,
//             promotion: 'q'
//         });

//         console.log(move === null);
//         if(move === null) return;
        
//     }
// }

// export default function ChessGame() {
//     return (
//         <div>
//             <GameSpecifications>
//             {({
//                 position,
//                 onDrop
//             }) => (
//                 <ChessBoard
//                  position = {position}
//                  onDrop = {onDrop}
//                  />
//             )}
//             </GameSpecifications>
//         </div>
//     );
// }