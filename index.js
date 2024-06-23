const { exec } = require('child_process');
const app = require('express')();
const port = 8080;

let serverLinkPrinted = false;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  const pagekiteProcess = exec(`pagekite.py ${port} yourname.pagekite.me`);

  pagekiteProcess.stdout.on('data', (data) => {
    const pagekiteLink = data.toString().trim();
    if (!serverLinkPrinted) {
      console.log(`Pagekite link: ${pagekiteLink}`);
      serverLinkPrinted = true;
    }
  });

  pagekiteProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data.toString().trim()}`);
  });

  pagekiteProcess.on('close', (code) => {
    console.log(`Pagekite process exited with code ${code}`);
  });
});
