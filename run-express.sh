#!/bin/bash

echo "🚀 Starting BGG GraphQL Proxy with Express (local development)..."

# Check if .env exists, if not copy from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your configuration before continuing"
    echo "   - Set AWS credentials for DynamoDB"
    echo "   - Configure Redis URL if using Redis"
    read -p "Press Enter to continue after editing .env..."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Start the Express server
echo "🌐 Starting Express server..."
echo "   GraphQL Playground: http://localhost:4000/graphql"
echo "   Health Check: http://localhost:4000/health"
echo "   API Root: http://localhost:4000/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Run the Express server directly
node dist/index.js
