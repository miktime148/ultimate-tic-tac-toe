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
    <button className={props.class || "square"} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let className = null;

    if(this.props.winningMove.outcome !== null){
      if(this.props.winningMove.move.includes(i)){
        this.props.winningMove.player === "X" ?
          className = "square square-winner-X":
          className = "square square-winner-O";
      }
    }

    return (  
      <Square
        class = {className}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i, this.props.id)}
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
      boards: this.initialBoards(),
      currentBoard: 4,
      stepNumber: 0,
      xIsMoving: true,
      largeboard: Array(9).fill({
        outcome: null,
        player: null,
        move: null
      })
    };

  }

  initialBoards(){
    let boards = [];

    for(let i = 0; i < 9; i++){
      boards.push(Array(9).fill(null));
    }

    return boards;
  }

  handleClick(squareNum, boardNum) {

    if(boardNum !== this.state.currentBoard){
      return;
    }

    const boards = this.state.boards;
    const squares = boards[boardNum];

    if (this.state.largeboard[boardNum].outcome === outcome.DRAW || squares[squareNum]) {
      return;
    }

    squares[squareNum] = this.state.xIsMoving ? "X" : "O";
    
    let temp = calculateWinner(squares);

    if(temp.outcome === outcome.WINNER){

      const large = this.state.largeboard;

      large[boardNum] = {
        outcome: temp.outcome,
        player: temp.player,
        move: temp.move
      };

      this.setState({ largeboard: large })

    }

    this.setState({
      boards:  boards,
      currentBoard: this.boardFull(this.state.largeboard[squareNum]) ? squareNum : this.state.currentBoard,
      stepNumber: this.state.stepNumber + 1,
      xIsMoving: !this.state.xIsMoving
    });
  }

  boardFull(board){

    for(let el in board){
      if(el){
        continue;
      }
      else{
        return false;
      }
    }

    return true;
  }

  renderUltimateBoard() {
    let ultimateboard = [];
  
    for(let i = 0; i < 3; i++){
      let boardrow = [];
  
      for(let j = 0; j < 3; j++){
        const boardID = 3*i+j;
        boardrow.push(
          <div className={this.state.currentBoard === boardID ? "box box-current" : "box"} key={boardID}>
            <Board 
              key={boardID}
              id={boardID}
              squares={this.state.boards[boardID]}
              winningMove={this.state.largeboard[boardID]} 
              onClick={(squareNum, boardNum) => this.handleClick(squareNum, boardNum)}
            />
          </div>
        )
      }
  
      ultimateboard.push(<div className="game-boardrow" key={i}>{boardrow}</div>)
    }
    return ultimateboard;
  }

  render() {
    const current = this.state.boards[this.state.currentBoard];
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

    status += "  Current board: " + this.state.currentBoard;

    return (
      <div className="game">

        <div className="game-info">
          <div>{status}</div>
        </div>

        {this.renderUltimateBoard()}

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