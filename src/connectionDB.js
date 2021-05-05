const mongoose = require('mongoose');

//Conexión base de datos
const uri = `mongodb+srv://${process.env.USER_MONGO}:${process.env.PASSWORD_MONGO}@cluster0.1ndhi.mongodb.net/${process.env.DBNAME_MONGO}?retryWrites=true&w=majority`;

//Comando que permite la conexión
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Conexión exitosa a la base de datos"))
.catch(() => console.log("No se pudo conectar a la base de datos"))
