const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "sulu";

let client;
let db;

async function connectDB() {
  if (!MONGO_URI) {
    console.error("MONGO_URI is missing");
    process.exit(1);
  }

  client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);

  console.log("MongoDB connected:", DB_NAME);
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
}

module.exports = {
  connectDB,
  getDB
};
