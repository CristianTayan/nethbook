
var db = require("../libs/conexion")();
var Schema = require('mongoose').Schema;
var comercialSchema = new Schema({
	'fecha' : Date
});

module.exports = db.model('sris', comercialSchema);
