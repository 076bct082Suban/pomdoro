import React from "react";
import ModeForm from "./ModeForm";
import Timer from "./Timer";
import Pom from "./Pom";
import Task from "./Task";
import { Tasks, Taskbar } from "./Tasks";

let cron;

export default class Pomodoro extends React.Component {
	constructor(props) {
		super(props);
		let mode = parseInt(localStorage.getItem("Pomodoro_Mode") || 1);
		this.state = {
			mode: mode,
			running: false,
			started: false,
			clock: mode === 1 ? 0 : 1500,
			pom: {},
			task: {},
			taskValue: "",
			unfinishedTasks: [],
			activeTask: false,
			tags: [],
		};
		// this.handleModeChange = this.handleModeChangoe.bind(this);
		this.Quit = this.Quit.bind(this);
		this.handleTaskSet = this.handleTaskSet.bind(this);
		this.clearActiveTask = this.clearActiveTask.bind(this);

		this.handleTaskSubmit = this.handleTaskSubmit.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
		this.handleTaskUpdate = this.handleTaskUpdate.bind(this);
		this.handleTaskValueUpdate = this.handleTaskValueUpdate.bind(this);
		this.updateTags = this.updateTags.bind(this);
		// this.handleTaskClick = this.handleClick.bind(this);
	}
	componentDidMount() {
		this.getTags();
		this.handleTaskUpdate();
	}
	async sendPom() {
		let obj = this.state.pom;
		if (obj && Object.keys(obj).length === 0 && obj.constructor === Object) {
			return;
		}
		let task = this.state.task;
		let taskID;
		if (task && Object.keys(task).length === 0 && task.constructor === Object) {
			taskID = "";
		} else {
			taskID = task.getID();
		}
		obj.task = taskID;
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
		const mode = parseInt(newMode);
		this.Pause();
		this.setState({
			mode: mode,
			running: false,
			started: false,
			clock: mode === 1 ? 0 : 1500,
		});
		localStorage.setItem("Pomodoro_Mode", mode);
	};

	handleTaskSet(task) {
		// TODO
		this.setState({ task: task, activeTask: true });
	}
	clearActiveTask() {
		this.setState({ task: {}, activeTask: false });
	}
	handleTaskUpdate() {
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
				this.setState({ unfinishedTasks: tasks });
			});
	}
	handleTaskSubmit(event) {
		event.preventDefault();
		const value = this.state.taskValue;
		const tags = [];
		const completed = false;
		this.setState({ taskValue: "" });
		console.log("preparing to send task");
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
					unfinishedTasks: [...this.state.unfinishedTasks, task],
					taskValue: "",
				});
			});
	}
	handleValueChange(event) {
		this.setState({ taskValue: event.target.value });
	}
	handleCheckboxClick(id) {
		// hands the checkbox click event
		console.log(id);

		if (id === this.state.task.id) {
			this.clearActiveTask();
		}
		// Fixes the checkmark issue
		let tasks = [];
		let changedState;
		this.state.unfinishedTasks.forEach((task) => {
			if (id !== task.id) {
				tasks.push(task);
			} else {
				changedState = task.changeStatus();
				tasks.push(task);
			}
		});
		this.setState({ unfinishedTasks: tasks });
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
		}).then(() => this.handleTaskUpdate());
	}
	handleTaskValueUpdate(task) {
		const tasks = this.state.unfinishedTasks;
		const index = tasks.findIndex((obj) => task.id === obj.id);
		console.log(index);
		console.log(task);

		tasks[index] = new Task(task.id, task.value, task.tags, task.completed);
		this.setState({ unfinishedTasks: tasks });

		fetch("http://localhost:5000/api/tasks", {
			method: "PUT",
			mode: "cors",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				type: "modify",
				id: task.id,
				task: task,
			}),
		}).then(() => console.log("weyyy"));
	}

	getTags() {
		let tags = [];
		fetch("http://localhost:5000/api/tags")
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				result.forEach((object) => tags.push(object));
				this.setState({ tags: tags });
			});
	}

	updateTags(tag) {
		this.state.tags.forEach((obj) => {
			console.log(tag.id);
			console.log(obj.id);
			if (tag.id === obj.id) {
				console.log("dublicate");
				return;
			} else this.state.tags.push(tag);
		});
	}
	// Pomodoro functions
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
				{this.state.activeTask && (
					<Taskbar
						task={this.state.task}
						clearActiveTask={() => this.clearActiveTask()}
						handleClick={(id) => this.handleCheckboxClick(id)}
					/>
				)}
				<Timer
					mode={this.state.mode}
					handleClick={() => this.handleClick()}
					handleTaskSet={(task) => this.handleTaskSet(task)}
					clock={this.state.clock}
					started={this.state.started}
					running={this.state.running}
					task={this.state.task}
					activeTask={this.state.activeTask}
					clearActiveTask={() => this.clearActiveTask()}
					quit={this.Quit}
				/>
				<Tasks
					taskValue={this.state.taskValue}
					handleValueChange={(event) => this.handleValueChange(event)}
					handleTaskSubmit={(event) => this.handleTaskSubmit(event)}
					unfinishedTasks={this.state.unfinishedTasks}
					handleTaskSet={(task) => this.handleTaskSet(task)}
					task={this.state.task}
					tags={this.state.tags}
					clearActiveTask={() => this.clearActiveTask()}
					handleCheckboxClick={(id) => this.handleCheckboxClick(id)}
					handleTaskValueUpdate={(task) => this.handleTaskValueUpdate(task)}
					updateTags={(tag) => this.updateTags(tag)}
				/>
			</div>
		);
	}
}
