const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  exec(`ssh -R 80:localhost:3000 2a924f8b-fa5b-4138-aec8-5f7cc3dcf2ab-00-15m0i147x074o.picard.replit.dev:3000`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`Public URL: ${stdout}`);
  });
});
