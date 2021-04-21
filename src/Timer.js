import React from "react";
import Tasks from "./Tasks";

export default function Timer(props) {
	let style_p = {
		marginBottom: "1em",
		marginTop: "1em",
	};
	let time = clockConvertion(props.clock);
	return (
		<div>
			<Clock
				time={time}
				onClick={() => props.handleClick()}
				activeTask={props.activeTask}
			/>
			{props.started ? (
				props.running ? (
					<p style={style_p}>Focus</p>
				) : (
					<Quit quit={() => props.quit()} />
				)
			) : (
				<p>Click on the timer to start</p>
			)}
			<Tasks
				handleTaskSet={(task) => props.handleTaskSet(task)}
				task={props.task}
				clearActiveTask={() => props.clearActiveTask()}
			/>
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
		marginTop: props.activeTask ? "0.5em" : "1em",
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
