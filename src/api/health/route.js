const { sendOk } = require("./controller");

const router = require("express").Router();

router.get("/", sendOk);

module.exports = router;
