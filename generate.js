export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error:'POST only'});

  const { universalPrompt, lyrics, mode } = req.body;
  const prompt = `${universalPrompt}. Lyrics: ${lyrics?.slice(0,300)||'Instrumental'}`.slice(0,500);

  // 3 Engine gratis, coba satu-satu
  const engines = [
    // Engine 1: ACE-Step via HF Space (utama)
    async () => {
      const r = await fetch('https://ace-step-ace-step.hf.space/api/predict', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({data:[prompt, lyrics||"", 60, 0.7, 0.5, mode==='instrumental'], fn_index: 0})
      });
      const j = await r.json();
      if (j.data && j.data[0]) return {audio_url: j.data[0], engine:'ACE-STEP'};
      throw new Error('ACE busy');
    },
    // Engine 2: MusicGen Small (backup)
    async () => {
      const r = await fetch('https://facebook-musicgen-small.hf.space/api/predict', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({data:[prompt, 30], fn_index: 0})
      });
      const j = await r.json();
      if (j.data && j.data[1]?.name) return {audio_url: `https://facebook-musicgen-small.hf.space/file=${j.data[1].name}`, engine:'MusicGen'};
      throw new Error('MusicGen busy');
    }
  ];

  for (let engine of engines) {
    try {
      const result = await engine();
      if (result.audio_url) return res.json(result);
    } catch (e) { console.log('Engine failed, next...', e.message); }
  }

  // Fallback terakhir: kasih demo MP3 biar player tidak 0:00
  // Ini file demo gratis, nanti kalau HF bangun, lagu asli akan keluar
  return res.json({
    audio_url: 'https://cdn.pixabay.com/audio/2023/02/14/audio_6e1b3e3a60.mp3',
    engine: 'DEMO (HF antri, coba lagi 1 menit)',
    note: 'HF Space antri, ini demo dulu. Coba Generate lagi dalam 1 menit.'
  });
}
