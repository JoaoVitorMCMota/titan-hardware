import { useState } from 'react'; // Adicionado o hook useState
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Home from './pages/Home';
import CreateProduct from './pages/CreateProduct';
import Login from './pages/Login'; // Adicionada a importação da página de Login

import Navbar from './components/Navbar';

import './styles/global.css';

function App() {
  // Variável de estado para guardar os itens do carrinho
  const [carrinho, setCarrinho] = useState([]);

  // Função que será repassada para a Home
  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]);
    alert(`${produto.nome} adicionado ao carrinho!`);
  };

  return (
    <BrowserRouter>

      {/* Passamos o carrinho como propriedade para a Navbar. 
          Assim você pode mostrar a quantidade de itens lá! */}
      <Navbar carrinho={carrinho} />

      <Routes>

        <Route
          path="/"
          // Atualizamos a Home para receber a função e a lista do carrinho
          element={<Home adicionarAoCarrinho={adicionarAoCarrinho} carrinho={carrinho} />}
        />

        <Route
          path="/criar-produto"
          element={<CreateProduct />}
        />

        {/* Adicionada a nova rota para a tela de Login */}
        <Route
          path="/login"
          element={<Login />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;