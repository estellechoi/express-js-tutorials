const path = require("path");
const connection = require("./db");
const template = require("./template");

exports.isOnline = (req) => {
	// console.log(req.session);
	// if (req.session && req.session.online) return req.session.online;

	// refactored with passport.js
	if (req.user) return true;
	return false;
};

exports.signin = (req, res) => {
	const flashMsg = req.flash();
	let errorMsg = "";
	if (flashMsg.err && flashMsg.err.length) errorMsg = flashMsg.err[0];

	const title = "Sign In";
	const html = template.getHTML(
		title,
		"",
		`<h2>${title}</h2>	                 
        <a href="/">Go Home</a>
		<form action="/auth/signin_process" method="post">
			<label>${errorMsg}</label>
            <p>
                <input type="text" name="email" placeholder="Email">
            </p>
            <p>
                <input type="password" name="password" placeholder="Password">
            </p>
            <p>
                <input type="submit" value="Sign in">
            </p>
        </form>`,
		""
	);
	res.status(200).send(html);
};

exports.signinProcess = (req, res) => {
	console.log(req);

	const postData = req.body; // body property was added by body-parser middle ware.
	const email = postData.email;
	const password = postData.password;

	// using ? in sql query blocks possible hacking attempts.
	connection.query(
		`SELECT * FROM user WHERE email = ? and password = ?`,
		[email, password],
		(err, results) => {
			if (err) return next(err);
			if (!results.length) return res.status(200).redirect("/auth/signup");

			// 로그인 성공시
			// req.session object is saved in the 'sessions' mysql table.
			// created cookie object is automatically one of the properites of the object.
			req.session.online = true;
			req.session.name = results[0].email;

			// get it started immediately to save session data into session store to prevent from delaying.
			req.session.save(() => {
				res.status(302).redirect("/");
			});
		}
	);
};

exports.signup = (req, res) => {
	const title = "Sign Up";
	const html = template.getHTML(
		title,
		"",
		`<h2>${title}</h2>	                 
        <a href="/">Go Home</a>
        <form action="/auth/signup_process" method="post">
            <p>
                <input type="text" name="email" placeholder="Email">
            </p>
            <p>
                <input type="password" name="password" placeholder="Password">
            </p>
            <p>
                <input type="submit" value="Sign up">
            </p>
        </form>`
	);
	res.status(200).send(html);
};

exports.signupProcess = (req, res) => {
	const postData = req.body; // body property was added by body-parser middle ware.
	const email = postData.email;
	const password = postData.password;

	// using ? in sql query blocks possible hacking attempts.
	connection.query(
		`INSERT INTO user (email, password) VALUES (?, ?)`,
		[email, password],
		(err, results) => {
			if (err) return next(err);

			// 로그인 성공시
			res.status(302).redirect("/auth/signin");
		}
	);
};

exports.signoutProcess = (req, res) => {
	// codes added as refactored with passport.js
	// this code deletes 'user' property of request object.
	// alse the passport:{user: 1} -> passport:{} in db session table.
	req.logout();

	// destroy() method removes the current session.
	// the session row is deleted and a new row with new session id is inserted automatically in mysql table without passport.js.
	req.session.destroy((err) => res.status(200).redirect("/"));

	// save() method saves the current status of session.
	// req.session.save((err) => res.status(200).redirect("/"));
};
