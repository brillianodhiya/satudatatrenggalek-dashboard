import fs from 'fs';

const rawData = fs.readFileSync('satudata.trenggalekkab.go.id.har', 'utf-8');
const harJson = JSON.parse(rawData);

const entries = harJson.log?.entries || [];

for (const entry of entries) {
  console.log('URL:', entry.request?.url);
  const headers = entry.request?.headers || [];
  const cookieHeader = headers.find((h: any) => h.name.toLowerCase() === 'cookie');
  if (cookieHeader) {
    console.log('  Cookie:', cookieHeader.value);
  }
}
