const { spawn } = require('child_process');
const express = require('express');

const app = express();
const port = 3000;

// اسم النفق الثابت
const tunnelName = 'my-tunnel';

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

  // تشغيل النفق باستخدام cloudflared ومعرف النفق الثابت
  const cloudflared = spawn('cloudflared', ['tunnel', 'run', tunnelName]);

  cloudflared.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);

    const match = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (match) {
      console.log(`Cloudflare Tunnel URL: ${match[0]}`);
    }
  });

  cloudflared.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  cloudflared.on('close', (code) => {
    console.log(`cloudflared process exited with code ${code}`);
  });
});
