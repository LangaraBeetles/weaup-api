
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// functions/mongo-test.mjs
import { MongoClient } from "mongodb";
var mongo_test_default = async (req, context) => {
  const uri = process.env.DB_CONNECTION;
  const client = new MongoClient(uri);
  await client.connect();
  try {
    const database = client.db("test");
    const collection = database.collection("beetlesTest");
    const documents = await collection.find().toArray();
    return new Response("user:" + documents[0].user + "\nresult:" + documents[0].resutl);
  } finally {
    await client.close();
  }
};
export {
  mongo_test_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZnVuY3Rpb25zL21vbmdvLXRlc3QubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBNb25nb0NsaWVudCB9IGZyb20gJ21vbmdvZGInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHJlcSwgY29udGV4dCkgPT4ge1xyXG4gICAgY29uc3QgdXJpID0gcHJvY2Vzcy5lbnYuREJfQ09OTkVDVElPTjtcclxuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBNb25nb0NsaWVudCh1cmkpO1xyXG4gICAgYXdhaXQgY2xpZW50LmNvbm5lY3QoKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGRhdGFiYXNlID0gY2xpZW50LmRiKCd0ZXN0Jyk7XHJcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IGRhdGFiYXNlLmNvbGxlY3Rpb24oJ2JlZXRsZXNUZXN0Jyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRvY3VtZW50cyA9IGF3YWl0IGNvbGxlY3Rpb24uZmluZCgpLnRvQXJyYXkoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShcInVzZXI6XCIgKyBkb2N1bWVudHNbMF0udXNlciArIFwiXFxucmVzdWx0OlwiICsgZG9jdW1lbnRzWzBdLnJlc3V0bCk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIGF3YWl0IGNsaWVudC5jbG9zZSgpO1xyXG4gICAgfVxyXG59O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7O0FBQUEsU0FBUyxtQkFBbUI7QUFFNUIsSUFBTyxxQkFBUSxPQUFPLEtBQUssWUFBWTtBQUNuQyxRQUFNLE1BQU0sUUFBUSxJQUFJO0FBQ3hCLFFBQU0sU0FBUyxJQUFJLFlBQVksR0FBRztBQUNsQyxRQUFNLE9BQU8sUUFBUTtBQUVyQixNQUFJO0FBRUEsVUFBTSxXQUFXLE9BQU8sR0FBRyxNQUFNO0FBQ2pDLFVBQU0sYUFBYSxTQUFTLFdBQVcsYUFBYTtBQUVwRCxVQUFNLFlBQVksTUFBTSxXQUFXLEtBQUssRUFBRSxRQUFRO0FBRWxELFdBQU8sSUFBSSxTQUFTLFVBQVUsVUFBVSxDQUFDLEVBQUUsT0FBTyxjQUFjLFVBQVUsQ0FBQyxFQUFFLE1BQU07QUFBQSxFQUN2RixVQUFFO0FBQ0UsVUFBTSxPQUFPLE1BQU07QUFBQSxFQUN2QjtBQUNKOyIsCiAgIm5hbWVzIjogW10KfQo=
