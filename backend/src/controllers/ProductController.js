import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      const dadosAtualizacao = { ...req.body };

      // Se houver arquivo, adiciona a imagem aos dados
      if (req.file) {
        dadosAtualizacao.imagem = `/upload/${req.file.filename}`;
      }

      const produtoAtualizado = await Product.findByIdAndUpdate(
        id,
        dadosAtualizacao,
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
      const dadosProduto = { ...req.body };

      // Se houver arquivo, adiciona a imagem
      if (req.file) {
        dadosProduto.imagem = `/upload/${req.file.filename}`;
      }

      const produto = await Product.create(dadosProduto);
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

      // Deletar arquivo de imagem se existir
      if (produto.imagem) {
        const caminhoImagem = path.join(__dirname, '../../upload', path.basename(produto.imagem));
        if (fs.existsSync(caminhoImagem)) {
          fs.unlinkSync(caminhoImagem);
        }
      }

      res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async uploadImagem(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      const { id } = req.params;
      const produto = await Product.findById(id);

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Deletar imagem antiga se existir
      if (produto.imagem) {
        const caminhoImagemAntiga = path.join(__dirname, '../../upload', path.basename(produto.imagem));
        if (fs.existsSync(caminhoImagemAntiga)) {
          fs.unlinkSync(caminhoImagemAntiga);
        }
      }

      // Atualizar produto com nova imagem
      produto.imagem = `/upload/${req.file.filename}`;
      await produto.save();

      res.json({
        message: 'Imagem enviada com sucesso',
        imagem: produto.imagem
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new ProductController();