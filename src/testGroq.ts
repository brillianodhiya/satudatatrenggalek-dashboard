import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function testGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  console.log('GROQ_API_KEY loaded:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT FOUND');

  try {
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Anda adalah Asisten AI Satu Data Trenggalek.'
          },
          {
            role: 'user',
            content: 'Halo, sebutkan 3 kecamatan di Kabupaten Trenggalek!'
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('\n✅ GROQ API SUCCESS!');
    console.log('Model Response:\n', res.data.choices[0].message.content);
  } catch (err: any) {
    console.error('❌ GROQ API Error:', err.response ? err.response.data : err.message);
  }
}

testGroq();
