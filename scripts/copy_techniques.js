const fs = require('fs');
const path = require('path');

// Read the TypeScript file
const techniquesFile = path.join(__dirname, '../src/data/techniques.ts');
const content = fs.readFileSync(techniquesFile, 'utf8');

// Extract the techniques array
const techniquesMatch = content.match(/export const techniques: Technique\[\] = (\[[\s\S]*?\]);/);
if (!techniquesMatch) {
  console.error('Could not find techniques array in the file');
  process.exit(1);
}

const techniquesArray = techniquesMatch[1];

// Convert to JavaScript format
const jsTechniques = techniquesArray
  .replace(/export const techniques: Technique\[\] = /, '')
  .replace(/Technique\[\]/, '')
  .replace(/export interface Technique \{[\s\S]*?\}/, '');

// Write to a new file
const outputFile = path.join(__dirname, 'techniques_data.js');
fs.writeFileSync(outputFile, `module.exports = ${jsTechniques};`);

console.log('Techniques data extracted to scripts/techniques_data.js');
console.log('You can now import this in your migration script.'); 