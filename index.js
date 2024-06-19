const { exec } = require('child_process');
const express = require('express');

// تعيين المنفذ الذي يعمل عليه الخادم الحالي
const localPort = 3000;
const subdomain = 'oussamatester';

// استخدام الأمر lxp لتشغيل النفق باستخدام LocalXpose
const lxpProcess = exec(`localxpose http ${localPort} --subdomain ${subdomain}`);

lxpProcess.stdout.on('data', (data) => {
    console.log(`LocalXpose link with custom subdomain ${subdomain}: ${data}`);
});

lxpProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

lxpProcess.on('close', (code) => {
    console.log(`LocalXpose process exited with code ${code}`);
});

// إنشاء تطبيق Express
const app = express();

// تعريف مسار للطلبات إلى الخادم الحالي
app.get('/', (req, res) => {
    res.send('Hello, World from local server!');
});

// بدء استماع الخادم الحالي
app.listen(localPort, () => {
    console.log(`Local server running on port ${localPort}`);
});
