const express = require('express');
const path = require('path');
const app = express();


require('dotenv').config();
const PORT = process.env.PORT || 3002;


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

require('./connectionDB');

//Asigna el motor de plantillas
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

//Archivos estáticos
//Nos lleva a la carpeta public que contiene tanto html y estilos.
app.use(express.static(path.join(__dirname,'../public')));

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