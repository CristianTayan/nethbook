var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/dataEmpresas');
var Schema   = mongoose.Schema;

var empresaSchema = new Schema({
	'empresa' : String
});

module.exports = mongoose.model('empresa', empresaSchema);
