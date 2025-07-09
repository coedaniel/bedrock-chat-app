#!/bin/bash

# Deploy Frontend Script for Bedrock Chat App
# Usage: ./scripts/deploy-frontend.sh [api-url]

set -e

API_URL=$1

if [ -z "$API_URL" ]; then
    echo "❌ API URL is required"
    echo "Usage: ./scripts/deploy-frontend.sh <api-url>"
    echo "Example: ./scripts/deploy-frontend.sh https://abc123.execute-api.us-east-1.amazonaws.com/prod/chat"
    exit 1
fi

echo "🚀 Deploying Bedrock Chat Frontend..."
echo "API URL: ${API_URL}"

# Check if Amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    echo "⚠️  Amplify CLI not found. Installing..."
    npm install -g @aws-amplify/cli
fi

# Update the API URL in the store
echo "📝 Updating API URL in chatStore.ts..."
sed -i "s|https://[^']*execute-api[^']*|${API_URL}|g" store/chatStore.ts

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building the application..."
npm run build

echo "✅ Frontend ready for deployment!"
echo ""
echo "To deploy to AWS Amplify:"
echo "1. Push your code to GitHub"
echo "2. Connect your GitHub repo to AWS Amplify"
echo "3. Amplify will automatically build and deploy"
echo ""
echo "Or deploy manually:"
echo "1. Upload the .next folder to your hosting service"
echo "2. Configure your hosting to serve the static files"
