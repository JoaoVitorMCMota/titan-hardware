export default function Carrinho({ carrinho, emailUsuario, setCarrinho }) {
  
  const limparCarrinho = () => {
    setCarrinho([]);
    localStorage.removeItem(`carrinho_${emailUsuario}`);
    alert('Carrinho esvaziado!');
  };

  // Soma o valor total de todos os produtos do carrinho
  const total = carrinho.reduce((sum, item) => sum + Number(item.preco), 0);

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>Seu Carrinho de Compras</h1>
      <p>Gerenciando os itens salvos para: <strong>{emailUsuario}</strong></p>

      {carrinho.length === 0 ? (
        <p>O seu carrinho está vazio no momento. Vá para a Home e escolha alguns hardwares!</p>
      ) : (
        <div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {carrinho.map((item, index) => (
              <li key={index} style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.nome} ({item.marca})</span>
                <strong>R$ {item.preco}</strong>
              </li>
            ))}
          </ul>
          
          <h3 style={{ marginTop: '20px', textAlign: 'right' }}> Total: R$ {total.toFixed(2)}</h3>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button onClick={limparCarrinho} className="danger" style={{ padding: '10px 20px' }}>
              Esvaziar Carrinho
            </button>
            <button onClick={() => alert('Compra finalizada com sucesso! (Simulação)')} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Finalizar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}