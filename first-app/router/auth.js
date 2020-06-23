const express = require("express");
const router = express.Router();

const auth = require("./../src/auth");

// routing
router.get("/signin", (req, res) => auth.signin(req, res));
// router.post("/signin_process", (req, res) => auth.signinProcess(req, res));

router.get("/signup", (req, res) => auth.signup(req, res));
router.post("/signup_process", (req, res) => auth.signupProcess(req, res));
router.get("/signout_process", (req, res) => auth.signoutProcess(req, res));

module.exports = router;
