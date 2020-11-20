var express = require("express");
var router = express.Router();
const HandlerGenerator = require("../handlergenerator");

router.post("/", HandlerGenerator.login);

module.exports = router;
