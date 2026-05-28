import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const fazerLogin = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        // Salva os dados básicos no navegador
        localStorage.setItem('token', dados.token);
        localStorage.setItem('user_email', email);
        
        // ATENÇÃO: Verifique se sua API retorna o campo com o nome 'role' ou 'cargo'
        const cargo = dados.role || 'cliente'; 
        localStorage.setItem('user_role', cargo);

        // Avisa o App.jsx que o login deu certo
        onLoginSuccess(email, cargo);
        
        // Redireciona para a Home
        navigate('/home');
      } else {
        setErro(dados.error || 'Credenciais inválidas.');
      }
    } catch (error) {
      setErro('Erro de conexão com o servidor.');
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