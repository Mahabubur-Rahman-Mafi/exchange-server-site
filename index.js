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
// console.log(uri);
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
    const ordersCollection = client.db("exchange").collection("orders");

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
    // --------------

    // product
    app.get("/products", async (req, res) => {
      const query = {};
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/products/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const editText = req.body;
      console.log(editText);
      const option = { upsert: true };
      const updatetext = {
        $set: {
          advertise: editText.text,
        },
      };
      const result = await productsCollection.updateOne(
        query,
        updatetext,
        option
      );
      res.send(result);
    });
    // --------

    // advertise section
    app.get("/adversite", async (req, res) => {
      const query = { advertise: "advertised" };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
    // _______

    //   user collection
    app.post("/users", async (req, res) => {
      const people = req.body;
      const result = await usersCollection.insertOne(people);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const query = {};
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const editText = req.body;
      console.log(editText);
      const option = { upsert: true };
      const newUser = {
        $set: {
          status: editText.text,
        },
      };
      const result = await usersCollection.updateOne(query, newUser, option);
      res.send(result);
    });
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const editText = req.body;
      console.log(editText);
      const option = { upsert: true };
      const newAdmin = {
        $set: {
          role: editText.text,
        },
      };
      const result = await usersCollection.updateOne(query, newAdmin, option);
      res.send(result);
    });
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });
    // -------------

    //   order collection
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.send(result);
    });
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await ordersCollection.find(query).toArray();
      res.send(result);
    });
    // delete orders
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    });
    // ------------

    //    admin, seller, buyer
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
      res.send({ isSeller: user?.role === "seller" });
    });
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });
  } finally {
  }
}

app.listen(port, () => {
  console.log(`Exchange ${port}`);
});

run().catch((err) => console.error(err));
