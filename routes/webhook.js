const express = require("express");
var router = express.Router();

const webhooksController = require('../controllers/webhooksController');

router.post('/products-update', webhooksController.productUpdate);


module.exports = router;