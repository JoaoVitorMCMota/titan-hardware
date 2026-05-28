import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import CreateProduct from './pages/CreateProduct';
import Login from './pages/Login';
import Carrinho from './pages/Carrinho'; // Nova página

import Navbar from './components/Navbar';
import './styles/global.css';

function App() {
  const [usuario, setUsuario] = useState(null); // Guarda { email, role }
  const [carrinho, setCarrinho] = useState([]);

  // 1. Ao iniciar, verifica se já existe um usuário logado
  useEffect(() => {
    const emailSalvo = localStorage.getItem('user_email');
    const roleSalva = localStorage.getItem('user_role');
    
    if (emailSalvo && roleSalva) {
      setUsuario({ email: emailSalvo, role: roleSalva });
      
      // Carrega o carrinho específico desse email
      const carrinhoSalvo = localStorage.getItem(`carrinho_${emailSalvo}`);
      if (carrinhoSalvo) setCarrinho(JSON.parse(carrinhoSalvo));
    }
  }, []);

  // 2. Função chamada pelo Login quando der certo
  const loginSucesso = (email, role) => {
    setUsuario({ email, role });
    // Busca o carrinho do usuário que acabou de logar
    const carrinhoSalvo = localStorage.getItem(`carrinho_${email}`);
    setCarrinho(carrinhoSalvo ? JSON.parse(carrinhoSalvo) : []);
  };

  // 3. Função para deslogar (Sair)
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    setUsuario(null);
    setCarrinho([]);
  };

  // 4. Função para adicionar item ao carrinho do usuário atual
  const adicionarAoCarrinho = (produto) => {
    const novoCarrinho = [...carrinho, produto];
    setCarrinho(novoCarrinho);
    // Salva no localStorage atrelado ao email dele
    localStorage.setItem(`carrinho_${usuario.email}`, JSON.stringify(novoCarrinho));
    alert(`${produto.nome} adicionado ao carrinho!`);
  };

  return (
    <BrowserRouter>
      {/* Passamos o usuário e o logout para a Navbar */}
      <Navbar carrinho={carrinho} usuario={usuario} onLogout={logout} />

      <Routes>
        {/* A tela inicial (/) agora é o Login */}
        <Route path="/" element={usuario ? <Navigate to="/home" /> : <Login onLoginSuccess={loginSucesso} />} />
        
        {/* Nova rota para a Home */}
        <Route path="/home" element={usuario ? <Home adicionarAoCarrinho={adicionarAoCarrinho} usuario={usuario} /> : <Navigate to="/" />} />
        
        {/* Rota para Criar Produto (Apenas Admin) */}
        <Route path="/criar-produto" element={usuario?.role === 'admin' ? <CreateProduct /> : <Navigate to="/home" />} />
        
        {/* Nova rota para a página exclusiva do Carrinho */}
        <Route path="/carrinho" element={usuario ? <Carrinho carrinho={carrinho} emailUsuario={usuario.email} setCarrinho={setCarrinho} /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;