/* =========================================================================
   ANIMACIÓN DEL CALENDARIO al avanzar ("Próxima fecha" / "Simular hasta fin de año")
========================================================================= */
let CAL_ANIM=null;
function nextStopDay(s, mode){
  const diy=daysInYear(s.year); const d0=s.day;
  if(mode==='year'){ const v=rbOn(s)&&!s.rb.inter.voted ? s.rb.inter.voteDay : null; return (v!=null && v>=d0) ? v : diy-1; }
  const days=[...seasonEvents(s).map(e=>e.day), ...rbEventsList(s).map(e=>e.day), ...((s.streams||[]).filter(x=>!x.done).map(x=>x.day)), ...((s.exEvents||[]).filter(x=>!x.done).map(x=>x.day)), ...((s.uq||[]).filter(x=>!x.done).map(x=>x.day)), ...((s.under||[]).filter(x=>!x.played).map(x=>x.day))];
  if(!s.uqInit) days.push(d0);
  s.activeKeys.forEach(k=>{ const L=s.leagues[k]; if(!L||L.finished||isWS(k)||L.played>=JORNADAS-1||(L.uaChk&&L.uaChk[L.played])) return; const nd=L.dates.slice().sort((a,b)=>a-b)[L.played]; if(nd!=null) days.push(Math.max(d0, nd-5)); });
  s.activeKeys.forEach(k=>{ const L=s.leagues[k]; if(!L||L.finished||!L.manual||L.confirmed[L.played]) return; const nd=L.dates.slice().sort((a,b)=>a-b)[L.played]; if(nd!=null) days.push(Math.max(d0, nd-PAIR_DEADLINE)); });
  if(rbOn(s)&&!s.rb.inter.voted) days.push(s.rb.inter.voteDay);
  const fut=days.filter(d=>d>=d0); return fut.length? Math.min(...fut) : diy-1;
}
function dayEventInfo(s, d){
  const e=eventsByDay(s)[d]; if(e) return {cls:'fms', color:ldef(e.key).badge, label:e.key===INTL.key?'INTL':ldef(e.key).short+' J'+e.j};
  const r=rbByDay(s)[d]; if(r) return {cls:'rb'+(r.key===RB_INT.key?' int':''), color:null, label:'RB '+rbdef(r.key).short};
  if(rbOn(s) && d===s.rb.inter.voteDay) return {cls:'vote', color:null, label:'Votación'};
  const u=underByDay(s)[d]; if(u) return {cls:'under', color:udef(u.key).color, label:udef(u.key).short};
  return null;
}
function animatedAdvance(mode){
  const s=cur(); if(s.phase!=='live' || CAL_ANIM) return;
  const target=nextStopDay(s, mode);
  if(target<=s.day){ advance(mode); return; }
  const y=s.year; const diy=daysInYear(y);
  let html=`<div class="ca" role="dialog" aria-label="Avanzando el calendario"><div class="ca-top"><div><div class="rbs-title">Calendario ${y}</div><div class="rbs-sub" id="caLbl">${fmtDay(y,s.day)}</div></div><span class="top-spacer"></span><button class="btn small ghost" onclick="caSkip()">Saltar</button></div><div class="ca-grid">`;
  for(let m=0;m<12;m++){
    const first=dateToDay(y,m,1), dim=new Date(Date.UTC(y,m+1,0)).getUTCDate(), lead=(dayToDate(y,first).getUTCDay()+6)%7;
    html+=`<div class="ca-m"><div class="ca-mt">${MESES[m]}</div><div class="ca-days">${DOW.map(x=>`<i>${x}</i>`).join('')}${'<span></span>'.repeat(lead)}`;
    for(let dd=1; dd<=dim; dd++){ const d=first+dd-1; const ev=dayEventInfo(s,d);
      html+=`<span id="ca${d}" class="ca-d ${d<s.day?'past':''} ${ev?'ev '+ev.cls:''} ${d===target?'target':''}" ${ev&&ev.color?`style="--ev:${ev.color}"`:''} title="${ev?esc(ev.label):''}">${dd}</span>`; }
    html+=`</div></div>`;
  }
  const tev=dayEventInfo(s,target);
  html+=`</div><div class="ca-next">${mode==='year'? (target===diy-1?'Simulando hasta el fin de año…':'Hasta la votación de Red Bull…') : `Próxima fecha: <b>${tev?esc(tev.label):'—'}</b> · ${fmtDay(y,target)}`}</div></div>`;
  let root=document.getElementById('calAnim'); if(!root){ root=document.createElement('div'); root.id='calAnim'; document.body.appendChild(root); }
  root.innerHTML=html;
  const span=target-s.day; const step=clamp((mode==='year'?4200:2000)/span, 12, 120);
  CAL_ANIM={mode, tok:Date.now(), d:s.day, target};
  const tok=CAL_ANIM.tok; let d=s.day;
  const tick=()=>{
    if(!CAL_ANIM || CAL_ANIM.tok!==tok) return;
    const prev=document.getElementById('ca'+d); if(prev){ prev.classList.remove('now'); prev.classList.add('past'); }
    d++; const el=document.getElementById('ca'+d);
    if(el){ el.classList.add('now'); if(d%7===0||d===target) el.scrollIntoView({block:'nearest'}); }
    const lb=document.getElementById('caLbl'); if(lb) lb.textContent=fmtDay(y,Math.min(d,diy-1));
    if(d>=target){ setTimeout(()=>caFinish(tok), 450); return; }
    setTimeout(tick, step);
  };
  const st=document.getElementById('ca'+s.day); if(st) st.classList.add('now');
  setTimeout(tick, 350);
}
function caFinish(tok){ if(!CAL_ANIM || (tok && CAL_ANIM.tok!==tok)) return; const mode=CAL_ANIM.mode; CAL_ANIM=null; const r=document.getElementById('calAnim'); if(r) r.innerHTML=''; advance(mode); }
function caSkip(){ caFinish(); }

