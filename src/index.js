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

    if(this.props.winningMove.outcome != null){
      if(this.props.winningMove.move != null){
        if(this.props.winningMove.move.includes(i)){
          this.props.winningMove.player === "X" ?
            className = "square square-winner-X":
            className = "square square-winner-O";
        }
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
      currentBoard: [0,1,2,3,4,5,6,7,8],
      availableBoards: [0,1,2,3,4,5,6,7,8],
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

    if(findIndexOfItem(this.state.currentBoard, boardNum) === -1 ){
      return;
    }

    let newState = this.state;

    const boards = this.state.boards;
    const squares = boards[boardNum];

    if (this.state.largeboard[boardNum].outcome === outcome.DRAW || squares[squareNum]) {
      return;
    }

    squares[squareNum] = this.state.xIsMoving ? "X" : "O";
    
    let temp = calculateWinner(squares);

    if(temp.outcome === outcome.WINNER || temp.outcome === outcome.DRAW){

      const large = this.state.largeboard;

      large[boardNum] = {
        outcome: temp.outcome,
        player: temp.player,
        move: temp.move
      };

      newState = {
        ...newState,
        largeboard: large,
        availableBoards: removeItemFromArray(this.state.availableBoards, boardNum)
      }
    }

    //determine next board to play on
    let nextBoard = this.state.largeboard[squareNum];

    if(nextBoard.outcome !== null){
      newState = {
        ...newState,
        currentBoard: this.state.availableBoards
      }
    }
    else{
      newState = {
        ...newState,
        currentBoard: [squareNum]
      }
    }

    newState = {
      ...newState,
      boards:  boards,
      stepNumber: this.state.stepNumber + 1,
      xIsMoving: !this.state.xIsMoving
    }

    this.setState(newState);
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
        const current = this.state.currentBoard;

        boardrow.push(
          <div className={ findIndexOfItem(current, boardID) !== -1 ? "box box-current" : "box"} key={boardID}>
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

    let status = "";

    //Check for grand winner
    let bigBoard = [];

    for(let i = 0; i < 9; i++){
      bigBoard.push(this.state.largeboard[i].player);
    }

    const grandWinner = calculateWinner(bigBoard);

    switch(grandWinner.outcome){
      case outcome.WINNER:
        status += "PLAYER " + grandWinner.player + " has won the game!!!";
        break;
      case outcome.NOWINNER:
          status += "Current Player: " + (this.state.xIsMoving ? "X" : "O");
          break;
      case outcome.DRAW:
            status += "DRAW!";
            break;
      default:
        break;
    }

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

ReactDOM.render(<Game />, document.getElementById("root"));


// ========================================

//Calculates the winner of a board
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
    if (squares[a] && squares[a] !== -1 && squares[a] === squares[b] && squares[a] === squares[c]) {
      return ({
        outcome: outcome.WINNER,
        player: squares[a],
        move: lines[i],
      });
    }
  }

  //Check for draw
  if(findIndexOfItem(squares, null) === -1){
    return({
      outcome: outcome.DRAW,
      player: -1
    });
  }

  return({
    outcome: outcome.NOWINNER,
  });
}

//Removes all instances of an element from an array
function removeItemFromArray(arr, item){
  var index = arr.indexOf(item);

  while(index !== -1){
    if (index !== -1) arr.splice(index, 1);
    index = arr.indexOf(item);
  }

  return arr;
}

//Finds first index of given item
function findIndexOfItem(arr, item){

  for(let i = 0; i < arr.length; i++){
    if(arr[i] === item){
      return i;
    }
  }

  return -1;
}