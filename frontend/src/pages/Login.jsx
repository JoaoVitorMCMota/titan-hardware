import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const mensagemSucesso = location.state?.mensagem;

  const fazerLogin = async (e) => {
    e.preventDefault();
    try {
      const resposta = await api.post('/auth/login', { email, senha });
      const dados = resposta.data;

      localStorage.setItem('token', dados.token);
      localStorage.setItem('user_id', dados.usuario._id);
      localStorage.setItem('user_email', email);

      const cargo = dados.usuario?.role || dados.role || 'cliente';
      localStorage.setItem('user_role', cargo);

      onLoginSuccess(email, cargo, dados.usuario._id);
      navigate('/home');
    } catch (error) {
      const mensagemApi = error.response?.data?.error || error.response?.data?.mensagem;
      setErro(mensagemApi || 'Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="container" style={{marginTop: '12%' }}>
      <h2 style={{fontSize:"2.4rem"}}>Login - Titan Hardware</h2>
      <form className="form" onSubmit={fazerLogin}>
        <input id="email" type="email" placeholder="Seu Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input id="senha" type="password" placeholder="Sua Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        <button id="enviar" type="submit" style={{fontSize:"22px"}}>Entrar</button>
      </form>
      {mensagemSucesso && <p style={{ color: '#4ade80', marginTop: '10px' }}>{mensagemSucesso}</p>}
      {erro && <p style={{ color: 'red', marginTop: '10px' }}>{erro}</p>}
      <p style={{ marginTop: '20px' }}>
        Não possui uma conta?{' '}
        <Link to="/registro" style={{ color: '#93c5fd' }}>
          Criar conta
        </Link>
      </p>
    </div>
  );
}