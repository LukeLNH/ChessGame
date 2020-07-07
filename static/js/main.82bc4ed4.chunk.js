(this["webpackJsonpchess-game"]=this["webpackJsonpchess-game"]||[]).push([[0],{12:function(e,t,n){e.exports=n(25)},17:function(e,t,n){},18:function(e,t,n){},19:function(e,t,n){},25:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(4),o=n.n(c),s=(n(17),n(18),n(9)),i=n(10),l=n(5),u=n(6),h=n(11),d=n(8),m=(n(19),n(7)),p=n.n(m),v=n(20),f=function(e){Object(h.a)(n,e);var t=Object(d.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).get_piece_positions=function(e){var t;return(t=[]).concat.apply(t,Object(i.a)(a.chess.board())).map((function(t,n){if(null!==t&&t.type===e.type&&t.color===e.color)return n})).filter(Number.isInteger).map((function(e){return"abcdefgh"[e%8]+Math.ceil((64-e)/8)}))},a.boardStyle={display:"inline-block",boxShadow:"0.5vw 1vh 3vw rgba(0,0,0,0.5)",margin:"0 auto 0 auto"},a.sidePanelStyles={},a.calcWidth=function(e){var t=e.screenWidth,n=e.screenHeight;return t>n?.8*n:.8*t},a.onDrop=function(e){var t=e.sourceSquare,n=e.targetSquare;if(null!==a.chess.move({from:t,to:n,promotion:"q"})){var r=a.updateInCheckStyles();a.setState({currentState:a.chess.fen(),squareStyles:r})}},a.changePlayerTurnColor=function(){if(a.chess.game_over())return["gold","gold"];switch(a.chess.turn()){case"b":return a.chess.in_check()?["honeydew","red"]:["honeydew","lawngreen"];case"w":return a.chess.in_check()?["red","honeydew"]:["lawngreen","honeydew"];default:return null}},a.onSquareClick=function(e){var t=a.updateInCheckStyles();a.chess.moves({square:e,verbose:!0}).map((function(e){t["".concat(e.to)]={backgroundColor:"rgba(64,224,208,0.4)"}})),null===a.chess.move({from:a.previousClickedSqure,to:e,promotion:"q"})?a.setState({squareStyles:t}):a.setState({squareStyles:t,currentState:a.chess.fen()}),a.previousClickedSqure=e},a.state={currentState:null,squareStyles:{}},a.chess=new v,a.blackKingPiece={type:"k",color:"b"},a.whiteKingPiece={type:"k",color:"w"},a.previousClickedSqure="",a}return Object(u.a)(n,[{key:"componentDidMount",value:function(){this.setState({currentState:this.chess.fen()})}},{key:"render",value:function(){var e=this.changePlayerTurnColor(),t=Object(s.a)(e,2),n=t[0],a=t[1];return r.a.createElement("div",{className:"gameScreen"},r.a.createElement("div",{className:"opponentIndicatorWrapper"},r.a.createElement("div",{className:"opponentIndicator",style:{backgroundColor:a}},"  ")),r.a.createElement("div",{className:"board"},r.a.createElement("div",{className:"leftBoardPanel"}),r.a.createElement("div",{className:"centerBoardPanel"},r.a.createElement(p.a,{position:this.state.currentState,onDrop:this.onDrop,boardStyle:this.boardStyle,calcWidth:this.calcWidth,squareStyles:this.state.squareStyles,onSquareClick:this.onSquareClick})),r.a.createElement("div",{className:"rightBoardPanel"}," ")),r.a.createElement("div",{className:"selfIndicatorWrapper"},r.a.createElement("div",{className:"selfIndicator",style:{backgroundColor:n}}," ")),r.a.createElement("div",{className:"gameButtons"}))}},{key:"updateInCheckStyles",value:function(){var e,t={};this.chess.in_check()&&(e="b"===this.chess.turn()?this.get_piece_positions(this.blackKingPiece):this.get_piece_positions(this.whiteKingPiece),t["".concat(e)]={backgroundColor:"red"});return t}}]),n}(r.a.Component);n(24);var g=function(){return r.a.createElement(f,null)};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(g,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[12,1,2]]]);
//# sourceMappingURL=main.82bc4ed4.chunk.js.map