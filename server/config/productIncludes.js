const reviewPublicSelect = {
  id: true,
  rating: true,
  comment: true,
  reviewerName: true,
  productId: true,
  createdAt: true,
};

const productListInclude = {
  images: true,
  category: true,
  _count: { select: { reviews: true } },
};

const productDetailInclude = {
  images: true,
  category: true,
  reviews: {
    select: reviewPublicSelect,
    orderBy: { createdAt: "desc" },
  },
};

module.exports = {
  reviewPublicSelect,
  productListInclude,
  productDetailInclude,
};
