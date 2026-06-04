import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

import UserController from '../UserController.js';
import User from '../../models/User.js';
import { createMockRequest, createMockResponse } from '../../test/helpers.js';

vi.mock('../../models/User.js', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn()
  }
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn()
  }
}));

describe('UserController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('criar', () => {
    it('deve criar usuário sem expor a senha', async () => {
      const req = createMockRequest({
        body: { nome: 'Maria', email: 'maria@email.com', senha: '123456', role: 'admin' }
      });
      const res = createMockResponse();
      const usuario = {
        toObject: () => ({
          _id: 'id1',
          nome: 'Maria',
          email: 'maria@email.com',
          senha: 'hash',
          role: 'admin'
        })
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hash');
      User.create.mockResolvedValue(usuario);

      await UserController.criar(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        _id: 'id1',
        nome: 'Maria',
        email: 'maria@email.com',
        role: 'admin'
      });
    });

    it('deve retornar 400 quando email já existe', async () => {
      const req = createMockRequest({
        body: { nome: 'Maria', email: 'maria@email.com', senha: '123456' }
      });
      const res = createMockResponse();

      User.findOne.mockResolvedValue({ email: 'maria@email.com' });

      await UserController.criar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Já existe uma conta vinculada a esse Email'
      });
    });
  });

  describe('listar', () => {
    it('deve listar usuários sem senha', async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const selectMock = vi.fn().mockResolvedValue([{ nome: 'João' }]);

      User.find.mockReturnValue({ select: selectMock });

      await UserController.listar(req, res);

      expect(User.find).toHaveBeenCalled();
      expect(selectMock).toHaveBeenCalledWith('-senha');
      expect(res.json).toHaveBeenCalledWith([{ nome: 'João' }]);
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar usuário encontrado', async () => {
      const req = createMockRequest({ params: { id: 'id1' } });
      const res = createMockResponse();
      const selectMock = vi.fn().mockResolvedValue({ _id: 'id1', nome: 'João' });

      User.findById.mockReturnValue({ select: selectMock });

      await UserController.buscarPorId(req, res);

      expect(res.json).toHaveBeenCalledWith({ _id: 'id1', nome: 'João' });
    });

    it('deve retornar 404 quando usuário não existe', async () => {
      const req = createMockRequest({ params: { id: 'inexistente' } });
      const res = createMockResponse();
      const selectMock = vi.fn().mockResolvedValue(null);

      User.findById.mockReturnValue({ select: selectMock });

      await UserController.buscarPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });
  });

  describe('atualizar', () => {
    it('deve atualizar usuário e hashear nova senha', async () => {
      const req = createMockRequest({
        params: { id: 'id1' },
        body: { nome: 'João Atualizado', email: 'joao@email.com', senha: 'nova', role: 'admin' }
      });
      const res = createMockResponse();
      const selectMock = vi.fn().mockResolvedValue({ _id: 'id1', nome: 'João Atualizado' });

      bcrypt.hash.mockResolvedValue('novo-hash');
      User.findByIdAndUpdate.mockReturnValue({ select: selectMock });

      await UserController.atualizar(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('nova', 8);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        'id1',
        {
          nome: 'João Atualizado',
          email: 'joao@email.com',
          role: 'admin',
          senha: 'novo-hash'
        },
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith({ _id: 'id1', nome: 'João Atualizado' });
    });
  });

  describe('deletar', () => {
    it('deve deletar usuário com sucesso', async () => {
      const req = createMockRequest({ params: { id: 'id1' } });
      const res = createMockResponse();

      User.findByIdAndDelete.mockResolvedValue({ _id: 'id1' });

      await UserController.deletar(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Usuário deletado com sucesso' });
    });

    it('deve retornar 404 quando usuário não existe', async () => {
      const req = createMockRequest({ params: { id: 'inexistente' } });
      const res = createMockResponse();

      User.findByIdAndDelete.mockResolvedValue(null);

      await UserController.deletar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });
  });
});
