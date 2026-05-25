import { useEffect, useState } from 'react';

import api from '../services/api';

import ProductCard from '../components/ProductCard';

function Home() {

  const [produtos, setProdutos] = useState([]);

  async function carregarProdutos() {

    try {

      const response =
        await api.get('/produtos');

      setProdutos(response.data);

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

      <div className="products-grid">

        {
          produtos.map((produto) => (
            <ProductCard
              key={produto._id}
              produto={produto}
            />
          ))
        }

      </div>

    </div>
  );
}

export default Home;