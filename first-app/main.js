// module 'express' imported
const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser"); // request body parser
const compression = require("compression"); // response get compressed for cutting network cost

const sessionConfig = require("./src/session");

// routers as middlewares
const indexRouter = require("./router/index");
const topicRouter = require("./router/topic");
const authorRouter = require("./router/author");

// app's top-level generic use of middlewares
app.use(compression());
const urlencodedParser = bodyParser.urlencoded({ extended: false }); // parse application/x-www-form-urlencoded
const jsonParser = bodyParser.json(); // parse application/json
app.use(urlencodedParser);
app.use(jsonParser);

// middleware by express
// virtual path prefix 'static' to redirect to real path 'public'
app.use("/static", express.static("/public"));

// req.session property is added by using express-session middleware.
app.use(sessionConfig);

// self-made middle ware
app.use((req, res, next) => {
	req.requestTime = Date.now();
	next(); // call next middle ware
	// next('route'); call next router's middle ware
});

app.use("/", indexRouter);
app.use("/topic", topicRouter);
app.use("/author", authorRouter);

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
