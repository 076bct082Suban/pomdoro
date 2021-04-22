export default class Task {
	constructor(id, value, tags = [], completed = false) {
		this.id = id;
		this.value = value;
		this.tags = tags;
		this.completed = completed;
	}
	getID() {
		return this.id;
	}
	getValue() {
		return this.value;
	}
	getTags() {
		return this.tags;
	}
	isCompleted() {
		return this.completed;
	}
	changeStatus() {
		this.completed = !this.completed;
		return this.completed;
	}
}
