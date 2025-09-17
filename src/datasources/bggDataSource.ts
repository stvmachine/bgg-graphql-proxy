import { RESTDataSource } from 'apollo-datasource-rest';
import { KeyValueCache } from 'apollo-server-caching';
import * as xml2js from 'xml2js';

export interface BGGThing {
  id: string;
  type: string;
  name: string;
  yearpublished?: string;
  minplayers?: string;
  maxplayers?: string;
  playingtime?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  average?: string;
  bayesaverage?: string;
  usersrated?: string;
  [key: string]: any;
}

export interface BGGUser {
  id: string;
  username: string;
  firstname?: string;
  lastname?: string;
  dateregistered?: string;
  supportyears?: string;
  [key: string]: any;
}

export interface BGGCollection {
  totalitems: string;
  pubdate: string;
  items: any[];
}

export interface BGGPlay {
  id: string;
  date: string;
  quantity: string;
  length: string;
  location?: string;
  item: any;
  players: any[];
  comments?: string;
  [key: string]: any;
}

export interface BGGGeeklist {
  id: string;
  title: string;
  username: string;
  postdate: string;
  numitems: string;
  thumbs: string;
  items: any[];
  [key: string]: any;
}

export class BGGDataSource extends RESTDataSource {
  private xmlParser: xml2js.Parser;

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
      const response = await this.get(url, undefined, {
        cacheOptions: ttl ? { ttl } : undefined,
      });
      
      if (typeof response === 'string') {
        return await this.parseXML(response);
      }
      
      return response;
    } catch (error) {
      console.error('BGG API request failed:', error);
      throw new Error(`BGG API request failed: ${error.message}`);
    }
  }

  // Thing operations
  async getThing(id: string): Promise<BGGThing | null> {
    const data = await this.makeRequest(`/thing?id=${id}&stats=1`, 300);
    
    if (data?.items?.item) {
      return this.normalizeThing(data.items.item);
    }
    
    return null;
  }

  async getThings(ids: string[]): Promise<BGGThing[]> {
    const data = await this.makeRequest(`/thing?id=${ids.join(',')}&stats=1`, 300);
    
    if (data?.items?.item) {
      const items = Array.isArray(data.items.item) ? data.items.item : [data.items.item];
      return items.map(item => this.normalizeThing(item));
    }
    
    return [];
  }

  async searchThings(query: string, type?: string, exact = false): Promise<BGGThing[]> {
    let url = `/search?query=${encodeURIComponent(query)}`;
    if (type) url += `&type=${type}`;
    if (exact) url += '&exact=1';
    
    const data = await this.makeRequest(url, 300);
    
    if (data?.items?.item) {
      const items = Array.isArray(data.items.item) ? data.items.item : [data.items.item];
      return items.map(item => this.normalizeThing(item));
    }
    
    return [];
  }

  // User operations
  async getUser(username: string): Promise<BGGUser | null> {
    const data = await this.makeRequest(`/user?name=${encodeURIComponent(username)}`, 3600);
    
    if (data?.user) {
      return this.normalizeUser(data.user);
    }
    
    return null;
  }

  async getUserCollection(username: string, subtype?: string): Promise<BGGCollection | null> {
    let url = `/collection?username=${encodeURIComponent(username)}`;
    if (subtype) url += `&subtype=${subtype}`;
    
    const data = await this.makeRequest(url, 1800);
    
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
  } = {}): Promise<BGGPlay[]> {
    let url = `/plays?username=${encodeURIComponent(username)}`;
    if (params.id) url += `&id=${params.id}`;
    if (params.mindate) url += `&mindate=${params.mindate}`;
    if (params.maxdate) url += `&maxdate=${params.maxdate}`;
    if (params.page) url += `&page=${params.page}`;
    
    const data = await this.makeRequest(url, 900);
    
    if (data?.plays?.play) {
      const plays = Array.isArray(data.plays.play) ? data.plays.play : [data.plays.play];
      return plays.map(play => this.normalizePlay(play));
    }
    
    return [];
  }

  // Geeklist operations
  async getGeeklist(id: string): Promise<BGGGeeklist | null> {
    const data = await this.makeRequest(`/geeklist/${id}`, 3600);
    
    if (data?.geeklist) {
      return this.normalizeGeeklist(data.geeklist);
    }
    
    return null;
  }

  async getGeeklists(username: string, page = 1): Promise<BGGGeeklist[]> {
    const data = await this.makeRequest(`/geeklists/user/${encodeURIComponent(username)}?page=${page}`, 1800);
    
    if (data?.geeklists?.geeklist) {
      const geeklists = Array.isArray(data.geeklists.geeklist) 
        ? data.geeklists.geeklist 
        : [data.geeklists.geeklist];
      return geeklists.map(geeklist => this.normalizeGeeklist(geeklist));
    }
    
    return [];
  }

  // Hot items
  async getHotItems(type?: string): Promise<BGGThing[]> {
    let url = '/hot';
    if (type) url += `?type=${type}`;
    
    const data = await this.makeRequest(url, 1800);
    
    if (data?.items?.item) {
      const items = Array.isArray(data.items.item) ? data.items.item : [data.items.item];
      return items.map(item => this.normalizeThing(item));
    }
    
    return [];
  }

  // Normalization methods - clean and simple
  private normalizeThing(item: any): BGGThing {
    return {
      id: item.id || '',
      type: item.type || '',
      name: this.getPrimaryName(item.name),
      yearpublished: item.yearpublished,
      minplayers: item.minplayers,
      maxplayers: item.maxplayers,
      playingtime: item.playingtime,
      description: item.description,
      image: item.image,
      thumbnail: item.thumbnail,
      average: item.statistics?.ratings?.average,
      bayesaverage: item.statistics?.ratings?.bayesaverage,
      usersrated: item.statistics?.ratings?.usersrated,
      // Keep original data for complex fields
      ...item,
    };
  }

  private normalizeUser(user: any): BGGUser {
    return {
      id: user.id || '',
      username: user.username || '',
      firstname: user.firstname,
      lastname: user.lastname,
      dateregistered: user.dateregistered,
      supportyears: user.supportyears,
      ...user,
    };
  }

  private normalizeCollection(data: any): BGGCollection {
    return {
      totalitems: data.totalitems || '0',
      pubdate: data.pubdate || '',
      items: data.items || [],
    };
  }

  private normalizePlay(play: any): BGGPlay {
    return {
      id: play.id || '',
      date: play.date || '',
      quantity: play.quantity || '1',
      length: play.length || '0',
      location: play.location,
      item: play.item || {},
      players: play.players || [],
      comments: play.comments,
      ...play,
    };
  }

  private normalizeGeeklist(geeklist: any): BGGGeeklist {
    return {
      id: geeklist.id || '',
      title: geeklist.title || '',
      username: geeklist.username || '',
      postdate: geeklist.postdate || '',
      numitems: geeklist.numitems || '0',
      thumbs: geeklist.thumbs || '0',
      items: geeklist.items || [],
      ...geeklist,
    };
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
}