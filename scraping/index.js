const scrapingKaraokekan = require('./karaoke_kan');
(async ()=>{
  console.log( await scrapingKaraokekan.getResults());
})();
