import { useState } from 'react';

import api from '../services/api';

function CreateProduct() {

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [marca, setMarca] = useState('');

  async function criarProduto(e) {

    e.preventDefault();

    try {

      await api.post('/produtos', {
        nome,
        descricao,
        preco,
        estoque,
        marca
      });

      alert('Produto criado com sucesso!');

      setNome('');
      setDescricao('');
      setPreco('');
      setEstoque('');
      setMarca('');

    } catch (error) {

      console.log(error);

      alert('Erro ao criar produto');
    }
  }

  return (

    <div className="container">

      <h1>Criar Produto</h1>

      <form
        onSubmit={criarProduto}
        className="form"
      >

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) =>
            setDescricao(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Preço"
          value={preco}
          onChange={(e) =>
            setPreco(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Estoque"
          value={estoque}
          onChange={(e) =>
            setEstoque(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Marca"
          value={marca}
          onChange={(e) =>
            setMarca(e.target.value)
          }
        />

        <button type="submit">
          Criar Produto
        </button>

      </form>

    </div>
  );
}

export default CreateProduct;