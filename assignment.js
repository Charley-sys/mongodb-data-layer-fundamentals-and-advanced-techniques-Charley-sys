// assignment.js
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log(" Connected to MongoDB");

    const db = client.db("plp_bookstore");
    const books = db.collection("books");

    // --- CRUD Operations ---
    // CREATE
    await books.insertOne({ title: "Test Book", author: "Charles", year: 2025 });
    console.log(" Book inserted");

    // READ
    const findBook = await books.findOne({ author: "Charles" });
    console.log(" Found book:", findBook);

    // UPDATE
    await books.updateOne(
      { author: "Charles" },
      { $set: { year: 2026, in_stock: true } }
    );
    console.log(" Book updated");

    // DELETE
    await books.deleteOne({ author: "Charles" });
    console.log(" Book deleted");

    // --- Queries ---
    const orwellBooks = await books.find({ author: "George Orwell" }).toArray();
    console.log("\n Books by George Orwell:", orwellBooks);

    const recentBooks = await books.find({ published_year: { $gt: 1950 } }).toArray();
    console.log("\n Books published after 1950:", recentBooks);

    // --- Aggregation ---
    const agg = await books.aggregate([
      { $group: { _id: "$author", total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]).toArray();
    console.log("\n Books per author:", agg);

    // --- Indexing ---
    await books.createIndex({ title: 1 });
    console.log(" Index created on title field");

  } catch (err) {
    console.error(" Error:", err);
  } finally {
    await client.close();
    console.log(" Connection closed");
  }
}

run();
