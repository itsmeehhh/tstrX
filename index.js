const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('Hello World');
});
let serverLinkPrinted = false;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  const trySSH = () => {
    const serveoProcess = exec('ssh -tt -i "./0" -o StrictHostKeyChecking=no -R os-tstr:80:localhost:8080 serveo.webflow.io');

    serveoProcess.stdout.on('data', (data) => {
      const serveoLink = data.toString().trim();
      if (!serverLinkPrinted) {
        console.log(`Serveo link: ${serveoLink}`);
        serverLinkPrinted = true;
      }
    });

    serveoProcess.stderr.on('data', (data) => {
      const errorMessage = data.toString().trim();
      console.error(`stderr: ${errorMessage}`);
      const knownErrors = [
        "remote port forwarding failed for listen port 80",
        "client_loop: send disconnect: Broken pipe"
        //"ssh: connect to host serveo.net port 22: Connection refused"
      ];
      if (knownErrors.some(error => errorMessage.includes(error))) {
        console.log('Error detected, retrying...');
        serverLinkPrinted = false;
        serveoProcess.kill();
        trySSH();
      }
    });

    serveoProcess.on('close', (code) => {
      console.log(`Serveo process exited with code ${code}`);
    });
  };

  trySSH();
});
