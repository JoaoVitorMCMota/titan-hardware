import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

function Home({ adicionarAoCarrinho, usuario }) {
  const [produtos, setProdutos] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [pesquisando, setPesquisando] = useState(false);

  async function buscarProdutos(nome) {
    const params = nome?.trim() ? { nome: nome.trim() } : {};
    const response = await api.get('/produtos', { params });
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

  async function pesquisarProduto(e) {
    e?.preventDefault();

    const termo = termoPesquisa.trim();
    if (!termo) {
      await carregarProdutos();
      return;
    }

    try {
      setPesquisando(true);
      const data = await buscarProdutos(termo);
      setProdutos(data);
    } catch (error) {
      console.log(error);
    } finally {
      setPesquisando(false);
    }
  }

  async function limparPesquisa() {
    setTermoPesquisa('');
    await carregarProdutos();
  }

  function ordenarPorPreco() {
    setProdutos((lista) => [...lista].sort((a, b) => a.preco - b.preco));
  }

  function ordenarPorNome() {
    setProdutos((lista) =>
      [...lista].sort((a, b) => a.nome.localeCompare(b.nome))
    );
  }

  return (
    <div className="container">
      <h1>Produtos Gamer</h1>
      <p>Os melhores hardwares gamers do mercado.</p>

      <form className="home-toolbar" onSubmit={pesquisarProduto}>
        <input
          type="text"
          placeholder="Pesquisar por nome, marca ou descrição"
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
        />
        <button type="submit" disabled={pesquisando}>
          {pesquisando ? 'Pesquisando...' : 'Pesquisar'}
        </button>
        <button type="button" className="secondary" onClick={limparPesquisa}>
          Limpar
        </button>
        <button type="button" className="secondary" onClick={ordenarPorPreco}>
          Ordenar por preço
        </button>
        <button type="button" className="secondary" onClick={ordenarPorNome}>
          Ordenar por nome
        </button>
      </form>

      {produtos.length === 0 ? (
        <p className="home-empty">
          {termoPesquisa.trim()
            ? 'Nenhum produto encontrado para essa pesquisa.'
            : 'Nenhum produto cadastrado.'}
        </p>
      ) : (
        <div className="products-grid">
          {produtos.map((produto) => (
            <ProductCard
              key={produto._id}
              produto={produto}
              onChange={carregarProdutos}
              adicionarAoCarrinho={adicionarAoCarrinho}
              usuario={usuario}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
