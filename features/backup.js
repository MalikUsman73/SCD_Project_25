const fs = require("fs");
const path = require("path");
const { getCollection } = require("../db/mongo");

module.exports = async function backupFeature() {
  const collection = await getCollection();
  const records = await collection.find().toArray();

  const backupsDir = path.join(__dirname, "../backups");
  if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir);

  const timestamp = new Date().toISOString().replace(/:/g, "-");
  const backupPath = path.join(backupsDir, `backup_${timestamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(records, null, 2));
  console.log(`💾 Backup created: ${backupPath}`);
};
