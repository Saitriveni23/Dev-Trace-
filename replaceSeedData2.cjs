const fs = require('fs');
let content = fs.readFileSync('src/services/seedData.ts', 'utf-8');

const replacements = [
  ["Saitriveni/Dev-Trace-", "Case #104: The Phantom Scroll"],
  ["Saitriveni/LibraryManagementSystem", "Case #209: Memory Leak Mystery"],
  ["Saitriveni/clonefest-", "Case #301: Rogue API Call"],
  ["Saitriveni/Project", "Case #404: Missing Auth Token"]
];

replacements.forEach(([search, replace]) => {
  content = content.split(search).join(replace);
});

fs.writeFileSync('src/services/seedData.ts', content, 'utf-8');
console.log('Done replacing Saitriveni repos with Case File themes in seedData.ts');
