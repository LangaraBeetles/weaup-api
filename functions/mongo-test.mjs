import connect from "../db.mjs";

export default async (req, context) => {
  await connect(
    async (client) => {
      const database = client.db("test");
      const collection = database.collection("beetlesTest");

      const documents = await collection.find().toArray();

      if (documents.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "No documents found." }),
        };
      }

      return new Response(JSON.stringify(documents));
    },
    () => {
      console.error("Database query failed", error);
    }
  );
};
