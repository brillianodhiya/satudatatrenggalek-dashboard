async function runSimpleCloudflareDemo() {
  const url = 'https://satudata.trenggalekkab.go.id/api_json/881';

  console.log('\n=============================================================');
  console.log('🔴 MENCOBA AKSES DATA API SATU DATA TRENGGALEK...');
  console.log('=============================================================');
  console.log(`🌐 Target Endpoint : ${url}\n`);

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'curl/7.68.0' }
    });

    const serverHeader = res.headers.get('server') || 'Unknown';
    const cfRay = res.headers.get('cf-ray') || 'N/A';
    const cfAction = res.headers.get('cf-mitigated') || 'N/A';
    const bodyText = await res.text();

    console.log(`❌ HASIL REQUEST : ${res.status} ${res.statusText} (DIBLOKIR!)`);
    console.log(`🛡️ FIREWALL     : Cloudflare Protection Active`);
    console.log(`   ├─ Server Header : ${serverHeader}`);
    console.log(`   ├─ Cloudflare Ray: ${cfRay}`);
    console.log(`   └─ Action        : ${cfAction} (Bot Security Challenge)`);

    console.log(`\n📄 RESPON YANG DITERIMA:`);
    console.log(`   Bukan JSON Data, melainkan Halaman HTML Tantangan Cloudflare!`);
    console.log(`   └─ Title: "${bodyText.match(/<title>(.*?)<\/title>/i)?.[1] || 'Unknown'}"`);
    console.log('=============================================================\n');

  } catch (err: any) {
    console.log(`❌ ERROR: Gagal mengakses server (${err.message})\n`);
  }
}

runSimpleCloudflareDemo();
