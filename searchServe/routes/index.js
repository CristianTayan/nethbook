var express = require('express');
var mongoose = require('mongoose');
// var db = mongoose.connect('mongodb://localhost/prueba_1');
// var Schema  = mongoose.Schema;

var app = express();
	
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
	// var id = req.params.id;
// 	var empresas = mongoose.model('dc', db);
//     	empresas.find(function (err, empresa) {
//             console.log(empresa);
//             if (err) {
//                 return res.status(500).json({
//                     message: 'Error when getting empresa.',
//                     error: err
//                 });
//             }
//             return res.json(empresa);
//         }).limit(2);
    res.send('HOLA BUSCADOR')
});

// router.get('/:id', function(req, res, next) {
    
    
    // var empresas = db.model('res', new Schema());
    //     empresas.find(function (err, empresa_sri) {
    //         if (err) {
    //             return res.status(500).json({
    //                 message: 'Error when getting empresa.',
    //                 error: err
    //             });
    //         }
    //         return res.json({data: empresa_sri});
    //     }).limit(2);
// });

module.exports = router;