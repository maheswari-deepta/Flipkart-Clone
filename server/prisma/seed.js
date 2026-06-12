const prisma = require("../prismaClient");

async function main() {
  // Clear transactional data so re-seeding is idempotent
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  // Default user (no-auth assumption)
  const user = await prisma.user.upsert({
    where: { email: "default@flipkartclone.com" },
    update: {},
    create: { name: "Default User", email: "default@flipkartclone.com" },
  });

  // Categories
  const categoryNames = ["Electronics", "Fashion", "Home & Kitchen", "Books"];
  const categories = {};
  for (const name of categoryNames) {
    categories[name] = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Products
  const products = [
    {
      name: "Wireless Bluetooth Headphones",
      description: "Over-ear wireless headphones with 30-hour battery life, active noise cancellation, and deep bass.",
      price: 1999,
      mrp: 3999,
      stock: 50,
      rating: 4.3,
      brand: "SoundCore",
      category: "Electronics",
      images: [
        "https://picsum.photos/seed/headphones1/600/600",
        "https://picsum.photos/seed/headphones2/600/600",
        "https://picsum.photos/seed/headphones3/600/600",
      ],
    },
    {
      name: "Smartwatch Pro Series",
      description: "Fitness tracking smartwatch with heart rate monitor, SpO2, and 7-day battery life.",
      price: 3499,
      mrp: 5999,
      stock: 30,
      rating: 4.1,
      brand: "FitTrack",
      category: "Electronics",
      images: [
        "https://picsum.photos/seed/watch1/600/600",
        "https://picsum.photos/seed/watch2/600/600",
      ],
    },
    {
      name: "27-inch 4K Monitor",
      description: "Ultra HD 4K monitor with HDR support, 144Hz refresh rate, and slim bezel design.",
      price: 24999,
      mrp: 32999,
      stock: 15,
      rating: 4.6,
      brand: "ViewMax",
      category: "Electronics",
      images: [
        "https://picsum.photos/seed/monitor1/600/600",
        "https://picsum.photos/seed/monitor2/600/600",
      ],
    },
    {
      name: "Mechanical Gaming Keyboard",
      description: "RGB backlit mechanical keyboard with blue switches and durable aluminum frame.",
      price: 2799,
      mrp: 4499,
      stock: 40,
      rating: 4.4,
      brand: "KeyForge",
      category: "Electronics",
      images: [
        "https://picsum.photos/seed/keyboard1/600/600",
        "https://picsum.photos/seed/keyboard2/600/600",
      ],
    },
    {
      name: "Men's Casual Cotton Shirt",
      description: "Slim-fit casual shirt made from 100% breathable cotton. Available in multiple colors.",
      price: 799,
      mrp: 1499,
      stock: 100,
      rating: 4.0,
      brand: "UrbanFit",
      category: "Fashion",
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "White", token: "background" },
        { name: "Navy", token: "primary" },
        { name: "Black", token: "foreground" },
      ],
      images: [
        "https://picsum.photos/seed/shirt1/600/600",
        "https://picsum.photos/seed/shirt2/600/600",
      ],
    },
    {
      name: "Women's Running Shoes",
      description: "Lightweight running shoes with breathable mesh upper and cushioned sole.",
      price: 1599,
      mrp: 2999,
      stock: 60,
      rating: 4.5,
      brand: "StrideX",
      category: "Fashion",
      sizes: ["6", "7", "8", "9"],
      colors: [
        { name: "Pink", token: "accent" },
        { name: "Grey", token: "muted" },
      ],
      images: [
        "https://picsum.photos/seed/shoes1/600/600",
        "https://picsum.photos/seed/shoes2/600/600",
      ],
    },
    {
      name: "Denim Jacket",
      description: "Classic blue denim jacket with button closure and chest pockets.",
      price: 1299,
      mrp: 2499,
      stock: 45,
      rating: 4.2,
      brand: "UrbanFit",
      category: "Fashion",
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Blue", token: "primary" },
        { name: "Black", token: "foreground" },
      ],
      images: [
        "https://picsum.photos/seed/jacket1/600/600",
        "https://picsum.photos/seed/jacket2/600/600",
      ],
    },
    {
      name: "Leather Wallet",
      description: "Genuine leather bi-fold wallet with multiple card slots and coin pocket.",
      price: 499,
      mrp: 999,
      stock: 80,
      rating: 4.3,
      brand: "ClassicHide",
      category: "Fashion",
      sizes: [],
      colors: [
        { name: "Brown", token: "accent" },
        { name: "Black", token: "foreground" },
      ],
      images: [
        "https://picsum.photos/seed/wallet1/600/600",
        "https://picsum.photos/seed/wallet2/600/600",
      ],
    },
    {
      name: "Non-Stick Cookware Set (5 Pieces)",
      description: "5-piece non-stick cookware set including frying pan, kadai, and tawa with lids.",
      price: 2199,
      mrp: 3999,
      stock: 25,
      rating: 4.4,
      brand: "HomeChef",
      category: "Home & Kitchen",
      images: [
        "https://picsum.photos/seed/cookware1/600/600",
        "https://picsum.photos/seed/cookware2/600/600",
      ],
    },
    {
      name: "LED Table Lamp",
      description: "Adjustable LED desk lamp with touch control and 3 brightness modes.",
      price: 699,
      mrp: 1299,
      stock: 70,
      rating: 4.1,
      brand: "GlowTech",
      category: "Home & Kitchen",
      images: [
        "https://picsum.photos/seed/lamp1/600/600",
        "https://picsum.photos/seed/lamp2/600/600",
      ],
    },
    {
      name: "Memory Foam Pillow (Set of 2)",
      description: "Orthopedic memory foam pillows with cooling gel layer and washable cover.",
      price: 1099,
      mrp: 1999,
      stock: 55,
      rating: 4.5,
      brand: "SleepWell",
      category: "Home & Kitchen",
      images: [
        "https://picsum.photos/seed/pillow1/600/600",
        "https://picsum.photos/seed/pillow2/600/600",
      ],
    },
    {
      name: "Electric Kettle 1.5L",
      description: "Stainless steel electric kettle with auto shut-off and boil-dry protection.",
      price: 899,
      mrp: 1599,
      stock: 65,
      rating: 4.2,
      brand: "HomeChef",
      category: "Home & Kitchen",
      images: [
        "https://picsum.photos/seed/kettle1/600/600",
        "https://picsum.photos/seed/kettle2/600/600",
      ],
    },
    {
      name: "Atomic Habits",
      description: "A practical guide to building good habits and breaking bad ones, by James Clear.",
      price: 399,
      mrp: 599,
      stock: 120,
      rating: 4.8,
      brand: "Penguin",
      category: "Books",
      images: [
        "https://picsum.photos/seed/book1/600/600",
        "https://picsum.photos/seed/book2/600/600",
      ],
    },
    {
      name: "The Pragmatic Programmer",
      description: "A classic guide for software developers covering best practices and craftsmanship.",
      price: 549,
      mrp: 899,
      stock: 40,
      rating: 4.7,
      brand: "Addison-Wesley",
      category: "Books",
      images: [
        "https://picsum.photos/seed/book3/600/600",
        "https://picsum.photos/seed/book4/600/600",
      ],
    },
    {
      name: "Rich Dad Poor Dad",
      description: "Personal finance classic that challenges conventional wisdom about money and investing.",
      price: 299,
      mrp: 499,
      stock: 90,
      rating: 4.6,
      brand: "Plata Publishing",
      category: "Books",
      images: [
        "https://picsum.photos/seed/book5/600/600",
        "https://picsum.photos/seed/book6/600/600",
      ],
    },
  ];

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        mrp: p.mrp,
        stock: p.stock,
        rating: p.rating,
        brand: p.brand,
        sizes: p.sizes ?? [],
        colors: p.colors ?? [],
        categoryId: categories[p.category].id,
        images: {
          create: p.images.map((url) => ({ url })),
        },
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log("Seeding complete. Default user id:", user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });