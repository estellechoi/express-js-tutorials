const express = require("express");
const router = express.Router();

const topic = require("./../src/topic");

// routing
// pretty url without queryString, which contributes to SEO.
router.get("/", (req, res) => res.send(topic.home(req, res)));
router.get("/:id", (req, res) => {
	console.log(req.params);
	res.send(topic.page(req, res));
});

router.get("/create", (req, res) => res.send(topic.create(req, res)));
router.post("/create_process", (req, res) =>
	res.redirect(302, topic.createProcess(req, res))
);
router.get("/update", (req, res) => res.send(topic.update(req, res)));
router.post("/update_process", (req, res) =>
	res.redirect(topic.updateProcess(req, res))
);
router.post("/delete_process", (req, res) =>
	res.redirect(topic.deleteProcess(req, res))
);

module.exports = router;
