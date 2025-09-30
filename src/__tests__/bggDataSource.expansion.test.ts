import { BGGDataSource } from "../datasources/bggDataSource";
import * as fs from "fs";
import * as path from "path";
import * as xml2js from "xml2js";

describe("BGGDataSource - Expansion Workaround Simple Test", () => {
  let dataSource: BGGDataSource;
  let boardgamesData: any;
  let expansionsData: any;

  beforeAll(async () => {
    // Load the updated fixture XML content with own=1 filter
    const boardgamesPath = path.join(
      __dirname,
      "./fixtures/stevmachine_boardgames.xml"
    );
    const expansionsPath = path.join(
      __dirname,
      "./fixtures/stevmachine_expansions.xml"
    );

    const boardgamesXml = fs.readFileSync(boardgamesPath, "utf8");
    const expansionsXml = fs.readFileSync(expansionsPath, "utf8");

    // Parse XML using the same parser as BGGDataSource
    const xmlParser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
      explicitRoot: false,
    });

    boardgamesData = await xmlParser.parseStringPromise(boardgamesXml);
    expansionsData = await xmlParser.parseStringPromise(expansionsXml);
  });

  beforeEach(() => {
    dataSource = new BGGDataSource("https://boardgamegeek.com/xmlapi2");
  });

  describe("Expansion workaround logic", () => {
    it("should combine boardgames and expansions data correctly", () => {
      // Test the logic that combines the two datasets
      const boardgameItems = boardgamesData?.item
        ? Array.isArray(boardgamesData.item)
          ? boardgamesData.item
          : [boardgamesData.item]
        : [];
      const expansionItems = expansionsData?.item
        ? Array.isArray(expansionsData.item)
          ? expansionsData.item
          : [expansionsData.item]
        : [];

      const allItems = [...boardgameItems, ...expansionItems];

      // Create combined collection data
      const combinedData = {
        totalitems:
          (parseInt(boardgamesData?.totalitems) || 0) +
          (parseInt(expansionsData?.totalitems) || 0),
        pubdate: boardgamesData?.pubdate || expansionsData?.pubdate || "",
        item: allItems,
      };

      expect(combinedData.totalitems).toBe(75); // 62 boardgames + 13 expansions
      expect(allItems).toHaveLength(75);
      expect(boardgameItems).toHaveLength(62);
      expect(expansionItems).toHaveLength(13);
    });

    it("should have correct item structure", () => {
      const boardgameItems = boardgamesData?.item
        ? Array.isArray(boardgamesData.item)
          ? boardgamesData.item
          : [boardgamesData.item]
        : [];
      const expansionItems = expansionsData?.item
        ? Array.isArray(expansionsData.item)
          ? expansionsData.item
          : [expansionsData.item]
        : [];

      // Check first boardgame
      const firstBoardgame = boardgameItems[0];
      expect(firstBoardgame.objecttype).toBe("thing");
      expect(firstBoardgame.subtype).toBe("boardgame");
      expect(firstBoardgame.name._).toBe("7 Wonders (Second Edition)");
      expect(firstBoardgame.status).toBeDefined();

      // Check first expansion
      const firstExpansion = expansionItems[0];
      expect(firstExpansion.objecttype).toBe("thing");
      expect(firstExpansion.subtype).toBe("boardgameexpansion");
      expect(firstExpansion.name._).toBe("Coup: Reformation");
      expect(firstExpansion.status).toBeDefined();
    });

    it("should normalize collection data correctly", () => {
      // Test the normalizeCollection method with our fixture data
      const boardgameItems = boardgamesData?.item
        ? Array.isArray(boardgamesData.item)
          ? boardgamesData.item
          : [boardgamesData.item]
        : [];
      const expansionItems = expansionsData?.item
        ? Array.isArray(expansionsData.item)
          ? expansionsData.item
          : [expansionsData.item]
        : [];

      const allItems = [...boardgameItems, ...expansionItems];

      const combinedData = {
        totalitems:
          (parseInt(boardgamesData?.totalitems) || 0) +
          (parseInt(expansionsData?.totalitems) || 0),
        pubdate: boardgamesData?.pubdate || expansionsData?.pubdate || "",
        item: allItems,
      };

      // Test the normalizeCollection method
      const result = (dataSource as any).normalizeCollection(combinedData);

      expect(result).toBeDefined();
      expect(result.totalItems).toBe(75);
      expect(result.items).toHaveLength(75);
      expect(result.pubDate).toBe("Tue, 30 Sep 2025 00:46:01 +0000");

      // Check that all items have the correct structure
      result.items.forEach((item: any) => {
        expect(item).toHaveProperty("__typename", "CollectionItem");
        expect(item).toHaveProperty("objectId");
        expect(item).toHaveProperty("name");
        expect(item).toHaveProperty("subtype");
        expect(item).toHaveProperty("status");
        expect(item).toHaveProperty("stats");
        expect(item.stats).toHaveProperty("__typename", "CollectionItemStats");
      });

      // Check that we have the right mix
      const boardgames = result.items.filter(
        (item: any) => item.subtype === "boardgame"
      );
      const expansions = result.items.filter(
        (item: any) => item.subtype === "boardgameexpansion"
      );

      expect(boardgames).toHaveLength(62);
      expect(expansions).toHaveLength(13);
    });
  });
});
