const https = require('https');
const fs = require('fs');

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, status: err.message });
    });
  });
}

async function run() {
  const s = fs.readFileSync('src/utils/seed.js', 'utf8');
  const urls = [...new Set(s.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+(\?w=600)?/g) || [])];
  
  console.log(`Checking ${urls.length} unique URLs...`);
  let fails = 0;
  for (let i=0; i<urls.length; i++) {
    const res = await checkUrl(urls[i]);
    if (res.status !== 200) {
      console.log(`FAIL ${res.status}: ${res.url}`);
      fails++;
    } else {
      console.log(`OK 200: ${res.url}`);
    }
  }
  if (fails > 0) {
    console.log('Some images are failing (404/403).');
  } else {
    console.log('All checked images are OK.');
  }
}

run();
