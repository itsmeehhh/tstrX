const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 8080;
const subdomain = 'ousamatester'; // تحديد معرف ثابت هنا

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  
  const tryLocalTunnel = () => {
    const localTunnelProcess = exec(`lt --port ${port} --subdomain ${subdomain} --allow-invalid-cert`);

    localTunnelProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      console.log(output);
      if (output.startsWith('your url is:')) {
        const localTunnelLink = output.split('your url is: ')[1];
        console.log(`LocalTunnel link: ${localTunnelLink}`);
      }
    });

    localTunnelProcess.stderr.on('data', (data) => {
      const errorMessage = data.toString().trim();
      console.error(`stderr: ${errorMessage}`);
      const knownErrors = [
        "Error: connection refused",
        "localtunnel server could not be reached"
      ];
      if (knownErrors.some(error => errorMessage.includes(error))) {
        console.log('Error detected, retrying...');
        localTunnelProcess.kill();
        process.stdout.write('\x1Bc');
        tryLocalTunnel();
      }
    });

    localTunnelProcess.on('close', (code) => {
      console.log(`LocalTunnel process exited with code ${code}`);
    });
  };

  tryLocalTunnel();
});
