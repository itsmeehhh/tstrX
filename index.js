const { exec } = require('child_process');
const express = require('express');

// تعيين المنفذ الذي يعمل عليه الخادم الحالي
const localPort = 3000;
const subdomain = 'your_custom_subdomain';

// استخدام الأمر serve لتشغيل الخادم الحالي
const serveProcess = exec(`serve -s build -l ${localPort}`);

serveProcess.stdout.on('data', (data) => {
    console.log(`Serve link with custom subdomain ${subdomain}: ${data}`);
});

serveProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

serveProcess.on('close', (code) => {
    console.log(`Serve process exited with code ${code}`);
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

// استخدام طلب HTTP لإرسال طلب إلى الخادم الآخر
const https = require('https');

const options = {
    hostname: `${subdomain}.serveo.net`,
    port: 443,
    path: '/',
    method: 'GET'
};

const req = https.request(options, (res) => {
    console.log(`Response from other server: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`Response body: ${chunk}`);
    });
});

req.on('error', (error) => {
    console.error(`Error making request to other server: ${error}`);
});

req.end();
