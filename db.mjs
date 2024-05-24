import { MongoClient } from "mongodb";

const connect = async (onSuccess, onError) => {
  try {
    const uri = process.env.DB_CONNECTION;

    let client;
    let clientPromise;

    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      clientPromise = await client.connect();
      global._mongoClientPromise = clientPromise;
    } else {
      clientPromise = global._mongoClientPromise;
    }

    return onSuccess?.(clientPromise);
  } catch (error) {
    console.error("Database query failed", error);
    const errorCallback = onError?.(error);

    if (errorCallback) {
      return errorCallback;
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};

export default connect;
