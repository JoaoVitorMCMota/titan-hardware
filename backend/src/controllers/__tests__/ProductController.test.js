import { describe, it, expect, vi, beforeEach } from 'vitest';

import ProductController from '../ProductController.js';
import Product from '../../models/Product.js';
import { createMockRequest, createMockResponse } from '../../test/helpers.js';

vi.mock('../../models/Product.js', () => ({
  default: {
    find: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    create: vi.fn()
  }
}));

describe('ProductController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listar', () => {
    it('deve listar todos os produtos sem filtro', async () => {
      const req = createMockRequest({ query: {} });
      const res = createMockResponse();
      const produtos = [{ nome: 'RTX 4090' }];

      Product.find.mockResolvedValue(produtos);

      await ProductController.listar(req, res);

      expect(Product.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith(produtos);
    });

    it('deve filtrar produtos por nome', async () => {
      const req = createMockRequest({ query: { nome: 'rtx' } });
      const res = createMockResponse();

      Product.find.mockResolvedValue([]);

      await ProductController.listar(req, res);

      expect(Product.find).toHaveBeenCalledWith({
        $or: [
          { nome: { $regex: 'rtx', $options: 'i' } },
          { marca: { $regex: 'rtx', $options: 'i' } },
          { descricao: { $regex: 'rtx', $options: 'i' } }
        ]
      });
    });

    it('deve retornar erro 500 em caso de erro no banco ao listar', async () => {
      const req = createMockRequest({ query: {} });
      const res = createMockResponse();
      const erro = new Error('Erro ao conectar ao banco de dados');

      Product.find.mockRejectedValue(erro);

      await ProductController.listar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: erro.message });
    });

    it('deve retornar lista vazia quando nenhum produto encontrado', async () => {
      const req = createMockRequest({ query: { nome: 'inexistente' } });
      const res = createMockResponse();

      Product.find.mockResolvedValue([]);

      await ProductController.listar(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar produto encontrado', async () => {
      const req = createMockRequest({ params: { id: 'prod1' } });
      const res = createMockResponse();
      const produto = { _id: 'prod1', nome: 'RTX 4090' };

      Product.findById.mockResolvedValue(produto);

      await ProductController.buscarPorId(req, res);

      expect(res.json).toHaveBeenCalledWith(produto);
    });

    it('deve retornar 404 quando produto não existe', async () => {
      const req = createMockRequest({ params: { id: 'inexistente' } });
      const res = createMockResponse();

      Product.findById.mockResolvedValue(null);

      await ProductController.buscarPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Produto não encontrado' });
    });

    it('deve retornar erro 500 em caso de erro no banco ao buscar por ID', async () => {
      const req = createMockRequest({ params: { id: 'prod1' } });
      const res = createMockResponse();
      const erro = new Error('Erro ao conectar ao banco de dados');

      Product.findById.mockRejectedValue(erro);

      await ProductController.buscarPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: erro.message });
    });
  });

  describe('criar', () => {
    it('deve criar produto com sucesso', async () => {
      const req = createMockRequest({
        body: { nome: 'RTX 4090', descricao: 'GPU', preco: 9999, estoque: 5, marca: 'NVIDIA' }
      });
      const res = createMockResponse();
      const produto = { _id: 'prod1', ...req.body };

      Product.create.mockResolvedValue(produto);

      await ProductController.criar(req, res);

      expect(Product.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(produto);
    });

    it('deve retornar erro 400 ao criar produto com dados inválidos', async () => {
      const req = createMockRequest({
        body: { nome: '', descricao: 'GPU', preco: 'invalido', estoque: 5 }
      });
      const res = createMockResponse();
      const erro = new Error('Validação falhou');

      Product.create.mockRejectedValue(erro);

      await ProductController.criar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: erro.message });
    });

    it('deve retornar erro 400 ao criar produto sem campos obrigatórios', async () => {
      const req = createMockRequest({
        body: { nome: 'RTX 4090' } // Faltam outros campos obrigatórios
      });
      const res = createMockResponse();
      const erro = new Error('Campo "descricao" é obrigatório');

      Product.create.mockRejectedValue(erro);

      await ProductController.criar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: erro.message });
    });

    it('deve retornar erro 400 em caso de erro no banco de dados', async () => {
      const req = createMockRequest({
        body: { nome: 'RTX 4090', descricao: 'GPU', preco: 9999, estoque: 5, marca: 'NVIDIA' }
      });
      const res = createMockResponse();
      const erroDb = new Error('Erro de conexão com o banco de dados');

      Product.create.mockRejectedValue(erroDb);

      await ProductController.criar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: erroDb.message });
    });
  });

  describe('atualizar', () => {
    it('deve atualizar produto existente', async () => {
      const req = createMockRequest({
        params: { id: 'prod1' },
        body: { preco: 8999 }
      });
      const res = createMockResponse();
      const produtoAtualizado = { _id: 'prod1', preco: 8999 };

      Product.findByIdAndUpdate.mockResolvedValue(produtoAtualizado);

      await ProductController.atualizar(req, res);

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('prod1', { preco: 8999 }, { new: true });
      expect(res.json).toHaveBeenCalledWith(produtoAtualizado);
    });

    it('deve retornar 404 ao atualizar produto inexistente', async () => {
      const req = createMockRequest({
        params: { id: 'inexistente' },
        body: { preco: 8999 }
      });
      const res = createMockResponse();

      Product.findByIdAndUpdate.mockResolvedValue(null);

      await ProductController.atualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Produto não encontrado' });
    });

    it('deve retornar erro 400 ao atualizar com dados inválidos', async () => {
      const req = createMockRequest({
        params: { id: 'prod1' },
        body: { preco: 'invalido' }
      });
      const res = createMockResponse();
      const erro = new Error('Tipo de dado inválido para preço');

      Product.findByIdAndUpdate.mockRejectedValue(erro);

      await ProductController.atualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: erro.message });
    });
  });

  describe('deletar', () => {
    it('deve deletar produto com sucesso', async () => {
      const req = createMockRequest({ params: { id: 'prod1' } });
      const res = createMockResponse();

      Product.findByIdAndDelete.mockResolvedValue({ _id: 'prod1' });

      await ProductController.deletar(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Produto deletado com sucesso' });
    });

    it('deve retornar 404 ao deletar produto inexistente', async () => {
      const req = createMockRequest({ params: { id: 'inexistente' } });
      const res = createMockResponse();

      Product.findByIdAndDelete.mockResolvedValue(null);

      await ProductController.deletar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Produto não encontrado' });
    });

    it('deve retornar erro 500 em caso de erro no banco ao deletar', async () => {
      const req = createMockRequest({ params: { id: 'prod1' } });
      const res = createMockResponse();
      const erro = new Error('Erro ao conectar ao banco de dados');

      Product.findByIdAndDelete.mockRejectedValue(erro);

      await ProductController.deletar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: erro.message });
    });
  });
});
