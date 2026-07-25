import axios from 'axios';

async function test881() {
  const res = await axios.get('http://localhost:3000/api/v1/datasets/881/data');
  console.log('Dataset 881 Status:', res.status);
  console.log('Dataset 881 Response:\n', JSON.stringify(res.data, null, 2));
}

test881();
