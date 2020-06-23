const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

const shortid = require("shortid");

// Set some default spaces (required if your JSON file is empty)
db.defaults({ topic: [], author: [], user: [] }).write();

// INSERT
const sid = shortid.generate();
db.get("author")
	.push({ id: sid, name: "bomin", profile: "fullstack engineer" })
	.write();

db.get("topic")
	.push({
		id: shortid.generate(),
		title: "NEw !!!",
		description: "...",
		author: sid,
	})
	.write();

// SELECT
// const topic = db.get("topic").value();
// const topic = db.get("topic").find({ id: 1 }).value();
// console.log(topic);

// UPDATE
// db.get("topic").find({ id: 1 }).assign({ title: "mysql and lowdb" }).write();

// DELETE
// db.get("topic").remove({ description: "..." }).write();
