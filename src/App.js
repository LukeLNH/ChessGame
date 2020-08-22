import React from 'react';
import ChessGame from './chessGame/ChessGame.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, BrowserRouter, Route } from 'react-router-dom';
function App() {
  return (
    <ChessGame />
  );
} 

export default App;
