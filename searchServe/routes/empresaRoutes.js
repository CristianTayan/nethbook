var express = require('express');
var router = express.Router();
var empresaController = require('../controllers/empresaController.js');

router.get('/:id', empresaController.show);

module.exports = router;
