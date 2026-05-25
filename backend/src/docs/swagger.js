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
            _id: {
              type: 'string',
              description: 'ID do produto'
            },
            nome: {
              type: 'string',
              description: 'Nome do produto'
            },
            descricao: {
              type: 'string',
              description: 'Descrição do produto'
            },
            preco: {
              type: 'number',
              description: 'Preço do produto'
            },
            estoque: {
              type: 'number',
              description: 'Quantidade em estoque'
            },
            marca: {
              type: 'string',
              description: 'Marca do produto'
            }
          },
          example: {
            _id: '507f1f77bcf86cd799439011',
            nome: 'Processador Intel i5',
            descricao: 'Processador de última geração',
            preco: 1500.00,
            estoque: 20,
            marca: 'Intel'
          }
        },
        Categoria: {
          type: 'object',
          required: ['nome', 'descricao'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID da categoria'
            },
            nome: {
              type: 'string',
              description: 'Nome da categoria'
            },
            descricao: {
              type: 'string',
              description: 'Descrição da categoria'
            }
          },
          example: {
            _id: '507f1f77bcf86cd799439012',
            nome: 'Processadores',
            descricao: 'Processadores de computador'
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;