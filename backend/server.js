const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const app = express();
app.use(express.json());
app.use(cors());

//print env variables
console.log("Loaded ENV variables:");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("STRIPE_SECRET:", process.env.STRIPE_SECRET);

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const recommendationsRoute = require('./routes/recommendations');
app.use('/api/recommendations', recommendationsRoute);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err.message));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
