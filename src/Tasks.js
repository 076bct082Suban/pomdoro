import React from "react";
import playButton from "./images/playButton.svg";
import moreOptions from "./images/moreOptions.svg";
import crossButton from "./images/crossButton.svg";
import "./css/tasks.css";

function Tasks(props) {
	return (
		<div>
			<form onSubmit={props.handleTaskSubmit}>
				<input
					type="text"
					value={props.taskValue}
					onChange={props.handleValueChange}
					placeholder="Enter Task here"
				/>
				<input type="submit" value="->" />
			</form>
			<div>
				{props.unfinishedTasks.map((task, key) => (
					<TaskRow
						// topbarTask={props.task}
						task={task}
						key={key}
						handleClick={props.handleCheckboxClick}
						handleTaskSet={(task) => props.handleTaskSet(task)}
					/>
				))}
			</div>
		</div>
	);
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
				<input
					type="checkbox"
					className="task-checkbox"
					onChange={() => {
						props.handleClick(props.task.getID());
						props.clearActiveTask();
					}}
				/>
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
export { Tasks, Taskbar };
