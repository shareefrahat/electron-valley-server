const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
  } finally {
    // client.close()
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
