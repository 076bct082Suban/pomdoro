export default class Pom {
	constructor() {
		this.started = new Date();
		this.intervals = [];
		this.lastAction = new Date();
		this.running = true;
		this.task = "";
	}
	pauseEvent() {
		let pauseTime = new Date();
		this.intervals.push([this.lastAction, pauseTime]);
		this.lastAction = pauseTime;
		this.running = false;
	}
	continueEvent() {
		if (this.running === false) {
			this.lastAction = new Date();
		}
	}
}
