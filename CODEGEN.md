# GraphQL Code Generation

This project uses GraphQL Code Generation to automatically generate TypeScript types from the GraphQL schema.

## Setup

The codegen is already configured in `codegen.yml` and will run automatically when you install dependencies or build the project.

## Available Scripts

```bash
# Generate types once
npm run codegen

# Generate types and watch for changes
npm run codegen:watch

# Generate types as part of build process
npm run build
```

## Configuration

The codegen configuration is in `codegen.yml`:

- **Schema**: `src/schema/schema.graphql`
- **Output**: `src/generated/graphql.ts`
- **Plugins**: TypeScript types and resolvers
- **Mappers**: Maps GraphQL types to our custom TypeScript types

## Generated Types

The codegen generates:

1. **GraphQL Types**: All types from the schema (Query, Thing, User, etc.)
2. **Resolver Types**: Properly typed resolvers with context
3. **Enums**: TypeScript enums for GraphQL enums
4. **Scalars**: Custom scalar type mappings

## Usage in Resolvers

```typescript
import { Resolvers } from '../generated/graphql';

export const resolvers: Resolvers<ApolloContext> = {
  Query: {
    thing: async (_, { id }, { dataSources }) => {
      // Fully typed arguments and return values
      return await dataSources.bggAPI.getThing(id);
    },
  },
};
```

## Context Type

The generated resolvers use the `ApolloContext` type defined in `src/resolvers/index.ts`:

```typescript
export type ApolloContext = {
  dataSources: {
    bggAPI: BGGDataSource;
    cache: CacheDataSource;
    storage: StorageDataSource;
  };
};
```

## Mappers

The codegen uses mappers to map GraphQL types to our custom TypeScript types:

```yaml
mappers:
  Thing: "../types#BGGThing"
  User: "../types#BGGUser"
  Collection: "../types#BGGCollection"
  Play: "../types#BGGPlay"
  Geeklist: "../types#BGGGeeklist"
```

This allows us to use our custom BGG types while maintaining full type safety.

## Troubleshooting

### Types not updating
1. Make sure the GraphQL schema is valid
2. Check that `codegen.yml` is properly configured
3. Run `npm run codegen` manually

### Import errors
1. Ensure the generated file exists at `src/generated/graphql.ts`
2. Check that the context type is properly exported
3. Verify mapper paths are correct

### Build errors
1. Run `npm run codegen` before building
2. Check TypeScript configuration
3. Ensure all dependencies are installed

## Development Workflow

1. **Modify GraphQL schema** in `src/schema/schema.graphql`
2. **Run codegen** with `npm run codegen`
3. **Update resolvers** to use new types
4. **Test** with GraphQL Playground

## Watch Mode

For development, you can use watch mode to automatically regenerate types when the schema changes:

```bash
npm run codegen:watch
```

This will watch for changes to the GraphQL schema and automatically regenerate the TypeScript types.
