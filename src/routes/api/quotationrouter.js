const router = require('express').Router();

const QuotationController = require('../../controllers/quotationcontroller.js');

router.get('/products', QuotationController.search);
router.post('/pdf-file', QuotationController.exportsFile);


module.exports = router;