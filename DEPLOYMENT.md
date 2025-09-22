# 🚀 Deploy to Render (Experimental Branch)

## Quick Deployment

1. **Push experimental branch to GitHub:**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin experimental
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Click "New" → "Blueprint"
   - Connect your GitHub repo
   - Select the **experimental** branch
   - Render will auto-detect `render.yaml`
   - Click "Apply"

3. **Wait for deployment** (5-10 minutes)

4. **Get your URLs:**
   - Web Service: `https://your-app-name.onrender.com`
   - GraphQL: `https://your-app-name.onrender.com/v1/graphql`
   - Console: `https://your-app-name.onrender.com/console`

## Populate Data

After deployment, populate your database:

```bash
# Set your Render database URL
export DATABASE_URL="postgres://postgres:password@your-render-db-host:5432/bgg"

# Fetch data
npm run fetch-data:render
```

## Test Your API

```bash
# Test GraphQL endpoint
curl -X POST https://your-app-name.onrender.com/v1/graphql \
  -H "Content-Type: application/json" \
  -H "x-hasura-admin-secret: your-admin-secret" \
  -d '{"query": "{ things(limit: 5) { id name } }"}'
```

## Environment Variables

Render automatically sets:
- `HASURA_GRAPHQL_DATABASE_URL` - Connected to Render PostgreSQL
- `HASURA_GRAPHQL_ADMIN_SECRET` - Auto-generated
- `HASURA_GRAPHQL_JWT_SECRET` - Auto-generated
- `HASURA_GRAPHQL_CORS_DOMAIN` - Set to `*`

## Free Tier Limits

- **Web Service**: 750 hours/month
- **PostgreSQL**: 1GB storage
- **Bandwidth**: 100GB/month
- **Sleep**: Services sleep after 15min of inactivity

## Troubleshooting

### Service won't start
- Check logs in Render dashboard
- Verify environment variables
- Check database connection

### Database connection issues
- Ensure `HASURA_GRAPHQL_DATABASE_URL` is correct
- Check if database is running
- Verify credentials

### CORS issues
- Set `HASURA_GRAPHQL_CORS_DOMAIN=*` for development
- Use specific domains for production

## Next Steps

1. Deploy to Render
2. Set up your database
3. Run migrations
4. Fetch board game data
5. Test your API!

Your GraphQL API will be live at `https://your-app-name.onrender.com/v1/graphql` 🎉