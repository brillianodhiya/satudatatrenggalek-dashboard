import axios from 'axios';

async function test() {
  const url = 'https://satudata.trenggalekkab.go.id/json/3';
  
  // Test with user agent + custom cookie if available
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    });
    console.log('AXIOS Status:', res.status);
    console.log('AXIOS Data Snippet:', JSON.stringify(res.data).substring(0, 300));
  } catch (err: any) {
    console.error('AXIOS Error Status:', err.response?.status || err.message);
  }
}

test();
