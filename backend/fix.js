const fs = require('fs');
let content = fs.readFileSync('src/utils/seed.js', 'utf8');
content = content.replace(/\\\\'s/g, "\\'s");
fs.writeFileSync('src/utils/seed.js', content, 'utf8');
console.log('Fixed quotes in seed.js');
