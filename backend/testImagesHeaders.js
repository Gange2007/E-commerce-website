const https = require('https');
const fs = require('fs');

async function checkUrl(url) {
  return new Promise((resolve) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'http://localhost:3000/'
      }
    };
    https.get(url, options, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, status: err.message });
    });
  });
}

async function run() {
  const s = fs.readFileSync('src/utils/seed.js', 'utf8');
  const urls = [...new Set(s.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+(\?w=600)?/g) || [])];
  
  console.log(`Checking ${urls.length} unique URLs with Browser Headers...`);
  let fails = 0;
  for (let i=0; i<urls.length; i++) {
    const res = await checkUrl(urls[i]);
    if (res.status !== 200) {
      console.log(`FAIL ${res.status}: ${res.url}`);
      fails++;
    }
  }
  console.log(`Failed: ${fails}`);
}
run();
