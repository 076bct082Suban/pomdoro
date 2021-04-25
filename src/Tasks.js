import React from "react";
import playButton from "./images/playButton.svg";
import crossButton from "./images/crossButton.svg";
import "./css/tasks.css";
import MoreOptions from "./MoreOptions";

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
						topBarTask={props.task}
						task={task}
						key={key}
						handleClick={props.handleCheckboxClick}
						handleTaskSet={(task) => props.handleTaskSet(task)}
						handleTaskValueUpdate={props.handleTaskValueUpdate}
						updateTags={props.updateTags}
					/>
				))}
			</div>
		</div>
	);
}

function TaskRow(props) {
	if (props.topBarTask.id === props.task.id) {
		return <div></div>;
	}
	return (
		<div>
			<div className="task-row">
				<input
					type="checkbox"
					className="task-checkbox"
					checked={props.task.completed}
					onChange={() => props.handleClick(props.task.getID())}
				></input>

				<p className="value">{props.task.getValue()}</p>

				<MoreOptions
					task={props.task}
					handleTaskValueUpdate={props.handleTaskValueUpdate}
					className="more-options"
					updateTags={props.updateTags}
				/>

				<img
					className={"play-button"}
					alt={"Start task button "}
					src={playButton}
					onClick={() => {
						props.handleTaskSet(props.task);
					}}
				/>
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
				<p className="value">{props.task.getValue()}</p>
				<MoreOptions task={props.task} />
				<img
					src={crossButton}
					alt="cross button"
					onClick={() => props.clearActiveTask()}
					className="cross-button"
				/>
			</div>
		</>
	);
}

export { Tasks, Taskbar };
