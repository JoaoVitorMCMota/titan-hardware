import Cart from "../models/Cart.js";

export const buscarCarrinho = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const carrinho = await Cart.findOne({
      usuario: usuarioId
    })
      .populate("usuario")
      .populate("produtos.produto");

    if (!carrinho) {
      return res.status(200).json({
        usuario: usuarioId,
        produtos: []
      });
    }

    return res.status(200).json(carrinho);
  } catch (error) {
    return res.status(500).json({
      erro: error.message
    });
  }
};

export const criarOuObterCarrinho = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    let carrinho = await Cart.findOne({
      usuario: usuarioId
    })
      .populate("usuario")
      .populate("produtos.produto");

    if (!carrinho) {
      carrinho = await Cart.create({
        usuario: usuarioId,
        produtos: []
      });
      carrinho = await carrinho.populate("usuario");
    }

    return res.status(200).json(carrinho);
  } catch (error) {
    return res.status(500).json({
      erro: error.message
    });
  }
};

export const adicionarProduto = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { produtoId, quantidade } = req.body;

    if (!produtoId || !quantidade) {
      return res.status(400).json({
        erro: "produtoId e quantidade são obrigatórios"
      });
    }

    let carrinho = await Cart.findOne({
      usuario: usuarioId
    });

    if (!carrinho) {
      carrinho = await Cart.create({
        usuario: usuarioId,
        produtos: [{ produto: produtoId, quantidade }]
      });
    } else {
      const produtoExiste = carrinho.produtos.findIndex(
        (p) => p.produto.toString() === produtoId
      );

      if (produtoExiste !== -1) {
        carrinho.produtos[produtoExiste].quantidade += Number(quantidade);
      } else {
        carrinho.produtos.push({ produto: produtoId, quantidade });
      }
    }

    await carrinho.save();
    await carrinho.populate("usuario");
    await carrinho.populate("produtos.produto");

    return res.status(201).json(carrinho);
  } catch (error) {
    return res.status(500).json({
      erro: error.message
    });
  }
};

export const removerProduto = async (req, res) => {
  try {
    const { usuarioId, produtoId } = req.params;

    const carrinho = await Cart.findOne({
      usuario: usuarioId
    });

    if (!carrinho) {
      return res.status(404).json({
        mensagem: "Carrinho não encontrado"
      });
    }

    carrinho.produtos = carrinho.produtos.filter(
      (p) => p.produto.toString() !== produtoId
    );

    await carrinho.save();
    await carrinho.populate("usuario");
    await carrinho.populate("produtos.produto");

    return res.status(200).json(carrinho);
  } catch (error) {
    return res.status(500).json({
      erro: error.message
    });
  }
};

export const limparCarrinho = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const carrinho = await Cart.findOne({
      usuario: usuarioId
    });

    if (!carrinho) {
      return res.status(404).json({
        mensagem: "Carrinho não encontrado"
      });
    }

    carrinho.produtos = [];
    await carrinho.save();
    await carrinho.populate("usuario");

    return res.status(200).json(carrinho);
  } catch (error) {
    return res.status(500).json({
      erro: error.message
    });
  }
};