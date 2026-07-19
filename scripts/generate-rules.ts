import fs from 'fs';
import path from 'path';

interface Blueprint {
  collections: {
    [collectionName: string]: {
      rules: {
        read: string;
        write: string;
      };
    };
  };
}

function generateRules() {
  const blueprintPath = path.resolve('firebase-blueprint.json');
  const rulesPath = path.resolve('firestore.rules');

  const blueprintContent = fs.readFileSync(blueprintPath, 'utf-8');
  const blueprint: Blueprint = JSON.parse(blueprintContent);

  let rulesContent = `rules_version = '2';\n\nservice cloud.firestore {\n  match /databases/{database}/documents {\n`;

  for (const [collectionName, config] of Object.entries(blueprint.collections)) {
    rulesContent += `    match /${collectionName}/{id} {\n`;
    rulesContent += `      allow read: if ${config.rules.read};\n`;
    rulesContent += `      allow write: if ${config.rules.write};\n`;
    rulesContent += `    }\n`;
  }

  rulesContent += `  }\n}\n`;

  fs.writeFileSync(rulesPath, rulesContent);
  console.log('Successfully generated firestore.rules');
}

generateRules();
