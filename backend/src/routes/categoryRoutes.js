const express = require('express');

const CategoryController = require('../controllers/CategoryController');

const router = express.Router();

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias
 */

router.get('/', CategoryController.listar);

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Cria uma categoria
 *     tags: [Categorias]
 *     responses:
 *       201:
 *         description: Categoria criada
 */

router.post('/', CategoryController.criar);

module.exports = router;