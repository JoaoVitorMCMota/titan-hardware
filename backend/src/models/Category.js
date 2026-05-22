const mongoose = require('mongoose');

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

module.exports = mongoose.model('Category', categorySchema);