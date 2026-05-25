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

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const categoria = await Category.findById(id);

      if (!categoria) {
        return res.status(404).json({
          error: 'Categoria não encontrada'
        });
      }

      res.json(categoria);
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

  async atualizar(req, res) {
    try {
      const { id } = req.params;

      const categoriaAtualizada =
        await Category.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
        );

      if (!categoriaAtualizada) {
        return res.status(404).json({
          error: 'Categoria não encontrada'
        });
      }

      res.json(categoriaAtualizada);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;

      const categoria =
        await Category.findByIdAndDelete(id);

      if (!categoria) {
        return res.status(404).json({
          error: 'Categoria não encontrada'
        });
      }

      res.json({
        message: 'Categoria deletada com sucesso'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CategoryController();