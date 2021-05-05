const ProductModel = require('../models/products.model');

//Importación del paquete de generación de pdf
const PDFDocument = require('pdfkit');

const Controller = {};

Controller.search = async (req, res) => {
    try {
        ProductModel.find()
        .then(result => {
            res.status(200).render('search', {
                products: result
            });
        })
        .catch(() => {
            res.status(400).render('search', {
                products: []
            });
        })   
    } catch (error) {
        res.status(404).render('search',
        {
            message: "Hubo un error",
            products: [],
        });
    }
};

Controller.exportsFile = async (req, res) => {
    try {
        if (req.body.type === "pdf") {
            const doc = new PDFDocument();
            doc.fontSize(16)
               .font('Times-Bold')
               .text(`Cotización ${req.body.name}`, {
                width: 450,
                align: 'center'
                })
               .moveDown();
            
            for (const row of JSON.parse(req.body.data)) {
                doc.fontSize(12).font('Times-Roman')
                   .text(`Nombre: ${row.name} \n
                          Documento de identidad: ${row.DNI} \n
                          Descripción: ${row.Descripcion} \n
                          Teléfono: ${row.Telefonos} \n
                          Tipo de vivienda: ${row.Tipo} \n
                          Precio: ${row.Precio} € \n
                          Dirección: ${row.Direccion} \n
                        `, {
                            width: 450,
                            align: 'center'
                        })
                    .addPage();
            }
            res.set({
                'Content-Disposition': 'attachment; filename=reporte.pdf',
                'Content-Type': 'application/pdf',
                'Access-Control-Allow-Origin': '*'
            });
            doc.pipe(res);
            doc.end();
        } else {
            res.status(400).json({
                message: "No ingresó un campo correctamente"
            });
        }
    } catch (error) {
        res.status(404).json({
            message: "Hubo un error",
            err: error 
        });
    }
};


module.exports = Controller;