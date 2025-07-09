# 🚀 Deployment Guide

This guide covers different deployment scenarios for the Bedrock Chat App.

## Prerequisites

Before deploying, ensure you have:

- ✅ AWS CLI configured with appropriate permissions
- ✅ AWS SAM CLI installed
- ✅ Node.js 18+ and npm
- ✅ Git

## Required AWS Permissions

Your AWS user/role needs the following permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cloudformation:*",
                "lambda:*",
                "apigateway:*",
                "iam:*",
                "s3:*",
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream",
                "logs:*"
            ],
            "Resource": "*"
        }
    ]
}
```

## Deployment Options

### Option 1: Complete Automated Setup

```bash
# Clone and setup everything
git clone <your-repo-url>
cd bedrock-chat-app
./scripts/setup.sh
```

### Option 2: Step-by-Step Deployment

#### Step 1: Deploy Backend

```bash
# Production environment
./scripts/deploy-backend.sh prod us-east-1

# Development environment
./scripts/deploy-backend.sh dev us-east-1

# Custom region
./scripts/deploy-backend.sh prod eu-west-1
```

#### Step 2: Configure Frontend

```bash
# Get the API URL from the backend deployment output
API_URL="https://abc123.execute-api.us-east-1.amazonaws.com/prod/chat"

# Setup frontend with the API URL
./scripts/deploy-frontend.sh $API_URL
```

#### Step 3: Deploy Frontend

**AWS Amplify (Recommended)**

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Create Amplify App:
```bash
# Using AWS CLI
aws amplify create-app --name bedrock-chat-app --repository https://github.com/yourusername/bedrock-chat-app
```

3. Connect branch and deploy:
```bash
# Get the app ID from the previous command
aws amplify create-branch --app-id <app-id> --branch-name main
aws amplify start-job --app-id <app-id> --branch-name main --job-type RELEASE
```

**Manual Deployment**

```bash
# Build the application
npm run build

# Deploy to your hosting service
# Upload the .next folder to your web server
```

## Environment-Specific Deployments

### Development Environment

```bash
# Deploy backend to dev
./scripts/deploy-backend.sh dev us-east-1

# The stack will be named: bedrock-chat-backend-dev
# API URL will be: https://xxx.execute-api.us-east-1.amazonaws.com/dev/chat
```

### Staging Environment

```bash
# Deploy backend to staging
./scripts/deploy-backend.sh staging us-east-1

# The stack will be named: bedrock-chat-backend-staging
# API URL will be: https://xxx.execute-api.us-east-1.amazonaws.com/staging/chat
```

### Production Environment

```bash
# Deploy backend to production
./scripts/deploy-backend.sh prod us-east-1

# The stack will be named: bedrock-chat-backend-prod
# API URL will be: https://xxx.execute-api.us-east-1.amazonaws.com/prod/chat
```

## Multi-Region Deployment

Deploy to multiple regions for better performance:

```bash
# US East
./scripts/deploy-backend.sh prod us-east-1

# US West
./scripts/deploy-backend.sh prod us-west-2

# Europe
./scripts/deploy-backend.sh prod eu-west-1

# Asia Pacific
./scripts/deploy-backend.sh prod ap-southeast-1
```

## Rollback Procedures

### Backend Rollback

```bash
# List stack events to find the last good deployment
aws cloudformation describe-stack-events --stack-name bedrock-chat-backend-prod

# Rollback to previous version
aws cloudformation cancel-update-stack --stack-name bedrock-chat-backend-prod
```

### Frontend Rollback

**Amplify Rollback**
```bash
# List previous jobs
aws amplify list-jobs --app-id <app-id> --branch-name main

# Rollback to specific job
aws amplify start-job --app-id <app-id> --branch-name main --job-type RELEASE --commit-id <previous-commit-id>
```

## Monitoring Deployment

### Backend Monitoring

```bash
# Check stack status
aws cloudformation describe-stacks --stack-name bedrock-chat-backend-prod

# Monitor Lambda function
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/bedrock-chat"

# Test API endpoint
curl -X POST https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"id":"1","role":"user","content":"test"}],"modelId":"anthropic.claude-3-haiku-20240307-v1:0"}'
```

### Frontend Monitoring

```bash
# Check Amplify app status
aws amplify get-app --app-id <app-id>

# List recent deployments
aws amplify list-jobs --app-id <app-id> --branch-name main
```

## Troubleshooting Deployments

### Common Backend Issues

**CloudFormation Stack Failed**
```bash
# Check stack events for errors
aws cloudformation describe-stack-events --stack-name bedrock-chat-backend-prod

# Common fixes:
# 1. Check IAM permissions
# 2. Verify Bedrock model access
# 3. Ensure unique S3 bucket names
```

**Lambda Function Errors**
```bash
# Check function logs
aws logs get-log-events --log-group-name "/aws/lambda/bedrock-chat-prod" --log-stream-name "LATEST"

# Common fixes:
# 1. Check Python dependencies
# 2. Verify Bedrock permissions
# 3. Check message format
```

### Common Frontend Issues

**Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

**API Connection Issues**
```bash
# Verify API URL in store/chatStore.ts
grep -n "execute-api" store/chatStore.ts

# Test API directly
curl -X OPTIONS https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/chat
```

## Security Considerations

### Backend Security

- ✅ Lambda function uses least privilege IAM roles
- ✅ API Gateway has CORS properly configured
- ✅ No sensitive data in environment variables
- ✅ CloudWatch logs don't contain secrets

### Frontend Security

- ✅ No API keys in client-side code
- ✅ HTTPS enforced for all communications
- ✅ Input validation on all user inputs
- ✅ No sensitive data in localStorage

## Cost Optimization

### Backend Optimization

```bash
# Use smaller Lambda memory if sufficient
# Edit infrastructure/backend-template.yaml
MemorySize: 128  # Instead of 256

# Set shorter timeout if possible
Timeout: 15  # Instead of 30
```

### Frontend Optimization

```bash
# Enable Next.js optimizations
npm run build  # Automatically optimizes bundle size
```

## Cleanup

### Remove All Resources

```bash
# Delete backend stack
aws cloudformation delete-stack --stack-name bedrock-chat-backend-prod

# Delete Amplify app
aws amplify delete-app --app-id <app-id>

# Clean up S3 buckets (if any remain)
aws s3 ls | grep bedrock-chat
aws s3 rb s3://bucket-name --force
```

---

For more help, check the main [README.md](../README.md) or open an issue.
