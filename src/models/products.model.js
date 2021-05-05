const mongoose = require('mongoose');
const {Schema} = mongoose;

//Esquema del modelo de datos
const ProductsSchema = new Schema({
    //Tipos de datos en la colección de la base de datos
    ID: {type: String},
    Name: {type: String},
    Capacity: {type: String},
    Brand: {type: String},
    Price: {type: Number},
    Quantity: {type: Number},
});

//Modelo de datos, recibe el nombre de la colección de la base de datos y el esquema
const ProductsModel = mongoose.model('products', ProductsSchema);

module.exports = ProductsModel;