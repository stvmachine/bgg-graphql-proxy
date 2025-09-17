import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('🔧 Generating GraphQL types...');

async function generateTypes() {
  try {
    // Check if we're in the right directory
    const packageJsonPath = join(process.cwd(), 'package.json');
    if (!existsSync(packageJsonPath)) {
      console.error('❌ package.json not found. Please run from project root.');
      process.exit(1);
    }

    // Check if codegen config exists
    const codegenPath = join(process.cwd(), 'codegen.yml');
    if (!existsSync(codegenPath)) {
      console.error('❌ codegen.yml not found.');
      process.exit(1);
    }

    // Check if schema exists
    const schemaPath = join(process.cwd(), 'src/schema/schema.graphql');
    if (!existsSync(schemaPath)) {
      console.error('❌ GraphQL schema not found at src/schema/schema.graphql');
      process.exit(1);
    }

    console.log('📋 Configuration found, running codegen...');

    // Run codegen
    execSync('npx graphql-codegen --config codegen.yml', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('✅ GraphQL types generated successfully!');
    console.log('📁 Generated file: src/generated/graphql.ts');
    
  } catch (error) {
    console.error('❌ Failed to generate GraphQL types:', error);
    process.exit(1);
  }
}

generateTypes();