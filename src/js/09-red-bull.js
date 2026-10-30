/* =========================================================================
   RED BULL BATALLA (competencia externa, calendario automático)
========================================================================= */
const RB_NATS = [
  {key:'rb_esp', name:'Red Bull España',        short:'ESP', countries:['España']},
  {key:'rb_arg', name:'Red Bull Argentina',     short:'ARG', countries:['Argentina']},
  {key:'rb_chi', name:'Red Bull Chile',         short:'CHI', countries:['Chile']},
  {key:'rb_mex', name:'Red Bull México',        short:'MEX', countries:['México']},
  {key:'rb_col', name:'Red Bull Colombia',      short:'COL', countries:['Colombia']},
  {key:'rb_per', name:'Red Bull Perú',          short:'PER', countries:['Perú']},
  {key:'rb_usa', name:'Red Bull EEUU',          short:'USA', countries:['EEUU','Canadá']},
  {key:'rb_sud', name:'Red Bull Sudamérica',    short:'SUD', countries:['Venezuela','Bolivia','Ecuador','Uruguay','Paraguay','Brasil','Sudamérica']},
  {key:'rb_cen', name:'Red Bull Centroamérica', short:'CEN', countries:['Centroamérica','Caribe','Cuba','Puerto Rico','República Dominicana','Panamá','Costa Rica','Guatemala','Honduras','El Salvador','Nicaragua']},
];
const RB_PLZ = {key:'rb_plz', name:'Torneo de Plazas', short:'PLZ'};
const RB_INT = {key:'rb_int', name:'Red Bull Internacional', short:'INT'};
const RB_ALL = [...RB_NATS, RB_PLZ];
function rbdef(k){ return k===RB_INT.key ? RB_INT : RB_ALL.find(x=>x.key===k); }
function isRB(k){ return typeof k==='string' && k.startsWith('rb_'); }
function rbOn(s){ return !!(s && s.rb && !s.rb.off); }
function evName(k){ return isRB(k) ? rbdef(k).name : ldef(k).name; }

const RB_PARTICIPATION = 0.6;            // prob. de que un freestyler apto se apunte esa temporada
const RB_FIRST_PODIUM = ['Chuty','Aczino','Gazir'];
const SEDES = ['España','Argentina','Perú','México','Chile','EEUU','Colombia','Venezuela'];
const SEDE_W = {'EEUU':0.25, 'Venezuela':0.25};
const LOCAL_BONUS = 6;                   // nivel extra del local en una Internacional
const RB_POOL_TARGET = 26;               // mínimo de aptos por nacional (se rellena con freestylers de plaza)

function quality(f){ return 0.6*f.nivel + 0.4*f.fama; }
function rbDot(k){ return `<img class="lg-logo rb-logo" src="${RB_LOGO}" alt="" style="width:18px;height:18px">`; }
function anyDot(k){ return isRB(k) ? rbDot(k) : leagueDot(k); }

/* ---- cantera real: quita los genéricos y añade los reales que falten ---- */
const COUNTRY_FIX = {'Reverse':'EEUU','Switch':'Ecuador','Éxodo Lirical':'República Dominicana','SNK':'Costa Rica','Ritmodelia':'Guatemala','Zaki':'El Salvador','Aldahir':'Panamá'};
function syncRealPool(){
  if(state.company && (state.company.dbv||0)<3){
    const fixes={'Azeta':[45,35],'Godlemon':[45,35],'Ortiz':[45,35]};
    state.freestylers.forEach(f=>{ if(STYLE_PRESET[f.name]) f.style=STYLE_PRESET[f.name]; if(fixes[f.name]){ f.nivel=fixes[f.name][0]; f.fama=fixes[f.name][1]; } if(f.name==='Yartzi') f.country='Puerto Rico'; });
    state.company.dbv=3; }
  const s=cur(); const ref=new Set();
  if(s){ Object.values(s.leagues||{}).forEach(L=>L.competitors.forEach(id=>ref.add(id)));
    if(rbOn(s)){ s.rb.events.forEach(e=>e.participants.forEach(id=>ref.add(id))); (s.rb.inter.qualifiers||[]).forEach(id=>ref.add(id)); (s.rb.interPodium||[]).forEach(id=>ref.add(id)); } }
  state.freestylers=state.freestylers.filter(f=>!f.plaza || ref.has(f.id));
  state.freestylers.forEach(f=>{ if(!f.photo && presetPhoto(f.name)) f.photo=presetPhoto(f.name); if(f.hype==null) f.hype=randHype(f.fama); if(!STYLES[f.style]) f.style=defaultStyle(f.name); const fx=COUNTRY_FIX[f.name]; if(fx && (f.country==='México'||f.country==='Caribe')) f.country=fx; });
  const have=new Set(state.freestylers.map(f=>f.name.toLowerCase()));
  Object.entries(REAL_PRESET).forEach(([country,list])=> list.forEach(([name,nivel,fama])=>{
    if(!have.has(name.toLowerCase())) state.freestylers.push({id:uid('f'), name, country, nivel, fama, hype:randHype(fama), legend:PRESET_LEGENDS.includes(name), style:defaultStyle(name)});
  }));
}
function isPrimeDay(y,d){ const w=dayToDate(y,d).getUTCDay(); return w===5||w===6||w===0; }   // viernes, sábado o domingo
const WEEKDAY_TICKET = 0.7;   // taquilla de lunes a jueves

/* ---- sedes ---- */
function recentSedes(seasons, kind){
  return seasons.slice(-2).map(s=> kind==='rb' ? (rbOn(s) && s.rb.inter.sede) : (s.intlEnabled && s.intl && s.intl.sede)).filter(Boolean);
}
function pickSede(excluded){
  const opts=SEDES.filter(x=>!excluded.includes(x));
  const tot=opts.reduce((a,x)=>a+(SEDE_W[x]||1),0); let r=Math.random()*tot;
  for(const x of opts){ r-=(SEDE_W[x]||1); if(r<=0) return x; }
  return opts[0];
}
function fmsSedeBlocked(){ const s=cur(); const i=state.seasons.indexOf(s); return recentSedes(state.seasons.slice(0,i),'fms'); }
function setIntlSede(c){
  const s=cur(); if(s.phase!=='pre') return;
  if(fmsSedeBlocked().includes(c)){ toast(`${c} fue sede hace menos de 3 temporadas.`); return; }
  s.intl.sede=c; render();
}
function sedePicker(){
  const s=cur(); const blocked=fmsSedeBlocked();
  return `<div class="sede-picker"><span class="field-label">Sede del ${INTL.name}</span>
    <div class="sede-row">${SEDES.map(c=>{ const b=blocked.includes(c);
      return `<button class="seg ${s.intl.sede===c?'on':''} ${b?'locked':''}" onclick="setIntlSede('${c}')" ${b?'aria-disabled="true" title="Sede reciente"':''} aria-pressed="${s.intl.sede===c}">${c}</button>`; }).join('')}</div>
    <p class="step-note">Los locales ganan algo de nivel en sus batallas. Una sede no puede repetirse hasta pasadas 2 temporadas.</p></div>`;
}

/* ---- calendario Red Bull ---- */
function rbGenerateSchedule(s, prevSeasons){
  const diy=daysInYear(s.year);
  const taken=new Set(seasonEvents(s).map(e=>e.day));
  const order=shuffle(RB_ALL.map(x=>x.key));
  const start=25, end=300, step=(end-start)/(order.length-1);
  const events=order.map((k,i)=>{
    let d=Math.round(start+i*step+rnd(-6,6)); while(taken.has(d) || !isPrimeDay(s.year,d)) d++; taken.add(d);
    return {key:k, day:d, participants:[], seeds:[], bracket:null, champion:null, runnerUp:null, third:null, fourth:null, played:false};
  });
  let id=diy-rint(14,28); while(taken.has(id) || !isPrimeDay(s.year,id)) id--;
  s.rb={ events, drawn:false, interPodium:[],
    inter:{day:id, voteDay:id-7, sede:pickSede(recentSedes(prevSeasons,'rb')), voted:false, candidates:[], userVotes:[], votedIn:[],
           qualifiers:[], reasons:{}, bracket:null, champion:null, runnerUp:null, third:null, fourth:null, played:false} };
}
function rbEventsList(s){
  if(!rbOn(s)) return [];
  return [...s.rb.events.map(e=>({day:e.day, key:e.key})), {day:s.rb.inter.day, key:RB_INT.key}].sort((a,b)=>a.day-b.day);
}
function rbByDay(s){ const m={}; rbEventsList(s).forEach(e=>m[e.day]=e); return m; }
function rbEvent(s,k){ return k===RB_INT.key ? s.rb.inter : s.rb.events.find(e=>e.key===k); }

/* ---- sorteo de participantes ---- */
function probPick(sorted, n){
  if(sorted.length<=n) return sorted.map(f=>f.id);
  const chosen=[]; const taken=new Set(); let guard=0;
  while(chosen.length<n && guard++<50){
    for(const f of sorted){ if(chosen.length>=n) break; if(taken.has(f.id)) continue; if(Math.random()<RB_PARTICIPATION){ chosen.push(f.id); taken.add(f.id); } }
  }
  return chosen;
}
function rbPrevSeason(s){ const i=state.seasons.indexOf(s); return i>0 ? state.seasons[i-1] : null; }
function rbFirstPodium(){
  const ids=RB_FIRST_PODIUM.map(n=>state.freestylers.find(f=>f.name.toLowerCase()===n.toLowerCase())).filter(Boolean).map(f=>f.id);
  state.freestylers.slice().sort((a,b)=>b.fama-a.fama).forEach(f=>{ if(ids.length<3 && !ids.includes(f.id)) ids.push(f.id); });
  return ids;
}
function rbDraw(s){
  if(!rbOn(s) || s.rb.drawn) return;
  const prev=rbPrevSeason(s); const prevRB=rbOn(prev) ? prev.rb : null;
  s.rb.interPodium = (prevRB && prevRB.inter.played) ? [prevRB.inter.champion, prevRB.inter.runnerUp, prevRB.inter.third].filter(id=>id&&fby(id)) : rbFirstPodium();
  const isJal=id=>(fby(id)||{}).name==='Jaloner';
  s.rb.interPodium=s.rb.interPodium.filter(id=>!isJal(id));
  const used=new Set(s.rb.interPodium);
  const prevPodium0=k=>{ const e=prevRB && prevRB.events.find(x=>x.key===k); return e&&e.played ? [e.champion,e.runnerUp,e.third] : []; };
  // algunos no quieren ir a Red Bull esta temporada (salvo que ya estén clasificados por podio; Jaloner nunca va)
  { const seeded=new Set([...s.rb.interPodium, ...RB_ALL.flatMap(d=>prevPodium0(d.key))]);
    state.freestylers.forEach(f=>{ const p=RB_DECLINE[f.name]; if(!p) return; if(f.name!=='Jaloner' && seeded.has(f.id)) return; if(Math.random()<p) used.add(f.id); }); }
  const prevPodium=k=>{ const e=prevRB && prevRB.events.find(x=>x.key===k); return e&&e.played ? [e.champion,e.runnerUp,e.third] : []; };
  // EEUU y Centroamérica comparten cantera: un mismo freestyler puede ir a una u otra, nunca a las dos
  const shared=['rb_usa','rb_cen'];
  const elig=(def,f)=> shared.includes(def.key) ? shared.some(k=>rbdef(k).countries.includes(f.country)) : def.countries.includes(f.country);
  // primero los podios de todas las nacionales
  const seedsBy={};
  RB_NATS.forEach(def=>{ const sd=prevPodium(def.key).filter(id=>id && fby(id) && !used.has(id) && elig(def,fby(id))); sd.forEach(id=>used.add(id)); seedsBy[def.key]=sd; });
  // Torneo de Plazas (se sortea antes que las nacionales): un competidor por país, sin estrellas (como mucho 2 de +83 de fama).
  // El podio anterior entra directo y no cuenta para la regla de un país por edición.
  { const pev=rbEvent(s,RB_PLZ.key);
    const seeds=prevPodium(RB_PLZ.key).filter(id=>id && fby(id) && !used.has(id)); seeds.forEach(id=>used.add(id));
    const byCountry={}; state.freestylers.filter(f=>!used.has(f.id)).forEach(f=>{ (byCountry[f.country]=byCountry[f.country]||[]).push(f); });
    const need=16-seeds.length; const countries=shuffle(Object.keys(byCountry)); let starsLeft=Math.floor(Math.random()*3); const picked=[];
    for(const c of countries){ if(picked.length>=need) break;
      const list=byCountry[c].slice().sort((a,b)=>quality(b)-quality(a));
      const low=list.filter(f=>f.fama<=83), high=list.filter(f=>f.fama>83);
      let f=null;
      if(high.length && starsLeft>0 && Math.random()<0.35){ f=high[Math.floor(Math.random()*high.length)]; starsLeft--; }
      else if(low.length){ const top=low.slice(0, Math.max(3, Math.ceil(low.length*0.5))); f=top[Math.floor(Math.random()*top.length)]; }
      if(f){ picked.push(f.id); used.add(f.id); } }
    // si no hay países suficientes, se completa (sin estrellas) repitiendo país lo mínimo posible
    if(picked.length<need){ const extra=state.freestylers.filter(f=>!used.has(f.id) && f.fama<=83).sort((a,b)=>quality(b)-quality(a));
      const cnt={}; picked.forEach(id=>{ const c=fby(id).country; cnt[c]=(cnt[c]||0)+1; });
      extra.sort((a,b)=>(cnt[a.country]||0)-(cnt[b.country]||0)); for(const f of extra){ if(picked.length>=need) break; picked.push(f.id); used.add(f.id); cnt[f.country]=(cnt[f.country]||0)+1; } }
    pev.seeds=seeds; pev.participants=[...seeds, ...picked]; }
  const order=RB_NATS.filter(d=>!shared.includes(d.key));
  const sh=shuffle(RB_NATS.filter(d=>shared.includes(d.key)));
  // las dos compartidas eligen alternándose, para que ninguna se quede con todos los buenos
  order.forEach(def=>{
    const ev=rbEvent(s,def.key); const seeds=seedsBy[def.key];
    const pool=state.freestylers.filter(f=>elig(def,f) && !used.has(f.id)).sort((a,b)=>quality(b)-quality(a));
    const picked=probPick(pool, 16-seeds.length); picked.forEach(id=>used.add(id));
    ev.seeds=seeds; ev.participants=[...seeds, ...picked];
  });
  sh.forEach(def=>{ const ev=rbEvent(s,def.key); ev.seeds=seedsBy[def.key]; ev.participants=[...ev.seeds]; });
  let guard=0;
  while(sh.some(def=>rbEvent(s,def.key).participants.length<16) && guard++<400){
    let progress=false;
    for(const def of sh){
      const ev=rbEvent(s,def.key); if(ev.participants.length>=16) continue;
      const pool=state.freestylers.filter(f=>elig(def,f) && !used.has(f.id)).sort((a,b)=>quality(b)-quality(a));
      const pk=probPick(pool,1); if(pk.length){ ev.participants.push(pk[0]); used.add(pk[0]); progress=true; }
    }
    if(!progress) break;
  }
  // si algún torneo no llega a 16 (cantera muy corta), se completa con libres
  [...s.rb.events].forEach(ev=>{
    if(ev.participants.length>=16) return;
    const near=['México','Venezuela','Colombia','Cuba','Puerto Rico','República Dominicana','Panamá','Costa Rica'];
    const pref=f=> (ev.key==='rb_usa'||ev.key==='rb_cen') && near.includes(f.country) ? 1 : 0;
    const extra=state.freestylers.filter(f=>!used.has(f.id)).sort((a,b)=>pref(b)-pref(a) || quality(b)-quality(a));
    while(ev.participants.length<16 && extra.length){ const f=extra.shift(); ev.participants.push(f.id); used.add(f.id); }
  });
  s.rb.drawn=true;
  addLog(s, 0, `Red Bull anuncia sus ${RB_ALL.length} torneos clasificatorios. Internacional en <b>${s.rb.inter.sede}</b> (${fmtDay(s.year,s.rb.inter.day)}).`, 'rb');
}

/* ---- eliminatorias ---- */
function runKnockout(ids, bonus, vmult){
  const rounds=[]; const r0=[];
  for(let i=0;i<ids.length;i+=2) r0.push({a:ids[i], b:ids[i+1], result:null});
  rounds.push(r0);
  let semis=[];
  while(true){
    const r=rounds[rounds.length-1];
    r.forEach(m=> simulateBattle(m, bonus));
    if(r.length===2) semis=r.map(m=>m.result.loser);
    if(r.length===1) break;
    const nx=[]; for(let i=0;i<r.length;i+=2) nx.push({a:r[i].result.winner, b:r[i+1].result.winner, result:null});
    rounds.push(nx);
  }
  const third={a:semis[0], b:semis[1], result:null}; simulateBattle(third, bonus);
  const fin=rounds[rounds.length-1][0];
  rounds.flat().concat([third]).forEach(m=>{ m.views=battleViews(m, vmult||1); });
  return {bracket:{rounds, third}, champion:fin.result.winner, runnerUp:fin.result.loser, third:third.result.winner, fourth:third.result.loser};
}
const RB_DECLINE={'Jaloner':1, 'Walls':0.9, 'Piezas':0.9, 'Wos':0.8, 'Trueno':0.8, 'Duki':0.8, 'Lit Killah':0.8, 'ChysteMC':0.8, 'Dani Ribba':0.8, 'Khan':0.8, 'Papo':0.7, 'Bnet':0.7, 'Acru':0.7, 'TiagoPZK':0.7};
function sedeBonus(sede){ return sede ? (id=> { const f=fby(id); if(!f) return 0; return (f.country===sede ? LOCAL_BONUS : 0) + (sede==='México' && f.name==='Aczino' ? 10 : 0); }) : null; }
function uqLocalismo(s, ids, sede, comp, d, champ){ const ac=state.freestylers.find(f=>f.name==='Aczino'); if(sede!=='México' || !ac || champ!==ac.id) return;
  uqPush(s, {day:d+1, type:'local', comp, fid:ac.id, ids:ids.slice()}); }
function addFama(id, d){ const f=fby(id); if(f) f.fama=Math.round(clamp(f.fama+d,5,99)); }

function runRBEvent(s, ev, d){
  if(!s.rb.drawn) rbDraw(s);
  const r=runKnockout(ev.order||shuffle(ev.participants), null, 0.8*0.8*(ev.key===RB_PLZ.key?1:1.1));
  Object.assign(ev, r, {played:true});
  addFama(r.champion,5); addFama(r.runnerUp,2); addFama(r.third,1);
  const hn=finalHype(r.champion, r.runnerUp, false);
  addLog(s, d, `🔴 <b>${fname(r.champion)}</b> gana la ${rbdef(ev.key).name} ante ${fname(r.runnerUp)} y va al Internacional.${hn}`, 'rb');
}

/* ---- votación de comodines ---- */
function rbCandidates(s){ return RB_NATS.map(n=>rbEvent(s,n.key)).filter(e=>e.played).map(e=>e.runnerUp); }
function rbNeedsVote(s, d){ return rbOn(s) && !s.rb.inter.voted && d>=s.rb.inter.voteDay; }
function showRBVote(){
  const s=cur(); if(!rbNeedsVote(s, s.day)) return;
  const cands=rbCandidates(s); const votes=state.ui.rbVotes||(state.ui.rbVotes=[]);
  const from=id=> rbdef(RB_NATS.map(n=>rbEvent(s,n.key)).find(e=>e.runnerUp===id).key).short;
  openModal(`<h3>Votación · ${RB_INT.name}</h3>
    <p class="step-note" style="margin-bottom:12px;">Estos son los subcampeones de cada nacional. Tres irán al Internacional (${s.rb.inter.sede}, ${fmtDay(s.year,s.rb.inter.day)}). Tus votos cuentan, pero la fama de cada uno pesa más.</p>
    <div class="vote-grid">${cands.map(id=>{ const f=fby(id); const on=votes.includes(id);
      return `<button class="vote-card ${on?'on':''}" onclick="toggleRBVote('${id}')" aria-pressed="${on}">
        <div class="vote-photo" style="${avatarDivStyle(f)}">${avatarContent(f)}</div>
        <div class="vote-name">${nameH(f)}</div><div class="vote-country">${esc(f.country)} · 2º RB ${from(id)}</div>
        ${on?'<span class="vote-check">✓</span>':''}</button>`; }).join('')}</div>
    <div class="modal-actions"><span class="step-note" style="margin-right:auto">Votos <b>${votes.length}</b>/3</span>
      <button class="btn primary" ${votes.length===3?'':'disabled'} onclick="confirmRBVote()">Enviar votos</button></div>`, 'vote');
}
function toggleRBVote(id){
  const v=state.ui.rbVotes||(state.ui.rbVotes=[]); const i=v.indexOf(id);
  if(i>=0) v.splice(i,1); else if(v.length<3) v.push(id); else { toast('Ya tienes 3 votos. Quita uno para cambiarlo.'); return; }
  showRBVote();
}
function rbResolveVote(s, userVotes){
  const I=s.rb.inter; const cands=rbCandidates(s);
  // siempre pasan los 3 con más fama, se vote lo que se vote
  const chosen=shuffle(cands.slice()).sort((a,b)=>fby(b).fama-fby(a).fama).slice(0,3);
  I.candidates=cands; I.userVotes=userVotes.slice(); I.votedIn=chosen; I.voted=true;
  // clasificados: 10 campeones + podio anterior + 3 votados
  const reasons={};
  s.rb.events.forEach(e=>{ if(e.played) reasons[e.champion]=`Campeón ${rbdef(e.key).name}`; });
  s.rb.interPodium.forEach((id,i)=>{ if(!reasons[id]) reasons[id]=`Podio del Internacional anterior (${i+1}º)`; });
  chosen.forEach(id=>{ if(!reasons[id]) reasons[id]='Votación (comodín)'; });
  const rest=cands.filter(id=>!reasons[id]).sort((a,b)=>fby(b).fama-fby(a).fama);
  while(Object.keys(reasons).length<16 && rest.length){ reasons[rest.shift()]='Plaza vacante (fama)'; }
  I.reasons=reasons; I.qualifiers=Object.keys(reasons).slice(0,16);
  addLog(s, s.day, `🗳️ Votación Red Bull: ${chosen.map(id=>'<b>'+fname(id)+'</b>').join(', ')} completan los 16 del Internacional.`, 'rb');
}
function confirmRBVote(){
  const s=cur(); const v=(state.ui.rbVotes||[]).slice(); if(v.length!==3) return;
  rbResolveVote(s, v); state.ui.rbVotes=[];
  const I=s.rb.inter;
  openModal(`<h3>Resultado de la votación</h3>
    <div class="vote-grid">${I.candidates.map(id=>{ const f=fby(id); const inn=I.votedIn.includes(id), mine=I.userVotes.includes(id);
      return `<div class="vote-card ${inn?'win':'out'}"><div class="vote-photo" style="${avatarDivStyle(f)}">${avatarContent(f)}</div>
      <div class="vote-name">${nameH(f)}</div><div class="vote-country">${esc(f.country)}${mine?' · tu voto':''}</div>${inn?'<span class="vote-check">✓</span>':''}</div>`; }).join('')}</div>
    <div class="modal-actions"><button class="btn" onclick="closeModal(); goto('redbull',{key:'${RB_INT.key}'})">Ver clasificados</button><button class="btn primary" onclick="closeModal(); render()">Seguir</button></div>`, 'vote');
}

function runRBInter(s, d){
  const I=s.rb.inter;
  if(!I.voted) rbResolveVote(s, []);
  const r=runKnockout(I.order||shuffle(I.qualifiers), sedeBonus(I.sede), 2.2*0.4); { const fin=r.bracket.rounds[r.bracket.rounds.length-1][0]; fin.views=Math.round(fin.views*1.15); }
  Object.assign(I, r, {played:true}); uqViral(s, r.bracket, 'rb', d); uqLocalismo(s, I.qualifiers, I.sede, 'rb', d, r.champion);
  addFama(r.champion,10); addFama(r.runnerUp,4); addFama(r.third,2);
  const hn=finalHype(r.champion, r.runnerUp, true);
  const loc=fby(r.champion).country===I.sede ? ' ¡Gana el local!' : '';
  addLog(s, d, `🏆 <b>${fname(r.champion)}</b> campeón de la ${RB_INT.name} en ${I.sede} ante ${fname(r.runnerUp)}.${loc}${hn}`, 'rb');
}

/* ---- vistas ---- */
function rbStatus(s, ev){ return ev.played ? `<span class="status done">Jugada</span>` : (s.phase==='live'&&ev.day>=s.day||s.phase==='pre' ? `<span class="status pending">${fmtDay(s.year,ev.day)}</span>` : `<span class="status pending">—</span>`); }
function renderRedBull(){
  const s=cur(); const key=state.view.params.key;
  if(!rbOn(s)) return `<div class="detail-head"><h1>Red Bull Batalla</h1></div><div class="empty-state"><span class="big">Desde la próxima temporada</span>Esta partida empezó antes de que existiera Red Bull. Aparecerá al preparar la siguiente temporada.</div>`;
  if(key) return key===RB_INT.key ? renderRBInter(s) : renderRBEvent(s, key);
  const I=s.rb.inter;
  let h=`<div class="detail-head"><img class="rb-mark" src="${RB_LOGO}" alt="Red Bull Batalla"><h1>Red Bull Batalla ${s.year}</h1></div>`;
  if(s.phase==='live' && rbNeedsVote(s,s.day)) h+=`<div class="banner">La votación de comodines está abierta.&nbsp;<button class="btn small primary" onclick="showRBVote()">Votar</button></div>`;
  h+=`<div class="step rb-inter-card" onclick="goto('redbull',{key:'${RB_INT.key}'})">
    <div style="display:flex;align-items:center;gap:10px;font-weight:700;">${rbDot(RB_INT.key)} ${RB_INT.name}<span class="top-spacer"></span>${rbStatus(s,I)}</div>
    <div class="hype-row" style="justify-content:space-between;"><span>📍 Sede: <b style="text-align:left">${I.sede}</b></span><span>${I.played?'🏆 '+fnameH(I.champion):'Votación: '+fmtDay(s.year,I.voteDay)}</span></div></div>
  <div class="section-title"><h2>Clasificatorios</h2></div>
  <div class="league-toggle-grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));">${s.rb.events.slice().sort((a,b)=>a.day-b.day).map(ev=>`
    <div class="step" style="cursor:pointer" onclick="goto('redbull',{key:'${ev.key}'})">
      <div style="display:flex;align-items:center;gap:8px;font-weight:700;">${rbDot(ev.key)} ${rbdef(ev.key).name}<span class="top-spacer"></span>${rbStatus(s,ev)}</div>
      <div class="hype-row" style="justify-content:space-between;"><span>${ev.played?'Campeón: <b style="text-align:left">'+fnameH(ev.champion)+'</b>':(s.rb.drawn?`${ev.participants.length} participantes · ${ev.seeds.length} por podio`:'Participantes al iniciar temporada')}</span></div>
    </div>`).join('')}</div>
  <p class="step-note" style="margin-top:12px;">Cada campeón va al Internacional, junto al podio del último Internacional (que no juega nacionales) y 3 subcampeones elegidos por votación. El Torneo de Plazas reúne a uno por país de los que se quedaron fuera.</p>`;
  return h;
}
function rbBracketHtml(ev){
  const names=['Octavos','Cuartos','Semifinal','Final'];
  return `<div class="bracket-scroll"><div class="bracket">${ev.bracket.rounds.map((r,ri)=>`<div class="round"><div class="rlabel">${names[ri]}</div>${r.map(m=>bm(m)).join('')}</div>`).join('')}
  <div class="round"><div class="rlabel">3er puesto</div>${bm(ev.bracket.third)}</div></div></div>
  <div class="podium3">
    <div class="podium-card p1"><div class="medal">1º</div><div class="pname">${fnameH(ev.champion)}</div><div class="plabel">Campeón</div></div>
    <div class="podium-card p2"><div class="medal">2º</div><div class="pname">${fnameH(ev.runnerUp)}</div><div class="plabel">Subcampeón</div></div>
    <div class="podium-card p3"><div class="medal">3º</div><div class="pname">${fnameH(ev.third)}</div><div class="plabel">Tercer puesto</div></div>
  </div>`;
}
function rbPeopleGrid(ids, tagFn){
  return `<div class="fl-grid">${ids.map(id=>{ const f=fby(id); const tag=tagFn?tagFn(id):'';
    return `<div class="fl-card" onclick="showFreestyler('${id}')"><div class="fl-avatar" style="${avatarDivStyle(f)}">${avatarContent(f)}</div>
    <div style="min-width:0;"><div class="fname">${nameH(f)}</div><div class="fcountry">${esc(f.country)}${tag}</div></div>
    <div class="pick-stats">Nivel <b>${f.nivel}</b><br>Fama <b>${f.fama}</b><br>Hype <b>${f.hype!=null?Math.round(f.hype):'—'}</b></div></div>`; }).join('')}</div>`;
}
function renderRBEvent(s, key){
  const ev=rbEvent(s,key); const def=rbdef(key);
  let h=`<div class="back-link" onclick="goto('redbull')">‹ Red Bull</div><div class="detail-head"><img class="rb-mark" src="${RB_LOGO}" alt="Red Bull Batalla"><h1>${def.name} ${s.year}</h1></div>
  <div class="banner">${fmtDay(s.year,ev.day)} · 16 freestylers, eliminación directa. ${key===RB_PLZ.key?'Un freestyler por país, sin grandes estrellas (el podio anterior entra directo y no cuenta).':((key==='rb_usa'||key==='rb_cen')?`Pueden entrar freestylers de EEUU y de Centroamérica (cada uno solo a una de las dos).`:`Pueden entrar: ${def.countries.join(', ')}.`)} El campeón va al Internacional.</div>`;
  if(ev.played) h+=rbBracketHtml(ev);
  h+=`<div class="section-title"><h2>Participantes</h2></div>`;
  if(!s.rb.drawn) return h+`<div class="step-note">Se anuncian al empezar la temporada.</div>`;
  return h+rbPeopleGrid(ev.participants, id=> ev.seeds.includes(id)?' <span class="tag-mini rb-seed">Podio '+(s.year-1)+'</span>':'');
}
function renderRBInter(s){
  const I=s.rb.inter;
  let h=`<div class="back-link" onclick="goto('redbull')">‹ Red Bull</div><div class="detail-head"><img class="rb-mark" src="${RB_LOGO}" alt="Red Bull Batalla"><h1>${RB_INT.name} ${s.year}</h1></div>
  <div class="banner">📍 ${I.sede} · ${fmtDay(s.year,I.day)}. Los freestylers de ${I.sede} juegan como locales (+${LOCAL_BONUS} de nivel en sus batallas).</div>`;
  if(I.played) h+=rbBracketHtml(I);
  if(I.voted){
    h+=`<div class="section-title"><h2>Clasificados</h2></div>`+rbPeopleGrid(I.qualifiers, id=>`<br><span class="tag-mini rb-seed">${esc(I.reasons[id])}</span>${fby(id).country===I.sede?' <span class="tag-mini rb-local">Local</span>':''}`);
    h+=`<div class="section-title"><h2>Votación</h2></div><p class="step-note">Tus votos: ${I.userVotes.length?I.userVotes.map(fnameH).join(', '):'no votaste'}. Elegidos: ${I.votedIn.map(fnameH).join(', ')}.</p>`;
  } else {
    h+=`<div class="section-title"><h2>Ya clasificados</h2></div>`;
    const champs=s.rb.events.filter(e=>e.played);
    const ids=[...s.rb.interPodium, ...champs.map(e=>e.champion)];
    if(!s.rb.drawn) h+=`<p class="step-note">Podio del último Internacional (clasificado directo): ${(rbPrevSeason(s)&&rbOn(rbPrevSeason(s))&&rbPrevSeason(s).rb.inter.played?[rbPrevSeason(s).rb.inter.champion,rbPrevSeason(s).rb.inter.runnerUp,rbPrevSeason(s).rb.inter.third]:rbFirstPodium()).map(fnameH).join(', ')}.</p>`;
    else h+=rbPeopleGrid(ids, id=> s.rb.interPodium.includes(id)?' <span class="tag-mini rb-seed">Podio anterior</span>':' <span class="tag-mini rb-seed">Campeón '+rbdef(champs.find(e=>e.champion===id).key).short+'</span>');
    h+=`<p class="step-note" style="margin-top:10px;">Faltan ${16-ids.length} plazas: ${Math.max(0,10-champs.length)} campeones por decidir y 3 comodines por votación (${fmtDay(s.year,I.voteDay)}).</p>`;
    if(s.phase==='live' && rbNeedsVote(s,s.day)) h+=`<button class="btn primary" onclick="showRBVote()">Votar ahora</button>`;
  }
  return h;
}

