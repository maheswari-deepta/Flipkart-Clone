const prisma = require("../prismaClient");

async function main() {
  // Clear transactional data so re-seeding is idempotent
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  // Default user (no-auth assumption)
  const user = await prisma.user.upsert({
    where: { email: "default@flipkartclone.com" },
    update: {},
    create: { name: "Default User", email: "default@flipkartclone.com" },
  });

  // Categories
  const categoryNames = [
    'Beauty',
    'Fragrances',
    'Furniture',
    'Groceries'
  ];
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
      name: 'Essence Mascara Lash Princess',
      description: 'The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.',
      price: 829,
      mrp: 926,
      stock: 99,
      rating: 2.56,
      brand: 'Essence',
      sku: 'BEA-ESS-ESS-001',
      weight: 4,
      width: 15.14,
      height: 13.08,
      depth: 22.99,
      warranty: '1 week warranty',
      shippingInfo: 'Ships in 3-5 business days',
      availability: 'In Stock',
      returnPolicy: 'No return policy',
      minOrderQty: 1,
      tags: [
        'beauty',
        'mascara'
      ],
      sizes: [],
      colors: [],
      category: 'Beauty',
      images: [
        'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp'
      ],
      reviews: [
        {
          rating: 3,
          comment: 'Would not recommend!',
          reviewerName: 'Eleanor Collins',
          reviewerEmail: 'eleanor.collins@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Very satisfied!',
          reviewerName: 'Lucas Gordon',
          reviewerEmail: 'lucas.gordon@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Highly impressed!',
          reviewerName: 'Eleanor Collins',
          reviewerEmail: 'eleanor.collins@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Eyeshadow Palette with Mirror',
      description: 'The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it\'s convenient for on-the-go makeup application.',
      price: 1659,
      mrp: 2028,
      stock: 34,
      rating: 2.86,
      brand: 'Glamour Beauty',
      sku: 'BEA-GLA-EYE-002',
      weight: 9,
      width: 9.26,
      height: 22.47,
      depth: 27.67,
      warranty: '1 year warranty',
      shippingInfo: 'Ships in 2 weeks',
      availability: 'In Stock',
      returnPolicy: '7 days return policy',
      minOrderQty: 2,
      tags: [
        'beauty',
        'eyeshadow'
      ],
      sizes: [],
      colors: [],
      category: 'Beauty',
      images: [
        'https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/1.webp'
      ],
      reviews: [
        {
          rating: 5,
          comment: 'Great product!',
          reviewerName: 'Savannah Gomez',
          reviewerEmail: 'savannah.gomez@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Awesome product!',
          reviewerName: 'Christian Perez',
          reviewerEmail: 'christian.perez@x.dummyjson.com',
        },
        {
          rating: 1,
          comment: 'Poor quality!',
          reviewerName: 'Nicholas Bailey',
          reviewerEmail: 'nicholas.bailey@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Powder Canister',
      description: 'The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.',
      price: 1244,
      mrp: 1380,
      stock: 89,
      rating: 4.64,
      brand: 'Velvet Touch',
      sku: 'BEA-VEL-POW-003',
      weight: 8,
      width: 29.27,
      height: 27.93,
      depth: 20.59,
      warranty: '3 months warranty',
      shippingInfo: 'Ships in 1-2 business days',
      availability: 'In Stock',
      returnPolicy: 'No return policy',
      minOrderQty: 1,
      tags: [
        'beauty',
        'face powder'
      ],
      sizes: [],
      colors: [],
      category: 'Beauty',
      images: [
        'https://cdn.dummyjson.com/product-images/beauty/powder-canister/1.webp'
      ],
      reviews: [
        {
          rating: 4,
          comment: 'Would buy again!',
          reviewerName: 'Alexander Jones',
          reviewerEmail: 'alexander.jones@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Highly impressed!',
          reviewerName: 'Elijah Cruz',
          reviewerEmail: 'elijah.cruz@x.dummyjson.com',
        },
        {
          rating: 1,
          comment: 'Very dissatisfied!',
          reviewerName: 'Avery Perez',
          reviewerEmail: 'avery.perez@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Red Lipstick',
      description: 'The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.',
      price: 1078,
      mrp: 1227,
      stock: 91,
      rating: 4.36,
      brand: 'Chic Cosmetics',
      sku: 'BEA-CHI-LIP-004',
      weight: 1,
      width: 18.11,
      height: 28.38,
      depth: 22.17,
      warranty: '3 year warranty',
      shippingInfo: 'Ships in 1 week',
      availability: 'In Stock',
      returnPolicy: '7 days return policy',
      minOrderQty: 2,
      tags: [
        'beauty',
        'lipstick'
      ],
      sizes: [],
      colors: [],
      category: 'Beauty',
      images: [
        'https://cdn.dummyjson.com/product-images/beauty/red-lipstick/1.webp'
      ],
      reviews: [
        {
          rating: 4,
          comment: 'Great product!',
          reviewerName: 'Liam Garcia',
          reviewerEmail: 'liam.garcia@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Great product!',
          reviewerName: 'Ruby Andrews',
          reviewerEmail: 'ruby.andrews@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Would buy again!',
          reviewerName: 'Clara Berry',
          reviewerEmail: 'clara.berry@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Red Nail Polish',
      description: 'The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.',
      price: 746,
      mrp: 843,
      stock: 79,
      rating: 4.32,
      brand: 'Nail Couture',
      sku: 'BEA-NAI-NAI-005',
      weight: 8,
      width: 21.63,
      height: 16.48,
      depth: 29.84,
      warranty: '1 month warranty',
      shippingInfo: 'Ships overnight',
      availability: 'In Stock',
      returnPolicy: 'No return policy',
      minOrderQty: 1,
      tags: [
        'beauty',
        'nail polish'
      ],
      sizes: [],
      colors: [],
      category: 'Beauty',
      images: [
        'https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/1.webp'
      ],
      reviews: [
        {
          rating: 2,
          comment: 'Poor quality!',
          reviewerName: 'Benjamin Wilson',
          reviewerEmail: 'benjamin.wilson@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Great product!',
          reviewerName: 'Liam Smith',
          reviewerEmail: 'liam.smith@x.dummyjson.com',
        },
        {
          rating: 1,
          comment: 'Very unhappy with my purchase!',
          reviewerName: 'Clara Berry',
          reviewerEmail: 'clara.berry@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Calvin Klein CK One',
      description: 'CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It\'s a versatile fragrance suitable for everyday wear.',
      price: 4149,
      mrp: 4229,
      stock: 29,
      rating: 4.37,
      brand: 'Calvin Klein',
      sku: 'FRA-CAL-CAL-006',
      weight: 7,
      width: 29.36,
      height: 27.76,
      depth: 20.72,
      warranty: '1 week warranty',
      shippingInfo: 'Ships overnight',
      availability: 'In Stock',
      returnPolicy: '90 days return policy',
      minOrderQty: 2,
      tags: [
        'fragrances',
        'perfumes'
      ],
      sizes: [],
      colors: [],
      category: 'Fragrances',
      images: [
        'https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/1.webp',
        'https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/2.webp',
        'https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/3.webp'
      ],
      reviews: [
        {
          rating: 2,
          comment: 'Very disappointed!',
          reviewerName: 'Layla Young',
          reviewerEmail: 'layla.young@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Fast shipping!',
          reviewerName: 'Daniel Cook',
          reviewerEmail: 'daniel.cook@x.dummyjson.com',
        },
        {
          rating: 3,
          comment: 'Not as described!',
          reviewerName: 'Jacob Cooper',
          reviewerEmail: 'jacob.cooper@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Chanel Coco Noir Eau De',
      description: 'Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.',
      price: 10789,
      mrp: 12923,
      stock: 58,
      rating: 4.26,
      brand: 'Chanel',
      sku: 'FRA-CHA-CHA-007',
      weight: 7,
      width: 24.5,
      height: 25.7,
      depth: 25.98,
      warranty: '3 year warranty',
      shippingInfo: 'Ships overnight',
      availability: 'In Stock',
      returnPolicy: 'No return policy',
      minOrderQty: 1,
      tags: [
        'fragrances',
        'perfumes'
      ],
      sizes: [],
      colors: [],
      category: 'Fragrances',
      images: [
        'https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/1.webp',
        'https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/2.webp',
        'https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/3.webp'
      ],
      reviews: [
        {
          rating: 4,
          comment: 'Highly impressed!',
          reviewerName: 'Ruby Andrews',
          reviewerEmail: 'ruby.andrews@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Awesome product!',
          reviewerName: 'Leah Henderson',
          reviewerEmail: 'leah.henderson@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Very happy with my purchase!',
          reviewerName: 'Xavier Wright',
          reviewerEmail: 'xavier.wright@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Dior J\'adore',
      description: 'J\'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.',
      price: 7469,
      mrp: 8758,
      stock: 98,
      rating: 3.8,
      brand: 'Dior',
      sku: 'FRA-DIO-DIO-008',
      weight: 4,
      width: 27.67,
      height: 28.28,
      depth: 11.83,
      warranty: '1 week warranty',
      shippingInfo: 'Ships in 2 weeks',
      availability: 'In Stock',
      returnPolicy: '7 days return policy',
      minOrderQty: 2,
      tags: [
        'fragrances',
        'perfumes'
      ],
      sizes: [],
      colors: [],
      category: 'Fragrances',
      images: [
        'https://cdn.dummyjson.com/product-images/fragrances/dior-j\'adore/1.webp',
        'https://cdn.dummyjson.com/product-images/fragrances/dior-j\'adore/2.webp',
        'https://cdn.dummyjson.com/product-images/fragrances/dior-j\'adore/3.webp'
      ],
      reviews: [
        {
          rating: 5,
          comment: 'Great value for money!',
          reviewerName: 'Nicholas Bailey',
          reviewerEmail: 'nicholas.bailey@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Great value for money!',
          reviewerName: 'Penelope Harper',
          reviewerEmail: 'penelope.harper@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Great product!',
          reviewerName: 'Emma Miller',
          reviewerEmail: 'emma.miller@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Dolce Shine Eau de',
      description: 'Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods. It\'s a joyful and youthful scent.',
      price: 5809,
      mrp: 5845,
      stock: 4,
      rating: 3.96,
      brand: 'Dolce & Gabbana',
      sku: 'FRA-DOL-DOL-009',
      weight: 6,
      width: 27.28,
      height: 29.88,
      depth: 18.3,
      warranty: '3 year warranty',
      shippingInfo: 'Ships in 1 month',
      availability: 'Low Stock',
      returnPolicy: '7 days return policy',
      minOrderQty: 1,
      tags: [
        'fragrances',
        'perfumes'
      ],
      sizes: [],
      colors: [],
      category: 'Fragrances',
      images: [
        'https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/1.webp',
        'https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/2.webp',
        'https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/3.webp'
      ],
      reviews: [
        {
          rating: 4,
          comment: 'Would buy again!',
          reviewerName: 'Mateo Bennett',
          reviewerEmail: 'mateo.bennett@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Highly recommended!',
          reviewerName: 'Nolan Gonzalez',
          reviewerEmail: 'nolan.gonzalez@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Very happy with my purchase!',
          reviewerName: 'Aurora Lawson',
          reviewerEmail: 'aurora.lawson@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Gucci Bloom Eau de',
      description: 'Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It\'s a modern and romantic scent.',
      price: 6639,
      mrp: 7755,
      stock: 91,
      rating: 2.74,
      brand: 'Gucci',
      sku: 'FRA-GUC-GUC-010',
      weight: 7,
      width: 20.92,
      height: 21.68,
      depth: 11.2,
      warranty: '6 months warranty',
      shippingInfo: 'Ships overnight',
      availability: 'In Stock',
      returnPolicy: 'No return policy',
      minOrderQty: 2,
      tags: [
        'fragrances',
        'perfumes'
      ],
      sizes: [],
      colors: [],
      category: 'Fragrances',
      images: [
        'https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/1.webp',
        'https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/2.webp',
        'https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/3.webp'
      ],
      reviews: [
        {
          rating: 1,
          comment: 'Very dissatisfied!',
          reviewerName: 'Cameron Perez',
          reviewerEmail: 'cameron.perez@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Very happy with my purchase!',
          reviewerName: 'Daniel Cook',
          reviewerEmail: 'daniel.cook@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Highly impressed!',
          reviewerName: 'Addison Wright',
          reviewerEmail: 'addison.wright@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Annibale Colombo Bed',
      description: 'The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.',
      price: 157699,
      mrp: 172481,
      stock: 88,
      rating: 4.77,
      brand: 'Annibale Colombo',
      sku: 'FUR-ANN-ANN-011',
      weight: 10,
      width: 28.16,
      height: 25.36,
      depth: 17.28,
      warranty: '1 year warranty',
      shippingInfo: 'Ships in 1 month',
      availability: 'In Stock',
      returnPolicy: 'No return policy',
      minOrderQty: 1,
      tags: [
        'furniture',
        'beds'
      ],
      sizes: [],
      colors: [],
      category: 'Furniture',
      images: [
        'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/1.webp',
        'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/2.webp',
        'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/3.webp'
      ],
      reviews: [
        {
          rating: 2,
          comment: 'Would not recommend!',
          reviewerName: 'Christopher West',
          reviewerEmail: 'christopher.west@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Highly impressed!',
          reviewerName: 'Vivian Carter',
          reviewerEmail: 'vivian.carter@x.dummyjson.com',
        },
        {
          rating: 1,
          comment: 'Poor quality!',
          reviewerName: 'Mason Wright',
          reviewerEmail: 'mason.wright@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Annibale Colombo Sofa',
      description: 'The Annibale Colombo Sofa is a sophisticated and comfortable seating option, featuring exquisite design and premium upholstery for your living room.',
      price: 207499,
      mrp: 242406,
      stock: 60,
      rating: 3.92,
      brand: 'Annibale Colombo',
      sku: 'FUR-ANN-ANN-012',
      weight: 6,
      width: 12.75,
      height: 20.55,
      depth: 19.06,
      warranty: 'Lifetime warranty',
      shippingInfo: 'Ships in 1 week',
      availability: 'In Stock',
      returnPolicy: '7 days return policy',
      minOrderQty: 2,
      tags: [
        'furniture',
        'sofas'
      ],
      sizes: [],
      colors: [],
      category: 'Furniture',
      images: [
        'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/1.webp',
        'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/2.webp',
        'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/3.webp'
      ],
      reviews: [
        {
          rating: 3,
          comment: 'Very unhappy with my purchase!',
          reviewerName: 'Christian Perez',
          reviewerEmail: 'christian.perez@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Fast shipping!',
          reviewerName: 'Lillian Bishop',
          reviewerEmail: 'lillian.bishop@x.dummyjson.com',
        },
        {
          rating: 1,
          comment: 'Poor quality!',
          reviewerName: 'Lillian Simmons',
          reviewerEmail: 'lillian.simmons@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Bedside Table African Cherry',
      description: 'The Bedside Table in African Cherry is a stylish and functional addition to your bedroom, providing convenient storage space and a touch of elegance.',
      price: 24899,
      mrp: 30774,
      stock: 64,
      rating: 2.87,
      brand: 'Furniture Co.',
      sku: 'FUR-FUR-BED-013',
      weight: 2,
      width: 13.47,
      height: 24.99,
      depth: 27.35,
      warranty: '5 year warranty',
      shippingInfo: 'Ships overnight',
      availability: 'In Stock',
      returnPolicy: '7 days return policy',
      minOrderQty: 1,
      tags: [
        'furniture',
        'bedside tables'
      ],
      sizes: [],
      colors: [],
      category: 'Furniture',
      images: [
        'https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/1.webp',
        'https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/2.webp',
        'https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/3.webp'
      ],
      reviews: [
        {
          rating: 4,
          comment: 'Excellent quality!',
          reviewerName: 'Aaliyah Hanson',
          reviewerEmail: 'aaliyah.hanson@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Excellent quality!',
          reviewerName: 'Liam Smith',
          reviewerEmail: 'liam.smith@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Highly recommended!',
          reviewerName: 'Avery Barnes',
          reviewerEmail: 'avery.barnes@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Knoll Saarinen Executive Conference Chair',
      description: 'The Knoll Saarinen Executive Conference Chair is a modern and ergonomic chair, perfect for your office or conference room with its timeless design.',
      price: 41499,
      mrp: 42350,
      stock: 26,
      rating: 4.88,
      brand: 'Knoll',
      sku: 'FUR-KNO-KNO-014',
      weight: 10,
      width: 13.81,
      height: 7.5,
      depth: 5.62,
      warranty: '2 year warranty',
      shippingInfo: 'Ships overnight',
      availability: 'In Stock',
      returnPolicy: '60 days return policy',
      minOrderQty: 2,
      tags: [
        'furniture',
        'office chairs'
      ],
      sizes: [],
      colors: [],
      category: 'Furniture',
      images: [
        'https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/1.webp',
        'https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/2.webp',
        'https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/3.webp'
      ],
      reviews: [
        {
          rating: 2,
          comment: 'Waste of money!',
          reviewerName: 'Ella Cook',
          reviewerEmail: 'ella.cook@x.dummyjson.com',
        },
        {
          rating: 2,
          comment: 'Very dissatisfied!',
          reviewerName: 'Clara Berry',
          reviewerEmail: 'clara.berry@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Would buy again!',
          reviewerName: 'Elena Long',
          reviewerEmail: 'elena.long@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Wooden Bathroom Sink With Mirror',
      description: 'The Wooden Bathroom Sink with Mirror is a unique and stylish addition to your bathroom, featuring a wooden sink countertop and a matching mirror.',
      price: 66399,
      mrp: 72806,
      stock: 7,
      rating: 3.59,
      brand: 'Bath Trends',
      sku: 'FUR-BAT-WOO-015',
      weight: 10,
      width: 7.98,
      height: 8.88,
      depth: 28.46,
      warranty: '3 year warranty',
      shippingInfo: 'Ships in 3-5 business days',
      availability: 'Low Stock',
      returnPolicy: '60 days return policy',
      minOrderQty: 1,
      tags: [
        'furniture',
        'bathroom'
      ],
      sizes: [],
      colors: [],
      category: 'Furniture',
      images: [
        'https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/1.webp',
        'https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/2.webp',
        'https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/3.webp'
      ],
      reviews: [
        {
          rating: 4,
          comment: 'Fast shipping!',
          reviewerName: 'Logan Torres',
          reviewerEmail: 'logan.torres@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Very pleased!',
          reviewerName: 'Aria Parker',
          reviewerEmail: 'aria.parker@x.dummyjson.com',
        },
        {
          rating: 3,
          comment: 'Poor quality!',
          reviewerName: 'Dylan Wells',
          reviewerEmail: 'dylan.wells@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Apple',
      description: 'Fresh and crisp apples, perfect for snacking or incorporating into various recipes.',
      price: 165,
      mrp: 189,
      stock: 8,
      rating: 4.19,
      brand: null,
      sku: 'GRO-BRD-APP-016',
      weight: 9,
      width: 13.66,
      height: 11.01,
      depth: 9.73,
      warranty: '3 year warranty',
      shippingInfo: 'Ships in 2 weeks',
      availability: 'In Stock',
      returnPolicy: '90 days return policy',
      minOrderQty: 2,
      tags: [
        'fruits'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/apple/1.webp'
      ],
      reviews: [
        {
          rating: 5,
          comment: 'Very satisfied!',
          reviewerName: 'Sophia Brown',
          reviewerEmail: 'sophia.brown@x.dummyjson.com',
        },
        {
          rating: 1,
          comment: 'Very dissatisfied!',
          reviewerName: 'Scarlett Bowman',
          reviewerEmail: 'scarlett.bowman@x.dummyjson.com',
        },
        {
          rating: 3,
          comment: 'Very unhappy with my purchase!',
          reviewerName: 'William Gonzalez',
          reviewerEmail: 'william.gonzalez@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Beef Steak',
      description: 'High-quality beef steak, great for grilling or cooking to your preferred level of doneness.',
      price: 1078,
      mrp: 1193,
      stock: 86,
      rating: 4.47,
      brand: null,
      sku: 'GRO-BRD-BEE-017',
      weight: 10,
      width: 18.9,
      height: 5.77,
      depth: 18.57,
      warranty: '3 year warranty',
      shippingInfo: 'Ships overnight',
      availability: 'In Stock',
      returnPolicy: '60 days return policy',
      minOrderQty: 1,
      tags: [
        'meat'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/beef-steak/1.webp'
      ],
      reviews: [
        {
          rating: 3,
          comment: 'Would not recommend!',
          reviewerName: 'Eleanor Tyler',
          reviewerEmail: 'eleanor.tyler@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Fast shipping!',
          reviewerName: 'Alexander Jones',
          reviewerEmail: 'alexander.jones@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Great value for money!',
          reviewerName: 'Natalie Harris',
          reviewerEmail: 'natalie.harris@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Cat Food',
      description: 'Nutritious cat food formulated to meet the dietary needs of your feline friend.',
      price: 746,
      mrp: 825,
      stock: 46,
      rating: 3.13,
      brand: null,
      sku: 'GRO-BRD-FOO-018',
      weight: 10,
      width: 18.08,
      height: 9.26,
      depth: 21.86,
      warranty: '1 year warranty',
      shippingInfo: 'Ships overnight',
      availability: 'In Stock',
      returnPolicy: 'No return policy',
      minOrderQty: 2,
      tags: [
        'pet supplies',
        'cat food'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/cat-food/1.webp'
      ],
      reviews: [
        {
          rating: 3,
          comment: 'Would not recommend!',
          reviewerName: 'Noah Lewis',
          reviewerEmail: 'noah.lewis@x.dummyjson.com',
        },
        {
          rating: 3,
          comment: 'Very unhappy with my purchase!',
          reviewerName: 'Ruby Andrews',
          reviewerEmail: 'ruby.andrews@x.dummyjson.com',
        },
        {
          rating: 2,
          comment: 'Very disappointed!',
          reviewerName: 'Ethan Thompson',
          reviewerEmail: 'ethan.thompson@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Chicken Meat',
      description: 'Fresh and tender chicken meat, suitable for various culinary preparations.',
      price: 829,
      mrp: 961,
      stock: 97,
      rating: 3.19,
      brand: null,
      sku: 'GRO-BRD-CHI-019',
      weight: 1,
      width: 11.03,
      height: 22.11,
      depth: 16.01,
      warranty: '1 year warranty',
      shippingInfo: 'Ships in 1 month',
      availability: 'In Stock',
      returnPolicy: '7 days return policy',
      minOrderQty: 1,
      tags: [
        'meat'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/chicken-meat/1.webp',
        'https://cdn.dummyjson.com/product-images/groceries/chicken-meat/2.webp'
      ],
      reviews: [
        {
          rating: 5,
          comment: 'Great product!',
          reviewerName: 'Mateo Bennett',
          reviewerEmail: 'mateo.bennett@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Highly recommended!',
          reviewerName: 'Jackson Evans',
          reviewerEmail: 'jackson.evans@x.dummyjson.com',
        },
        {
          rating: 3,
          comment: 'Not worth the price!',
          reviewerName: 'Sadie Morales',
          reviewerEmail: 'sadie.morales@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Cooking Oil',
      description: 'Versatile cooking oil suitable for frying, sautéing, and various culinary applications.',
      price: 414,
      mrp: 457,
      stock: 10,
      rating: 4.8,
      brand: null,
      sku: 'GRO-BRD-COO-020',
      weight: 5,
      width: 19.95,
      height: 27.54,
      depth: 24.86,
      warranty: 'Lifetime warranty',
      shippingInfo: 'Ships in 1-2 business days',
      availability: 'In Stock',
      returnPolicy: '30 days return policy',
      minOrderQty: 2,
      tags: [
        'cooking essentials'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/cooking-oil/1.webp'
      ],
      reviews: [
        {
          rating: 5,
          comment: 'Very happy with my purchase!',
          reviewerName: 'Victoria McDonald',
          reviewerEmail: 'victoria.mcdonald@x.dummyjson.com',
        },
        {
          rating: 2,
          comment: 'Would not recommend!',
          reviewerName: 'Hazel Evans',
          reviewerEmail: 'hazel.evans@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Would buy again!',
          reviewerName: 'Zoe Bennett',
          reviewerEmail: 'zoe.bennett@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Cucumber',
      description: 'Crisp and hydrating cucumbers, ideal for salads, snacks, or as a refreshing side.',
      price: 124,
      mrp: 124,
      stock: 84,
      rating: 4.07,
      brand: null,
      sku: 'GRO-BRD-CUC-021',
      weight: 4,
      width: 12.8,
      height: 28.38,
      depth: 21.34,
      warranty: '2 year warranty',
      shippingInfo: 'Ships in 1-2 business days',
      availability: 'In Stock',
      returnPolicy: '7 days return policy',
      minOrderQty: 1,
      tags: [
        'vegetables'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/cucumber/1.webp'
      ],
      reviews: [
        {
          rating: 4,
          comment: 'Great product!',
          reviewerName: 'Lincoln Kelly',
          reviewerEmail: 'lincoln.kelly@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Great value for money!',
          reviewerName: 'Savannah Gomez',
          reviewerEmail: 'savannah.gomez@x.dummyjson.com',
        },
        {
          rating: 2,
          comment: 'Poor quality!',
          reviewerName: 'James Davis',
          reviewerEmail: 'james.davis@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Dog Food',
      description: 'Specially formulated dog food designed to provide essential nutrients for your canine companion.',
      price: 912,
      mrp: 1017,
      stock: 71,
      rating: 4.55,
      brand: null,
      sku: 'GRO-BRD-FOO-022',
      weight: 10,
      width: 16.93,
      height: 27.15,
      depth: 9.29,
      warranty: 'No warranty',
      shippingInfo: 'Ships in 1-2 business days',
      availability: 'In Stock',
      returnPolicy: '60 days return policy',
      minOrderQty: 2,
      tags: [
        'pet supplies',
        'dog food'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/dog-food/1.webp'
      ],
      reviews: [
        {
          rating: 5,
          comment: 'Excellent quality!',
          reviewerName: 'Nicholas Edwards',
          reviewerEmail: 'nicholas.edwards@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Awesome product!',
          reviewerName: 'Zachary Lee',
          reviewerEmail: 'zachary.lee@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Great product!',
          reviewerName: 'Nova Cooper',
          reviewerEmail: 'nova.cooper@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Eggs',
      description: 'Fresh eggs, a versatile ingredient for baking, cooking, or breakfast.',
      price: 248,
      mrp: 279,
      stock: 9,
      rating: 2.53,
      brand: null,
      sku: 'GRO-BRD-EGG-023',
      weight: 2,
      width: 11.42,
      height: 7.44,
      depth: 16.95,
      warranty: '1 week warranty',
      shippingInfo: 'Ships in 1 week',
      availability: 'In Stock',
      returnPolicy: 'No return policy',
      minOrderQty: 1,
      tags: [
        'dairy'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/eggs/1.webp'
      ],
      reviews: [
        {
          rating: 3,
          comment: 'Disappointing product!',
          reviewerName: 'Penelope King',
          reviewerEmail: 'penelope.king@x.dummyjson.com',
        },
        {
          rating: 3,
          comment: 'Poor quality!',
          reviewerName: 'Eleanor Tyler',
          reviewerEmail: 'eleanor.tyler@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Very pleased!',
          reviewerName: 'Benjamin Foster',
          reviewerEmail: 'benjamin.foster@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Fish Steak',
      description: 'Quality fish steak, suitable for grilling, baking, or pan-searing.',
      price: 1244,
      mrp: 1299,
      stock: 74,
      rating: 3.78,
      brand: null,
      sku: 'GRO-BRD-FIS-024',
      weight: 6,
      width: 14.95,
      height: 26.31,
      depth: 11.27,
      warranty: '1 month warranty',
      shippingInfo: 'Ships in 3-5 business days',
      availability: 'In Stock',
      returnPolicy: '60 days return policy',
      minOrderQty: 2,
      tags: [
        'seafood'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/fish-steak/1.webp'
      ],
      reviews: [
        {
          rating: 2,
          comment: 'Would not buy again!',
          reviewerName: 'Caleb Perkins',
          reviewerEmail: 'caleb.perkins@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Excellent quality!',
          reviewerName: 'Isabella Jackson',
          reviewerEmail: 'isabella.jackson@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Great value for money!',
          reviewerName: 'Nathan Dixon',
          reviewerEmail: 'nathan.dixon@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Green Bell Pepper',
      description: 'Fresh and vibrant green bell pepper, perfect for adding color and flavor to your dishes.',
      price: 107,
      mrp: 107,
      stock: 33,
      rating: 3.25,
      brand: null,
      sku: 'GRO-BRD-GRE-025',
      weight: 2,
      width: 15.33,
      height: 26.65,
      depth: 14.44,
      warranty: '1 month warranty',
      shippingInfo: 'Ships in 1 week',
      availability: 'In Stock',
      returnPolicy: '30 days return policy',
      minOrderQty: 1,
      tags: [
        'vegetables'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/1.webp'
      ],
      reviews: [
        {
          rating: 4,
          comment: 'Highly recommended!',
          reviewerName: 'Avery Carter',
          reviewerEmail: 'avery.carter@x.dummyjson.com',
        },
        {
          rating: 3,
          comment: 'Would not recommend!',
          reviewerName: 'Henry Hill',
          reviewerEmail: 'henry.hill@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Excellent quality!',
          reviewerName: 'Addison Wright',
          reviewerEmail: 'addison.wright@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Green Chili Pepper',
      description: 'Spicy green chili pepper, ideal for adding heat to your favorite recipes.',
      price: 82,
      mrp: 83,
      stock: 3,
      rating: 3.66,
      brand: null,
      sku: 'GRO-BRD-GRE-026',
      weight: 7,
      width: 15.38,
      height: 18.12,
      depth: 19.92,
      warranty: '2 year warranty',
      shippingInfo: 'Ships in 1 week',
      availability: 'Low Stock',
      returnPolicy: '30 days return policy',
      minOrderQty: 2,
      tags: [
        'vegetables'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/1.webp'
      ],
      reviews: [
        {
          rating: 4,
          comment: 'Great product!',
          reviewerName: 'Luna Russell',
          reviewerEmail: 'luna.russell@x.dummyjson.com',
        },
        {
          rating: 1,
          comment: 'Waste of money!',
          reviewerName: 'Noah Lewis',
          reviewerEmail: 'noah.lewis@x.dummyjson.com',
        },
        {
          rating: 3,
          comment: 'Very disappointed!',
          reviewerName: 'Clara Berry',
          reviewerEmail: 'clara.berry@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Honey Jar',
      description: 'Pure and natural honey in a convenient jar, perfect for sweetening beverages or drizzling over food.',
      price: 580,
      mrp: 678,
      stock: 34,
      rating: 3.97,
      brand: null,
      sku: 'GRO-BRD-HON-027',
      weight: 2,
      width: 9.28,
      height: 21.72,
      depth: 17.74,
      warranty: '1 month warranty',
      shippingInfo: 'Ships in 1-2 business days',
      availability: 'In Stock',
      returnPolicy: '90 days return policy',
      minOrderQty: 1,
      tags: [
        'condiments'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/honey-jar/1.webp'
      ],
      reviews: [
        {
          rating: 1,
          comment: 'Very disappointed!',
          reviewerName: 'Autumn Gomez',
          reviewerEmail: 'autumn.gomez@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Highly impressed!',
          reviewerName: 'Benjamin Wilson',
          reviewerEmail: 'benjamin.wilson@x.dummyjson.com',
        },
        {
          rating: 2,
          comment: 'Very disappointed!',
          reviewerName: 'Nicholas Edwards',
          reviewerEmail: 'nicholas.edwards@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Ice Cream',
      description: 'Creamy and delicious ice cream, available in various flavors for a delightful treat.',
      price: 456,
      mrp: 499,
      stock: 27,
      rating: 3.39,
      brand: null,
      sku: 'GRO-BRD-CRE-028',
      weight: 1,
      width: 14.83,
      height: 15.07,
      depth: 24.2,
      warranty: '1 month warranty',
      shippingInfo: 'Ships in 2 weeks',
      availability: 'In Stock',
      returnPolicy: 'No return policy',
      minOrderQty: 2,
      tags: [
        'desserts'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/ice-cream/1.webp',
        'https://cdn.dummyjson.com/product-images/groceries/ice-cream/2.webp',
        'https://cdn.dummyjson.com/product-images/groceries/ice-cream/3.webp',
        'https://cdn.dummyjson.com/product-images/groceries/ice-cream/4.webp'
      ],
      reviews: [
        {
          rating: 5,
          comment: 'Very pleased!',
          reviewerName: 'Elijah Cruz',
          reviewerEmail: 'elijah.cruz@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Excellent quality!',
          reviewerName: 'Jace Smith',
          reviewerEmail: 'jace.smith@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Highly impressed!',
          reviewerName: 'Sadie Morales',
          reviewerEmail: 'sadie.morales@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Juice',
      description: 'Refreshing fruit juice, packed with vitamins and great for staying hydrated.',
      price: 331,
      mrp: 377,
      stock: 50,
      rating: 3.94,
      brand: null,
      sku: 'GRO-BRD-JUI-029',
      weight: 1,
      width: 18.56,
      height: 21.46,
      depth: 28.02,
      warranty: '6 months warranty',
      shippingInfo: 'Ships in 1 week',
      availability: 'In Stock',
      returnPolicy: 'No return policy',
      minOrderQty: 1,
      tags: [
        'beverages'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/juice/1.webp'
      ],
      reviews: [
        {
          rating: 5,
          comment: 'Excellent quality!',
          reviewerName: 'Nolan Gonzalez',
          reviewerEmail: 'nolan.gonzalez@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Would buy again!',
          reviewerName: 'Bella Grant',
          reviewerEmail: 'bella.grant@x.dummyjson.com',
        },
        {
          rating: 5,
          comment: 'Awesome product!',
          reviewerName: 'Aria Flores',
          reviewerEmail: 'aria.flores@x.dummyjson.com',
        }
      ],
    },
    {
      name: 'Kiwi',
      description: 'Nutrient-rich kiwi, perfect for snacking or adding a tropical twist to your dishes.',
      price: 207,
      mrp: 244,
      stock: 99,
      rating: 4.93,
      brand: null,
      sku: 'GRO-BRD-KIW-030',
      weight: 5,
      width: 19.4,
      height: 18.67,
      depth: 17.13,
      warranty: '6 months warranty',
      shippingInfo: 'Ships overnight',
      availability: 'In Stock',
      returnPolicy: '7 days return policy',
      minOrderQty: 2,
      tags: [
        'fruits'
      ],
      sizes: [],
      colors: [],
      category: 'Groceries',
      images: [
        'https://cdn.dummyjson.com/product-images/groceries/kiwi/1.webp'
      ],
      reviews: [
        {
          rating: 4,
          comment: 'Highly recommended!',
          reviewerName: 'Emily Brown',
          reviewerEmail: 'emily.brown@x.dummyjson.com',
        },
        {
          rating: 2,
          comment: 'Would not buy again!',
          reviewerName: 'Jackson Morales',
          reviewerEmail: 'jackson.morales@x.dummyjson.com',
        },
        {
          rating: 4,
          comment: 'Fast shipping!',
          reviewerName: 'Nora Russell',
          reviewerEmail: 'nora.russell@x.dummyjson.com',
        }
      ],
    }
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
        sku: p.sku,
        weight: p.weight,
        width: p.width,
        height: p.height,
        depth: p.depth,
        warranty: p.warranty,
        shippingInfo: p.shippingInfo,
        availability: p.availability,
        returnPolicy: p.returnPolicy,
        minOrderQty: p.minOrderQty,
        tags: p.tags,
        sizes: p.sizes,
        colors: p.colors,
        categoryId: categories[p.category].id,
        images: {
          create: p.images.map((url) => ({ url })),
        },
        reviews: {
          create: p.reviews,
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
