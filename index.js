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
  const serveoProcess = exec('ssh -tt -i "./0" -o StrictHostKeyChecking=no -R nw:80:localhost:8080 serveo.net');

  serveoProcess.stdout.on('data', (data) => {
    const serveoLink = data.toString().trim();
    if (!serverLinkPrinted) {
      console.log(`Serveo link: ${serveoLink}`);
      serverLinkPrinted = true;
    }
  });

  serveoProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  serveoProcess.on('close', (code) => {
    console.log(`Serveo process exited with code ${code}`);
  });
});
