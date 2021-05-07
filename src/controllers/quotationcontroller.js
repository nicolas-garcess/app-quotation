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
            let data = req.body.data;
            const doc = new PDFDocument();
            doc.fontSize(16)
               .font('Times-Bold')
               .text(`Cotización ${data[0].name}`, {
                    width: 450,
                    align: 'center'
                })
               .moveDown();

               for (let i = 0; i < data.length; i++) {
                   doc.fontSize(12).font('Times-Roman')
                   if (i === 0) {
                        doc.text(`Nombre: ${data[i].name} \n
                                Tipo de documento: ${data[i].dnitype} \n
                                Número de documento: ${data[i].dni} \n`, {
                                width: 450,
                                align: 'center'
                        })    
                        .moveDown()
                   } else if (i === 1) {
                        for (const key in data[i]) {
                            doc.text(`Producto: ${data[i][key].product} \n
                                    Precio unitario (COP): ${data[i][key].priceu} \n
                                    IVA: ${data[i][key].iva}% \n 
                                    Cantidad de elementos: ${data[i][key].quantity} \n Costo total elemento (COP): ${data[i][key].totalprice} \n`, {
                                        width: 450,
                                        align: 'center'
                            })
                            doc.moveDown()  
                        }
                   } else {
                        doc.text(`Total (COP): ${data[i].value}`, {
                                    width: 450,
                                    align: 'center'
                        })
                   }
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
        console.log(error)
        res.status(404).json({
            message: "Hubo un error",
            err: error 
        });
    }
};


module.exports = Controller;