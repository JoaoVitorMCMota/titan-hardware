import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  senha: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario'
  }
});

export default mongoose.model('User', userSchema);