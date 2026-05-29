# Princípios SOLID no projeto Titan Hardware

Documentação dos princípios **SOLID** identificados na análise do **Backend** (Node.js/Express/Mongoose) e do **Frontend** (React/Vite). Cada item indica o princípio, onde aparece no código e como o trecho o atende.

---

## S — Single Responsibility Principle (Princípio da Responsabilidade Única)

> *Uma classe/módulo deve ter apenas um motivo para mudar.*

### Backend

| Onde | Trecho / responsabilidade | Justificativa |
|------|---------------------------|---------------|
| `backend/src/config/database.js` | Função `connectDatabase()` — apenas conecta ao MongoDB via `MONGO_URI`. | A conexão com o banco fica isolada; mudanças em URI, driver ou mensagens de erro não afetam rotas nem controllers. |
| `backend/src/models/Product.js` | Schema Mongoose do produto (`nome`, `descricao`, `preco`, etc.). | Define somente a estrutura e persistência de **Produto**; não trata HTTP nem regras de negócio de autenticação. |
| `backend/src/models/User.js` | Schema do usuário (`nome`, `email`, `senha`, `role`). | Responsável apenas pelo modelo de dados de usuário. |
| `backend/src/controllers/ProductController.js` | Métodos `listar`, `buscarPorId`, `criar`, `atualizar`, `deletar` para produtos. | Centraliza a lógica HTTP/CRUD de produtos, sem misturar categorias, auth ou configuração do Express. |
| `backend/src/controllers/AuthController.js` | Métodos `register` e `login` (hash de senha, JWT). | Cuida exclusivamente de autenticação; não implementa CRUD de produtos. |
| `backend/src/routes/productRoutes.js` | Mapeia verbos HTTP para `ProductController` (ex.: `router.get('/', ProductController.listar)`). | Só define **rotas**; a implementação fica no controller. |
| `backend/src/app.js` | Registra middlewares (`express.json`, `cors`) e monta rotas (`/produtos`, `/auth`, etc.). | Orquestra a aplicação Express sem implementar regras de cada domínio. |
| `backend/server.js` | Carrega `.env`, chama `connectDatabase()` e inicia `app.listen()`. | Ponto de entrada: bootstrap do servidor, separado da configuração de rotas em `app.js`. |

**Exemplo — conexão isolada:**

```3:17:backend/src/config/database.js
async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI;
    // ...
    await mongoose.connect(mongoUri);
  } catch (error) {
    // ...
  }
}
```

### Frontend

| Onde | Trecho / responsabilidade | Justificativa |
|------|---------------------------|---------------|
| `frontend/src/services/api.js` | Instância Axios com `baseURL`. | Um único lugar configura o cliente HTTP; páginas não repetem URL da API. |
| `frontend/src/components/Navbar.jsx` | Barra de navegação, links e botão Sair. | Só cuida da UI de navegação; não busca produtos nem faz login. |
| `frontend/src/pages/Login.jsx` | Formulário e fluxo de login. | Responsável apenas pela autenticação na interface. |
| `frontend/src/pages/Home.jsx` | Lista produtos e renderiza `ProductCard`. | Focado em exibir o catálogo; edição/exclusão ficam no card; carrinho global fica no `App`. |
| `frontend/src/components/ProductCard.jsx` | Card de produto (visualização, edição admin, carrinho cliente). | Encapsula interações de **um** produto na listagem. |
| `frontend/src/App.jsx` — `ProtectedRoute` | Redireciona para `/login` se não houver `usuario`. | Responsabilidade única: **controle de acesso** às rotas filhas. |

**Exemplo — rota protegida dedicada:**

```12:17:frontend/src/App.jsx
function ProtectedRoute({ usuario, children }) {
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
```

---

## O — Open/Closed Principle (Princípio Aberto/Fechado)

> *Aberto para extensão, fechado para modificação.*

### Backend

| Onde | Trecho | Justificativa |
|------|--------|---------------|
| `backend/src/app.js` | Inclusão de `userRoutes` com `app.use('/usuarios', userRoutes)` sem alterar `ProductController` ou `productRoutes`. | Novo módulo de usuários foi **adicionado** por extensão (novo arquivo de rotas + controller), sem reescrever o CRUD de produtos. |
| `backend/src/docs/swagger.js` | Especificação OpenAPI separada de `app.js`. | Documentação pode evoluir (novos schemas/endpoints) sem mudar a lógica dos controllers. |
| Padrão Controller + Routes | `CategoryController` / `categoryRoutes.js` seguem o mesmo padrão de `ProductController`. | Novas entidades (ex.: categorias) estendem a arquitetura existente com novos arquivos, em vez de concentrar tudo em um único módulo gigante. |

**Exemplo — extensão por novas rotas:**

```25:31:backend/src/app.js
app.use('/produtos', productRoutes);
app.use('/categorias', categoryRoutes);
app.use('/auth', authRoutes);
app.use('/usuarios', userRoutes);
```

### Frontend

| Onde | Trecho | Justificativa |
|------|--------|---------------|
| `frontend/src/App.jsx` — `<Routes>` | Novas páginas (`/carrinho`, `/criar-produto`) como novos `<Route>`. | Novas telas são **registradas** no roteador; `ProtectedRoute` e `Navbar` permanecem reutilizáveis sem reimplementar autenticação em cada página. |
| `frontend/src/components/ProductCard.jsx` | Ramificação por `usuario?.role === 'admin'` vs botão de carrinho. | Comportamento estendido por **papel do usuário** sem criar dois componentes de card totalmente separados para cada tipo. |

**Exemplo — nova rota sem alterar `ProtectedRoute`:**

```93:104:frontend/src/App.jsx
<Route
  path="/criar-produto"
  element={
    <ProtectedRoute usuario={usuario}>
      {usuario?.role === 'admin' ? (
        <CreateProduct />
      ) : (
        <Navigate to="/home" replace />
      )}
    </ProtectedRoute>
  }
/>
```

---

## L — Liskov Substitution Principle (Princípio da Substituição de Liskov)

> *Subtipos devem poder substituir seus tipos base sem quebrar o programa.*

Em JavaScript não há herança formal ampla no projeto; o princípio aparece por **contratos consistentes** e **composição**.

### Backend

| Onde | Trecho | Justificativa |
|------|--------|---------------|
| `ProductController`, `CategoryController`, `UserController` | Mesma “interface” de métodos: `listar`, `buscarPorId`, `criar`, `atualizar`, `deletar`. | As rotas em `*Routes.js` podem tratar controllers de forma previsível (`router.get('/', XController.listar)`), pois cada um expõe operações equivalentes para sua entidade. |
| `backend/src/routes/productRoutes.js` | `ProductController.listar`, `.criar`, etc. passados como handlers do Express. | Qualquer método com assinatura `(req, res)` pode ser usado no lugar; o Express não depende da classe concreta, apenas do handler. |

**Exemplo — contrato CRUD uniforme:**

```4:11:backend/src/controllers/CategoryController.js
class CategoryController {
  async listar(req, res) { /* ... */ }
  async buscarPorId(req, res) { /* ... */ }
  async criar(req, res) { /* ... */ }
  // atualizar, deletar...
}
```

### Frontend

| Onde | Trecho | Justificativa |
|------|--------|---------------|
| `frontend/src/App.jsx` — `ProtectedRoute` | `children` pode ser `<Home />`, `<Carrinho />` ou `<CreateProduct />`. | Qualquer página autenticada substitui `children` sem alterar a lógica de redirecionamento do wrapper. |
| `frontend/src/pages/Home.jsx` | Repasse de `onChange={carregarProdutos}` ao `ProductCard`. | O card depende de um callback genérico; a Home define **como** recarregar, o card só **invoca** após salvar/excluir. |

**Exemplo — substituição de conteúdo protegido:**

```82:91:frontend/src/App.jsx
<Route
  path="/home"
  element={
    <ProtectedRoute usuario={usuario}>
      <Home usuario={usuario} adicionarAoCarrinho={adicionarAoCarrinho} />
    </ProtectedRoute>
  }
/>
```

---

## I — Interface Segregation Principle (Princípio da Segregação de Interface)

> *Clientes não devem depender de interfaces que não utilizam.*

No frontend isso aparece como **props mínimas**; no backend, como **exposição seletiva** de métodos e dados.

### Backend

| Onde | Trecho | Justificativa |
|------|--------|---------------|
| `backend/src/routes/productRoutes.js` | Cada rota liga **um** método (`ProductController.listar`, `.deletar`, etc.). | O cliente HTTP (GET `/produtos`) usa só `listar`, sem depender de `login` ou `criar` categoria. |
| `backend/src/controllers/UserController.js` | `User.find().select('-senha')` e `.select('-senha')` no update. | Respostas expõem apenas o que o consumidor da API precisa; o hash da senha não faz parte da “interface” pública. |
| `backend/src/controllers/AuthController.js` — `register` | `usuario.senha = undefined` antes do `res.json(usuario)`. | Registro retorna usuário sem campo sensível que o cliente não deve usar. |

**Exemplo — listagem sem expor senha:**

```5:9:backend/src/controllers/UserController.js
async listar(req, res) {
  try {
    const usuarios = await User.find().select('-senha');
    res.json(usuarios);
```

### Frontend

| Onde | Trecho | Justificativa |
|------|--------|---------------|
| `frontend/src/components/Navbar.jsx` | Props: `carrinho`, `usuario`, `onLogout`. | A Navbar não recebe `setCarrinho`, `loginSucesso` nem estado de produtos — só o necessário para menu e logout. |
| `frontend/src/pages/Login.jsx` | Prop: `onLoginSuccess`. | A página de login não precisa do estado global do carrinho; apenas notifica sucesso via callback. |
| `frontend/src/components/ProductCard.jsx` | Props: `produto`, `onChange`, `adicionarAoCarrinho`, `usuario`. | O card não acessa roteador nem `localStorage` de auth; recebe só dados e ações relevantes ao produto. |
| `frontend/src/pages/Carrinho.jsx` | Props: `carrinho`, `emailUsuario`, `setCarrinho`. | Isolada do fluxo de listagem/edição de produtos na Home. |

**Exemplo — props enxutas na Navbar:**

```3:4:frontend/src/components/Navbar.jsx
function Navbar({ carrinho, usuario, onLogout }) {
```

---

## D — Dependency Inversion Principle (Princípio da Inversão de Dependência)

> *Depender de abstrações, não de implementações concretas.*

### Backend

| Onde | Trecho | Justificativa |
|------|--------|---------------|
| `backend/server.js` | Importa `app` e `connectDatabase` em vez de criar Express e Mongoose inline. | O ponto de entrada **depende de módulos** de alto nível (`app`, conexão), não detalha middlewares ou schemas. |
| `backend/src/controllers/ProductController.js` | `import Product from '../models/Product.js'`. | O controller depende do **modelo** (camada de persistência), não de chamadas diretas à coleção MongoDB na rota. |
| `backend/src/app.js` | Monta rotas importadas (`productRoutes`, `authRoutes`, …). | `app.js` não implementa handlers; delega para módulos de rotas/controllers. |

**Exemplo — bootstrap desacoplado:**

```1:6:backend/server.js
import 'dotenv/config.js';
import app from './src/app.js';
import connectDatabase from './src/config/database.js';

await connectDatabase();
```

### Frontend

| Onde | Trecho | Justificativa |
|------|--------|---------------|
| `frontend/src/services/api.js` | Cliente Axios centralizado. | `Home`, `CreateProduct` e `ProductCard` dependem da **abstração** `api`, não repetem configuração de `fetch`/URL em cada arquivo. |
| `frontend/src/pages/Home.jsx` | `import api from '../services/api'`. | A página não fixa host/porta; mudança de ambiente concentra-se em `api.js`. |
| `frontend/src/App.jsx` | Passa `onLoginSuccess`, `adicionarAoCarrinho`, `onLogout` para filhos. | Filhos dependem de **contratos** (callbacks), não de implementação interna do estado do `App`. |
| `frontend/src/pages/Login.jsx` | Chama `onLoginSuccess(email, cargo)` após sucesso. | Login não manipula diretamente `setUsuario` do pai; inverte o controle para o componente que detém o estado global. |

**Exemplo — dependência do serviço HTTP:**

```1:5:frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});
```

```9:11:frontend/src/pages/Home.jsx
async function buscarProdutos() {
  const response = await api.get('/produtos');
  return response.data;
}
```

---

## Resumo por camada

| Princípio | Backend (exemplos principais) | Frontend (exemplos principais) |
|-----------|------------------------------|--------------------------------|
| **S** | `database.js`, models, controllers, routes, `app.js` | `api.js`, `Navbar`, páginas, `ProtectedRoute` |
| **O** | Novas rotas em `app.js`, Swagger separado, controllers por entidade | Novas `<Route>`, RBAC no `ProductCard` |
| **L** | Controllers CRUD uniformes; handlers Express substituíveis | `ProtectedRoute` + `children` intercambiáveis |
| **I** | Rotas por método; `.select('-senha')` | Props mínimas por componente |
| **D** | `server.js` → `app` + `connectDatabase`; controllers → models | `api.js`; callbacks do `App` para filhos |

---

## Observações

- O projeto aplica SOLID de forma **pragmática** (camadas MVC no backend, componentes e serviços no frontend), típica de aplicações acadêmicas em Node/React.
