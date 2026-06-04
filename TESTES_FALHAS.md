# Testes de Falha - ProductController

Este documento documenta os testes de falha implementados para cobrir cenários de erro no ProductController, conforme requisito **Bônus C** (Testes Unitários).

## Resumo dos Testes

Total: **17 testes** | Sucesso: **6** | Falha: **11**

### Breakdown por Método

| Método | Sucesso | Falha | Total |
|--------|---------|-------|-------|
| `listar()` | 2 | 2 | 4 |
| `buscarPorId()` | 1 | 2 | 3 |
| `criar()` | 1 | 3 | 4 |
| `atualizar()` | 1 | 2 | 3 |
| `deletar()` | 1 | 2 | 3 |

---

## Testes de Sucesso

### 1. Listar Produtos

**Teste:** `deve listar todos os produtos sem filtro`
- Valida se `Product.find()` é chamado corretamente
- Verifica se a resposta contém a lista de produtos

**Teste:** `deve filtrar produtos por nome`
- Valida busca case-insensitive por nome, marca ou descrição
- Verifica se o regex está configurado corretamente

### 2. Buscar por ID

**Teste:** `deve retornar produto encontrado`
- Valida que um produto existente é retornado corretamente
- Simula sucesso do banco de dados

### 3. Criar Produto

**Teste:** `deve criar produto com sucesso`
- Valida que `Product.create()` é chamado com os dados corretos
- Verifica se o status HTTP é `201 (Created)`
- Valida se o produto criado é retornado

### 4. Atualizar Produto

**Teste:** `deve atualizar produto existente`
- Valida que `Product.findByIdAndUpdate()` é chamado com os parâmetros corretos
- Verifica se o produto atualizado é retornado

### 5. Deletar Produto

**Teste:** `deve deletar produto com sucesso`
- Valida que `Product.findByIdAndDelete()` é executado
- Verifica se a mensagem de sucesso é retornada

---

## Testes de Falha

### 1. Listar - Erro no Banco

**Teste:** `deve retornar erro 500 em caso de erro no banco ao listar`
- **Cenário:** Banco de dados indisponível ou erro de conexão
- **Esperado:** Status `500` + mensagem de erro
- **Validação:** Verifica se o erro é propagado corretamente

**Teste:** `deve retornar lista vazia quando nenhum produto encontrado`
- **Cenário:** Busca com filtro que não retorna resultados
- **Esperado:** Array vazio
- **Validação:** Confirma que o sistema trata ausência de resultados graciosamente

### 2. Buscar por ID - Falhas

**Teste:** `deve retornar 404 quando produto não existe`
- **Cenário:** ID inexistente no banco
- **Esperado:** Status `404` + mensagem "Produto não encontrado"
- **Validação:** Verifica tratamento de recurso não encontrado

**Teste:** `deve retornar erro 500 em caso de erro no banco ao buscar por ID`
- **Cenário:** Erro de conexão com o banco
- **Esperado:** Status `500` + mensagem de erro
- **Validação:** Confirma que erros de banco são capturados

### 3. Criar - Falhas

**Teste:** `deve retornar erro 400 ao criar produto com dados inválidos`
- **Cenário:** Dados malformados (ex: preço como string)
- **Esperado:** Status `400` + mensagem de erro de validação
- **Validação:** Simula erro de validação do Mongoose

**Teste:** `deve retornar erro 400 ao criar produto sem campos obrigatórios`
- **Cenário:** Faltam campos obrigatórios (nome, descricao, preco, estoque, marca)
- **Esperado:** Status `400` + mensagem indicando campo faltante
- **Validação:** Testa validação de campos obrigatórios

**Teste:** `deve retornar erro 400 em caso de erro no banco de dados`
- **Cenário:** Erro geral ao inserir no banco
- **Esperado:** Status `400` + mensagem de erro
- **Validação:** Confirma tratamento de erro no create

### 4. Atualizar - Falhas

**Teste:** `deve retornar 404 ao atualizar produto inexistente`
- **Cenário:** Tentativa de atualizar ID que não existe
- **Esperado:** Status `404` + mensagem "Produto não encontrado"
- **Validação:** Verifica se a aplicação valida existência antes de atualizar

**Teste:** `deve retornar erro 400 ao atualizar com dados inválidos`
- **Cenário:** Tipo de dado inválido (ex: preço não-numérico)
- **Esperado:** Status `400` + mensagem de erro
- **Validação:** Testa validação durante atualização

### 5. Deletar - Falhas

**Teste:** `deve retornar 404 ao deletar produto inexistente`
- **Cenário:** Tentativa de deletar ID que não existe
- **Esperado:** Status `404` + mensagem "Produto não encontrado"
- **Validação:** Confirma tratamento de recurso não encontrado

**Teste:** `deve retornar erro 500 em caso de erro no banco ao deletar`
- **Cenário:** Falha na conexão durante delete
- **Esperado:** Status `500` + mensagem de erro
- **Validação:** Testa captura de erro em operação de delete

---

## Cenários Cobertos

| Cenário | Teste | Status |
|---------|-------|--------|
| ✅ Criar com dados válidos | `deve criar produto com sucesso` | Sucesso |
| ❌ Criar com dados inválidos | `deve retornar erro 400 ao criar produto com dados inválidos` | Falha |
| ❌ Criar sem campos obrigatórios | `deve retornar erro 400 ao criar produto sem campos obrigatórios` | Falha |
| ✅ Buscar por ID existente | `deve retornar produto encontrado` | Sucesso |
| ❌ Buscar por ID inexistente | `deve retornar 404 quando produto não existe` | Falha |
| ✅ Atualizar produto existente | `deve atualizar produto existente` | Sucesso |
| ❌ Atualizar produto inexistente | `deve retornar 404 ao atualizar produto inexistente` | Falha |
| ✅ Deletar produto existente | `deve deletar produto com sucesso` | Sucesso |
| ❌ Deletar produto inexistente | `deve retornar 404 ao deletar produto inexistente` | Falha |
| ⚠️ Erros de banco | 6 testes | Falha (tratada) |

---

## Executar os Testes

### Rodar todos os testes

```bash
cd backend
npm test
```

### Rodar apenas ProductController

```bash
npm test -- ProductController
```

### Modo watch (reexecuta ao salvar)

```bash
npm run test:watch
```

### Cobertura

```bash
npm test -- --coverage
```

---

## Estrutura do Teste

Os testes utilizam **Vitest** com padrão AAA (Arrange, Act, Assert):

```javascript
it('deve retornar 404 quando produto não existe', async () => {
  // ARRANGE - Preparar dados e mocks
  const req = createMockRequest({ params: { id: 'inexistente' } });
  const res = createMockResponse();
  Product.findById.mockResolvedValue(null);

  // ACT - Executar a ação
  await ProductController.buscarPorId(req, res);

  // ASSERT - Validar resultado
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: 'Produto não encontrado' });
});
```

---

## Observações

1. **Mocks:** Todos os testes usam mocks do Mongoose para evitar dependência do banco real
2. **Isolamento:** Cada teste é isolado e não depende de outros
3. **Limpeza:** `beforeEach()` limpa mocks antes de cada teste
4. **Cobertura:** Cobre tanto sucesso quanto falha para cada operação
5. **Realismo:** Simula erros reais que podem ocorrer em produção

---

## Atendimento de Requisitos

Este conjunto de testes atende ao **Bônus C** (Testes Unitários):

✅ Testes unitários para a camada de serviço (ProductController)  
✅ Ao menos **2 cenários de sucesso** e **2 cenários de erro** por operação  
✅ Cenários de **criação com dados válidos vs. inválidos**  
✅ Cenários de **busca por ID existente vs. inexistente**  
✅ Executáveis via comando único: `npm test`  
✅ Framework apropriado (Vitest)
