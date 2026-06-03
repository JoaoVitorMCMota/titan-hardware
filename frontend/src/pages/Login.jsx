import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

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
    <div className="container" style={{ maxWidth: '400px', marginTop: '100px' }}>
      <h2>Login - Titan Hardware</h2>
      <form onSubmit={fazerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" placeholder="Seu Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Sua Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
      {erro && <p style={{ color: 'red', marginTop: '10px' }}>{erro}</p>}
    </div>
  );
}