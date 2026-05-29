import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

// 1. Recebemos as propriedades que vieram do App.jsx
function Home({ adicionarAoCarrinho, usuario }) {
  const [produtos, setProdutos] = useState([]);

  async function buscarProdutos() {
    const response = await api.get('/produtos');
    return response.data;
  }

  async function carregarProdutos() {
    try {
      const data = await buscarProdutos();
      setProdutos(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <div className="container">
      <h1>Produtos Gamer</h1>
      <p>Os melhores hardwares gamers do mercado.</p>
      <div className="products-grid">
        {produtos.map((produto) => (
          <ProductCard
            key={produto._id}
            produto={produto}
            onChange={carregarProdutos}
            adicionarAoCarrinho={adicionarAoCarrinho} 
            usuario={usuario} // PASSA O USUÁRIO LOGADO PARA O CARD
          />
        ))}
      </div>
    </div>
  );
}

export default Home;