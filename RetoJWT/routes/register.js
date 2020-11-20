const express = require('express');
const router = express.Router();
const HandlerGenerator = require('../handlergenerator');

router.post('/', HandlerGenerator.register);

module.exports = router;
