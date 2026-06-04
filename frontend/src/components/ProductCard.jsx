import { useMemo, useState } from 'react';

import api from '../services/api';

// 1. ADICIONADO: Recebemos o 'usuario' aqui junto com as outras propriedades
function ProductCard({ produto, onChange, adicionarAoCarrinho, usuario }) {
  const initialForm = useMemo(
    () => ({
      nome: produto?.nome ?? '',
      descricao: produto?.descricao ?? '',
      preco: produto?.preco ?? '',
      estoque: produto?.estoque ?? '',
      marca: produto?.marca ?? '',
      imagem: produto?.imagem ?? null
    }),
    [produto]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [imagemFile, setImagemFile] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(null);

  function startEdit() {
    setForm(initialForm);
    setImagemFile(null);
    setPreviewImagem(null);
    setIsEditing(true);
  }

  function cancelEdit() {
    setForm(initialForm);
    setImagemFile(null);
    setPreviewImagem(null);
    setIsEditing(false);
  }

  function handleImagemChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImagemFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagem(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function salvarEdicao(e) {
    e.preventDefault();

    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append('nome', form.nome);
      formData.append('descricao', form.descricao);
      formData.append('preco', Number(form.preco));
      formData.append('estoque', Number(form.estoque));
      formData.append('marca', form.marca);
      if (imagemFile) {
        formData.append('imagem', imagemFile);
      }

      await api.put(`/produtos/${produto._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsEditing(false);
      setImagemFile(null);
      setPreviewImagem(null);
      await onChange?.();
      alert('Produto atualizado com sucesso!');
    } catch (error) {
      console.log(error);
      alert('Erro ao atualizar produto');
    } finally {
      setIsSaving(false);
    }
  }

  // RESTAURADO: Código da função de exclusão que havia sido cortado
  async function excluirProduto() {
    const ok = confirm(
      `Tem certeza que deseja excluir o produto "${produto.nome}"?`
    );
    if (!ok) return;

    try {
      setIsDeleting(true);
      await api.delete(`/produtos/${produto._id}`);
      await onChange?.();
      alert('Produto excluído com sucesso!');
    } catch (error) {
      console.log(error);
      alert('Erro ao excluir produto');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="card">

      {
        isEditing ? (
          <form className="product-edit-form" onSubmit={salvarEdicao}>
            {previewImagem && (
              <div>
                <img 
                  src={previewImagem} 
                  alt="Preview" 
/*                   style={{ maxWidth: '200px', maxHeight: '200px', marginBottom: '10px' }} 
 */                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImagemChange}
              style={{ marginBottom: '10px' }}
            />

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
            {produto.imagem && (
              <div className='divImagem'>
                <img 
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${produto.imagem}`}
                alt={produto.nome}
                style={{ 
                  width: '100%', 
                  /* height: 'auto' */
                  objectFit: 'cover'
                }}
              />
              </div>
            )}
            
            <h2>{produto.nome}</h2>

            <p>{produto.descricao}</p>

            <h3>
              R$ {produto.preco}
            </h3>

            <span>
              Marca: {produto.marca}
            </span>

            {/* 2. ALTERADO: Regra para diferenciar os botões por cargo (RBAC) */}
            {usuario?.role === 'admin' ? (
              /* Se for administrador, aparecem APENAS os botões de Editar e Excluir */
              <div className="card-actions" style={{ marginTop: '15px' }}>
                <button type="button" onClick={startEdit} disabled={isDeleting}>
                  Editar
                </button>
                <button type="button" className="danger" onClick={excluirProduto} disabled={isDeleting}>
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            ) : (
              /* Se for cliente comum (ou qualquer outro), aparece APENAS o Adicionar ao Carrinho */
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
            )}
          </>
        )
      }

    </div>
  );
}

export default ProductCard;