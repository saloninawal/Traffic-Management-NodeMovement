// Import required libraries
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Initialize signal control parameters
let isGreen = true;
let greenDuration = 10000; // 10 seconds
let redDuration = 5000;   // 5 seconds

// Serve a basic web interface for traffic signal control
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Socket.io for real-time communication with the traffic signal node
io.on('connection', (socket) => {
  // Send the current state of the traffic signal to the client
  socket.emit('signal state', isGreen ? 'Green' : 'Red');
  
  // Listen for signal change requests from the client
  socket.on('change signal', (newState) => {
    if (newState === 'Green') {
      isGreen = true;
    } else {
      isGreen = false;
    }
    
    // Inform all connected clients about the signal state change
    io.emit('signal state', isGreen ? 'Green' : 'Red');
  });
});

// Periodically switch the traffic signal state (for demonstration purposes)
setInterval(() => {
  isGreen = !isGreen;
  io.emit('signal state', isGreen ? 'Green' : 'Red');
}, isGreen ? greenDuration : redDuration);

// Start the server
const port = 3000;
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

