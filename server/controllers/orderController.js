const prisma = require("../prismaClient");
const { DEFAULT_USER_ID } = require("../config/constants");
const { sendOrderConfirmationEmail } = require("../services/emailService");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SHIPPING_FIELDS = [
  "shippingName",
  "shippingPhone",
  "shippingAddress",
  "shippingCity",
  "shippingPincode",
];

const orderDetailInclude = {
  items: {
    include: {
      product: { include: { images: true } },
    },
  },
};

/** Places an order from the current cart inside a transaction. */
async function placeOrder(req, res, next) {
  try {
    for (const field of SHIPPING_FIELDS) {
      const value = req.body[field];
      if (!value || typeof value !== "string" || !value.trim()) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    const email =
      typeof req.body.email === "string" ? req.body.email.trim() : "";
    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "email must be a valid email address" });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: DEFAULT_USER_ID },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const outOfStock = cartItems
      .filter((item) => item.quantity > item.product.stock)
      .map((item) => item.product.name);

    if (outOfStock.length > 0) {
      return res.status(400).json({
        error: `Insufficient stock for: ${outOfStock.join(", ")}`,
      });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Atomic: order creation, stock decrement, and cart clear must all succeed
    // or roll back together to prevent overselling or orphaned cart state.
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: DEFAULT_USER_ID,
          totalAmount,
          email,
          status: "PLACED",
          shippingName: req.body.shippingName.trim(),
          shippingPhone: req.body.shippingPhone.trim(),
          shippingAddress: req.body.shippingAddress.trim(),
          shippingCity: req.body.shippingCity.trim(),
          shippingPincode: req.body.shippingPincode.trim(),
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtOrder: item.product.price,
            })),
          },
        },
      });

      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { userId: DEFAULT_USER_ID } });

      return tx.order.findUnique({
        where: { id: created.id },
        include: orderDetailInclude,
      });
    });

    res.status(201).json(order);
    sendOrderConfirmationEmail(order).catch((err) => {
      console.error("Order confirmation email failed:", err.message);
    });
  } catch (err) {
    next(err);
  }
}

/** Returns order history for the default user, newest first. */
async function getOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: { take: 1 },
              },
            },
          },
        },
      },
    });

    res.json(orders);
  } catch (err) {
    next(err);
  }
}

/** Returns a single order with full product details. */
async function getOrderById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid order id" });
    }

    const order = await prisma.order.findFirst({
      where: { id, userId: DEFAULT_USER_ID },
      include: orderDetailInclude,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = { placeOrder, getOrders, getOrderById };
