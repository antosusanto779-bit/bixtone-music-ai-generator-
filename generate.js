// BIXTONE FREE ENGINE - ROOT VERSION - TANPA FOLDER API
export default async function handler(req, res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  const { universalPrompt, lyrics, mode } = req.body;
  const isInstrumental = mode === 'instrumental';
  try {
    const hfResponse = await fetch('https://ace-step-ace-step.hf.space/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [universalPrompt || "Female Solo Vocal, Emotional Pop Ballad", isInstrumental ? "" : (lyrics || ""), isInstrumental, 120, 15, 60],
        fn_index: 0
      })
    });
    const result = await hfResponse.json();
    let audioUrl = result.data ? result.data[0] : null;
    if(audioUrl && typeof audioUrl === 'string' && audioUrl.startsWith('/file=')){
      audioUrl = 'https://ace-step-ace-step.hf.space' + audioUrl;
    }
    if(audioUrl && typeof audioUrl === 'object' && audioUrl.path){
      audioUrl = 'https://ace-step-ace-step.hf.space/file=' + audioUrl.path;
    }
    if(!audioUrl) throw new Error('No audio');
    return res.json({ audio_url: audioUrl, status: 'succeeded', free: true, engine: 'ACE-STEP FREE' });
  } catch (e) {
    const fallbackUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    return res.json({ audio_url: fallbackUrl, status: 'fallback-demo', free: true });
  }
}
