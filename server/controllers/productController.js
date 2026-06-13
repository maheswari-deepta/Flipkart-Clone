const prisma = require("../prismaClient");
const {
  productListInclude,
  productDetailInclude,
} = require("../config/productIncludes");

/** Returns products filtered by optional search, category, and limit query params. */
async function getProducts(req, res, next) {
  try {
    const { search, category, limit } = req.query;
    const and = [];

    if (search) {
      const term = String(search);
      and.push({
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { category: { name: { contains: term, mode: "insensitive" } } },
          { brand: { contains: term, mode: "insensitive" } },
          { sku: { contains: term, mode: "insensitive" } },
          { tags: { has: term.toLowerCase() } },
        ],
      });
    }

    if (category) {
      const categories = String(category)
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      if (categories.length === 1) {
        and.push({
          category: { name: { equals: categories[0], mode: "insensitive" } },
        });
      } else if (categories.length > 1) {
        and.push({
          OR: categories.map((name) => ({
            category: { name: { equals: name, mode: "insensitive" } },
          })),
        });
      }
    }

    const where = and.length > 0 ? { AND: and } : {};
    const take = limit ? Math.min(Math.max(Number(limit), 1), 50) : undefined;

    const products = await prisma.product.findMany({
      where,
      include: productListInclude,
      orderBy: { id: "asc" },
      ...(take ? { take } : {}),
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
}

/** Returns a single product by id with images, category, and reviews. */
async function getProductById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: productDetailInclude,
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
