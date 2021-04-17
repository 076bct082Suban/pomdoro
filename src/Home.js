import React from "react";
import Pomodoro from "./Pomodoro";
import "./css/Home.css";
import stats_icon from "./images/stats_icon.svg";
import { useHistory } from "react-router-dom";

export default class Home extends React.Component {
	render() {
		return (
			<div>
				<div id="top-bar">
					<TopBar />
				</div>
				<div id="pomodoro">
					<Pomodoro />
				</div>
			</div>
		);
	}
}

function TopBar(props) {
	let history = useHistory();
	return (
		<div>
			<img
				className="icon"
				id="history-icon"
				onClick={() => history.push("/stats")}
				src={stats_icon}
				alt="icon for stats"
			/>
		</div>
	);
}
