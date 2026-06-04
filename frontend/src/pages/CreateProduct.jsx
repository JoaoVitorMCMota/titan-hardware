import { useState } from 'react';

import api from '../services/api';

function CreateProduct() {

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [marca, setMarca] = useState('');
  const [imagem, setImagem] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(null);

  function handleImagemChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagem(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function criarProduto(e) {

    e.preventDefault();

    try {

      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('descricao', descricao);
      formData.append('preco', preco);
      formData.append('estoque', estoque);
      formData.append('marca', marca);
      if (imagem) {
        formData.append('imagem', imagem);
      }

      await api.post('/produtos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Produto criado com sucesso!');

      setNome('');
      setDescricao('');
      setPreco('');
      setEstoque('');
      setMarca('');
      setImagem(null);
      setPreviewImagem(null);

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

        <input
          type="file"
          accept="image/*"
          onChange={handleImagemChange}
        />

        {previewImagem && (
          <div>
            <img 
              src={previewImagem} 
              alt="Preview" 
              /* style={{ maxWidth: '200px', maxHeight: '200px' }}  */
            />
          </div>
        )}

        <button type="submit">
          Criar Produto
        </button>

      </form>

    </div>
  );
}

export default CreateProduct;