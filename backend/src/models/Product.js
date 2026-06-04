import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },

  descricao: {
    type: String,
    required: true
  },

  preco: {
    type: Number,
    required: true
  },

  estoque: {
    type: Number,
    required: true
  },

  marca: {
    type: String,
    required: true
  },

  imagem: {
    type: String,
    default: null
  }
});

export default mongoose.model('Product', productSchema);