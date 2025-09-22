# Use Hasura GraphQL Engine for the main service
FROM hasura/graphql-engine:v2.36.0

# Expose Hasura port
EXPOSE 8080

# Default command for Hasura
CMD ["graphql-engine", "serve"]
