const express = require("express");
const router = express.Router();

const author = require("../src/author");

router.get("", (req, res) => res.send(author.home(req, res)));
router.post("/create_process", (req, res) =>
	res.redirect(author.createProcess(req, res))
);
router.get("/update", (req, res) => res.send(author.update(req, res)));
router.post("/update_process", (req, res) =>
	res.redirect(302, author.updateProcess(req, res))
);
router.get("/delete_process", (req, res) =>
	res.redirect(302, author.deleteProcess(req, res))
);

module.exports = router;
