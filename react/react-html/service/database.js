const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

// Connect to the database cluster
const client = new MongoClient(url);
const db = client.db('warships');
const userCollection = db.collection('user');
const collection = db.collection('layout');

// Test that you can connect to the database 
(async function testConnection() {
await client.connect();
await db.command({ ping: 1 });
})().catch((ex) => {
console.log(`Unable to connect to database with ${url} because ${ex.message}`);
process.exit(1);
});


function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);

  return user;
}

async function addLayout(layout) 
{
    const result = await collection.insertOne(layout);
    return result;
}

function getLayouts()
{
    const query = {};
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

module.exports = {
    getUser,
    getUserByToken,
    createUser,
    addLayout,
    getLayouts };
