# BGG GraphQL Proxy

A GraphQL proxy for the BoardGameGeek API, deployed on Heroku.

## Local Development

```bash
npm install
npm run build
npm start
```

The GraphQL endpoint will be available at `http://localhost:4000/graphql`

## Heroku Deployment

1. Install Heroku CLI
2. Login to Heroku: `heroku login`
3. Create app: `heroku create your-app-name`
4. Deploy: `git push heroku main`

## Environment Variables

- `BGG_API_BASE_URL` (optional): Defaults to `https://boardgamegeek.com/xmlapi2`

## GraphQL Endpoints

- **Local**: `http://localhost:4000/graphql`
- **Production**: `https://your-app-name.herokuapp.com/graphql`

## Example Query

```graphql
query {
  search(query: "Catan") {
    id
    name
    yearPublished
    average
  }
}
```
