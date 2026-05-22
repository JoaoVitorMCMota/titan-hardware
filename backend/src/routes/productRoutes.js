const express = require('express');

const ProductController = require('../controllers/ProductController');

const router = express.Router();

router.get('/', ProductController.listar);

router.get('/:id',ProductController.buscarPorId);

router.post('/', ProductController.criar);

router.put('/:id', ProductController.atualizar);

router.delete('/:id', ProductController.deletar);

module.exports = router;