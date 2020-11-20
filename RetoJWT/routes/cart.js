var express = require("express");
var router = express.Router();
const HandlerGenerator = require("../handlergenerator");
const mw = require('../middleware');

router.get("/", mw.checkJWT, HandlerGenerator.sendCart);

router.post('/', mw.checkJWT, HandlerGenerator.buyProducts);

router.post('/checkout', mw.checkJWT, HandlerGenerator.checkout);

module.exports = router;
