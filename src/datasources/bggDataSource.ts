import { RESTDataSource } from '@apollo/datasource-rest';
import * as xml2js from "xml2js";
import axios from "axios";
import {
  Collection,
  Geeklist,
  Play,
  Thing,
  ThingType,
  User,
} from "../generated/graphql";

export class BGGDataSource extends RESTDataSource {
  override baseURL: string;
  private xmlParser: xml2js.Parser;

  constructor(baseURL: string) {
    super();
    this.baseURL = baseURL;

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
      console.error("XML parsing error:", error);
      throw new Error("Failed to parse XML response from BGG API");
    }
  }

  private async makeRequest<T>(url: string): Promise<T> {
    try {
      // Make API request using axios (no caching)
      const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

      const response = await axios.get(fullUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'BGG-GraphQL-Proxy/1.0.0',
        },
      });

      let result: T;
      if (typeof response.data === "string") {
        result = await this.parseXML(response.data);
      } else {
        result = response.data;
      }

      return result;
    } catch (error) {
      console.error("BGG API request failed:", error);
      throw new Error(
        `BGG API request failed: ${error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Thing operations
  async getThing(id: string): Promise<Thing | null> {
    const data = await this.makeRequest<any>(
      `/thing?id=${id}&stats=1`
    );

    // BGG API returns items directly as 'item', not nested under 'items'
    if (data?.item) {
      return this.normalizeThing(data.item);
    }

    return null;
  }

  async getThings(ids: string[]): Promise<Thing[]> {
    const data = await this.makeRequest<any>(
      `/thing?id=${ids.join(",")}&stats=1`
    );

    // BGG API returns items directly as 'item' array, not nested under 'items'
    if (data?.item) {
      const items = Array.isArray(data.item)
        ? data.item
        : [data.item];
      return items.map((item: any) => this.normalizeThing(item));
    }

    return [];
  }

  async searchThings(
    query: string,
    type?: string,
    exact = false
  ): Promise<Thing[]> {
    let url = `/search?query=${encodeURIComponent(query)}`;
    if (type) url += `&type=${type}`;
    if (exact) url += "&exact=1";

    const data = await this.makeRequest<any>(url);

    // BGG API returns items directly as 'item' array, not nested under 'items'
    if (data?.item) {
      const items = Array.isArray(data.item)
        ? data.item
        : [data.item];
      return items.map((item: any) => this.normalizeThing(item));
    }

    return [];
  }

  // User operations
  async getUser(username: string): Promise<User | null> {
    const data = await this.makeRequest<any>(
      `/user?name=${encodeURIComponent(username)}`
    );

    // BGG API returns user data directly in the root object, not nested under 'user'
    if (data?.id && data?.name) {
      return this.normalizeUser(data);
    }

    return null;
  }

  async getUserCollection(
    username: string,
    subtype?: string
  ): Promise<Collection | null> {
    let url = `/collection?username=${encodeURIComponent(username)}`;
    if (subtype) url += `&subtype=${subtype}`;

    const data = await this.makeRequest<any>(url);

    if (data?.items) {
      return this.normalizeCollection(data);
    }

    return null;
  }

  async getUserPlays(
    username: string,
    params: {
      id?: string;
      mindate?: string;
      maxdate?: string;
      page?: number;
    } = {}
  ): Promise<Play[]> {
    let url = `/plays?username=${encodeURIComponent(username)}`;
    if (params.id) url += `&id=${params.id}`;
    if (params.mindate) url += `&mindate=${params.mindate}`;
    if (params.maxdate) url += `&maxdate=${params.maxdate}`;
    if (params.page) url += `&page=${params.page}`;

    const data = await this.makeRequest<any>(url);

    if (data?.plays?.play) {
      const plays = Array.isArray(data.plays.play)
        ? data.plays.play
        : [data.plays.play];
      return plays.map((play: any) => this.normalizePlay(play));
    }

    return [];
  }

  // Geeklist operations
  async getGeeklist(id: string): Promise<Geeklist | null> {
    const data = await this.makeRequest<any>(
      `/geeklist/${id}`
    );

    if (data?.geeklist) {
      return this.normalizeGeeklist(data.geeklist);
    }

    return null;
  }

  async getGeeklists(username: string, page = 1): Promise<Geeklist[]> {
    const data = await this.makeRequest<any>(
      `/geeklists/user/${encodeURIComponent(username)}?page=${page}`
    );

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
    let url = "/hot";
    if (type) url += `?type=${type}`;

    const data = await this.makeRequest<any>(url);

    // BGG API returns items directly as 'item' array, not nested under 'items'
    if (data?.item) {
      const items = Array.isArray(data.item)
        ? data.item
        : [data.item];
      return items.map((item: any) => this.normalizeThing(item));
    }

    return [];
  }

  // Normalization methods - simplified
  private normalizeThing(item: any): Thing {
    return {
      __typename: "Thing",
      id: item.id || "",
      name: this.getPrimaryName(item.name),
      alternateNames: this.getAlternateNames(item.name),
      type: this.mapThingType(item.type) as ThingType,
      yearPublished: this.parseNumber(item.yearpublished?.value || item.yearpublished),
      minPlayers: this.parseNumber(item.minplayers?.value || item.minplayers),
      maxPlayers: this.parseNumber(item.maxplayers?.value || item.maxplayers),
      playingTime: this.parseNumber(item.playingtime?.value || item.playingtime),
      minPlayTime: this.parseNumber(item.minplaytime?.value || item.minplaytime),
      maxPlayTime: this.parseNumber(item.maxplaytime?.value || item.maxplaytime),
      minAge: this.parseNumber(item.minage?.value || item.minage),
      description: item.description?.value || item.description,
      image: item.image?.value || item.image,
      thumbnail: item.thumbnail?.value || item.thumbnail,
      average: this.parseFloat(item.statistics?.ratings?.average),
      bayesAverage: this.parseFloat(item.statistics?.ratings?.bayesaverage),
      usersRated: this.parseNumber(item.statistics?.ratings?.usersrated),
      usersOwned: this.parseNumber(item.statistics?.ratings?.owned),
      usersWanting: this.parseNumber(item.statistics?.ratings?.wanting),
      usersWishing: this.parseNumber(item.statistics?.ratings?.wishing),
      numComments: this.parseNumber(item.statistics?.ratings?.numcomments),
      numWeights: this.parseNumber(item.statistics?.ratings?.numweights),
      averageWeight: this.parseFloat(item.statistics?.ratings?.averageweight),
      // Initialize empty arrays for complex fields
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
      statistics: undefined, // Simplified - let resolvers handle this
    };
  }

  private normalizeUser(user: any): User {
    return {
      __typename: "User",
      id: user.id || "",
      username: user.name || "",
      firstName: user.firstname?.value || "",
      lastName: user.lastname?.value || "",
      dateRegistered: user.yearregistered?.value || "",
      supportYears: this.parseNumber(user.supportyears?.value) || 0,
      designerId: user.designerid?.value,
      publisherId: user.publisherid?.value,
      address: user.stateorprovince || user.country
        ? {
          city: user.stateorprovince?.value || "",
          isoCountry: user.country?.value || "",
        }
        : undefined,
      guilds: [],
      microbadges: [],
      top: [],
    };
  }

  private normalizeCollection(data: any): Collection {
    return {
      totalItems: this.parseNumber(data.totalitems) || 0,
      pubDate: data.pubdate || "",
      items: data.items || [],
    };
  }

  private normalizePlay(play: any): Play {
    return {
      __typename: "Play",
      id: play.id || "",
      date: play.date || "",
      quantity: this.parseNumber(play.quantity) || 1,
      length: this.parseNumber(play.length) || 0,
      incomplete: play.incomplete === "true" || play.incomplete === true,
      nowInStats: play.nowinstats === "true" || play.nowinstats === true,
      location: play.location || "",
      item: {
        name: play.item?.name || "",
        objectId: play.item?.objectid || "",
        objectType: play.item?.objecttype || "",
        subtypes: play.item?.subtypes || [],
      },
      players: play.players || [],
      comments: play.comments || "",
    };
  }

  private normalizeGeeklist(geeklist: any): Geeklist {
    return {
      __typename: "Geeklist",
      id: geeklist.id || "",
      title: geeklist.title || "",
      username: geeklist.username || "",
      postDate: geeklist.postdate || "",
      postDateTimestamp: geeklist.postdate_timestamp || "",
      lastReplyDate: geeklist.lastreplydate || "",
      lastReplyDateTimestamp: geeklist.lastreplydate_timestamp || "",
      numItems: this.parseNumber(geeklist.numitems) || 0,
      thumbs: this.parseNumber(geeklist.thumbs) || 0,
      items: geeklist.items || [],
    };
  }


  // Helper functions for data parsing
  private parseNumber(value: any): number | undefined {
    if (!value) return undefined;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  }

  private parseFloat(value: any): number | undefined {
    if (!value) return undefined;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  }

  private getPrimaryName(name: any): string {
    if (!name) return "";
    if (typeof name === "string") return name;
    if (Array.isArray(name)) {
      const primary = name.find((n) => n.type === "primary");
      return primary?.value || name[0]?.value || "";
    }
    return name.value || "";
  }

  private getAlternateNames(name: any): string[] {
    if (!name) return [];
    if (typeof name === "string") return [];
    if (Array.isArray(name)) {
      return name
        .filter((n) => n.type === "alternate")
        .map((n) => n.value)
        .filter(Boolean);
    }
    return [];
  }

  private mapThingType(type: string): string {
    const typeMap: Record<string, string> = {
      boardgame: "BOARDGAME",
      boardgameaccessory: "BOARDGAMEACCESSORY",
      boardgameexpansion: "BOARDGAMEEXPANSION",
      rpgitem: "RPGITEM",
      videogame: "VIDEOGAME",
    };
    return typeMap[type?.toLowerCase()] || "BOARDGAME";
  }
}
