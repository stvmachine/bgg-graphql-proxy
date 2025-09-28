import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { ApolloContext } from '../resolvers';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  Email: { input: any; output: any; }
  JSON: { input: any; output: any; }
  URL: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  isoCountry: Scalars['String']['output'];
};

export type Artist = {
  __typename?: 'Artist';
  id: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type BggEntity = {
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type BoardgameRank = {
  __typename?: 'BoardgameRank';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
  type: Scalars['String']['output'];
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Collection = {
  __typename?: 'Collection';
  items: Array<CollectionItem>;
  pubDate: Scalars['String']['output'];
  totalItems: Scalars['Int']['output'];
};

export type CollectionFiltersInput = {
  subtype?: InputMaybe<CollectionSubtype>;
};

export type CollectionItem = {
  __typename?: 'CollectionItem';
  collId: Scalars['String']['output'];
  comment: Scalars['String']['output'];
  condition: Scalars['String']['output'];
  conditionText: Scalars['String']['output'];
  hasPartsList: Scalars['String']['output'];
  image: Scalars['String']['output'];
  lastModified: Scalars['String']['output'];
  name: Scalars['String']['output'];
  numPlays: Scalars['Int']['output'];
  objectId: Scalars['ID']['output'];
  objectType: Scalars['String']['output'];
  preordered: Scalars['String']['output'];
  status: Status;
  subtype: Scalars['String']['output'];
  thumbnail: Scalars['String']['output'];
  wantPartsList: Scalars['String']['output'];
  yearPublished: Scalars['Int']['output'];
};

export enum CollectionSubtype {
  Boardgame = 'BOARDGAME',
  Boardgameaccessory = 'BOARDGAMEACCESSORY',
  Boardgameexpansion = 'BOARDGAMEEXPANSION',
  Rpgitem = 'RPGITEM',
  Videogame = 'VIDEOGAME'
}

export type Comment = {
  __typename?: 'Comment';
  rating: Scalars['String']['output'];
  username: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Designer = {
  __typename?: 'Designer';
  id: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Expansion = {
  __typename?: 'Expansion';
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  yearPublished?: Maybe<Scalars['Int']['output']>;
};

export type Family = {
  __typename?: 'Family';
  id: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Geeklist = {
  __typename?: 'Geeklist';
  id: Scalars['ID']['output'];
  items: Array<GeeklistItem>;
  lastReplyDate: Scalars['String']['output'];
  lastReplyDateTimestamp: Scalars['String']['output'];
  numItems: Scalars['Int']['output'];
  postDate: Scalars['String']['output'];
  postDateTimestamp: Scalars['String']['output'];
  thumbs: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type GeeklistComment = {
  __typename?: 'GeeklistComment';
  body: Scalars['String']['output'];
  editDate: Scalars['String']['output'];
  editDateTimestamp: Scalars['String']['output'];
  postDate: Scalars['String']['output'];
  postDateTimestamp: Scalars['String']['output'];
  thumbs: Scalars['Int']['output'];
  username: Scalars['String']['output'];
};

export type GeeklistItem = {
  __typename?: 'GeeklistItem';
  body: Scalars['String']['output'];
  comments: Array<GeeklistComment>;
  editDate: Scalars['String']['output'];
  editDateTimestamp: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imageId: Scalars['String']['output'];
  objectId: Scalars['ID']['output'];
  objectName: Scalars['String']['output'];
  objectType: Scalars['String']['output'];
  postDate: Scalars['String']['output'];
  postDateTimestamp: Scalars['String']['output'];
  thumbs: Scalars['Int']['output'];
  username: Scalars['String']['output'];
};

export type Guild = {
  __typename?: 'Guild';
  id: Scalars['ID']['output'];
  manager: User;
  members: Array<GuildMember>;
  name: Scalars['String']['output'];
};

export type GuildMember = {
  __typename?: 'GuildMember';
  joined: Scalars['String']['output'];
  user: User;
};

export type Link = {
  __typename?: 'Link';
  id: Scalars['String']['output'];
  isExpansionLink: Scalars['Boolean']['output'];
  linkType: LinkType;
  targetId: Scalars['String']['output'];
  targetName: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export enum LinkType {
  BoardgameAccessory = 'BOARDGAME_ACCESSORY',
  BoardgameArtist = 'BOARDGAME_ARTIST',
  BoardgameBase = 'BOARDGAME_BASE',
  BoardgameCategory = 'BOARDGAME_CATEGORY',
  BoardgameDesigner = 'BOARDGAME_DESIGNER',
  BoardgameExpansion = 'BOARDGAME_EXPANSION',
  BoardgameFamily = 'BOARDGAME_FAMILY',
  BoardgameMechanic = 'BOARDGAME_MECHANIC',
  BoardgamePublisher = 'BOARDGAME_PUBLISHER',
  Other = 'OTHER',
  RpgItem = 'RPG_ITEM',
  RpgPeriodical = 'RPG_PERIODICAL',
  Videogame = 'VIDEOGAME'
}

export type Mechanic = {
  __typename?: 'Mechanic';
  id: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Microbadge = {
  __typename?: 'Microbadge';
  id: Scalars['ID']['output'];
  imageSrc: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Play = {
  __typename?: 'Play';
  comments: Scalars['String']['output'];
  date: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  incomplete: Scalars['Boolean']['output'];
  item: PlayItem;
  length: Scalars['Int']['output'];
  location: Scalars['String']['output'];
  nowInStats: Scalars['Boolean']['output'];
  players: Array<PlayPlayer>;
  quantity: Scalars['Int']['output'];
};

export type PlayFiltersInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  maxdate?: InputMaybe<Scalars['String']['input']>;
  mindate?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type PlayItem = {
  __typename?: 'PlayItem';
  name: Scalars['String']['output'];
  objectId: Scalars['ID']['output'];
  objectType: Scalars['String']['output'];
  subtypes: Array<Subtype>;
};

export type PlayPlayer = {
  __typename?: 'PlayPlayer';
  color?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  new?: Maybe<Scalars['Boolean']['output']>;
  position: Scalars['Int']['output'];
  rating?: Maybe<Scalars['String']['output']>;
  score?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  win?: Maybe<Scalars['Boolean']['output']>;
};

export type PlayResult = {
  __typename?: 'PlayResult';
  page: Scalars['Int']['output'];
  plays: Array<Play>;
  total: Scalars['Int']['output'];
};

export type Poll = {
  __typename?: 'Poll';
  name: Scalars['String']['output'];
  results: Array<PollResult>;
  title: Scalars['String']['output'];
  totalVotes: Scalars['Int']['output'];
};

export type PollResult = {
  __typename?: 'PollResult';
  level?: Maybe<Scalars['String']['output']>;
  numVotes: Scalars['Int']['output'];
  players?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export type Publisher = {
  __typename?: 'Publisher';
  id: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  geeklist?: Maybe<Geeklist>;
  geeklists: Array<Geeklist>;
  hotItems: Array<Thing>;
  search: Array<Thing>;
  thing?: Maybe<Thing>;
  things: Array<Thing>;
  user?: Maybe<User>;
  userCollection?: Maybe<Collection>;
  userPlays?: Maybe<PlayResult>;
};


export type QueryGeeklistArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGeeklistsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type QueryHotItemsArgs = {
  type?: InputMaybe<ThingType>;
};


export type QuerySearchArgs = {
  exact?: InputMaybe<Scalars['Boolean']['input']>;
  query: Scalars['String']['input'];
  type?: InputMaybe<ThingType>;
};


export type QueryThingArgs = {
  id: Scalars['ID']['input'];
};


export type QueryThingsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryUserArgs = {
  username: Scalars['String']['input'];
};


export type QueryUserCollectionArgs = {
  subtype?: InputMaybe<CollectionSubtype>;
  username: Scalars['String']['input'];
};


export type QueryUserPlaysArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  maxdate?: InputMaybe<Scalars['String']['input']>;
  mindate?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  username: Scalars['String']['input'];
};

export type Rank = {
  __typename?: 'Rank';
  bayesAverage: Scalars['String']['output'];
  friendlyName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type RatingStats = {
  __typename?: 'RatingStats';
  average: Scalars['Float']['output'];
  averageWeight: Scalars['Float']['output'];
  bayesAverage: Scalars['Float']['output'];
  median: Scalars['Float']['output'];
  numComments: Scalars['Int']['output'];
  numWeights: Scalars['Int']['output'];
  owned: Scalars['Int']['output'];
  ranks: Array<Rank>;
  stdDev: Scalars['Float']['output'];
  trading: Scalars['Int']['output'];
  usersRated: Scalars['Int']['output'];
  wanting: Scalars['Int']['output'];
  wishing: Scalars['Int']['output'];
};

export type SearchInput = {
  exact?: InputMaybe<Scalars['Boolean']['input']>;
  query: Scalars['String']['input'];
  type?: InputMaybe<ThingType>;
};

export type SearchResult = Thing;

export type Statistics = {
  __typename?: 'Statistics';
  page: Scalars['Int']['output'];
  ratings: RatingStats;
};

export type Status = {
  __typename?: 'Status';
  forTrade: Scalars['String']['output'];
  lastModified: Scalars['String']['output'];
  own: Scalars['String']['output'];
  preordered: Scalars['String']['output'];
  prevOwned: Scalars['String']['output'];
  want: Scalars['String']['output'];
  wantToBuy: Scalars['String']['output'];
  wantToPlay: Scalars['String']['output'];
  wishlist: Scalars['String']['output'];
};

export type Subtype = {
  __typename?: 'Subtype';
  value: Scalars['String']['output'];
};

export type Thing = {
  __typename?: 'Thing';
  alternateNames: Array<Scalars['String']['output']>;
  artists: Array<Artist>;
  average?: Maybe<Scalars['Float']['output']>;
  averageWeight?: Maybe<Scalars['Float']['output']>;
  baseGame?: Maybe<Thing>;
  bayesAverage?: Maybe<Scalars['Float']['output']>;
  categories: Array<Category>;
  comments: Array<Comment>;
  description?: Maybe<Scalars['String']['output']>;
  designers: Array<Designer>;
  expansionFor: Array<Thing>;
  expansions: Array<Expansion>;
  families: Array<Family>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isExpansion: Scalars['Boolean']['output'];
  links: Array<Link>;
  maxPlayTime?: Maybe<Scalars['Int']['output']>;
  maxPlayers?: Maybe<Scalars['Int']['output']>;
  mechanics: Array<Mechanic>;
  minAge?: Maybe<Scalars['Int']['output']>;
  minPlayTime?: Maybe<Scalars['Int']['output']>;
  minPlayers?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  numComments?: Maybe<Scalars['Int']['output']>;
  numWeights?: Maybe<Scalars['Int']['output']>;
  playingTime?: Maybe<Scalars['Int']['output']>;
  polls: Array<Poll>;
  publishers: Array<Publisher>;
  ranks: Array<Rank>;
  statistics?: Maybe<Statistics>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  type: ThingType;
  usersOwned?: Maybe<Scalars['Int']['output']>;
  usersRated?: Maybe<Scalars['Int']['output']>;
  usersWanting?: Maybe<Scalars['Int']['output']>;
  usersWishing?: Maybe<Scalars['Int']['output']>;
  versions: Array<Version>;
  yearPublished?: Maybe<Scalars['Int']['output']>;
};

export enum ThingType {
  Boardgame = 'BOARDGAME',
  Boardgameaccessory = 'BOARDGAMEACCESSORY',
  Boardgameexpansion = 'BOARDGAMEEXPANSION',
  Rpgitem = 'RPGITEM',
  Videogame = 'VIDEOGAME'
}

export type TopItem = {
  __typename?: 'TopItem';
  boardgame: BoardgameRank;
};

export type User = {
  __typename?: 'User';
  address?: Maybe<Address>;
  dateRegistered: Scalars['String']['output'];
  designerId?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  guilds: Array<Guild>;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  microbadges: Array<Microbadge>;
  publisherId?: Maybe<Scalars['String']['output']>;
  supportYears: Scalars['Int']['output'];
  top: Array<TopItem>;
  username: Scalars['String']['output'];
};

export type Version = {
  __typename?: 'Version';
  color?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  depth?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
  links: Array<Link>;
  name: Scalars['String']['output'];
  price?: Maybe<Scalars['Float']['output']>;
  productCode?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  weight?: Maybe<Scalars['Float']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
  yearPublished: Scalars['Int']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  SearchResult: ( Thing );
}>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  BGGEntity: never;
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Address: ResolverTypeWrapper<Address>;
  Artist: ResolverTypeWrapper<Artist>;
  BGGEntity: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['BGGEntity']>;
  BoardgameRank: ResolverTypeWrapper<BoardgameRank>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Category: ResolverTypeWrapper<Category>;
  Collection: ResolverTypeWrapper<Collection>;
  CollectionFiltersInput: CollectionFiltersInput;
  CollectionItem: ResolverTypeWrapper<CollectionItem>;
  CollectionSubtype: CollectionSubtype;
  Comment: ResolverTypeWrapper<Comment>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Designer: ResolverTypeWrapper<Designer>;
  Email: ResolverTypeWrapper<Scalars['Email']['output']>;
  Expansion: ResolverTypeWrapper<Expansion>;
  Family: ResolverTypeWrapper<Family>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Geeklist: ResolverTypeWrapper<Geeklist>;
  GeeklistComment: ResolverTypeWrapper<GeeklistComment>;
  GeeklistItem: ResolverTypeWrapper<GeeklistItem>;
  Guild: ResolverTypeWrapper<Guild>;
  GuildMember: ResolverTypeWrapper<GuildMember>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Link: ResolverTypeWrapper<Link>;
  LinkType: LinkType;
  Mechanic: ResolverTypeWrapper<Mechanic>;
  Microbadge: ResolverTypeWrapper<Microbadge>;
  Play: ResolverTypeWrapper<Play>;
  PlayFiltersInput: PlayFiltersInput;
  PlayItem: ResolverTypeWrapper<PlayItem>;
  PlayPlayer: ResolverTypeWrapper<PlayPlayer>;
  PlayResult: ResolverTypeWrapper<PlayResult>;
  Poll: ResolverTypeWrapper<Poll>;
  PollResult: ResolverTypeWrapper<PollResult>;
  Publisher: ResolverTypeWrapper<Publisher>;
  Query: ResolverTypeWrapper<{}>;
  Rank: ResolverTypeWrapper<Rank>;
  RatingStats: ResolverTypeWrapper<RatingStats>;
  SearchInput: SearchInput;
  SearchResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SearchResult']>;
  Statistics: ResolverTypeWrapper<Statistics>;
  Status: ResolverTypeWrapper<Status>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subtype: ResolverTypeWrapper<Subtype>;
  Thing: ResolverTypeWrapper<Thing>;
  ThingType: ThingType;
  TopItem: ResolverTypeWrapper<TopItem>;
  URL: ResolverTypeWrapper<Scalars['URL']['output']>;
  User: ResolverTypeWrapper<User>;
  Version: ResolverTypeWrapper<Version>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Address: Address;
  Artist: Artist;
  BGGEntity: ResolversInterfaceTypes<ResolversParentTypes>['BGGEntity'];
  BoardgameRank: BoardgameRank;
  Boolean: Scalars['Boolean']['output'];
  Category: Category;
  Collection: Collection;
  CollectionFiltersInput: CollectionFiltersInput;
  CollectionItem: CollectionItem;
  Comment: Comment;
  Date: Scalars['Date']['output'];
  Designer: Designer;
  Email: Scalars['Email']['output'];
  Expansion: Expansion;
  Family: Family;
  Float: Scalars['Float']['output'];
  Geeklist: Geeklist;
  GeeklistComment: GeeklistComment;
  GeeklistItem: GeeklistItem;
  Guild: Guild;
  GuildMember: GuildMember;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  Link: Link;
  Mechanic: Mechanic;
  Microbadge: Microbadge;
  Play: Play;
  PlayFiltersInput: PlayFiltersInput;
  PlayItem: PlayItem;
  PlayPlayer: PlayPlayer;
  PlayResult: PlayResult;
  Poll: Poll;
  PollResult: PollResult;
  Publisher: Publisher;
  Query: {};
  Rank: Rank;
  RatingStats: RatingStats;
  SearchInput: SearchInput;
  SearchResult: ResolversUnionTypes<ResolversParentTypes>['SearchResult'];
  Statistics: Statistics;
  Status: Status;
  String: Scalars['String']['output'];
  Subtype: Subtype;
  Thing: Thing;
  TopItem: TopItem;
  URL: Scalars['URL']['output'];
  User: User;
  Version: Version;
}>;

export type CacheDirectiveArgs = {
  ttl?: Maybe<Scalars['Int']['input']>;
};

export type CacheDirectiveResolver<Result, Parent, ContextType = ApolloContext, Args = CacheDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type RateLimitDirectiveArgs = {
  limit?: Maybe<Scalars['Int']['input']>;
  window?: Maybe<Scalars['String']['input']>;
};

export type RateLimitDirectiveResolver<Result, Parent, ContextType = ApolloContext, Args = RateLimitDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AddressResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = ResolversObject<{
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isoCountry?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArtistResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Artist'] = ResolversParentTypes['Artist']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BggEntityResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['BGGEntity'] = ResolversParentTypes['BGGEntity']> = ResolversObject<{
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type BoardgameRankResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['BoardgameRank'] = ResolversParentTypes['BoardgameRank']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rank?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CategoryResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CollectionResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Collection'] = ResolversParentTypes['Collection']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['CollectionItem']>, ParentType, ContextType>;
  pubDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CollectionItemResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['CollectionItem'] = ResolversParentTypes['CollectionItem']> = ResolversObject<{
  collId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  comment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  condition?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  conditionText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasPartsList?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastModified?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numPlays?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  objectType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  preordered?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  subtype?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thumbnail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  wantPartsList?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  yearPublished?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommentResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = ResolversObject<{
  rating?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type DesignerResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Designer'] = ResolversParentTypes['Designer']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface EmailScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Email'], any> {
  name: 'Email';
}

export type ExpansionResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Expansion'] = ResolversParentTypes['Expansion']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  yearPublished?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FamilyResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Family'] = ResolversParentTypes['Family']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GeeklistResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Geeklist'] = ResolversParentTypes['Geeklist']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['GeeklistItem']>, ParentType, ContextType>;
  lastReplyDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastReplyDateTimestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  postDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postDateTimestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thumbs?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GeeklistCommentResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['GeeklistComment'] = ResolversParentTypes['GeeklistComment']> = ResolversObject<{
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  editDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  editDateTimestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postDateTimestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thumbs?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GeeklistItemResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['GeeklistItem'] = ResolversParentTypes['GeeklistItem']> = ResolversObject<{
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  comments?: Resolver<Array<ResolversTypes['GeeklistComment']>, ParentType, ContextType>;
  editDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  editDateTimestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  objectName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  objectType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postDateTimestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thumbs?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GuildResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Guild'] = ResolversParentTypes['Guild']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  manager?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['GuildMember']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GuildMemberResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['GuildMember'] = ResolversParentTypes['GuildMember']> = ResolversObject<{
  joined?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LinkResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Link'] = ResolversParentTypes['Link']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isExpansionLink?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  linkType?: Resolver<ResolversTypes['LinkType'], ParentType, ContextType>;
  targetId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  targetName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MechanicResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Mechanic'] = ResolversParentTypes['Mechanic']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MicrobadgeResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Microbadge'] = ResolversParentTypes['Microbadge']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageSrc?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlayResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Play'] = ResolversParentTypes['Play']> = ResolversObject<{
  comments?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  incomplete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  item?: Resolver<ResolversTypes['PlayItem'], ParentType, ContextType>;
  length?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nowInStats?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  players?: Resolver<Array<ResolversTypes['PlayPlayer']>, ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlayItemResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['PlayItem'] = ResolversParentTypes['PlayItem']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  objectType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subtypes?: Resolver<Array<ResolversTypes['Subtype']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlayPlayerResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['PlayPlayer'] = ResolversParentTypes['PlayPlayer']> = ResolversObject<{
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  new?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  win?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlayResultResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['PlayResult'] = ResolversParentTypes['PlayResult']> = ResolversObject<{
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  plays?: Resolver<Array<ResolversTypes['Play']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PollResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Poll'] = ResolversParentTypes['Poll']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['PollResult']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalVotes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PollResultResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['PollResult'] = ResolversParentTypes['PollResult']> = ResolversObject<{
  level?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  numVotes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  players?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PublisherResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Publisher'] = ResolversParentTypes['Publisher']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  geeklist?: Resolver<Maybe<ResolversTypes['Geeklist']>, ParentType, ContextType, RequireFields<QueryGeeklistArgs, 'id'>>;
  geeklists?: Resolver<Array<ResolversTypes['Geeklist']>, ParentType, ContextType, Partial<QueryGeeklistsArgs>>;
  hotItems?: Resolver<Array<ResolversTypes['Thing']>, ParentType, ContextType, Partial<QueryHotItemsArgs>>;
  search?: Resolver<Array<ResolversTypes['Thing']>, ParentType, ContextType, RequireFields<QuerySearchArgs, 'query'>>;
  thing?: Resolver<Maybe<ResolversTypes['Thing']>, ParentType, ContextType, RequireFields<QueryThingArgs, 'id'>>;
  things?: Resolver<Array<ResolversTypes['Thing']>, ParentType, ContextType, RequireFields<QueryThingsArgs, 'ids'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'username'>>;
  userCollection?: Resolver<Maybe<ResolversTypes['Collection']>, ParentType, ContextType, RequireFields<QueryUserCollectionArgs, 'username'>>;
  userPlays?: Resolver<Maybe<ResolversTypes['PlayResult']>, ParentType, ContextType, RequireFields<QueryUserPlaysArgs, 'username'>>;
}>;

export type RankResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Rank'] = ResolversParentTypes['Rank']> = ResolversObject<{
  bayesAverage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  friendlyName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RatingStatsResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['RatingStats'] = ResolversParentTypes['RatingStats']> = ResolversObject<{
  average?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  averageWeight?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  bayesAverage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  median?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  numComments?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  numWeights?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  owned?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ranks?: Resolver<Array<ResolversTypes['Rank']>, ParentType, ContextType>;
  stdDev?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  trading?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  usersRated?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  wanting?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  wishing?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SearchResultResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Thing', ParentType, ContextType>;
}>;

export type StatisticsResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Statistics'] = ResolversParentTypes['Statistics']> = ResolversObject<{
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ratings?: Resolver<ResolversTypes['RatingStats'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StatusResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Status'] = ResolversParentTypes['Status']> = ResolversObject<{
  forTrade?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastModified?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  own?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  preordered?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prevOwned?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  want?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  wantToBuy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  wantToPlay?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  wishlist?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubtypeResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Subtype'] = ResolversParentTypes['Subtype']> = ResolversObject<{
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ThingResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Thing'] = ResolversParentTypes['Thing']> = ResolversObject<{
  alternateNames?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  artists?: Resolver<Array<ResolversTypes['Artist']>, ParentType, ContextType>;
  average?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  averageWeight?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  baseGame?: Resolver<Maybe<ResolversTypes['Thing']>, ParentType, ContextType>;
  bayesAverage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  comments?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  designers?: Resolver<Array<ResolversTypes['Designer']>, ParentType, ContextType>;
  expansionFor?: Resolver<Array<ResolversTypes['Thing']>, ParentType, ContextType>;
  expansions?: Resolver<Array<ResolversTypes['Expansion']>, ParentType, ContextType>;
  families?: Resolver<Array<ResolversTypes['Family']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isExpansion?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  links?: Resolver<Array<ResolversTypes['Link']>, ParentType, ContextType>;
  maxPlayTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  maxPlayers?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  mechanics?: Resolver<Array<ResolversTypes['Mechanic']>, ParentType, ContextType>;
  minAge?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  minPlayTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  minPlayers?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numComments?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  numWeights?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  playingTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  polls?: Resolver<Array<ResolversTypes['Poll']>, ParentType, ContextType>;
  publishers?: Resolver<Array<ResolversTypes['Publisher']>, ParentType, ContextType>;
  ranks?: Resolver<Array<ResolversTypes['Rank']>, ParentType, ContextType>;
  statistics?: Resolver<Maybe<ResolversTypes['Statistics']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ThingType'], ParentType, ContextType>;
  usersOwned?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  usersRated?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  usersWanting?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  usersWishing?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  versions?: Resolver<Array<ResolversTypes['Version']>, ParentType, ContextType>;
  yearPublished?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TopItemResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['TopItem'] = ResolversParentTypes['TopItem']> = ResolversObject<{
  boardgame?: Resolver<ResolversTypes['BoardgameRank'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL';
}

export type UserResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  dateRegistered?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  designerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  guilds?: Resolver<Array<ResolversTypes['Guild']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  microbadges?: Resolver<Array<ResolversTypes['Microbadge']>, ParentType, ContextType>;
  publisherId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  supportYears?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  top?: Resolver<Array<ResolversTypes['TopItem']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VersionResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Version'] = ResolversParentTypes['Version']> = ResolversObject<{
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  currency?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  depth?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  length?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  links?: Resolver<Array<ResolversTypes['Link']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  productCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  size?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  width?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  yearPublished?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = ApolloContext> = ResolversObject<{
  Address?: AddressResolvers<ContextType>;
  Artist?: ArtistResolvers<ContextType>;
  BGGEntity?: BggEntityResolvers<ContextType>;
  BoardgameRank?: BoardgameRankResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  Collection?: CollectionResolvers<ContextType>;
  CollectionItem?: CollectionItemResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Designer?: DesignerResolvers<ContextType>;
  Email?: GraphQLScalarType;
  Expansion?: ExpansionResolvers<ContextType>;
  Family?: FamilyResolvers<ContextType>;
  Geeklist?: GeeklistResolvers<ContextType>;
  GeeklistComment?: GeeklistCommentResolvers<ContextType>;
  GeeklistItem?: GeeklistItemResolvers<ContextType>;
  Guild?: GuildResolvers<ContextType>;
  GuildMember?: GuildMemberResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Link?: LinkResolvers<ContextType>;
  Mechanic?: MechanicResolvers<ContextType>;
  Microbadge?: MicrobadgeResolvers<ContextType>;
  Play?: PlayResolvers<ContextType>;
  PlayItem?: PlayItemResolvers<ContextType>;
  PlayPlayer?: PlayPlayerResolvers<ContextType>;
  PlayResult?: PlayResultResolvers<ContextType>;
  Poll?: PollResolvers<ContextType>;
  PollResult?: PollResultResolvers<ContextType>;
  Publisher?: PublisherResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Rank?: RankResolvers<ContextType>;
  RatingStats?: RatingStatsResolvers<ContextType>;
  SearchResult?: SearchResultResolvers<ContextType>;
  Statistics?: StatisticsResolvers<ContextType>;
  Status?: StatusResolvers<ContextType>;
  Subtype?: SubtypeResolvers<ContextType>;
  Thing?: ThingResolvers<ContextType>;
  TopItem?: TopItemResolvers<ContextType>;
  URL?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  Version?: VersionResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = ApolloContext> = ResolversObject<{
  cache?: CacheDirectiveResolver<any, any, ContextType>;
  rateLimit?: RateLimitDirectiveResolver<any, any, ContextType>;
}>;
