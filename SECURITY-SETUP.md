# 🔒 Secure AI Integration Setup

## ⚠️ CRITICAL: Never Put API Keys in Frontend Code!

### ❌ Wrong Way (DANGEROUS)
```bash
# DON'T DO THIS - Exposes your key to everyone!
REACT_APP_OPENAI_API_KEY=sk-your-key

# This makes your key visible in:
# - Browser dev tools
# - Built JavaScript files
# - Anyone who visits your website
```

### ✅ Right Way (SECURE)
```bash
# Backend .env file (NOT visible to users)
OPENAI_API_KEY=sk-your-new-key-here
AI_MODEL=gpt-3.5-turbo

# Frontend .env file (safe to expose)
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

## 🚨 Your Exposed Key Action Plan

### Step 1: Revoke the Compromised Key (DO THIS NOW!)
1. Go to https://platform.openai.com/api-keys
2. Find key: `sk-proj-jic_BNf...`
3. Click "Delete" immediately
4. This prevents unauthorized usage

### Step 2: Create New Key
1. Generate a new API key
2. Copy it securely
3. Don't share it anywhere public

### Step 3: Secure Backend Setup

#### Create Backend .env File:
```bash
# backend/.env (or root .env for backend)
OPENAI_API_KEY=sk-your-NEW-key-here
AI_MODEL=gpt-3.5-turbo
PORT=3001
```

#### Create Frontend .env File:
```bash
# frontend/.env (or React app root)
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

## 📁 Recommended Project Structure

```
your-project/
├── frontend/           # React app
│   ├── src/
│   ├── .env           # REACT_APP_ variables only
│   └── package.json
├── backend/           # Node.js API server
│   ├── server.js      # Based on backend-example.js
│   ├── .env          # Secret keys here
│   └── package.json
└── README.md
```

## 🛡️ Security Checklist

### Backend Security:
- [ ] API key in `.env` file (no `REACT_APP_` prefix)
- [ ] `.env` added to `.gitignore`
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Input validation added
- [ ] Error messages don't expose sensitive info

### Frontend Security:
- [ ] No API keys in React code
- [ ] Only calls backend API, never OpenAI directly
- [ ] Uses `REACT_APP_API_BASE_URL` for API endpoint
- [ ] Handles API errors gracefully

### Deployment Security:
- [ ] Environment variables set on hosting platform
- [ ] Secrets not in version control
- [ ] HTTPS enabled in production
- [ ] API endpoints secured

## 🔧 Quick Setup Commands

### 1. Backend Setup
```bash
mkdir backend
cd backend
npm init -y
npm install express openai cors dotenv
cp ../backend-example.js server.js

# Create .env with your NEW key
echo "OPENAI_API_KEY=sk-your-new-key" > .env
echo "AI_MODEL=gpt-3.5-turbo" >> .env
echo "PORT=3001" >> .env

# Add .env to gitignore
echo ".env" >> .gitignore

# Start server
node server.js
```

### 2. Frontend Setup
```bash
# In your React app root
echo "REACT_APP_API_BASE_URL=http://localhost:3001/api" > .env

# Remove any REACT_APP_OPENAI_API_KEY from your .env!
# That was the security issue
```

## 🚀 Testing the Secure Setup

### Test Backend Directly:
```bash
curl -X POST http://localhost:3001/api/smart-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "test search",
    "selectedQuestions": [],
    "availableFilters": {"productTypes": ["Shirts"]}
  }'
```

### Expected Response:
```json
{
  "success": true,
  "filters": {...},
  "explanation": "AI-generated explanation"
}
```

## 💰 Cost Monitoring

### Set Usage Limits:
1. Go to https://platform.openai.com/usage
2. Set monthly spending limit (e.g., $10)
3. Enable email alerts

### Track Usage:
```javascript
// Add to your backend
console.log('AI request cost estimate:', tokens * 0.002 / 1000);
```

## 📋 Deployment Notes

### Environment Variables on Hosting:
- **Vercel**: Add in dashboard under "Environment Variables"
- **Netlify**: Add in dashboard under "Site settings > Environment variables"  
- **Heroku**: Use `heroku config:set OPENAI_API_KEY=sk-...`
- **Railway**: Add in dashboard under "Variables"

### Never Commit:
```bash
# Add to .gitignore
.env
.env.local
.env.production
*.key
config/secrets.json
```

## 🆘 If Your Key Gets Exposed Again:

1. **Immediately revoke** the compromised key
2. **Check OpenAI usage** for unexpected charges
3. **Generate new key** with limited permissions
4. **Review code** to prevent future exposures
5. **Consider key rotation** (change keys monthly)

Remember: **API keys are like passwords - never share them publicly!**