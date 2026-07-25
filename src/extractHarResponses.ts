import fs from 'fs';

const rawData = fs.readFileSync('satudata.trenggalekkab.go.id.har', 'utf-8');
const harJson = JSON.parse(rawData);
const entries = harJson.log?.entries || [];

console.log(`Found ${entries.length} HAR entries:`);

for (let i = 0; i < entries.length; i++) {
  const entry = entries[i];
  const url = entry.request?.url;
  const status = entry.response?.status;
  const mimeType = entry.response?.content?.mimeType;
  const text = entry.response?.content?.text;

  console.log(`\nEntry #${i + 1}: ${entry.request?.method} ${url} (Status: ${status}, Mime: ${mimeType})`);
  if (text) {
    console.log('Content Snippet:', text.substring(0, 300));
  } else {
    console.log('No response content stored in HAR.');
  }
}
