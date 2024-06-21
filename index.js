const { exec } = require('child_process');
const app = require('express')();
const port = 8080;

let serverLinkPrinted = false;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  
  const tryTelebit = () => {
    const telebitProcess = exec('ssh -p 5050 oussamatester.telebit.io');

    telebitProcess.stdout.on('data', (data) => {
      const telebitLink = data.toString().trim();
      if (!serverLinkPrinted) {
        console.log(`Telebit link: ${telebitLink}`);
        serverLinkPrinted = true;
      }
    });

    telebitProcess.stderr.on('data', (data) => {
      const errorMessage = data.toString().trim();
      console.error(`stderr: ${errorMessage}`);
      const knownErrors = [
        "Error: something went wrong",
      ];
      if (knownErrors.some(error => errorMessage.includes(error))) {
        console.log('Error detected, retrying...');
        serverLinkPrinted = false;
        telebitProcess.kill();
        tryTelebit();
      }
    });

    telebitProcess.on('close', (code) => {
      console.log(`Telebit process exited with code ${code}`);
    });
  };

  tryTelebit();
});
