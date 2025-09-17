#!/bin/bash

echo "🚀 Setting up BGG GraphQL Proxy for local development..."

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

# Install serverless plugins if not already installed
echo "🔧 Installing serverless plugins..."
npm install -D serverless-offline serverless-plugin-typescript

# Build the project
echo "🔨 Building project..."
npm run build

# Start serverless offline
echo "🌐 Starting serverless offline..."
echo "   GraphQL Playground: http://localhost:4000/graphql"
echo "   Health Check: http://localhost:4000/health"
echo "   API Root: http://localhost:4000/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Try to run with npx, fallback to local installation
if command -v npx &> /dev/null; then
    npx serverless@3 offline
else
    echo "❌ npx not found. Please install Node.js and npm"
    exit 1
fi
