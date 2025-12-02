const { getCollection } = require("../db/mongo");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise(resolve => readline.question(question, resolve));
}

module.exports = async function sortFeature() {
  const collection = await getCollection();
  const field = await ask("Sort by 'name' or 'value'? ");
  const order = await ask("Order 'asc' or 'desc'? ");
  const sortObj = {};
  sortObj[field] = order.toLowerCase() === "asc" ? 1 : -1;

  const results = await collection.find().sort(sortObj).toArray();
  console.table(results.map(r => ({
    ID: r._id.toString(),
    Name: r.name,
    Value: r.value,
    CreatedAt: r.createdAt.toLocaleString(),
    UpdatedAt: r.updatedAt.toLocaleString()
  })));
};
