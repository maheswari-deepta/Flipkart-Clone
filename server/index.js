require("dotenv").config();
const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// CORS: restrict to frontend origin in production via env var
const allowedOrigin = process.env.CLIENT_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Flipkart Clone API running" });
});

// Centralized error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});