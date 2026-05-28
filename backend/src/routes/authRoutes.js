import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *           example:
 *             nome: "João"
 *             email: "joao@email.com"
 *             senha: "123456"
 *             role: "usuario"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Usuário já existe
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "joao@email.com"
 *             senha: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Usuário não encontrado ou senha incorreta
 */
router.post('/login', AuthController.login);

export default router;