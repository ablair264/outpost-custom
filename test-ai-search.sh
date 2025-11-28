#!/bin/bash
# Test script for AI search functionality

echo "Testing AI Search API..."
echo "Make sure the backend is running (npm run backend)"
echo ""

# Test the API endpoint
curl -X POST http://localhost:3001/api/smart-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I need branded polo shirts for office workers",
    "selectedQuestions": ["Corporate gifts for clients"],
    "availableFilters": {
      "productTypes": ["Polo Shirts", "T-Shirts", "Jackets"],
      "materials": ["Cotton", "Polyester", "Organic Cotton"],
      "brands": ["Nike", "Adidas", "Custom"],
      "priceRange": {"min": 0, "max": 1000}
    }
  }' \
  | jq '.' || echo "Response received (install jq for pretty formatting)"