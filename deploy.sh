#!/bin/bash

echo "🚀 NEOX Admin Deployment Script"
echo "================================"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please copy .env.example to .env.local and fill in your values"
    exit 1
fi

# Source environment variables
source .env.local

echo "📝 Setting up environment variables in Vercel..."

# Set environment variables
npx vercel env add NEXTAUTH_URL production --confirm
npx vercel env add NEXTAUTH_SECRET production --confirm
npx vercel env add DATABASE_URL production --confirm
npx vercel env add AZURE_AD_CLIENT_ID production --confirm
npx vercel env add AZURE_AD_CLIENT_SECRET production --confirm  
npx vercel env add AZURE_AD_TENANT_ID production --confirm
npx vercel env add RESEND_API_KEY production --confirm
npx vercel env add BLOB_READ_WRITE_TOKEN production --confirm
npx vercel env add APP_ENV production --confirm
npx vercel env add ENABLE_MOCK_DATA production --confirm
npx vercel env add ENABLE_DEBUG_LOGGING production --confirm

echo "🚀 Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your PostgreSQL database (Vercel Postgres recommended)"
echo "2. Run database migrations: npx prisma db push"
echo "3. Seed the database: npx prisma db seed"
echo "4. Configure Azure AD redirect URI with your deployment URL"
echo "5. Test the application"