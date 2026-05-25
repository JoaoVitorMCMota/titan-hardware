import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },

  descricao: {
    type: String,
    required: true
  }
});

export default mongoose.model('Category', categorySchema);