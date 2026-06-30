const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 5 } }]);
    console.log("Recommendations returned:", products);

    res.json(products);
  } catch (err) {
    console.error("Error in recommendations route:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
