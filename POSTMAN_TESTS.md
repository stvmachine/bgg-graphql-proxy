# BGG GraphQL Expansions - Postman Test Suite

This Postman collection provides comprehensive testing for the boardgame expansions functionality in the BGG GraphQL API.

## 📁 Files

- `BGG-GraphQL-Expansions-Tests.postman_collection.json` - Main test collection
- `BGG-GraphQL-Environment.postman_environment.json` - Environment variables
- `POSTMAN_TESTS.md` - This documentation

## 🚀 Quick Start

### 1. Import Collection
1. Open Postman
2. Click "Import" button
3. Select `BGG-GraphQL-Expansions-Tests.postman_collection.json`
4. Click "Import"

### 2. Import Environment
1. Click "Import" button
2. Select `BGG-GraphQL-Environment.postman_environment.json`
3. Click "Import"
4. Select the "BGG GraphQL Environment" from the environment dropdown

### 3. Run Tests
1. Click on the collection name
2. Click "Run" button
3. Select all requests
4. Click "Run BGG GraphQL Expansions Tests"

## 🧪 Test Coverage

### 1. Health Check
- **Purpose**: Verify API is running and healthy
- **Tests**: Status 200, valid JSON, status field, uptime field

### 2. Basic GraphQL Query
- **Purpose**: Verify GraphQL endpoint is working
- **Tests**: Status 200, valid JSON, data field, __typename

### 3. Expansion Detection - Base Game
- **Purpose**: Test that base games are correctly identified
- **Tests**: `isExpansion: false`, correct type, has name
- **Uses**: CATAN (ID: 13)

### 4. Expansion Detection - Expansion
- **Purpose**: Test that expansions are correctly identified
- **Tests**: `isExpansion: true`, correct type, has name
- **Uses**: CATAN: Cities & Knights (ID: 926)

### 5. Links Information
- **Purpose**: Test the links field with detailed categorization
- **Tests**: Links array exists, not empty, required fields, expansion links, non-expansion links
- **Features**: Tests `linkType`, `targetName`, `isExpansionLink` fields

### 6. ExpansionFor Field
- **Purpose**: Test getting expansions for a base game
- **Tests**: Array exists, not empty, all items are expansions, required fields
- **Features**: Tests the relationship from base game to expansions

### 7. BaseGame Field
- **Purpose**: Test getting base game for an expansion
- **Tests**: Field exists, null or valid object, correct properties
- **Features**: Tests the relationship from expansion to base game

### 8. Search with Expansions
- **Purpose**: Test search functionality with expansion detection
- **Tests**: Results array, not empty, required fields, contains both base games and expansions
- **Query**: "Catan"

### 9. Collection with Expansions
- **Purpose**: Test user collection with expansion workaround
- **Tests**: Valid response, required fields, item properties
- **User**: "Aldie"

### 10. Multiple Expansions Test
- **Purpose**: Test fetching multiple items with mixed types
- **Tests**: Array length, required fields, contains both base games and expansions
- **Items**: Base game + 2 expansions

### 11. Error Handling Test
- **Purpose**: Test error handling with invalid ID
- **Tests**: Status 200, returns null, no errors

### 12. Performance Test
- **Purpose**: Test complex query performance
- **Tests**: Status 200, response time < 10s, all fields present
- **Query**: Complex query with all expansion features

## 🔧 Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `baseUrl` | Production API URL | `https://bgg-graphql-proxy-9baf44927986.herokuapp.com` |
| `baseUrlLocal` | Local API URL | `http://localhost:4000` |
| `baseGameId` | Base game ID for testing | `13` (CATAN) |
| `baseGameName` | Base game name | `CATAN` |
| `expansionId` | Expansion ID | `926` (Cities & Knights) |
| `expansionName` | Expansion name | `CATAN: Cities & Knights` |
| `anotherExpansionId` | Another expansion ID | `325` (Seafarers) |
| `anotherExpansionName` | Another expansion name | `CATAN: Seafarers` |
| `testUsername` | Username for collection tests | `Aldie` |
| `searchQuery` | Search query for tests | `Catan` |

## 📊 Test Results Interpretation

### ✅ Passing Tests
- All expansion detection working correctly
- Links information properly categorized
- Expansion relationships working
- Search functionality includes expansions
- Error handling working
- Performance acceptable

### ⚠️ Expected Issues
- **BaseGame Field**: May return `null` for expansions (BGG API limitation)
- **Collection Tests**: May return empty collections for some users
- **Performance**: Complex queries may take 5-10 seconds

### ❌ Failure Indicators
- `isExpansion` field not working
- Links not properly categorized
- Expansion relationships missing
- Search not returning expansions
- Server errors (5xx status codes)
- Response times > 15 seconds

## 🔄 Running Tests

### Manual Testing
1. Select individual requests
2. Click "Send"
3. Check response and test results

### Automated Testing
1. Use Postman's Collection Runner
2. Set up CI/CD integration with Newman
3. Schedule regular test runs

### Newman CLI
```bash
# Install Newman
npm install -g newman

# Run collection
newman run BGG-GraphQL-Expansions-Tests.postman_collection.json \
  -e BGG-GraphQL-Environment.postman_environment.json \
  --reporters cli,html \
  --reporter-html-export results.html
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if API is running
   - Verify URL in environment variables

2. **Timeout Errors**
   - BGG API can be slow
   - Increase timeout in Postman settings

3. **Empty Results**
   - Some users may have empty collections
   - Try different test usernames

4. **Rate Limiting**
   - BGG API has rate limits
   - Add delays between requests if needed

### Debug Tips

1. **Check Response Times**
   - Look at response time in Postman
   - BGG API can be slow (5-10 seconds)

2. **Verify Data**
   - Check actual response data
   - Ensure fields are populated correctly

3. **Test Individual Requests**
   - Run requests one by one
   - Identify which specific test is failing

## 📈 Performance Benchmarks

| Test Type | Expected Response Time | Max Acceptable |
|-----------|----------------------|----------------|
| Health Check | < 1s | 2s |
| Basic Query | < 2s | 5s |
| Expansion Detection | < 3s | 8s |
| Links Information | < 5s | 10s |
| ExpansionFor | < 8s | 15s |
| Complex Query | < 10s | 20s |

## 🔗 Related Documentation

- [GraphQL Schema](./src/schema/schema.graphql)
- [API Documentation](./README.md)
- [BGG XML API Documentation](https://boardgamegeek.com/wiki/page/BGG_XML_API2)

## 📝 Test Maintenance

### Adding New Tests
1. Create new request in collection
2. Add appropriate test scripts
3. Update documentation
4. Test with different data sets

### Updating Tests
1. Modify test scripts as needed
2. Update environment variables
3. Verify test coverage
4. Update documentation

### Monitoring
1. Set up automated test runs
2. Monitor test results over time
3. Alert on test failures
4. Track performance metrics
