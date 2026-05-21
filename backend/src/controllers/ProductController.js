class ProductController {
  listar(req, res) {
    res.json([
      {
        id: 1,
        nome: 'RTX 5070'
      },
      {
        id: 2,
        nome: 'Ryzen 7'
      }
    ]);
  }
}

module.exports = new ProductController();