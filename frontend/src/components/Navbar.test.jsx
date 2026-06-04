import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Navbar from './Navbar';

describe('Navbar', () => {
  it('deve exibir links de navegação para usuário autenticado', () => {
    render(
      <MemoryRouter>
        <Navbar
          carrinho={{ produtos: [{ quantidade: 2 }, { quantidade: 1 }] }}
          usuario={{ email: 'joao@email.com', role: 'usuario' }}
          onLogout={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/Titan Hardware/i)).toBeInTheDocument();
    expect(screen.getByText(/Carrinho \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('deve exibir link de criar produto apenas para admin', () => {
    render(
      <MemoryRouter>
        <Navbar
          carrinho={{ produtos: [] }}
          usuario={{ email: 'admin@email.com', role: 'admin' }}
          onLogout={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Criar Produto')).toBeInTheDocument();
    expect(screen.getByText('Usuários')).toBeInTheDocument();
  });

  it('não deve exibir links de admin para usuário comum', () => {
    render(
      <MemoryRouter>
        <Navbar
          carrinho={{ produtos: [] }}
          usuario={{ email: 'joao@email.com', role: 'usuario' }}
          onLogout={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.queryByText('Criar Produto')).not.toBeInTheDocument();
    expect(screen.queryByText('Gerenciar Usuários')).not.toBeInTheDocument();
    expect(screen.queryByText('Usuários')).not.toBeInTheDocument();
  });
});
