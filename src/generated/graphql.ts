/* eslint-disable */
// This file was automatically generated and should not be edited.

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = { [K in keyof T]?: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
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
  id: Scalars['ID'];
};

export type QueryGeeklistsArgs = {
  page?: InputMaybe<Scalars['Int']>;
  username: Scalars['String'];
};

export type QueryHotItemsArgs = {
  type?: InputMaybe<ThingType>;
};

export type QuerySearchArgs = {
  exact?: InputMaybe<Scalars['Boolean']>;
  query: Scalars['String'];
  type?: InputMaybe<ThingType>;
};

export type QueryThingArgs = {
  id: Scalars['ID'];
};

export type QueryThingsArgs = {
  ids: Array<Scalars['ID']>;
};

export type QueryUserArgs = {
  username: Scalars['String'];
};

export type QueryUserCollectionArgs = {
  subtype?: InputMaybe<CollectionSubtype>;
  username: Scalars['String'];
};

export type QueryUserPlaysArgs = {
  id?: InputMaybe<Scalars['ID']>;
  maxdate?: InputMaybe<Scalars['String']>;
  mindate?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Int']>;
  username: Scalars['String'];
};

export type Thing = {
  __typename?: 'Thing';
  alternateNames: Array<Scalars['String']>;
  artists: Array<Artist>;
  average?: Maybe<Scalars['Float']>;
  averageWeight?: Maybe<Scalars['Float']>;
  bayesAverage?: Maybe<Scalars['Float']>;
  categories: Array<Category>;
  comments: Array<Comment>;
  description?: Maybe<Scalars['String']>;
  designers: Array<Designer>;
  expansions: Array<Expansion>;
  families: Array<Family>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  mechanics: Array<Mechanic>;
  minAge?: Maybe<Scalars['Int']>;
  minPlayTime?: Maybe<Scalars['Int']>;
  minPlayers?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  numComments?: Maybe<Scalars['Int']>;
  numWeights?: Maybe<Scalars['Int']>;
  playingTime?: Maybe<Scalars['Int']>;
  polls: Array<Poll>;
  publishers: Array<Publisher>;
  ranks: Array<Rank>;
  statistics?: Maybe<Statistics>;
  thumbnail?: Maybe<Scalars['String']>;
  type: ThingType;
  usersOwned?: Maybe<Scalars['Int']>;
  usersRated?: Maybe<Scalars['Int']>;
  usersWanting?: Maybe<Scalars['Int']>;
  usersWishing?: Maybe<Scalars['Int']>;
  versions: Array<Version>;
  yearPublished?: Maybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  address?: Maybe<Address>;
  dateRegistered: Scalars['String'];
  designerId?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  guilds: Array<Guild>;
  id: Scalars['ID'];
  lastName: Scalars['String'];
  microbadges: Array<Microbadge>;
  publisherId?: Maybe<Scalars['String']>;
  supportYears: Scalars['Int'];
  top: Array<TopItem>;
  username: Scalars['String'];
};

export type Collection = {
  __typename?: 'Collection';
  items: Array<CollectionItem>;
  pubDate: Scalars['String'];
  totalItems: Scalars['Int'];
};

export type PlayResult = {
  __typename?: 'PlayResult';
  page: Scalars['Int'];
  plays: Array<Play>;
  total: Scalars['Int'];
};

export type Geeklist = {
  __typename?: 'Geeklist';
  id: Scalars['ID'];
  items: Array<GeeklistItem>;
  lastReplyDate: Scalars['String'];
  lastReplyDateTimestamp: Scalars['String'];
  numItems: Scalars['Int'];
  postDate: Scalars['String'];
  postDateTimestamp: Scalars['String'];
  thumbs: Scalars['Int'];
  title: Scalars['String'];
  username: Scalars['String'];
};

export type Artist = {
  __typename?: 'Artist';
  id: Scalars['String'];
  type: Scalars['String'];
  value: Scalars['String'];
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['String'];
  type: Scalars['String'];
  value: Scalars['String'];
};

export type Comment = {
  __typename?: 'Comment';
  rating: Scalars['String'];
  username: Scalars['String'];
  value: Scalars['String'];
};

export type Designer = {
  __typename?: 'Designer';
  id: Scalars['String'];
  type: Scalars['String'];
  value: Scalars['String'];
};

export type Expansion = {
  __typename?: 'Expansion';
  id: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  thumbnail?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  yearPublished?: Maybe<Scalars['Int']>;
};

export type Family = {
  __typename?: 'Family';
  id: Scalars['String'];
  type: Scalars['String'];
  value: Scalars['String'];
};

export type Mechanic = {
  __typename?: 'Mechanic';
  id: Scalars['String'];
  type: Scalars['String'];
  value: Scalars['String'];
};

export type Poll = {
  __typename?: 'Poll';
  name: Scalars['String'];
  results: Array<PollResult>;
  title: Scalars['String'];
  totalVotes: Scalars['Int'];
};

export type Publisher = {
  __typename?: 'Publisher';
  id: Scalars['String'];
  type: Scalars['String'];
  value: Scalars['String'];
};

export type Rank = {
  __typename?: 'Rank';
  bayesAverage: Scalars['String'];
  friendlyName: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
  value: Scalars['String'];
};

export type Statistics = {
  __typename?: 'Statistics';
  page: Scalars['Int'];
  ratings: RatingStats;
};

export type Version = {
  __typename?: 'Version';
  color?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  depth?: Maybe<Scalars['Float']>;
  id: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  length?: Maybe<Scalars['Float']>;
  links: Array<Link>;
  name: Scalars['String'];
  price?: Maybe<Scalars['Float']>;
  productCode?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  weight?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
  yearPublished: Scalars['Int'];
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String'];
  isoCountry: Scalars['String'];
};

export type Guild = {
  __typename?: 'Guild';
  id: Scalars['ID'];
  manager: User;
  members: Array<GuildMember>;
  name: Scalars['String'];
};

export type Microbadge = {
  __typename?: 'Microbadge';
  id: Scalars['ID'];
  imageSrc: Scalars['String'];
  name: Scalars['String'];
};

export type TopItem = {
  __typename?: 'TopItem';
  boardgame: BoardgameRank;
};

export type CollectionItem = {
  __typename?: 'CollectionItem';
  collId: Scalars['String'];
  comment: Scalars['String'];
  condition: Scalars['String'];
  conditionText: Scalars['String'];
  hasPartsList: Scalars['String'];
  image: Scalars['String'];
  lastModified: Scalars['String'];
  name: Scalars['String'];
  numPlays: Scalars['Int'];
  objectId: Scalars['ID'];
  objectType: Scalars['String'];
  preordered: Scalars['String'];
  status: Status;
  subtype: Scalars['String'];
  thumbnail: Scalars['String'];
  wantPartsList: Scalars['String'];
  yearPublished: Scalars['Int'];
};

export type Play = {
  __typename?: 'Play';
  comments: Scalars['String'];
  date: Scalars['String'];
  id: Scalars['ID'];
  incomplete: Scalars['Boolean'];
  item: PlayItem;
  length: Scalars['Int'];
  location: Scalars['String'];
  nowInStats: Scalars['Boolean'];
  players: Array<PlayPlayer>;
  quantity: Scalars['Int'];
};

export type GeeklistItem = {
  __typename?: 'GeeklistItem';
  body: Scalars['String'];
  comments: Array<GeeklistComment>;
  editDate: Scalars['String'];
  editDateTimestamp: Scalars['String'];
  id: Scalars['ID'];
  imageId: Scalars['String'];
  objectId: Scalars['ID'];
  objectName: Scalars['String'];
  objectType: Scalars['String'];
  postDate: Scalars['String'];
  postDateTimestamp: Scalars['String'];
  thumbs: Scalars['Int'];
  username: Scalars['String'];
};

export type PollResult = {
  __typename?: 'PollResult';
  level?: Maybe<Scalars['String']>;
  numVotes: Scalars['Int'];
  players?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type RatingStats = {
  __typename?: 'RatingStats';
  average: Scalars['Float'];
  averageWeight: Scalars['Float'];
  bayesAverage: Scalars['Float'];
  median: Scalars['Float'];
  numComments: Scalars['Int'];
  numWeights: Scalars['Int'];
  owned: Scalars['Int'];
  ranks: Array<Rank>;
  stdDev: Scalars['Float'];
  trading: Scalars['Int'];
  usersRated: Scalars['Int'];
  wanting: Scalars['Int'];
  wishing: Scalars['Int'];
};

export type Link = {
  __typename?: 'Link';
  id: Scalars['String'];
  type: Scalars['String'];
  value: Scalars['String'];
};

export type GuildMember = {
  __typename?: 'GuildMember';
  joined: Scalars['String'];
  user: User;
};

export type BoardgameRank = {
  __typename?: 'BoardgameRank';
  id: Scalars['ID'];
  name: Scalars['String'];
  rank: Scalars['Int'];
  type: Scalars['String'];
};

export type Status = {
  __typename?: 'Status';
  forTrade: Scalars['String'];
  lastModified: Scalars['String'];
  own: Scalars['String'];
  preordered: Scalars['String'];
  prevOwned: Scalars['String'];
  want: Scalars['String'];
  wantToBuy: Scalars['String'];
  wantToPlay: Scalars['String'];
  wishlist: Scalars['String'];
};

export type PlayItem = {
  __typename?: 'PlayItem';
  name: Scalars['String'];
  objectId: Scalars['ID'];
  objectType: Scalars['String'];
  subtypes: Array<Subtype>;
};

export type PlayPlayer = {
  __typename?: 'PlayPlayer';
  color?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  new: Scalars['Boolean'];
  position: Scalars['Int'];
  rating?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  win: Scalars['Boolean'];
};

export type GeeklistComment = {
  __typename?: 'GeeklistComment';
  body: Scalars['String'];
  editDate: Scalars['String'];
  editDateTimestamp: Scalars['String'];
  postDate: Scalars['String'];
  postDateTimestamp: Scalars['String'];
  thumbs: Scalars['Int'];
  username: Scalars['String'];
};

export type Subtype = {
  __typename?: 'Subtype';
  value: Scalars['String'];
};

export enum ThingType {
  Boardgame = 'BOARDGAME',
  Boardgameaccessory = 'BOARDGAMEACCESSORY',
  Boardgameexpansion = 'BOARDGAMEEXPANSION',
  Rpgitem = 'RPGITEM',
  Videogame = 'VIDEOGAME'
}

export enum CollectionSubtype {
  Boardgame = 'BOARDGAME',
  Boardgameaccessory = 'BOARDGAMEACCESSORY',
  Boardgameexpansion = 'BOARDGAMEEXPANSION',
  Rpgitem = 'RPGITEM',
  Videogame = 'VIDEOGAME'
}

export type Resolvers<ContextType = any> = {
  BoardgameRank?: Resolver<BoardgameRank, any, ContextType>;
  Collection?: Resolver<Collection, any, ContextType>;
  CollectionItem?: Resolver<CollectionItem, any, ContextType>;
  Geeklist?: Resolver<Geeklist, any, ContextType>;
  GeeklistComment?: Resolver<GeeklistComment, any, ContextType>;
  GeeklistItem?: Resolver<GeeklistItem, any, ContextType>;
  Guild?: Resolver<Guild, any, ContextType>;
  GuildMember?: Resolver<GuildMember, any, ContextType>;
  Link?: Resolver<Link, any, ContextType>;
  Microbadge?: Resolver<Microbadge, any, ContextType>;
  Play?: Resolver<Play, any, ContextType>;
  PlayItem?: Resolver<PlayItem, any, ContextType>;
  PlayPlayer?: Resolver<PlayPlayer, any, ContextType>;
  PlayResult?: Resolver<PlayResult, any, ContextType>;
  Poll?: Resolver<Poll, any, ContextType>;
  PollResult?: Resolver<PollResult, any, ContextType>;
  Publisher?: Resolver<Publisher, any, ContextType>;
  Query?: Resolver<Query, any, ContextType>;
  Rank?: Resolver<Rank, any, ContextType>;
  RatingStats?: Resolver<RatingStats, any, ContextType>;
  Status?: Resolver<Status, any, ContextType>;
  Statistics?: Resolver<Statistics, any, ContextType>;
  Subtype?: Resolver<Subtype, any, ContextType>;
  Thing?: Resolver<Thing, any, ContextType>;
  TopItem?: Resolver<TopItem, any, ContextType>;
  User?: Resolver<User, any, ContextType>;
  Version?: Resolver<Version, any, ContextType>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type ResolveInfo<TArgs = {}> = {
  parent: any;
  args: TArgs;
  context: TContext;
  info: GraphQLResolveInfo;
};

export type GraphQLResolveInfo = {
  fieldName: string;
  fieldNodes: Array<FieldNode>;
  returnType: GraphQLOutputType;
  parentType: GraphQLObjectType;
  path: Path;
  schema: GraphQLSchema;
  fragments: Record<string, FragmentDefinitionNode>;
  rootValue: any;
  operation: OperationDefinitionNode;
  variableValues: Record<string, any>;
  cacheControl: CacheControlExtensionOptions;
};

export type FieldNode = {
  kind: 'Field';
  alias?: Maybe<string>;
  name: NameNode;
  arguments?: Maybe<Array<ArgumentNode>>;
  directives?: Maybe<Array<DirectiveNode>>;
  selectionSet?: Maybe<SelectionSetNode>;
};

export type NameNode = {
  kind: 'Name';
  value: string;
};

export type ArgumentNode = {
  kind: 'Argument';
  name: NameNode;
  value: ValueNode;
};

export type ValueNode = {
  kind: 'StringValue' | 'BooleanValue' | 'IntValue' | 'FloatValue' | 'NullValue' | 'EnumValue' | 'ListValue' | 'ObjectValue';
  value?: any;
};

export type DirectiveNode = {
  kind: 'Directive';
  name: NameNode;
  arguments?: Maybe<Array<ArgumentNode>>;
};

export type SelectionSetNode = {
  kind: 'SelectionSet';
  selections: Array<SelectionNode>;
};

export type SelectionNode = FieldNode | FragmentSpreadNode | InlineFragmentNode;

export type FragmentSpreadNode = {
  kind: 'FragmentSpread';
  name: NameNode;
  directives?: Maybe<Array<DirectiveNode>>;
};

export type InlineFragmentNode = {
  kind: 'InlineFragment';
  typeCondition?: Maybe<NamedTypeNode>;
  directives?: Maybe<Array<DirectiveNode>>;
  selectionSet: SelectionSetNode;
};

export type NamedTypeNode = {
  kind: 'NamedType';
  name: NameNode;
};

export type FragmentDefinitionNode = {
  kind: 'FragmentDefinition';
  name: NameNode;
  typeCondition: NamedTypeNode;
  directives?: Maybe<Array<DirectiveNode>>;
  selectionSet: SelectionSetNode;
};

export type OperationDefinitionNode = {
  kind: 'OperationDefinition';
  operation: OperationTypeNode;
  name?: Maybe<NameNode>;
  variableDefinitions?: Maybe<Array<VariableDefinitionNode>>;
  directives?: Maybe<Array<DirectiveNode>>;
  selectionSet: SelectionSetNode;
};

export type OperationTypeNode = 'query' | 'mutation' | 'subscription';

export type VariableDefinitionNode = {
  kind: 'VariableDefinition';
  variable: VariableNode;
  type: TypeNode;
  defaultValue?: Maybe<ValueNode>;
  directives?: Maybe<Array<DirectiveNode>>;
};

export type VariableNode = {
  kind: 'Variable';
  name: NameNode;
};

export type TypeNode = NamedTypeNode | ListTypeNode | NonNullTypeNode;

export type ListTypeNode = {
  kind: 'ListType';
  type: TypeNode;
};

export type NonNullTypeNode = {
  kind: 'NonNullType';
  type: TypeNode;
};

export type Path = {
  prev: Path | undefined;
  key: string | number;
};

export type GraphQLOutputType = any;
export type GraphQLObjectType = any;
export type GraphQLSchema = any;
export type CacheControlExtensionOptions = any;
