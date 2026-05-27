# Titan Hardware

Trabalho prático semestral da disciplina **Arquitetura de Aplicações Web**. Sistema de e-commerce voltado ao mercado de **hardware gamer**.

## Descrição do projeto

O **Titan Hardware** é uma aplicação web para gestão e exibição de produtos de informática voltados ao público gamer (processadores, placas de vídeo, periféricos, etc.). O domínio de negócio é o de **e-commerce de hardware**: cadastro de itens com nome, descrição, preço, estoque e marca, além de categorias e autenticação de usuários na API.

A solução é dividida em:

- **Backend** — API REST em Node.js/Express, persistência em MongoDB (Mongoose) e documentação OpenAPI via Swagger.
- **Frontend** — interface em React (Vite) para listar produtos, criar novos e editar/excluir itens diretamente na página inicial.

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

Inicie a API:

```bash
node server.js
```

O servidor sobe em **http://localhost:3000** (ou na porta definida em `PORT`).

### 3. Configurar o frontend

Em outro terminal, na raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

A interface fica disponível em **http://localhost:5173** (porta padrão do Vite).

### 4. Verificar se está funcionando

- Acesse **http://localhost:5173** — lista de produtos e ações de criar, editar e excluir.
- Acesse **http://localhost:3000** — resposta JSON da API (`Titan Hardware API`).
- Certifique-se de que o backend está rodando antes de usar o frontend (o frontend consome `http://localhost:3000`).

## Documentação da API (Swagger)

Com o backend em execução, abra no navegador:

**http://localhost:3000/api-docs**

Nessa interface você pode consultar e testar os endpoints de **produtos**, **categorias** e **autenticação** (`/produtos`, `/categorias`, `/auth`).

## Variáveis de ambiente

Crie um arquivo `.env` na pasta `backend` com as variáveis abaixo. Use valores fictícios em desenvolvimento; **não commite** o `.env` com credenciais reais.

| Variável | Obrigatória | Descrição | Exemplo (fictício) |
|----------|-------------|-----------|-------------------|
| `MONGO_URI` | Sim | URI de conexão com o MongoDB | `mongodb+srv://usuario:senha123@cluster0.exemplo.mongodb.net/titan-hardware?retryWrites=true&w=majority` |
| `JWT_SECRET` | Sim* | Chave secreta para assinar tokens JWT no login | `minha_chave_secreta_dev_abc123xyz` |
| `PORT` | Não | Porta HTTP do servidor (padrão: `3000`) | `3000` |

\* Necessária para o endpoint de login (`POST /auth/login`) funcionar corretamente.

**Exemplo de arquivo `.env`:**

```env
MONGO_URI=mongodb+srv://usuario:senha123@cluster0.exemplo.mongodb.net/titan-hardware?retryWrites=true&w=majority
JWT_SECRET=minha_chave_secreta_dev_abc123xyz
PORT=3000
```
