import { discoverAllDatasetsWithBrowser } from './scraper/browserScraper';

async function main() {
  console.log('Testing discoverAllDatasetsWithBrowser...');
  const items = await discoverAllDatasetsWithBrowser();
  console.log(`\nDiscovered ${items.length} items:`);
  console.log('First 5 items:\n', items.slice(0, 5));
  console.log('Last 5 items:\n', items.slice(-5));
}

main();
