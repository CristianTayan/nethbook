var empresaModel = require('../models/empresaModel.js');

module.exports = {

    list: function (req, res) {

        empresaModel.find(function (err, empresas) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting empresa.',
                    error: err
                });
            }
            return res.json(empresas);
        });
    }, 

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
        });
    }    
};
