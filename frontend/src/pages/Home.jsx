import { useEffect, useState } from 'react';

import api from '../services/api';

function Home() {

  const [produtos, setProdutos] = useState([]);

  async function carregarProdutos() {
    try {
      const response = await api.get('/produtos');

      setProdutos(response.data);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <div>

      <h1>Titan Hardware</h1>

      <h2>Produtos</h2>

      {
        produtos.map((produto) => (
          <div key={produto._id}>

            <h3>{produto.nome}</h3>

            <p>{produto.descricao}</p>

            <p>R$ {produto.preco}</p>

            <hr />

          </div>
        ))
      }

    </div>
  );
}

export default Home;