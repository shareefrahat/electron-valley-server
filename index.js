const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
const objectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();

//--------------Middleware--------------\\

app.use(express.json());
app.use(cors());

//--------------MongoDB : Database--------------\\

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6olzz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("Database: MongoDB is connected");

    const productCollection = client
      .db("ElectronValley")
      .collection("products");

    //--------------AUTH : TOKEN-------------\\

    app.get("/getToken");
    //--------------POST : Create---------------\\

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    //--------------GET : READ--------------\\

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //------------PUT : UPDATE-------------\\

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const filter = { _id: objectId(id) };

      const options = { upsert: true };
      const updateDoc = {
        $set: updateProduct,
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //---------------DELETE---------------\\
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    //--------------GET : READ--------------\\

    app.get("/userItems", async (req, res) => {
      const owner = req.query.owner;
      const query = { owner: owner };
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

//--------------Root API--------------\\

app.get("/", (req, res) => {
  res.send("Node server is running");
});

app.listen(port, () => {
  console.log("Server: Port is connected at", port);
});
