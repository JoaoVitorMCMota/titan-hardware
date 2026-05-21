const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
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
});

module.exports = router;