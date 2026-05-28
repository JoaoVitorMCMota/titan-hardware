import { useMemo, useState } from 'react';

import api from '../services/api';

// 1. Adicionamos 'adicionarAoCarrinho' aqui nas propriedades recebidas
function ProductCard({ produto, onChange, adicionarAoCarrinho }) {
  const initialForm = useMemo(
    () => ({
      nome: produto?.nome ?? '',
      descricao: produto?.descricao ?? '',
      preco: produto?.preco ?? '',
      estoque: produto?.estoque ?? '',
      marca: produto?.marca ?? ''
    }),
    [produto]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [form, setForm] = useState(initialForm);

  function startEdit() {
    setForm(initialForm);
    setIsEditing(true);
  }

  function cancelEdit() {
    setForm(initialForm);
    setIsEditing(false);
  }

  async function salvarEdicao(e) {
    e.preventDefault();

    try {
      setIsSaving(true);

      await api.put(`/produtos/${produto._id}`, {
        nome: form.nome,
        descricao: form.descricao,
        preco: Number(form.preco),
        estoque: Number(form.estoque),
        marca: form.marca
      });

      setIsEditing(false);
      await onChange?.();
      alert('Produto atualizado com sucesso!');
    } catch (error) {
      console.log(error);
      alert('Erro ao atualizar produto');
    } finally {
      setIsSaving(false);
    }
  }

  async function excluirProduto() {
    const ok = confirm(
      `Tem certeza que deseja excluir o produto "${produto.nome}"?`
    );
    if (!ok) return;

  }

  return (
    <div className="card">

      {
        isEditing ? (
          <form className="product-edit-form" onSubmit={salvarEdicao}>
            <input
              type="text"
              placeholder="Nome"
              value={form.nome}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  nome: e.target.value
                }))
              }
              required
            />

            <input
              type="text"
              placeholder="Descrição"
              value={form.descricao}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  descricao: e.target.value
                }))
              }
              required
            />

            <input
              type="number"
              placeholder="Preço"
              value={form.preco}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  preco: e.target.value
                }))
              }
              required
            />

            <input
              type="number"
              placeholder="Estoque"
              value={form.estoque}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  estoque: e.target.value
                }))
              }
              required
            />

            <input
              type="text"
              placeholder="Marca"
              value={form.marca}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  marca: e.target.value
                }))
              }
              required
            />

            <div className="card-actions">
              <button type="submit" disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
              <button type="button" className="secondary" onClick={cancelEdit} disabled={isSaving}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2>{produto.nome}</h2>

            <p>{produto.descricao}</p>

            <h3>
              R$ {produto.preco}
            </h3>

            <span>
              Marca: {produto.marca}
            </span>

            {/* 2. ADICIONADO: Botão de Adicionar ao Carrinho com um estilo básico destacado */}
            <button 
              type="button" 
              onClick={() => adicionarAoCarrinho?.(produto)}
              disabled={isDeleting}
              style={{ 
                marginTop: '15px', 
                width: '100%', 
                backgroundColor: '#28a745', 
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🛒 Adicionar ao Carrinho
            </button>

            {/* Coloquei uma pequena margem superior aqui para desgrudar do botão de cima */}
            <div className="card-actions" style={{ marginTop: '10px' }}>
              <button type="button" onClick={startEdit} disabled={isDeleting}>
                Editar
              </button>
              <button type="button" className="danger" onClick={excluirProduto} disabled={isDeleting}>
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </>
        )
      }

    </div>
  );
}

export default ProductCard;