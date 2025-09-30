# Jest Test Suite for BGG GraphQL Proxy

This document describes the comprehensive Jest test suite for the BGG GraphQL Proxy, focusing on unit testing the resolvers and data source functionality.

## 📁 Test Structure

```
src/__tests__/
├── resolvers.test.ts          # GraphQL resolver tests
├── bggDataSource.test.ts      # BGG data source tests
└── setup.ts                   # Jest setup configuration
```

## 🧪 Test Coverage

### **Resolver Tests** (`resolvers.test.ts`)

#### **Query Resolvers**

- ✅ **`thing`** - Single item fetching
- ✅ **`things`** - Multiple items fetching
- ✅ **`search`** - Search functionality with parameters
- ✅ **`user`** - User profile fetching
- ✅ **`userCollection`** - Collection with expansion workaround
- ✅ **`userPlays`** - Play history with pagination
- ✅ **`hotItems`** - Hot items with type filtering

#### **Thing Resolvers**

- ✅ **`baseGame`** - Expansion to base game relationship
- ✅ **`expansionFor`** - Base game to expansions relationship
- ✅ **Error handling** - API failures and edge cases
- ✅ **Performance** - Batching and rate limiting

#### **Test Scenarios**

1. **Basic Functionality** - All resolvers call correct data source methods
2. **Parameter Passing** - Arguments passed correctly to data sources
3. **Response Formatting** - Data formatted correctly for GraphQL
4. **Error Handling** - Graceful handling of API errors
5. **Edge Cases** - Null/undefined values, empty arrays
6. **Performance** - Batching, rate limiting, unnecessary calls

### **Data Source Tests** (`bggDataSource.test.ts`)

#### **Core Methods**

- ✅ **`getThing`** - Single item fetching and parsing
- ✅ **`getThings`** - Multiple items fetching and parsing
- ✅ **`searchThings`** - Search with type and exact parameters
- ✅ **`getUserCollection`** - Collection with expansion workaround
- ✅ **`normalizeThing`** - Data normalization and type mapping
- ✅ **`normalizeLinks`** - Link categorization and expansion detection

#### **Expansion Functionality**

- ✅ **Expansion Detection** - `isExpansion` field correctly set
- ✅ **Link Categorization** - Links properly categorized by type
- ✅ **Base Game Relationships** - Expansion to base game links
- ✅ **Collection Workaround** - BGG API bug handling

#### **Test Scenarios**

1. **XML Parsing** - Correct parsing of BGG XML responses
2. **Data Normalization** - Fields mapped to GraphQL schema
3. **Type Mapping** - BGG types mapped to GraphQL enums
4. **Link Processing** - Links categorized and expansion links identified
5. **Error Handling** - Network errors, parsing errors, API errors
6. **Edge Cases** - Missing fields, empty responses, malformed data

## 🚀 Running Tests

### **Install Dependencies**

```bash
npm install
```

### **Run All Tests**

```bash
npm test
```

### **Run Tests in Watch Mode**

```bash
npm run test:watch
```

### **Run Tests with Coverage**

```bash
npm run test:coverage
```

### **Run Specific Test Files**

```bash
# Test resolvers only
npx jest src/__tests__/resolvers.test.ts

# Test data source only
npx jest src/__tests__/bggDataSource.test.ts
```

### **Run Tests with Verbose Output**

```bash
npx jest --verbose
```

## 📊 Test Results

### **Expected Test Results**

- ✅ **All tests pass** - No failing tests
- ✅ **High coverage** - >90% code coverage
- ✅ **Fast execution** - Tests complete in <30 seconds
- ✅ **No console errors** - Clean test output

### **Test Categories**

1. **Unit Tests** - Individual function testing
2. **Integration Tests** - Component interaction testing
3. **Error Tests** - Error handling validation
4. **Performance Tests** - Batching and rate limiting
5. **Edge Case Tests** - Boundary condition testing

## 🔧 Test Configuration

### **Jest Configuration** (`jest.config.js`)

```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/__tests__/**",
    "!src/generated/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testTimeout: 10000,
  verbose: true,
};
```

### **Test Setup** (`setup.ts`)

- Console output suppression during tests
- Environment variable mocking
- Global test timeout configuration
- Test environment setup

## 🧪 Test Examples

### **Resolver Test Example**

```typescript
describe("thing resolver", () => {
  it("should call bggAPI.getThing with correct id", async () => {
    const mockThing = { id: "13", name: "CATAN", isExpansion: false };
    mockBGGDataSource.getThing.mockResolvedValue(mockThing);

    const result = await resolvers.Query!.thing!(
      null,
      { id: "13" },
      mockContext
    );

    expect(mockBGGDataSource.getThing).toHaveBeenCalledWith("13");
    expect(result).toEqual(mockThing);
  });
});
```

### **Data Source Test Example**

```typescript
describe("getThing", () => {
  it("should fetch and parse a single thing", async () => {
    const mockXmlResponse = '<item id="13" type="boardgame">...</item>';
    mockedAxios.get.mockResolvedValue({ data: mockXmlResponse });
    mockXmlParser.parseStringPromise.mockResolvedValue(mockParsedData);

    const result = await bggDataSource.getThing("13");

    expect(result).toEqual(
      expect.objectContaining({
        id: "13",
        name: "CATAN",
        isExpansion: false,
        type: "BOARDGAME",
      })
    );
  });
});
```

## 🐛 Troubleshooting

### **Common Issues**

1. **Test Timeouts**
   - Increase timeout in `jest.config.js`
   - Check for infinite loops in tests

2. **Mock Issues**
   - Ensure mocks are reset between tests
   - Check mock implementation matches real behavior

3. **Type Errors**
   - Ensure TypeScript types are correct
   - Check import paths and module resolution

4. **Coverage Issues**
   - Verify coverage configuration
   - Check excluded files in `collectCoverageFrom`

### **Debug Tips**

1. **Run Single Test**

   ```bash
   npx jest --testNamePattern="should fetch and parse a single thing"
   ```

2. **Debug Mode**

   ```bash
   npx jest --detectOpenHandles --forceExit
   ```

3. **Verbose Output**
   ```bash
   npx jest --verbose --no-coverage
   ```

## 📈 Coverage Goals

### **Target Coverage**

- **Overall**: >90%
- **Resolvers**: >95%
- **Data Source**: >90%
- **Error Handling**: >85%

### **Coverage Reports**

- **Text**: Console output
- **HTML**: `coverage/index.html`
- **LCOV**: `coverage/lcov.info`

## 🔄 Continuous Integration

### **GitHub Actions Example**

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

### **Pre-commit Hooks**

```bash
# Install husky for git hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm test"
```

## 📝 Adding New Tests

### **Test Structure**

```typescript
describe("Feature Name", () => {
  beforeEach(() => {
    // Setup for each test
  });

  it("should do something specific", async () => {
    // Arrange
    const input = "test input";
    const expected = "expected output";

    // Act
    const result = await functionUnderTest(input);

    // Assert
    expect(result).toEqual(expected);
  });
});
```

### **Best Practices**

1. **Descriptive test names** - Clear what the test validates
2. **Single responsibility** - One assertion per test
3. **Proper setup/teardown** - Clean state between tests
4. **Mock external dependencies** - Isolate units under test
5. **Test edge cases** - Boundary conditions and error states

## 🔗 Related Documentation

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TypeScript Jest](https://jestjs.io/docs/getting-started#using-typescript)
- [GraphQL Testing](https://www.apollographql.com/docs/apollo-server/testing/testing/)
- [BGG XML API](https://boardgamegeek.com/wiki/page/BGG_XML_API2)

## 📊 Test Metrics

### **Performance Benchmarks**

- **Test Execution**: <30 seconds
- **Memory Usage**: <100MB
- **Coverage Generation**: <5 seconds
- **Watch Mode**: <1 second per test

### **Quality Metrics**

- **Test Reliability**: >99% pass rate
- **Code Coverage**: >90%
- **Test Maintainability**: High
- **Documentation Coverage**: Complete
