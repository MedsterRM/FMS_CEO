/* =========================================================================
   PRETEMPORADA
========================================================================= */
function toggleLeague(key){
  const s=cur(); if(s.phase!=='pre') return;
  const i=s.activeKeys.indexOf(key);
  if(i>=0){
    const L=s.leagues[key];
    if(L && L.competitors.length){ L.competitors.forEach(id=>{ state.company.money += L.contracts[id]||0; s.fin.salaries -= L.contracts[id]||0; }); }
    if(L) spkRefundAll(s, L);
    s.activeKeys.splice(i,1); delete s.leagues[key];
    if(natKeys(s).length<4){ s.intlEnabled=false; s.intl.date=null; }
  } else {
    if(!isWS(key) && natKeys(s).length>=maxLeagues(state.company.stars)){ toast(`Con ${state.company.stars}★ puedes tener ${maxLeagues(state.company.stars)} liga(s) activa(s).`); return; }
    if(isWS(key) && (state.company.stars||0)<5){ toast('La FMS World Series se desbloquea con 5 estrellas.'); return; }
    if(isWS(key)){ const c=spState(); if(c.wsPool.length<3) sponsorOffers(state.company.stars||5, 4-c.wsPool.length, false, true); }
    s.activeKeys.push(key); s.activeKeys.sort((a,b)=> (isWS(a)?99:LEAGUES.findIndex(l=>l.key===a))-(isWS(b)?99:LEAGUES.findIndex(l=>l.key===b)));
    ensureLeague(s,key); preselectRoster(s,key);
  }
  render();
}
function toggleIntl(){
  const s=cur(); if(s.phase!=='pre') return;
  if(natKeys(s).length<4){ toast('El Internacional se desbloquea con 4 ligas activas.'); return; }
  s.intlEnabled=!s.intlEnabled; if(!s.intlEnabled) s.intl.date=null; render();
}
function signedLeagueOf(s, id){ return natKeys(s).find(k=> s.leagues[k] && s.leagues[k].competitors.includes(id)) || null; }
function toggleSign(key, id){
  const s=cur(); if(s.phase!=='pre') return;
  const L=s.leagues[key]; const f=fby(id);
  const i=L.competitors.indexOf(id);
  if(i>=0){
    L.competitors.splice(i,1); state.company.money += L.contracts[id]||0; s.fin.salaries -= L.contracts[id]||0; delete L.contracts[id];
  } else {
    if(L.competitors.length>=10){ toast('La plantilla ya tiene 10 freestylers.'); return; }
    if(L.blocked.includes(id)){ toast(`${f.name} descendió de esta liga la temporada pasada: no puede volver hasta ${s.year+1}. Puedes ficharlo en otra liga.`); return; }
    if(isSpeakerId(s,id)){ toast(`${f.name} es host de ${ldef(speakerKeyOf(s,f.name)).name}: no puede estar en un line up.`); return; }
    const other=isWS(key)?null:signedLeagueOf(s,id); if(other){ toast(`${f.name} ya está fichado en ${ldef(other).name}.`); return; }
    const sal=contractCost(f,key);
    if(state.company.money < sal){ toast(`No te llega: ${f.name} pide ${money(sal)}${isForeign(f,key)?' (incluye viajes)':''}.`); return; }
    L.competitors.push(id); L.contracts[id]=sal; state.company.money -= sal; s.fin.salaries += sal;
  }
  render();
}
function preselectRoster(s, key){
  const L=s.leagues[key]; if(!L || L.competitors.length) return 0; let n=0;
  (L.prevRoster||[]).filter(id=> fby(id) && !L.blocked.includes(id) && !isSpeakerId(s,id) && (isWS(key) || !signedLeagueOf(s,id))).forEach(id=>{
    if(L.competitors.length>=10) return; const sal=contractCost(fby(id),key); if(state.company.money<sal) return;
    L.competitors.push(id); L.contracts[id]=sal; state.company.money-=sal; s.fin.salaries+=sal; n++; });
  return n;
}
function keepRoster(key){
  const s=cur(); const L=s.leagues[key];
  const ids=L.prevRoster.filter(id=> fby(id) && !L.blocked.includes(id) && !isSpeakerId(s,id) && !L.competitors.includes(id) && (isWS(key) || !signedLeagueOf(s,id)));
  let added=0, skipped=0;
  ids.forEach(id=>{
    if(L.competitors.length>=10) return;
    const sal=contractCost(fby(id),key);
    if(state.company.money<sal){ skipped++; return; }
    L.competitors.push(id); L.contracts[id]=sal; state.company.money-=sal; s.fin.salaries+=sal; added++;
  });
  toast(`Renovados ${added}${skipped? ` · ${skipped} no caben en el presupuesto`:''}.`);
  render();
}
function releaseAll(key){
  const s=cur(); const L=s.leagues[key];
  L.competitors.forEach(id=>{ state.company.money += L.contracts[id]||0; s.fin.salaries -= L.contracts[id]||0; });
  L.competitors=[]; L.contracts={}; render();
}
function preseasonIssues(s){
  const issues=[];
  if(!natKeys(s).length) issues.push('Activa al menos una liga.');
  s.activeKeys.forEach(k=>{
    const L=s.leagues[k]; const d=ldef(k);
    if(L.competitors.length<10) issues.push(`${d.name}: faltan ${10-L.competitors.length} fichajes.`);
    if(L.dates.length<nJ(k)) issues.push(`${d.name}: faltan ${nJ(k)-L.dates.length} fechas en el calendario.`);
    if(!spkList(L).length) issues.push(`${d.name}: falta elegir el host (speaker).`);
  });
  { const r=wsRange(s); if(r){ const c=natKeys(s).flatMap(k=>s.leagues[k].dates).find(x=>x>r[0]&&x<r[1]); if(c!=null) issues.push(`World Series: no puede haber jornadas nacionales entre su J1 y su J5 (${fmtDay(s.year,c)}).`); } }
  if(s.intlEnabled){
    if(!s.intl.sede) issues.push('Internacional: elige su sede.');
    if(s.intl.date==null) issues.push('Internacional: pon su fecha en el calendario.');
    else {
      const lastNat=lastNationalDay(s);
      if(s.intl.date<=lastNat) issues.push(`Internacional: debe ir después de la última jornada nacional (${fmtDay(s.year,lastNat)}).`);
    }
  }
  return issues;
}

