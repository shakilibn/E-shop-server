const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.llhcr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = process.env.PORT || 5055;

const app = express()
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("eshopStore").collection("products");
  const ordersCollection = client.db("eshopStore").collection("orders");

  //api for get all products
  app.get('/products', (req, res) => {
      productsCollection.find()
      .toArray( (err, documents) => {
          res.send(documents);
      })
  })

  //api for get single product
  app.get('/product/:id', (req, res) => {
      const id = ObjectId(req.params.id);
      productsCollection.find({_id : id})
      .toArray( (err, documents) => {
          res.send(documents[0]);
      })
  })

  //api for get orders
  app.get('/orders', (req, res) => {
      ordersCollection.find({email: req.query.email})
      .toArray( (err, documents) => {
          res.send(documents)
      })
  })

  //api for insert database
  app.post('/addProduct', (req, res) => {
      const newProduct = req.body;
      productsCollection.insertOne(newProduct)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })

  //api for insert orders
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

  //api for delete product from database
  app.delete('/delete/:id', (req, res) => {
      const id = ObjectId(req.params.id);
      productsCollection.deleteOne({_id: id})
      .then(result => {
          console.log(result);
          res.send(result.deletedCount);
      })
  })

});


app.listen(port)