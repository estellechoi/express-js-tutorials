const express = require("express");
const parseurl = require("parseurl");
const session = require("express-session");

const app = express();

// req.session property is added by using session middleware.
app.use(
	session({
		name: "connect.sid", // default
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
	})
);

// middleware declared
app.use((req, res, next) => {
	if (!req.session.views) req.session.views = {};
	const pathname = parseurl(req).pathname; // url pathname
	req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;

	next();
});

app.get("/home", function (req, res, next) {
	res.send("you viewed this page " + req.session.views["/home"] + " times");
});

app.listen(3000, () =>
	console.log(`Example app listening at http://localhost:3000`)
);
