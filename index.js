const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Transaction = require("./models/Transaction");
const mongoose = require("mongoose");

const port = 8001;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({
    message: "test oke",
  });
});
app.use(async (req, res, next) => {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(
      "mongodb+srv://alfin:1234@cluster0.umboxyk.mongodb.net/?retryWrites=true&w=majority"
    );
  }
  next();
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

app.post("/api/transaction", async (req, res) => {
  await mongoose.connect(
    "mongodb+srv://alfin:1234@cluster0.umboxyk.mongodb.net/?retryWrites=true&w=majority"
  );
  const { name, description, datetime, price } = req.body;
  try {
    const transaction = await Transaction.create({
      name,
      description,
      datetime,
      price,
    });
    res.json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the transaction." });
  }
});

app.get("/api/transactions", async (req, res) => {
  await mongoose.connect(
    "mongodb+srv://alfin:1234@cluster0.umboxyk.mongodb.net/?retryWrites=true&w=majority"
  );
  const transactions = await Transaction.find();
  res.json(transactions);
});

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
