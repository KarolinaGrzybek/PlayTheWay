const https = require('https');

const data = `[out:json][timeout:25];
(
  nwr["historic"]["name"](around:5000,50.0647,19.9450);
  nwr["tourism"]["name"](around:5000,50.0647,19.9450);
);
out center tags 150;`;

const req = https.request('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Node.js test script',
    'Accept': '*/*'
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      if (parsed.elements) {
        console.log("Found: " + parsed.elements.length);
      } else {
        console.log("Error or remark: " + parsed.remark);
      }
    } catch(e) {
      console.log(body.substring(0, 500));
    }
  });
});
req.write('data=' + encodeURIComponent(data));
req.end();
