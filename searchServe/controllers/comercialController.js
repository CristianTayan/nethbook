var comercialModel = require('../models/comercialModel.js');
/**
 * comercialController.js
 *
 * @description :: Server-side logic for managing comercials.
 */
module.exports = {

    /**
     * comercialController.list()
     */
    list: function (req, res) {
        comercialModel.find(function (err, comercials) {
            console.log('test');
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comercial.',
                    error: err
                });
            }
            return res.json(comercials);
        }).limit(100);
    },

    /**
     * comercialController.show()
     */
    show: function (req, res) {

        var id = req.params.id;
        
        if (!isNaN(id)) {
            var ruc = new RegExp('.*'+id+'.*')
            comercialModel.find({"ruc": ruc}, function (err, comercial) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting comercial.',
                        error: err
                    });
                }
                if (!comercial) {
                    return res.status(404).json({
                        message: 'No such comercial'
                    });
                }
                return res.jsonp({data:comercial});
            }).limit(10);
        }
        if (isNaN(id)) {
            var texto = id.toUpperCase();
            var id = new RegExp('.*'+texto+'.*')
            comercialModel.find({"actividad_economica": id}, function (err, comercial) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting comercial.',
                        error: err
                    });
                }
                if (!comercial) {
                    return res.status(404).json({
                        message: 'No such comercial'
                    });
                }
                return res.jsonp({data:comercial});
            }).limit(10);
        }
    },


                                       
    // show: function (req, res) {
    //     var id = req.params.id;
    //     // ---------generacion solo cuando es texto -------------------------
    //     if (isNaN(id)) {
    //         var texto = id.toUpperCase();
    //         comercialModel.find({"NOMBRE_COMERCIAL": new RegExp(texto)},function (err, comercials) {
    //             if (err) {
    //                 return res.status(500).json({
    //                     message: 'Error when getting empresas_sri.',
    //                     error: err
    //                 });
    //             }
    //             return res.jsonp({data:comercials});
    //         }).limit(5);
    //     }
    //     // ---------generacion solo cuando es numero de ruc------------------
    //     if (!isNaN(id)) {
    //         comercialModel.find({"NUMERO_RUC": new RegExp(id)},function (err, comercials) {
    //             if (err) {
    //                 return res.status(500).json({
    //                     message: 'Error when getting empresas_sri.',
    //                     error: err
    //                 });
    //             }
    //             return res.jsonp({data:comercials});
    //         }).limit(5);
    //     }        
    // },

    /**
     * comercialController.create()
     */
    create: function (req, res) {
        var comercial = new comercialModel({
			fecha : req.body.fecha
        });

        comercial.save(function (err, comercial) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating comercial',
                    error: err
                });
            }
            return res.status(201).json(comercial);
        });
    },

    /**
     * comercialController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        comercialModel.findOne({_id: id}, function (err, comercial) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comercial',
                    error: err
                });
            }
            if (!comercial) {
                return res.status(404).json({
                    message: 'No such comercial'
                });
            }

            comercial.fecha = req.body.fecha ? req.body.fecha : comercial.fecha;
			
            comercial.save(function (err, comercial) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating comercial.',
                        error: err
                    });
                }

                return res.json(comercial);
            });
        });
    },

    /**
     * comercialController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        comercialModel.findByIdAndRemove(id, function (err, comercial) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the comercial.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
