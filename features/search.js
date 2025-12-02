const { getCollection } = require("../db/mongo");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise(resolve => readline.question(question, resolve));
}

module.exports = async function searchFeature() {
  const collection = await getCollection();
  const keyword = await ask("Enter name or value to search: ");
  const query = {
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { value: { $regex: keyword, $options: "i" } }
    ]
  };
  const results = await collection.find(query).toArray();
  console.table(results.map(r => ({
    ID: r._id.toString(),
    Name: r.name,
    Value: r.value,
    CreatedAt: r.createdAt.toLocaleString(),
    UpdatedAt: r.updatedAt.toLocaleString()
  })));
};
