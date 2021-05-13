import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
require("dotenv").config();

const app = express();
//Middlewares

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded());

const PORT = 5000;

app.get("/", (req, res) => {});

type interval = [Date, Date];

interface Pomodoro {
	started: Date;
	intervals: interval[];
	task: ObjectId;
	getTime(): number;
	getPomodoro(): number;
	getCalenderDate(): CalenderDate;
}
interface CalenderDate {
	year: number;
	month: number;
	date: number;
	day: number;
}
class Pomodoro {
	constructor(started: Date, intervals: interval[], task: ObjectId) {
		this.started = started;
		this.intervals = intervals;
		this.task = task;
	}

	getTime(): number {
		// Returns the time spent in the session
		let time = 0;
		this.intervals.forEach((interval: Date[]) => {
			time += interval[1].getTime() - interval[0].getTime();
		});
		return time / 1000; // returns time in seconds
	}
	getPomodoro(): number {
		// Returns number of pomodoro sessions (of pomodoro length) spent
		// Input: seconds, Output: pomodoros
		const pomodoroLength = 25 * 60; // Minutes
		const pomdoro = this.getTime() / pomodoroLength;
		return parseFloat(pomdoro.toFixed(2));
	}
	getStartCalenderDate() {
		let calenderDate: CalenderDate = {
			year: this.started.getFullYear(),
			month: this.started.getMonth(),
			date: this.started.getDate(),
			day: this.started.getDay(),
		};
		return calenderDate;
	}
}

interface Task {
	id: string;
	value: string;
	tags: string[];
	completed: boolean;
	getValue(): string;
	getTags(): string[];
	isCompleted(): boolean;
	changeStatus(): void;
}
class Task {
	constructor(
		id: string,
		value: string,
		tags: string[] = [],
		completed: boolean = false
	) {
		this.id = id;
		this.value = value;
		this.tags = tags;
		this.completed = completed;
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
	}
}
interface Tags {
	id?: ObjectId;
	value: string;
	color: string;
}

app.listen(PORT, () => {
	console.log(`Started on http://localhost:${PORT}`);
});

app.post("/api/pomodoro", (req, res) => {
	const pom = new Pomodoro(req.body.started, req.body.intervals, req.body.task);
	if (process.env.DATABASE_URI) {
		const client = new MongoClient(process.env.DATABASE_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		client.connect(async (err) => {
			console.log("Connected");
			const pomodoroDatabase = client.db("pomodoroDatabase").collection("poms");
			// perform actions on the collection object
			const result = await pomodoroDatabase.insertOne({
				started: pom.started,
				intervals: pom.intervals,
				task: new ObjectId(pom.task),
			});
			if (result.insertedCount) {
				res.statusCode = 200;
				res.send({
					message: "OK",
				});
				console.log("Pom counted");
			}
			client.close();
		});
	} else {
		console.log("NO database uri");
		res.send({
			message: "Fail",
		});
	}
});

app.get("/api/data", async (req, res) => {
	if (process.env.DATABASE_URI) {
		const client = new MongoClient(process.env.DATABASE_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		let poms: Pomodoro[] = [];
		client.connect(async (err) => {
			console.log("Get Pomodoro Connected");
			const pomodoroDatabase = client.db("pomodoroDatabase").collection("poms");

			const cursor = pomodoroDatabase.find({});
			await cursor.forEach((doc: Pomodoro) => {
				let pom = new Pomodoro(
					new Date(doc.started),
					doc.intervals.map(function (interval) {
						return [new Date(interval[0]), new Date(interval[1])];
					}),
					new ObjectId(doc.task)
				);
				poms.push(pom);
			});
			const output = makeBarChart(poms);
			if (output) {
				res.send(output);
			}
			client.close();
		});
	}
});

app.get("/api/tasks", async (req, res) => {
	const client = getMongoClient(process.env.DATABASE_URI);
	let tasks: Task[] = [];
	if (client) {
		client.connect(async (err) => {
			const tasksDatabase = client.db("tasksDatabase").collection("tasks");

			const cursor = tasksDatabase.find({ completed: false });
			await cursor.forEach((task) => {
				const newTask = new Task(
					task._id,
					task.value,
					task.tags,
					task.completed
				);
				tasks.push(newTask);
			});
			console.log("sending data");
			res.send(tasks);
			client.close();
		});
	}
});

app.post("/api/tasks", (req, res) => {
	const client = getMongoClient(process.env.DATABASE_URI);
	if (client) {
		client.connect(async (err) => {
			const tasksDatabase = client.db("tasksDatabase").collection("tasks");
			const result = await tasksDatabase.insertOne({
				value: req.body.value,
				tags: req.body.tags,
				completed: req.body.completed,
			});
			if (result.insertedCount) {
				res.statusCode = 200;
				res.send({
					message: "OK",
					task: result.ops[0], // from the console log of the result object
				});
				console.log("Task Inserted");
			}
			client.close();
		});
	}
});

app.put("/api/tasks", (req, res) => {
	console.log("OH HEY A PUT REQUEST");
	const client = getMongoClient(process.env.DATABASE_URI);
	if (client) {
		client.connect(async (err) => {
			const tasksDatabase = client.db("tasksDatabase").collection("tasks");
			if (req.body.type === "checkbox") {
				const result = await tasksDatabase.updateOne(
					{ _id: new ObjectId(req.body.id) },
					{
						$set: { completed: req.body.completed },
					}
				);
				if (result.modifiedCount) {
					res.statusCode = 200;
					res.send({
						message: "OK",
					});
				}
			}
			if (req.body.type === "modify") {
				const result = await tasksDatabase.updateOne(
					{ _id: new ObjectId(req.body.id) },
					{
						$set: { value: req.body.task.value, tags: req.body.task.tags },
					}
				);
				if (result.modifiedCount) {
					res.statusCode = 200;
					res.send({
						message: "OK",
					});
				}
			}
			client.close();
		});
	}
});

app.get("/api/tags", (req, res) => {
	const client = getMongoClient(process.env.DATABASE_URI);
	if (client) {
		client.connect(async (err) => {
			let tags: Tags[] = [];
			const tagsDatabase = client.db("tasksDatabase").collection("tags");
			const cursor = tagsDatabase.find({});
			await cursor.forEach((tag) => {
				tags.push({
					id: tag._id,
					value: tag.value,
					color: tag.color,
				});
			});

			res.statusCode = 200;
			res.send(tags);
			client.close();
		});
	}
});

app.post("/api/tags", (req, res) => {
	const client = getMongoClient(process.env.DATABASE_URI);
	const tag: Tags = {
		value: req.body.value,
		color: req.body.color,
	};
	if (client) {
		client.connect(async (err) => {
			const tagsDatabase = client.db("tasksDatabase").collection("tags");

			const result = await tagsDatabase.insertOne(tag);
			if (result.insertedCount) {
				res.statusCode = 200;
				res.send({
					message: "OK",
					tag: result.ops[0],
				});
			} else {
				res.statusCode = 400;
				res.send({
					message: "ERROR",
				});
			}
			client.close();
		});
	}
});

function getMongoClient(uri: string | undefined) {
	if (uri) {
		return new MongoClient(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	} else {
		console.log("failed to get client");
		return;
	}
}

function makeBarChart(poms: Pomodoro[]) {
	// Figures out for one day how many pomodors were done
	// this is done by finding the total time spent, associated with a start date
	// Then converts it to a equivalent pomodoro length
	type barChartColumn = {
		calenderDate: CalenderDate;
		data: number;
	};
	type barChartInfo = barChartColumn[];

	let info: barChartInfo = [];
	poms.forEach((pom) => {
		const calenderDate = pom.getStartCalenderDate();
		const check = (column: barChartColumn) => {
			if (
				column.calenderDate.year == calenderDate.year &&
				column.calenderDate.month == calenderDate.month &&
				column.calenderDate.day == calenderDate.day &&
				column.calenderDate.date == calenderDate.date
			)
				return true;
			else {
				return false;
			}
		};
		const found = info.findIndex(check);
		if (found === -1) {
			let column: barChartColumn = {
				calenderDate: calenderDate,
				data: pom.getPomodoro(),
			};
			info.push(column);
		} else {
			info[found].data += pom.getPomodoro();
		}
	});
	return info;
}
