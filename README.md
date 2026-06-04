# Titan Hardware

Trabalho prático semestral da disciplina **Arquitetura de Aplicações Web**. Sistema de e-commerce voltado ao mercado de **hardware gamer**.

## Descrição do projeto

O **Titan Hardware** é uma aplicação web para gestão e venda de produtos de informática voltados ao público gamer (processadores, placas de vídeo, periféricos, etc.). O domínio de negócio é o de **e-commerce de hardware**: cadastro de itens com nome, descrição, preço, estoque e marca, categorias, autenticação de usuários, carrinho de compras e controle de acesso por perfil (RBAC).

A solução é dividida em:

- **Backend** — API REST em Node.js/Express, persistência em MongoDB (Mongoose) e documentação OpenAPI via Swagger.
- **Frontend** — interface em React (Vite) com rotas protegidas, catálogo de produtos, carrinho e painéis administrativos.

### Funcionalidades

| Área | Descrição |
|------|-----------|
| **Autenticação** | Registro e login com JWT; sessão persistida no `localStorage`. |
| **Produtos** | CRUD completo; busca por nome, marca ou descrição. |
| **Upload de Imagens** | Upload de imagens para produtos (JPEG, PNG, GIF, WebP); limite 5MB; preview antes de salvar. |
| **Categorias** | CRUD de categorias de produtos. |
| **Carrinho** | Adicionar, remover e limpar itens por usuário. |
| **Usuários** | CRUD de usuários com roles `admin` e `usuario`. |
| **RBAC** | Admins editam/excluem produtos e acessam painéis; clientes adicionam ao carrinho. |

## Estrutura do projeto

```
titan-hardware/
├── backend/
│   ├── server.js                 # Ponto de entrada
│   ├── upload/                   # Pasta onde as imagens dos produtos são salvas
│   └── src/
│       ├── app.js                # Configuração Express e rotas
│       ├── config/
│       │   ├── database.js       # Conexão MongoDB
│       │   └── upload.js         # Configuração do multer para upload de imagens
│       ├── controllers/          # Lógica de negócio (Auth, User, Product, Category, Cart)
│       ├── models/               # Schemas Mongoose
│       ├── routes/               # Rotas da API
│       ├── docs/swagger.js       # Especificação OpenAPI
│       └── test/helpers.js       # Utilitários para testes
├── frontend/
│   └── src/
│       ├── App.jsx               # Rotas, auth e estado global do carrinho
│       ├── components/           # Navbar, ProductCard
│       ├── pages/                # Home, Login, Registro, Carrinho, etc.
│       └── services/api.js       # Cliente HTTP (Axios)
├── SOLID.md                      # Documentação dos princípios SOLID aplicados
├── UPLOAD_IMAGENS.md             # Documentação completa do sistema de upload
└── README.md
```

## Pré-requisitos

Antes de clonar e executar o projeto, instale:

| Ferramenta | Versão recomendada |
|------------|-------------------|
| [Node.js](https://nodejs.org/) | **20.x** LTS (mínimo 18.x) |
| npm | Incluso com o Node.js |
| MongoDB | Cluster no [MongoDB Atlas](https://www.mongodb.com/atlas) ou instância local |

Não é obrigatório Docker para rodar o projeto localmente.

### Dependências do Backend

As dependências principais instaladas automaticamente via `npm install`:

- **Express** — framework web HTTP
- **Mongoose** — ODM para MongoDB
- **Multer** — middleware para upload de arquivos
- **bcryptjs** — hash seguro de senhas
- **jsonwebtoken** — autenticação JWT
- **cors** — CORS middleware
- **swagger-jsdoc** e **swagger-ui-express** — documentação e UI OpenAPI
- **dotenv** — gerenciamento de variáveis de ambiente

### Dependências do Frontend

- **React** — biblioteca de UI
- **React Router** — roteamento entre páginas
- **Axios** — cliente HTTP
- **Vite** — bundler e dev server


## Instalação e execução local

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd titan-hardware
```

### 2. Configurar o backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` na pasta `backend` (veja a seção [Variáveis de ambiente](#variáveis-de-ambiente)).

Inicie a API em modo de desenvolvimento (com [Nodemon](https://nodemon.io/), que reinicia o servidor ao salvar alterações):

```bash
npm run dev
```

O servidor sobe em **http://localhost:3000** (ou na porta definida em `PORT`).

Para subir sem recarregamento automático (produção ou teste pontual), use `node server.js`.

### 3. Configurar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A interface fica disponível em **http://localhost:5173** (porta padrão do Vite).

### 4. Verificar se está funcionando

- Acesse **http://localhost:5173** — faça login ou crie uma conta; navegue pelo catálogo e carrinho.
- Acesse **http://localhost:3000** — resposta JSON da API (`Titan Hardware API`).
- Certifique-se de que o backend está rodando antes de usar o frontend.

## Upload de Imagens

O sistema permite que administradores façam upload de imagens para produtos. As imagens são armazenadas na pasta `backend/upload/` e servidas via HTTP.

### Como usar

#### Criar produto com imagem
1. Navegue até a página **"Criar Produto"** (requer login com perfil `admin`)
2. Preencha os campos: Nome, Descrição, Preço, Estoque, Marca
3. Clique em "Escolher Arquivo" e selecione uma imagem (JPEG, PNG, GIF ou WebP)
4. Veja o preview da imagem
5. Clique em "Criar Produto"

#### Editar imagem de produto existente
1. Na página **Home**, clique em "Editar" em um produto
2. Opcionalmente, selecione uma nova imagem
3. Clique em "Salvar"

#### Via API
```bash
# Criar produto com imagem
curl -X POST \
  -F "nome=Processador Intel i7" \
  -F "descricao=Processador de alta performance" \
  -F "preco=2500" \
  -F "estoque=15" \
  -F "marca=Intel" \
  -F "imagem=@/caminho/para/imagem.jpg" \
  http://localhost:3000/produtos

# Upload de imagem em produto existente
curl -X POST \
  -F "imagem=@/caminho/para/imagem.jpg" \
  http://localhost:3000/produtos/{id}/upload
```

### Especificações

| Aspecto | Detalhe |
|---------|---------|
| **Formatos aceitos** | JPEG, PNG, GIF, WebP |
| **Limite de tamanho** | 5 MB |
| **Armazenamento** | `backend/upload/` |
| **Acesso** | `http://localhost:3000/upload/nome-arquivo.jpg` |
| **Validação** | Tipo MIME + extensão de arquivo |

### Segurança

- ✅ Validação de tipo de arquivo (apenas imagens)
- ✅ Limite de tamanho (5 MB)
- ✅ Nomes únicos com timestamp para evitar conflitos
- ✅ Remoção automática de imagens antigas ao deletar produto
- ✅ Remoção automática de imagens antigas ao substituir

Para mais detalhes, consulte [UPLOAD_IMAGENS.md](./UPLOAD_IMAGENS.md).

## Rotas do frontend

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/login` | Público | Autenticação de usuário |
| `/registro` | Público | Criação de nova conta |
| `/home` | Autenticado | Catálogo de produtos |
| `/carrinho` | Autenticado | Itens adicionados ao carrinho |
| `/criar-produto` | Admin | Cadastro de novos produtos |
| `/gerenciar-usuarios` | Admin | Gestão de usuários do sistema |

Usuários não autenticados são redirecionados para `/login`. Rotas administrativas exibem "Acesso negado" para perfis sem role `admin`.

## Endpoints da API

| Prefixo | Descrição |
|---------|-----------|
| `GET /` | Status da API |
| `/produtos` | CRUD e busca de produtos com suporte a upload de imagens |
| `/produtos/{id}/upload` | Upload de imagem para produto existente |
| `/upload` | Servir arquivos de imagem salvos (estático) |
| `/categorias` | CRUD de categorias |
| `/auth/register` | Registro de usuário |
| `/auth/login` | Login (retorna JWT) |
| `/usuarios` | CRUD de usuários |
| `/carrinho/:usuarioId` | Consultar carrinho |
| `/carrinho/:usuarioId/adicionar` | Adicionar produto |
| `/carrinho/:usuarioId/produtos/:produtoId` | Remover produto |
| `/carrinho/:usuarioId/limpar` | Esvaziar carrinho |

## Documentação da API (Swagger)

Com o backend em execução, abra no navegador:

**http://localhost:3000/api-docs**

Nessa interface você pode consultar e testar os endpoints de **produtos**, **categorias**, **autenticação**, **usuários** e **carrinho**.

## Variáveis de ambiente

### Backend (`backend/.env`)

Crie um arquivo `.env` na pasta `backend`. Use valores fictícios em desenvolvimento; **não commite** o `.env` com credenciais reais.

| Variável | Obrigatória | Descrição | Exemplo (fictício) |
|----------|-------------|-----------|-------------------|
| `MONGO_URI` | Sim | URI de conexão com o MongoDB | `mongodb+srv://SEU_USUARIO:SUA_SENHA@cluster0.exemplo.mongodb.net/SEU_PROJETO?retryWrites=true&w=majority` |
| `JWT_SECRET` | Sim* | Chave secreta para assinar tokens JWT no login | `minha_chave_secreta_dev_abc123xyz` |
| `PORT` | Não | Porta HTTP do servidor (padrão: `3000`) | `3000` |

\* Necessária para o endpoint de login (`POST /auth/login`) funcionar corretamente.

**Exemplo de arquivo `.env`:**

```env
MONGO_URI=mongodb+srv://SEU_USUARIO:SUA_SENHA@cluster0.exemplo.mongodb.net/SEU_PROJETO?retryWrites=true&w=majority
JWT_SECRET=minha_chave_secreta_dev_abc123xyz
PORT=3000
```

Substitua `SEU_USUARIO`, `SUA_SENHA` e `SEU_PROJETO` pelos dados do seu cluster MongoDB Atlas.

### Frontend (opcional)

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | URL base da API consumida pelo frontend | `http://localhost:3000` |

Para usar uma URL diferente, crie um arquivo `.env` na pasta `frontend`:

```env
VITE_API_URL=http://localhost:3000
```

## Testes unitários

O projeto utiliza [Vitest](https://vitest.dev/) para testes unitários no backend e no frontend. Os testes usam mocks das dependências externas (MongoDB, API HTTP) e **não exigem** banco de dados nem servidor em execução.

### Backend

```bash
cd backend
npm test          # executa todos os testes
npm run test:watch  # modo watch (reexecuta ao salvar)
```

Cobertura: controllers de **Auth**, **User**, **Product**, **Category** e **Cart**.

### Frontend

```bash
cd frontend
npm test          # executa todos os testes
npm run test:watch  # modo watch
```

Cobertura: componentes **ProductCard**, **Navbar** e página **Login**.

**Nota:** Os testes do **ProductCard** cobrem também a funcionalidade de upload de imagens (preview, manipulação de files, etc).

## Arquitetura e SOLID

A aplicação segue uma arquitetura em camadas (MVC no backend, componentes e serviços no frontend). A documentação detalhada de como os princípios SOLID foram aplicados está em [SOLID.md](./SOLID.md).

## Melhorias Futuras

Algumas funcionalidades que podem ser adicionadas:

- Compressão e otimização automática de imagens
- Armazenamento em serviço de cloud (AWS S3, Google Cloud Storage, etc)
- Crop e resize de imagens no frontend antes de enviar
- Testes de integração para upload de imagens
- Galeria com múltiplas imagens por produto
- Validação de dimensões de imagem (largura mínima, etc)
- Cache de imagens no frontend

## Autor

João Vítor
