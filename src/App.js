import React from "react";
import "./App.css";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Pomodoro />
			</header>
		</div>
	);
}

class ModeForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: props.currentMode };
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange = (event) => {
		this.setState({ value: parseInt(event.target.value) });
		this.props.handleModeChange(parseInt(event.target.value));
	};

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<label>
						Select The mode
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

let cron;

class Pomodoro extends React.Component {
	constructor(props) {
		super(props);
		let mode = localStorage.getItem("Pomodoro_Mode") || 1;
		this.state = {
			mode: mode,
			running: false,
			started: false,
			clock: mode === 1 ? 0 : 1500,
			pom: {},
		};
		// this.handleModeChange = this.handleModeChangoe.bind(this);
		this.Quit = this.Quit.bind(this);
	}
	async sendPom() {
		let obj = this.state.pom;
		if (obj && Object.keys(obj).length === 0 && obj.constructor === Object) {
			return;
		}
		await fetch("http://localhost:5000/api/pomodoro", {
			method: "POST",
			mode: "cors",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(obj),
		});
	}

	handleModeChange = (newMode) => {
		this.Pause();
		this.setState({
			mode: newMode,
			running: false,
			started: false,
			clock: newMode === 1 ? 0 : 1500,
		});
		localStorage.setItem("Pomodoro_Mode", newMode);
	};
	handleClick() {
		if (this.state.running) {
			// Pause
			this.Pause();
			let pom = this.state.pom;
			pom.pauseEvent();
			this.setState({ pom: pom });
			return;
		} else {
			// Start / Continue Pomodoro

			// New few lines do not work without this check idk why.
			let madePom = false; // A check to see if i make a new pom in the next if statement
			if (!this.state.started) {
				this.setState({ pom: new Pom(), started: true });
				madePom = true;
			}
			this.Pause();
			cron = setInterval(() => {
				this.Update();
			}, 1000);
			if (!madePom) {
				// Maybe i can't query for state after i set it to a new one
				let pom = this.state.pom;
				pom.continueEvent();
				this.setState({ pom: pom });
			}
			this.setState({ running: true });
			return;
		}
	}
	Quit() {
		let pom = this.state.pom;
		pom.pauseEvent();
		this.sendPom().then(() => console.log("POM sent"));

		if (this.state.mode === 1)
			this.setState({
				clock: 0,
				running: false,
				started: false,
				pom: {},
			});
		else
			this.setState({
				clock: 1500,
				running: false,
				started: false,
				pom: {},
			});
		this.Pause();
	}
	Update() {
		if (this.state.mode === 1) this.setState({ clock: this.state.clock + 1 });
		else {
			let finished = false;
			if (this.state.clock === 1) finished = true;
			this.setState({ clock: this.state.clock - 1 });

			if (finished) this.Quit();
		}
		// this.setState({ time: toReturn });
	}
	Pause() {
		clearInterval(cron);
		this.setState({ running: false });
	}
	render() {
		return (
			<div>
				<ModeForm
					currentMode={this.state.mode}
					handleModeChange={(newMode) => this.handleModeChange(newMode)}
				/>
				<Timer
					mode={this.state.mode}
					handleClick={() => this.handleClick()}
					clock={this.state.clock}
					started={this.state.started}
					running={this.state.running}
					quit={this.Quit}
				/>
			</div>
		);
	}
}

function Timer(props) {
	let time = clockConverstion(props.clock);
	return (
		<div>
			<Clock time={time} onClick={() => props.handleClick()} />
			{props.started ? (
				props.running ? (
					<p>Focus</p>
				) : (
					<Quit quit={() => props.quit()} />
				)
			) : (
				<p>Click on the timer to start</p>
			)}
		</div>
	);
}

function Clock(props) {
	const mystyle = {
		color: "white",
		backgroundColor: "#282c39",
		padding: "10px",
		fontFamily: "Arial",
		cursor: "pointer",
		fontSize: "4em",
	};
	return (
		<p style={mystyle} onClick={props.onClick}>
			{props.time}
		</p>
	);
}

function Quit(props) {
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
	};
	return (
		<div>
			<button style={mystyle} onClick={() => props.quit()}>
				Quit
			</button>
		</div>
	);
}

let clockConverstion = (clock) => {
	let values = Array(2).fill(0);

	while (Math.floor(clock / 60) !== 0) {
		values[1] += 1;
		clock -= 60;
	}
	values[0] = clock;

	let toReturn =
		(values[1] > 9 ? values[1].toString() : "0" + values[1].toString()) +
		" : " +
		(values[0] > 9 ? values[0].toString() : "0" + values[0].toString());

	return toReturn;
};

class Pom {
	constructor() {
		this.started = new Date();
		this.intervals = [];
		this.lastAction = new Date();
		this.running = true;
	}
	pauseEvent() {
		let pauseTime = new Date();
		this.intervals.push([this.lastAction, pauseTime]);
		this.lastAction = pauseTime;
		this.running = false;
	}
	continueEvent() {
		if (this.running === false) {
			this.lastAction = new Date();
		}
	}
}
// async function sendPom() {}
export default App;
