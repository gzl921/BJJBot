#!/usr/bin/env python3
import requests
import json
import re
from pathlib import Path

def fetch_techniques_from_sheet():
    """Fetch techniques from Google Sheet and parse them"""
    sheet_id = '1cEFqBk4BCTKQ1jSrtyb_NNSzcWS72h7x_aU0gdQfPGU'
    url = f'https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:json'
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Remove the google.visualization.Query.setResponse wrapper
        json_str = response.text
        json_str = re.search(r'google\.visualization\.Query\.setResponse\((.*)\);', json_str)
        if json_str:
            data = json.loads(json_str.group(1))
        else:
            raise Exception("Could not parse Google Sheets response")
        
        # Parse the data
        techniques = []
        current_category = ""
        
        if 'table' in data and 'rows' in data['table']:
            for row in data['table']['rows']:
                if 'c' in row:
                    cells = [cell.get('v', '') if cell else '' for cell in row['c']]
                    
                    # Check if this is a category header (first column has value, others are empty)
                    if cells[0] and all(not cell for cell in cells[1:]):
                        current_category = cells[0]
                        continue
                    
                    # Check if this is a technique row (has technique name)
                    if cells[0] and current_category:
                        technique = {
                            "id": re.sub(r'[^a-z0-9]', '-', cells[0].lower()),
                            "name": cells[0],
                            "category": current_category,
                            "origin": f"This {current_category.lower()} technique is a fundamental part of Brazilian Jiu-Jitsu.",
                            "description": f"A {current_category.lower()} technique that requires proper execution and timing.",
                            "bestResponse": f"The best defense against this {current_category.lower()} is to prevent it before it's fully applied."
                        }
                        techniques.append(technique)
        
        return techniques
        
    except Exception as e:
        print(f"Error fetching from Google Sheets: {e}")
        return None

def update_techniques_file():
    """Update the techniques.ts file with data from Google Sheets"""
    print("🔄 Fetching techniques from Google Sheet...")
    
    techniques = fetch_techniques_from_sheet()
    
    if not techniques:
        print("❌ Failed to fetch techniques, using fallback data")
        return
    
    # Create the TypeScript file content
    file_content = f"""export interface Technique {{
  id: string;
  name: string;
  category: string;
  origin: string;
  description: string;
  bestResponse: string;
}}

export const techniques: Technique[] = {json.dumps(techniques, indent=2)};
"""
    
    # Write to the techniques.ts file
    techniques_file = Path(__file__).parent.parent / "src" / "data" / "techniques.ts"
    techniques_file.write_text(file_content)
    
    print(f"✅ Updated {len(techniques)} techniques from Google Sheet")
    print(f"📁 File updated: {techniques_file}")
    
    # Print categories for verification
    categories = set(tech['category'] for tech in techniques)
    print(f"📊 Categories found: {', '.join(sorted(categories))}")

if __name__ == "__main__":
    update_techniques_file() 