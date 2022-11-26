const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());
// -----

app.get("/", (req, res) => {
  res.send("exchange server working");
});

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.6cfnsid.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productsCollection = client.db("exchange").collection("products");

    
  }
  finally {
  }
}

app.listen(port, () => {
  console.log(`Exchange ${port}`);
});

run().catch((err) => console.error(err));
