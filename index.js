import React from 'react';
//import ReactDOM from 'react-dom';
import './index.css';

////SQUARE///////////////////////    
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
/////BOARD//////////////////////
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        isWinning={this.props.winningSquares.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
 /////////CHALLANGE 3-----2 Loops instead of arrays--///
    let squares = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(this.renderSquare(i * 3 + j));
      }
      squares.push(
        <div key={i} className="board-row">
          {row}
        </div>
      );
    }
    return <div> {squares} </div>;
  }
}
/////GAME///////////////////////
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {squares: Array(9).fill(null)}],
      stepNumber: 0,
      xIsNext: true
    };
  }
/////CHALLANGE 1 ----first attempt----incomplete
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const spotOnBoard = [
      [1,1],
      [2,1],
      [3,1],
      [1,2],
      [2,2],
      [2,3],
      [3,2],
      [1,3],
      [3,3],
    ];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {squares: squares, spotOnBoard: spotOnBoard[i]}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  handleToggle() {
    this.setState({
      isAscending: !this.state.isAscending
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber]; 
    const winner = calculateWinner(current.squares);

    let status;

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map( (step,move) => {
      //CHALLANGE 2 --BOLD NEXT PLAYER//////////////
        const desc = move ? 'Go to move #' + move + ' : ' + (step.picked%3+1) + ',' +  (Math.floor(step.picked/3)+1)
                          : 'Go to game start' ;
        const formatClass = (move == this.state.stepNumber ? 'bold' : '');  <--
        return (
          <li key={move}>
            <button className={formatClass} onClick={ () => this.jumpTo(move, this.key) }>{desc}</button> <--
          </li>
        );
    });

    if (winner) {
      status = "Winner is " + winner.winner;
    } else if (!current.squares.includes(null)) {
      status = "Game ended in Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const isAscending = this.state.isAscending;
    if (!isAscending) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winningSquares={winner ? winner.line : []}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <button className="btn-toggle" onClick={() => this.handleToggle()}>
            {isAscending ? "Sort Descendingly" : "Sort Ascendingly"}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

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

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
export default Square;