const prisma = require("../db/db.js");

const createProduct = async (req, res) => {
  try {
    const { name , ImgUrl ,sku , stock, price ,shopId} = req.body;

    if (!name) {
      return res.status(400).json({ message: "Field Missing" });
    }
    const shop = await prisma.product.create({
      data: {
          name: name,
          imgUrl:ImgUrl,
          sku:sku,
          price:price,
          stock:stock,
          shopId:shopId
      }
    });

    return res.status(201).json({ message: "Create Product successfully", data: shop });
  } catch (error) {
    console.error("Error creating QR Codes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createProduct };
