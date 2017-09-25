var express = require('express');
var router = express.Router();
var empresaController = require('../controllers/empresaController.js');

router.get('/', empresaController.list);

router.get('/:id', empresaController.show);

module.exports = router;
