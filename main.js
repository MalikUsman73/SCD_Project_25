const readline = require("readline");
const db = require("./db/mongo");
require("dotenv").config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function menu() {
  console.log(`
===== NodeVault (MongoDB) =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Records
6. Sort Records
7. View Vault Statistics
8. Export Data
9. Backup Collection
0. Exit
===============================
  `);

  rl.question("Choose option: ", async ans => {
    switch (ans.trim()) {
      case "1":
        rl.question("Enter name: ", name => {
          rl.question("Enter value: ", async value => {
            await db.addRecord({ name, value });
            console.log("✅ Record added!");
            menu();
          });
        });
        break;

      case "2":
        const records = await db.listRecords();
        if (!records.length) console.log("No records found.");
        else
          records.forEach(r =>
            console.log(`ID: ${r._id}\nName: ${r.name}\nValue: ${r.value}\nCreatedAt: ${r.createdAt}\nUpdatedAt: ${r.updatedAt}\n------------------`)
          );
        menu();
        break;

      case "3":
        rl.question("Enter record ID to update: ", id => {
          rl.question("New name: ", name => {
            rl.question("New value: ", async value => {
              try {
                await db.updateRecord(id, name, value);
                console.log("✅ Record updated!");
              } catch (err) {
                console.log("❌ Error updating record:", err.message);
              }
              menu();
            });
          });
        });
        break;

      case "4":
        rl.question("Enter record ID to delete: ", async id => {
          try {
            await db.deleteRecord(id);
            console.log("✅ Record deleted!");
          } catch (err) {
            console.log("❌ Error deleting record:", err.message);
          }
          menu();
        });
        break;

      case "7":
        await db.getStats();
        menu();
        break;

      case "8":
        await db.exportData();
        menu();
        break;

      case "9":
        await db.backup();
        menu();
        break;

      case "0":
        console.log("Exiting...");
        rl.close();
        process.exit(0);  // ensures program exits
        break;

      default:
        console.log("Invalid option.");
        menu();
    }
  });
}

menu();
