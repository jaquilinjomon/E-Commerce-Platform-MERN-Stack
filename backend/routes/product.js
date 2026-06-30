const express = require('express');
const router = express.Router();  
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// anyone can view products
router.get('/', async (req, res) => {
  try {
    const { sort } = req.query;

    let sortOption = {};
    if (sort === 'priceAsc') sortOption.price = 1;
    if (sort === 'priceDesc') sortOption.price = -1;
    if (sort === 'nameAsc') sortOption.name = 1;
    if (sort === 'nameDesc') sortOption.name = -1;

    const products = await Product.find().sort(sortOption);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// only logged-in users can add products
router.post('/', auth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// logged-in users can update products
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }  
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  only admins can delete products
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
