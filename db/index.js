const { connectDB } = require("./mongo");

async function addRecord({ name, value }) {
  const db = await connectDB();
  const record = { name, value, createdAt: new Date() };
  await db.collection("records").insertOne(record);
  return record;
}

async function listRecords() {
  const db = await connectDB();
  return await db.collection("records").find().toArray();
}

async function updateRecord(id, name, value) {
  const db = await connectDB();
  const { ObjectId } = require("mongodb");

  return await db.collection("records").updateOne(
    { _id: new ObjectId(id) },
    { $set: { name, value } }
  );
}

async function deleteRecord(id) {
  const db = await connectDB();
  const { ObjectId } = require("mongodb");

  return await db.collection("records").deleteOne({ _id: new ObjectId(id) });
}

module.exports = { addRecord, listRecords, updateRecord, deleteRecord };
