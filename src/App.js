import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Timer/>
      </header>
    </div>
  );
}
let cron;
class Timer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      running: false,
      started: false,
      clock: 0,
      time: "00 : 00"

    }

  }
  handleClick(){
    if(this.state.running){
      this.Pause();
      return;
    }else{
      this.Pause()
      cron = setInterval(() => {this.Update(); }, 1000);
      this.setState({running: true});
    }
    
  }
  Update(){
    this.setState({clock: (this.state.clock + 1), });
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
        {this.state.running}
      <Clock time={this.state.time} onClick={() => this.handleClick()}/>
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
      
    };
  return <h1 style={mystyle} onClick={props.onClick}>{props.time}</h1>
}
export default App;

