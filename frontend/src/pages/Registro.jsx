import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Registro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const fazerRegistro = async (e) => {
    e.preventDefault();
    setErro('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setCarregando(true);

    try {
      await api.post('/auth/register', { nome, email, senha });
      navigate('/login', { state: { mensagem: 'Conta criada com sucesso! Faça login para continuar.' } });
    } catch (error) {
      const mensagemApi = error.response?.data?.error || error.response?.data?.mensagem;
      setErro(mensagemApi || 'Erro de conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container" style={{marginTop: '12%' }}>
      <h2 style={{fontSize:"2.2rem"}}>Criar Conta - Titan Hardware</h2>
      <form className="form" onSubmit={fazerRegistro}>
        <input
          type="text"
          placeholder="Seu Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required id="registro-nome"
        />
        <input
          type="email"
          placeholder="Seu Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required id="registro-email"
        />
        <input
          type="password"
          placeholder="Sua Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required id="registro-senha"
          minLength={6}
        />
        <input
          type="password"
          placeholder="Confirme sua Senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required id="registro-confirmar-senha"
          minLength={6}
        />
        <button id="registro-enviar" style={{fontSize:"22px"}}type="submit" disabled={carregando}>
          {carregando ? 'Criando conta...' : 'Criar Conta'}
        </button>
      </form>
      {erro && <p style={{ color: 'red', marginTop: '10px' }}>{erro}</p>}
      <p style={{ marginTop: '20px' }}>
        Já possui uma conta?{' '}
        <Link to="/login" style={{ color: '#93c5fd' }}>
          Fazer login
        </Link>
      </p>
    </div>
  );
}
