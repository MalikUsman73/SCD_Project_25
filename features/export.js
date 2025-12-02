const fs = require("fs");
const path = require("path");
const { getCollection } = require("../db/mongo");

module.exports = async function exportFeature() {
  const collection = await getCollection();
  const records = await collection.find().toArray();

  const filePath = path.join(__dirname, "../export.txt");
  const date = new Date().toLocaleString();

  const content = [
    `===== NodeVault Export =====`,
    `Date: ${date}`,
    `Total Records: ${records.length}`,
    `File: export.txt`,
    `--------------------------`,
    ...records.map(r => `ID: ${r._id}\nName: ${r.name}\nValue: ${r.value}\nCreated At: ${r.createdAt}\nUpdated At: ${r.updatedAt}\n----------------`),
  ].join("\n");

  fs.writeFileSync(filePath, content);
  console.log(`✅ Data exported successfully to export.txt`);
};
