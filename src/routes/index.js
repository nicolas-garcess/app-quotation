const router = require('express').Router();
const quotationRouter = require('./api/quotationrouter');
const viewsRouter = require('./api/viewsrouter');


router.use('/quotation', quotationRouter);
router.use('/', viewsRouter);


module.exports = router;