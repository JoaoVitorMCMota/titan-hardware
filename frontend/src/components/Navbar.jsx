import { Link } from 'react-router-dom';

// 1. Adicionamos { carrinho } aqui nos parâmetros para receber os dados do App.jsx
function Navbar({ carrinho }) {
  return (
    <nav className="navbar">
      
      <h2>Titan Hardware</h2>
      
      <div>
        <Link to="/">
          Home
        </Link>
        
        <Link to="/criar-produto">
          Criar Produto
        </Link>

        {/* 2. Link para a nova tela de Login */}
        <Link to="/login">
          Login
        </Link>
      </div>

      {/* 3. Exibição da quantidade de itens no carrinho */}
      <div style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
        <span>🛒 Carrinho: {carrinho ? carrinho.length : 0} itens</span>
      </div>

    </nav>
  );
}

export default Navbar;