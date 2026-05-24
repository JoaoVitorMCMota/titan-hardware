const express = require('express');

const ProductController = require('../controllers/ProductController');

const router = express.Router();

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 */

router.get('/', ProductController.listar);

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cria um produto
 *     tags: [Produtos]
 *     responses:
 *       201:
 *         description: Produto criado
 */

router.post('/', ProductController.criar);

router.get('/:id',ProductController.buscarPorId);

router.put('/:id', ProductController.atualizar);

router.delete('/:id', ProductController.deletar);

module.exports = router;