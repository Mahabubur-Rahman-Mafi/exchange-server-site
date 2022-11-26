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
    const usersCollection = client.db("exchange").collection("users");

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
      const query = { categoryName: id };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      const query = {};
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });


    //   user collection
        app.post("/users", async (req, res) => {
          const people = req.body;
            const result = await usersCollection.insertOne(people);
          res.send(result);
        });
      app.get('/users', async (req, res) => {
          const query = {}
          const result = await usersCollection.find(query).toArray()
          res.send(result)
      })
      app.get("/users/buyer/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email };
        const user = await usersCollection.findOne(query);
        res.send({ isBuyer: user?.role === "buyer" });
      });
      app.get("/users/seller/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email };
        const user = await usersCollection.findOne(query);
        res.send({ isSeller: user?.role === "buyer" });
      });
      app.get("/users/admin/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email };
        const user = await usersCollection.findOne(query);
        res.send({ isAdmin: user?.role === "buyer" });
      });
  }

  finally {
  }
}

app.listen(port, () => {
  console.log(`Exchange ${port}`);
});

run().catch((err) => console.error(err));
