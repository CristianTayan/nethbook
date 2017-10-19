var empresaModel = require('../models/empresaModel.js');

/**
 * empresaController.js
 *
 * @description :: Server-side logic for managing empresas.
 */
module.exports = {
  show: function (req, res) {
    var id = req.params.id;
    empresaModel.find({empresa: { $regex: id, $options: 'i' }}, function (err, empresa) {
        if (err) {
            return res.status(500).json({
                message: 'Error when getting empresa.',
                error: err
            });
        }
        if (!empresa) {
            return res.status(404).json({
                message: 'No such empresa'
            });
        }
        return res.json(empresa);
    }).limit(20);
  }
};
