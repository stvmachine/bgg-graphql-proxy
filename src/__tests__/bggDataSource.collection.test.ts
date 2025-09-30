import { BGGDataSource } from "../datasources/bggDataSource";

describe("BGGDataSource - Collection Tests", () => {
  let bggDataSource: BGGDataSource;

  beforeEach(() => {
    // Create a new instance for each test
    bggDataSource = new BGGDataSource("https://boardgamegeek.com/xmlapi2");
  });

  describe("getUserCollection", () => {
    it("should parse stevmachine collection correctly", async () => {
      // Mock the makeRequest method to return our fixture data
      const mockData = {
        totalitems: "302",
        pubdate: "Mon, 29 Sep 2025 23:09:34 +0000",
        item: [
          {
            objecttype: "thing",
            objectid: "68448",
            subtype: "boardgame",
            collid: "81513277",
            name: { _: "7 Wonders", sortindex: "1" },
            yearpublished: "2010",
            image:
              "https://cf.geekdo-images.com/35h9Za_JvMMMtx_92kT0Jg__original/img/jt70jJDZ1y1FWJs4ZQf5FI8APVY=/0x0/filters:format(jpeg)/pic7149798.jpg",
            thumbnail:
              "https://cf.geekdo-images.com/35h9Za_JvMMMtx_92kT0Jg__small/img/BUOso8b0M1aUOkU80FWlhE8uuxc=/fit-in/200x150/filters:strip_icc()/pic7149798.jpg",
            status: {
              own: "0",
              prevowned: "1",
              fortrade: "0",
              want: "0",
              wanttoplay: "0",
              wanttobuy: "0",
              wishlist: "0",
              preordered: "0",
              lastmodified: "2021-06-19 02:39:56",
            },
            numplays: "6",
          },
        ],
      };

      // Mock the makeRequest method
      jest
        .spyOn(bggDataSource as any, "makeRequest")
        .mockResolvedValue(mockData);

      const result = await bggDataSource.getUserCollection("stevmachine");

      expect(result).not.toBeNull();
      expect(result?.totalItems).toBe(302);
      expect(result?.pubDate).toBe("Mon, 29 Sep 2025 23:09:34 +0000");
      expect(result?.items).toHaveLength(1);

      const firstItem = result?.items[0];
      expect(firstItem?.objectId).toBe("68448");
      expect(firstItem?.name).toBe("7 Wonders");
      expect(firstItem?.yearPublished).toBe(2010);
      expect(firstItem?.numPlays).toBe(6);
      expect(firstItem?.status.own).toBe("0");
      expect(firstItem?.status.prevOwned).toBe("1");
    });

    it("should handle empty collection", async () => {
      const mockData = {
        totalitems: "0",
        pubdate: "Mon, 29 Sep 2025 23:09:34 +0000",
        item: [],
      };

      jest
        .spyOn(bggDataSource as any, "makeRequest")
        .mockResolvedValue(mockData);

      const result = await bggDataSource.getUserCollection("emptyuser");

      expect(result).not.toBeNull();
      expect(result?.totalItems).toBe(0);
      expect(result?.pubDate).toBe("Mon, 29 Sep 2025 23:09:34 +0000");
      expect(result?.items).toHaveLength(0);
    });

    it("should handle single item collection", async () => {
      const mockData = {
        totalitems: "1",
        pubdate: "Mon, 29 Sep 2025 23:09:34 +0000",
        item: {
          objecttype: "thing",
          objectid: "12345",
          subtype: "boardgame",
          collid: "123456",
          name: { _: "Test Game", sortindex: "1" },
          yearpublished: "2020",
          image: "https://example.com/image.jpg",
          thumbnail: "https://example.com/thumb.jpg",
          status: {
            own: "1",
            prevowned: "0",
            fortrade: "0",
            want: "0",
            wanttoplay: "0",
            wanttobuy: "0",
            wishlist: "0",
            preordered: "0",
            lastmodified: "2021-01-01 00:00:00",
          },
          numplays: "5",
        },
      };

      jest
        .spyOn(bggDataSource as any, "makeRequest")
        .mockResolvedValue(mockData);

      const result = await bggDataSource.getUserCollection("singleuser");

      expect(result).not.toBeNull();
      expect(result?.totalItems).toBe(1);
      expect(result?.items).toHaveLength(1);

      const item = result?.items[0];
      expect(item?.objectId).toBe("12345");
      expect(item?.name).toBe("Test Game");
      expect(item?.status.own).toBe("1");
    });
  });

  describe("normalizeCollection", () => {
    it("should normalize collection data correctly", () => {
      const mockData = {
        totalitems: "2",
        pubdate: "Mon, 29 Sep 2025 23:09:34 +0000",
        item: [
          {
            objecttype: "thing",
            objectid: "11111",
            subtype: "boardgame",
            collid: "111111",
            name: { _: "Game 1", sortindex: "1" },
            yearpublished: "2020",
            image: "https://example.com/game1.jpg",
            thumbnail: "https://example.com/game1_thumb.jpg",
            status: {
              own: "1",
              prevowned: "0",
              fortrade: "0",
              want: "0",
              wanttoplay: "0",
              wanttobuy: "0",
              wishlist: "0",
              preordered: "0",
              lastmodified: "2021-01-01 00:00:00",
            },
            numplays: "10",
          },
          {
            objecttype: "thing",
            objectid: "22222",
            subtype: "boardgame",
            collid: "222222",
            name: { _: "Game 2", sortindex: "1" },
            yearpublished: "2021",
            image: "https://example.com/game2.jpg",
            thumbnail: "https://example.com/game2_thumb.jpg",
            status: {
              own: "0",
              prevowned: "1",
              fortrade: "0",
              want: "0",
              wanttoplay: "0",
              wanttobuy: "0",
              wishlist: "0",
              preordered: "0",
              lastmodified: "2021-02-01 00:00:00",
            },
            numplays: "3",
          },
        ],
      };

      const result = (bggDataSource as any).normalizeCollection(mockData);

      expect(result.totalItems).toBe(2);
      expect(result.pubDate).toBe("Mon, 29 Sep 2025 23:09:34 +0000");
      expect(result.items).toHaveLength(2);

      // Check first item
      const firstItem = result.items[0];
      expect(firstItem.objectId).toBe("11111");
      expect(firstItem.name).toBe("Game 1");
      expect(firstItem.yearPublished).toBe(2020);
      expect(firstItem.numPlays).toBe(10);
      expect(firstItem.status.own).toBe("1");
      expect(firstItem.status.prevOwned).toBe("0");

      // Check second item
      const secondItem = result.items[1];
      expect(secondItem.objectId).toBe("22222");
      expect(secondItem.name).toBe("Game 2");
      expect(secondItem.yearPublished).toBe(2021);
      expect(secondItem.numPlays).toBe(3);
      expect(secondItem.status.own).toBe("0");
      expect(secondItem.status.prevOwned).toBe("1");
    });
  });
});
