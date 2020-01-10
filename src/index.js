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
      <div>
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
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsMoving: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    let temp = calculateWinner(squares).outcome;
    if (temp === outcome.DRAW || temp === outcome.WINNER || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsMoving ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsMoving: !this.state.xIsMoving
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

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
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
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