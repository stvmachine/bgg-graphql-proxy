import { BGGDataSource } from '../datasources/bggDataSource';
import axios from 'axios';
import * as xml2js from 'xml2js';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock xml2js
jest.mock('xml2js');
const mockedXml2js = xml2js as jest.Mocked<typeof xml2js>;

describe('BGGDataSource - Simple Tests', () => {
  let bggDataSource: BGGDataSource;
  let mockXmlParser: jest.Mocked<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock XML parser
    mockXmlParser = {
      parseStringPromise: jest.fn(),
    };
    
    mockedXml2js.Parser.mockReturnValue(mockXmlParser);
    
    bggDataSource = new BGGDataSource('https://boardgamegeek.com/xmlapi2');
  });

  describe('getThing', () => {
    it('should fetch and parse a single thing', async () => {
      const mockXmlResponse = `
        <item id="13" type="boardgame">
          <name type="primary" value="CATAN"/>
          <yearpublished value="1995"/>
          <minplayers value="3"/>
          <maxplayers value="4"/>
          <playingtime value="90"/>
          <minage value="10"/>
          <description>Strategy game</description>
          <image>https://example.com/image.jpg</image>
          <thumbnail>https://example.com/thumb.jpg</thumbnail>
          <link type="boardgamecategory" id="1" value="Strategy"/>
          <link type="boardgameexpansion" id="926" value="Cities & Knights"/>
        </item>
      `;

      const mockParsedData = {
        item: {
          id: '13',
          type: 'boardgame',
          name: { type: 'primary', value: 'CATAN' },
          yearpublished: { value: '1995' },
          minplayers: { value: '3' },
          maxplayers: { value: '4' },
          playingtime: { value: '90' },
          minage: { value: '10' },
          description: { value: 'Strategy game' },
          image: { value: 'https://example.com/image.jpg' },
          thumbnail: { value: 'https://example.com/thumb.jpg' },
          link: [
            { type: 'boardgamecategory', id: '1', value: 'Strategy' },
            { type: 'boardgameexpansion', id: '926', value: 'Cities & Knights' },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue({
        data: mockXmlResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      mockXmlParser.parseStringPromise.mockResolvedValue(mockParsedData);

      const result = await bggDataSource.getThing('13');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://boardgamegeek.com/xmlapi2/thing?id=13&stats=1',
        expect.any(Object)
      );
      expect(result).toEqual(expect.objectContaining({
        id: '13',
        name: 'CATAN',
        isExpansion: false,
        type: 'BOARDGAME',
        yearPublished: 1995,
        minPlayers: 3,
        maxPlayers: 4,
        playingTime: 90,
        minAge: 10,
        description: 'Strategy game',
        image: 'https://example.com/image.jpg',
        thumbnail: 'https://example.com/thumb.jpg',
        links: expect.arrayContaining([
          expect.objectContaining({
            type: 'boardgamecategory',
            id: '1',
            value: 'Strategy',
            linkType: 'BOARDGAME_CATEGORY',
            targetId: '1',
            targetName: 'Strategy',
            isExpansionLink: false,
          }),
          expect.objectContaining({
            type: 'boardgameexpansion',
            id: '926',
            value: 'Cities & Knights',
            linkType: 'BOARDGAME_EXPANSION',
            targetId: '926',
            targetName: 'Cities & Knights',
            isExpansionLink: true,
          }),
        ]),
      }));
    });

    it('should return null for non-existent thing', async () => {
      const mockXmlResponse = '<items></items>';

      mockedAxios.get.mockResolvedValue({
        data: mockXmlResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      mockXmlParser.parseStringPromise.mockResolvedValue({});

      const result = await bggDataSource.getThing('999999');

      expect(result).toBeNull();
    });

    it('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(bggDataSource.getThing('13')).rejects.toThrow('BGG API request failed: Network error');
    });
  });

  describe('getThings', () => {
    it('should fetch and parse multiple things', async () => {
      const mockXmlResponse = `
        <item id="13" type="boardgame">
          <name type="primary" value="CATAN"/>
        </item>
        <item id="926" type="boardgameexpansion">
          <name type="primary" value="Cities & Knights"/>
        </item>
      `;

      const mockParsedData = {
        item: [
          {
            id: '13',
            type: 'boardgame',
            name: { type: 'primary', value: 'CATAN' },
          },
          {
            id: '926',
            type: 'boardgameexpansion',
            name: { type: 'primary', value: 'Cities & Knights' },
          },
        ],
      };

      mockedAxios.get.mockResolvedValue({
        data: mockXmlResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      mockXmlParser.parseStringPromise.mockResolvedValue(mockParsedData);

      const result = await bggDataSource.getThings(['13', '926']);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://boardgamegeek.com/xmlapi2/thing?id=13,926&stats=1',
        expect.any(Object)
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expect.objectContaining({
        id: '13',
        name: 'CATAN',
        isExpansion: false,
        type: 'BOARDGAME',
      }));
      expect(result[1]).toEqual(expect.objectContaining({
        id: '926',
        name: 'Cities & Knights',
        isExpansion: true,
        type: 'BOARDGAMEEXPANSION',
      }));
    });

    it('should handle single item response', async () => {
      const mockParsedData = {
        item: {
          id: '13',
          type: 'boardgame',
          name: { type: 'primary', value: 'CATAN' },
        },
      };

      mockedAxios.get.mockResolvedValue({
        data: '<item id="13" type="boardgame"><name type="primary" value="CATAN"/></item>',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      mockXmlParser.parseStringPromise.mockResolvedValue(mockParsedData);

      const result = await bggDataSource.getThings(['13']);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expect.objectContaining({
        id: '13',
        name: 'CATAN',
        isExpansion: false,
        type: 'BOARDGAME',
      }));
    });
  });

  describe('searchThings', () => {
    it('should search for things with query', async () => {
      const mockParsedData = {
        item: [
          {
            id: '13',
            type: 'boardgame',
            name: { type: 'primary', value: 'CATAN' },
          },
        ],
      };

      mockedAxios.get.mockResolvedValue({
        data: '<item id="13" type="boardgame"><name type="primary" value="CATAN"/></item>',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      mockXmlParser.parseStringPromise.mockResolvedValue(mockParsedData);

      const result = await bggDataSource.searchThings('Catan');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://boardgamegeek.com/xmlapi2/search?query=Catan',
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expect.objectContaining({
        id: '13',
        name: 'CATAN',
        isExpansion: false,
        type: 'BOARDGAME',
      }));
    });

    it('should search with type and exact parameters', async () => {
      const mockParsedData = { item: [] };

      mockedAxios.get.mockResolvedValue({
        data: '<items></items>',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      mockXmlParser.parseStringPromise.mockResolvedValue(mockParsedData);

      await bggDataSource.searchThings('Catan', 'boardgame', true);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://boardgamegeek.com/xmlapi2/search?query=Catan&type=boardgame&exact=1',
        expect.any(Object)
      );
    });
  });

  describe('getUserCollection', () => {
    it('should fetch user collection with workaround for boardgame subtype', async () => {
      const mockBoardgamesData = {
        totalitems: '5',
        pubdate: '2023-01-01',
        items: [
          { objectid: '13', name: 'CATAN', subtype: 'boardgame' },
        ],
      };

      const mockExpansionsData = {
        totalitems: '3',
        pubdate: '2023-01-01',
        items: [
          { objectid: '926', name: 'Cities & Knights', subtype: 'boardgameexpansion' },
        ],
      };

      mockedAxios.get
        .mockResolvedValueOnce({
          data: '<items totalitems="5"><item objectid="13" name="CATAN" subtype="boardgame"/></items>',
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        })
        .mockResolvedValueOnce({
          data: '<items totalitems="3"><item objectid="926" name="Cities & Knights" subtype="boardgameexpansion"/></items>',
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        });

      mockXmlParser.parseStringPromise
        .mockResolvedValueOnce(mockBoardgamesData)
        .mockResolvedValueOnce(mockExpansionsData);

      const result = await bggDataSource.getUserCollection('testuser', 'boardgame');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://boardgamegeek.com/xmlapi2/collection?username=testuser&excludesubtype=boardgameexpansion',
        expect.any(Object)
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://boardgamegeek.com/xmlapi2/collection?username=testuser&subtype=boardgameexpansion',
        expect.any(Object)
      );

      expect(result).toEqual(expect.objectContaining({
        totalItems: expect.any(Number),
        pubDate: '2023-01-01',
        items: expect.arrayContaining([
          expect.objectContaining({ objectid: '13', name: 'CATAN', subtype: 'boardgame' }),
          expect.objectContaining({ objectid: '926', name: 'Cities & Knights', subtype: 'boardgameexpansion' }),
        ]),
      }));
    });

    it('should use normal approach for non-boardgame subtypes', async () => {
      const mockData = {
        totalitems: '2',
        pubdate: '2023-01-01',
        items: [
          { objectid: '926', name: 'Cities & Knights', subtype: 'boardgameexpansion' },
        ],
      };

      mockedAxios.get.mockResolvedValue({
        data: '<items totalitems="2"><item objectid="926" name="Cities & Knights" subtype="boardgameexpansion"/></items>',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      mockXmlParser.parseStringPromise.mockResolvedValue(mockData);

      const result = await bggDataSource.getUserCollection('testuser', 'boardgameexpansion');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://boardgamegeek.com/xmlapi2/collection?username=testuser&subtype=boardgameexpansion',
        expect.any(Object)
      );
      expect(result).toEqual({
        totalItems: 2,
        pubDate: '2023-01-01',
        items: [
          { objectid: '926', name: 'Cities & Knights', subtype: 'boardgameexpansion' },
        ],
      });
    });

    it('should fallback to original method if workaround fails', async () => {
      mockedAxios.get
        .mockRejectedValueOnce(new Error('First call failed'))
        .mockResolvedValueOnce({
          data: '<items totalitems="1"><item objectid="13" name="CATAN" subtype="boardgame"/></items>',
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        });

      mockXmlParser.parseStringPromise.mockResolvedValue({
        totalitems: '1',
        pubdate: '2023-01-01',
        items: [{ objectid: '13', name: 'CATAN', subtype: 'boardgame' }],
      });

      const result = await bggDataSource.getUserCollection('testuser', 'boardgame');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://boardgamegeek.com/xmlapi2/collection?username=testuser',
        expect.any(Object)
      );
      expect(result).toEqual({
        totalItems: 1,
        pubDate: '2023-01-01',
        items: [{ objectid: '13', name: 'CATAN', subtype: 'boardgame' }],
      });
    });
  });

  describe('normalizeThing', () => {
    it('should normalize thing with all fields', async () => {
      const mockItem = {
        id: '13',
        type: 'boardgame',
        name: { type: 'primary', value: 'CATAN' },
        yearpublished: { value: '1995' },
        minplayers: { value: '3' },
        maxplayers: { value: '4' },
        playingtime: { value: '90' },
        minage: { value: '10' },
        description: { value: 'Strategy game' },
        image: { value: 'https://example.com/image.jpg' },
        thumbnail: { value: 'https://example.com/thumb.jpg' },
        link: [
          { type: 'boardgamecategory', id: '1', value: 'Strategy' },
          { type: 'boardgameexpansion', id: '926', value: 'Cities & Knights' },
        ],
      };

      mockedAxios.get.mockResolvedValue({
        data: '<item id="13" type="boardgame"><name type="primary" value="CATAN"/></item>',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      mockXmlParser.parseStringPromise.mockResolvedValue({ item: mockItem });

      const result = await bggDataSource.getThing('13');

      expect(result).toEqual(expect.objectContaining({
        id: '13',
        name: 'CATAN',
        isExpansion: false,
        type: 'BOARDGAME',
        yearPublished: 1995,
        minPlayers: 3,
        maxPlayers: 4,
        playingTime: 90,
        minAge: 10,
        description: 'Strategy game',
        image: 'https://example.com/image.jpg',
        thumbnail: 'https://example.com/thumb.jpg',
        links: expect.arrayContaining([
          expect.objectContaining({
            type: 'boardgamecategory',
            id: '1',
            value: 'Strategy',
            linkType: 'BOARDGAME_CATEGORY',
            targetId: '1',
            targetName: 'Strategy',
            isExpansionLink: false,
          }),
        ]),
      }));
    });

    it('should handle expansion type correctly', async () => {
      const mockItem = {
        id: '926',
        type: 'boardgameexpansion',
        name: { type: 'primary', value: 'Cities & Knights' },
      };

      mockedAxios.get.mockResolvedValue({
        data: '<item id="926" type="boardgameexpansion"><name type="primary" value="Cities & Knights"/></item>',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      mockXmlParser.parseStringPromise.mockResolvedValue({ item: mockItem });

      const result = await bggDataSource.getThing('926');

      expect(result).toEqual(expect.objectContaining({
        id: '926',
        name: 'Cities & Knights',
        isExpansion: true,
        type: 'BOARDGAMEEXPANSION',
      }));
    });
  });

  describe('Error Handling', () => {
    it('should handle XML parsing errors', async () => {
      mockedAxios.get.mockResolvedValue({
        data: 'invalid xml',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      mockXmlParser.parseStringPromise.mockRejectedValue(new Error('XML parsing error'));

      await expect(bggDataSource.getThing('13')).rejects.toThrow('Failed to parse XML response from BGG API');
    });

    it('should handle network timeouts', async () => {
      mockedAxios.get.mockRejectedValue(new Error('timeout of 10000ms exceeded'));

      await expect(bggDataSource.getThing('13')).rejects.toThrow('BGG API request failed: timeout of 10000ms exceeded');
    });

    it('should handle HTTP errors', async () => {
      mockedAxios.get.mockRejectedValue({
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: 'Server Error',
        },
      });

      await expect(bggDataSource.getThing('13')).rejects.toThrow();
    });
  });
});
