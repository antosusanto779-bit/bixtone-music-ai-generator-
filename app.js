// BIXTONE MUSIC AI GENERATOR - FREE ENGINE V4 - UNIVERSAL ENGLISH PROMPT (No Boyolali di prompt)
const DB={
vocals:["Male Solo Vocal","Female Solo Vocal","Duet Male-Male Vocal Harmonies","Duet Female-Female Vocal Harmonies","Duet Male-Female Romantic Harmony","Full Choir Ensemble"],
chars:["Deep Baritone","High Tenor","Powerful Soprano","Warm Alto","Heavy Bass","Airy Falsetto","Husky Voice","Raspy Rock Vocal","Clean Pop Vocal","Growl Scream","Fry Scream","Operatic Classical","Broken Sad Vocal","Emotional Crying","Angry Shout","Cheerful Bright","Whisper Sensual","Cold Distant","Powerful Belt","Soft Breath","Nasal Punk","Gritty Grunge","Soulful R&B","Jazz Scat","Traditional Ethnic Vocal","Melismatic Ornament","Folk Storyteller","Chant Style","Innocent Child-like","Teenage Rebel","Wise Old Voice","AutoTuned Robotic","Vocal Fry","Heavy Vibrato","ASMR Whisper","Stadium Shout","Gang Shout","Gregorian Chant","Throat Singing","Yodel","Beatbox","Rap Flow","Melodic Rap","Emo Scream","Gothic Dark","Dirty Grunge","Punk Nasal","Harsh Metal","Death Growl","Black Metal Shriek","Nu Metal Rap","High Power Metal","Folk Narrative","Country Twang","Blues Wail","Powerful Gospel","Chill Reggae","Energetic Ska","Smooth Jazz","Sleepy LoFi","Chopped EDM","Mumble Trap","Intimate Acoustic","Stadium Anthem","Arena Rock","Bedroom Pop","Dreamy Ethereal","Aggressive","Calm","Masculine","Feminine","Androgynous","Cute","Mature","Sexy","Innocent","Evil","Angelic","Demonic"],
moods:["Happy","Sad","Dark","Bright","Melancholic","Energetic","Calm","Angry","Romantic","Heartbroken","Lonely","Depressed","Anxious","Hopeful","Dreamy","Nostalgic","Euphoric","Chill","Aggressive","Peaceful","Mysterious","Epic","Cinematic","Intimate","Sensual","Spiritual","Patriotic","Rebellious","Anthemic","Rainy Day","Midnight","Sunrise","Summer","Winter","Autumn","Beach","Mountain","City Night","Village","Party","Club","Stadium","Bedroom","Car Drive","Roadtrip","Workout","Study","Sleep","Meditation","Intoxicated","Broken Heart","Healing","Toxic Relationship","Sweet Love","Bitter","Mystic","Betrayed","Abandoned","Ghosted","Forbidden Love","Long Distance","Missing You","Longing","Falling in Love","Breakup","Jealousy","Obsessive","Move On","Second Chance","Left Behind","Unrequited Love","Lost Love","Happy Ending","Heartbreak","Soulmate"],
genres:["Pop","Rock","Slow Rock","Hard Rock","Heavy Metal","Nu Metal","Progressive Metal","Alternative Metal","Gothic Metal","Death Metal","Black Metal","Doom Metal","Power Metal","Symphonic Metal","Metalcore","Deathcore","Punk","Pop Punk","Hardcore","Grunge","Alternative Rock","Indie Rock","Emo","Post Rock","Shoegaze","Folk Rock","Jazz","Smooth Jazz","Blues","R&B","Soul","Funk","Hip Hop","Trap","Drill","LoFi Hip Hop","EDM","House","Deep House","Techno","Trance","Dubstep","Drum & Bass","Future Bass","Electro Pop","Synthwave","Reggae","Ska","Dancehall","Afrobeat","K-Pop","J-Pop","City Pop","Acoustic","Folk","Country","Classical","Orchestral","Cinematic","Epic Trailer","LoFi","Chillhop","Ambient","New Age","Traditional Ethnic","Modern Ethnic Fusion","Dangdut Koplo","Dangdut Modern","Dangdut rock","Rock fusion","Metal fusion,"pop ballad,"Funkot","Breakbeat","Full Bass","Phonk","Brazilian Phonk","Slowed and Reverbed","Nightcore","Pop Koplo Fusion","EDM Koplo Fusion","Trap Koplo Fusion","Rock ballad","Metal ballad","Anthem","Ballad","Power Ballad","Acoustic Ballad","Piano Ballad","Orchestral Ballad","Metal melodic","Rock melodic","90s","Indie Pop","Synth Pop","Dream Pop"]
};

let sel={vocal:null,chars:[],moods:[],genres:[]};
let currentAudioUrl=null;

function init(){
  render('vocalBox',DB.vocals,'vocal',1);
  render('charBox',DB.chars,'chars',8);
  render('moodBox',DB.moods,'moods',8);
  render('genreBox',DB.genres,'genres',8);
  document.getElementById('lyricMode').addEventListener('change',e=>{
    document.getElementById('manualLyrics').style.display=e.target.value==='manual'?'block':'none';
  });
  document.getElementById('userTheme').addEventListener('input',updatePreview);
}

function render(boxId,list,type,max){
  const box=document.getElementById(boxId);
  box.innerHTML='';
  list.forEach(item=>{
    let d=document.createElement('div');
    d.className='pill'+(type==='vocal'?' radio':'');
    d.innerText=item;
    d.onclick=()=>{
      if(type==='vocal'){
        sel.vocal=item;
        document.querySelectorAll('#'+boxId+' .pill').forEach(p=>p.classList.remove('active'));
        d.classList.add('active');
      } else {
        let arr=sel[type];
        if(d.classList.contains('active')){
          d.classList.remove('active');
          sel[type]=arr.filter(x=>x!==item);
        } else {
          if(arr.length>=max){alert('Max '+max+' pilihan Mas! Kurangi dulu.');return}
          d.classList.add('active');
          arr.push(item);
        }
        let key=type==='chars'?'char':type==='moods'?'mood':'genre';
        const el=document.getElementById('c_'+key);
        if(el) el.innerText=sel[type].length+'/'+max;
      }
      updatePreview();
    };
    box.appendChild(d);
  });
}

function updatePreview(){
  if(!sel.vocal){
    document.getElementById('promptPreview').innerText='Pilih Vokal (A) dulu...';
    return;
  }
  let theme=document.getElementById('userTheme').value||'Song about love and dreams';
  let mode=document.getElementById('mode')?.value||'music';

  let prompt=`Style: ${sel.vocal} | Characters: ${sel.chars.join(', ')||'Emotional'} | Moods: ${sel.moods.join(', ')||'Heartfelt'} | Genres: ${sel.genres.join(', ')||'Pop Ballad'} | Mode: ${mode} | Theme: ${theme} | Production: High Quality Professional Studio Mastering, Stereo 44.1kHz, Clear Mix`;
  document.getElementById('promptPreview').innerText=prompt;
}

async function generateMusic(){
  let theme=document.getElementById('userTheme').value.trim();
  if(!sel.vocal){alert('Pilih Vokal (A) dulu Mas!');return}
  if(!theme){alert('Isi Tema Lagu dulu Mas! Contoh: Ditinggal nikah, hujan malam...');return}
  
  let mode=document.getElementById('mode').value;
  let lyricMode=document.getElementById('lyricMode').value;
  let manualLyrics=document.getElementById('manualLyrics').value.trim();
  let finalLyrics="";

  // Universal prompt - 100% English standard
  let universalPrompt=`${sel.vocal}, Vocal Character: ${sel.chars.join(', ')||'Emotional Vocal'}, Mood and Emotion: ${sel.moods.join(', ')||'Heartfelt'}, Music Genre: ${sel.genres.join(', ')||'Pop Ballad'}, Theme: ${theme}, Production: High Quality Professional Studio Mastering, Stereo, Clear Mix, Modern Production`;

  document.getElementById('status').innerText='⏳ ACE-Step Free Engine sedang compose... 30-90 detik (gratis, agak antri kayak Suno free)';

  // Lirik logic: Music / Instrumental + Auto / Manual
  if(mode==='instrumental'){
    finalLyrics="";
  } else if(lyricMode==='manual'){
    finalLyrics=manualLyrics||theme;
  } else {
    try{
      const lr=await fetch('/api/lyrics',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({theme, moods:sel.moods.join(', '), genres:sel.genres.join(', ')})
      });
      const ld=await lr.json();
      finalLyrics=ld.lyrics;
    }catch(e){
      finalLyrics=`[Verse]\n${theme}\n[Verse 2]\nMalam ini sepi\n[Chorus]\nWujudkan mimpi dan ciptakan lagu tanpa batas\nBersama Bixtone\n[Bridge]\nTak ada batas\n[Outro]\nBoyolali Indonesia`;
    }
  }

  try{
    const res=await fetch('/api/generate',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({universalPrompt, lyrics:finalLyrics, mode})
    });
    const data=await res.json();
    const audioUrl=data.audio_url;
    
    if(!audioUrl) throw new Error('No audio');

    const html=`<div class="track">
      <div style="width:48px;height:48px;background:linear-gradient(135deg,#0047b3,#c0c0c0);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 0 10px rgba(0,102,255,.5)">🎵</div>
      <div style="flex:1;min-width:0">
        <b style="font-size:11.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${(sel.genres[0]||'AI Song')} - ${theme.substring(0,28)}</b>
        <div style="font-size:9.5px;opacity:.65;margin:3px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${mode.toUpperCase()} | ${finalLyrics.substring(0,50).replace(/\n/g,' ')}...</div>
        <audio controls src="${audioUrl}" style="width:100%;height:34px;margin-top:4px" onplay="playGlobal('${audioUrl}')"></audio>
      </div>
      <button onclick="playGlobal('${audioUrl}')" style="padding:9px 11px;border-radius:10px;background:linear-gradient(135deg,#0066ff,#00ccff);color:white;border:1px solid #c0c0c0;font-weight:900">▶️</button>
    </div>`;

    document.getElementById('playlist').innerHTML=html+document.getElementById('playlist').innerHTML;
    playGlobal(audioUrl);
    document.getElementById('status').innerText=`✅ Selesai! Mode: ${mode.toUpperCase()} | Engine: ACE-STEP FREE | ${data.status||'succeeded'}`;
    
  }catch(err){
    console.error(err);
    document.getElementById('status').innerText='❌ HF Space lagi antri penuh (kayak Suno free). Coba lagi 1 menit, atau duplicate Space biar private.';
    // fallback demo biar player tetap jalan
    const fallback="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    const html=`<div class="track"><div style="width:48px;height:48px;background:#333;border-radius:11px;display:flex;align-items:center;justify-content:center">⚠️</div><div style="flex:1"><b style="font-size:11px">Demo - HF Space Antri</b><div style="font-size:9px;opacity:.6">Coba lagi 1 menit, engine gratis lagi penuh</div><audio controls src="${fallback}" style="width:100%;height:34px;margin-top:4px"></audio></div></div>`;
    document.getElementById('playlist').innerHTML=html+document.getElementById('playlist').innerHTML;
  }
}

function playGlobal(url){
  currentAudioUrl=url;
  const bar=document.getElementById('nowPlaying');
  bar.style.display='flex';
  const p=document.getElementById('mainPlayer');
  p.src=url;
  p.play().catch(()=>{});
}

function downloadCurrent(){
  if(currentAudioUrl) window.open(currentAudioUrl,'_blank');
}

init();
