import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  buscarCarrinho,
  criarOuObterCarrinho,
  adicionarProduto,
  removerProduto,
  limparCarrinho
} from '../CartController.js';
import Cart from '../../models/Cart.js';
import { createMockRequest, createMockResponse } from '../../test/helpers.js';

vi.mock('../../models/Cart.js', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn()
  }
}));

function createPopulateChain(result) {
  const chain = {
    populate: vi.fn().mockReturnThis()
  };
  chain.populate.mockResolvedValue(result);
  return chain;
}

function createFindOneChain(result) {
  const chain = {
    populate: vi.fn().mockReturnThis()
  };
  chain.populate
    .mockReturnValueOnce(chain)
    .mockResolvedValueOnce(result);
  return chain;
}

describe('CartController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('buscarCarrinho', () => {
    it('deve retornar carrinho vazio quando não existe', async () => {
      const req = createMockRequest({ params: { usuarioId: 'user1' } });
      const res = createMockResponse();

      Cart.findOne.mockReturnValue(createFindOneChain(null));

      await buscarCarrinho(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        usuario: 'user1',
        produtos: []
      });
    });

    it('deve retornar carrinho existente', async () => {
      const req = createMockRequest({ params: { usuarioId: 'user1' } });
      const res = createMockResponse();
      const carrinho = { usuario: 'user1', produtos: [{ produto: 'p1', quantidade: 2 }] };

      Cart.findOne.mockReturnValue(createFindOneChain(carrinho));

      await buscarCarrinho(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(carrinho);
    });
  });

  describe('criarOuObterCarrinho', () => {
    it('deve criar carrinho quando não existe', async () => {
      const req = createMockRequest({ params: { usuarioId: 'user1' } });
      const res = createMockResponse();
      const novoCarrinho = {
        usuario: 'user1',
        produtos: [],
        populate: vi.fn().mockResolvedValue({ usuario: 'user1', produtos: [] })
      };

      Cart.findOne.mockReturnValue(createFindOneChain(null));
      Cart.create.mockResolvedValue(novoCarrinho);

      await criarOuObterCarrinho(req, res);

      expect(Cart.create).toHaveBeenCalledWith({ usuario: 'user1', produtos: [] });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('adicionarProduto', () => {
    it('deve retornar 400 quando produtoId ou quantidade faltam', async () => {
      const req = createMockRequest({
        params: { usuarioId: 'user1' },
        body: { produtoId: 'p1' }
      });
      const res = createMockResponse();

      await adicionarProduto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        erro: 'produtoId e quantidade são obrigatórios'
      });
    });

    it('deve criar carrinho e adicionar produto quando carrinho não existe', async () => {
      const req = createMockRequest({
        params: { usuarioId: 'user1' },
        body: { produtoId: 'p1', quantidade: 2 }
      });
      const res = createMockResponse();
      const carrinho = {
        save: vi.fn().mockResolvedValue(undefined),
        populate: vi.fn().mockResolvedValue({ usuario: 'user1', produtos: [{ produto: 'p1', quantidade: 2 }] })
      };

      Cart.findOne.mockResolvedValue(null);
      Cart.create.mockResolvedValue(carrinho);

      await adicionarProduto(req, res);

      expect(Cart.create).toHaveBeenCalledWith({
        usuario: 'user1',
        produtos: [{ produto: 'p1', quantidade: 2 }]
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('deve incrementar quantidade quando produto já está no carrinho', async () => {
      const req = createMockRequest({
        params: { usuarioId: 'user1' },
        body: { produtoId: 'p1', quantidade: 3 }
      });
      const res = createMockResponse();
      const carrinho = {
        produtos: [{ produto: { toString: () => 'p1' }, quantidade: 1 }],
        save: vi.fn().mockResolvedValue(undefined),
        populate: vi.fn().mockResolvedValue({ usuario: 'user1', produtos: [{ produto: 'p1', quantidade: 4 }] })
      };

      Cart.findOne.mockResolvedValue(carrinho);

      await adicionarProduto(req, res);

      expect(carrinho.produtos[0].quantidade).toBe(4);
      expect(carrinho.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('removerProduto', () => {
    it('deve retornar 404 quando carrinho não existe', async () => {
      const req = createMockRequest({ params: { usuarioId: 'user1', produtoId: 'p1' } });
      const res = createMockResponse();

      Cart.findOne.mockResolvedValue(null);

      await removerProduto(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Carrinho não encontrado' });
    });

    it('deve remover produto do carrinho', async () => {
      const req = createMockRequest({ params: { usuarioId: 'user1', produtoId: 'p1' } });
      const res = createMockResponse();
      const carrinho = {
        produtos: [
          { produto: { toString: () => 'p1' }, quantidade: 1 },
          { produto: { toString: () => 'p2' }, quantidade: 2 }
        ],
        save: vi.fn().mockResolvedValue(undefined),
        populate: vi.fn().mockResolvedValue({ usuario: 'user1', produtos: [] })
      };

      Cart.findOne.mockResolvedValue(carrinho);

      await removerProduto(req, res);

      expect(carrinho.produtos).toHaveLength(1);
      expect(carrinho.produtos[0].produto.toString()).toBe('p2');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('limparCarrinho', () => {
    it('deve limpar produtos do carrinho', async () => {
      const req = createMockRequest({ params: { usuarioId: 'user1' } });
      const res = createMockResponse();
      const carrinho = {
        produtos: [{ produto: 'p1', quantidade: 1 }],
        save: vi.fn().mockResolvedValue(undefined),
        populate: vi.fn().mockResolvedValue({ usuario: 'user1', produtos: [] })
      };

      Cart.findOne.mockResolvedValue(carrinho);

      await limparCarrinho(req, res);

      expect(carrinho.produtos).toEqual([]);
      expect(carrinho.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
