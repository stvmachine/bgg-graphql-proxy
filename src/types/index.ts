export interface BGGThing {
  id: string;
  type: 'boardgame' | 'boardgameexpansion' | 'rpgitem' | 'videogame' | 'boardgameaccessory';
  name: BGGName[];
  yearpublished?: string;
  minplayers?: string;
  maxplayers?: string;
  playingtime?: string;
  minplaytime?: string;
  maxplaytime?: string;
  minage?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  statistics?: BGGStatistics;
  polls?: BGGPoll[];
  comments?: BGGComment[];
  versions?: BGGVersion[];
  expansions?: BGGExpansion[];
  categories?: BGGCategory[];
  mechanics?: BGGMechanic[];
  families?: BGGFamily[];
  designers?: BGGDesigner[];
  artists?: BGGArtist[];
  publishers?: BGGPublisher[];
  ranks?: BGGRank[];
  average?: string;
  bayesaverage?: string;
  usersrated?: string;
  usersowned?: string;
  userswanting?: string;
  userswishing?: string;
  numcomments?: string;
  numweights?: string;
  averageweight?: string;
}

export interface BGGName {
  type: 'primary' | 'alternate';
  value: string;
  sortindex?: string;
}

export interface BGGStatistics {
  page: number;
  ratings: {
    usersrated: string;
    average: string;
    bayesaverage: string;
    ranks: BGGRank[];
    stddev: string;
    median: string;
    owned: string;
    trading: string;
    wanting: string;
    wishing: string;
    numcomments: string;
    numweights: string;
    averageweight: string;
  };
}

export interface BGGRank {
  type: string;
  id: string;
  name: string;
  friendlyname: string;
  value: string;
  bayesaverage: string;
}

export interface BGGPoll {
  name: string;
  title: string;
  totalvotes: string;
  results: BGGPollResult[];
}

export interface BGGPollResult {
  value: string;
  numvotes: string;
  level?: string;
  players?: string;
}

export interface BGGComment {
  username: string;
  rating: string;
  value: string;
}

export interface BGGVersion {
  type: string;
  id: string;
  name: string;
  yearpublished: string;
  productcode?: string;
  width?: string;
  length?: string;
  depth?: string;
  weight?: string;
  size?: string;
  color?: string;
  price?: string;
  currency?: string;
  image?: string;
  thumbnail?: string;
  links?: BGGLink[];
}

export interface BGGExpansion {
  type: string;
  id: string;
  name: string;
  yearpublished?: string;
  image?: string;
  thumbnail?: string;
}

export interface BGGCategory {
  type: string;
  id: string;
  value: string;
}

export interface BGGMechanic {
  type: string;
  id: string;
  value: string;
}

export interface BGGFamily {
  type: string;
  id: string;
  value: string;
}

export interface BGGDesigner {
  type: string;
  id: string;
  value: string;
}

export interface BGGArtist {
  type: string;
  id: string;
  value: string;
}

export interface BGGPublisher {
  type: string;
  id: string;
  value: string;
}

export interface BGGLink {
  type: string;
  id: string;
  value: string;
}

export interface BGGUser {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  dateregistered: string;
  supportyears: string;
  designerid?: string;
  publisherid?: string;
  address?: {
    city: string;
    isocountry: string;
  };
  guilds?: BGGGuild[];
  microbadges?: BGGMicrobadge[];
  top?: BGGTop[];
}

export interface BGGGuild {
  id: string;
  name: string;
  manager: {
    id: string;
    username: string;
  };
  members: BGGGuildMember[];
}

export interface BGGGuildMember {
  user: {
    id: string;
    username: string;
  };
  joined: string;
}

export interface BGGMicrobadge {
  id: string;
  name: string;
  imagesrc: string;
}

export interface BGGTop {
  boardgame: {
    rank: string;
    id: string;
    type: string;
    name: string;
  };
}

export interface BGGCollection {
  totalitems: string;
  pubdate: string;
  items: BGGCollectionItem[];
}

export interface BGGCollectionItem {
  objecttype: string;
  objectid: string;
  subtype: string;
  collid: string;
  name: string;
  yearpublished: string;
  image: string;
  thumbnail: string;
  status: BGGStatus;
  numplays: string;
  comment: string;
  conditiontext: string;
  condition: string;
  wantpartslist: string;
  haspartslist: string;
  wantpartslist: string;
  haspartslist: string;
  preordered: string;
  lastmodified: string;
}

export interface BGGStatus {
  own: string;
  prevowned: string;
  fortrade: string;
  want: string;
  wanttoplay: string;
  wanttobuy: string;
  wishlist: string;
  preordered: string;
  lastmodified: string;
}

export interface BGGPlay {
  id: string;
  date: string;
  quantity: string;
  length: string;
  incomplete: string;
  nowinstats: string;
  location: string;
  item: BGGPlayItem;
  players: BGGPlayPlayer[];
  comments: string;
}

export interface BGGPlayItem {
  name: string;
  objecttype: string;
  objectid: string;
  subtypes: BGGSubtype[];
}

export interface BGGSubtype {
  value: string;
}

export interface BGGPlayPlayer {
  username?: string;
  name?: string;
  userid?: string;
  position: string;
  color?: string;
  score?: string;
  rating?: string;
  new?: string;
  win?: string;
}

export interface BGGGeeklist {
  id: string;
  title: string;
  postdate: string;
  postdate_timestamp: string;
  lastreplydate: string;
  lastreplydate_timestamp: string;
  thumbs: string;
  numitems: string;
  username: string;
  items: BGGGeeklistItem[];
}

export interface BGGGeeklistItem {
  id: string;
  objecttype: string;
  objectid: string;
  objectname: string;
  username: string;
  postdate: string;
  postdate_timestamp: string;
  editdate: string;
  editdate_timestamp: string;
  thumbs: string;
  imageid: string;
  body: string;
  comments: BGGGeeklistComment[];
}

export interface BGGGeeklistComment {
  username: string;
  postdate: string;
  postdate_timestamp: string;
  editdate: string;
  editdate_timestamp: string;
  thumbs: string;
  body: string;
}
