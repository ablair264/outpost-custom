// Backend API endpoint example for AI search integration
// This would go in your backend server (Node.js/Express)

import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Initialize OpenAI with your API key (store in environment variables!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Never hardcode this!
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true
}));

// AI Search endpoint
app.post('/api/smart-search', async (req, res) => {
  try {
    const { query, selectedQuestions, availableFilters } = req.body;

    // Combine user query with selected questions
    const fullQuery = [query, ...selectedQuestions].filter(Boolean).join('. ');

    // Create AI prompt for product filtering
    const prompt = `
You are an expert product search assistant for a promotional products/workwear company.

Available filter options:
- Product Types: T-Shirts, Polos, Hoodies, Sweatshirts, Jackets, Fleece, Bags, Caps, Accessories, Shirts, Trousers, Safety Vests
- Fabrics: Cotton, Polyester, Cotton/Polyester blends, Viscose blends, Organic Cotton
- Brands: AWDis Just T's, Bella + Canvas, Gildan, Fruit of the Loom, Russell
- Price Range: £${availableFilters.priceRange?.min || 0} - £${availableFilters.priceRange?.max || 1000}
- Genders: Male, Female, Unisex
- Age Groups: Adult, Youth, Kids

User Query: "${fullQuery}"

Based on the user's query, return a JSON object with appropriate filters. Only include filters that make sense for the query.

Example response format:
{
  "filters": {
    "productTypes": ["Polos", "T-Shirts"],
    "priceMax": 100
  },
  "explanation": "Based on your request for branded polo shirts for office workers, I've filtered for polos and t-shirts under £100."
}

CRITICAL: Always use "materials" not "fabrics", and "priceMin"/"priceMax" not "priceRange".

IMPORTANT: 
- Use these EXACT product types from the database: "T-Shirts", "Polos", "Hoodies", "Sweatshirts", "Jackets", "Fleece", "Bags", "Caps", "Accessories", "Shirts", "Trousers", "Safety Vests"
- When user asks for "polo shirts", use "Polos" (not "Polo Shirts")  
- When user asks for "polo shirts" or similar office wear, include BOTH "Polos" AND "T-Shirts" for better results
- For safety/workwear requests, include "Safety Vests" and relevant clothing types
- Keep filters broad - avoid too many restrictive filters that might exclude valid products
- Price ranges should be generous (e.g., £0-£100 rather than £0-£50)
- AVOID gender filters unless specifically requested - they often exclude valid products
- Only use materials filters for specific fabric requests (e.g., "cotton only")
`;

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful product search assistant. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const aiResponse = completion.choices[0].message.content;
    const parsedResponse = JSON.parse(aiResponse);
    
    // Fix common AI mistakes in filter format
    let filters = parsedResponse.filters || {};
    
    // Convert "fabrics" to "materials" if AI used wrong field name
    if (filters.fabrics && !filters.materials) {
      filters.materials = filters.fabrics;
      delete filters.fabrics;
    }
    
    // Convert "priceRange" to "priceMin"/"priceMax" if AI used wrong format
    if (filters.priceRange) {
      if (typeof filters.priceRange === 'object') {
        if (filters.priceRange.min !== undefined) filters.priceMin = filters.priceRange.min;
        if (filters.priceRange.max !== undefined) filters.priceMax = filters.priceRange.max;
      }
      delete filters.priceRange;
    }

    res.json({
      success: true,
      filters: filters,
      explanation: parsedResponse.explanation,
      originalQuery: fullQuery
    });

  } catch (error) {
    console.error('AI Search Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process search query',
      fallback: generateFallbackFilters(req.body.query) // Fallback to keyword matching
    });
  }
});

// Fallback function for when AI fails
function generateFallbackFilters(query) {
  const lowerQuery = query.toLowerCase();
  const filters = {};

  // Simple keyword matching as fallback - using actual product types
  if (lowerQuery.includes('polo')) {
    filters.productTypes = ['Polos'];
  } else if (lowerQuery.includes('shirt') || lowerQuery.includes('tee') || lowerQuery.includes('t-shirt')) {
    filters.productTypes = ['T-Shirts'];
  }
  if (lowerQuery.includes('hoodie') || lowerQuery.includes('sweatshirt')) {
    filters.productTypes = ['Hoodies'];
  }
  if (lowerQuery.includes('jacket') || lowerQuery.includes('coat')) {
    filters.productTypes = ['Jackets'];
  }
  if (lowerQuery.includes('bag') || lowerQuery.includes('tote')) {
    filters.productTypes = ['Bags'];
  }
  if (lowerQuery.includes('budget') || lowerQuery.includes('cheap')) {
    filters.priceMax = 25;
  }
  if (lowerQuery.includes('premium') || lowerQuery.includes('quality')) {
    filters.priceMin = 50;
  }

  return filters;
}

const PORT = process.env.BACKEND_PORT || 3001;

app.listen(PORT, () => {
  console.log(`AI Search API running on port ${PORT}`);
  console.log(`Frontend should call: http://localhost:${PORT}/api/smart-search`);
});

export default app;