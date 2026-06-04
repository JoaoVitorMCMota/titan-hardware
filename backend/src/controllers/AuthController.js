import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

class AuthController {

  async register(req, res) {
    try {
      const { nome, email, senha } = req.body;

      const usuarioExiste = await User.findOne({ email });

      if (usuarioExiste) {
        return res.status(400).json({
          error: 'Já existe uma conta vinculada a esse Email'
        });
      }

      const senhaHash = await bcrypt.hash(senha, 8);

      const usuario = await User.create({
        nome,
        email,
        senha: senhaHash,
        role: 'usuario'
      });

      // Remove a senha do retorno por segurança
      usuario.senha = undefined;

      res.status(201).json(usuario);

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await User.findOne({ email });

      if (!usuario) {
        return res.status(400).json({
          error: 'Usuário não encontrado'
        });
      }

      const senhaCorreta =
        await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        return res.status(400).json({
          error: 'Senha incorreta'
        });
      }

      const token = jwt.sign(
        {
          id: usuario._id,
          role: usuario.role
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d'
        }
      );

      res.json({
        usuario,
        token
      });

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
}

export default new AuthController();