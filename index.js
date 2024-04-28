const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


// midleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@jahid12.81vfswo.mongodb.net/?retryWrites=true&w=majority&appName=jahid12`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const tourSpotsCollection = client.db("tourismDB").collection("touristsSpot")
        const countriesCollection = client.db("tourismDB").collection("countries")

        // read all data
        app.get('/tourspot', async (req, res) => {
            const cursor = tourSpotsCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        }),
        app.get('/countries', async (req, res) => {
            const cursor = countriesCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        }),



        // Read single data by ID
        app.get('/tourspot/id/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tourSpotsCollection.findOne(query);
            res.send(result);
        });

        // Read data by email
        app.get('/tourspot/email/:email', async (req, res) => {
            const email = req.params.email;
            const cursor = tourSpotsCollection.find({ email: email });
            const result = await cursor.toArray();
            res.send(result);
        });



        // add data
        app.post('/tourspot', async (req, res) => {
            const newtourspot = req.body;
            console.log(newtourspot);
            const result = await tourSpotsCollection.insertOne(newtourspot);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})