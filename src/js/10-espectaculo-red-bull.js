/* =========================================================================
   ESPECTÁCULO RED BULL: sorteo animado del cuadrante y combates
========================================================================= */
const SHOW_SPEEDS = { lenta:{label:'Lenta', reveal:4000, k:1.5}, normal:{label:'Normal', reveal:1400, k:1}, rapida:{label:'Rápida', reveal:450, k:0.4} };
const SH = {CW:128, CH:36, GAP:18, H:470};
SH.W = 7*SH.CW + 6*SH.GAP;
const SH_C = {champ:96, finA:196, finB:242, thA:352, thB:398};
let SHOW = null;
function shSpeed(){ return SHOW_SPEEDS.normal; }
function shWait(ms){ return new Promise(r=>setTimeout(r, ms)); }
function shColX(c){ return c*(SH.CW+SH.GAP); }
function shOctY(i){ return 56 + i*44 + Math.floor(i/2)*12; }
function shQY(j){ return (shOctY(2*j)+shOctY(2*j+1))/2; }
function shSY(k){ return (shQY(2*k)+shQY(2*k+1))/2; }
function shPos(slot){
  const [r, side, i] = slot.split(':'); const L = side==='L'; const n=+i;
  if(r==='o') return {x:shColX(L?0:6), y:shOctY(n)};
  if(r==='q') return {x:shColX(L?1:5), y:shQY(n)};
  if(r==='s') return {x:shColX(L?2:4), y:shSY(n)};
  const y={fA:SH_C.finA, fB:SH_C.finB, tA:SH_C.thA, tB:SH_C.thB, c:SH_C.champ}[r];
  return {x:shColX(3), y};
}
function shIdxSlot(i){ return i<8 ? 'o:L:'+i : 'o:R:'+(i-8); }
function shStage(){ return document.getElementById('shStage'); }
function shChip(id, slot, cls){
  const p=shPos(slot); const f=fby(id); const el=document.createElement('div');
  el.className='sh-chip '+(cls||''); el.dataset.slot=slot;
  el.style.left=p.x+'px'; el.style.top=p.y+'px';
  const local = SHOW && SHOW.sede && f && f.country===SHOW.sede;
  el.innerHTML=`${miniAvatar(id,24)}<span class="sh-name">${nameH(f)}</span>${local?'<span class="sh-local" title="Local">LOC</span>':''}`;
  shStage().appendChild(el); return el;
}
function shGet(slot){ const all=shStage().querySelectorAll('.sh-chip'); let last=null; all.forEach(e=>{ if(e.dataset.slot===slot) last=e; }); return last; }
function shLinesSvg(){
  const {CW,CH,GAP}=SH; const h=CH/2; let d='';
  const elbow=(x1,y1,x2,y2)=>{ const xm=(x1+x2)/2; d+=`M${x1} ${y1+h}H${xm}V${y2+h}H${x2}`; };
  for(let j=0;j<4;j++){ elbow(shColX(0)+CW, shOctY(2*j), shColX(1), shQY(j)); elbow(shColX(0)+CW, shOctY(2*j+1), shColX(1), shQY(j));
    elbow(shColX(6), shOctY(2*j), shColX(5)+CW, shQY(j)); elbow(shColX(6), shOctY(2*j+1), shColX(5)+CW, shQY(j)); }
  for(let k=0;k<2;k++){ elbow(shColX(1)+CW, shQY(2*k), shColX(2), shSY(k)); elbow(shColX(1)+CW, shQY(2*k+1), shColX(2), shSY(k));
    elbow(shColX(5), shQY(2*k), shColX(4)+CW, shSY(k)); elbow(shColX(5), shQY(2*k+1), shColX(4)+CW, shSY(k)); }
  elbow(shColX(2)+CW, shSY(0), shColX(3), SH_C.finA); elbow(shColX(2)+CW, shSY(1), shColX(3), SH_C.finA);
  elbow(shColX(4), shSY(0), shColX(3)+CW, SH_C.finB); elbow(shColX(4), shSY(1), shColX(3)+CW, SH_C.finB);
  const labels=['Octavos','Cuartos','Semis','Final','Semis','Cuartos','Octavos'].map((t,c)=>`<text x="${shColX(c)+CW/2}" y="24" text-anchor="middle">${t}</text>`).join('');
  return `<svg class="sh-lines" width="${SH.W}" height="${SH.H}" viewBox="0 0 ${SH.W} ${SH.H}" aria-hidden="true"><path d="${d}"/>${labels}
    <text x="${shColX(3)+CW/2}" y="${SH_C.champ-8}" text-anchor="middle" class="gold">🏆 Campeón</text>
    <text x="${shColX(3)+CW/2}" y="${SH_C.thA-8}" text-anchor="middle">3er puesto</text></svg>`;
}
function shFit(){
  const wrap=document.getElementById('shWrap'); const st=shStage(); if(!wrap||!st) return;
  const top=wrap.getBoundingClientRect().top + (document.getElementById('rbShow').querySelector('.rbs').scrollTop||0);
  const k=Math.min(wrap.clientWidth/SH.W, Math.max(0.3,(window.innerHeight-top-(window.innerHeight<500?64:96))/SH.H), 1.3);
  st.style.transform=`scale(${k})`; wrap.style.height=Math.ceil(SH.H*k)+'px';
}
function shSpeedBtns(){
  return Object.entries(SHOW_SPEEDS).map(([k,v])=>`<button class="seg ${(state.ui.showSpeed||'lenta')===k?'on':''}" onclick="state.ui.showSpeed='${k}'; shPaintSpeed()">${v.label}</button>`).join('');
}
function shPaintSpeed(){ const el=document.getElementById('shSpeed'); if(el) el.innerHTML=shSpeedBtns(); }
function shSetBottom(html){ const el=document.getElementById('shBottom'); if(el) el.innerHTML=html; }
function shStatus(t){ const el=document.getElementById('shStatus'); if(el) el.innerHTML=t; }

function isUnder(key){ return /^u_/.test(key||''); }
function showEv(s,key){ return key===INTL.key ? s.intl : (isUnder(key) ? (s.under||[]).find(e=>e.key===key) : rbEvent(s,key)); }
function showName(key){ return key===INTL.key ? INTL.name : (isUnder(key) ? udef(key).name : rbdef(key).name); }
function showLogo(key){ return key===INTL.key ? LOGOS.fms_internacional : (isUnder(key) ? (ulogo(key)||RB_LOGO) : RB_LOGO); }
function openRBShow(key){
  const s=cur(); const ev=showEv(s,key); let ids;
  if(key===INTL.key){
    if(!ev.order){ const q=intlQualifiers(s); ev.qualifiers=q.ids; ev.note=q.note; ev.order=shuffle(q.ids); }
    ids=ev.qualifiers;
  } else if(isUnder(key)){
    if(!ev.participants || ev.participants.length!==16) underDraw(ev);
    ids=ev.participants; if(!ev.order || ev.order.length!==16) ev.order=shuffle(ids);
  } else {
    if(!s.rb.drawn) rbDraw(s);
    if(key===RB_INT.key && !ev.voted) rbResolveVote(s, []);
    ids = key===RB_INT.key ? ev.qualifiers : ev.participants;
    if(!ev.order || ev.order.length!==ids.length) ev.order=shuffle(ids);
  }
  save();
  SHOW={kind:'ko', key, tok:1, phase:'reveal', sede: (key===RB_INT.key||key===INTL.key) ? ev.sede : null};
  let root=document.getElementById('rbShow');
  if(!root){ root=document.createElement('div'); root.id='rbShow'; document.body.appendChild(root); }
  themeEl(root, key);
  root.innerHTML=`<div class="rbs ${key===INTL.key?'fms':''}" ${isUnder(key)?`style="background:radial-gradient(ellipse at top, color-mix(in srgb, ${udef(key).color} 55%, #07070c) 0%, #07070c 62%)"`:''} role="dialog" aria-label="${showName(key)}">
    <div class="rbs-top"><img class="rb-mark sm ${key===INTL.key?'fm-logo':''}" src="${showLogo(key)}" alt=""><div style="min-width:0"><div class="rbs-title">${showName(key)} ${s.year}</div>
      <div class="rbs-sub">${fmtDay(s.year,ev.day??ev.date)}${SHOW.sede?' · 📍 '+SHOW.sede+' (locales +'+LOCAL_BONUS+' de nivel)':''} · cruces por sorteo</div></div>
      <span class="top-spacer"></span><button class="btn small ghost" onclick="shSkip()">Saltar</button></div>
    <div class="rbs-rotate">Gira el móvil para ver el cuadrante más grande.</div>
    <div class="rbs-wrap" id="shWrap"><div class="rbs-stage" id="shStage" style="width:${SH.W}px;height:${SH.H}px">${shLinesSvg()}</div></div>
    <div class="rbs-status" id="shStatus">Sorteo de cruces…</div>
    <div class="rbs-bottom" id="shBottom"></div></div>`;
  shFit(); window.addEventListener('resize', shFit);
  shReveal(SHOW.tok);
}
async function shReveal(tok){
  const ev=showEv(cur(),SHOW.key);
  for(let i=0;i<16;i++){
    if(!SHOW||tok!==SHOW.tok) return;
    const sp=shSpeed(); const el=shChip(ev.order[i], shIdxSlot(i), 'rev'+(i>=8?' r':''));
    el.style.animationDuration=sp.reveal+'ms';
    el.addEventListener('animationend', ()=>{ el.classList.remove('rev','r'); el.style.animationDuration=''; }, {once:true});
    shStatus(`Sorteo · ${i<8?'lado izquierdo':'lado derecho'} · ${i+1}/16`);
    await shWait(sp.reveal*0.8);
  }
  if(!SHOW||tok!==SHOW.tok) return;
  await shWait(300); shChoose();
}
function shChoose(){
  SHOW.phase='choose'; shStatus('Cuadrante listo.');
  shSetBottom(`<button class="btn" onclick="shStart('sim')">Simular todo</button><button class="btn primary" onclick="shStart('ver')">Ver la competencia</button>`);
}
function shClearChips(){ shStage().querySelectorAll('.sh-chip').forEach(e=>e.remove()); }
function shSkip(){
  if(!SHOW) return; SHOW.tok++;
  const ev=showEv(cur(),SHOW.key);
  if(SHOW.phase==='reveal'){ shClearChips(); ev.order.forEach((id,i)=>shChip(id, shIdxSlot(i))); shChoose(); }
  if(SHOW.phase==='choose'){ shStage().querySelectorAll('.sh-chip').forEach(e=>{ e.classList.remove('rev','r'); e.style.animationDuration=''; }); }
  else if(SHOW.phase==='play'){ shFinal(); }
}
function shStart(mode){
  shStage().querySelectorAll('.sh-chip').forEach(e=>{ e.classList.remove('rev','r'); e.style.animationDuration=''; });
  const s=cur(); const ev=showEv(s,SHOW.key);
  shSetBottom('');
  ev.presented=true;
  advance('day');            // juega el día (resultados ya decididos)
  if(!ev.played){ closeRBShow(); return; }
  if(mode==='sim') shFinal(); else { SHOW.phase='play'; shPlay(++SHOW.tok); }
}
function shFinal(){
  const ev=showEv(cur(),SHOW.key); const B=ev.bracket, R=B.rounds;
  SHOW.phase='done'; shClearChips();
  ev.order.forEach((id,i)=> shChip(id, shIdxSlot(i), R[0][Math.floor(i/2)].result.loser===id?'lost':''));
  R[0].forEach((m,mi)=>{ const w=m.result.winner; shChip(w, 'q:'+(mi<4?'L':'R')+':'+(mi%4), R[1][Math.floor(mi/2)].result.loser===w?'lost':''); });
  R[1].forEach((m,qi)=>{ const w=m.result.winner; shChip(w, 's:'+(qi<2?'L':'R')+':'+(qi%2), R[2][Math.floor(qi/2)].result.loser===w?'lost':''); });
  R[2].forEach((m,si)=>{ shChip(m.result.winner, si?'fB':'fA', R[3][0].result.loser===m.result.winner?'lost':''); shChip(m.result.loser, si?'tB':'tA', B.third.result.winner===m.result.loser?'bronze':'lost'); });
  shChip(R[3][0].result.winner, 'c', 'champ');
  shDone();
}
function shDone(){
  const ev=showEv(cur(),SHOW.key); SHOW.phase='done';
  shStatus(`🏆 <b>${fnameH(ev.champion)}</b> gana la ${showName(SHOW.key)}${(SHOW.key===RB_INT.key||SHOW.key===INTL.key)?'':(isUnder(SHOW.key)?' (+5 de hype)':' y va al Internacional')}.`);
  shSetBottom(`<button class="btn primary" onclick="shContinue()">Continuar</button>`);
}
function closeRBShow(){
  if(SHOW) SHOW.tok++; SHOW=null; window.removeEventListener('resize', shFit);
  const root=document.getElementById('rbShow'); if(root) root.innerHTML='';
  render();
}
async function shMove(id, from, to, cls){
  const c=shChip(id, from, 'moving '+(cls||'')); c.dataset.slot=to;
  c.getBoundingClientRect();
  const k=shSpeed().k; c.style.transitionDuration=(800*k)+'ms';
  const p=shPos(to); c.style.left=p.x+'px'; c.style.top=p.y+'px';
  await shWait(850*k); c.classList.remove('moving'); return c;
}
async function shPlay(tok){
  const ev=showEv(cur(),SHOW.key); const B=ev.bracket, R=B.rounds;
  const alive=()=> SHOW && tok===SHOW.tok;
  const match=async(m, aSlot, bSlot, label, winTo, loseTo, winCls)=>{
    if(!alive()) return false;
    shStatus(label);
    const ea=shGet(aSlot), eb=shGet(bSlot);
    ea.classList.add('fight'); eb.classList.add('fight');
    await shWait(800*shSpeed().k); if(!alive()) return false;
    const wSlot = m.result.winner===m.a ? aSlot : bSlot, lSlot = wSlot===aSlot ? bSlot : aSlot;
    const ew=shGet(wSlot), el=shGet(lSlot);
    ea.classList.remove('fight'); eb.classList.remove('fight');
    ew.classList.add('won'); el.classList.add('lost');
    if(m.result.tiebreak){ const t=document.createElement('span'); t.className='sh-rep'; t.textContent='réplica'; ew.appendChild(t); }
    await shWait(1100*shSpeed().k); if(!alive()) return false;
    const moves=[];
    if(winTo) moves.push(shMove(m.result.winner, wSlot, winTo, winCls));
    if(loseTo) moves.push(shMove(m.result.loser, lSlot, loseTo));
    await Promise.all(moves);
    return alive();
  };
  for(let mi=0; mi<8; mi++){ const side=mi<4?'L':'R', j=mi%4;
    if(!await match(R[0][mi], `o:${side}:${2*j}`, `o:${side}:${2*j+1}`, `Octavos · combate ${mi+1}/8`, `q:${side}:${j}`)) return; }
  for(let qi=0; qi<4; qi++){ const side=qi<2?'L':'R', j=qi%2;
    if(!await match(R[1][qi], `q:${side}:${2*j}`, `q:${side}:${2*j+1}`, `Cuartos · combate ${qi+1}/4`, `s:${side}:${j}`)) return; }
  for(let si=0; si<2; si++){ const side=si?'R':'L';
    if(!await match(R[2][si], `s:${side}:0`, `s:${side}:1`, `Semifinal ${si+1}/2`, si?'fB':'fA', si?'tB':'tA')) return; }
  if(!await match(B.third, 'tA', 'tB', 'Tercer y cuarto puesto', null, null)) return;
  shGet(B.third.result.winner===B.third.a?'tA':'tB').classList.add('bronze');
  if(!await match(R[3][0], 'fA', 'fB', '🔥 Gran final', 'c', null, 'champ')) return;
  shDone();
}

