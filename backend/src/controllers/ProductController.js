import Product from '../models/Product.js';

class ProductController {
  async listar(req, res) {
    try {
      const { nome } = req.query;
      const filtro = nome?.trim()
        ? {
            $or: [
              { nome: { $regex: nome.trim(), $options: 'i' } },
              { marca: { $regex: nome.trim(), $options: 'i' } },
              { descricao: { $regex: nome.trim(), $options: 'i' } }
            ]
          }
        : {};

      const produtos = await Product.find(filtro);
      res.json(produtos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const produto = await Product.findById(id);
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.json(produto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const produtoAtualizado = await Product.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      if (!produtoAtualizado) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.json(produtoAtualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async criar(req, res) {
    try {
      const produto = await Product.create(req.body);
      res.status(201).json(produto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const produto = await Product.findByIdAndDelete(id);
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ProductController();