const prisma = require("../prismaClient");

/** Returns all categories ordered by name ascending. */
async function getCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCategories };