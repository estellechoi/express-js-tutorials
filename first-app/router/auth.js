const express = require("express");
const router = express.Router();
const auth = require("./../src/auth");

// routing
module.exports = function route(passport) {
	router.get("/signin", (req, res) => auth.signin(req, res));
	// router.post("/signin_process", (req, res) => auth.signinProcess(req, res));
	// passport authentication
	router.post(
		"/signin_process",
		passport.authenticate("local", {
			successRedirect: "/",
			failureRedirect: "/auth/signin",
			// this option insert flash : {error: ['message']} for data field into session table, calling req.flash() method inside.
			failureFlash: true,
			// flash: {success: ['message']}
			successFlash: false,
		})
	);

	router.get("/signup", (req, res) => auth.signup(req, res));
	router.post("/signup_process", (req, res) => auth.signupProcess(req, res));
	router.get("/signout_process", (req, res) => auth.signoutProcess(req, res));

	return router;
};
