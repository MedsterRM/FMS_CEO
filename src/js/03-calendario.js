/* =========================================================================
   EVENTOS / CALENDARIO
========================================================================= */
function seasonEvents(s){
  const evs=[];
  s.activeKeys.forEach(k=>{
    const L=s.leagues[k]; if(!L) return;
    L.dates.slice().sort((a,b)=>a-b).forEach((d,i)=> evs.push({day:d, key:k, j:i+1}));
  });
  if(s.intlEnabled && s.intl.date!=null) evs.push({day:s.intl.date, key:INTL.key, j:null});
  return evs.sort((a,b)=>a.day-b.day);
}
function eventsByDay(s){ const m={}; seasonEvents(s).forEach(e=> m[e.day]=e); return m; }
function monthsWithEvents(s){ const set=new Set(); seasonEvents(s).forEach(e=> set.add(monthOf(s.year,e.day))); return set; }

function gapsFor(s, key){
  const ds = s.leagues[key].dates.slice().sort((a,b)=>a-b);
  const gaps=[]; let last=-14;
  ds.forEach(d=>{ gaps.push(d-last); last=d; });
  return gaps;
}
function gapClass(g){ return g<=GAP_OK ? 'g' : (g<=GAP_WARN ? 'y' : 'r'); }
function projectedHypeLoss(s, key){
  return gapsFor(s,key).reduce((acc,g)=>{ let loss=0; for(let x=1;x<=g;x++) loss+=decayRate(x); return acc+loss; },0);
}

function rostersComplete(s){ return s.activeKeys.length>0 && s.activeKeys.every(k=> s.leagues[k] && s.leagues[k].competitors.length===10); }
function lastNationalDay(s){ return Math.max(-1, ...natKeys(s).flatMap(k=> s.leagues[k] ? s.leagues[k].dates : [])); }
function clearSchedule(){
  const s=cur(); s.activeKeys.forEach(k=> s.leagues[k].dates=[]); s.intl.date=null; render();
}
function calClick(day){
  const s=cur();
  const byDay=eventsByDay(s); const ev=byDay[day];
  const rev=rbByDay(s)[day];
  if(rev){ if(s.phase==='pre') toast(`Ese día es la ${rbdef(rev.key).name}. No puedes poner una fecha ahí.`); else goto('redbull',{key:rev.key}); return; }
  const uev=underByDay(s)[day]; if(uev){ if(s.phase==='pre' && !ev) toast(`Ese día se juega la ${udef(uev.key).name}. No puedes poner una fecha ahí.`); else showUnder(uev.key, day); return; }
  if(s.phase!=='pre'){
    if(ev){ if(ev.key===INTL.key) goto('intl'); else { state.ui['jnav_'+ev.key]=ev.j-1; goto('league',{key:ev.key}); } }
    return;
  }
  if(!rostersComplete(s)){ toast('Primero completa los fichajes de todas las ligas (10 por liga).'); return; }
  if(ev){
    if(ev.key===INTL.key) s.intl.date=null;
    else { const L=s.leagues[ev.key]; L.dates.splice(L.dates.indexOf(day),1); }
    render(); return;
  }
  const tool = state.ui.calTool || s.activeKeys[0];
  if(tool===INTL.key){
    if(!s.intlEnabled){ toast('Activa el Internacional primero (necesitas 4 ligas).'); return; }
    const pend = natKeys(s).filter(k=> s.leagues[k].dates.length<JORNADAS);
    if(pend.length){ toast(`Antes pon todas las jornadas nacionales (falta ${ldef(pend[0]).name}).`); return; }
    const lastNat = lastNationalDay(s);
    if(day<=lastNat){ toast(`El Internacional tiene que ir después de la última jornada nacional (${fmtDay(s.year,lastNat)}).`); return; }
    s.intl.date=day; render(); return;
  }
  const L=s.leagues[tool]; if(!L) return;
  if(L.dates.length>=nJ(tool)){ toast(`${ldef(tool).name} ya tiene sus ${nJ(tool)} fechas. Quita una o elige otra liga.`); return; }
  if(isWS(tool)){ const ds=[...L.dates, day]; const a=Math.min(...ds), b=Math.max(...ds); const clash=natKeys(s).flatMap(k=>s.leagues[k].dates).find(x=>x>a && x<b);
    if(clash!=null){ toast(`Entre la J1 y la J5 de la World Series no puede haber jornadas nacionales (hay una el ${fmtDay(s.year,clash)}).`); return; } }
  else { const r=wsRange(s); if(r && day>r[0] && day<r[1]){ toast(`Esas fechas son de la FMS World Series (${fmtDay(s.year,r[0])} – ${fmtDay(s.year,r[1])}): no puede haber jornadas nacionales en medio.`); return; } }
  if(!isWS(tool) && s.intlEnabled && s.intl.date!=null && day>=s.intl.date){ toast(`Las jornadas nacionales tienen que ir antes del Internacional (${fmtDay(s.year,s.intl.date)}).`); return; }
  if(day<LU_RESERVED){ toast('Esa fecha no está disponible.'); return; }
  if(L.dates.some(x=>Math.abs(x-day)===1)){ toast(`${ldef(tool).name} ya tiene una fecha el día de al lado: deja al menos un día libre entre dos jornadas de la misma liga.`); return; }
  L.dates.push(day);
  if(L.dates.length===nJ(tool)){
    const next = s.activeKeys.find(k=> s.leagues[k].dates.length<nJ(k));
    if(next) state.ui.calTool=next; else if(s.intlEnabled && s.intl.date==null) state.ui.calTool=INTL.key;
  }
  render();
}

