// AUTO LIRIK GRATIS - ROOT VERSION
export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  const {theme, moods, genres}=req.body;
  const isSad=(moods||'').toLowerCase().includes('sad')||(moods||'').toLowerCase().includes('heartbroken');
  let lyrics;
  if(isSad){
    lyrics=`[Verse]\n${theme}\nMalam ini hujan turun lagi\n\n[Chorus]\nAku masih menunggu\nWujudkan mimpi ciptakan lagu tanpa batas\n\n[Verse 2]\nJalan ini sepi tanpa dirimu`;
  } else {
    lyrics=`[Verse]\n${theme}\nLangkahku mulai hari ini\n\n[Chorus]\nWujudkan mimpi dan ciptakan lagu tanpa batas\nBersama Bixtone\nGenre ${genres}`;
  }
  return res.json({lyrics, free:true});
}
