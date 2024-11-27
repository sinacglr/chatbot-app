import React, { useState, useEffect } from 'react';
import axios from 'axios';

const socket = new WebSocket('ws://localhost:5000'); // Create a WebSocket connection

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    // Handle incoming messages from the WebSocket server
    useEffect(() => {
        socket.onmessage = (event) => {
            const message = event.data;
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: message }]);
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = async () => {
        setMessages([...messages, { sender: 'user', text: input }]);
        // Send the user message to the backend for AI processing
        const response = await axios.post('/chat', { userMessage: input });
        const botMessage = response.data.botMessage;
        
        // Send the response to the WebSocket server
        socket.send(botMessage); // Send message to WebSocket server
        
        // Update UI with bot's response
        setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }, { sender: 'bot', text: botMessage }]);
        setInput('');
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <p key={index} className={msg.sender}>
                        {msg.text}
                    </p>
                ))}
            </div>
            <input value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
