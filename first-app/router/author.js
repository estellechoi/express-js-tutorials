const express = require("express");
const router = express.Router();

const user = require("./../src/user");

router.get("", (req, res) => res.send(user.home(req, res)));
router.post("/create_process", (req, res) =>
	res.redirect(user.createProcess(req, res))
);
router.get("/update", (req, res) => res.send(user.update(req, res)));
router.post("/update_process", (req, res) =>
	res.redirect(302, user.updateProcess(req, res))
);
router.get("/delete_process", (req, res) =>
	res.redirect(302, user.deleteProcess(req, res))
);

module.exports = router;
