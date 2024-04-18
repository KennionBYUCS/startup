const { MongoClient } = require('mongodb');
//const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const personalScoreCollection = db.collection('personal');
const globalScoreCollection = db.collection('global');
const shapeCollection = db.collection('shape');

(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
  })().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  });

  function getUser(username) {
    console.log(username);
    return userCollection.findOne({ username: username });
  }
  
  function getUserByToken(token) {
    return userCollection.findOne({ token: token });
  }
  
  async function createUser(username, password) {
    // Hash the password before we insert it into the database
    // not implemented due to bcrypt compilation error (ask David Bauch)
    const passwordHash = password; //await bcrypt.hash(password, 10);
  
    const user = {
      username: username,
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

  function addShape(shape) {
    shapeCollection.insertOne(shape);
  }

  function getPersonalHighScores() {
    const query = { accuracy: { $gt: 50, $lt: 100 } };
    const options = {
      sort: { accuracy: -1 },
      limit: 12,
    };
    const cursor = personalScoreCollection.find(query, options);
    return cursor.toArray();
  }

  function getGlobalHighScores() {
    const query = { accuracy: { $gt: 50, $lt: 100 } };
    const options = {
      sort: { accuracy: -1 },
      limit: 12,
    };
    const cursor = globalScoreCollection.find(query, options);
    return cursor.toArray();
  }

  function getShape(username) {
    const query = { username : username };
    const options = {
        limit: 1
    }
    const cursor = shapeCollection.find(query, options);
    return cursor.toArray();

  }
  
  module.exports = {
    getUser,
    getUserByToken,
    createUser,
    addPersonalScore,
    addGlobalScore,
    addShape,
    getPersonalScores: getPersonalHighScores,
    getGlobalScores: getGlobalHighScores,
    getShape
  };  

