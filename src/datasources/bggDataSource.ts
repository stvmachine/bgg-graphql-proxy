import { RESTDataSource } from 'apollo-datasource-rest';
import { KeyValueCache } from 'apollo-server-caching';
import * as xml2js from 'xml2js';
import { 
  Thing,
  User,
  Collection,
  Play,
  Geeklist
} from '../generated/graphql';

export class BGGDataSource extends RESTDataSource {
  private xmlParser: xml2js.Parser;
  private cache?: KeyValueCache<string>;

  constructor(cache?: KeyValueCache<string>) {
    super();
    this.baseURL = 'https://boardgamegeek.com/xmlapi2';
    this.cache = cache;
    
    this.xmlParser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
      explicitRoot: false,
    });
  }

  private async parseXML(xml: string): Promise<any> {
    try {
      return await this.xmlParser.parseStringPromise(xml);
    } catch (error) {
      console.error('XML parsing error:', error);
      throw new Error('Failed to parse XML response from BGG API');
    }
  }

  private async makeRequest<T>(url: string, ttl?: number): Promise<T> {
    try {
      console.log(`BGG API request: ${url}`);
      
      // Check L1 cache first
      if (this.cache && ttl) {
        const cacheKey = `bgg:${url}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
          console.log(`L1 cache hit for: ${url}`);
          return JSON.parse(cached);
        }
      }
      
      // Make API request
      const response = await this.get(url);
      
      let result: T;
      if (typeof response === 'string') {
        result = await this.parseXML(response);
      } else {
        result = response;
      }
      
      // Store in L1 cache
      if (this.cache && ttl) {
        const cacheKey = `bgg:${url}`;
        await this.cache.set(cacheKey, JSON.stringify(result), { ttl });
        console.log(`L1 cache stored for: ${url} (TTL: ${ttl}s)`);
      }
      
      return result;
    } catch (error) {
      console.error('BGG API request failed:', error);
      throw new Error(`BGG API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Thing operations
  async getThing(id: string): Promise<Thing | null> {
    const data = await this.makeRequest<any>(`/thing?id=${id}&stats=1`, 300);
    
    if (data?.items?.item) {
      return this.normalizeThing(data.items.item);
    }
    
    return null;
  }

  async getThings(ids: string[]): Promise<Thing[]> {
    const data = await this.makeRequest<any>(`/thing?id=${ids.join(',')}&stats=1`, 300);
    
    if (data?.items?.item) {
      const items = Array.isArray(data.items.item) ? data.items.item : [data.items.item];
      return items.map((item: any) => this.normalizeThing(item));
    }
    
    return [];
  }

  async searchThings(query: string, type?: string, exact = false): Promise<Thing[]> {
    let url = `/search?query=${encodeURIComponent(query)}`;
    if (type) url += `&type=${type}`;
    if (exact) url += '&exact=1';
    
    const data = await this.makeRequest<any>(url, 300);
    
    if (data?.items?.item) {
      const items = Array.isArray(data.items.item) ? data.items.item : [data.items.item];
      return items.map((item: any) => this.normalizeThing(item));
    }
    
    return [];
  }

  // User operations
  async getUser(username: string): Promise<User | null> {
    const data = await this.makeRequest<any>(`/user?name=${encodeURIComponent(username)}`, 3600);
    
    if (data?.user) {
      return this.normalizeUser(data.user);
    }
    
    return null;
  }

  async getUserCollection(username: string, subtype?: string): Promise<Collection | null> {
    let url = `/collection?username=${encodeURIComponent(username)}`;
    if (subtype) url += `&subtype=${subtype}`;
    
    const data = await this.makeRequest<any>(url, 1800);
    
    if (data?.items) {
      return this.normalizeCollection(data);
    }
    
    return null;
  }

  async getUserPlays(username: string, params: {
    id?: string;
    mindate?: string;
    maxdate?: string;
    page?: number;
  } = {}): Promise<Play[]> {
    let url = `/plays?username=${encodeURIComponent(username)}`;
    if (params.id) url += `&id=${params.id}`;
    if (params.mindate) url += `&mindate=${params.mindate}`;
    if (params.maxdate) url += `&maxdate=${params.maxdate}`;
    if (params.page) url += `&page=${params.page}`;
    
    const data = await this.makeRequest<any>(url, 900);
    
    if (data?.plays?.play) {
      const plays = Array.isArray(data.plays.play) ? data.plays.play : [data.plays.play];
      return plays.map((play: any) => this.normalizePlay(play));
    }
    
    return [];
  }

  // Geeklist operations
  async getGeeklist(id: string): Promise<Geeklist | null> {
    const data = await this.makeRequest<any>(`/geeklist/${id}`, 3600);
    
    if (data?.geeklist) {
      return this.normalizeGeeklist(data.geeklist);
    }
    
    return null;
  }

  async getGeeklists(username: string, page = 1): Promise<Geeklist[]> {
    const data = await this.makeRequest<any>(`/geeklists/user/${encodeURIComponent(username)}?page=${page}`, 1800);
    
    if (data?.geeklists?.geeklist) {
      const geeklists = Array.isArray(data.geeklists.geeklist) 
        ? data.geeklists.geeklist 
        : [data.geeklists.geeklist];
      return geeklists.map((geeklist: any) => this.normalizeGeeklist(geeklist));
    }
    
    return [];
  }

  // Hot items
  async getHotItems(type?: string): Promise<Thing[]> {
    let url = '/hot';
    if (type) url += `?type=${type}`;
    
    const data = await this.makeRequest<any>(url, 1800);
    
    if (data?.items?.item) {
      const items = Array.isArray(data.items.item) ? data.items.item : [data.items.item];
      return items.map((item: any) => this.normalizeThing(item));
    }
    
    return [];
  }

  // Normalization methods - clean and simple
  private normalizeThing(item: any): Thing {
    return {
      __typename: 'Thing',
      id: item.id || '',
      name: this.getPrimaryName(item.name),
      alternateNames: this.getAlternateNames(item.name),
      type: this.mapThingType(item.type),
      yearPublished: item.yearpublished ? parseInt(item.yearpublished, 10) : undefined,
      minPlayers: item.minplayers ? parseInt(item.minplayers, 10) : undefined,
      maxPlayers: item.maxplayers ? parseInt(item.maxplayers, 10) : undefined,
      playingTime: item.playingtime ? parseInt(item.playingtime, 10) : undefined,
      minPlayTime: item.minplaytime ? parseInt(item.minplaytime, 10) : undefined,
      maxPlayTime: item.maxplaytime ? parseInt(item.maxplaytime, 10) : undefined,
      minAge: item.minage ? parseInt(item.minage, 10) : undefined,
      description: item.description,
      image: item.image,
      thumbnail: item.thumbnail,
      average: item.statistics?.ratings?.average ? parseFloat(item.statistics.ratings.average) : undefined,
      bayesAverage: item.statistics?.ratings?.bayesaverage ? parseFloat(item.statistics.ratings.bayesaverage) : undefined,
      usersRated: item.statistics?.ratings?.usersrated ? parseInt(item.statistics.ratings.usersrated, 10) : undefined,
      usersOwned: item.statistics?.ratings?.owned ? parseInt(item.statistics.ratings.owned, 10) : undefined,
      usersWanting: item.statistics?.ratings?.wanting ? parseInt(item.statistics.ratings.wanting, 10) : undefined,
      usersWishing: item.statistics?.ratings?.wishing ? parseInt(item.statistics.ratings.wishing, 10) : undefined,
      numComments: item.statistics?.ratings?.numcomments ? parseInt(item.statistics.ratings.numcomments, 10) : undefined,
      numWeights: item.statistics?.ratings?.numweights ? parseInt(item.statistics.ratings.numweights, 10) : undefined,
      averageWeight: item.statistics?.ratings?.averageweight ? parseFloat(item.statistics.ratings.averageweight) : undefined,
      // Initialize arrays for complex fields
      artists: [],
      categories: [],
      comments: [],
      designers: [],
      expansions: [],
      families: [],
      mechanics: [],
      publishers: [],
      ranks: [],
      versions: [],
      polls: [],
      statistics: item.statistics ? {
        page: item.statistics.page || 0,
        ratings: {
          average: item.statistics.ratings?.average ? parseFloat(item.statistics.ratings.average) : 0,
          averageWeight: item.statistics.ratings?.averageweight ? parseFloat(item.statistics.ratings.averageweight) : 0,
          bayesAverage: item.statistics.ratings?.bayesaverage ? parseFloat(item.statistics.ratings.bayesaverage) : 0,
          median: item.statistics.ratings?.median ? parseFloat(item.statistics.ratings.median) : 0,
          numComments: item.statistics.ratings?.numcomments ? parseInt(item.statistics.ratings.numcomments, 10) : 0,
          numWeights: item.statistics.ratings?.numweights ? parseInt(item.statistics.ratings.numweights, 10) : 0,
          owned: item.statistics.ratings?.owned ? parseInt(item.statistics.ratings.owned, 10) : 0,
          ranks: [],
          stdDev: item.statistics.ratings?.stddev ? parseFloat(item.statistics.ratings.stddev) : 0,
          trading: item.statistics.ratings?.trading ? parseInt(item.statistics.ratings.trading, 10) : 0,
          usersRated: item.statistics.ratings?.usersrated ? parseInt(item.statistics.ratings.usersrated, 10) : 0,
          wanting: item.statistics.ratings?.wanting ? parseInt(item.statistics.ratings.wanting, 10) : 0,
          wishing: item.statistics.ratings?.wishing ? parseInt(item.statistics.ratings.wishing, 10) : 0,
        }
      } : undefined,
    };
  }

  private normalizeUser(user: any): User {
    return {
      __typename: 'User',
      id: user.id || '',
      username: user.username || '',
      firstName: user.firstname || '',
      lastName: user.lastname || '',
      dateRegistered: user.dateregistered || '',
      supportYears: user.supportyears ? parseInt(user.supportyears, 10) : 0,
      designerId: user.designerid,
      publisherId: user.publisherid,
      address: user.address ? {
        city: user.address.city || '',
        isoCountry: user.address.isocountry || '',
      } : undefined,
      guilds: [],
      microbadges: [],
      top: [],
    };
  }

  private normalizeCollection(data: any): Collection {
    return {
      totalItems: parseInt(data.totalitems || '0', 10),
      pubDate: data.pubdate || '',
      items: data.items || [],
    };
  }

  private normalizePlay(play: any): Play {
    return {
      __typename: 'Play',
      id: play.id || '',
      date: play.date || '',
      quantity: play.quantity ? parseInt(play.quantity, 10) : 1,
      length: play.length ? parseInt(play.length, 10) : 0,
      incomplete: play.incomplete === 'true' || play.incomplete === true,
      nowInStats: play.nowinstats === 'true' || play.nowinstats === true,
      location: play.location || '',
      item: {
        name: play.item?.name || '',
        objectId: play.item?.objectid || '',
        objectType: play.item?.objecttype || '',
        subtypes: play.item?.subtypes || [],
      },
      players: play.players || [],
      comments: play.comments || '',
    };
  }

  private normalizeGeeklist(geeklist: any): Geeklist {
    return {
      __typename: 'Geeklist',
      id: geeklist.id || '',
      title: geeklist.title || '',
      username: geeklist.username || '',
      postDate: geeklist.postdate || '',
      postDateTimestamp: geeklist.postdate_timestamp || '',
      lastReplyDate: geeklist.lastreplydate || '',
      lastReplyDateTimestamp: geeklist.lastreplydate_timestamp || '',
      numItems: geeklist.numitems ? parseInt(geeklist.numitems, 10) : 0,
      thumbs: geeklist.thumbs ? parseInt(geeklist.thumbs, 10) : 0,
      items: geeklist.items || [],
    };
  }

  // Cache management methods
  async clearCache(): Promise<void> {
    if (this.cache && 'clear' in this.cache) {
      await (this.cache as any).clear();
      console.log('L1 cache cleared');
    }
  }

  async clearCacheForUrl(url: string): Promise<void> {
    if (this.cache) {
      const cacheKey = `bgg:${url}`;
      await this.cache.delete(cacheKey);
      console.log(`L1 cache cleared for: ${url}`);
    }
  }

  private getPrimaryName(name: any): string {
    if (!name) return '';
    if (typeof name === 'string') return name;
    if (Array.isArray(name)) {
      const primary = name.find(n => n.type === 'primary');
      return primary?.value || name[0]?.value || '';
    }
    return name.value || '';
  }

  private getAlternateNames(name: any): string[] {
    if (!name) return [];
    if (typeof name === 'string') return [];
    if (Array.isArray(name)) {
      return name
        .filter(n => n.type === 'alternate')
        .map(n => n.value)
        .filter(Boolean);
    }
    return [];
  }

  private mapThingType(type: string): 'BOARDGAME' | 'BOARDGAMEACCESSORY' | 'BOARDGAMEEXPANSION' | 'RPGITEM' | 'VIDEOGAME' {
    switch (type?.toLowerCase()) {
      case 'boardgame':
        return 'BOARDGAME';
      case 'boardgameaccessory':
        return 'BOARDGAMEACCESSORY';
      case 'boardgameexpansion':
        return 'BOARDGAMEEXPANSION';
      case 'rpgitem':
        return 'RPGITEM';
      case 'videogame':
        return 'VIDEOGAME';
      default:
        return 'BOARDGAME';
    }
  }
}