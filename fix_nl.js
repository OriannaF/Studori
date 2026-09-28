const fs = require('fs');
let code = fs.readFileSync('js/ui.js', 'utf8');

// The issue is a literal newline inside double quotes.
// It looks like: ].join("\r\n"); where \n is a physical newline.
code = code.replace(/\r\n/g, '\n'); // Normalize first
code = code.replace(/\n"\);/g, '\\n");'); // Fix any broken literal strings ending in ");

// Let's do it safer:
// ].join("\r
// ");
code = code.replace(/\]\.join\(\"\\r\n\"\);/g, '].join(\"\\\\r\\\\n\");');

// We also need to fix the modal we inserted earlier!
// \n was converted to physical newlines. We should make sure no physical newlines exist inside single/double quotes.
// Let's just fix the exact spot that threw the error.

fs.writeFileSync('js/ui.js', code);
