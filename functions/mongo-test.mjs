import { MongoClient } from 'mongodb';

export default async (req, context) => {
    const uri = process.env.DB_CONNECTION;
    const client = new MongoClient(uri);
    await client.connect();

    try {
        
        const database = client.db('test');
        const collection = database.collection('beetlesTest');

        const documents = await collection.find().toArray();

        return new Response("user:" + documents[0].user + "\nresult:" + documents[0].resutl);
    } finally {
        await client.close();
    }
};
