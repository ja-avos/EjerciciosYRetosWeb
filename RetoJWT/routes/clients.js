var express = require('express');
const HandlerGenerator = require('../handlergenerator');
var router = express.Router();
const mw = require('../middleware');

router.get('/', mw.checkJWT, HandlerGenerator.sendClients);

router.get('/:user', mw.checkJWT, HandlerGenerator.sendClient);

router.put('/:user', mw.checkJWT, HandlerGenerator.editClient);

module.exports = router;
