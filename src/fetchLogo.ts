import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function fetchLogo() {
  try {
    const pageUrl = 'https://commons.wikimedia.org/wiki/File:Trenggalek_coat_of_arms.png';
    const pageRes = await axios.get(pageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    const match = pageRes.data.match(/https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/[^\"]+\.png\/[0-9]+px-Trenggalek_coat_of_arms\.png/);
    
    let imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Trenggalek_coat_of_arms.png/300px-Trenggalek_coat_of_arms.png';
    if (match) {
      imgUrl = match[0];
    }
    
    console.log('Downloading logo from:', imgUrl);
    const imgRes = await axios.get(imgUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      responseType: 'arraybuffer'
    });

    const publicDashboardDir = path.join(__dirname, '../dashboard/public');
    const publicDir = path.join(__dirname, '../public');

    fs.mkdirSync(publicDashboardDir, { recursive: true });
    fs.mkdirSync(publicDir, { recursive: true });

    fs.writeFileSync(path.join(publicDashboardDir, 'logo_trenggalek.png'), imgRes.data);
    fs.writeFileSync(path.join(publicDir, 'logo_trenggalek.png'), imgRes.data);
    console.log('✅ Lambang Kabupaten Trenggalek logo successfully downloaded! Size:', imgRes.data.length);
  } catch (err: any) {
    console.error('Error fetching logo:', err.message);
  }
}

fetchLogo();
