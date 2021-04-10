import React from "react";
export default class ModeForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: props.currentMode };
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange = (event) => {
		this.setState({ value: parseInt(event.target.value) });
		this.props.handleModeChange(parseInt(event.target.value));
	};

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<label>
						Select The mode
						<select value={this.state.value} onChange={this.handleChange}>
							<option value={1}>Timer</option>
							<option value={2}>Pom</option>
						</select>
					</label>
				</form>
			</div>
		);
	}
}
