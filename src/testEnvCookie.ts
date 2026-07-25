import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function testDirectCookie() {
  const cookie = process.env.COOKIE_HEADER;
  console.log('Loaded Cookie length:', cookie?.length);

  try {
    const res = await axios.get('https://satudata.trenggalekkab.go.id/json/3', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Cookie': cookie || ''
      }
    });

    console.log('Direct HTTP Status:', res.status);
    console.log('Direct Data Snippet:\n', JSON.stringify(res.data, null, 2).substring(0, 500));
  } catch (err: any) {
    console.error('Direct HTTP Error:', err.response?.status || err.message);
  }
}

testDirectCookie();
