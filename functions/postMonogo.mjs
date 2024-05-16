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
      const inputData = (await req.formData()).get('inputData');
  
      try {
        const response = await fetch(DB_CONNECTION, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputData }),
        });
  
        const data = await response.json();
  
        return new Response(JSON.stringify({ message: "Document inserted successfully", insertedId: data.insertedId }), { status: 200 });
      } catch (error) {
        return new Response(JSON.stringify({ message: "Error inserting document", error: error.message }), { status: 500 });
      }
    } else {
      return new Response("Method not allowed", { status: 405 });
    }
  };
  