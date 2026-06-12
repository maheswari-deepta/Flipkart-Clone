const nodemailer = require("nodemailer");

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !user || !pass || !from) {
    return null;
  }

  return { host, port, user, pass, from };
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildOrderEmailContent(order) {
  const orderDate = new Date(order.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const itemsText = order.items
    .map(
      (item) =>
        `- ${item.product.name} x ${item.quantity} @ ${formatCurrency(item.priceAtOrder)}`
    )
    .join("\n");

  const itemsHtml = order.items
    .map(
      (item) =>
        `<li>${item.product.name} &times; ${item.quantity} @ ${formatCurrency(item.priceAtOrder)}</li>`
    )
    .join("");

  const shippingBlock = [
    order.shippingName,
    order.shippingPhone,
    order.shippingAddress,
    `${order.shippingCity} - ${order.shippingPincode}`,
  ].join("\n");

  const text = [
    `Thank you for your order!`,
    ``,
    `Order ID: #${order.id}`,
    `Order Date: ${orderDate}`,
    ``,
    `Items:`,
    itemsText,
    ``,
    `Total Amount: ${formatCurrency(order.totalAmount)}`,
    ``,
    `Shipping Address:`,
    shippingBlock,
  ].join("\n");

  const html = `
    <h2>Order Confirmation - Order #${order.id}</h2>
    <p>Thank you for your order!</p>
    <p><strong>Order Date:</strong> ${orderDate}</p>
    <h3>Items</h3>
    <ul>${itemsHtml}</ul>
    <p><strong>Total Amount:</strong> ${formatCurrency(order.totalAmount)}</p>
    <h3>Shipping Address</h3>
    <p>
      ${order.shippingName}<br/>
      ${order.shippingPhone}<br/>
      ${order.shippingAddress}<br/>
      ${order.shippingCity} - ${order.shippingPincode}
    </p>
  `;

  const subject = `Order Confirmation - Order #${order.id}`;

  return { subject, text, html };
}

/** Sends order confirmation email. Never throws — logs errors internally. */
async function sendOrderConfirmationEmail(order) {
  if (!order.email) {
    console.error("Order confirmation email skipped: no recipient email");
    return;
  }

  const config = getSmtpConfig();

  if (!config) {
    console.error(
      "Order confirmation email skipped: SMTP env vars not configured"
    );
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    const { subject, text, html } = buildOrderEmailContent(order);

    await transporter.sendMail({
      from: config.from,
      to: order.email,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("Order confirmation email failed:", err.message);
  }
}

module.exports = { sendOrderConfirmationEmail };
