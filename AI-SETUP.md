# AI Smart Search Setup Guide

## 🚀 Quick Setup

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or log in
3. Generate a new API key
4. Copy the key (starts with `sk-...`)

### 2. Set Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API key
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Install Backend Dependencies
```bash
# If using Node.js backend
npm install express openai cors dotenv

# Or if using different backend, install equivalent packages
```

### 4. Backend Integration Options

#### Option A: Separate Backend Server
- Use the `backend-example.js` file as a starting point
- Run: `node backend-example.js`
- Frontend will call `/api/smart-search`

#### Option B: Next.js API Routes (if using Next.js)
```javascript
// pages/api/smart-search.js or app/api/smart-search/route.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Same logic as backend-example.js
}
```

#### Option C: Serverless Functions (Vercel, Netlify)
- Deploy the backend logic as serverless functions
- Update frontend API calls to match your deployed endpoints

## 🔧 Configuration Options

### AI Models
Choose based on your needs:
- **gpt-3.5-turbo**: Fast, cost-effective ($0.002/1K tokens)
- **gpt-4**: More accurate, higher cost ($0.03/1K tokens)
- **gpt-4-turbo**: Best balance of speed and accuracy

### Alternative AI Services
```javascript
// Claude (Anthropic)
import Anthropic from '@anthropic-ai/sdk';

// Google Gemini
import { GoogleGenerativeAI } from "@google/generative-ai";

// Local AI (Ollama)
// Free but requires local setup
```

## 🛡️ Security Best Practices

### Environment Variables
```bash
# ✅ Good - in .env file
OPENAI_API_KEY=sk-...

# ❌ Never do this - in code
const apiKey = "sk-proj-abc123...";
```

### API Rate Limiting
```javascript
// Add rate limiting to prevent abuse
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/smart-search', limiter);
```

## 💰 Cost Estimation

### OpenAI Pricing (as of 2024)
- **GPT-3.5-turbo**: $0.002 per 1K tokens
- **Typical search query**: 200-500 tokens
- **Cost per search**: $0.0004 - $0.001 (less than 1 cent)
- **1000 searches/month**: ~$1

### Cost Optimization
1. **Cache common queries** in database
2. **Use shorter prompts** when possible
3. **Implement fallback** to keyword search
4. **Set usage limits** per user/day

## 🧪 Testing

### Test the AI Integration
```bash
# Test with curl
curl -X POST http://localhost:3001/api/smart-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I need branded polo shirts for office workers",
    "selectedQuestions": ["Corporate gifts for clients"],
    "availableFilters": {
      "productTypes": ["Polo Shirts", "T-Shirts"],
      "materials": ["Cotton", "Polyester"]
    }
  }'
```

### Expected Response
```json
{
  "success": true,
  "filters": {
    "productTypes": ["Polo Shirts"],
    "materials": ["Cotton"],
    "priceMax": 50
  },
  "explanation": "Based on your request for branded polo shirts for office workers, I've filtered for cotton polo shirts under £50.",
  "originalQuery": "I need branded polo shirts for office workers. Corporate gifts for clients"
}
```

## 🚨 Troubleshooting

### Common Issues

#### "API key not found"
- Check `.env` file exists and has correct key
- Restart your server after adding environment variables
- Verify key starts with `sk-`

#### "CORS errors"
```javascript
// Add CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
```

#### "Rate limit exceeded"
- Check your OpenAI usage dashboard
- Implement request queuing
- Add user-specific rate limiting

#### "AI returns invalid JSON"
```javascript
// Add JSON validation
try {
  const parsedResponse = JSON.parse(aiResponse);
} catch (error) {
  console.error('Invalid AI response:', aiResponse);
  // Use fallback filters
}
```

## 📈 Advanced Features

### 1. Learning from User Behavior
```javascript
// Track successful searches to improve AI prompts
const searchAnalytics = {
  query: fullQuery,
  filters: generatedFilters,
  resultsCount: searchResults.length,
  userClickedResults: [] // Track what users actually chose
};
```

### 2. Multi-language Support
```javascript
const prompt = `
Respond in ${userLanguage}. 
Available products: ${availableFilters}
User query: "${fullQuery}"
`;
```

### 3. Context Awareness
```javascript
// Include user's past searches or preferences
const contextualPrompt = `
User's recent searches: ${userHistory}
Current query: "${fullQuery}"
`;
```

## 🎯 Integration Checklist

- [ ] OpenAI API key obtained and secured
- [ ] Backend endpoint created (`/api/smart-search`)
- [ ] Environment variables configured
- [ ] Frontend updated to call backend
- [ ] Error handling implemented
- [ ] Rate limiting added
- [ ] Fallback system working
- [ ] Testing completed
- [ ] Cost monitoring set up

## 📞 Support

If you need help with the integration:
1. Check the console for error messages
2. Test the backend endpoint directly with curl
3. Verify your OpenAI API key has sufficient credits
4. Check the OpenAI API status page for outages