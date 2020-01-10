import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Types
const outcome = {
  NOWINNER: 0,
  WINNER: 1,
  DRAW: 2,
};

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (  
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className="board">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      stepNumber: 0,
      xIsMoving: true
    };
  }

  handleClick(i) {
    const squares = this.state.squares;

    let temp = calculateWinner(squares).outcome;

    if (temp === outcome.DRAW || temp === outcome.WINNER || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsMoving ? "X" : "O";

    this.setState({
      squares: squares,
      stepNumber: this.state.stepNumber + 1,
      xIsMoving: !this.state.xIsMoving
    });
  }

  renderUltimateBoard(current) {
    let ultimateboard = [];
  
    for(let i = 0; i < 3; i++){
      let boardrow = [];
  
      for(let j = 0; j < 3; j++){
        boardrow.push(
          <div className="box" key={3*i+j}>
            <Board key={3*i+j}
              squares={this.state.squares}
              onClick={k => this.handleClick(k)}
            />
          </div>
        )
      }
  
      ultimateboard.push(<div className="game-boardrow" key={i}>{boardrow}</div>)
    }
    return ultimateboard;
  }

  render() {
    const current = this.state.squares;
    const winner = calculateWinner(current);

    let status;

    switch(winner.outcome){
      case outcome.WINNER:
        status = "Winner: " + winner.player;
        break;
      case outcome.NOWINNER:
        status = "Current player: " + (this.state.xIsMoving ? "X" : "O");
        break;
      case outcome.DRAW:
        status = "Draw: No one wins :(";
        break;
      default:
    }

    return (
      <div className="game">

        {this.renderUltimateBoard(current)}

        <div className="game-info">
          <div>{status}</div>
        </div>

      </div>
    );
  }
}


// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  //Check for winner
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return ({
        outcome: outcome.WINNER,
        player: squares[a],
        move: lines[i],
      });
    }
  }

  //Check for draw
  let numFull = 0;

  for (let i = 0; i < squares.length; i++) {
    if(squares[i] != null){
      numFull++;
    }
  }

  if(numFull === squares.length){
    return({
      outcome: outcome.DRAW,
    });
  }

  return({
    outcome: outcome.NOWINNER,
  });
}