const express = require('express');

const ProductController = require('../controllers/ProductController');

const router = express.Router();

router.get('/', ProductController.listar);

router.post('/', ProductController.criar);

module.exports = router;