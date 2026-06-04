import { describe, it, expect, vi, beforeEach } from 'vitest';

import CategoryController from '../CategoryController.js';
import Category from '../../models/Category.js';
import { createMockRequest, createMockResponse } from '../../test/helpers.js';

vi.mock('../../models/Category.js', () => ({
  default: {
    find: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    create: vi.fn()
  }
}));

describe('CategoryController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listar', () => {
    it('deve listar todas as categorias', async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const categorias = [{ nome: 'Placas de Vídeo' }];

      Category.find.mockResolvedValue(categorias);

      await CategoryController.listar(req, res);

      expect(Category.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(categorias);
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar categoria encontrada', async () => {
      const req = createMockRequest({ params: { id: 'cat1' } });
      const res = createMockResponse();
      const categoria = { _id: 'cat1', nome: 'Processadores' };

      Category.findById.mockResolvedValue(categoria);

      await CategoryController.buscarPorId(req, res);

      expect(res.json).toHaveBeenCalledWith(categoria);
    });

    it('deve retornar 404 quando categoria não existe', async () => {
      const req = createMockRequest({ params: { id: 'inexistente' } });
      const res = createMockResponse();

      Category.findById.mockResolvedValue(null);

      await CategoryController.buscarPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Categoria não encontrada' });
    });
  });

  describe('criar', () => {
    it('deve criar categoria com sucesso', async () => {
      const req = createMockRequest({ body: { nome: 'Periféricos' } });
      const res = createMockResponse();
      const categoria = { _id: 'cat1', nome: 'Periféricos' };

      Category.create.mockResolvedValue(categoria);

      await CategoryController.criar(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(categoria);
    });
  });

  describe('deletar', () => {
    it('deve deletar categoria com sucesso', async () => {
      const req = createMockRequest({ params: { id: 'cat1' } });
      const res = createMockResponse();

      Category.findByIdAndDelete.mockResolvedValue({ _id: 'cat1' });

      await CategoryController.deletar(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Categoria deletada com sucesso' });
    });
  });
});
