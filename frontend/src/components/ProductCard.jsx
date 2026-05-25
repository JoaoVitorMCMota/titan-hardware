function ProductCard({ produto }) {

  return (
    <div className="card">

      <h2>{produto.nome}</h2>

      <p>{produto.descricao}</p>

      <h3>
        R$ {produto.preco}
      </h3>

      <span>
        Marca: {produto.marca}
      </span>

    </div>
  );
}

export default ProductCard;