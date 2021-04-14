import React from "react";
import { Bar } from "react-chartjs-2";
export default class Stats extends React.Component {
	render() {
		return (
			<div>
				<h1>STAts</h1>
				<MyComponent />
			</div>
		);
	}
}
class MyComponent extends React.Component {
	constructor(props) {
		super(props);
		this.chartReference = React.createRef();
		this.options = {};
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
							borderWidth: 1,
							hoverBackgroundColor: "rgba(255,99,132,0.4)",
							hoverBorderColor: "rgba(255,99,132,1)",
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
			<Bar
				ref={(reference) => (this.chartReference = reference)}
				data={this.state.data}
				options={this.options}
				width={400}
				height={200}
			/>
		);
	}
}
