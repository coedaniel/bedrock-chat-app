#!/bin/bash

# Deploy Backend Script for Bedrock Chat App
# Usage: ./scripts/deploy-backend.sh [environment] [region]

set -e

# Default values
ENVIRONMENT=${1:-prod}
REGION=${2:-us-east-1}
STACK_NAME="bedrock-chat-backend-${ENVIRONMENT}"

echo "🚀 Deploying Bedrock Chat Backend..."
echo "Environment: ${ENVIRONMENT}"
echo "Region: ${REGION}"
echo "Stack Name: ${STACK_NAME}"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo "❌ SAM CLI not found. Please install AWS SAM CLI first."
    echo "Visit: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html"
    exit 1
fi

# Build the SAM application
echo "📦 Building SAM application..."
sam build --template-file infrastructure/backend-template.yaml

# Deploy the SAM application
echo "🚀 Deploying to AWS..."
sam deploy \
    --stack-name "${STACK_NAME}" \
    --capabilities CAPABILITY_IAM \
    --region "${REGION}" \
    --resolve-s3 \
    --no-confirm-changeset \
    --no-fail-on-empty-changeset \
    --parameter-overrides Environment="${ENVIRONMENT}"

# Get the API Gateway URL
API_URL=$(aws cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --region "${REGION}" \
    --query 'Stacks[0].Outputs[?OutputKey==`BedrockChatApiUrl`].OutputValue' \
    --output text)

echo "✅ Backend deployed successfully!"
echo "📡 API Gateway URL: ${API_URL}"
echo ""
echo "Next steps:"
echo "1. Update your frontend configuration with the API URL"
echo "2. Deploy the frontend using: ./scripts/deploy-frontend.sh"
echo ""
echo "API URL to use in frontend: ${API_URL}"
