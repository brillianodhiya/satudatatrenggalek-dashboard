import { discoverDatasetsFromHar } from './scraper/datasetDiscoverer';

const items = discoverDatasetsFromHar('satudata.trenggalekkab.go.id.har');
console.log(`Discovered ${items.length} real dataset IDs from HAR:`);
console.log(items.slice(0, 10));
