import axios from 'axios';

async function testProxy() {
  try {
    console.log('Testing live API Proxy Gateway...');
    const res = await axios.get('http://localhost:3000/api/v1/datasets/1/data?tahun=2026');
    console.log('Proxy Dataset #1 Status:', res.status);
    console.log('Proxy Dataset #1 Data Snippet:\n', JSON.stringify(res.data, null, 2).substring(0, 500));

    const resMaster = await axios.get('http://localhost:3000/api/v1/master/vertikal/kecamatan');
    console.log('\nProxy Master Vertikal Status:', resMaster.status);
    console.log('Proxy Master Data Snippet:\n', JSON.stringify(resMaster.data, null, 2).substring(0, 500));
  } catch (err: any) {
    console.error('Error testing proxy:', err.response?.data || err.message);
  }
}

setTimeout(testProxy, 2000);
