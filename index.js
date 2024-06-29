const express = require('express');
const { exec } = require('child_process');

const app = express();

// Route handler
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start server and execute command
const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');

  // Execute command to create tunnel
  exec('echo "abcd" | nc 2a924f8b-fa5b-4138-aec8-5f7cc3dcf2ab-00-15m0i147x074o.picard.replit.dev:3001 2222', (err, stdout, stderr) => {
    if (err) {
      console.error('Error executing command:', err);
      return;
    }
    console.log('Command executed successfully:', stdout);
  });
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});
