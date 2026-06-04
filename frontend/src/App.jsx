import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import CreateProduct from './pages/CreateProduct';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrinho from './pages/Carrinho';

import Navbar from './components/Navbar';
import api from './services/api';
import './styles/global.css';

function ProtectedRoute({ usuario, children }) {
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminRoute({ usuario, children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario && usuario.role !== 'admin') {
      const timer = setTimeout(() => {
        navigate('/home', { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [usuario, navigate]);

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.role !== 'admin') {
    return (
      <div className="container">
        <p className="access-denied">Acesso negado</p>
      </div>
    );
  }

  return children;
}

function readAuthFromStorage() {
  const emailSalvo = localStorage.getItem('user_email');
  const roleSalva = localStorage.getItem('user_role');
  const userIdSalvo = localStorage.getItem('user_id');

  if (!emailSalvo || !roleSalva || !userIdSalvo) {
    return { usuario: null };
  }

  return {
    usuario: { email: emailSalvo, role: roleSalva, id: userIdSalvo }
  };
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const exibirNavbar = !['/login', '/registro'].includes(location.pathname);
  const [usuario, setUsuario] = useState(() => readAuthFromStorage().usuario);
  const [carrinho, setCarrinho] = useState({ produtos: [] });

  useEffect(() => {
    if (usuario?.id) {
      carregarCarrinho(usuario.id);
    }
  }, [usuario?.id]);

  const loginSucesso = (email, role, userId) => {
    setUsuario({ email, role, id: userId });
    carregarCarrinho(userId);
  };

  const carregarCarrinho = async (usuarioId) => {
    try {
      const response = await api.get(`/carrinho/${usuarioId}`);
      setCarrinho(response.data);
    } catch (error) {
      console.log('Carrinho vazio ou erro ao carregar:', error);
      setCarrinho({ usuario: usuarioId, produtos: [] });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    setUsuario(null);
    setCarrinho({ produtos: [] });
    navigate('/login', { replace: true });
  };

  const adicionarAoCarrinho = async (produto) => {
    if (!usuario) return;
    
    try {
      const response = await api.post(`/carrinho/${usuario.id}/adicionar`, {
        produtoId: produto._id,
        quantidade: 1
      });
      setCarrinho(response.data);
      alert(`${produto.nome} adicionado ao carrinho!`);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert('Erro ao adicionar produto ao carrinho');
    }
  };

  return (
    <>
      {exibirNavbar && (
        <Navbar carrinho={carrinho} usuario={usuario} onLogout={logout} />
      )}
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
          path="/registro"
          element={
            usuario ? (
              <Navigate to="/home" replace />
            ) : (
              <Registro />
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
            <AdminRoute usuario={usuario}>
              <CreateProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/gerenciar-usuarios"
          element={
            <AdminRoute usuario={usuario}>
              <GerenciarUsuarios />
            </AdminRoute>
          }
        />
        <Route
          path="/carrinho"
          element={
            <ProtectedRoute usuario={usuario}>
              <Carrinho
                carrinho={carrinho}
                usuarioId={usuario?.id}
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
