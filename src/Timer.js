import React from "react";

export default function Timer(props) {
	let style_p = {
		marginBottom: "1em",
		marginTop: "1em",
	};
	let time = clockConvertion(props.clock);
	return (
		<div>
			<Clock time={time} onClick={() => props.handleClick()} />
			{props.started ? (
				props.running ? (
					<p style={style_p}>Focus</p>
				) : (
					<Quit quit={() => props.quit()} />
				)
			) : (
				<p>Click on the timer to start</p>
			)}
			<Tasks />
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
		marginTop: "1em",
		marginBottom: "0.5em",
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
		marginTop: "1em",
		marginBottom: "1em",
	};
	return (
		<div>
			<button style={mystyle} onClick={() => props.quit()}>
				Quit
			</button>
		</div>
	);
}

let clockConvertion = (clock) => {
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

class Tasks extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: "",
			activeTasks: [],
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	componentDidMount() {
		this.handleUpdate();
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
	}
	handleUpdate() {
		console.log("Updating");
		let tasks = [];
		fetch("http://localhost:5000/api/tasks")
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				result.forEach((object) => {
					const task = new Task(
						object.id,
						object.value,
						object.tags,
						object.completed
					);
					tasks.push(task);
				});
				this.setState({ activeTasks: tasks });
			});
	}
	handleClick(id) {
		// let activeTasks = [];
		// this.state.activeTasks.forEach((task) => {
		// 	if (task.id !== id) activeTasks.push(task);
		// });
		// this.setState({ activeTasks: activeTasks });
		console.log(id);

		// Fixes the checkmark issue
		let tasks = [];
		let changedState;
		this.state.activeTasks.forEach((task) => {
			if (id !== task.id) {
				tasks.push(task);
			} else {
				changedState = task.changeStatus();
				tasks.push(task);
			}
		});
		this.setState({ activeTasks: tasks });
		fetch("http://localhost:5000/api/tasks", {
			method: "PUT",
			mode: "cors",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: id,
				type: "checkbox",
				completed: typeof changedState !== undefined ? changedState : false,
			}),
		}).then(() => this.handleUpdate());
	}
	handleSubmit(event) {
		const value = this.state.value;
		const tags = [];
		const completed = false;
		this.setState({ value: "" });
		fetch("http://localhost:5000/api/tasks", {
			method: "POST",
			mode: "cors",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ value: value, tags: tags, completed: completed }),
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(`task sent, message: ${result.message}`);

				const task = new Task(
					result.task._id,
					result.task.value,
					result.task.tags,
					result.task.completed
				);

				this.setState({
					activeTasks: [...this.state.activeTasks, task],
					value: "",
				});
			});
		event.preventDefault();
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<input
						type="text"
						value={this.state.value}
						onChange={this.handleChange}
						placeholder="Enter Task here"
					/>
					<input type="submit" value="->" />
				</form>
				<div>
					{this.state.activeTasks.map((task, key) => (
						<TaskRow task={task} key={key} handleClick={this.handleClick} />
					))}
				</div>
			</div>
		);
	}
}

function TaskRow(props) {
	return (
		<div>
			<input
				type="checkbox"
				checked={props.task.completed}
				onChange={() => props.handleClick(props.task.getID())}
			></input>
			{props.task.getValue()}
		</div>
	);
}

class Task {
	constructor(id, value, tags = [], completed = false) {
		this.id = id;
		this.value = value;
		this.tags = tags;
		this.completed = completed;
	}
	getID() {
		return this.id;
	}
	getValue() {
		return this.value;
	}
	getTags() {
		return this.tags;
	}
	isCompleted() {
		return this.completed;
	}
	changeStatus() {
		this.completed = !this.completed;
		return this.completed;
	}
}
