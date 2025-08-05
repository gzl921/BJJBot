#!/bin/bash

echo "🥋 Updating BJJ Techniques App..."

# Update techniques from Google Sheet
echo "📊 Fetching latest techniques from Google Sheet..."
python3 scripts/update_techniques.py

# Build the app
echo "🔨 Building the app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ App updated and built successfully!"
    echo ""
    echo "🚀 Ready to deploy:"
    echo "1. Drag the 'build' folder to Netlify"
    echo "2. Or run: npx vercel"
    echo "3. Or run: npm run deploy (for GitHub Pages)"
    echo ""
    echo "📱 Your app is now updated with the latest techniques!"
else
    echo "❌ Build failed. Please check for errors."
    exit 1
fi 