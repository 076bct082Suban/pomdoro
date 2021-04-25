import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "./css/MultiSelectOptions.css";

export default function MultiSelectOptions() {
	const [text, setText] = useState("");
	const [available, setAvailable] = useState(["school", "chores"]);
	const [selected, setSelected] = useState([]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!available.includes(text)) setSelected([...selected, text]);
		if (!selected.includes(text)) setAvailable([...available, text]);
		setText("");
	};

	const handleSelect = (tag) => {
		if (!selected.includes(tag)) setSelected([...selected, tag]);
	};

	// useEffect(() => {}, text);
	return (
		<div className="popup">
			<Popup
				trigger={
					<div className="trigger">
						{selected.length === 0 ? (
							"Add tags"
						) : (
							<Trigger selected={selected} />
						)}
					</div>
				}
				position="center center"
				nested
			>
				{(close) => (
					<div>
						<form onSubmit={handleSubmit}>
							<input
								type="text"
								value={text}
								onChange={(event) => setText(event.target.value)}
								onClick={() => {}}
							/>
						</form>
						<div>
							More Options:
							{available.map((tag, key) => (
								<OptionRow
									tag={tag}
									key={key}
									handleSelect={(tag) => handleSelect(tag)}
									close={() => close()}
								/>
							))}
						</div>
					</div>
				)}
			</Popup>
		</div>
	);
}

function OptionRow(props) {
	return (
		<div>
			<div
				className="value"
				onClick={() => {
					props.handleSelect(props.tag);
					props.close();
				}}
			>
				{props.tag}
			</div>
		</div>
	);
}

function Trigger(props) {
	return (
		<>
			{props.selected.map((value, key) => (
				<TagBox value={value} key={key} />
			))}
		</>
	);
}

function TagBox(props) {
	return (
		<>
			<div className="tag-box">{props.value}</div>
		</>
	);
}
