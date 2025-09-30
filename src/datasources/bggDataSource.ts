import { RESTDataSource } from "@apollo/datasource-rest";
import axios from "axios";
import * as xml2js from "xml2js";
import {
  Collection,
  CollectionSubtype,
  Geeklist,
  Play,
  Thing,
  ThingType,
  User,
} from "../generated/graphql";

export class BGGDataSource extends RESTDataSource {
  override baseURL: string;
  private xmlParser: xml2js.Parser;
  private lastRequestTime: number = 0;
  private readonly RATE_LIMIT_DELAY = 5000; // 5 seconds as per BGG API docs
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff delays

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

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      const waitTime = this.RATE_LIMIT_DELAY - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${waitTime}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isRetryableError(error: any): boolean {
    if (!error || typeof error !== "object") return false;

    // Check for rate limiting errors (502, 503, 429)
    if (
      error.response?.status === 502 ||
      error.response?.status === 503 ||
      error.response?.status === 429
    ) {
      return true;
    }

    // Check for network errors
    if (
      error.code === "ECONNRESET" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ENOTFOUND"
    ) {
      return true;
    }

    return false;
  }

  private async makeRequest<T>(url: string): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        // Enforce rate limiting before making request
        await this.enforceRateLimit();

        const fullUrl = url.startsWith("http") ? url : `${this.baseURL}${url}`;

        const response = await axios.get(fullUrl, {
          timeout: 10000,
          headers: {
            "User-Agent": "BGG-GraphQL-Proxy/1.0.0",
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
        lastError = error;

        // Check if this is a retryable error
        if (attempt < this.MAX_RETRIES && this.isRetryableError(error)) {
          const delay = this.RETRY_DELAYS[attempt] || 4000;
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.log(
            `BGG API request failed (attempt ${attempt + 1}/${this.MAX_RETRIES + 1}), retrying in ${delay}ms:`,
            errorMessage
          );
          await this.sleep(delay);
          continue;
        }

        // If not retryable or max retries reached, throw the error
        break;
      }
    }

    // Handle final error
    console.error("BGG API request failed after all retries:", lastError);

    // Handle rate limiting errors specifically
    if (lastError && typeof lastError === "object" && "response" in lastError) {
      const axiosError = lastError as any;
      if (
        axiosError.response?.status === 502 ||
        axiosError.response?.status === 503 ||
        axiosError.response?.status === 429
      ) {
        throw new Error(
          "BGG API is currently rate limiting requests. Please try again in a few seconds."
        );
      }
    }

    throw new Error(
      `BGG API request failed after ${this.MAX_RETRIES + 1} attempts: ${lastError instanceof Error ? lastError.message : "Unknown error"
      }`
    );
  }

  // Thing operations
  async getThing(id: string): Promise<Thing | null> {
    const data = await this.makeRequest<any>(`/thing?id=${id}&stats=1`);

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
      const items = Array.isArray(data.item) ? data.item : [data.item];
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

    if (data?.item) {
      const items = Array.isArray(data.item) ? data.item : [data.item];
      return items.map((item: any) => this.normalizeThing(item));
    }

    return [];
  }

  // User operations
  async getUser(username: string): Promise<User | null> {
    const data = await this.makeRequest<any>(
      `/user?name=${encodeURIComponent(username)}`
    );

    if (data?.id && data?.name) {
      return this.normalizeUser(data);
    }

    return null;
  }

  async getUserCollection(
    username: string,
    subtype?: string
  ): Promise<Collection | null> {
    const normalizedSubtype = subtype?.toUpperCase();

    // Use expansion workaround for boardgame subtype to include expansions
    if (normalizedSubtype === CollectionSubtype.Boardgame) {
      return this.getUserCollectionWithExpansionWorkaround(username);
    }

    // Use the normal approach for other requests
    let url = `/collection?username=${encodeURIComponent(username)}&stats=1`;
    if (subtype) url += `&subtype=${subtype}`;

    const data = await this.makeRequest<any>(url);

    if (data) {
      return this.normalizeCollection(data);
    }

    return null;
  }

  private async getUserCollectionWithExpansionWorkaround(
    username: string
  ): Promise<Collection | null> {
    try {
      // First call: Get boardgames only (excluding expansions)
      const boardgamesUrl = `/collection?username=${encodeURIComponent(username)}&excludesubtype=boardgameexpansion&stats=1`;
      const boardgamesData = await this.makeRequest<any>(boardgamesUrl);

      // Second call: Get expansions only
      const expansionsUrl = `/collection?username=${encodeURIComponent(username)}&subtype=boardgameexpansion&stats=1`;
      const expansionsData = await this.makeRequest<any>(expansionsUrl);

      // Combine the results - handle both array and single item cases
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
          this.parseNumber(boardgamesData?.totalitems || 0) +
          this.parseNumber(expansionsData?.totalitems || 0),
        pubdate: boardgamesData?.pubdate || expansionsData?.pubdate || "",
        item: allItems,
      };

      return this.normalizeCollection(combinedData);
    } catch (error) {
      console.error(
        "Error fetching collection with expansion workaround:",
        error
      );
      // Fallback to original method if workaround fails
      return this.getUserCollectionFallback(username);
    }
  }

  // Fallback to original method if workaround fails
  private async getUserCollectionFallback(
    username: string
  ): Promise<Collection | null> {
    const url = `/collection?username=${encodeURIComponent(username)}&stats=1`;
    const data = await this.makeRequest<any>(url);

    if (data) {
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
    const data = await this.makeRequest<any>(`/geeklist/${id}`);

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
      const items = Array.isArray(data.item) ? data.item : [data.item];
      return items.map((item: any) => this.normalizeThing(item));
    }

    return [];
  }

  // Normalization methods - simplified
  private normalizeThing(item: any): Thing {
    const links = this.normalizeLinks(item.link || []);
    const isExpansion = item.type === "boardgameexpansion";

    return {
      __typename: "Thing",
      id: item.id || "",
      name: this.getPrimaryName(item.name),
      alternateNames: this.getAlternateNames(item.name),
      type: this.mapThingType(item.type) as ThingType,
      yearPublished: this.parseNumber(
        item.yearpublished?.value || item.yearpublished
      ),
      minPlayers: this.parseNumber(item.minplayers?.value || item.minplayers),
      maxPlayers: this.parseNumber(item.maxplayers?.value || item.maxplayers),
      playingTime: this.parseNumber(
        item.playingtime?.value || item.playingtime
      ),
      minPlayTime: this.parseNumber(
        item.minplaytime?.value || item.minplaytime
      ),
      maxPlayTime: this.parseNumber(
        item.maxplaytime?.value || item.maxplaytime
      ),
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
      // Expansion relationship fields
      isExpansion,
      baseGame: null, // Will be resolved by resolvers
      expansionFor: [], // Will be resolved by resolvers
      links,
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
      address:
        user.stateorprovince || user.country
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
    // Handle the BGG API XML structure
    // The XML parser returns the structure as: { item: [...] } (flattened)
    let items = [];
    if (data.item) {
      if (Array.isArray(data.item)) {
        items = data.item;
      } else {
        items = [data.item];
      }
    }

    return {
      totalItems: this.parseNumber(data.totalitems) || 0,
      pubDate: data.pubdate || "",
      items: items.map((item: any) => this.normalizeCollectionItem(item)),
    };
  }

  private normalizeCollectionItem(item: any): any {
    return {
      __typename: "CollectionItem",
      objectType: item.objecttype || "",
      objectId: item.objectid || "",
      subtype: item.subtype || "",
      collId: item.collid || "",
      name: this.getPrimaryName(item.name),
      yearPublished: this.parseNumber(item.yearpublished) || 0,
      image: item.image || "",
      thumbnail: item.thumbnail || "",
      status: {
        __typename: "Status",
        own: item.status?.own || "0",
        prevOwned: item.status?.prevowned || "0",
        forTrade: item.status?.fortrade || "0",
        want: item.status?.want || "0",
        wantToPlay: item.status?.wanttoplay || "0",
        wantToBuy: item.status?.wanttobuy || "0",
        wishlist: item.status?.wishlist || "0",
        preordered: item.status?.preordered || "0",
        lastModified: item.status?.lastmodified || "",
      },
      numPlays: this.parseNumber(item.numplays) || 0,
      comment: item.comment || "",
      conditionText: item.conditiontext || "",
      condition: item.condition || "",
      wantPartsList: item.wantpartslist || "",
      hasPartsList: item.haspartslist || "",
      preordered: item.preordered || "",
      lastModified: item.lastmodified || "",
    };
  }

  private normalizeLinks(links: any[]): any[] {
    if (!Array.isArray(links)) {
      return [];
    }

    return links.map(link => ({
      type: link.type || "",
      id: link.id || "",
      value: link.value || "",
      linkType: this.mapLinkType(link.type),
      targetId: link.id || "",
      targetName: link.value || "",
      isExpansionLink: link.type === "boardgameexpansion",
    }));
  }

  private mapLinkType(linkType: string): string {
    const linkTypeMap: { [key: string]: string } = {
      boardgameexpansion: "BOARDGAME_EXPANSION",
      boardgamebase: "BOARDGAME_BASE",
      boardgameaccessory: "BOARDGAME_ACCESSORY",
      boardgamecategory: "BOARDGAME_CATEGORY",
      boardgamemechanic: "BOARDGAME_MECHANIC",
      boardgamedesigner: "BOARDGAME_DESIGNER",
      boardgameartist: "BOARDGAME_ARTIST",
      boardgamepublisher: "BOARDGAME_PUBLISHER",
      boardgamefamily: "BOARDGAME_FAMILY",
      rpgitem: "RPG_ITEM",
      rpgperiodical: "RPG_PERIODICAL",
      videogame: "VIDEOGAME",
    };

    return linkTypeMap[linkType] || "OTHER";
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
  private parseNumber(value: any): number {
    if (!value) return 0;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  }

  private parseFloat(value: any): number {
    if (!value) return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  private getPrimaryName(name: any): string {
    if (!name) return "";
    if (typeof name === "string") return name;
    if (Array.isArray(name)) {
      const primary = name.find(n => n.type === "primary");
      return primary?.value || name[0]?.value || "";
    }
    // Handle XML parser output where name is an object with _ property
    return name._ || name.value || "";
  }

  private getAlternateNames(name: any): string[] {
    if (!name) return [];
    if (typeof name === "string") return [];
    if (Array.isArray(name)) {
      return name
        .filter(n => n.type === "alternate")
        .map(n => n.value)
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
