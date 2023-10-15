const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

app.use(cors());
// Stopped video at 17:55

app.get('/hello', (req, res) => {
  res.send('Hello, world!');
});

const mongoURI = 'mongodb://0.0.0.0:27017'; 
const dbName = 'quiz08'; 
const collectionName = 'budgetData'; 


app.get('/budget', async (req, res) => {
  try {
    
    const client = new MongoClient(mongoURI);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    
    const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
    if (!collectionExists) {
      await db.createCollection(collectionName);
      console.log(`Created collection: ${collectionName}`);
    }

    const data = await collection.find({}).toArray();
    client.close();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/budget', jsonParser, async (req, res) => {
  try {
    
    const client = new MongoClient(mongoURI);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    
    const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
    if (!collectionExists) {
      await db.createCollection(collectionName);
      console.log(`Created collection: ${collectionName}`);
    }

    console.log(req.body);

    await collection.insertOne(req.body);
    
    client.close();

    res.status(200).json({status:"ok"});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
