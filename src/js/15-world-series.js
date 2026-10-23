/* =========================================================================
   FMS WORLD SERIES: 5 jornadas, 2 batallas por competidor y jornada, extraplayers
========================================================================= */
function wsMatch(P, need, used, pairs, guard){
  if(guard.n++>4000) return null;
  const open=P.filter(x=>need[x]>0); if(!open.length) return pairs.slice();
  let best=null, bestOpts=null;
  for(const x of open){ const opts=open.filter(y=>y!==x && !used.has(pairKey(x,y))); if(opts.length<need[x]) return null; if(!best || opts.length<bestOpts.length){ best=x; bestOpts=opts; } }
  for(const y of shuffle(bestOpts)){
    need[best]--; need[y]--; used.add(pairKey(best,y)); pairs.push([best,y]);
    const r=wsMatch(P, need, used, pairs, guard); if(r) return r;
    pairs.pop(); used.delete(pairKey(best,y)); need[best]++; need[y]++;
  }
  return null;
}
function wsRound(P, used, epDone, fp, fe){
  for(let t=0;t<30;t++){
    const cand=shuffle(P.filter(x=>!epDone.has(x) && !fe.includes(x)));
    const eps=[...fe, ...cand].slice(0,2); if(eps.length<2) return null;
    const need={}; P.forEach(x=>need[x]= eps.includes(x)?1:2);
    let ok=true; const pairs=[]; const lu=new Set(used);
    for(const [a,b] of fp){ if(lu.has(pairKey(a,b))||need[a]<=0||need[b]<=0){ ok=false; break; } need[a]--; need[b]--; lu.add(pairKey(a,b)); pairs.push([a,b]); }
    if(!ok){ if(fe.length>=2) return null; continue; }
    const res=wsMatch(P, need, lu, pairs, {n:0});
    if(res) return {pairs:res, eps};
    if(fe.length>=2 && t>6) return null;
  }
  return null;
}
function wsSolve(P, used, epDone, fp, fe, n){
  for(let attempt=0; attempt<80; attempt++){
    const u=new Set(used), e=new Set(epDone), out=[]; let ok=true;
    for(let k=0;k<n;k++){ const r=wsRound(P, u, e, k===0?fp:[], k===0?fe:[]); if(!r){ ok=false; break; }
      r.pairs.forEach(([a,b])=>u.add(pairKey(a,b))); r.eps.forEach(x=>e.add(x)); out.push(r); }
    if(ok) return out;
  }
  return null;
}
function wsState(L){ const used=new Set(), ep=new Set();
  L.rounds.slice(0,L.played).forEach(r=>r.forEach(m=>{ if(m.ep) ep.add(m.a); else used.add(pairKey(m.a,m.b)); })); return {used, ep}; }
function wsRoundsFrom(sol){ return sol.map(r=>[...r.pairs.map(([a,b])=>({id:uid('m'), a, b, result:null})), ...r.eps.map(c=>({id:uid('m'), a:c, b:null, ep:true, result:null}))]); }
function wsBuildRounds(L){ const sol=wsSolve(L.competitors, new Set(), new Set(), [], [], WS_JORNADAS); return wsRoundsFrom(sol||[]); }
function wsEpFee(f){ return Math.max(100, Math.round(contractCostBase(f, WS.key)*0.05*(1-fxVal(WS.key,'exfee'))/100)*100); }
function wsDraft(key){ const L=cur().leagues[key]; const k='wsd_'+key; let d=state.ui[k];
  if(!d || d.round!==L.played) d=state.ui[k]={round:L.played, pairs:[], eps:[{c:null,x:null},{c:null,x:null}], sel:null, slot:null, sede:null};
  return d; }
function wsFeasible(L, pairs, epc){ const st=wsState(L); return !!wsSolve(L.competitors, st.used, st.ep, pairs, epc, WS_JORNADAS-L.played); }
function wsNeed(L, d, id){ return 2 - d.pairs.filter(p=>p.includes(id)).length - d.eps.filter(e=>e.c===id).length; }
function wsPairingEditor(s, key){
  const L=s.leagues[key]; const jn=L.played+1;
  if(L.confirmed[L.played]) return `<div class="banner" style="margin-top:14px;">Cruces de la J${jn} (${fmtDay(s.year,L.dates[L.played])}) elegidos.&nbsp;<button class="btn small" onclick="wsUnconfirm('${key}')">Cambiar</button></div>`;
  const d=wsDraft(key); const st=wsState(L);
  const chips=L.competitors.map(id=>{ const n=wsNeed(L,d,id); if(n<=0) return '';
    const isSel=d.sel===id; const blocked = d.slot==null ? (d.sel && d.sel!==id && st.used.has(pairKey(d.sel,id))) : st.ep.has(id);
    return `<button class="pair-chip ${isSel?'sel':''} ${blocked?'blocked':''}" onclick="wsTap('${key}','${id}')">${miniAvatar(id,22)}<span>${fnameH(id)}</span><small>${n}/2</small></button>`; }).join('');
  const epCard=(e,i)=>`<div class="ws-ep ${d.slot===i?'on':''}" onclick="wsSlot('${key}',${i})">
      <div class="ws-ep-h">Extraplayer ${i+1}</div>
      <div class="ex-row">${e.c?`${miniAvatar(e.c,24)} ${fnameH(e.c)}`:'<span class="step-note">Competidor…</span>'} <span class="vs">vs</span> ${e.x?`${fnameH(e.x)} ${miniAvatar(e.x,24)}<small class="step-note">${moneyK(wsEpFee(fby(e.x)))}</small>`:'<span class="step-note">Extraplayer…</span>'}</div>
      ${(e.c||e.x)?`<button class="btn small ghost" onclick="event.stopPropagation(); wsClearEp('${key}',${i})">Quitar</button>`:''}</div>`;
  let grid='';
  if(d.slot!=null){ const q=state.ui.wsQ||''; const el=state.freestylers.filter(f=>!L.competitors.includes(f.id) && fMatch(f,q)).sort((a,b)=>b.fama-a.fama).slice(0,40);
    grid=`<p class="step-note" style="margin:8px 0">Toca arriba al competidor que se enfrentará al extraplayer ${d.slot+1} (cada uno solo una vez en la temporada) y elige aquí al extraplayer. Se puede repetir extraplayer.</p>
      <input id="wsQ" class="ex-q" placeholder="Buscar extraplayer por nombre o país" value="${esc(q)}" oninput="state.ui.wsQ=this.value; render()">
      <div class="pick-grid ex-grid">${el.map(f=>`<div class="pick-item ${d.eps[d.slot].x===f.id?'checked':''}" onclick="wsPickX('${key}','${f.id}')">
        <span class="mini-avatar" style="width:32px;height:32px;font-size:15px;${avatarDivStyle(f)}">${avatarContent(f)}</span>
        <div style="min-width:0;"><div class="pname">${nameH(f)}</div>${styleTag(f)}<div class="pcountry">${esc(f.country)}</div></div>
        <div class="pick-stats">Nivel <b>${f.nivel}</b><br>Fama <b>${f.fama}</b><br><span class="sal">${moneyK(wsEpFee(f))}</span></div></div>`).join('')}</div>`; }
  const ready=d.pairs.length===9 && d.eps.every(e=>e.c&&e.x) && !!d.sede;
  return `<div class="pair-editor">
    <div class="step-head" style="margin-bottom:6px;"><h3>Cruces de la jornada ${jn}</h3><span class="counter"><span class="n">${d.pairs.length}</span>/9 · <span class="n">${d.eps.filter(e=>e.c&&e.x).length}</span>/2 EP</span></div>
    <p class="step-note" style="margin-bottom:10px;">${fmtDay(s.year,L.dates[L.played])}. Cada competidor hace 2 batallas por jornada. Toca dos para enfrentarlos; además hay 2 batallas contra extraplayers.</p>
    <div class="field-label" style="margin-top:4px">País de la jornada (los de ese país juegan como locales)</div>
    <div class="ws-sedes">${SEDES.map(c=>`<button class="seg ${d.sede===c?'on':''}" onclick="wsSede('${key}','${c}')">${c}</button>`).join('')}</div>
    <div class="pair-free" style="margin-top:10px">${chips || '<span class="step-note">Todos tienen sus 2 batallas.</span>'}</div>
    <div class="ws-eps">${d.eps.map(epCard).join('')}</div>${grid}
    ${d.pairs.length?`<div class="matches-grid" style="margin-top:12px;">${d.pairs.map((p,i)=>`<div class="match" style="min-height:0;"><div class="match-head">
      <div class="match-side left">${miniAvatar(p[0],22)}<span class="side-name">${fnameH(p[0])}</span></div><div class="vs">vs</div>
      <div class="match-side right"><span class="side-name">${fnameH(p[1])}</span>${miniAvatar(p[1],22)}</div></div>
      <div class="match-result"><span>${fby(p[0]).nivel} · ${fby(p[1]).nivel}</span><button class="btn small ghost" onclick="wsRemovePair('${key}',${i})">Deshacer</button></div></div>`).join('')}</div>`:''}
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:14px;">
      <button class="btn small" onclick="wsAuto('${key}')">${d.pairs.length||d.eps.some(e=>e.c||e.x)?'Completar el resto al azar':'Sortear todos'}</button>
      ${d.pairs.length||d.eps.some(e=>e.c||e.x)?`<button class="btn small danger" onclick="wsClear('${key}')">Vaciar</button>`:''}
      <span class="top-spacer"></span>
      <button class="btn small primary" ${ready?'':'disabled'} onclick="wsConfirm('${key}')">Confirmar cruces</button>
    </div></div>`;
}
function wsSede(key,c){ const d=wsDraft(key); d.sede = d.sede===c ? null : c; render(); }
function wsSlot(key,i){ const d=wsDraft(key); d.slot = d.slot===i ? null : i; d.sel=null; render(); }
function wsTap(key,id){ const L=cur().leagues[key]; const d=wsDraft(key); const st=wsState(L);
  if(d.slot!=null){ const e=d.eps[d.slot];
    if(st.ep.has(id)){ toast(`${fname(id)} ya se enfrentó a un extraplayer esta temporada.`); return; }
    if(d.eps.some((x,i)=>i!==d.slot && x.c===id)){ toast('Ese competidor ya está en el otro extraplayer.'); return; }
    const epc=d.eps.map((x,i)=>i===d.slot?id:x.c).filter(Boolean);
    if(!wsFeasible(L, d.pairs, epc)){ toast(`Con ${fname(id)} contra un extraplayer el resto de jornadas ya no cuadra. Prueba otro.`); return; }
    e.c=id; render(); return; }
  if(d.sel==null){ d.sel=id; render(); return; } if(d.sel===id){ d.sel=null; render(); return; }
  const a=d.sel, b=id;
  if(st.used.has(pairKey(a,b)) || d.pairs.some(p=>pairKey(p[0],p[1])===pairKey(a,b))){ toast(`${fname(a)} y ${fname(b)} ya se han enfrentado.`); return; }
  const fp=[...d.pairs,[a,b]];
  if(!wsFeasible(L, fp, d.eps.map(x=>x.c).filter(Boolean))){ toast(`Con ${fname(a)} vs ${fname(b)} las jornadas que quedan ya no cuadran. Prueba otro.`); return; }
  d.pairs.push([a,b]); d.sel=null; render(); }
function wsPickX(key,id){ const d=wsDraft(key); if(d.slot==null) return; d.eps[d.slot].x=id; render(); }
function wsClearEp(key,i){ const d=wsDraft(key); d.eps[i]={c:null,x:null}; render(); }
function wsRemovePair(key,i){ const d=wsDraft(key); d.pairs.splice(i,1); d.sel=null; render(); }
function wsClear(key){ const d=wsDraft(key); d.pairs=[]; d.eps=[{c:null,x:null},{c:null,x:null}]; d.sel=null; d.slot=null; render(); }
function wsAuto(key, silent){ const s=cur(); const L=s.leagues[key]; const d=wsDraft(key); const st=wsState(L);
  const sol=wsSolve(L.competitors, st.used, st.ep, d.pairs, d.eps.map(x=>x.c).filter(Boolean), WS_JORNADAS-L.played);
  if(!sol){ toast('No hay forma de completar con esos cruces. Deshaz alguno.'); return false; }
  d.pairs=sol[0].pairs; const cs=sol[0].eps.slice(); const pool=state.freestylers.filter(f=>!L.competitors.includes(f.id)).sort((a,b)=>b.fama-a.fama).slice(0,30);
  d.eps.forEach(e=>{ if(!e.c){ e.c=cs.find(c=>!d.eps.some(x=>x.c===c)); } if(!e.x){ const f=pool[Math.floor(Math.random()*pool.length)]; e.x=f&&f.id; } });
  if(!d.sede) d.sede=SEDES[Math.floor(Math.random()*SEDES.length)];
  d.sel=null; if(!silent) render(); return true; }
function wsConfirm(key){ const s=cur(); const L=s.leagues[key]; const d=wsDraft(key);
  if(d.pairs.length!==9 || !d.eps.every(e=>e.c&&e.x) || !d.sede) return;
  const st=wsState(L); const sol=wsSolve(L.competitors, st.used, st.ep, d.pairs, d.eps.map(e=>e.c), WS_JORNADAS-L.played);
  if(!sol){ toast('Esos cruces no dejan un calendario válido.'); return; }
  const cur0=[...d.pairs.map(([a,b])=>({id:uid('m'), a, b, result:null})), ...d.eps.map(e=>({id:uid('m'), a:e.c, b:e.x, ep:true, result:null}))];
  L.rounds = L.rounds.slice(0,L.played).concat([cur0], wsRoundsFrom(sol.slice(1)));
  const fee=d.eps.reduce((a,e)=>a+wsEpFee(fby(e.x)),0); state.company.money-=fee; s.fin.salaries+=fee; if(!L.epFees) L.epFees={}; L.epFees[L.played]=fee;
  if(!L.wsSede) L.wsSede={}; L.wsSede[L.played]=d.sede;
  L.confirmed[L.played]=true; delete state.ui['wsd_'+key]; state.ui['jnav_'+key]=L.played;
  toast(`Cruces de la J${L.played+1} confirmados (extraplayers: ${money(fee)}).`); render(); }
function wsUnconfirm(key){ const s=cur(); const L=s.leagues[key]; const r=L.rounds[L.played];
  const fee=(L.epFees&&L.epFees[L.played])||0; state.company.money+=fee; s.fin.salaries-=fee; if(L.epFees) delete L.epFees[L.played];
  delete L.confirmed[L.played];
  state.ui['wsd_'+key]={round:L.played, pairs:r.filter(m=>!m.ep).map(m=>[m.a,m.b]), eps:r.filter(m=>m.ep).map(m=>({c:m.a,x:m.b})).concat([{c:null,x:null},{c:null,x:null}]).slice(0,2), sel:null, slot:null, sede:(L.wsSede&&L.wsSede[L.played])||null};
  render(); }

