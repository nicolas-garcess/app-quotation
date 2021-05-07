const express = require('express');
const path = require('path');
const mime = require('mime');
const app = express();

//Permite setear el header dependiendo del archivo estático que es tratado
//Con mime se logra determinar que archivo es tratado.
const staticOptions = {
    extensions: ['html', 'js'],
    setHeaders: function (res, path, stat) {
        const type = mime.getType(path);
        //console.log(type);
        res.set('Content-Type', type);
    } 
};

require('dotenv').config();
const PORT = process.env.PORT || 3002;

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

require('./connectionDB');

//Asigna el motor de plantillas
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

//Archivos estáticos
//Nos lleva a la carpeta public que contiene estilos y archivos .js.
app.use(express.static(path.join(__dirname,'../public'), staticOptions));

//Rutas
const routes = require('./routes');
app.use('/', routes);

//Accede si no encuentra ninguna ruta configurada.
app.use((req, res) => {
    //Ruta para renderizar el 404.pug
    res.status(404).render('404',
    {
        title:"404",
        subtitle: "NOT FOUND",
        link: "Go home"
    });
});

app.listen(PORT, () => {
    console.log("Servidor a la espera de conexiones");
});