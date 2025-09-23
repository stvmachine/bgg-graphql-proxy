const axios = require('axios');
const xml2js = require('xml2js');
const { Client } = require('pg');

// Load environment variables
require('dotenv').config();

// Database connection
const client = new Client({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  database: process.env.POSTGRES_DB || 'bgg',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
});

// BGG API base URL
const BGG_API_BASE = process.env.BGG_API_BASE_URL || 'https://boardgamegeek.com/xmlapi2';

// XML parser
const parser = new xml2js.Parser();

async function connectDB() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
}

async function fetchThingFromBGG(id) {
  try {
    console.log(`🔍 Fetching thing ${id} from BGG...`);
    const response = await axios.get(`${BGG_API_BASE}/thing?id=${id}&stats=1`);
    const result = await parser.parseStringPromise(response.data);
    
    if (!result.items || !result.items.item) {
      console.log(`⚠️ No data found for thing ${id}`);
      return null;
    }

    const item = Array.isArray(result.items.item) ? result.items.item[0] : result.items.item;
    return parseThingData(item);
  } catch (error) {
    console.error(`❌ Error fetching thing ${id}:`, error.message);
    return null;
  }
}

function parseThingData(item) {
  const attrs = item.$;
  const names = item.name || [];
  const primaryName = names.find(n => n.$.primary === 'true') || names[0];
  
  
  return {
    id: attrs.id,
    type: attrs.type,
    name: primaryName ? primaryName.$.value : 'Unknown',
    alternate_names: names.filter(n => n.$.primary !== 'true').map(n => n.$.value),
    year_published: attrs.yearpublished ? parseInt(attrs.yearpublished) : null,
    min_players: attrs.minplayers ? parseInt(attrs.minplayers) : null,
    max_players: attrs.maxplayers ? parseInt(attrs.maxplayers) : null,
    playing_time: attrs.playingtime ? parseInt(attrs.playingtime) : null,
    min_play_time: attrs.minplaytime ? parseInt(attrs.minplaytime) : null,
    max_play_time: attrs.maxplaytime ? parseInt(attrs.maxplaytime) : null,
    min_age: attrs.minage ? parseInt(attrs.minage) : null,
    description: item.description ? item.description[0] : null,
    image: item.image ? item.image[0] : null,
    thumbnail: item.thumbnail ? item.thumbnail[0] : null,
    average: item.statistics ? parseFloat(item.statistics[0].ratings[0].average[0].$.value) : null,
    bayes_average: item.statistics ? parseFloat(item.statistics[0].ratings[0].bayesaverage[0].$.value) : null,
    users_rated: item.statistics ? parseInt(item.statistics[0].ratings[0].usersrated[0].$.value) : null,
    users_owned: item.statistics ? parseInt(item.statistics[0].ratings[0].owned[0].$.value) : null,
    users_wanting: item.statistics ? parseInt(item.statistics[0].ratings[0].wanting[0].$.value) : null,
    users_wishing: item.statistics ? parseInt(item.statistics[0].ratings[0].wishing[0].$.value) : null,
    num_comments: item.statistics ? parseInt(item.statistics[0].ratings[0].numcomments[0].$.value) : null,
    num_weights: item.statistics ? parseInt(item.statistics[0].ratings[0].numweights[0].$.value) : null,
    average_weight: item.statistics ? parseFloat(item.statistics[0].ratings[0].averageweight[0].$.value) : null,
    categories: item.link ? item.link.filter(l => l.$.type === 'boardgamecategory').map(l => ({
      type: l.$.type,
      value: l.$.value
    })) : [],
    mechanics: item.link ? item.link.filter(l => l.$.type === 'boardgamemechanic').map(l => ({
      type: l.$.type,
      value: l.$.value
    })) : [],
    designers: item.link ? item.link.filter(l => l.$.type === 'boardgamedesigner').map(l => ({
      type: l.$.type,
      value: l.$.value
    })) : [],
    artists: item.link ? item.link.filter(l => l.$.type === 'boardgameartist').map(l => ({
      type: l.$.type,
      value: l.$.value
    })) : [],
    publishers: item.link ? item.link.filter(l => l.$.type === 'boardgamepublisher').map(l => ({
      type: l.$.type,
      value: l.$.value
    })) : [],
    ranks: item.statistics ? item.statistics[0].ratings[0].ranks[0].rank.map(r => ({
      type: r.$.type,
      rank_id: r.$.id,
      name: r.$.name,
      friendly_name: r.$.friendlyname,
      value: r.$.value,
      bayes_average: r.$.bayesaverage
    })) : []
  };
}

async function saveThingToDB(thing) {
  try {
    // Insert main thing record
    const thingQuery = `
      INSERT INTO things (
        id, type, name, alternate_names, year_published, min_players, max_players,
        playing_time, min_play_time, max_play_time, min_age, description, image,
        thumbnail, average, bayes_average, users_rated, users_owned, users_wanting,
        users_wishing, num_comments, num_weights, average_weight
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      ) ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        alternate_names = EXCLUDED.alternate_names,
        year_published = EXCLUDED.year_published,
        min_players = EXCLUDED.min_players,
        max_players = EXCLUDED.max_players,
        playing_time = EXCLUDED.playing_time,
        min_play_time = EXCLUDED.min_play_time,
        max_play_time = EXCLUDED.max_play_time,
        min_age = EXCLUDED.min_age,
        description = EXCLUDED.description,
        image = EXCLUDED.image,
        thumbnail = EXCLUDED.thumbnail,
        average = EXCLUDED.average,
        bayes_average = EXCLUDED.bayes_average,
        users_rated = EXCLUDED.users_rated,
        users_owned = EXCLUDED.users_owned,
        users_wanting = EXCLUDED.users_wanting,
        users_wishing = EXCLUDED.users_wishing,
        num_comments = EXCLUDED.num_comments,
        num_weights = EXCLUDED.num_weights,
        average_weight = EXCLUDED.average_weight,
        updated_at = NOW()
    `;

    await client.query(thingQuery, [
      thing.id, thing.type, thing.name, JSON.stringify(thing.alternate_names),
      thing.year_published, thing.min_players, thing.max_players, thing.playing_time,
      thing.min_play_time, thing.max_play_time, thing.min_age, thing.description,
      thing.image, thing.thumbnail, thing.average, thing.bayes_average,
      thing.users_rated, thing.users_owned, thing.users_wanting, thing.users_wishing,
      thing.num_comments, thing.num_weights, thing.average_weight
    ]);

    // Clear existing related records
    await client.query('DELETE FROM categories WHERE thing_id = $1', [thing.id]);
    await client.query('DELETE FROM mechanics WHERE thing_id = $1', [thing.id]);
    await client.query('DELETE FROM designers WHERE thing_id = $1', [thing.id]);
    await client.query('DELETE FROM artists WHERE thing_id = $1', [thing.id]);
    await client.query('DELETE FROM publishers WHERE thing_id = $1', [thing.id]);
    await client.query('DELETE FROM ranks WHERE thing_id = $1', [thing.id]);

    // Insert related records
    for (const category of thing.categories) {
      await client.query(
        'INSERT INTO categories (thing_id, type, value) VALUES ($1, $2, $3)',
        [thing.id, category.type, category.value]
      );
    }

    for (const mechanic of thing.mechanics) {
      await client.query(
        'INSERT INTO mechanics (thing_id, type, value) VALUES ($1, $2, $3)',
        [thing.id, mechanic.type, mechanic.value]
      );
    }

    for (const designer of thing.designers) {
      await client.query(
        'INSERT INTO designers (thing_id, type, value) VALUES ($1, $2, $3)',
        [thing.id, designer.type, designer.value]
      );
    }

    for (const artist of thing.artists) {
      await client.query(
        'INSERT INTO artists (thing_id, type, value) VALUES ($1, $2, $3)',
        [thing.id, artist.type, artist.value]
      );
    }

    for (const publisher of thing.publishers) {
      await client.query(
        'INSERT INTO publishers (thing_id, type, value) VALUES ($1, $2, $3)',
        [thing.id, publisher.type, publisher.value]
      );
    }

    for (const rank of thing.ranks) {
      await client.query(
        'INSERT INTO ranks (thing_id, type, rank_id, name, friendly_name, value, bayes_average) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [thing.id, rank.type, rank.rank_id, rank.name, rank.friendly_name, rank.value, rank.bayes_average]
      );
    }

    console.log(`✅ Saved thing ${thing.id} (${thing.name}) to database`);
  } catch (error) {
    console.error(`❌ Error saving thing ${thing.id}:`, error.message);
  }
}

async function fetchAndSaveThings(thingIds) {
  console.log(`🚀 Starting to fetch ${thingIds.length} things from BGG...`);
  
  for (let i = 0; i < thingIds.length; i++) {
    const thingId = thingIds[i];
    console.log(`\n📊 Progress: ${i + 1}/${thingIds.length} (${Math.round(((i + 1) / thingIds.length) * 100)}%)`);
    
    const thing = await fetchThingFromBGG(thingId);
    if (thing) {
      await saveThingToDB(thing);
    }
    
    // Rate limiting - wait 1 second between requests
    if (i < thingIds.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n🎉 Finished fetching and saving all things!');
}

async function main() {
  await connectDB();
  
  // Some popular board game IDs to start with
  const popularGameIds = [
    '174430', // Gloomhaven
    '161936', // Pandemic Legacy: Season 1
    '266192', // Wingspan
    '167791', // Terraforming Mars
    '266810', // Azul
    '230802', // Scythe
    '266524', // Root
    '266192', // Wingspan
    '266810', // Azul
    '230802'  // Scythe
  ];
  
  await fetchAndSaveThings(popularGameIds);
  await client.end();
}

main().catch(console.error);
