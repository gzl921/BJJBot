#!/bin/bash

echo "🥋 Building BJJ Techniques App..."

# Build the app
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Deployment Options:"
    echo "1. Netlify (Recommended):"
    echo "   - Go to netlify.com"
    echo "   - Drag and drop the 'build' folder"
    echo "   - Get instant URL"
    echo ""
    echo "2. Vercel:"
    echo "   - Run: npx vercel"
    echo "   - Follow the prompts"
    echo ""
    echo "3. GitHub Pages:"
    echo "   - Run: npm run deploy"
    echo "   - Enable Pages in repo settings"
    echo ""
    echo "4. Local Network Sharing:"
    echo "   - Run: npx serve -s build -l 3000"
    echo "   - Share your IP address"
    echo ""
    echo "📁 Your built app is in the 'build' folder"
    echo "🌐 Ready to deploy!"
else
    echo "❌ Build failed. Please check for errors."
    exit 1
fi 