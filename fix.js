const fs = require('fs');
let code = fs.readFileSync('js/quiz.js', 'utf8');
code = code.split('\\n').join('\n');
fs.writeFileSync('js/quiz.js', code);
