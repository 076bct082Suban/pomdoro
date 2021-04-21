import React from "react";
import playButton from "./images/playButton.svg";
import moreOptions from "./images/moreOptions.svg";
import crossButton from "./images/crossButton.svg";
import "./css/tasks.css";

export default class Tasks extends React.Component {
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
		// hands the checkbox click event
		console.log(id);
		if (id === this.props.task.getID()) {
			this.props.clearActiveTask();
		}
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
						<TaskRow
							task={task}
							key={key}
							handleClick={this.handleClick}
							handleTaskSet={(task) => this.props.handleTaskSet(task)}
						/>
					))}
				</div>
			</div>
		);
	}
}

function TaskRow(props) {
	return (
		<div>
			<div className="task-row">
				<input
					type="checkbox"
					className="task-checkbox"
					checked={props.task.completed}
					onChange={() => props.handleClick(props.task.getID())}
				></input>
				{props.task.getValue()}

				<img
					className={"play-button"}
					alt={"Start task button "}
					src={playButton}
					onClick={() => {
						props.handleTaskSet(props.task);
					}}
				/>

				<img src={moreOptions} alt="more options" className="more-options" />
			</div>
		</div>
	);
}

function Taskbar(props) {
	return (
		<>
			<div className="task-bar">
				<input type="checkbox" className="task-checkbox" />
				{props.task.getValue()}
				<img
					src={crossButton}
					alt="cross button"
					onClick={() => props.clearActiveTask()}
					className="cross-button"
				/>
				<img src={moreOptions} alt="more options" className="more-options" />
			</div>
		</>
	);
}
export { Taskbar };

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
