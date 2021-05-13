import React from "react";
import { Line } from "react-chartjs-2";
import "./css/Stats.css";
export default class Stats extends React.Component {
	render() {
		return (
			<div>
				<div id="stats">
					<h1>STAts</h1>
					<LineGraph />
				</div>
			</div>
		);
	}
}
class LineGraph extends React.Component {
	constructor(props) {
		super(props);
		this.chartReference = React.createRef();
		this.options = {
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
						},
					},
				],
			},
		};
		this.state = {
			data: {},
		};
	}

	componentDidMount() {
		console.log(this.chartReference); // returns a Chart.js instance reference
		let data = {};
		fetch("http://localhost:5000/api/data")
			.then((res) => res.json())
			.then((result) => {
				const labels = result.map(
					(unit) =>
						`${unit.calenderDate.year}-${unit.calenderDate.month}-${unit.calenderDate.date}`
				);
				const info = result.map((unit) => unit.data);
				data = {
					labels: labels,
					datasets: [
						{
							label: "Pomodoros",
							data: info,
							backgroundColor: "rgba(255,99,132,0.2)",
							borderColor: "rgba(255,99,132,1)",
							fill: false,
						},
					],
				};
				this.setState({ data: data });
				let barChart = this.chartReference.chartInstance;
				barChart.update();
				console.log(this.state.data);
			});
	}

	render() {
		return (
			<Line
				ref={(reference) => (this.chartReference = reference)}
				data={this.state.data}
				options={this.options}
				barPercentage={0.5}
			/>
		);
	}
}
