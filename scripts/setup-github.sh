#!/bin/bash

# GitHub Setup Script for Bedrock Chat App
# This script helps you create and push the repository to GitHub

set -e

echo "🚀 GitHub Setup for Bedrock Chat App"
echo "===================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run this from the project root."
    exit 1
fi

# Get GitHub username and repository name
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter repository name (default: bedrock-chat-app): " REPO_NAME
REPO_NAME=${REPO_NAME:-bedrock-chat-app}

echo ""
echo "📋 Repository Details:"
echo "Username: $GITHUB_USERNAME"
echo "Repository: $REPO_NAME"
echo "URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

read -p "Is this correct? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled."
    exit 1
fi

echo ""
echo "🔧 Setting up GitHub repository..."

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI found"
    
    # Create repository using GitHub CLI
    echo "📦 Creating GitHub repository..."
    gh repo create "$REPO_NAME" --public --description "A modern chat application built with Next.js and AWS Bedrock" --clone=false
    
    # Set remote origin
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    
else
    echo "⚠️  GitHub CLI not found. Please:"
    echo "1. Go to https://github.com/new"
    echo "2. Create a repository named: $REPO_NAME"
    echo "3. Make it public"
    echo "4. Don't initialize with README (we already have one)"
    echo ""
    read -p "Press Enter when you've created the repository..."
    
    # Set remote origin
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
fi

# Update README with correct repository URL
echo "📝 Updating README with repository URL..."
sed -i "s|<your-repo-url>|https://github.com/$GITHUB_USERNAME/$REPO_NAME.git|g" README.md
sed -i "s|yourusername|$GITHUB_USERNAME|g" README.md
sed -i "s|bedrock-chat-app|$REPO_NAME|g" project.config.json

# Commit the URL updates
git add README.md project.config.json
git commit -m "📝 Update repository URLs and configuration" || echo "No changes to commit"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "🎉 Success! Your repository is now on GitHub!"
echo "🔗 Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "📋 Next Steps:"
echo "1. ⭐ Star your repository (optional but nice!)"
echo "2. 📝 Edit the README.md to add your personal touch"
echo "3. 🔧 Set up AWS credentials for GitHub Actions (if you want CI/CD):"
echo "   - Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/secrets/actions"
echo "   - Add: AWS_ACCESS_KEY_ID"
echo "   - Add: AWS_SECRET_ACCESS_KEY"
echo "4. 🚀 Deploy your app using: ./scripts/setup.sh"
echo ""
echo "🎯 Your Bedrock Chat App is ready for the world!"
