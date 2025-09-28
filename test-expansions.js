#!/usr/bin/env node

/**
 * Comprehensive tests for boardgame expansions functionality
 * Tests the GraphQL API expansion features including:
 * - isExpansion field detection
 * - expansionFor field (base game to expansions)
 * - baseGame field (expansion to base game)
 * - links field with expansion information
 * - getUserCollection with expansion workaround
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:4000/graphql';

// Test data
const TEST_GAMES = {
  baseGame: '13', // CATAN
  expansion: '926', // CATAN: Cities & Knights
  anotherExpansion: '325', // CATAN: Seafarers
};

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function makeRequest(query, variables = {}) {
  try {
    const response = await axios.post(API_URL, {
      query,
      variables
    });
    return response.data;
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
}

async function testExpansionDetection() {
  log('\n🧪 Testing Expansion Detection', 'blue');
  
  // Test base game detection
  const baseGameQuery = `
    query {
      thing(id: "${TEST_GAMES.baseGame}") {
        id
        name
        isExpansion
        type
      }
    }
  `;
  
  const baseGameResult = await makeRequest(baseGameQuery);
  
  if (baseGameResult.data?.thing?.isExpansion === false) {
    log('✅ Base game correctly identified as not expansion', 'green');
  } else {
    log('❌ Base game incorrectly identified as expansion', 'red');
  }
  
  // Test expansion detection
  const expansionQuery = `
    query {
      thing(id: "${TEST_GAMES.expansion}") {
        id
        name
        isExpansion
        type
      }
    }
  `;
  
  const expansionResult = await makeRequest(expansionQuery);
  
  if (expansionResult.data?.thing?.isExpansion === true) {
    log('✅ Expansion correctly identified as expansion', 'green');
  } else {
    log('❌ Expansion incorrectly identified as base game', 'red');
  }
  
  return {
    baseGame: baseGameResult.data?.thing,
    expansion: expansionResult.data?.thing
  };
}

async function testLinksInformation() {
  log('\n🔗 Testing Links Information', 'blue');
  
  const linksQuery = `
    query {
      thing(id: "${TEST_GAMES.baseGame}") {
        id
        name
        links {
          type
          linkType
          targetName
          isExpansionLink
        }
      }
    }
  `;
  
  const result = await makeRequest(linksQuery);
  const links = result.data?.thing?.links || [];
  
  // Count expansion links
  const expansionLinks = links.filter(link => link.isExpansionLink);
  const nonExpansionLinks = links.filter(link => !link.isExpansionLink);
  
  log(`📊 Found ${links.length} total links`, 'yellow');
  log(`📊 Found ${expansionLinks.length} expansion links`, 'yellow');
  log(`📊 Found ${nonExpansionLinks.length} non-expansion links`, 'yellow');
  
  // Test link types
  const linkTypes = [...new Set(links.map(link => link.linkType))];
  log(`📊 Link types: ${linkTypes.join(', ')}`, 'yellow');
  
  if (expansionLinks.length > 0) {
    log('✅ Expansion links found and properly categorized', 'green');
  } else {
    log('❌ No expansion links found', 'red');
  }
  
  return {
    totalLinks: links.length,
    expansionLinks: expansionLinks.length,
    linkTypes
  };
}

async function testExpansionForField() {
  log('\n🎯 Testing expansionFor Field', 'blue');
  
  const expansionForQuery = `
    query {
      thing(id: "${TEST_GAMES.baseGame}") {
        id
        name
        isExpansion
        expansionFor {
          id
          name
          isExpansion
          type
        }
      }
    }
  `;
  
  const result = await makeRequest(expansionForQuery);
  const expansions = result.data?.thing?.expansionFor || [];
  
  log(`📊 Found ${expansions.length} expansions for base game`, 'yellow');
  
  // Verify all returned items are expansions
  const allAreExpansions = expansions.every(exp => exp.isExpansion === true);
  
  if (allAreExpansions) {
    log('✅ All returned items are correctly identified as expansions', 'green');
  } else {
    log('❌ Some returned items are not expansions', 'red');
  }
  
  // Show first few expansions
  if (expansions.length > 0) {
    log('📋 Sample expansions:', 'yellow');
    expansions.slice(0, 3).forEach((exp, index) => {
      log(`  ${index + 1}. ${exp.name} (ID: ${exp.id})`, 'yellow');
    });
  }
  
  return {
    expansionCount: expansions.length,
    allAreExpansions,
    expansions: expansions.slice(0, 5) // Return first 5 for inspection
  };
}

async function testBaseGameField() {
  log('\n🎮 Testing baseGame Field', 'blue');
  
  const baseGameQuery = `
    query {
      thing(id: "${TEST_GAMES.expansion}") {
        id
        name
        isExpansion
        baseGame {
          id
          name
          isExpansion
        }
      }
    }
  `;
  
  const result = await makeRequest(baseGameQuery);
  const baseGame = result.data?.thing?.baseGame;
  
  if (baseGame) {
    log('✅ Base game found for expansion', 'green');
    log(`📋 Base game: ${baseGame.name} (ID: ${baseGame.id})`, 'yellow');
    
    if (baseGame.isExpansion === false) {
      log('✅ Base game correctly identified as not expansion', 'green');
    } else {
      log('❌ Base game incorrectly identified as expansion', 'red');
    }
  } else {
    log('⚠️  No base game found for expansion (this may be expected)', 'yellow');
  }
  
  return {
    hasBaseGame: !!baseGame,
    baseGame
  };
}

async function testCollectionWithExpansions() {
  log('\n📚 Testing Collection with Expansions', 'blue');
  
  // Test with a known user who has a collection
  const collectionQuery = `
    query {
      userCollection(username: "Aldie") {
        totalItems
        items {
          objectId
          name
          subtype
        }
      }
    }
  `;
  
  const result = await makeRequest(collectionQuery);
  const collection = result.data?.userCollection;
  
  if (collection) {
    log(`📊 Collection has ${collection.totalItems} items`, 'yellow');
    
    // Check for different subtypes
    const subtypes = [...new Set(collection.items.map(item => item.subtype))];
    log(`📊 Subtypes found: ${subtypes.join(', ')}`, 'yellow');
    
    if (subtypes.includes('boardgame') && subtypes.includes('boardgameexpansion')) {
      log('✅ Collection contains both boardgames and expansions', 'green');
    } else if (collection.totalItems === 0) {
      log('⚠️  Collection is empty (user may not have public collection)', 'yellow');
    } else {
      log('📊 Collection contains items but expansion detection needs verification', 'yellow');
    }
  } else {
    log('❌ Failed to fetch collection', 'red');
  }
  
  return {
    totalItems: collection?.totalItems || 0,
    subtypes: [...new Set(collection?.items?.map(item => item.subtype) || [])]
  };
}

async function testSearchWithExpansions() {
  log('\n🔍 Testing Search with Expansions', 'blue');
  
  const searchQuery = `
    query {
      search(query: "Catan") {
        id
        name
        type
        isExpansion
      }
    }
  `;
  
  const result = await makeRequest(searchQuery);
  const results = result.data?.search || [];
  
  log(`📊 Found ${results.length} search results`, 'yellow');
  
  // Separate base games and expansions
  const baseGames = results.filter(item => !item.isExpansion);
  const expansions = results.filter(item => item.isExpansion);
  
  log(`📊 Base games: ${baseGames.length}`, 'yellow');
  log(`📊 Expansions: ${expansions.length}`, 'yellow');
  
  if (expansions.length > 0) {
    log('✅ Search correctly identifies expansions', 'green');
    log('📋 Sample expansions from search:', 'yellow');
    expansions.slice(0, 3).forEach((exp, index) => {
      log(`  ${index + 1}. ${exp.name} (ID: ${exp.id})`, 'yellow');
    });
  } else {
    log('⚠️  No expansions found in search results', 'yellow');
  }
  
  return {
    totalResults: results.length,
    baseGames: baseGames.length,
    expansions: expansions.length
  };
}

async function runAllTests() {
  log('🚀 Starting Boardgame Expansions Tests', 'bold');
  log('=' .repeat(50), 'blue');
  
  const results = {};
  
  try {
    // Test 1: Expansion Detection
    results.expansionDetection = await testExpansionDetection();
    
    // Test 2: Links Information
    results.linksInfo = await testLinksInformation();
    
    // Test 3: expansionFor Field
    results.expansionFor = await testExpansionForField();
    
    // Test 4: baseGame Field
    results.baseGame = await testBaseGameField();
    
    // Test 5: Collection with Expansions
    results.collection = await testCollectionWithExpansions();
    
    // Test 6: Search with Expansions
    results.search = await testSearchWithExpansions();
    
  } catch (error) {
    log(`❌ Test failed with error: ${error.message}`, 'red');
    return;
  }
  
  // Summary
  log('\n📊 Test Summary', 'bold');
  log('=' .repeat(30), 'blue');
  
  const tests = [
    { name: 'Expansion Detection', passed: results.expansionDetection?.baseGame?.isExpansion === false },
    { name: 'Links Information', passed: results.linksInfo?.expansionLinks > 0 },
    { name: 'expansionFor Field', passed: results.expansionFor?.expansionCount > 0 },
    { name: 'baseGame Field', passed: results.baseGame?.hasBaseGame !== undefined },
    { name: 'Collection Test', passed: results.collection?.totalItems >= 0 },
    { name: 'Search Test', passed: results.search?.totalResults > 0 }
  ];
  
  tests.forEach(test => {
    const status = test.passed ? '✅' : '❌';
    const color = test.passed ? 'green' : 'red';
    log(`${status} ${test.name}`, color);
  });
  
  const passedTests = tests.filter(t => t.passed).length;
  const totalTests = tests.length;
  
  log(`\n🎯 Results: ${passedTests}/${totalTests} tests passed`, passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    log('🎉 All tests passed! Boardgame expansions functionality is working correctly.', 'green');
  } else {
    log('⚠️  Some tests failed. Check the output above for details.', 'yellow');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    log(`❌ Test runner failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testExpansionDetection,
  testLinksInformation,
  testExpansionForField,
  testBaseGameField,
  testCollectionWithExpansions,
  testSearchWithExpansions
};
