// server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors package
const app = express();
const port = 3000; // You can change this port if needed

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Proxy endpoint
app.get('/fetch-firmware', async (req, res) => {
  try {
    const response = await axios.get('https://github.com/moszer/FIRMWARE/raw/main/esp32-c3-otaV1.0.bin', {
      responseType: 'arraybuffer'  // Ensure binary data is correctly received
    });
    res.set('Content-Type', 'application/octet-stream');
    res.send(response.data);
    console.log(response.data);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching firmware', details: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
