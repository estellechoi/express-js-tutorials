// module 'express' imported
const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser"); // request body parser
const compression = require("compression"); // response get compressed for cutting network cost

// middle ware by express
const static = express.static("img");

// app's top-level generic use of middle wares
app.use(compression());
const urlencodedParser = bodyParser.urlencoded({ extended: false }); // parse application/x-www-form-urlencoded
const jsonParser = bodyParser.json(); // parse application/json
app.use(urlencodedParser);
app.use(jsonParser);
app.use("/public", static); // virtual path prefix

// self-made middle ware
app.use((req, res, next) => {
	req.requestTime = Date.now();
	next(); // call next middle ware
	// next('route'); call next router's middle ware
});

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
app.get("/topic/create", (req, res) => res.send(topic.create(req, res)));
app.post("/topic/create_process", (req, res) =>
	res.redirect(302, topic.createProcess(req, res))
);
app.get("/topic/update", (req, res) => res.send(topic.update(req, res)));
app.post("/topic/update_process", (req, res) =>
	res.redirect(topic.updateProcess(req, res))
);
app.post("/topic/delete_process", (req, res) =>
	res.redirect(topic.deleteProcess(req, res))
);
app.get("/author", (req, res) => res.send(user.home(req, res)));
app.post("/author/create_process", (req, res) =>
	res.redirect(user.createProcess(req, res))
);
app.get("/author/update", (req, res) => res.send(user.update(req, res)));
app.post("/author/update_process", (req, res) =>
	res.redirect(302, user.updateProcess(req, res))
);
app.get("/author/delete_process", (req, res) =>
	res.redirect(302, user.deleteProcess(req, res))
);

// 404 eror
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
