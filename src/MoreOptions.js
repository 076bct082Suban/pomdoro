import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./css/moreOptions.css";
import img from "./images/moreOptions.svg";

export default function MoreOptions(props) {
	const [value, setValue] = useState(props.task.getValue());

	useEffect(() => {
		return () => {
			// props.handleAnyTaskUpdate(props.task.getID(), {});
		};
	});

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
						<div className="header"> Modal Title </div>
						<div className="content">
							<form onSubmit={(event) => event.preventDefault()}>
								<input
									type="text"
									value={value}
									onChange={(event) => {
										setValue(event.target.value);
									}}
								/>
							</form>
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
