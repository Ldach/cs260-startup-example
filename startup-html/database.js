const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

// Connect to the database cluster
const client = new MongoClient(url);
const db = client.db('warships');
const collection = db.collection('layout');

// Test that you can connect to the database
(async function testConnection() {
await client.connect();
await db.command({ ping: 1 });
})().catch((ex) => {
console.log(`Unable to connect to database with ${url} because ${ex.message}`);
process.exit(1);
});

async function addLayout(layout) 
{
    const result = await collection.insertOne(layout);
    return result;
}

function getLayouts()
{
    const query = { $all };
    const options = 
    {
        limit: 10,
    };
    const cursor = collection.find(query, options);
    return cursor.toArray();
}
/*
// Insert a document
const house = {
name: 'Beachfront views',
summary: 'From your bedroom to the beach, no shoes required',
property_type: 'Condo',
beds: 1,
};
await collection.insertOne(house);

// Query the documents
const query = { property_type: 'Condo', beds: { $lt: 2 } };
const options = {
sort: { score: -1 },
limit: 10,
};

const cursor = collection.find(query, options);
const rentals = await cursor.toArray();
rentals.forEach((i) => console.log(i));
*/

module.exports = { addLayout, getLayouts };
