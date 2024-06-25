const { exec } = require('child_process');
const express = require('express');

const app = express();
const port = 3000;

// Function to execute shell commands asynchronously
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`exec error: ${error}`);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

// Function to get tunnel information
async function getTunnelInfo() {
  try {
    // Download and install Cloudflared
    const downloadCommand = 'wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb && sudo dpkg -i cloudflared-stable-linux-amd64.deb';
    await executeCommand(downloadCommand);

    // Create and configure the tunnel
    const createCommand = 'cloudflared tunnel create my-tunnel';
    await executeCommand(createCommand);

    // Run the tunnel
    const runCommand = 'cloudflared tunnel run my-tunnel &';
    await executeCommand(runCommand);

    // Wait for the tunnel to establish (adjust sleep time as needed)
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Get tunnel info
    const infoCommand = 'cloudflared tunnel info my-tunnel';
    const infoOutput = await executeCommand(infoCommand);

    // Extract endpoint URL from the info (assuming it follows a specific format)
    const endpointUrl = infoOutput.match(/https:\/\/[\w./?=+-]+/)[0];

    // Print the endpoint URL to console
    console.log('Cloudflare Tunnel URL:');
    console.log(endpointUrl);

  } catch (err) {
    console.error('Error:', err);
  }
}

// Route to handle root URL
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server and get tunnel info
app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await getTunnelInfo();
});
