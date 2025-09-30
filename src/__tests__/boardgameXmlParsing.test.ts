import * as fs from "fs";
import * as path from "path";
import * as xml2js from "xml2js";

describe("XML Parsing Tests", () => {
  let xmlParser: xml2js.Parser;
  let xmlContent: string;

  beforeAll(() => {
    // Load the fixture XML content
    const fixturePath = path.join(
      __dirname,
      "./fixtures/stevmachine_collection.xml"
    );
    xmlContent = fs.readFileSync(fixturePath, "utf8");

    // Initialize XML parser with same config as BGGDataSource
    xmlParser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
      explicitRoot: false,
    });
  });

  describe("boardgamegeek collection XML parsing", () => {
    it("should parse XML content correctly", async () => {
      expect(xmlContent.length).toBeGreaterThan(0);
      expect(xmlContent).toContain('<?xml version="1.0"');
      expect(xmlContent).toContain('<items totalitems="75"');
    });

    it("should parse XML structure correctly", async () => {
      const result = await xmlParser.parseStringPromise(xmlContent);

      // Check root structure
      expect(result).toBeDefined();
      expect(Object.keys(result)).toEqual([
        "totalitems",
        "termsofuse",
        "pubdate",
        "item",
      ]);

      // Check metadata
      expect(result.totalitems).toBe("75");
      expect(result.pubdate).toBe("Tue, 30 Sep 2025 00:45:57 +0000");
      expect(result.termsofuse).toBe(
        "https://boardgamegeek.com/xmlapi/termsofuse"
      );
    });

    it("should parse items array correctly", async () => {
      const result = await xmlParser.parseStringPromise(xmlContent);

      // Check items structure
      expect(result.item).toBeDefined();
      expect(Array.isArray(result.item)).toBe(true);
      expect(result.item.length).toBe(75);
    });

    it("should parse first item correctly", async () => {
      const result = await xmlParser.parseStringPromise(xmlContent);
      const firstItem = result.item[0];

      // Check item structure
      expect(firstItem).toBeDefined();
      expect(Object.keys(firstItem)).toEqual([
        "objecttype",
        "objectid",
        "subtype",
        "collid",
        "name",
        "yearpublished",
        "image",
        "thumbnail",
        "stats",
        "status",
        "numplays",
      ]);

      // Check item properties
      expect(firstItem.objecttype).toBe("thing");
      expect(firstItem.objectid).toBe("316377");
      expect(firstItem.subtype).toBe("boardgame");
      expect(firstItem.collid).toBe("83135926");
      expect(firstItem.yearpublished).toBe("2020");
      expect(firstItem.numplays).toBe("0");
    });

    it("should parse name field correctly", async () => {
      const result = await xmlParser.parseStringPromise(xmlContent);
      const firstItem = result.item[0];

      // Check name structure (XML parser converts to object with _ property)
      expect(firstItem.name).toBeDefined();
      expect(typeof firstItem.name).toBe("object");
      expect(firstItem.name._).toBe("7 Wonders (Second Edition)");
      expect(firstItem.name.sortindex).toBe("1");
    });

    it("should parse status field correctly", async () => {
      const result = await xmlParser.parseStringPromise(xmlContent);
      const firstItem = result.item[0];

      // Check status structure
      expect(firstItem.status).toBeDefined();
      expect(typeof firstItem.status).toBe("object");
      expect(firstItem.status.own).toBe("1");
      expect(firstItem.status.prevowned).toBe("0");
      expect(firstItem.status.fortrade).toBe("0");
      expect(firstItem.status.want).toBe("0");
      expect(firstItem.status.wanttoplay).toBe("0");
      expect(firstItem.status.wanttobuy).toBe("0");
      expect(firstItem.status.wishlist).toBe("0");
      expect(firstItem.status.preordered).toBe("0");
      expect(firstItem.status.lastmodified).toBe("2023-11-05 17:33:09");
    });

    it("should parse image URLs correctly", async () => {
      const result = await xmlParser.parseStringPromise(xmlContent);
      const firstItem = result.item[0];

      // Check image URLs
      expect(firstItem.image).toContain("https://cf.geekdo-images.com/");
      expect(firstItem.thumbnail).toContain("https://cf.geekdo-images.com/");
      expect(firstItem.image).toContain("__original/");
      expect(firstItem.thumbnail).toContain("__small/");
    });

    it("should parse stats field correctly", async () => {
      const result = await xmlParser.parseStringPromise(xmlContent);
      const firstItem = result.item[0];

      // Check stats structure
      expect(firstItem.stats).toBeDefined();
      expect(typeof firstItem.stats).toBe("object");
      expect(firstItem.stats.minplayers).toBe("3");
      expect(firstItem.stats.maxplayers).toBe("7");
      expect(firstItem.stats.minplaytime).toBe("30");
      expect(firstItem.stats.maxplaytime).toBe("30");
      expect(firstItem.stats.playingtime).toBe("30");
      expect(firstItem.stats.numowned).toBe("17570");
    });

    it("should have consistent item structure across all items", async () => {
      const result = await xmlParser.parseStringPromise(xmlContent);

      // Check that all items have the same structure
      const expectedKeys = [
        "objecttype",
        "objectid",
        "subtype",
        "collid",
        "name",
        "yearpublished",
        "image",
        "thumbnail",
        "stats",
        "status",
        "numplays",
      ];

      result.item.forEach((item: any, _index: number) => {
        const itemKeys = Object.keys(item);
        expect(itemKeys).toEqual(expect.arrayContaining(expectedKeys));

        // Check required fields are not empty
        expect(item.objectid).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.status).toBeDefined();

        // Check name structure
        expect(typeof item.name).toBe("object");
        expect(item.name._).toBeDefined();
        expect(typeof item.name._).toBe("string");
        expect(item.name._.length).toBeGreaterThan(0);
      });
    });

    it("should handle different item types correctly", async () => {
      const result = await xmlParser.parseStringPromise(xmlContent);

      // Find items with different subtypes
      const subtypes = [
        ...new Set(result.item.map((item: any) => item.subtype)),
      ];
      expect(subtypes.length).toBeGreaterThan(0);

      // Check that all items have valid subtypes
      subtypes.forEach(subtype => {
        expect([
          "boardgame",
          "boardgameexpansion",
          "rpgitem",
          "videogame",
          "boardgameaccessory",
        ]).toContain(subtype);
      });
    });
  });
});
