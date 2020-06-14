// module 'express' imported
const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser"); // request body parser
const compression = require("compression"); // response get compressed for cutting network cost
const requestTime = require("./src/requestTime");

// middle ware by express
const static = express.static("img");

// app's top-level generic use of middle wares
app.use(compression({ filter: shouldCompress }));
const urlencodedParser = bodyParser.urlencoded({ extended: false }); // parse application/x-www-form-urlencoded
const jsonParser = bodyParser.json(); // parse application/json
app.use(urlencodedParser);
app.use(jsonParser);
app.use(requestTime());
app.use("/public", static); // virtual path prefix

// services
var topic = require("./src/topic");
var user = require("./src/user");

// routing
// pretty url without queryString, which contributes to SEO.
app.get("/", (req, res) => res.send(topic.home(req, res)));
app.get("/:id", (req, res) => {
	console.log(req.params);
	res.send(topic.page(req, res));
});
app.get("/create", (req, res) => res.send(topic.create(req, res)));
app.post("/create_process", (req, res) =>
	res.redirect(302, topic.createProcess(req, res))
);
app.get("/update", (req, res) => res.send(topic.update(req, res)));
app.post("/update_process", (req, res) =>
	res.redirect(topic.updateProcess(req, res))
);
app.post("/delete_process", (req, res) =>
	res.redirect(topic.deleteProcess(req, res))
);
app.get("/author", (req, res) => res.send(user.home(req, res)));
app.post("/create_author_process", (req, res) =>
	res.redirect(user.createProcess(req, res))
);
app.get("/update_author", (req, res) => res.send(user.update(req, res)));
app.post("/update_author_process", (req, res) =>
	res.redirect(302, user.updateProcess(req, res))
);
app.get("/delete_author_process", (req, res) =>
	res.redirect(302, user.deleteProcess(req, res))
);

app.use((req, res, next) => {
	res.status(404).send("Sorry cant find that!");
});

// Error Handler is called when next(err) is called
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

app.listen(port, () =>
	console.log(`Example app listening at http://localhost:${port}`)
);
