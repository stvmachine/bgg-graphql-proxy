#!/usr/bin/env node

/**
 * Data Fetcher for Supabase
 * This script fetches data from BGG API and populates the Supabase PostgreSQL database
 */

const axios = require('axios');
const xml2js = require('xml2js');
const { Client } = require('pg');

// Load environment variables
require('dotenv').config();

// Database connection - will use Supabase's database URL
const client = new Client({
  connectionString: process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

// BGG API base URL
const BGG_API_BASE = process.env.BGG_API_BASE_URL || 'https://boardgamegeek.com/xmlapi2';

// XML parser
const parser = new xml2js.Parser();

async function connectDB() {
  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL database');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
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
    description: item.description && item.description[0] ? item.description[0] : null,
    image: item.image && item.image[0] ? item.image[0] : null,
    thumbnail: item.thumbnail && item.thumbnail[0] ? item.thumbnail[0] : null,
    average: item.statistics && item.statistics[0].ratings && item.statistics[0].ratings[0].average && item.statistics[0].ratings[0].average[0].$ ? parseFloat(item.statistics[0].ratings[0].average[0].$.value) : null,
    bayes_average: item.statistics && item.statistics[0].ratings && item.statistics[0].ratings[0].bayesaverage && item.statistics[0].ratings[0].bayesaverage[0].$ ? parseFloat(item.statistics[0].ratings[0].bayesaverage[0].$.value) : null,
    users_rated: item.statistics && item.statistics[0].ratings && item.statistics[0].ratings[0].usersrated && item.statistics[0].ratings[0].usersrated[0].$ ? parseInt(item.statistics[0].ratings[0].usersrated[0].$.value) : null,
    users_owned: item.statistics && item.statistics[0].ratings && item.statistics[0].ratings[0].owned && item.statistics[0].ratings[0].owned[0].$ ? parseInt(item.statistics[0].ratings[0].owned[0].$.value) : null,
    users_wanting: item.statistics && item.statistics[0].ratings && item.statistics[0].ratings[0].wanting && item.statistics[0].ratings[0].wanting[0].$ ? parseInt(item.statistics[0].ratings[0].wanting[0].$.value) : null,
    users_wishing: item.statistics && item.statistics[0].ratings && item.statistics[0].ratings[0].wishing && item.statistics[0].ratings[0].wishing[0].$ ? parseInt(item.statistics[0].ratings[0].wishing[0].$.value) : null,
    num_comments: item.statistics && item.statistics[0].ratings && item.statistics[0].ratings[0].numcomments && item.statistics[0].ratings[0].numcomments[0].$ ? parseInt(item.statistics[0].ratings[0].numcomments[0].$.value) : null,
    num_weights: item.statistics && item.statistics[0].ratings && item.statistics[0].ratings[0].numweights && item.statistics[0].ratings[0].numweights[0].$ ? parseInt(item.statistics[0].ratings[0].numweights[0].$.value) : null,
    average_weight: item.statistics && item.statistics[0].ratings && item.statistics[0].ratings[0].averageweight && item.statistics[0].ratings[0].averageweight[0].$ ? parseFloat(item.statistics[0].ratings[0].averageweight[0].$.value) : null,
    categories: item.link ? item.link.filter(l => l.$.type === 'boardgamecategory').map(l => ({ id: l.$.id, value: l.$.value })) : [],
    mechanics: item.link ? item.link.filter(l => l.$.type === 'boardgamemechanic').map(l => ({ id: l.$.id, value: l.$.value })) : [],
    designers: item.link ? item.link.filter(l => l.$.type === 'boardgamedesigner').map(l => ({ id: l.$.id, value: l.$.value })) : [],
    artists: item.link ? item.link.filter(l => l.$.type === 'boardgameartist').map(l => ({ id: l.$.id, value: l.$.value })) : [],
    publishers: item.link ? item.link.filter(l => l.$.type === 'boardgamepublisher').map(l => ({ id: l.$.id, value: l.$.value })) : [],
    ranks: item.statistics && item.statistics[0].ratings && item.statistics[0].ratings[0].ranks && item.statistics[0].ratings[0].ranks[0].rank ? item.statistics[0].ratings[0].ranks[0].rank.map(r => ({ id: r.$.id, type: r.$.type, name: r.$.name, friendly_name: r.$.friendlyname, value: r.$.value, bayes_average: r.$.bayesaverage })) : [],
  };
}

async function saveThingToDB(thing) {
  try {
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

    // Save categories
    for (const category of thing.categories) {
      await client.query(`
        INSERT INTO categories (id, value, thing_id) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value
      `, [category.id, category.value, thing.id]);
    }

    // Save mechanics
    for (const mechanic of thing.mechanics) {
      await client.query(`
        INSERT INTO mechanics (id, value, thing_id) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value
      `, [mechanic.id, mechanic.value, thing.id]);
    }

    // Save designers
    for (const designer of thing.designers) {
      await client.query(`
        INSERT INTO designers (id, value, thing_id) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value
      `, [designer.id, designer.value, thing.id]);
    }

    // Save artists
    for (const artist of thing.artists) {
      await client.query(`
        INSERT INTO artists (id, value, thing_id) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value
      `, [artist.id, artist.value, thing.id]);
    }

    // Save publishers
    for (const publisher of thing.publishers) {
      await client.query(`
        INSERT INTO publishers (id, value, thing_id) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value
      `, [publisher.id, publisher.value, thing.id]);
    }

    // Save ranks
    for (const rank of thing.ranks) {
      await client.query(`
        INSERT INTO ranks (id, type, name, friendly_name, value, bayes_average, thing_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        ON CONFLICT (id) DO UPDATE SET 
          type = EXCLUDED.type,
          name = EXCLUDED.name,
          friendly_name = EXCLUDED.friendly_name,
          value = EXCLUDED.value,
          bayes_average = EXCLUDED.bayes_average
      `, [rank.id, rank.type, rank.name, rank.friendly_name, rank.value, rank.bayes_average, thing.id]);
    }

    console.log(`✅ Saved thing: ${thing.name} (${thing.id})`);
  } catch (error) {
    console.error(`❌ Error saving thing ${thing.id}:`, error.message);
  }
}

async function fetchBGGData() {
  console.log('🚀 Starting BGG data fetch for Supabase...');
  
  await connectDB();

  const startId = 1;
  const endId = 100; // Start with 100 games for testing
  const batchSize = 10;
  const delay = 1000; // 1 second delay between requests

  for (let i = startId; i <= endId; i += batchSize) {
    const batch = [];
    for (let j = i; j < Math.min(i + batchSize, endId + 1); j++) {
      batch.push(j);
    }

    console.log(`📦 Fetching batch: ${batch[0]}-${batch[batch.length - 1]}`);

    try {
      const response = await axios.get(`${BGG_API_BASE}/thing`, {
        params: {
          id: batch.join(','),
          type: 'boardgame,boardgameexpansion',
          stats: 1
        }
      });

      const result = await parser.parseStringPromise(response.data);
      
      if (result.items && result.items[0] && result.items[0].item) {
        const items = result.items[0].item;
        
        for (const item of items) {
          const thing = parseThingData(item);
          await saveThingToDB(thing);
        }
      }

      // Delay between batches to be respectful to BGG API
      if (i + batchSize <= endId) {
        console.log(`⏳ Waiting ${delay}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

    } catch (error) {
      console.error(`❌ Error fetching batch ${batch[0]}-${batch[batch.length - 1]}:`, error.message);
    }
  }

  console.log('🎉 BGG data fetch completed!');
  await client.end();
}

// Run the script
if (require.main === module) {
  fetchBGGData().catch(console.error);
}

module.exports = { fetchBGGData };

