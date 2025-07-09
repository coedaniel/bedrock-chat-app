#!/bin/bash

# Complete Setup Script for Bedrock Chat App
# This script sets up and deploys the entire application

set -e

echo "🚀 Bedrock Chat App - Complete Setup"
echo "===================================="

# Default values
ENVIRONMENT=${1:-prod}
REGION=${2:-us-east-1}

echo "Environment: ${ENVIRONMENT}"
echo "Region: ${REGION}"
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check AWS CLI
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi
echo "✅ AWS CLI configured"

# Check SAM CLI
if ! command -v sam &> /dev/null; then
    echo "❌ SAM CLI not found. Please install AWS SAM CLI first."
    exit 1
fi
echo "✅ SAM CLI found"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi
echo "✅ Node.js found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi
echo "✅ npm found"

echo ""

# Step 1: Deploy Backend
echo "📡 Step 1: Deploying Backend..."
./scripts/deploy-backend.sh "${ENVIRONMENT}" "${REGION}"

# Get the API URL
STACK_NAME="bedrock-chat-backend-${ENVIRONMENT}"
API_URL=$(aws cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --region "${REGION}" \
    --query 'Stacks[0].Outputs[?OutputKey==`BedrockChatApiUrl`].OutputValue' \
    --output text)

echo ""

# Step 2: Setup Frontend
echo "🎨 Step 2: Setting up Frontend..."
./scripts/deploy-frontend.sh "${API_URL}"

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Your Bedrock Chat App is ready!"
echo "Backend API URL: ${API_URL}"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Connect to AWS Amplify for automatic deployments"
echo "3. Or manually deploy the built frontend to your hosting service"
echo ""
echo "Test your backend:"
echo "curl -X POST ${API_URL} \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"messages\":[{\"id\":\"1\",\"role\":\"user\",\"content\":\"Hello!\"}],\"modelId\":\"anthropic.claude-3-haiku-20240307-v1:0\"}'"
