import { MongoClient } from 'mongodb';

const uri = process.env.DB_CONNECTION;

let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    clientPromise = client.connect();
    global._mongoClientPromise = clientPromise;
} else {
    clientPromise = global._mongoClientPromise;
}

export default clientPromise; 