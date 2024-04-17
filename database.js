const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const personalScoreCollection = db.collection('personal');
const globalScoreCollection = db.collection('global');

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
  
  function addPersonalScore(score) {
    personalScoreCollection.insertOne(score);
  }

  function addGlobalScore(score) {
    globalScoreCollection.insertOne(score);
  }

  function getPersonalHighScores() {
    const query = { score: { $gt: 0, $lt: 900 } };
    const options = {
      sort: { score: -1 },
      limit: 12,
    };
    const cursor = personalScoreCollection.find(query, options);
    return cursor.toArray();
  }

  function getGlobalHighScores() {
    const query = { score: { $gt: 0, $lt: 900 } };
    const options = {
      sort: { score: -1 },
      limit: 12,
    };
    const cursor = globalScoreCollection.find(query, options);
    return cursor.toArray();
  }
  
  module.exports = {
    getUser,
    getUserByToken,
    createUser,
    addPersonalScore: addPersonalScore,
    addGlobalScore: addGlobalScore,
    getPersonalScores: getPersonalHighScores,
    getGlobalScores: getGlobalHighScores
  };  

