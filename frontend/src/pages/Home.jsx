import { useEffect, useState } from 'react';

import api from '../services/api';

import ProductCard from '../components/ProductCard';

function Home() {

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
    buscarProdutos()
      .then((data) => setProdutos(data))
      .catch((error) => console.log(error));
  }, []);

  return (

    <div className="container">

      <h1>Produtos Gamer</h1>

      <div className="products-grid">

        {
          produtos.map((produto) => (
            <ProductCard
              key={produto._id}
              produto={produto}
              onChange={carregarProdutos}
            />
          ))
        }

      </div>

    </div>
  );
}

export default Home;