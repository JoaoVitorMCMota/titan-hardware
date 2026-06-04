import { Link } from 'react-router-dom';

function Navbar({ carrinho, usuario, onLogout }) {
  // Obter quantidade de itens no carrinho
  const quantidadeItens = Array.isArray(carrinho?.produtos) ? carrinho.produtos.length : 0;
  
  return (
    <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#222', color: '#fff' }}>
      <h2 className="navbar-title">Titan Hardware</h2>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {/* Se tiver usuário logado, mostra os links */}
        {usuario && (
          <>
            <Link to="/home" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
            
            {/* SÓ MOSTRA SE FOR ADMIN */}
            {usuario.role === 'admin' && (
              <>
                <Link to="/criar-produto" style={{ color: '#fff', textDecoration: 'none' }}>Criar Produto</Link>
                <Link to="/gerenciar-usuarios" style={{ color: '#fff', textDecoration: 'none' }}>Usuários</Link>
              </>
            )}

            <Link to="/carrinho" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
              🛒 Carrinho ({quantidadeItens})
            </Link>

            <span style={{ color: '#aaa', fontSize: '14px' }}>({usuario.email})</span>
            
            <button onClick={onLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
              Sair
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;