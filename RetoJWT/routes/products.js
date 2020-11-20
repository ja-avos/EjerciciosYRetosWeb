var express = require("express");
var router = express.Router();
const HandlerGenerator = require("../handlergenerator");
const mw = require('../middleware');

router.get("/", mw.checkJWT, HandlerGenerator.sendProducts);

router.post('/', mw.checkJWT, HandlerGenerator.addProduct);

router.delete('/', mw.checkJWT, HandlerGenerator.deleteProduct);

module.exports = router;
