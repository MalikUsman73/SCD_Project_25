// db/mongo.js
const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = "nodevault";
const collectionName = "records";

// Connect to DB
async function connectDB() {
  if (!client.isConnected?.()) await client.connect();
  return client.db(dbName);
}

// Get collection
async function getCollection() {
  const db = await connectDB();
  return db.collection(collectionName);
}

// Add Record + automatic backup
async function addRecord(record) {
  const collection = await getCollection();
  record.createdAt = new Date();
  record.updatedAt = new Date();
  await collection.insertOne(record);
  await backup(); // automatic backup
}

// List Records
async function listRecords() {
  const collection = await getCollection();
  return await collection.find({}).toArray();
}

// Update Record
async function updateRecord(id, name, value) {
  const collection = await getCollection();
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { name, value, updatedAt: new Date() } }
  );
  await backup();
}

// Delete Record
async function deleteRecord(id) {
  const collection = await getCollection();
  await collection.deleteOne({ _id: new ObjectId(id) });
  await backup();
}

// Backup
async function backup() {
  const records = await listRecords();
  const dir = path.join(__dirname, "../backups");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const filename = `backup_${new Date().toISOString()}.json`;
  fs.writeFileSync(path.join(dir, filename), JSON.stringify(records, null, 2));
  console.log(`💾 Backup created: ${path.join(dir, filename)}`);
}

// Export to txt
async function exportData() {
  const records = await listRecords();
  const filename = path.join(__dirname, "../export.txt");
  const now = new Date();
  const content = [
    `Export Date: ${now.toLocaleString()}`,
    `Total Records: ${records.length}`,
    "==========================",
    ...records.map(r => `ID: ${r._id}\nName: ${r.name}\nValue: ${r.value}\nCreatedAt: ${r.createdAt}\nUpdatedAt: ${r.updatedAt}\n------------------`)
  ].join("\n");
  fs.writeFileSync(filename, content);
  console.log(`✅ Data exported successfully to ${filename}`);
}

// Statistics
async function getStats() {
  const records = await listRecords();
  if (!records.length) return console.log("No records found.");

  const longestName = records.reduce((a, b) => (b.name.length > a.name.length ? b : a));
  const createdDates = records.map(r => r.createdAt).filter(Boolean);
  const updatedDates = records.map(r => r.updatedAt).filter(Boolean);

  console.log(`
Vault Statistics:
--------------------------
Total Records: ${records.length}
Last Modified: ${new Date(Math.max(...updatedDates)).toLocaleString()}
Longest Name: ${longestName.name} (${longestName.name.length} characters)
Earliest Record: ${new Date(Math.min(...createdDates)).toLocaleDateString()}
Latest Record: ${new Date(Math.max(...createdDates)).toLocaleDateString()}
  `);
}

module.exports = {
  addRecord,
  listRecords,
  updateRecord,
  deleteRecord,
  backup,
  exportData,
  getStats,
  ObjectId
};
