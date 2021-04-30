import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import modifyTag from "./images/modifyTag.svg";
import "./css/MultiSelectOptions.css";

function randomColorPicker() {
	const colors = [
		"#ff0000", //red
		"#00ff00", //greeen
		"#0000ff", // blue
		"#72705B", // Gold fusion
		"#E6AF2E", // Goldenrod
		"#4DA1A9", // Cadet Blue
		"#F1EDEE", // Isabelline
	];
	const random = Math.floor(Math.random() * colors.length);
	return colors[random];
}

export default function MultiSelectOptions(props) {
	const [text, setText] = useState("");

	const updateTagArrays = (tag) => {
		// What we do here is, completely ignore that we added anything when we hit enter
		// Firsty, this code is run before the props.available 's value changes(appends) with setState
		// So now we change it again
		let available = [...props.available, tag];
		let selected = [...props.selected, tag];

		// props.available.forEach((obj) => {
		// 	if (!(obj.value === tag.value)) {
		// 		available.push(obj);
		// 	} else {
		// 		console.log("here");
		// 		available.push(tag);
		// 	}
		// });
		// props.selected.forEach((obj) => {
		// 	if (!(obj.value === tag.value)) selected.push(obj);
		// 	else {
		// 		selected.push(tag);
		// 	}
		// });

		props.setAvailable(available);
		props.setSelected(selected);
	};

	const deleteSelectedTag = (tag) => {
		let selected = [];
		props.selected.forEach((obj) => {
			if (obj.id === tag.id) {
				console.log("found it");
			} else {
				selected.push(obj);
			}
		});
		props.setSelected(selected);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const color = randomColorPicker();
		if (!props.available.find((tag) => tag.value === text)) {
			let newTag = {
				value: text,
				color: color,
				id: "",
			};
			props.setAvailable([...props.available, newTag]);
			fetch("http://localhost:5000/api/tags", {
				method: "POST",
				mode: "cors",
				credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newTag),
			})
				.then((res) => res.json())
				.then((result) => {
					// chaning the ._id that comes from server to .id
					const obj = result.tag;
					updateTagArrays({
						id: obj._id,
						value: obj.value,
						color: obj.color,
					});
				});
		}
		if (!props.selected.find((tag) => tag.value === text)) {
			let found = props.available.find((tag) => tag.value === text);
			if (found) {
				props.setSelected([...props.selected, found]);
				return;
			}
			let newTag = {
				value: text,
				color: color,
				id: "",
			};

			props.setSelected([...props.selected, newTag]);
		}
		setText("");
	};

	const handleSelect = (tag) => {
		if (!props.selected.includes(tag))
			props.setSelected([...props.selected, tag]);
	};

	return (
		<div className="popup">
			<Popup
				trigger={
					<div className="trigger">
						{props.selected.length === 0 ? (
							"Add tags"
						) : (
							<Trigger selected={props.selected} />
						)}
					</div>
				}
				position="center center"
				nested
			>
				{(close) => (
					<div>
						{props.selected.map((tag, key) => (
							<TagDeleteBox
								tag={tag}
								key={key}
								deleteSelectedTag={(tag) => deleteSelectedTag(tag)}
							/>
						))}
						<form
							onSubmit={(e) => {
								handleSubmit(e);
								close();
							}}
						>
							<input
								type="text"
								value={text}
								onChange={(event) => setText(event.target.value)}
								onClick={() => {}}
							/>
						</form>
						<div>
							More Options:
							{props.available.map((tag, key) => (
								<OptionRow
									tag={tag}
									key={key}
									handleSelect={(tag) => handleSelect(tag)}
									deleteSelectedTag={(tag) => deleteSelectedTag(tag)}
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
				className="option-row"
				onClick={() => {
					props.handleSelect(props.tag);
					props.close();
				}}
			>
				<TagBox tag={props.tag} />
				<ModifyTag
					tag={props.tag}
					deleteSelectedTag={(tag) => props.deleteSelectedTag(tag)}
				/>
			</div>
		</div>
	);
}

function ModifyTag(props) {
	return (
		<>
			<Popup
				trigger={<img src={modifyTag} alt="change" className="modify-tags" />}
			></Popup>
		</>
	);
}
function Trigger(props) {
	return (
		<>
			{props.selected.map((tag, key) => (
				<TagBox tag={tag} key={key} />
			))}
		</>
	);
}

function TagBox(props) {
	let style = {
		backgroundColor: props.tag.color,
	};
	return (
		<>
			<div style={style} className="tag-box">
				{props.tag.value}{" "}
			</div>
		</>
	);
}

function TagDeleteBox(props) {
	return (
		<>
			<div className="tag-delete-box">
				<TagBox tag={props.tag} />
				<div onClick={() => props.deleteSelectedTag(props.tag)}>x</div>
			</div>
		</>
	);
}
