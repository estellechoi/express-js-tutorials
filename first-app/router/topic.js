const express = require("express");
const router = express.Router();

const topic = require("./../src/topic");

// routing
// pretty url without queryString, which contributes to SEO.
router.get("/", (req, res) => topic.home(req, res));
router.get("/:id", (req, res) => topic.page(req, res));
router.get("/create", (req, res) => topic.create(req, res));
router.post("/create_process", (req, res) => topic.createProcess(req, res));
router.get("/update", (req, res) => topic.update(req, res));
router.post("/update_process", (req, res) => topic.updateProcess(req, res));
router.post("/delete_process", (req, res) => topic.deleteProcess(req, res));

module.exports = router;
