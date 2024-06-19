const { exec } = require('child_process');
const port = 8080;
const express = require("express");
const app = express();
app.get("/", function (_req, res) {
  res.sendStatus(200);
});

let serverLinkPrinted = false;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  
  const tryLocaltunnel = () => {
    const subdomain = 'oussamatest'; // اختر اسم نطاق مخصص
    const localtunnelProcess = exec(`lt --port ${port} --subdomain ${subdomain}`);

    localtunnelProcess.stdout.on('data', (data) => {
      const localtunnelLink = data.toString().trim();
      if (!serverLinkPrinted) {
        console.log(`Localtunnel link: ${localtunnelLink}`);
        serverLinkPrinted = true;
      }
    });

    localtunnelProcess.stderr.on('data', (data) => {
      const errorMessage = data.toString().trim();
      console.error(`stderr: ${errorMessage}`);
      const knownErrors = [
        "Error: connection refused",
        "localtunnel server could not be reached"
      ];
      if (knownErrors.some(error => errorMessage.includes(error))) {
        console.log('Error detected, retrying...');
        serverLinkPrinted = false;
        localtunnelProcess.kill();
        
        // تنظيف الكونسول
        process.stdout.write('\x1Bc');
        
        // إعادة محاولة الاتصال
        tryLocaltunnel();
      }
    });

    localtunnelProcess.on('close', (code) => {
      console.log(`Localtunnel process exited with code ${code}`);
    });
  };

  tryLocaltunnel();
});
