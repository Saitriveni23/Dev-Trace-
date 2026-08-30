const fs = require('fs');
let content = fs.readFileSync('src/services/seedData.ts', 'utf-8');

const replacements = [
  // User changes
  ['Alice Vance', 'Triveni'],
  ['alice.vance', 'triveni'],
  ['alice@devtrace.io', 'triveni@devtrace.io'],
  ["role: 'Core Maintainer'", "role: 'Lead Detective'"],

  ['Bob Miller', 'Alex Rivera'],
  ['bob.miller', 'alex.rivera'],
  ['bob@devtrace.io', 'alex@devtrace.io'],
  ["role: 'Security Officer'", "role: 'Senior Clue Analyst'"],

  ['Dr. Clara Schumann', 'Priya Menon'],
  ['clara.schumann', 'priya.menon'],
  ['clara@devtrace.io', 'priya@devtrace.io'],
  ["role: 'Core Maintainer'", "role: 'Evidence Specialist'"], // we will fix the clash later

  ['David Zhang', 'Jordan Kim'],
  ['david.zhang', 'jordan.kim'],
  ['david@devtrace.io', 'jordan@devtrace.io'],
  ["role: 'Triager'", "role: 'Junior Inspector'"],

  ['Elena Rostova', 'Morgan Lee'],
  ['elena.rostova', 'morgan.lee'],
  ['elena@devtrace.io', 'morgan@devtrace.io'],
  ["role: 'Contributor'", "role: 'Design Sleuth'"],

  // Product changes
  ["name: 'Quantum Engine'", "name: 'Saitriveni/Dev-Trace-'"],
  ["product: 'Quantum Engine'", "product: 'Saitriveni/Dev-Trace-'"],

  ["name: 'Aether Distributed DB'", "name: 'Saitriveni/LibraryManagementSystem'"],
  ["product: 'Aether Distributed DB'", "product: 'Saitriveni/LibraryManagementSystem'"],
  
  ["name: 'CryptoVault Security Core'", "name: 'Saitriveni/clonefest-'"],
  ["product: 'CryptoVault Security Core'", "product: 'Saitriveni/clonefest-'"],
  
  ["name: 'HyperFlow Developer UI'", "name: 'Saitriveni/Project'"],
  ["product: 'HyperFlow Developer UI'", "product: 'Saitriveni/Project'"]
];

replacements.forEach(([search, replace]) => {
  content = content.split(search).join(replace);
});

// Fix the role clash for Dr. Clara Schumann (Priya Menon) which might have been overwritten as 'Lead Detective' instead of 'Evidence Specialist'
// Wait, the order above will replace all "Core Maintainer" with "Lead Detective" in the first pass.
// Let's just fix it for Priya manually
content = content.replace(
  /name: 'Priya Menon',\n    email: 'priya@devtrace.io',\n    avatar: (.*),\n    role: 'Lead Detective'/g,
  "name: 'Priya Menon',\n    email: 'priya@devtrace.io',\n    avatar: $1,\n    role: 'Evidence Specialist'"
);

// And Marcus Thorne
content = content.replace(
  /name: 'Marcus Thorne',\n    email: 'marcus@devtrace.io',\n    avatar: (.*),\n    role: 'Lead Detective'/g,
  "name: 'Marcus Thorne',\n    email: 'marcus@devtrace.io',\n    avatar: $1,\n    role: 'Core Maintainer'"
);

fs.writeFileSync('src/services/seedData.ts', content, 'utf-8');
console.log('Done replacing strings in seedData.ts');
