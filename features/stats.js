const fileDB = require('../db/file');

function viewStats() {
  const records = fileDB.readDB();
  if (records.length === 0) {
    console.log('Vault is empty.');
    return;
  }

  const lastModified = new Date(Math.max(...records.map(r => r.id))).toLocaleString();
  const longestName = records.reduce((prev, curr) => (curr.name.length > prev.length ? curr.name : prev), '');
  const earliest = new Date(Math.min(...records.map(r => r.id))).toLocaleDateString();
  const latest = new Date(Math.max(...records.map(r => r.id))).toLocaleDateString();

  console.log(`
Vault Statistics:
--------------------------
Total Records: ${records.length}
Last Modified: ${lastModified}
Longest Name: ${longestName} (${longestName.length} characters)
Earliest Record: ${earliest}
Latest Record: ${latest}
  `);
}

module.exports = { viewStats };
