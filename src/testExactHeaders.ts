import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function testExact() {
  const cookie = process.env.COOKIE_HEADER || '';
  console.log('Testing exact headers with cookie length:', cookie.length);

  try {
    const res = await axios.get('https://satudata.trenggalekkab.go.id/json/vertikal/kecamatan', {
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'priority': 'u=0, i',
        'sec-ch-ua': '"Not;A=Brand";v="8", "Chromium";v="150", "Google Chrome";v="150"',
        'sec-ch-ua-arch': '"x86"',
        'sec-ch-ua-bitness': '"64"',
        'sec-ch-ua-full-version': '"150.0.7871.184"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
        'cookie': cookie
      }
    });

    console.log('Status code:', res.status);
    console.log('Response type:', typeof res.data);
    console.log('Response data:', JSON.stringify(res.data, null, 2));
  } catch (err: any) {
    console.error('Error status:', err.response?.status || err.message);
    if (err.response?.data) {
      console.error('Error body snippet:', String(err.response.data).substring(0, 300));
    }
  }
}

testExact();
