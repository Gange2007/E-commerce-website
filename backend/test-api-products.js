const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/products',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const parsed = JSON.parse(data);
    if(parsed.products && parsed.products.length > 0) {
      console.log('Sample product images:', JSON.stringify(parsed.products[0].images, null, 2));
    } else {
      console.log('No products returned');
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
