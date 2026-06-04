import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import AuthController from '../AuthController.js';
import User from '../../models/User.js';
import { createMockRequest, createMockResponse } from '../../test/helpers.js';

vi.mock('../../models/User.js', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn()
  }
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn()
  }
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn()
  }
}));

describe('AuthController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('register', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      const req = createMockRequest({
        body: { nome: 'João', email: 'joao@email.com', senha: '123456' }
      });
      const res = createMockResponse();
      const usuarioCriado = {
        _id: 'user123',
        nome: 'João',
        email: 'joao@email.com',
        role: 'usuario'
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hash123');
      User.create.mockResolvedValue({ ...usuarioCriado, senha: 'hash123' });

      await AuthController.register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'joao@email.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 8);
      expect(User.create).toHaveBeenCalledWith({
        nome: 'João',
        email: 'joao@email.com',
        senha: 'hash123',
        role: 'usuario'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: 'João',
          email: 'joao@email.com',
          senha: undefined
        })
      );
    });

    it('deve retornar 400 quando o email já existe', async () => {
      const req = createMockRequest({
        body: { nome: 'João', email: 'joao@email.com', senha: '123456' }
      });
      const res = createMockResponse();

      User.findOne.mockResolvedValue({ email: 'joao@email.com' });

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Já existe uma conta vinculada a esse Email'
      });
      expect(User.create).not.toHaveBeenCalled();
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      const req = createMockRequest({
        body: { nome: 'João', email: 'joao@email.com', senha: '123456' }
      });
      const res = createMockResponse();

      User.findOne.mockRejectedValue(new Error('Erro de banco'));

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro de banco' });
    });
  });

  describe('login', () => {
    it('deve autenticar usuário e retornar token', async () => {
      const req = createMockRequest({
        body: { email: 'joao@email.com', senha: '123456' }
      });
      const res = createMockResponse();
      const usuario = {
        _id: 'user123',
        email: 'joao@email.com',
        senha: 'hash123',
        role: 'usuario'
      };

      User.findOne.mockResolvedValue(usuario);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token-jwt');

      await AuthController.login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hash123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user123', role: 'usuario' },
        'test-secret',
        { expiresIn: '1d' }
      );
      expect(res.json).toHaveBeenCalledWith({
        usuario,
        token: 'token-jwt'
      });
    });

    it('deve retornar 400 quando usuário não existe', async () => {
      const req = createMockRequest({
        body: { email: 'inexistente@email.com', senha: '123456' }
      });
      const res = createMockResponse();

      User.findOne.mockResolvedValue(null);

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });

    it('deve retornar 400 quando a senha está incorreta', async () => {
      const req = createMockRequest({
        body: { email: 'joao@email.com', senha: 'errada' }
      });
      const res = createMockResponse();

      User.findOne.mockResolvedValue({
        _id: 'user123',
        email: 'joao@email.com',
        senha: 'hash123'
      });
      bcrypt.compare.mockResolvedValue(false);

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Senha incorreta' });
    });
  });
});
