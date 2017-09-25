var express = require('express');
var router = express.Router();
var comercialController = require('../controllers/comercialController.js');

/*
 * GET
 */
router.get('/', comercialController.list);

/*
 * GET
 */
router.get('/:id', comercialController.show);

/*
 * POST
 */
router.post('/', comercialController.create);

/*
 * PUT
 */
router.put('/:id', comercialController.update);

/*
 * DELETE
 */
router.delete('/:id', comercialController.remove);

module.exports = router;
