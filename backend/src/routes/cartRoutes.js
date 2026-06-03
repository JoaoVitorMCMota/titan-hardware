import express from "express";
import {
  buscarCarrinho,
  criarOuObterCarrinho,
  adicionarProduto,
  removerProduto,
  limparCarrinho
} from "../controllers/CartController.js";

const router = express.Router();

/**
 * @swagger
 * /carrinho/{usuarioId}:
 *   get:
 *     summary: Busca o carrinho de um usuário
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Carrinho encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carrinho'
 *       500:
 *         description: Erro no servidor
 */
router.get("/:usuarioId", buscarCarrinho);

/**
 * @swagger
 * /carrinho/{usuarioId}/criar:
 *   get:
 *     summary: Cria ou obtém o carrinho de um usuário
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Carrinho criado ou obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carrinho'
 *       500:
 *         description: Erro no servidor
 */
router.get("/:usuarioId/criar", criarOuObterCarrinho);

/**
 * @swagger
 * /carrinho/{usuarioId}/adicionar:
 *   post:
 *     summary: Adiciona um produto ao carrinho
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [produtoId, quantidade]
 *             properties:
 *               produtoId:
 *                 type: string
 *                 description: ID do produto a adicionar
 *               quantidade:
 *                 type: number
 *                 description: Quantidade do produto
 *           example:
 *             produtoId: "507f1f77bcf86cd799439011"
 *             quantidade: 2
 *     responses:
 *       201:
 *         description: Produto adicionado ao carrinho com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carrinho'
 *       400:
 *         description: Erro na validação dos dados
 *       500:
 *         description: Erro no servidor
 */
router.post("/:usuarioId/adicionar", adicionarProduto);

/**
 * @swagger
 * /carrinho/{usuarioId}/produtos/{produtoId}:
 *   delete:
 *     summary: Remove um produto do carrinho
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *       - in: path
 *         name: produtoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto a remover
 *     responses:
 *       200:
 *         description: Produto removido do carrinho com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carrinho'
 *       404:
 *         description: Carrinho não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete("/:usuarioId/produtos/:produtoId", removerProduto);

/**
 * @swagger
 * /carrinho/{usuarioId}/limpar:
 *   delete:
 *     summary: Limpa todos os produtos do carrinho
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Carrinho limpo com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carrinho'
 *       404:
 *         description: Carrinho não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete("/:usuarioId/limpar", limparCarrinho);

export default router;




