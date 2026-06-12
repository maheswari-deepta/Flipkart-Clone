const prisma = require("../prismaClient");

/** Returns products filtered by optional search and category query params. */
async function getProducts(req, res, next) {
  try {
    const { search, category } = req.query;

    const where = {};

    if (search) {
      where.name = { contains: String(search), mode: "insensitive" };
    }

    if (category) {
      where.category = { name: { equals: String(category), mode: "insensitive" } };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true,
      },
      orderBy: { id: "asc" },
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
}

/** Returns a single product by id with images and category. */
async function getProductById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
}

module.exports = { getProducts, getProductById };