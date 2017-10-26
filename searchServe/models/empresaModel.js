var mongoose = require('mongoose');
var db = require("./../libs/conexion.js");
var Schema   = mongoose.Schema;

var empresaSchema = new Schema();

module.exports = mongoose.model('empresa', empresaSchema);
