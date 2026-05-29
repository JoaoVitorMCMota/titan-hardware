import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Home from './pages/Home';
import CreateProduct from './pages/CreateProduct';
import Login from './pages/Login';
import Carrinho from './pages/Carrinho';

import Navbar from './components/Navbar';
import './styles/global.css';

function ProtectedRoute({ usuario, children }) {
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function readAuthFromStorage() {
  const emailSalvo = localStorage.getItem('user_email');
  const roleSalva = localStorage.getItem('user_role');

  if (!emailSalvo || !roleSalva) {
    return { usuario: null, carrinho: [] };
  }

  const carrinhoSalvo = localStorage.getItem(`carrinho_${emailSalvo}`);
  return {
    usuario: { email: emailSalvo, role: roleSalva },
    carrinho: carrinhoSalvo ? JSON.parse(carrinhoSalvo) : []
  };
}

function AppRoutes() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(() => readAuthFromStorage().usuario);
  const [carrinho, setCarrinho] = useState(() => readAuthFromStorage().carrinho);

  const loginSucesso = (email, role) => {
    setUsuario({ email, role });
    const carrinhoSalvo = localStorage.getItem(`carrinho_${email}`);
    setCarrinho(carrinhoSalvo ? JSON.parse(carrinhoSalvo) : []);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    setUsuario(null);
    setCarrinho([]);
    navigate('/login', { replace: true });
  };

  const adicionarAoCarrinho = (produto) => {
    if (!usuario) return;
    const novoCarrinho = [...carrinho, produto];
    setCarrinho(novoCarrinho);
    localStorage.setItem(`carrinho_${usuario.email}`, JSON.stringify(novoCarrinho));
    alert(`${produto.nome} adicionado ao carrinho!`);
  };

  return (
    <>
      <Navbar carrinho={carrinho} usuario={usuario} onLogout={logout} />
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={usuario ? '/home' : '/login'} replace />
          }
        />
        <Route
          path="/login"
          element={
            usuario ? (
              <Navigate to="/home" replace />
            ) : (
              <Login onLoginSuccess={loginSucesso} />
            )
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute usuario={usuario}>
              <Home
                usuario={usuario}
                adicionarAoCarrinho={adicionarAoCarrinho}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/criar-produto"
          element={
            <ProtectedRoute usuario={usuario}>
              {usuario?.role === 'admin' ? (
                <CreateProduct />
              ) : (
                <Navigate to="/home" replace />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/carrinho"
          element={
            <ProtectedRoute usuario={usuario}>
              <Carrinho
                carrinho={carrinho}
                emailUsuario={usuario?.email}
                setCarrinho={setCarrinho}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={usuario ? '/home' : '/login'} replace />
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
