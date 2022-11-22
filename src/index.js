import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ButtonToolbar, Dropdown, DropdownButton } from 'react-bootstrap';

class Box extends React.Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col);
  };

  render() {
    return (
      <div
        className={this.props.boxClass}
        id={this.props.id}
        onClick={this.selectBox}
      />
    );
  }
}

class Grid extends React.Component {
  render() {
    const width = this.props.cols * 14;
    var rowsArr = [];

    var boxClass = '';
    for (var i = 0; i < this.props.rows; i++) {
      for (var j = 0; j < this.props.cols; j++) {
        let boxId = i + '_' + j;
        boxClass = this.props.gridFull[i][j] ? 'box on' : 'box off';
        rowsArr.push(
          <Box
            boxClass={boxClass}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
            selectBox={this.props.selectBox}
          />
        );
      }
    }

    return (
      <div className="grid" style={{ width: width }}>
        {rowsArr}
      </div>
    );
  }
}

class Buttons extends React.Component {
  handleSelect = (evt) => {
    this.props.gridSize(evt);
  };

  render() {
    let dropDownButtonStyle = {
      backgroundColor: '#f0f8ff',
    };
    return (
      <div className="center">
        <ButtonToolbar>
          <button className="button" onClick={this.props.playButton}>
            Play
          </button>

          <button className="button" onClick={this.props.pauseButton}>
            Pause
          </button>

          <button className="button" onClick={this.props.clear}>
            clear
          </button>

          <button className="button" onClick={this.props.slow}>
            slow
          </button>

          <button className="button" onClick={this.props.fast}>
            fast
          </button>

          <button className="button" onClick={this.props.seed}>
            seed
          </button>
          <DropdownButton
            title="Grid Size"
            id="button"
            className="button"
            onSelect={this.handleSelect}
          >
            <Dropdown.Menu className="button" id="button">
              <Dropdown.Item eventKey="1">20x10</Dropdown.Item>
              <Dropdown.Item eventKey="2">50x30</Dropdown.Item>
              <Dropdown.Item eventKey="3">70x50</Dropdown.Item>
            </Dropdown.Menu>
          </DropdownButton>
        </ButtonToolbar>
      </div>
    );
  }
}

class Main extends React.Component {
  constructor() {
    super();
    this.speed = 100;
    this.rows = 30;
    this.cols = 50;
    this.state = {
      generation: 0,
      gridFull: Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(false)),
    };
  }

  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy,
    });
  };

  seed = () => {
    let gridCopy = arrayClone(this.state.gridFull);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true;
        }
      }
    }
    this.setState({
      gridFull: gridCopy,
    });
  };

  fast = () => {
    this.speed = 100;
    this.playButton();
  };

  slow = () => {
    this.speed = 1000;
    this.playButton();
  };

  clear = () => {
    let gridNew = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(false));

    this.setState({
      generation: 0,
      gridFull: gridNew,
    });
  };

  gridSize = (size) => {
    switch (size) {
      case '1':
        this.cols = 20;
        this.rows = 10;
        break;
      case '2':
        this.cols = 50;
        this.rows = 30;
        break;
      case '3':
        this.cols = 70;
        this.rows = 50;
        break;
      default:
        break;
    }
    this.clear();
  };

  playButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed);
  };

  pauseButton = () => {
    clearInterval(this.intervalId);
  };

  play = () => {
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);
    console.log('into play');
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let count = 0;
        console.log(i, j);
        if (i > 0) if (g[i - 1][j]) count++;
        if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
        if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
        if (j < this.cols - 1) if (g[i][j + 1]) count++;
        if (j > 0) if (g[i][j - 1]) count++;
        if (j > 0 && i < this.rows - 1) if (g[i + 1][j - 1]) count++;
        if (i < this.rows - 1) if (g[i + 1][j]) count++;
        if (i < this.rows - 1 && j > 0) if (g[i + 1][j + 1]) count++;
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
        if (!g[i][j] && count === 3) g2[i][j] = true;
        console.log(count);
      }
    }
    this.setState({
      gridFull: g2,
      generation: this.state.generation + 1,
    });
  };

  componentDidMount() {
    this.seed();
    this.playButton();
  }

  render() {
    return (
      <div>
        <h1>The Game of Life</h1>
        <Buttons
          playButton={this.playButton}
          pauseButton={this.pauseButton}
          slow={this.slow}
          fast={this.fast}
          clear={this.clear}
          seed={this.seed}
          gridSize={this.gridSize}
        />
        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation}</h2>
      </div>
    );
  }
}

function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
