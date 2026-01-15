const { MongoClient } = require('mongodb');

const MONGO_URL = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'sulu';

let client;
let db;

async function connectDB() {
  try {
    client = new MongoClient(MONGO_URL);
    await client.connect();

    db = client.db(DB_NAME);

    console.log('MongoDB connected to database:', DB_NAME);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
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
