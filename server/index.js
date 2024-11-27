const express = require('express');
const axios = require('axios');
const http = require('http');
const WebSocket = require('ws'); // Import the WebSocket library
require('dotenv').config();
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // Create a WebSocket server

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    console.log("Received request to /chat");
    const { userMessage } = req.body;
    // Simulated response
    const mockResponse = { botMessage: `You said: ${userMessage}` };
    res.json(mockResponse);
});


wss.on('connection', (ws) => {
    console.log('User connected');
    ws.on('message', (message) => {
        console.log('received: %s', message);
        // Broadcast the message to all clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('User disconnected');
    });
});

server.listen(5000, () => console.log('Server running on port 5000'));
