import { Link } from 'react-router-dom';

function Navbar() {

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

      </div>

    </nav>
  );
}

export default Navbar;