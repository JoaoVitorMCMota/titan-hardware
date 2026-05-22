const express = require('express');

const CategoryController = require('../controllers/CategoryController');

const router = express.Router();

router.get('/', CategoryController.listar);

router.post('/', CategoryController.criar);

module.exports = router;