const fs = require('fs');

const GIPHY_TAGS = {
  'sleepy': 'sleepy tired reaction',
  'meh': 'bored meh reaction',
  'okay': 'okay thumbs up reaction',
  'relaxed': 'chill relaxed reaction',
  'confident': 'confident cool reaction',
  'excited': 'excited happy reaction',
  'having fun': 'party celebrating reaction',
  'angry': 'angry mad reaction',
  'cry': 'sad crying reaction',
  'suprised': 'shocked gasp reaction',
  'anxious': 'anxiety stressed reaction',
  'sad': 'sad crying reaction',
  'tired': 'tired exhausted reaction',
  'grateful': 'grateful happy reaction'
};

const apiKey = process.env.NEXT_PUBLIC_GIPHY_KEY || "";
const memesDatabase = {};

async function fetchGifsForTag(tag, query) {
  const gifIds = new Set();
  
  // Make 4 requests of 50 gifs each (total 200)
  for (let offset = 0; offset < 200; offset += 50) {
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=50&offset=${offset}&rating=g`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Error response for ${tag} at offset ${offset}:`, response.status);
        break;
      }
      const json = await response.json();
      if (json && json.data && json.data.length > 0) {
        json.data.forEach(item => {
          if (item.id) {
            gifIds.add(item.id);
          }
        });
        console.log(`Fetched ${json.data.length} gifs for tag "${tag}" (Offset: ${offset}). Total unique: ${gifIds.size}`);
      } else {
        break;
      }
    } catch (e) {
      console.error(`Failed to fetch for ${tag} at offset ${offset}:`, e);
      break;
    }
    // Small delay to be polite to the Giphy API rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Map back to i.giphy.com URLs
  return Array.from(gifIds).map(id => `https://i.giphy.com/${id}.gif`);
}

async function run() {
  console.log("Starting Giphy reaction data harvesting for local database...");
  for (const [tag, query] of Object.entries(GIPHY_TAGS)) {
    console.log(`\nHarvesting GIFs for reaction mood: "${tag}"...`);
    const gifs = await fetchGifsForTag(tag, query);
    memesDatabase[tag] = gifs;
    console.log(`Finished "${tag}". Harvested ${gifs.length} embeddable GIFs!`);
  }
  
  // Save to memes.json in root
  fs.writeFileSync('memes.json', JSON.stringify(memesDatabase, null, 2));
  console.log("\nSuccess! Local meme database of 200+ GIFs per mood compiled and written to memes.json!");
}

run();
