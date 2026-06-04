import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Titan Hardware API',
      version: '1.0.0',
      description: 'API da loja Titan Hardware'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],
    components: {
      schemas: {
        Produto: {
          type: 'object',
          required: ['nome', 'descricao', 'preco', 'estoque', 'marca'],
          properties: {
            _id: { type: 'string', description: 'ID do produto' },
            nome: { type: 'string', description: 'Nome do produto' },
            descricao: { type: 'string', description: 'Descrição do produto' },
            preco: { type: 'number', description: 'Preço do produto' },
            estoque: { type: 'number', description: 'Quantidade em estoque' },
            marca: { type: 'string', description: 'Marca do produto' }
          },
          example: {
            _id: '507f1f77bcf86cd799439011',
            nome: 'Processador Intel i5',
            descricao: 'Processador de última geração',
            preco: 1500.00,
            estoque: 20,
            marca: 'Intel',
            imagem: '/upload/IntelI5-1780599788424-628517407.webp'
          }
        },
        Categoria: {
          type: 'object',
          required: ['nome', 'descricao'],
          properties: {
            _id: { type: 'string', description: 'ID da categoria' },
            nome: { type: 'string', description: 'Nome da categoria' },
            descricao: { type: 'string', description: 'Descrição da categoria' }
          },
          example: {
            _id: '507f1f77bcf86cd799439012',
            nome: 'Processadores',
            descricao: 'Processadores de computador'
          }
        },
        // ADICIONADO: Schema do Usuário para aparecer globalmente no Swagger
        Usuario: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            _id: { type: 'string', description: 'ID gerado pelo MongoDB' },
            nome: { type: 'string', description: 'Nome do usuário' },
            email: { type: 'string', description: 'E-mail único de acesso' },
            senha: { type: 'string', description: 'Senha de acesso (será criptografada)' },
            role: { 
              type: 'string', 
              enum: ['admin', 'usuario'], 
              default: 'usuario',
              description: 'Nível de permissão do usuário' 
            }
          },
          example: {
            nome: 'Administrador Titan',
            email: 'admin@titan.com',
            senha: 'senhaSegura123',
            role: 'admin'
          }
        },
        Carrinho: {
          type: 'object',
          required: ['usuario', 'produtos'],
          properties: {
            _id: { type: 'string', description: 'ID do carrinho' },
            usuario: { type: 'string', description: 'ID do usuário proprietário do carrinho' },
            produtos: {
              type: 'array',
              description: 'Lista de produtos no carrinho',
              items: {
                type: 'object',
                properties: {
                  produto: { type: 'string', description: 'ID do produto' },
                  quantidade: { type: 'number', description: 'Quantidade do produto' }
                }
              }
            }
          },
          example: {
            _id: '507f1f77bcf86cd799439013',
            usuario: '507f1f77bcf86cd799439001',
            produtos: [
              {
                produto: '507f1f77bcf86cd799439011',
                quantidade: 2
              },
              {
                produto: '507f1f77bcf86cd799439012',
                quantidade: 1
              }
            ]
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;