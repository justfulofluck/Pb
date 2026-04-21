
const fs = require('fs');
const content = fs.readFileSync('e:\\Clent\\Projects\\Pb\\pb-frontend\\components\\AdminDashboard.tsx', 'utf8');

const lines = content.split('\n');
let parens = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const oldParens = parens;
    for (let j = 0; j < line.length; j++) {
        if (line[j] === '(') parens++;
        if (line[j] === ')') parens--;
    }
    if (parens !== oldParens) {
        // Only log if balance changes on this line, or if it's a tab header
        if (line.includes('activeTab') || line.includes('View:')) {
            console.log(`Line ${i + 1}: Balance ${parens} | ${line.trim()}`);
        }
    }
}

console.log('Final Parens balance:', parens);
