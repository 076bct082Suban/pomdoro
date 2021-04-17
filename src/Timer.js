export default function Timer(props) {
	let time = clockConvertion(props.clock);
	return (
		<div>
			<Clock time={time} onClick={() => props.handleClick()} />
			Current task
			{props.started ? (
				props.running ? (
					<p>Focus</p>
				) : (
					<Quit quit={() => props.quit()} />
				)
			) : (
				<p>Click on the timer to start</p>
			)}
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
