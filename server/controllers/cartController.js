const prisma = require("../prismaClient");
const { DEFAULT_USER_ID } = require("../config/constants");

const productInclude = {
  product: {
    include: { images: true },
  },
};

/** Returns the default user's cart with computed subtotal, totalAmount, and totalItems. */
async function getCart(req, res, next) {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: DEFAULT_USER_ID },
      include: productInclude,
    });

    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      items,
      subtotal,
      totalAmount: subtotal,
      totalItems,
    });
  } catch (err) {
    next(err);
  }
}

/** Adds a product to the cart or increments quantity if it already exists. */
async function addToCart(req, res, next) {
  try {
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ error: "productId must be a positive integer" });
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "quantity must be a positive integer" });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId: DEFAULT_USER_ID, productId },
      },
    });

    const newQty = (existing?.quantity ?? 0) + quantity;
    if (newQty > product.stock) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: { userId: DEFAULT_USER_ID, productId },
      },
      create: { userId: DEFAULT_USER_ID, productId, quantity },
      update: { quantity: { increment: quantity } },
      include: productInclude,
    });

    res.json(cartItem);
  } catch (err) {
    next(err);
  }
}

/** Updates the quantity of a cart item belonging to the default user. */
async function updateCartItem(req, res, next) {
  try {
    const itemId = Number(req.params.itemId);
    const quantity = Number(req.body.quantity);

    if (Number.isNaN(itemId)) {
      return res.status(400).json({ error: "Invalid cart item id" });
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "quantity must be a positive integer" });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: itemId, userId: DEFAULT_USER_ID },
      include: productInclude,
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (quantity > cartItem.product.stock) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: productInclude,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

/** Removes a cart item belonging to the default user. */
async function removeFromCart(req, res, next) {
  try {
    const itemId = Number(req.params.itemId);

    if (Number.isNaN(itemId)) {
      return res.status(400).json({ error: "Invalid cart item id" });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: itemId, userId: DEFAULT_USER_ID },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
