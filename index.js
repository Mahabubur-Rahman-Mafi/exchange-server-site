const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());
// -----

app.get("/", (req, res) => {
  res.send("exchange server working");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6cfnsid.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productsCollection = client.db("exchange").collection("products");
    const categoriesCollection = client.db("exchange").collection("categories");

    // category
    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await categoriesCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/product/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { categoryName: id };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      const query = {};
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}

app.listen(port, () => {
  console.log(`Exchange ${port}`);
});

run().catch((err) => console.error(err));
