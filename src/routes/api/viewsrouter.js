const router = require('express').Router();

const ViewController = require('../../controllers/viewscontroller');


router.get('/', ViewController.index);


module.exports = router;