import User from '../models/User.js';
import bcrypt from 'bcryptjs';

class UserController {
  async listar(req, res) {
    try {
      // .select('-senha') impede que o hash da senha vaze na listagem
      const usuarios = await User.find().select('-senha');
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await User.findById(id).select('-senha');
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha, role } = req.body;

      const dadosAtualizados = { nome, email, role };

      // Se o usuário digitou uma nova senha no update, precisamos criptografá-la
      if (senha) {
        dadosAtualizados.senha = await bcrypt.hash(senha, 8);
      }

      const usuarioAtualizado = await User.findByIdAndUpdate(
        id,
        dadosAtualizados,
        { new: true }
      ).select('-senha');

      if (!usuarioAtualizado) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.json(usuarioAtualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const usuario = await User.findByIdAndDelete(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new UserController();