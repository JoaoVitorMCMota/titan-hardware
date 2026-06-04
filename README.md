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
| **Categorias** | CRUD de categorias de produtos. |
| **Carrinho** | Adicionar, remover e limpar itens por usuário. |
| **Usuários** | CRUD de usuários com roles `admin` e `usuario`. |
| **RBAC** | Admins editam/excluem produtos e acessam painéis; clientes adicionam ao carrinho. |

## Estrutura do projeto

```
titan-hardware/
├── backend/
│   ├── server.js                 # Ponto de entrada
│   └── src/
│       ├── app.js                # Configuração Express e rotas
│       ├── config/database.js    # Conexão MongoDB
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
| `/produtos` | CRUD e busca de produtos |
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

## Arquitetura e SOLID

A aplicação segue uma arquitetura em camadas (MVC no backend, componentes e serviços no frontend). A documentação detalhada de como os princípios SOLID foram aplicados está em [SOLID.md](./SOLID.md).

## Autor

João Vítor
