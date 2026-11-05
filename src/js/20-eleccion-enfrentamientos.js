/* ---------- elección de enfrentamientos ---------- */
function renderModeToggle(key){
  const L=cur().leagues[key];
  return `<div class="mode-toggle" role="group" aria-label="Enfrentamientos">
    <span class="step-note">Enfrentamientos</span>
    <button class="seg ${!L.manual?'on':''}" onclick="setManual('${key}',false)" aria-pressed="${!L.manual}">Automáticos</button>
    <button class="seg ${L.manual?'on':''}" onclick="setManual('${key}',true)" aria-pressed="${L.manual}">A mano</button>
  </div>`;
}
function setManual(key, v){
  const L=cur().leagues[key]; L.manual=v;
  if(!v){ delete state.ui['draft_'+key]; }
  toast(v? 'Antes de cada jornada de esta liga tendrás que elegir los cruces.' : 'Los cruces de esta liga se sortean solos.');
  render();
}
function draftOf(key){
  const L=cur().leagues[key]; const k='draft_'+key;
  let d=state.ui[k];
  if(!d || d.round!==L.played){ d=state.ui[k]={round:L.played, pairs:[], sel:null}; }
  return d;
}
function renderPairingEditor(s,key){
  if(isWS(key)) return wsPairingEditor(s,key);
  const L=s.leagues[key]; const jn=L.played+1;
  if(L.confirmed[L.played]){
    return `<div class="banner" style="margin-top:14px;">Cruces de la J${jn} (${fmtDay(s.year,L.dates[L.played])}) elegidos.&nbsp;<button class="btn small" onclick="unconfirmRound('${key}')">Cambiar</button></div>`;
  }
  const d=draftOf(key); const used=playedPairsOf(L);
  const paired=new Set(d.pairs.flat());
  const free=L.competitors.filter(id=>!paired.has(id));
  return `<div class="pair-editor">
    <div class="step-head" style="margin-bottom:6px;"><h3>Cruces de la jornada ${jn}</h3><span class="counter"><span class="n">${d.pairs.length}</span>/5</span></div>
    <p class="step-note" style="margin-bottom:10px;">${fmtDay(s.year,L.dates[L.played])}. Toca dos freestylers para enfrentarlos. Los que ya se han enfrentado esta temporada no se pueden repetir.</p>
    <div class="pair-free">${free.map(id=>{
      const isSel=d.sel===id; const blocked = d.sel && d.sel!==id && used.has(pairKey(d.sel,id));
      return `<button class="pair-chip ${isSel?'sel':''} ${blocked?'blocked':''}" onclick="tapPair('${key}','${id}')" ${blocked?'aria-disabled="true"':''}>${miniAvatar(id,22)}<span>${fnameH(id)}</span><small>${fby(id).nivel}</small></button>`; }).join('') || '<span class="step-note">Todos emparejados.</span>'}</div>
    ${d.pairs.length?`<div class="matches-grid" style="margin-top:12px;">${d.pairs.map((p,i)=>`<div class="match" style="min-height:0;"><div class="match-head">
      <div class="match-side left">${miniAvatar(p[0],22)}<span class="side-name">${fnameH(p[0])}</span></div><div class="vs">vs</div>
      <div class="match-side right"><span class="side-name">${fnameH(p[1])}</span>${miniAvatar(p[1],22)}</div></div>
      <div class="match-result"><span>${fby(p[0]).nivel} · ${fby(p[1]).nivel}</span><button class="btn small ghost" onclick="removePair('${key}',${i})">Deshacer</button></div></div>`).join('')}</div>`:''}
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:14px;">
      <button class="btn small" onclick="autoFillPairs('${key}')">${d.pairs.length?'Completar el resto al azar':'Sortear todos'}</button>
      ${d.pairs.length?`<button class="btn small danger" onclick="clearPairs('${key}')">Vaciar</button>`:''}
      <span class="top-spacer"></span>
      <button class="btn small primary" ${d.pairs.length===5?'':'disabled'} onclick="confirmRound('${key}')">Confirmar cruces</button>
    </div>
  </div>`;
}
function tapPair(key,id){
  const L=cur().leagues[key]; const d=draftOf(key);
  if(d.sel==null){ d.sel=id; render(); return; }
  if(d.sel===id){ d.sel=null; render(); return; }
  const a=d.sel, b=id;
  if(playedPairsOf(L).has(pairKey(a,b))){ toast(`${fname(a)} y ${fname(b)} ya se enfrentaron esta temporada.`); return; }
  const fixed=[...d.pairs,[a,b]];
  const ok=solveRounds(L.competitors, playedPairsOf(L), fixed, JORNADAS-L.played);
  if(!ok){ toast(`Con ${fname(a)} vs ${fname(b)} los cruces de las jornadas que quedan ya no cuadran. Prueba otro.`); return; }
  d.pairs.push([a,b]); d.sel=null; render();
}
function removePair(key,i){ const d=draftOf(key); d.pairs.splice(i,1); d.sel=null; render(); }
function clearPairs(key){ const d=draftOf(key); d.pairs=[]; d.sel=null; render(); }
function autoFillPairs(key){
  const L=cur().leagues[key]; const d=draftOf(key);
  const sol=solveRounds(L.competitors, playedPairsOf(L), d.pairs, JORNADAS-L.played);
  if(!sol){ toast('No hay forma de completar con esos cruces. Deshaz alguno.'); return; }
  d.pairs=sol[0]; d.sel=null; render();
}
function confirmRound(key){
  const L=cur().leagues[key]; const d=draftOf(key);
  if(d.pairs.length!==5) return;
  const sol=solveRounds(L.competitors, playedPairsOf(L), d.pairs, JORNADAS-L.played);
  if(!sol){ toast('Esos cruces no dejan un calendario válido.'); return; }
  const rest=sol.map(r=>r.map(([a,b])=>({id:uid('m'), a, b, result:null})));
  L.rounds = L.rounds.slice(0,L.played).concat(rest);
  L.confirmed[L.played]=true;
  delete state.ui['draft_'+key];
  state.ui['jnav_'+key]=L.played;
  toast(`Cruces de la J${L.played+1} confirmados. Ya puedes seguir avanzando.`);
  render();
}
function unconfirmRound(key){
  const L=cur().leagues[key];
  delete L.confirmed[L.played];
  state.ui['draft_'+key]={round:L.played, pairs:L.rounds[L.played].map(m=>[m.a,m.b]), sel:null};
  render();
}


