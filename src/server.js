const express = require('express')
const app = express()
const port = 8000
const cors = require('cors');

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST","PATCH", "PUT", "DELETE"],
}))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const shop = require('./routes/shop.router.js');
const product = require('./routes/product.route.js');
const qrcode = require('./routes/qrcode.router.js');
app.use('/product', product);
app.use('/shop', shop);
app.use('/qrcode', qrcode);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})