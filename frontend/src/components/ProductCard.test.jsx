import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ProductCard from './ProductCard';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    put: vi.fn(),
    delete: vi.fn()
  }
}));

const produtoMock = {
  _id: 'prod1',
  nome: 'RTX 4090',
  descricao: 'Placa de vídeo top de linha',
  preco: 9999,
  estoque: 5,
  marca: 'NVIDIA'
};

function renderProductCard(props = {}) {
  return render(
    <MemoryRouter>
      <ProductCard
        produto={produtoMock}
        onChange={vi.fn()}
        adicionarAoCarrinho={vi.fn()}
        {...props}
      />
    </MemoryRouter>
  );
}

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('alert', vi.fn());
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  it('deve exibir informações do produto', () => {
    renderProductCard();

    expect(screen.getByText('RTX 4090')).toBeInTheDocument();
    expect(screen.getByText('Placa de vídeo top de linha')).toBeInTheDocument();
    expect(screen.getByText(/R\$ 9999/)).toBeInTheDocument();
    expect(screen.getByText(/Marca: NVIDIA/)).toBeInTheDocument();
  });

  it('deve exibir botões de editar e excluir para admin', () => {
    renderProductCard({ usuario: { role: 'admin' } });

    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument();
    expect(screen.queryByText(/Adicionar ao Carrinho/)).not.toBeInTheDocument();
  });

  it('deve exibir botão de carrinho para usuário comum', () => {
    const adicionarAoCarrinho = vi.fn();
    renderProductCard({
      usuario: { role: 'usuario' },
      adicionarAoCarrinho
    });

    const botaoCarrinho = screen.getByRole('button', { name: /Adicionar ao Carrinho/i });
    expect(botaoCarrinho).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument();

    fireEvent.click(botaoCarrinho);
    expect(adicionarAoCarrinho).toHaveBeenCalledWith(produtoMock);
  });

  it('deve entrar em modo de edição ao clicar em Editar', () => {
    renderProductCard({ usuario: { role: 'admin' } });

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));

    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  it('deve salvar edição com sucesso', async () => {
    const onChange = vi.fn();
    api.put.mockResolvedValue({ data: {} });

    renderProductCard({ usuario: { role: 'admin' }, onChange });

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'RTX 4090 Ti' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await vi.waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/produtos/prod1', expect.objectContaining({
        nome: 'RTX 4090 Ti'
      }));
    });
  });

  it('deve excluir produto quando confirmado', async () => {
    const onChange = vi.fn();
    api.delete.mockResolvedValue({});

    renderProductCard({ usuario: { role: 'admin' }, onChange });

    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    await vi.waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/produtos/prod1');
    });
  });
});
