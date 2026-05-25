import Category from '../models/Category.js';

class CategoryController {
  async listar(req, res) {
    try {
      const categorias = await Category.find();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async criar(req, res) {
    try {
      const categoria = await Category.create(req.body);
      res.status(201).json(categoria);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new CategoryController();