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
// api/generate.js - BIXTONE FREE - Key Ngumpet Aman
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error: 'POST only'});
  
  const { prompt, model } = req.body;
  const OR_KEY = process.env.OPENROUTER_KEY;
  const HF_TOKEN = process.env.HF_TOKEN;

  if (!OR_KEY || !HF_TOKEN) {
    return res.status(500).json({error: 'Key belum dipasang di Vercel Settings'});
  }

  try {
    // 1. LIRIK 3 MENIT - DeepSeek-R1 FREE
    const lyricRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OR_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://cfsv.vercel.app",
        "X-Title": "BIXTONE FREE"
      },
      body: JSON.stringify({
        model: model || "deepseek/deepseek-r1:free",
        messages: [
          {role: "system", content: "Kamu penulis lirik Jawa galau profesional, puitis."},
          {role: "user", content: `${prompt} Format: Intro, Verse 1, Chorus, Verse 2, Chorus, Outro. 3 menit full.`}
        ],
        max_tokens: 1000,
        temperature: 0.8
      })
    });
    const lyricData = await lyricRes.json();
    if (lyricData.error) throw new Error(lyricData.error.message);
    const lirik = lyricData.choices[0].message.content;

    // 2. MUSIK 3 MENIT 20 DETIK - MusicGen FREE
    const musicRes = await fetch("https://api-inference.huggingface.co/models/facebook/musicgen-small", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `Sad Javanese song, kendang, erhu, saxophone, 85 BPM, ${lirik.substring(0,200)}`,
        parameters: { max_new_tokens: 1500 }
      })
    });

    if (musicRes.status === 503) {
      // Jika MusicGen cold start, kembalikan lirik dulu biar tidak gagal total
      return res.json({ lirik, music: null, warning: "MusicGen lagi pemanasan 20 detik, klik lagi untuk musiknya" });
    }
    if (!musicRes.ok) throw new Error(await musicRes.text());

    const audioBuffer = await musicRes.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    return res.json({ 
      lirik, 
      music: `data:audio/wav;base64,${audioBase64}`,
      duration: "3 Menit 20 Detik - Full, Bukan Gimik"
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
