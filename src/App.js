import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class Square extends React.Component {
  //Input cell

  constructor(props) {
    super(props);
    this.state = {
      x: props.x,
      y: props.y,
    }
    this.handleChange = this.props.handleChange.bind(this);
  }

  render() {
    return (
      <input 
      id="input"
      type='number'
      onChange={this.handleChange}
      value= {this.props.value}
      step={1}
      />
    )
  }
}

class TotalSquare extends React.Component {
  //Total cell

  render() {
    return (
      <input
      id="total"
      type='number'
      readOnly
      value={this.props.value}
      />
    )
  }
}

class Spreadsheet extends React.Component {
  //Container class for all of the cells

  constructor(props) {
    super(props);
    this.updateBoard = this.props.updateBoard.bind(this);
    this.getBoardValue = this.props.getBoardValue.bind(this);
  }
  

  handleChange(event) {
    //Event handler for inputting in the cells
    var value = parseInt(event.target.value);
    this.props.parent.updateBoard(this.state.x, this.state.y, value);
  }

  renderSquare(x, y, value) {
    return <Square 
      x={x}
      y={y}
      value={isNaN(value)? '': value}
      parent={this}
      handleChange={this.handleChange}
      key={x}
      />
  }

  renderTotalSquare(total, id) {
    return <TotalSquare
      value={total}
      key={id}/>
  }

  renderRow(row) {
    const squares = [];
    var total = 0;
    for (var i = 0; i < this.props.width; i++) {
      var value = this.getBoardValue(i, row);
      squares.push(this.renderSquare(i, row, value));
      total += isNaN(value)? 0: value;
    }
    squares.push(this.renderTotalSquare(total, this.props.width));
    return (
      <div className='row' key={row}>
        {squares}
      </div>
    );
  }

  renderLastRow() {
    const squares = [];
    var total = 0;
    for (var x = 0; x < this.props.width; x++) {
      var value = 0;
      for (var y = 0; y < this.props.height; y++) {
        value += isNaN(this.getBoardValue(x, y))? 0: this.getBoardValue(x, y);
        
      }
      total += value;
      squares.push(this.renderTotalSquare(value, x));
    }
    squares.push(this.renderTotalSquare(total, this.props.width));
    return (
      <div className='row' key={this.props.height}>
        {squares}
      </div>
    );
  }

  render() {

    const rows = [];

    for (var i = 0; i < this.props.height; i++) {
      rows.push(this.renderRow(i));
    }
    rows.push(this.renderLastRow());

    return (
      <div>
        {rows}
      </div>
    )
  }
}

class SizeChanger extends React.Component {
  //Component that handles changing the size of the board

  constructor(props) {
    super(props);
    this.changeBoardSize = this.props.changeBoardSize.bind(this);
  }

  render() {
    return (
    <div>
      <div className='height'>
        Height: {this.props.height}
        <button onClick={() => this.changeBoardSize(0, -1)}>-</button>
        <button onClick={() => this.changeBoardSize(0, 1)}>+</button>
      </div>
      <div className='width'>
        Width: {this.props.width}
        <button onClick={() => this.changeBoardSize(-1, 0)}>-</button>
        <button onClick={() => this.changeBoardSize(1, 0)}>+</button>
      </div>
    </div>)
  }
}

class App extends React.Component {
  //Root component

  constructor(props) {
    super(props);
    var setupBoard = new Array(3);
    for (var i = 0; i < setupBoard.length; i++) {
      setupBoard[i] = new Array(3).fill(0);
    }
    this.state = {
      height: 3,
      width: 3,
      board: setupBoard,
    };
  }

  changeBoardSize(dx, dy) {
    //Increase/decrease the board size by (dx, dy)
    const parent = this.props.parent;
    var newHeight = parent.state.height + dy;
    var newWidth = parent.state.width + dx

    newHeight = newHeight < 1? 1: newHeight;
    newWidth = newWidth < 1? 1: newWidth;

    var newBoard = new Array(newHeight);
    for (var i = 0; i < newBoard.length; i++) {
      newBoard[i] = new Array(newWidth).fill(0);
    }

    for (var y = 0; y < Math.min(newHeight, parent.state.height); y++) {
      for (var x = 0; x < Math.min(newWidth, parent.state.width); x++) {
        newBoard[y][x] = parent.state.board[y][x];
      }
    }

    parent.setState({
      height: newHeight,
      width: newWidth,
      board: newBoard,
    })
  }

  updateBoard(x, y, newValue) {
    //Function that gets passed to the Spreadsheet so it can alter values on the board
    const newBoard = this.props.parent.state.board.slice();
    newBoard[y][x] = newValue;
    this.props.parent.setState({board: newBoard})
  }

  getBoardValue(x, y) {
    return this.props.parent.state.board[y][x];
  }

  render() {
    return (
      <div className='app'>
        <SizeChanger 
        height={this.state.height}
        width={this.state.width}
        parent={this}
        changeBoardSize={this.changeBoardSize}
        />
        <Spreadsheet 
        height={this.state.height}
        width={this.state.width}
        updateBoard={this.updateBoard}
        getBoardValue={this.getBoardValue}
        parent={this}
        />
      </div>
    );
  }
}

export default App;
