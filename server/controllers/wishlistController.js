const prisma = require("../prismaClient");
const { DEFAULT_USER_ID } = require("../config/constants");

const productInclude = {
  images: true,
  category: true,
};

/** Returns wishlisted products for the default user. */
async function getWishlist(req, res, next) {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: DEFAULT_USER_ID },
      include: { product: { include: productInclude } },
      orderBy: { createdAt: "desc" },
    });

    res.json(items.map((item) => item.product));
  } catch (err) {
    next(err);
  }
}

/** Adds a product to the wishlist (idempotent). */
async function addToWishlist(req, res, next) {
  try {
    const productId = Number(req.body.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ error: "productId must be a positive integer" });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId: DEFAULT_USER_ID, productId },
      },
    });

    if (!existing) {
      await prisma.wishlistItem.create({
        data: { userId: DEFAULT_USER_ID, productId },
      });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

/** Removes a product from the wishlist. */
async function removeFromWishlist(req, res, next) {
  try {
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ error: "productId must be a positive integer" });
    }

    const item = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId: DEFAULT_USER_ID, productId },
      },
    });

    if (!item) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }

    await prisma.wishlistItem.delete({
      where: { id: item.id },
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
