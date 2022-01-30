import { MongoClient } from "mongodb";
const mongoClient = new MongoClient(process.env.db_URL);

async function getCollection(collectionName) {
  await mongoClient.connect();

  const db = mongoClient.db(process.env.db_name);
  return db.collection(collectionName);
}

async function closeConnection() {
  await mongoClient.close();
}

async function openConnection() {
  await mongoClient.connect();
}

export { openConnection, closeConnection, getCollection };
