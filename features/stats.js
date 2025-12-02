const db = require("../db");

module.exports = async function showStats() {
  const records = await db.listRecords();
  if (!records.length) {
    console.log("Vault is empty. No statistics to display.");
    return;
  }

  const total = records.length;

  const lastModified = records.reduce((latest, r) => {
    const date = r.updatedAt ? new Date(r.updatedAt) : new Date(r.createdAt);
    return date > latest ? date : latest;
  }, new Date(0));

  const longestName = records.reduce((longest, r) => r.name.length > longest.length ? r.name : longest, "");

  const dates = records.map(r => new Date(r.createdAt));
  const earliest = new Date(Math.min(...dates));
  const latest = new Date(Math.max(...dates));

  console.log(`
Vault Statistics:
--------------------------
Total Records: ${total}
Last Modified: ${lastModified.toLocaleString()}
Longest Name: ${longestName} (${longestName.length} characters)
Earliest Record: ${earliest.toISOString().split("T")[0]}
Latest Record: ${latest.toISOString().split("T")[0]}
  `);
};
