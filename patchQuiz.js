const fs = require('fs');
let code = fs.readFileSync('js/quiz.js', 'utf8');

const search = 'if (S.currentHash === "all") {';
const replace = 'if (S.currentHash === "all") {';
// I will just use string replacement.
let replaceCode = 'if (S.currentHash === "all") {\\n      S.questionnaires.forEach(q => { questions = questions.concat(q.questions); });\\n    } else if (S.currentHash === "custom_exam" && S.examHashes) {\\n      S.questionnaires.forEach(q => {\\n        if (S.examHashes.includes(q.hash)) {\\n          questions = questions.concat(q.questions);\\n        }\\n      });\\n    } else';

code = code.replace(/if \(S\.currentHash === "all"\) \{\s*S\.questionnaires\.forEach\(q => \{ questions = questions\.concat\(q\.questions\); \}\);\s*\} else/, replaceCode);

const startCustomExamFunc = '  function startCustomExam(hashes, timeMins, size) {\\n    S.currentHash = "custom_exam";\\n    S.examHashes = hashes;\\n    S.name = "Simulacro de Examen";\\n    S.settings.mode = "timed";\\n    S.settings.timedMinutes = timeMins;\\n    S.settings.timedSize = size;\\n    S.settings.cat = "";\\n    S.settings.typeFilter = "";\\n    setExamIndex(0);\\n    newSession();\\n  }\\n';

code = code.replace('function newSession() {', startCustomExamFunc + '\\n  function newSession() {');
code = code.replace('setExamIndex,', 'setExamIndex, startCustomExam,');

fs.writeFileSync('js/quiz.js', code);
