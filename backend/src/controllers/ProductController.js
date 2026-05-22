const Product = require('../models/Product');

class ProductController {
  async listar(req, res) {
    const produtos = await Product.find();

    res.json(produtos);
  }

  async buscarPorId(req, res) {
  const { id } = req.params;

  const produto = await Product.findById(id);

  res.json(produto);
  }

  async atualizar(req, res) {
  const { id } = req.params;

  const produtoAtualizado = await Product.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  res.json(produtoAtualizado);
  }

  async criar(req, res) {
    const produto = await Product.create(req.body);

    res.status(201).json(produto);
  }

  async deletar(req, res) {
  const { id } = req.params;

  await Product.findByIdAndDelete(id);

  res.json({
    message: 'Produto deletado com sucesso'
  });
  }
}

module.exports = new ProductController();