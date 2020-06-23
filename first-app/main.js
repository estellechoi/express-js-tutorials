// module 'express' imported
const express = require("express");
const app = express();
const port = 3000;
const connection = require("./src/db");

const bodyParser = require("body-parser"); // request body parser
const compression = require("compression"); // response get compressed for cutting network cost

// routers as middlewares
const indexRouter = require("./router/index");
const topicRouter = require("./router/topic");
const authorRouter = require("./router/author");
const authRouter = require("./router/auth");

// app's top-level generic use of middlewares
app.use(compression());
const urlencodedParser = bodyParser.urlencoded({ extended: false }); // parse application/x-www-form-urlencoded
const jsonParser = bodyParser.json(); // parse application/json
app.use(urlencodedParser);
app.use(jsonParser);
// app.use(express.cookieParser());
// app.use(express.bodyParser());

// self-made middle ware
app.use((req, res, next) => {
	req.requestTime = Date.now();
	next(); // call next middle ware
	// next('route'); call next router's middle ware
});

// middleware by express
// virtual path prefix 'static' to redirect to real path 'public'
app.use("/static", express.static("/public"));

// req.session property is added by using express-session middleware.
const sessionConfig = require("./src/session");
app.use(sessionConfig);

// this middleware offers req.flash() method.
// should be after session.
const flash = require("connect-flash");
app.use(flash());

// flash usage example

// app.get("/flash", (req, res) => {
// 	// Set a flash message by passing the key.
// 	// flash : {key : 'value'} is added in data field of session table.
// 	req.flash("key", "value");
// 	res.redirect("/");
// });

// app.get("/flash_display", (req, res) => {
// 	// req.flash() returns the value of 'flash' property from session table, deleting the returned data from the table.
// 	const flashMsg = req.flash();
// 	res.redirect("/");
// 	// res.render("index", { messages: req.flash("info") });
// });

// passport.js code should be after session code.
const passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy;

app.use(passport.initialize());
app.use(passport.session());

// storing session when a user signs in successfully.
passport.serializeUser((user, done) => {
	// 'user' object, the first arg, is the object from database when authentication success.
	done(null, user.id);
	// then, the seconde arg of done() becomes the value for 'user' property of the 'passport' object  in req.session so it is saved in session store.
});

// called whenever user accesses after signin
passport.deserializeUser((id, done) => {
	console.log(id);
	connection.query(`SELECT * FROM user WHERE id = ?`, [id], (err, result) => {
		console.log(result[0]);
		done(err, result[0]);
		// the second arg object of done() becomes the value for 'user' property of request object in routers' callback.
	});
});

// passport configuration
passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		(email, password, done) => {
			connection.query(
				`SELECT * FROM user WHERE email = ?`,
				[email],
				(err1, emailResult) => {
					// console.log(err1, emailResult);
					if (err1) return done(err1);
					if (!emailResult.length)
						return done(null, false, { message: "Incorrect email." });

					connection.query(
						`SELECT * FROM user WHERE email = ? and password = ?`,
						[email, password],
						(err2, result) => {
							if (err2) return done(err2);
							if (!result.length)
								return done(null, false, { message: "Incorrect password." });
							return done(null, result[0]);
						}
					);
				}
			);
		}
	)
);

app.use("/", indexRouter);
app.use("/topic", topicRouter);
app.use("/author", authorRouter);
app.use("/auth", authRouter);

// passport authentication
app.post(
	"/auth/signin_process",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/auth/signin",
		// this option insert flash : {error: ['message']} for data field into session table, calling req.flash() method inside.
		failureFlash: true,
		// flash: {success: ['message']}
		successFlash: false,
	})
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
