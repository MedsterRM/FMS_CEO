/* =========================================================================
   COMPETICIONES UNDER (externas, entre semana, pocas visitas)
========================================================================= */
const UNDER_DEFS = [
  {key:'u_cuna',  name:'Cuna de Oro',       short:'CDO', countries:['Argentina'], famaMax:85, color:'#C9A227'},
  {key:'u_gr',    name:'General Rap',       short:'GR',  countries:['España'],    famaMax:83, color:'#2E86DE'},
  {key:'u_bdm',   name:'BDM Internacional', short:'BDM', countries:null,          famaMax:83, perCountry:true, color:'#B03A2E'},
  {key:'u_chess', name:'Chess Battle',      short:'CHS', countries:['México'],    famaMax:85, exc:['Rapder'], color:'#16A085'},
  {key:'u_dem',   name:'DEM Battles',       short:'DEM', countries:['Chile'],     famaMax:85, color:'#7D3C98'},
];
const MFU = {key:'u_mfu', name:'Monster Fu', short:'MFU', color:'#6AB04C'};
const UNDER_EXC = ['Teorema','El Menor','Acru','Dyse','Alek','Segrelles','Dalia','Mr. Ego','Kodigo','HDR','Abel','Mecha','Naista','MP','Stick','Replik','NQP','Fat N','Dani VK','Tirpa','Anubis','Bélico','Jesse Pungaz','Exe','Sophia','Kmbra','Nez','Rodamiento','Joqerr','Fabiuki','CTZ','Tata','Fat Tony','Potencia'];
const UNDER_RARE = ['El Menor','Acru'];
function ulogo(key){ return (typeof EXTRA_IMG!=='undefined' && EXTRA_IMG[key]) || null; }
function udef(key){ return key===MFU.key ? MFU : UNDER_DEFS.find(d=>d.key===key); }
function isWeekday(y,d){ const w=dayToDate(y,d).getUTCDay(); return w>=1 && w<=5; }
function underGenerate(s, from){
  const y=s.year, diy=daysInYear(y); from=from||0;
  const busy=new Set([...rbEventsList(s).map(e=>e.day), ...seasonEvents(s).map(e=>e.day)]); if(rbOn(s)) busy.add(s.rb.inter.voteDay);
  const pickDay=m=>{ const days=[]; for(let d=Math.max(from,0); d<diy; d++){ if(monthOf(y,d)===m && isWeekday(y,d) && !busy.has(d) && !busy.has(d-1) && !busy.has(d+1)) days.push(d); } if(!days.length) return null; const d=days[Math.floor(Math.random()*days.length)]; busy.add(d); return d; };
  const months=shuffle([...Array(11).keys()].map(x=>x+1)).filter(m=>monthOf(y,Math.max(from,0))<=m);
  const ev=[]; let mi=0;
  UNDER_DEFS.forEach(def=>{ while(mi<months.length){ const d=pickDay(months[mi++]); if(d!=null){ ev.push({key:def.key, day:d, played:false}); break; } } });
  const mm=shuffle([...Array(12).keys()].filter(m=>monthOf(y,Math.max(from,0))<=m)); let n=0;
  for(const m of mm){ if(n>=3) break; const d=pickDay(m); if(d!=null){ ev.push({key:MFU.key, day:d, played:false, n:++n}); } }
  s.under=ev.sort((a,b)=>a.day-b.day); let k=0; s.under.forEach(e=>{ if(e.key===MFU.key) e.n=++k; });
}
function underByDay(s){ const m={}; (s.under||[]).forEach(e=>m[e.day]=e); return m; }
function underEligible(f, def){
  if(UNDER_EXC.includes(f.name) || (def.exc && def.exc.includes(f.name))){ return UNDER_RARE.includes(f.name) ? Math.random()<0.1 : true; }
  return f.fama<=def.famaMax;
}
function underPick(list, n){ const sorted=list.slice().sort((a,b)=>quality(b)-quality(a)); const out=[]; const pool=sorted.slice();
  while(out.length<n && pool.length){ const i=Math.min(pool.length-1, Math.floor(Math.pow(Math.random(),1.6)*pool.length)); out.push(pool.splice(i,1)[0].id); } return out; }
function runUnder(s, ev, d){
  const def=udef(ev.key);
  if(ev.key===MFU.key){
    const es=state.freestylers.filter(f=>f.country==='España' && (f.fama<=83 || ['Sweet Pain','Zasko','Swit Eme'].includes(f.name) || UNDER_EXC.includes(f.name)) && f.name!=='Khan');
    const intl=state.freestylers.filter(f=>f.country!=='España' && f.fama<=83);
    const ni=rint(0,2); const ids=[...underPick(es, 10-ni), ...underPick(intl, ni)];
    const must=['Zasko','Sweet Pain'].map(n=>state.freestylers.find(f=>f.name===n)).filter(Boolean);
    if(must.length && !must.some(f=>ids.includes(f.id))){ const pickM=shuffle(must); const want=Math.random()<0.4 ? pickM : [pickM[0]];
      want.forEach(f=>{ const i=ids.findIndex(id=>!must.some(x=>x.id===id) && fby(id).country==='España'); if(i>=0) ids[i]=f.id; else ids.push(f.id); }); }
    const ord=shuffle(ids); ev.battles=[];
    for(let i=0;i+1<ord.length && ev.battles.length<5;i+=2){ const m={a:ord[i], b:ord[i+1], result:null}; simulateBattle(m, null); m.views=Math.round(rint(100000,1000000)*(isRival(m.a,m.b)?1.15:1)); addHype(m.result.winner,3); ev.battles.push(m); }
    ev.played=true; underTutQueue(ev.key, ev.battles.map(m=>m.result.winner)); addLog(s, d, `🟢 ${def.name} #${ev.n}: ${ev.battles.map(m=>fname(m.result.winner)).join(', ')} ganan sus batallas.`, 'rb'); return;
  }
  const ids=ev.order && ev.order.length===16 ? ev.order.slice() : underDraw(ev);
  const r=runKnockout(ev.order||shuffle(ids), null, 0.15);
  Object.assign(ev, r, {participants:ids, played:true});
  addHype(r.champion, 5); underTutQueue(ev.key, [r.champion]);
  addLog(s, d, `🟢 <b>${fname(r.champion)}</b> gana la ${def.name} ante ${fname(r.runnerUp)} (+5 de hype).`, 'rb');
}
function underDraw(ev){ const def=udef(ev.key); let ids;
  if(def.perCountry){ const by={}; state.freestylers.filter(f=>underEligible(f,def)).forEach(f=>{ (by[f.country]=by[f.country]||[]).push(f); });
    ids=shuffle(Object.keys(by)).slice(0,16).map(c=>underPick(by[c],1)[0]);
    if(ids.length<16){ const rest=state.freestylers.filter(f=>f.fama<=def.famaMax && !ids.includes(f.id)); ids.push(...underPick(rest,16-ids.length)); } }
  else ids=underPick(state.freestylers.filter(f=>def.countries.includes(f.country) && underEligible(f,def)), 16);
  if(ids.length<16){ ids.push(...underPick(state.freestylers.filter(f=>!ids.includes(f.id) && f.fama<=def.famaMax), 16-ids.length)); }
  ev.participants=ids; return ids;
}
function openMFU(day){
  const s=cur(); const ev=(s.under||[]).find(e=>e.key===MFU.key && e.day===day); if(!ev) return;
  ev.presented=true; advance('day'); if(!ev.played) return;
  state.ui.kov=ev.battles.map(m=>m.views||0); state.ui.kovMoney=false;
  const rows=ev.battles.map((m,i)=>{ const wa=m.result.winner===m.a;
    return `<div class="fm-srow"><div class="fm-sb"><span class="${wa?'w':'l'}">${fmFace(m.a)}${fnameH(m.a)}</span><span class="fm-sres">vs<small>gana ${fnameH(m.result.winner)}</small></span><span class="${wa?'l':'w'} r">${fnameH(m.b)}${fmFace(m.b)}</span></div>
      <div class="fm-views"><span class="fm-vn" id="kov${i}">—</span><button class="btn small" id="kob${i}" onclick="kovReveal(${i})">Revelar visitas</button></div></div>`; }).join('');
  openModal(`<h3>${ulogo(MFU.key)?`<img class="un-logo" src="${ulogo(MFU.key)}" alt="">`:''}${MFU.name} #${ev.n} · ${fmtDay(s.year,day)}</h3><p class="step-note">5 batallas sueltas. Cada ganador se lleva +3 de hype.</p>
    <div class="kov">${rows}</div><div class="fm-sum-foot" id="kovFoot"></div>
    <div class="modal-actions"><button class="btn" onclick="kovAll()">Revelar todas</button><button class="btn primary" onclick="closeModal(); render()">Seguir</button></div>`, true);
  themeEl(document.getElementById('modalRoot'), MFU.key);
}
function showUnder(key, day){
  const s=cur(); const ev=(s.under||[]).find(e=>e.key===key && e.day===day); if(!ev) return; const def=udef(key);
  let body='';
  if(!ev.played) body=`<p class="step-note">Se juega el ${fmtDay(s.year,ev.day)}. Es una competición externa: no puedes poner jornadas ese día.</p>`;
  else if(ev.battles) body=`<div class="tb-list">${ev.battles.map(m=>{ const wa=m.result.winner===m.a; return `<div class="tb-row"><div class="tb-faces"><span class="tb-face ${wa?'w':''}" style="${avatarDivStyle(fby(m.a))}">${avatarContent(fby(m.a))}</span><span class="tb-face ${wa?'':'w'}" style="${avatarDivStyle(fby(m.b))}">${avatarContent(fby(m.b))}</span></div><div class="tb-info"><div class="tb-names"><span class="${wa?'w':''}">${fnameH(m.a)}</span> <i>vs</i> <span class="${wa?'':'w'}">${fnameH(m.b)}</span></div><div class="tb-meta">gana ${fnameH(m.result.winner)}</div></div><div class="tb-views">${fmtViews(m.views)}<small>visitas</small></div></div>`; }).join('')}</div>`;
  else { const fin=ev.bracket.rounds[ev.bracket.rounds.length-1][0];
    body=`<div class="sum-row"><span>🏆 Campeón</span><b>${fnameH(ev.champion)}</b></div><div class="sum-row"><span>Subcampeón</span><span>${fnameH(ev.runnerUp)}</span></div><div class="sum-row"><span>3º</span><span>${fnameH(ev.third)}</span></div>
      <div class="sum-sec">Participantes</div><div class="un-people">${ev.participants.map(id=>`<span class="un-p">${miniAvatar(id,22)} ${fnameH(id)}</span>`).join('')}</div>`; }
  openModal(`<h3>${ulogo(key)?`<img class="un-logo" src="${ulogo(key)}" alt="">`:`<span class="un-dot" style="background:${def.color}"></span>`}${def.name}${ev.n?' #'+ev.n:''} ${s.year}</h3>${body}<div class="modal-actions"><button class="btn primary" onclick="closeModal()">Cerrar</button></div>`, true);
}

