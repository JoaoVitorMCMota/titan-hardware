# Funcionalidade de Upload de Imagens

## Resumo das alterações implementadas

### Backend

#### 1. **Instalação de Dependências**
- Instalado `multer` para gerenciar upload de arquivos

#### 2. **Modelo (Product.js)**
- Adicionado campo `imagem` ao schema do produto:
  ```javascript
  imagem: {
    type: String,
    default: null
  }
  ```

#### 3. **Configuração de Upload (src/config/upload.js)**
- Criado middleware configurado com:
  - Pasta de destino: `backend/upload/`
  - Tipos de arquivo aceitos: JPEG, PNG, GIF, WebP
  - Limite de tamanho: 5MB
  - Nomes únicos com timestamp

#### 4. **Aplicação (src/app.js)**
- Adicionado rota estática para servir imagens:
  ```javascript
  app.use('/upload', express.static(path.join(__dirname, '../upload')));
  ```

#### 5. **Controller (ProductController.js)**
- Atualizado método `criar()` para salvar imagem
- Atualizado método `atualizar()` para aceitar nova imagem
- Atualizado método `deletar()` para remover arquivo de imagem
- Adicionado método `uploadImagem()` para fazer upload em produto existente

#### 6. **Rotas (productRoutes.js)**
- Atualizado POST `/produtos` com middleware de upload
- Atualizado PUT `/produtos/:id` com middleware de upload
- Adicionada rota POST `/produtos/:id/upload` para upload específico

### Frontend

#### 1. **CreateProduct.jsx**
- Adicionado input `<input type="file" accept="image/*">`
- Implementado preview da imagem antes de enviar
- Modificado envio para usar `FormData` em vez de JSON
- Estados: `imagem`, `previewImagem`

#### 2. **ProductCard.jsx**
- Adicionado campo `imagem` ao `initialForm`
- Adicionado input de arquivo no modo de edição
- Exibição da imagem no card (quando não está editando)
- Suporte a upload de imagem ao editar produto
- Preview de imagem antes de salvar

## Como usar

### Criar Produto com Imagem

1. Acesse a página "Criar Produto"
2. Preencha os campos: Nome, Descrição, Preço, Estoque, Marca
3. Clique em "Escolher Arquivo" e selecione uma imagem
4. Veja o preview da imagem
5. Clique em "Criar Produto"

### Editar Produto e Adicionar/Alterar Imagem

1. Na página Home, clique em "Editar" em um produto
2. Opcionalmente, selecione uma nova imagem
3. Faça outras alterações se desejar
4. Clique em "Salvar"

### Fazer Upload de Imagem em Produto Existente

**Via API:**
```bash
curl -X POST \
  -F "imagem=@/caminho/para/imagem.jpg" \
  http://localhost:3000/produtos/{id}/upload
```

## Detalhes Técnicos

### Estrutura de Pasta
```
backend/
├── upload/              # Pasta onde as imagens são armazenadas
│   ├── produto-nome-1234567890-123456.jpg
│   └── ...
├── src/
│   ├── config/
│   │   └── upload.js    # Configuração do multer
│   ├── controllers/
│   │   └── ProductController.js (modificado)
│   ├── models/
│   │   └── Product.js (modificado)
│   └── routes/
│       └── productRoutes.js (modificado)
```

### Resposta da API

Ao criar/atualizar um produto com sucesso:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nome": "Processador Intel i7",
  "descricao": "Processador de alta performance",
  "preco": 2500,
  "estoque": 15,
  "marca": "Intel",
  "imagem": "/upload/produto-nome-1234567890-123456.jpg"
}
```

### Acesso às Imagens

As imagens podem ser acessadas via URL:
```
http://localhost:3000/upload/nome-do-arquivo.jpg
```

## Segurança

- ✅ Validação de tipo de arquivo (apenas imagens)
- ✅ Limite de tamanho (5MB)
- ✅ Nomes únicos para evitar conflitos
- ✅ Remoção automática de imagens antigas ao deletar produto
- ✅ Remoção automática de imagens antigas ao substituir

## Possíveis Melhorias Futuras

- Adicionar mais formatos de imagem
- Aumentar limite de tamanho de arquivo
- Implementar compressão automática de imagens
- Adicionar crop/resize de imagens no frontend
- Armazenar imagens em serviço de cloud (S3, etc)
- Adicionar validação de dimensões de imagem
