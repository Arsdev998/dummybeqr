const prisma = require("../db/db.js");
const { v4: uuidv4 } = require('uuid');

const createMultipleQrCodes = async (req, res) => {
  try {
    const { 
      shopId, 
      amount, 
      countLimit, 
      manufactureId, 
      distributorId, 
      productId, 
    } = req.body;

    if (!shopId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Shop ID and valid amount are required." });
    }

    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Generate batchId for this creation request
    const batchId = uuidv4();

    const qrCodes = await Promise.all(
      Array.from({ length: amount }).map(async (_, index) => {
        const uniqueCode = `${shopId}_${uuidv4()}`;
        const scanId = uuidv4();
        // Generate QR Code URL
        const shopName = shop.name.toLocaleLowerCase().split(' ').join('-');
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const scanUrl = `${baseUrl}/${shopName}/verify/${scanId}`;
        return {
          shopId,
          batchId, // Add batchId to each QR code
          code: uniqueCode,
          countLimit: countLimit,
          status: "ACTIVE",
          manufactureId: manufactureId,
          distributorId: distributorId,
          productId: productId,
          sku: product.sku,
          scanId: scanId,
          scanUrl: scanUrl,
        };
      })
    );

    const createdQrCodes = await prisma.qRCode.createMany({
      data: qrCodes,
    });

    return res.status(201).json({ 
      message: "QR Codes created successfully", 
      batchId, // Include batchId in the response
      data: qrCodes,
      qr: createdQrCodes,
    });
  } catch (error) {
    console.error("Error creating QR Codes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getQRCodeHistory = async (req, res) => {
  try {
    const { shopId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const groupedQRCodes = await prisma.qRCode.findMany({
      where: {
        shopId: parseInt(shopId),
      },
      distinct: ['batchId'], 
      include: {
        product: true, 
      },
      orderBy: {
        createdAt: 'desc', 
      },
      skip: (page - 1) * limit,
      take: limit,
      
    });
    const totalBatches = await prisma.qRCode.groupBy({
      by: ['batchId'],
      where: {
        shopId: parseInt(shopId),
      },
    });

    const total = totalBatches.length;

    return res.status(200).json({
      data: groupedQRCodes,
        current_page:page,
        per_page:limit,
        total:total,
        last_page: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching QR Code history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getQrDwonload = async(req,res) =>{
  const {batchId} = req.params;
  console.log(batchId)
  try {
    const qRCodeResponse = await prisma.qRCode.findMany({
      where:{
        batchId: batchId,
      },
    })
    const count = await prisma.qRCode.count({
      where:{
        batchId: batchId
      }
    })
    return res.status(200).json({
      data:qRCodeResponse,
      count:count
    })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}



const verifyQRCode = async (req, res) => {
  try {
    const { scanId } = req.params;
    
    const qrCode = await prisma.qRCode.findFirst({
      where: { 
        scanId: scanId
       },
      include: {
        shop: true,
        product: true
      }
    });


    if (!qrCode) {
      return res.status(404).json({ message: "QR Code not found" });
    }

    if (qrCode.status !== 'ACTIVE') {
      return res.status(400).json({ message: "QR Code is not active" });
    }

    await prisma.qRCode.update({
      where: { id: qrCode.id },
      data: { 
        count: qrCode.count + 1,
       }
    });

    if(qrCode.count >= qrCode.countLimit){
      await prisma.qRCode.update({
        where: { id: qrCode.id },
        data: { 
          status: "EXPIRED",
         }
      })
      return res.status(400).json({ message: "QR Code limit reached" });
    }

    return res.status(200).json({
      productInfo: {
        name: qrCode.product?.name,
        sku: qrCode.sku,
        imgUrl:qrCode.product?.imgUrl,
        manufacturer: qrCode.manufactureId,
        distributor: qrCode.distributorId
      },
      qrCode:qrCode
    });
  } catch (error) {
    console.error("Error verifying QR Code:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { 
  createMultipleQrCodes, 
  getQRCodeHistory,
  verifyQRCode,
  getQrDwonload
};