import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Carrinho({ carrinho, usuarioId, emailUsuario, setCarrinho }) {
  const [carregando, setCarregando] = useState(false);
  
  useEffect(() => {
    if (usuarioId) {
      carregarCarrinho();
    }
  }, [usuarioId]);

  const carregarCarrinho = async () => {
    try {
      setCarregando(true);
      const response = await api.get(`/carrinho/${usuarioId}`);
      setCarrinho(response.data);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      setCarrinho({ usuario: usuarioId, produtos: [] });
    } finally {
      setCarregando(false);
    }
  };

  const removerProduto = async (produtoId) => {
    try {
      setCarregando(true);
      const response = await api.delete(`/carrinho/${usuarioId}/produtos/${produtoId}`);
      setCarrinho(response.data);
      alert('Produto removido do carrinho!');
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      alert('Erro ao remover produto');
    } finally {
      setCarregando(false);
    }
  };

  const limparCarrinho = async () => {
    if (!window.confirm('Tem certeza que deseja esvaziar o carrinho?')) return;
    
    try {
      setCarregando(true);
      const response = await api.delete(`/carrinho/${usuarioId}/limpar`);
      setCarrinho(response.data);
      alert('Carrinho esvaziado!');
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      alert('Erro ao esvaziar carrinho');
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return <div className="container" style={{ padding: '20px' }}><p>Carregando...</p></div>;
  }

  // Obter produtos do carrinho
  const produtos = Array.isArray(carrinho?.produtos) ? carrinho.produtos : [];

  // Calcular o total
  const total = produtos.reduce((sum, item) => {
    const preco = item.produto?.preco || 0;
    const quantidade = item.quantidade || 1;
    return sum + (preco * quantidade);
  }, 0);

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>Seu Carrinho de Compras</h1>
      <p>Gerenciando os itens salvos para: <strong>{emailUsuario}</strong></p>

      {produtos.length === 0 ? (
        <p>O seu carrinho está vazio no momento. Vá para a Home e escolha alguns hardwares!</p>
      ) : (
        <div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {produtos.map((item) => (
              <li 
                key={item.produto?._id} 
                style={{ 
                  padding: '15px', 
                  borderBottom: '1px solid #ccc', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span>{item.produto?.nome} ({item.produto?.marca})</span>
                  <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#666' }}>
                    Quantidade: {item.quantidade} | Preço unitário: R$ {item.produto?.preco?.toFixed(2)}
                  </p>
                  <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#333' }}>
                    Subtotal: R$ {(item.produto?.preco * item.quantidade)?.toFixed(2)}
                  </p>
                </div>
                <button 
                  onClick={() => removerProduto(item.produto?._id)}
                  style={{ 
                    padding: '8px 15px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
          
          <h3 style={{ marginTop: '20px', textAlign: 'right' }}>Total: R$ {total.toFixed(2)}</h3>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button 
              onClick={limparCarrinho} 
              className="danger" 
              style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Esvaziar Carrinho
            </button>
            <button 
              onClick={() => alert('Compra finalizada com sucesso! (Simulação)')} 
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                fontWeight: 'bold' 
              }}
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}