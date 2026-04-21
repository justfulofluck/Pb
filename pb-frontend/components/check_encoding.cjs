
const fs = require('fs');
const buffer = fs.readFileSync('e:\\Clent\\Projects\\Pb\\pb-frontend\\components\\AdminDashboard.tsx');
console.log('First 10 bytes:', buffer.slice(0, 10).toString('hex'));
