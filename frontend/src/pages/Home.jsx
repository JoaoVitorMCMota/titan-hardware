import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

// 1. Recebemos as propriedades que vieram do App.jsx
function Home({ adicionarAoCarrinho, carrinho }) {

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
    // Chamei carregarProdutos() direto aqui para padronizar
    carregarProdutos();
  }, []);

  return (
    <div className="container">

      <h1>Produtos Gamer</h1>
      <p>Os melhores hardwares gamers do mercado.</p>
      
      <div className="products-grid">
        {
          produtos.map((produto) => (
            <ProductCard
              key={produto._id}
              produto={produto}
              onChange={carregarProdutos}
              // 2. Passamos a função adiante para o cartão do produto
              adicionarAoCarrinho={adicionarAoCarrinho} 
            />
          ))
        }
      </div>

      {/* 3. Renderização do carrinho no fim da página para você visualizar */}
      <hr style={{ marginTop: '40px', marginBottom: '20px' }} />
      <h2>Seu Carrinho</h2>
      {carrinho && carrinho.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <ul>
          {carrinho.map((item, index) => (
            <li key={index}>{item.nome} - R$ {item.preco}</li>
          ))}
        </ul>
      )}

    </div>
  );
}

export default Home;