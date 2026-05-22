const Category = require('../models/Category');

class CategoryController {
  async listar(req, res) {
    const categorias = await Category.find();

    res.json(categorias);
  }

  async criar(req, res) {
    const categoria = await Category.create(req.body);

    res.status(201).json(categoria);
  }
}

module.exports = new CategoryController();