import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Login from './Login';
import api from '../services/api';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn()
  }
}));

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('deve renderizar formulário de login', () => {
    render(
      <MemoryRouter>
        <Login onLoginSuccess={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('Login - Titan Hardware')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Seu Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Sua Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('deve realizar login com sucesso', async () => {
    const onLoginSuccess = vi.fn();
    api.post.mockResolvedValue({
      data: {
        token: 'jwt-token',
        usuario: { _id: 'user1', role: 'usuario' }
      }
    });

    render(
      <MemoryRouter>
        <Login onLoginSuccess={onLoginSuccess} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Seu Email'), {
      target: { value: 'joao@email.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Sua Senha'), {
      target: { value: '123456' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'joao@email.com',
        senha: '123456'
      });
    });

    expect(localStorage.getItem('token')).toBe('jwt-token');
    expect(localStorage.getItem('user_id')).toBe('user1');
    expect(localStorage.getItem('user_email')).toBe('joao@email.com');
    expect(onLoginSuccess).toHaveBeenCalledWith('joao@email.com', 'usuario', 'user1');
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('deve exibir mensagem de erro quando login falha', async () => {
    api.post.mockRejectedValue({
      response: { data: { error: 'Senha incorreta' } }
    });

    render(
      <MemoryRouter>
        <Login onLoginSuccess={vi.fn()} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Seu Email'), {
      target: { value: 'joao@email.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Sua Senha'), {
      target: { value: 'errada' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Senha incorreta')).toBeInTheDocument();
  });
});
