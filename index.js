const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ig1ef.mongodb.net/doctors_portalDB?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('doctors_portalDB');
        const appointmentsCollection = database.collection('appointments');

        app.get('/appointments', async (req, res) => {
            const { email } = req.query;
            const { date } = req.query;
            console.log(date);
            const query = { email: email }
            const cursor = appointmentsCollection.find(query);
            const appointments = await cursor.toArray();
            res.json(appointments)
        })

        app.post('/appointments', async (req, res) => {
            const appointment = req.body;
            console.log(appointment);
            const result = await appointmentsCollection.insertOne(appointment);
            console.log(result);
            res.json(result)
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Doctors portal!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})