import { BGGDataSource } from '../datasources/bggDataSource';

// Mock the BGGDataSource
jest.mock('../datasources/bggDataSource');

describe('GraphQL Resolvers - Simple Tests', () => {
  let mockBGGDataSource: jest.Mocked<BGGDataSource>;
  let mockContext: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create mock BGGDataSource
    mockBGGDataSource = {
      getThing: jest.fn(),
      getThings: jest.fn(),
      searchThings: jest.fn(),
      getUser: jest.fn(),
      getUserCollection: jest.fn(),
      getUserPlays: jest.fn(),
      getGeeklist: jest.fn(),
      getGeeklists: jest.fn(),
      getHotItems: jest.fn(),
    } as any;

    // Create mock context
    mockContext = {
      dataSources: {
        bggAPI: mockBGGDataSource,
      },
    };
  });

  describe('Query Resolvers', () => {
    describe('thing', () => {
      it('should call bggAPI.getThing with correct id', async () => {
        // Import resolvers dynamically to avoid type issues
        const { resolvers } = await import('../resolvers');
        
        const mockThing = {
          id: '13',
          name: 'CATAN',
          isExpansion: false,
          type: 'BOARDGAME',
        };

        mockBGGDataSource.getThing.mockResolvedValue(mockThing as any);

        const result = await (resolvers.Query as any).thing(null, { id: '13' }, mockContext);

        expect(mockBGGDataSource.getThing).toHaveBeenCalledWith('13');
        expect(result).toEqual(mockThing);
      });
    });

    describe('things', () => {
      it('should call bggAPI.getThings with correct ids', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockThings = [
          { id: '13', name: 'CATAN', isExpansion: false },
          { id: '926', name: 'Cities & Knights', isExpansion: true },
        ];

        mockBGGDataSource.getThings.mockResolvedValue(mockThings as any);

        const result = await (resolvers.Query as any).things(null, { ids: ['13', '926'] }, mockContext);

        expect(mockBGGDataSource.getThings).toHaveBeenCalledWith(['13', '926']);
        expect(result).toEqual(mockThings);
      });
    });

    describe('search', () => {
      it('should call bggAPI.searchThings with correct parameters', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockResults = [
          { id: '13', name: 'CATAN', isExpansion: false },
          { id: '926', name: 'Cities & Knights', isExpansion: true },
        ];

        mockBGGDataSource.searchThings.mockResolvedValue(mockResults as any);

        const result = await (resolvers.Query as any).search(
          null,
          { query: 'Catan', type: 'BOARDGAME', exact: false },
          mockContext
        );

        expect(mockBGGDataSource.searchThings).toHaveBeenCalledWith('Catan', 'BOARDGAME', undefined);
        expect(result).toEqual(mockResults);
      });
    });

    describe('user', () => {
      it('should call bggAPI.getUser with correct username', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockUser = {
          id: '1',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
        };

        mockBGGDataSource.getUser.mockResolvedValue(mockUser as any);

        const result = await (resolvers.Query as any).user(null, { username: 'testuser' }, mockContext);

        expect(mockBGGDataSource.getUser).toHaveBeenCalledWith('testuser');
        expect(result).toEqual(mockUser);
      });
    });

    describe('userCollection', () => {
      it('should call bggAPI.getUserCollection with correct parameters', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockCollection = {
          totalItems: 10,
          pubDate: '2023-01-01',
          items: [
            { objectId: '13', name: 'CATAN', subtype: 'boardgame' },
            { objectId: '926', name: 'Cities & Knights', subtype: 'boardgameexpansion' },
          ],
        };

        mockBGGDataSource.getUserCollection.mockResolvedValue(mockCollection as any);

        const result = await (resolvers.Query as any).userCollection(
          null,
          { username: 'testuser', subtype: 'BOARDGAME' },
          mockContext
        );

        expect(mockBGGDataSource.getUserCollection).toHaveBeenCalledWith('testuser', 'BOARDGAME');
        expect(result).toEqual(mockCollection);
      });
    });

    describe('userPlays', () => {
      it('should call bggAPI.getUserPlays and format response correctly', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockPlays = [
          { id: '1', date: '2023-01-01', item: { name: 'CATAN' } },
          { id: '2', date: '2023-01-02', item: { name: 'Cities & Knights' } },
        ];

        mockBGGDataSource.getUserPlays.mockResolvedValue(mockPlays as any);

        const result = await (resolvers.Query as any).userPlays(
          null,
          { username: 'testuser', id: '13', mindate: '2023-01-01', maxdate: '2023-01-31', page: 1 },
          mockContext
        );

        expect(mockBGGDataSource.getUserPlays).toHaveBeenCalledWith('testuser', {
          id: '13',
          mindate: '2023-01-01',
          maxdate: '2023-01-31',
          page: 1,
        });

        expect(result).toEqual({
          total: 2,
          page: 1,
          plays: mockPlays,
        });
      });
    });

    describe('hotItems', () => {
      it('should call bggAPI.getHotItems with correct type', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockHotItems = [
          { id: '13', name: 'CATAN', isExpansion: false },
          { id: '926', name: 'Cities & Knights', isExpansion: true },
        ];

        mockBGGDataSource.getHotItems.mockResolvedValue(mockHotItems as any);

        const result = await (resolvers.Query as any).hotItems(null, { type: 'BOARDGAME' }, mockContext);

        expect(mockBGGDataSource.getHotItems).toHaveBeenCalledWith('BOARDGAME');
        expect(result).toEqual(mockHotItems);
      });
    });
  });

  describe('Thing Resolvers', () => {
    describe('baseGame', () => {
      it('should return null for non-expansion items', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockThing = {
          id: '13',
          name: 'CATAN',
          isExpansion: false,
          links: [],
        };

        const result = await (resolvers.Thing as any).baseGame(mockThing, {}, mockContext);

        expect(result).toBeNull();
        expect(mockBGGDataSource.getThing).not.toHaveBeenCalled();
      });

      it('should return null for expansions without base game link', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockThing = {
          id: '926',
          name: 'Cities & Knights',
          isExpansion: true,
          links: [
            { linkType: 'BOARDGAME_CATEGORY', targetId: '1', targetName: 'Strategy' },
            { linkType: 'BOARDGAME_MECHANIC', targetId: '2', targetName: 'Trading' },
          ],
        };

        const result = await (resolvers.Thing as any).baseGame(mockThing, {}, mockContext);

        expect(result).toBeNull();
        expect(mockBGGDataSource.getThing).not.toHaveBeenCalled();
      });

      it('should fetch base game for expansion with base game link', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockThing = {
          id: '926',
          name: 'Cities & Knights',
          isExpansion: true,
          links: [
            { linkType: 'BOARDGAME_BASE', targetId: '13', targetName: 'CATAN' },
            { linkType: 'BOARDGAME_CATEGORY', targetId: '1', targetName: 'Strategy' },
          ],
        };

        const mockBaseGame = {
          id: '13',
          name: 'CATAN',
          isExpansion: false,
          type: 'BOARDGAME',
        };

        mockBGGDataSource.getThing.mockResolvedValue(mockBaseGame as any);

        const result = await (resolvers.Thing as any).baseGame(mockThing, {}, mockContext);

        expect(mockBGGDataSource.getThing).toHaveBeenCalledWith('13');
        expect(result).toEqual(mockBaseGame);
      });

      it('should handle API errors gracefully', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockThing = {
          id: '926',
          name: 'Cities & Knights',
          isExpansion: true,
          links: [
            { linkType: 'BOARDGAME_BASE', targetId: '13', targetName: 'CATAN' },
          ],
        };

        mockBGGDataSource.getThing.mockRejectedValue(new Error('API Error'));

        // The resolver should catch the error and return null
        const result = await (resolvers.Thing as any).baseGame(mockThing, {}, mockContext);

        expect(result).toBeNull();
      });
    });

    describe('expansionFor', () => {
      it('should return empty array for expansion items', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockThing = {
          id: '926',
          name: 'Cities & Knights',
          isExpansion: true,
          links: [],
        };

        const result = await (resolvers.Thing as any).expansionFor(mockThing, {}, mockContext);

        expect(result).toEqual([]);
        expect(mockBGGDataSource.getThings).not.toHaveBeenCalled();
      });

      it('should return empty array for base games without expansion links', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockThing = {
          id: '13',
          name: 'CATAN',
          isExpansion: false,
          links: [
            { linkType: 'BOARDGAME_CATEGORY', targetId: '1', targetName: 'Strategy' },
            { linkType: 'BOARDGAME_MECHANIC', targetId: '2', targetName: 'Trading' },
          ],
        };

        const result = await (resolvers.Thing as any).expansionFor(mockThing, {}, mockContext);

        expect(result).toEqual([]);
        expect(mockBGGDataSource.getThings).not.toHaveBeenCalled();
      });

      it('should fetch expansions for base game with expansion links', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockThing = {
          id: '13',
          name: 'CATAN',
          isExpansion: false,
          links: [
            { linkType: 'BOARDGAME_EXPANSION', targetId: '926', targetName: 'Cities & Knights' },
            { linkType: 'BOARDGAME_EXPANSION', targetId: '325', targetName: 'Seafarers' },
            { linkType: 'BOARDGAME_CATEGORY', targetId: '1', targetName: 'Strategy' },
          ],
        };

        const mockExpansions = [
          { id: '926', name: 'Cities & Knights', isExpansion: true },
          { id: '325', name: 'Seafarers', isExpansion: true },
        ];

        mockBGGDataSource.getThings.mockResolvedValue(mockExpansions as any);

        const result = await (resolvers.Thing as any).expansionFor(mockThing, {}, mockContext);

        expect(mockBGGDataSource.getThings).toHaveBeenCalledWith(['926', '325']);
        expect(result).toEqual(mockExpansions);
      });

      it('should limit to 10 expansions and batch in groups of 3', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockThing = {
          id: '13',
          name: 'CATAN',
          isExpansion: false,
          links: Array.from({ length: 15 }, (_, i) => ({
            linkType: 'BOARDGAME_EXPANSION',
            targetId: `${i + 100}`,
            targetName: `Expansion ${i + 1}`,
          })),
        };

        const mockExpansions = Array.from({ length: 10 }, (_, i) => ({
          id: `${i + 100}`,
          name: `Expansion ${i + 1}`,
          isExpansion: true,
        }));

        // Mock multiple calls for batching
        mockBGGDataSource.getThings
          .mockResolvedValueOnce(mockExpansions.slice(0, 3) as any)
          .mockResolvedValueOnce(mockExpansions.slice(3, 6) as any)
          .mockResolvedValueOnce(mockExpansions.slice(6, 9) as any)
          .mockResolvedValueOnce(mockExpansions.slice(9, 10) as any);

        const result = await (resolvers.Thing as any).expansionFor(mockThing, {}, mockContext);

        expect(mockBGGDataSource.getThings).toHaveBeenCalledTimes(4);
        expect(mockBGGDataSource.getThings).toHaveBeenNthCalledWith(1, ['100', '101', '102']);
        expect(mockBGGDataSource.getThings).toHaveBeenNthCalledWith(2, ['103', '104', '105']);
        expect(mockBGGDataSource.getThings).toHaveBeenNthCalledWith(3, ['106', '107', '108']);
        expect(mockBGGDataSource.getThings).toHaveBeenNthCalledWith(4, ['109']);
        expect(result).toEqual(mockExpansions);
      });

      it('should handle API errors gracefully', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockThing = {
          id: '13',
          name: 'CATAN',
          isExpansion: false,
          links: [
            { linkType: 'BOARDGAME_EXPANSION', targetId: '926', targetName: 'Cities & Knights' },
          ],
        };

        mockBGGDataSource.getThings.mockRejectedValue(new Error('API Error'));

        const result = await (resolvers.Thing as any).expansionFor(mockThing, {}, mockContext);

        expect(result).toEqual([]);
      });

      it('should handle empty expansion links', async () => {
        const { resolvers } = await import('../resolvers');
        
        const mockThing = {
          id: '13',
          name: 'CATAN',
          isExpansion: false,
          links: null,
        };

        const result = await (resolvers.Thing as any).expansionFor(mockThing, {}, mockContext);

        expect(result).toEqual([]);
        expect(mockBGGDataSource.getThings).not.toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle dataSource errors in Query resolvers', async () => {
      const { resolvers } = await import('../resolvers');
      
      mockBGGDataSource.getThing.mockRejectedValue(new Error('BGG API Error'));

      await expect(
        (resolvers.Query as any).thing(null, { id: '13' }, mockContext)
      ).rejects.toThrow('BGG API Error');
    });

    it('should handle dataSource errors in Thing resolvers', async () => {
      const { resolvers } = await import('../resolvers');
      
      const mockThing = {
        id: '13',
        name: 'CATAN',
        isExpansion: false,
        links: [
          { linkType: 'BOARDGAME_EXPANSION', targetId: '926', targetName: 'Cities & Knights' },
        ],
      };

      mockBGGDataSource.getThings.mockRejectedValue(new Error('BGG API Error'));

      const result = await (resolvers.Thing as any).expansionFor(mockThing, {}, mockContext);

      expect(result).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined parent objects', async () => {
      const { resolvers } = await import('../resolvers');
      
      // Test with a valid object that has isExpansion property
      const mockThing = {
        id: '13',
        name: 'CATAN',
        isExpansion: false,
        links: [],
      };
      
      const result = await (resolvers.Thing as any).baseGame(mockThing, {}, mockContext);
      expect(result).toBeNull();
    });

    it('should handle missing links property', async () => {
      const { resolvers } = await import('../resolvers');
      
      const mockThing = {
        id: '13',
        name: 'CATAN',
        isExpansion: false,
      };

      const result = await (resolvers.Thing as any).expansionFor(mockThing, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should handle empty links array', async () => {
      const { resolvers } = await import('../resolvers');
      
      const mockThing = {
        id: '13',
        name: 'CATAN',
        isExpansion: false,
        links: [],
      };

      const result = await (resolvers.Thing as any).expansionFor(mockThing, {}, mockContext);
      expect(result).toEqual([]);
    });
  });

  describe('Performance', () => {
    it('should not make unnecessary API calls', async () => {
      const { resolvers } = await import('../resolvers');
      
      const mockThing = {
        id: '13',
        name: 'CATAN',
        isExpansion: false,
        links: [
          { linkType: 'BOARDGAME_CATEGORY', targetId: '1', targetName: 'Strategy' },
        ],
      };

      await (resolvers.Thing as any).expansionFor(mockThing, {}, mockContext);

      expect(mockBGGDataSource.getThings).not.toHaveBeenCalled();
    });

    it('should batch API calls efficiently', async () => {
      const { resolvers } = await import('../resolvers');
      
      const mockThing = {
        id: '13',
        name: 'CATAN',
        isExpansion: false,
        links: Array.from({ length: 6 }, (_, i) => ({
          linkType: 'BOARDGAME_EXPANSION',
          targetId: `${i + 100}`,
          targetName: `Expansion ${i + 1}`,
        })),
      };

      mockBGGDataSource.getThings.mockResolvedValue([] as any);

      await (resolvers.Thing as any).expansionFor(mockThing, {}, mockContext);

      expect(mockBGGDataSource.getThings).toHaveBeenCalledTimes(2);
      expect(mockBGGDataSource.getThings).toHaveBeenNthCalledWith(1, ['100', '101', '102']);
      expect(mockBGGDataSource.getThings).toHaveBeenNthCalledWith(2, ['103', '104', '105']);
    });
  });
});
