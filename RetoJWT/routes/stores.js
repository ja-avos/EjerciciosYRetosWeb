var express = require('express');
const HandlerGenerator = require('../handlergenerator');
var router = express.Router();
var app = express();
const mw = require('../middleware');

router.get('/', mw.checkJWT, HandlerGenerator.sendStores);

router.post('/:storename/products', mw.checkJWT, HandlerGenerator.addProduct);

router.delete('/:storename/products', mw.checkJWT, HandlerGenerator.deleteProduct);

router.put('/:storename', mw.checkJWT, HandlerGenerator.editStore);

module.exports = router;
