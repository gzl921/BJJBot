const fs = require('fs');
const path = require('path');

// Google Sheets API setup
const { google } = require('googleapis');

// Function to fetch data from Google Sheets
async function fetchTechniquesFromSheet() {
  try {
    // For public sheets, we can use a simple fetch approach
    const sheetId = '1cEFqBk4BCTKQ1jSrtyb_NNSzcWS72h7x_aU0gdQfPGU';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
    
    const response = await fetch(url);
    const csvText = await response.text();
    
    // Parse CSV data
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    const techniques = [];
    let currentCategory = '';
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      
      // Check if this is a category header (first column has value, others are empty)
      if (values[0] && values.slice(1).every(v => !v)) {
        currentCategory = values[0];
        continue;
      }
      
      // Check if this is a technique row (has technique name)
      if (values[0] && currentCategory) {
        const technique = {
          id: values[0].toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: values[0],
          category: currentCategory,
          origin: `This ${currentCategory.toLowerCase()} technique is a fundamental part of Brazilian Jiu-Jitsu.`,
          description: `A ${currentCategory.toLowerCase()} technique that requires proper execution and timing.`,
          bestResponse: `The best defense against this ${currentCategory.toLowerCase()} is to prevent it before it's fully applied.`
        };
        
        techniques.push(technique);
      }
    }
    
    return techniques;
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return null;
  }
}

// Function to update the techniques file
async function updateTechniquesFile() {
  console.log('🔄 Fetching techniques from Google Sheet...');
  
  const techniques = await fetchTechniquesFromSheet();
  
  if (!techniques) {
    console.log('❌ Failed to fetch techniques, using fallback data');
    return;
  }
  
  const techniquesFile = path.join(__dirname, '../src/data/techniques.ts');
  
  const fileContent = `export interface Technique {
  id: string;
  name: string;
  category: string;
  origin: string;
  description: string;
  bestResponse: string;
}

export const techniques: Technique[] = ${JSON.stringify(techniques, null, 2)};
`;

  fs.writeFileSync(techniquesFile, fileContent);
  
  console.log(`✅ Updated ${techniques.length} techniques from Google Sheet`);
  console.log('📁 File updated: src/data/techniques.ts');
}

// Run the update
updateTechniquesFile(); 