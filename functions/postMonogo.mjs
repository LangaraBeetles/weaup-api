import { MongoClient } from 'mongodb';

export default async (req, context) => {
  if (req.method === 'GET') {
    const form = `
      <form method="POST">
        <label for="inputData">Enter data:</label><br>
        <input type="text" id="inputData" name="inputData"><br><br>
        <button type="submit">Submit</button>
      </form>
    `;
  
    return new Response(form, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } else if (req.method === 'POST') {
    const { DB_CONNECTION } = process.env;
  
    try {
      const client = new MongoClient(DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
      
      const db = client.db();
      const collection = db.collection('testing');
      
      const data = await req.formData();
      const inputData = data.get('inputData');
      
      const result = await collection.insertOne({ inputData });
      
      client.close();
      
      return new Response(JSON.stringify({ message: "Successfully", insertedId: result.insertedId }), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ message: "Error", error: err.message }), { status: 500 });
    }
  } else {
    return new Response("Method not allowed", { status: 405 });
  }
};
