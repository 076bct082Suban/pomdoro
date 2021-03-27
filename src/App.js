import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Pomodoro/>
      </header>
    </div>
  );
}

class ModeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: props.currentMode};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event) => {
    this.setState({value: parseInt(event.target.value)});
    this.props.handleModeChange(parseInt(event.target.value));
  }


  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
          Pick your favorite flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value={1}>Timer</option>
            <option value={2}>Pom</option>
           </select>
         </label>
        </form>
      </div>
    );
  }
}

class Pomodoro extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      mode: localStorage.getItem("Pomodoro_Mode") || 1,
    }
    // this.handleModeChange = this.handleModeChange.bind(this);
  }
  handleModeChange = (newMode) => {
    this.setState({mode: newMode,});
  }

  render(){
    return (
      <div>      
        <ModeForm currentMode={this.state.mode} handleModeChange={(newMode) => this.handleModeChange(newMode)}/>
        <Timer mode={this.state.mode}/>
        {this.state.mode}
      </div>
    )
  }
}
let cron;
class Timer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      running: false,
      started: false,
      clock: ((this.props.mode === 1) ? 0 : 1500),
      time: ((this.props.mode === 1) ? "00 : 00" : "25 : 00"),
    }
  }

  handleClick(){
    if(this.state.running){
      this.Pause();
      return;
    }else{
      this.Pause()
      cron = setInterval(() => {this.Update(); }, 1000);
      this.setState({running: true, started: true});
      return;
    }
  }

  Reset(){
    if(this.props.mode === 1)
      this.setState({time: "00 : 00", clock: 0, running: false});
    else
      this.setState({time: "25 : 00", clock: 0, running: false});
    this.Pause();
  }
  Update(){
    if(this.props.mode === 1)
      this.setState({clock: (this.state.clock + 1), });
    else
      this.setState({clock: (this.state.clock - 1), });
    let values = Array(2).fill(0);
    let clock = this.state.clock;

    while(Math.floor(clock/60) !== 0){
      values[1] += 1;
      clock -= 60;
    }
    values[0] = clock;
    
    let toReturn = ((values[1] > 9) ? values[1].toString() : "0" + values[1].toString()) + " : " +  ((values[0] > 9) ? values[0].toString() : "0" + values[0].toString());
    this.setState({time: toReturn});
  } 
  Pause(){
    clearInterval(cron);
    this.setState({running: false});
  }
  render(){
    return (
      <div>
      <Clock time={this.state.time} onClick={() => this.handleClick()}/>
      {
        !this.state.running && this.state.started
        ? <Reset reset={()=> this.Reset()}/>
        : <p>Click on the timer to begin.</p>
      }
      </div>
    );
  }
}

function Clock(props){
  const mystyle = {
      color: "white",
      backgroundColor: "#282c39",
      padding: "10px",
      fontFamily: "Arial",
      cursor: "pointer",
      fontSize: "4em",
      
    };
  return <p style={mystyle} onClick={props.onClick}>{props.time}</p>
}
function Reset(props){
  const mystyle = {
      color: "white",
      backgroundColor: "#202135",
      fontFamily: "Arial",
      fontSize: "0.8em",
      borderRadius: "4px", 
      height: "2em",
      width: "6em",
      borderColor: "#202135",
      outline: "none",
    }
  return (
    <div>
      <button style={mystyle} onClick={() => props.reset()}>Reset</button>
    </div>
  )
}


export default App;

