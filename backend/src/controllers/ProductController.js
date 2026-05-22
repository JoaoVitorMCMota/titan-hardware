const Product = require('../models/Product');

class ProductController {
  async listar(req, res) {
    const produtos = await Product.find();

    res.json(produtos);
  }

  async criar(req, res) {
    const produto = await Product.create(req.body);

    res.status(201).json(produto);
  }
}

module.exports = new ProductController();