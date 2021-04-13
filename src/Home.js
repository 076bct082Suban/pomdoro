import React from "react";
import Pomodoro from "./Pomodoro";
import stats_icon from "./images/stats_icon.svg";
import { useHistory } from "react-router-dom";
// import "css/Home.css";
export default class Home extends React.Component {
	render() {
		return (
			<div>
				<TopBar />
				<Pomodoro />
			</div>
		);
	}
}

function TopBar(props) {
	let history = useHistory();
	return (
		<div>
			<img
				onClick={() => history.push("/stats")}
				src={stats_icon}
				alt="icon for stats"
				width="8%"
				height="8%"
			/>
		</div>
	);
}
