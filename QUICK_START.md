# 🚀 Quick Start Guide

Get your Bedrock Chat App running in minutes!

## 📋 Prerequisites Checklist

- [ ] AWS CLI configured (`aws configure`)
- [ ] AWS SAM CLI installed
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] GitHub account (for repository)

## 🎯 Option 1: Complete Setup (Recommended)

```bash
# 1. Setup GitHub repository
./scripts/setup-github.sh

# 2. Deploy everything
./scripts/setup.sh

# That's it! 🎉
```

## 🔧 Option 2: Manual Step-by-Step

### Step 1: Deploy Backend
```bash
./scripts/deploy-backend.sh prod us-east-1
```

### Step 2: Setup Frontend
```bash
# Use the API URL from step 1
./scripts/deploy-frontend.sh https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/chat
```

### Step 3: Deploy Frontend
Push to GitHub and connect to AWS Amplify, or deploy manually.

## 🧪 Testing

```bash
# Test backend API
curl -X POST https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"id":"1","role":"user","content":"Hello!"}],"modelId":"anthropic.claude-3-haiku-20240307-v1:0"}'

# Test frontend locally
npm run dev
```

## 📚 Documentation

- [README.md](README.md) - Complete project overview
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Detailed deployment guide
- [docs/API.md](docs/API.md) - API documentation

## 🆘 Need Help?

1. Check the [Troubleshooting section](README.md#-troubleshooting) in README
2. View AWS CloudWatch logs
3. Open an issue on GitHub

## 🎉 Success Indicators

- ✅ Backend deployed without errors
- ✅ API responds to test requests
- ✅ Frontend builds successfully
- ✅ Chat interface works with memory
- ✅ Multiple AI models available

---

**You're ready to chat with AI! 🤖**
