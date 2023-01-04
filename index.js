const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@blogs.rzvskta.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        const blogsCollection = client.db("blogs-database").collection("blogs-collection");
        app.get("/blogs", async (req, res) => {
            const blogs = await blogsCollection.find().toArray();
            res.send(blogs);
        });
        app.post("/blog", async (req, res) => {
            const blog = req.body;
            const result = await blogsCollection.insertOne(blog);
            res.send(result);
        });
        app.patch("/blog", async (req, res) => {
            const blog = req.body;
            const filter = { _id: ObjectId(req.body._id) };
            delete blog._id;

            const updateDoc = {
                $set: blog
            };
            const result = await blogsCollection.updateOne(filter, updateDoc);
            res.send(result);
        });
        app.delete("/blog/:id", async (req, res) => {
            const id = req.params.id;
            const result = await blogsCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });

    }
    finally { };
};
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});