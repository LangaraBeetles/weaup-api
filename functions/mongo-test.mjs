import clientPromise from "../db.mjs";

export default async (req, context) => {

    try {
        
        const client = await clientPromise;

        const database = client.db('test');
        const collection = database.collection('beetlesTest');

        const documents = await collection.find().toArray();

        if (documents.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'No documents found.' }),
            };
        }

        return new Response(JSON.stringify(documents));
        
    } catch (error) {
        console.error('Database query failed', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Database query failed' }),
        };
    }
};
