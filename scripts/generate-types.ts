import { generate } from '@graphql-codegen/cli';
import { join } from 'path';

async function generateTypes() {
  try {
    await generate({
      schema: join(__dirname, '../src/schema/schema.graphql'),
      generates: {
        [join(__dirname, '../src/generated/graphql.ts')]: {
          plugins: [
            'typescript',
            'typescript-resolvers'
          ],
          config: {
            useIndexSignature: true,
            contextType: '../resolvers#ApolloContext'
          }
        }
      }
    });
    console.log('✅ GraphQL types generated successfully!');
  } catch (error) {
    console.error('❌ Error generating types:', error);
    process.exit(1);
  }
}

generateTypes();
