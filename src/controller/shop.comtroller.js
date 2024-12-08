const prisma = require("../db/db.js");

const createShop = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Field Missing" });
    }
    const shop = await prisma.shop.create({
      data: {
        name: name
      }
    });

    return res.status(201).json({ message: "Shop successfully", data: shop });
  } catch (error) {
    console.error("Error creating QR Codes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createShop };
