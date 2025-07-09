# 🤖 Bedrock Chat App

A modern, production-ready chat application built with Next.js and AWS Bedrock. Features conversational AI with memory, multiple model support, and a beautiful responsive interface.

![Bedrock Chat App](https://img.shields.io/badge/AWS-Bedrock-orange) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue)

## ✨ Features

- 💬 **Real-time Chat Interface** - Modern, responsive chat UI
- 🧠 **Conversational Memory** - AI remembers context throughout conversations
- 🤖 **Multiple AI Models** - Support for Claude 3 Haiku, Titan, and Nova models
- 🚀 **Production Ready** - Complete infrastructure as code
- 🔒 **CORS Configured** - Secure cross-origin resource sharing
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Fast Deployment** - One-click setup scripts

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │───▶│   API Gateway    │───▶│  Lambda Function │
│   (Frontend)    │    │                  │    │   (Backend)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                                               │
         │                                               ▼
         │                                      ┌─────────────────┐
         │                                      │  Amazon Bedrock │
         │                                      │   (AI Models)   │
         │                                      └─────────────────┘
         ▼
┌─────────────────┐
│  AWS Amplify    │
│   (Hosting)     │
└─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- AWS CLI configured with appropriate permissions
- AWS SAM CLI installed
- Node.js 18+ and npm
- Git

### One-Click Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd bedrock-chat-app

# Run the complete setup (deploys backend + prepares frontend)
./scripts/setup.sh

# That's it! 🎉
```

### Manual Setup

#### 1. Deploy Backend

```bash
# Deploy to production
./scripts/deploy-backend.sh prod us-east-1

# Deploy to development
./scripts/deploy-backend.sh dev us-east-1
```

#### 2. Setup Frontend

```bash
# Use the API URL from backend deployment
./scripts/deploy-frontend.sh https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/chat
```

#### 3. Deploy Frontend

**Option A: AWS Amplify (Recommended)**
1. Push your code to GitHub
2. Connect your repo to AWS Amplify
3. Amplify will automatically build and deploy

**Option B: Manual Deployment**
```bash
npm run build
# Upload .next folder to your hosting service
```

## 📁 Project Structure

```
bedrock-chat-app/
├── 📁 app/                    # Next.js app directory
├── 📁 components/             # React components
├── 📁 store/                  # Zustand state management
├── 📁 lib/                    # Utility functions
├── 📁 lambda/                 # Backend Lambda function
├── 📁 infrastructure/         # CloudFormation templates
├── 📁 deployment/             # Deployment configurations
├── 📁 scripts/                # Automation scripts
├── 📁 docs/                   # Documentation
├── 📄 package.json            # Frontend dependencies
├── 📄 README.md               # This file
└── 📄 .gitignore              # Git ignore rules
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `./scripts/setup.sh` | Complete setup (backend + frontend) |
| `./scripts/deploy-backend.sh` | Deploy only backend |
| `./scripts/deploy-frontend.sh` | Setup only frontend |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit with your values
NEXT_PUBLIC_API_URL=https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/chat
```

### Backend Configuration

The backend supports multiple environments:

```bash
# Production deployment
./scripts/deploy-backend.sh prod us-east-1

# Development deployment  
./scripts/deploy-backend.sh dev us-east-1

# Staging deployment
./scripts/deploy-backend.sh staging us-east-1
```

## 🤖 Supported AI Models

- **Claude 3 Haiku** - Fast, efficient conversations (default)
- **Amazon Titan** - AWS native language model
- **Amazon Nova** - Latest AWS foundation model

## 🔒 Security Features

- ✅ CORS properly configured
- ✅ API Gateway with proper headers
- ✅ IAM roles with least privilege
- ✅ Input validation and sanitization
- ✅ Error handling without information leakage

## 📊 Monitoring & Debugging

### View Backend Logs

```bash
# View recent logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/bedrock-chat"

# Get specific log events
aws logs get-log-events --log-group-name "/aws/lambda/bedrock-chat-prod" --log-stream-name "LATEST"
```

### Test Backend API

```bash
curl -X POST https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"id": "1", "role": "user", "content": "Hello!"}
    ],
    "modelId": "anthropic.claude-3-haiku-20240307-v1:0"
  }'
```

## 🚨 Troubleshooting

### Common Issues

**Backend Error 500**
- Check CloudWatch logs for the Lambda function
- Verify Bedrock model permissions
- Ensure message roles alternate correctly

**CORS Errors**
- Verify API Gateway CORS configuration
- Check that frontend URL is allowed

**Frontend Build Errors**
- Run `npm install` to ensure dependencies
- Check Node.js version (requires 18+)

### Getting Help

1. Check the logs: `aws logs describe-log-groups`
2. Verify AWS permissions: `aws sts get-caller-identity`
3. Test backend independently with curl
4. Check frontend console for errors

## 💰 Cost Estimation

**Monthly costs for moderate usage:**
- Lambda: ~$1-5/month
- API Gateway: ~$1-3/month  
- Bedrock: ~$10-50/month (depends on usage)
- Amplify: ~$1-5/month

**Total: ~$13-63/month**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- AWS Bedrock team for the amazing AI models
- Next.js team for the excellent framework
- Tailwind CSS for the beautiful styling
- Zustand for simple state management

---

**Made with ❤️ for the AWS community**

For questions or support, please open an issue in this repository.
