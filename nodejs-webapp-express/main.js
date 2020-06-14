// module 'express' imported
const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser"); // request body parser
const compression = require("compression"); // response get compressed for cutting network cost

// app's top-level generic use of middlewares
app.use(compression({ filter: shouldCompress }));
const urlencodedParser = bodyParser.urlencoded({ extended: false }); // parse application/x-www-form-urlencoded
const jsonParser = bodyParser.json(); // parse application/json
app.use(urlencodedParser);
app.use(jsonParser);

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

app.listen(port, () =>
	console.log(`Example app listening at http://localhost:${port}`)
);

// 	if (pathname === "/") {
// 		if (queryData.id === undefined) topic.home(request, response, queryData);
// 		else topic.page(request, response, queryData);
// 	} else if (pathname === "/create") {
// 		topic.create(request, response, queryData);
// 	} else if (pathname === "/create_process") {
// 		topic.createProcess(request, response, queryData);
// 	} else if (pathname === "/update") {
// 		topic.update(request, response, queryData);
// 	} else if (pathname === "/update_process") {
// 		topic.updateProcess(request, response, queryData);
// 	} else if (pathname === "/delete_process") {
// 		topic.deleteProcess(request, response, queryData);
// 	} else if (pathname === "/author") {
// 		user.home(request, response, queryData);
// 	} else if (pathname === "/create_author_process") {
// 		user.createProcess(request, response, queryData);
// 	} else if (pathname === "/update_author") {
// 		user.update(request, response, queryData);
// 	} else if (pathname === "/update_author_process") {
// 		user.updateProcess(request, response, queryData);
// 	} else if (pathname === "/delete_author_process") {
// 		user.deleteProcess(request, response, queryData);
// 	} else {
// 		response.writeHead(404);
// 		response.end("Not found");
// 	}
// });
