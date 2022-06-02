const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbyjx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const saymanInformation = client.db("saymanRabbi").collection('user');
        app.post('/data', async (req, res) => {
            const data = req.body
            console.log(data)
            const result = await saymanInformation.insertOne(data)
            res.send({messages: 'success'})
        })
        app.get('/active',async (req, res) => {
            const query = {}
            const result = await saymanInformation.find(query).toArray()
            res.send(result)
        })

        app.put('/active', async (req, res) => {
            const id = req.query.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const value = req.body.active
            const updateDoc = {
              $set: {
                isactive: value
              },
            };
            const result = await saymanInformation.updateOne(filter, updateDoc, options);
            res.send({success:result})
        })
        
    }
    finally {
        // await client.close();
    }
  }
 run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})