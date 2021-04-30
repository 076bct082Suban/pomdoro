import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./css/moreOptions.css";
import img from "./images/moreOptions.svg";
import MultiSelectOptions from "./MultiSelectOptions";

export default function MoreOptions(props) {
	const [value, setValue] = useState(props.task.value);
	const [task, setTask] = useState(props.task);

	// keeping track of tags
	// console.log(props.task.tags);
	// console.log(props.tags);
	const [selected, setSelected] = useState(props.task.tags);
	const [available, setAvailable] = useState(props.tags);

	useEffect(() => {
		setTask((prevState) => ({ ...prevState, value: value }));
	}, [value]);

	useEffect(() => {
		setTask((prevState) => ({ ...prevState, tags: selected }));
	}, [selected]);

	// useEffect(() => {
	// 	props.updateTags(available[available.length - 1]);
	// }, [available]);

	const handleSave = () => {
		props.handleTaskValueUpdate(task);
	};

	return (
		<div>
			<Popup
				trigger={<img src={img} alt="more options" className="more-options" />}
				position="center center"
				modal
				nested
			>
				{(close) => (
					<div className="modal">
						<button className="close" onClick={close}>
							&times;
						</button>
						<div className="header">Edit Task </div>
						<div className="content">
							<form
								className="input"
								onSubmit={(event) => event.preventDefault()}
							>
								<input
									type="text"
									value={value}
									onChange={(event) => {
										setValue(event.target.value);
									}}
								/>
							</form>
							<MultiSelectOptions
								className="tags"
								available={available}
								setAvailable={(state) => setAvailable(state)}
								selected={selected}
								setSelected={(state) => setSelected(state)}
							/>
						</div>
						<div className="actions">
							<Popup
								trigger={<button className="button"> Trigger </button>}
								position="top center"
								nested
							>
								<span>
									Lorem ipsum dolor sit amet, consectetur adipisicing elit.
									Beatae magni omnis delectus nemo, maxime molestiae dolorem
									numquam mollitia, voluptate ea, accusamus excepturi deleniti
									ratione sapiente! Laudantium, aperiam doloribus. Odit, aut.
								</span>
							</Popup>
							<button
								className="save"
								onClick={() => {
									handleSave();
									close();
								}}
							>
								Save
							</button>
							<button
								className="button"
								onClick={() => {
									console.log("modal closed ");
									close();
								}}
							>
								close modal
							</button>
						</div>
					</div>
				)}
			</Popup>
		</div>
	);
}
