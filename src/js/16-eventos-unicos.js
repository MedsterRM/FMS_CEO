/* =========================================================================
   EVENTOS ÚNICOS (no se explican en el juego: se descubren jugando)
========================================================================= */
let UQ_PERF = {};
let WS_SHORT = false;
const UQ_REGGAE = {'Sara Socas':0.25, 'Lokillo':0.25, 'Visionario':0.25, 'Mecha':0.05};   // minutazo a puro reggae
const UQ_REFUSE = {   // al simular el primer día: no quieren estar en la FMS
  'Walls':{p:0.9}, 'Bnet':{p:0.5}, 'Acru':{p:0.6}, 'Wos':{p:0.7}, 'Trueno':{p:0.4}, 'Duki':{p:0.9},
  'Papo':{p:1, papo:true},
  'TiagoPZK':{p:0.6, kind:'concert', exDisc:0.25}, 'Lit Killah':{p:0.7, kind:'concert', exDisc:0.15}, 'Jaloner':{p:1, kind:'retired', exDisc:0.10},
};
const UQ_PREP = {'Hander':0.05,'Force':0.10,'Ritmodelia':0.10,'Lgido':0.10,'El Menor':0.03,'Mowlihawk':0.10,'Sweet Pain':0.03,'Zaina':0.08,'Papo':0.05,'Cacha':0.10,'Gazir':0.06,'Titus':0.10};
const UQ_UNAV = {   // 5 días antes de la jornada no pueden venir
  'Papo':{p:0.10, first:true, why:'tiene que organizar Liga Bazooka'}, 'Dtoke':{p:0.10, first:true, why:'tiene que organizar Liga Bazooka'},
  'Ricto':{p:0.20, first:false, why:'no le han dado el día libre en el trabajo'}, 'Arkano':{p:0.25, first:true, why:'coincide con su participación en Supervivientes'},
  'Mowlihawk':{p:0.15, first:true, why:'tiene que grabar un Batmowli'},
  'Errecé':{p:0.10, first:false, why:'se ha ido a Bali a reflexionar sobre la vida'},
  'Éxodo Lirical':{p:0.20, first:false, why:'no puede viajar: la visa no le permite entrar al país'},
};
function uqPush(s, ev){ if(!s.uq) s.uq=[]; ev.id=uid('u'); ev.done=false; s.uq.push(ev); return ev; }
function uqSeasonStart(s){
  s.activeKeys.forEach(k=>{ const L=s.leagues[k]; L.competitors.slice().forEach(id=>{ const f=fby(id); const r=f&&UQ_REFUSE[f.name]; if(!r) return;
    const p = Math.max(0, ((isWS(k) && f.name!=='Walls') ? r.p*0.5 : r.p) - spkVal(k,'refuse'));
    if(state.company.infinite && !r.papo) return;
    if(Math.random()<p) uqPush(s, {day:s.day, type:r.papo?'papo':'refuse', key:k, fid:id, kind:r.kind||'no'}); }); });
}
function uqExhibRefuses(s, f){ const r=f&&UQ_REFUSE[f.name]; if(!r || r.papo || r.kind || state.company.infinite) return false; if(signedLeagueOf(s,f.id)) return false;   // si ya compite en una FMS, la exhibición la hace
  if(!f.exNo || f.exNo.y!==s.year) f.exNo={y:s.year, no:Math.random()<r.p}; return f.exNo.no; }
function uqRemove(s, L, id){
  const i=L.competitors.indexOf(id); if(i<0) return;
  state.company.money += L.contracts[id]||0; s.fin.salaries -= L.contracts[id]||0; delete L.contracts[id];
  if(!L.pendingRep) L.pendingRep=[]; L.pendingRep.push(id); if(!s.refused) s.refused=[]; s.refused.push(id);
}
function uqReplace(s, key, oldId, newId){
  const L=s.leagues[key]; const i=L.competitors.indexOf(oldId); if(i<0) return false; const f=fby(newId);
  const sal=contractCost(f,key); state.company.money-=sal; s.fin.salaries+=sal;
  L.competitors[i]=newId; L.contracts[newId]=sal;
  L.rounds.forEach(r=>r.forEach(m=>{ if(m.a===oldId) m.a=newId; if(m.b===oldId) m.b=newId; }));
  L.pendingRep=(L.pendingRep||[]).filter(x=>x!==oldId); delete state.ui['draft_'+key];
  addLog(s, s.day, `${ldef(key).name}: ${f.name} entra en la plantilla en lugar de ${fname(oldId)}.`, 'gold');
  return true;
}
function uqCandidates(s, key){ const L=s.leagues[key]; const bad=new Set([...(s.refused||[]), ...L.blocked]);
  return state.freestylers.filter(f=>(isWS(key) ? !L.competitors.includes(f.id) : !signedLeagueOf(s,f.id)) && !bad.has(f.id)).sort((a,b)=>b.fama-a.fama); }
function uqAutoReplace(s, key){ const L=s.leagues[key]; (L.pendingRep||[]).slice().forEach(old=>{ const c=uqCandidates(s,key).filter(f=>f.country===fby(old).country)[0] || uqCandidates(s,key)[0]; if(c) uqReplace(s,key,old,c.id); }); }
function uqApply(s, ev){
  const L=s.leagues[ev.key];
  if(ev.type==='refuse'){ uqRemove(s, L, ev.fid); const f=fby(ev.fid); if(ev.kind!=='no') f.exOffer=s.year;
    addLog(s, ev.day, `${f.name} ${ev.kind==='concert'?'no puede compaginar la FMS con sus conciertos':ev.kind==='retired'?'está retirado de las batallas':'no está interesado en estar en la FMS'}: deja ${ldef(ev.key).name}.`, 'bad'); }
  else if(ev.type==='papo'){ ev.newSal=Math.round((L.contracts[ev.fid]||contractCost(fby(ev.fid),ev.key))*1.1/100)*100; }
  else if(ev.type==='prep'){ const a=fby(ev.fid), b=fby(ev.rival); [a,b].forEach(f=>{ if(f) f.hype=Math.round((f.hype||0)*0.95*10)/10; }); L.hype=clamp(L.hype*0.95,0,100); ev.done=true; ev.show=true;
    addLog(s, ev.day, `🕵️ Acusan a <b>${a.name}</b> de ganar a ${b?b.name:'su rival'} con preparadas. La comunidad carga contra los jueces.`, 'bad'); }
  else if(ev.type==='driu'){ [ev.fid, ev.rival].forEach(id=>{ const f=fby(id); if(f) f.hype=Math.round((f.hype||0)*0.9*10)/10; }); ev.done=true; ev.show=true;
    addLog(s, ev.day, `🤯 El público no ha entendido nada de la batalla de ${fname(ev.fid)} contra ${fname(ev.rival)}.`, 'bad'); }
  else if(ev.type==='zasko'){ const f=fby(ev.fid); if(!ev.good) f.hype=Math.round((f.hype||0)*0.85*10)/10; ev.done=true; ev.show=true;
    addLog(s, ev.day, ev.good?`🔥 Zasko tuvo un buen día.`:`😶 Zasko tuvo un mal día.`, ev.good?'good':'bad'); }
  else if(ev.type==='pairv'){ const m=L.rounds[ev.j][ev.mi]; if(m){ const before=m.views||0; m.views=Math.round(before*ev.mult); ev.before=before; ev.after=m.views; ev.a=m.a; ev.b=m.b;
      const inc=Math.round((m.views-before)*VIEW_RATE); state.company.money+=inc; s.fin.income+=inc; s.fin.views=(s.fin.views||0)+inc; L.income+=inc; ev.inc=inc; }
    ev.done=true; ev.show=true; addLog(s, ev.day, ev.sub==='azuky'?'🌐 Azuky y Nota Roja rompen internet.':ev.sub==='rq'?'⚔️ Patrocinados de Quesada contra el Elegido de Gazir: la batalla gana visitas.':'👑 Batalla femenina: la batalla gana visitas.', 'good'); }
  else if(ev.type==='khan'){ ev.done=true; ev.show=true; addLog(s, ev.day, '📉 Un regreso decepcionante: Khan.', 'bad'); }
  else if(ev.type==='sweet'){ const f=fby(ev.fid); f.hype=Math.round((f.hype||0)*0.9*10)/10; ev.done=true; ev.show=true;
    addLog(s, ev.day, `😡 Los fans de Sweet Pain se enfadan en redes tras su derrota contra ${fname(ev.rival)}.`, 'bad'); }
  else if(ev.type==='ryker'){ const m=L.rounds[ev.j][ev.mi]; if(m){ const before=m.views||0; m.views=Math.round(before*1.35); ev.before=before; ev.after=m.views;
      const inc=Math.round((m.views-before)*VIEW_RATE); state.company.money+=inc; s.fin.income+=inc; s.fin.views=(s.fin.views||0)+inc; L.income+=inc; ev.inc=inc; ev.edit=1000000+Math.round(Math.random()*1800000); }
    ev.done=true; ev.show=true; addLog(s, ev.day, `🎬 Ryker sube un edit del minuto de ${fname(ev.fid)}: la batalla se dispara.`, 'good'); }
  else if(ev.type==='reggae'){ const m=L.rounds[ev.j][ev.mi]; if(m){ const before=m.views||0; m.views=Math.round(before*1.1); ev.before=before; ev.after=m.views;
      const inc=Math.round((m.views-before)*VIEW_RATE); state.company.money+=inc; s.fin.income+=inc; s.fin.views=(s.fin.views||0)+inc; L.income+=inc; ev.inc=inc; }
    ev.done=true; ev.show=true; addLog(s, ev.day, `🎶 ${fname(ev.fid)} se marcó un minutazo a puro reggae: la batalla gana visitas.`, 'good'); }
  else if(ev.type==='local'){ ev.ids.forEach(id=>{ const f=fby(id); if(f) f.hype=Math.round((f.hype||0)*0.9*10)/10; }); ev.done=true; ev.show=true;
    addLog(s, ev.day, `😤 Los fans se quejan del localismo con Aczino en el ${ev.comp==='fms'?INTL.name:RB_INT.name}: baja el hype.`, 'bad'); }
  else if(ev.type==='rival'){ const m= ev.comp==='fms' ? (ev.ri==='third' ? s.intl.bracket.third : s.intl.bracket.rounds[ev.ri][ev.mi]) : L.rounds[ev.j][ev.mi]; const before=m.views||0; m.views=Math.round(before*1.15); ev.before=before; ev.after=m.views;
    const inc=Math.round((m.views-before)*VIEW_RATE); state.company.money+=inc; s.fin.income+=inc; s.fin.views=(s.fin.views||0)+inc; if(L) L.income+=inc; ev.inc=inc;
    const V=RIVAL_VARS[ev.v||0]; ev.done=true; ev.show=true; addLog(s, ev.day, `${V[0].split(' ')[0]} ${rivalFill(V[1],ev)} (+15% de visitas).`, ev.v===14?'bad':'good'); }
  else if(ev.type==='viral'){ const B = ev.comp==='fms' ? s.intl.bracket : s.rb.inter.bracket; const m = ev.ri==='third' ? B.third : B.rounds[ev.ri][ev.mi];
    const before=m.views||0; m.views=Math.round(before*(ev.comp==='fms'?1.5:1.25)); ev.before=before; ev.after=m.views;
    if(ev.comp==='fms'){ const inc=Math.round((m.views-before)*VIEW_RATE); state.company.money+=inc; s.fin.income+=inc; s.fin.views=(s.fin.views||0)+inc; ev.inc=inc; }
    ev.done=true; ev.show=true; addLog(s, ev.day, `🌐 Chuty y Aczino rompen internet: su batalla no para de sumar visitas.`, 'gold'); }
  else if(ev.type==='unavail'){ const m=L.rounds[ev.j][ev.mi]; m.postponed=true; ev.rival = m.a===ev.fid ? m.b : m.a;
    addLog(s, ev.day, `${fname(ev.fid)} no estará en la J${ev.j+1} de ${ldef(ev.key).short}: ${ev.why||UQ_UNAV[fby(ev.fid).name].why}.`, 'bad'); }
  else if(ev.type==='recup'){ const m=L.rounds[ev.j][ev.mi]; const r=simulateFMSBattle(m, leagueHasFx(L.key,'nivel')?2:0); m.recup=true; m.postponed=false;
    m.views=Math.round(battleViews(m, 0.8*(1+0.08*state.company.stars))*0.5); m.views=Math.min(m.views, (fby(m.a).fama>=90||fby(m.b).fama>=90)?400000:100000); const inc=Math.round(m.views*VIEW_RATE);
    state.company.money+=inc; s.fin.income+=inc; s.fin.views=(s.fin.views||0)+inc; L.income+=inc; ev.done=true; ev.show=true;
    addLog(s, ev.day, `Batalla recuperativa de ${ldef(ev.key).short}: ${fname(r.W.id)} gana a ${fname(r.Lo.id)} (${m.lb}).`, 'good'); }
}
function uqAuto(s, ev){
  if(ev.type==='refuse'){ ev.done=true; }
  else if(ev.type==='papo'){ uqPapo(ev.id, true, true); }
  else if(ev.type==='unavail'){ const g=exhibEligible(s, ev.key)[0]; const days=uqRecupDays(s, ev); uqSetUnavail(ev.id, g&&g.id, days[0], true); }
  else ev.done=true;
  ev.show=false;
}
function uqCheckUnavailable(s, L, nd){
  const round=L.rounds[L.played]; if(!round) return;
  round.forEach((m,mi)=>{ if(m.postponed) return; [m.a,m.b].forEach(id=>{ const f=fby(id); const u=f&&UQ_UNAV[f.name]; if(!u || (u.first && L.played!==0)) return;
    if(round.some(x=>x.postponed)) return;
    if(Math.random()<u.p) uqPush(s, {day:s.day, type:'unavail', key:L.key, j:L.played, mi, fid:id, jday:nd}); }); });
}
function uqRecupDays(s, ev){
  const L=s.leagues[ev.key]; const dates=L.dates.slice().sort((a,b)=>a-b); const next=dates[ev.j+1]!=null?dates[ev.j+1]:Math.min(ev.jday+21, daysInYear(s.year)-1);
  const busy=new Set([...seasonEvents(s).map(e=>e.day), ...rbEventsList(s).map(e=>e.day), ...(s.under||[]).map(e=>e.day), ...((s.uq||[]).filter(x=>x.type==='recup').map(x=>x.day))]);
  if(rbOn(s)) busy.add(s.rb.inter.voteDay);
  const out=[]; for(let d=ev.jday+1; d<next; d++) if(!busy.has(d)) out.push(d);
  return out.length? out : [ev.jday+1];
}
function uqSetUnavail(evId, guestId, day, silent){
  const s=cur(); const ev=s.uq.find(x=>x.id===evId); if(!ev||ev.done) return;
  if(!guestId || day==null){ toast('Elige el invitado de la exhibición y la fecha de la recuperativa.'); return; }
  const L=s.leagues[ev.key]; const g=fby(guestId);
  if(!silent && uqExhibRefuses(s, g)){ toast(`${g.name} no está interesado en hacer una exhibición.`); state.ui.uqGuest=null; showUQ(ev); return; }
  const cost=exhibCost(g, ev.key);
  state.company.money-=cost; s.fin.salaries+=cost; state.ui.uqGuest=null; state.ui.uqDay=null; state.ui.uqQ='';
  if(!L.fexhib) L.fexhib={}; L.fexhib[ev.j]={a:ev.rival, b:guestId, missing:ev.fid, cost};
  const m=L.rounds[ev.j][ev.mi]; m.recupDay=+day;
  uqPush(s, {day:+day, type:'recup', key:ev.key, j:ev.j, mi:ev.mi});
  ev.done=true; if(!silent){ closeModal(); toast(`${fname(ev.rival)} hará exhibición contra ${g.name}. Recuperativa el ${fmtDay(s.year,+day)}.`); render(); }
}
function uqPapo(evId, accept, silent){
  const s=cur(); const ev=s.uq.find(x=>x.id===evId); if(!ev||ev.done) return; const L=s.leagues[ev.key];
  if(accept){ const extra=ev.newSal-(L.contracts[ev.fid]||0); state.company.money-=extra; s.fin.salaries+=extra; L.contracts[ev.fid]=ev.newSal;
    addLog(s, ev.day, `Papo cobrará ${money(ev.newSal)} esta temporada.`, 'gold'); }
  else { uqRemove(s, L, ev.fid); addLog(s, ev.day, `Papo se va de ${ldef(ev.key).name}: "FMS no paga lo que Papo gana".`, 'bad'); }
  ev.done=true; if(!silent){ closeModal(); render(); if(!accept) showReplace(ev.key); }
}
function uqZaskoRoll(s, L){ const z=state.freestylers.find(f=>f.name==='Zasko'); if(!z || !L.competitors.includes(z.id)) return null;
  const round=L.rounds[L.played]; if(!round || !round.some(m=>!m.postponed && (m.a===z.id||m.b===z.id))) return null;
  const r=Math.random(); if(r<0.15){ UQ_PERF[z.id]=14; return {id:z.id, good:true}; } if(r<0.30){ UQ_PERF[z.id]=-14; return {id:z.id, good:false}; } return null; }
function uqViewMult(s, L, m, zk){ let v=1; if(zk && (m.a===zk.id||m.b===zk.id)) v*= zk.good?1.15:0.85;
  if(L.skoneMx){ const sk=state.freestylers.find(f=>f.name==='Skone'); if(sk && (m.a===sk.id||m.b===sk.id)) v*=1.10; } return v; }
function uqAfterJornada(s, L, round, d, zk){
  if(zk) uqPush(s, {day:d+1, type:'zasko', key:L.key, fid:zk.id, good:zk.good});
  // enfrentamientos especiales (al día siguiente / a los dos días)
  const nm=id=>(fby(id)||{}).name; const R=L.rounds[L.played];
  const RQ=['Coloso','Alek','Segrelles','Navas','Triple R','Ander2K'], EL=['Dani VK','JM Serna','Dima'];
  const WOMEN=['NG','Azuky','Marithea','Sara Socas','Pandora','Sumeria','Necia','Bohemia','Piromana','Roma','Sandra','Eskai','Arcoiris','Adriana'];
  round.forEach(m=>{ if(!m.result) return; const a=nm(m.a), b=nm(m.b); const mi=R.indexOf(m);
    if([a,b].includes('Azuky') && [a,b].includes('Nota Roja') && Math.random()<0.75) uqPush(s, {day:d+2, type:'pairv', sub:'azuky', mult:1.35, key:L.key, j:L.played, mi, fid:m.a});
    if((RQ.includes(a)&&EL.includes(b))||(RQ.includes(b)&&EL.includes(a))) uqPush(s, {day:d+1, type:'pairv', sub:'rq', mult:1.05, key:L.key, j:L.played, mi, fid:m.a});
    if(WOMEN.includes(a) && WOMEN.includes(b)) uqPush(s, {day:d+1, type:'pairv', sub:'women', mult:1.15, key:L.key, j:L.played, mi, fid:m.a}); });
  const kh=state.freestylers.find(f=>f.name==='Khan');
  if(kh && L.played>=nJ(L.key)-1 && L.competitors.includes(kh.id)) uqPush(s, {day:d+1, type:'khan', key:L.key, fid:kh.id});
  [L.exhib&&L.exhib[L.played], L.fexhib&&L.fexhib[L.played]].forEach(x=>{ if(kh && x && x.m && (x.a===kh.id||x.b===kh.id)) uqPush(s, {day:d+1, type:'khan', key:L.key, fid:kh.id, ex:true}); });
  // Ryker: edit de un minutazo (7 días después)
  { const pl=round.filter(m=>m.result && m.d && m.d.s); if(pl.length){ const RS=roundsOf(pl[0]); const mins=RS.map((R,i)=>R.t==='min'?i:-1).filter(i=>i>=0);
      const ss=(m,r,sd)=>{ let t=0; for(let j=0;j<5;j++) t+=dScore(m,r,sd,j); return t; };
      const avg={}; mins.forEach(r=>{ let t=0,n=0; pl.forEach(m=>{ t+=ss(m,r,0)+ss(m,r,1); n+=2; }); avg[r]=t/n; });
      let best=null; pl.forEach(m=>[m.a,m.b].forEach((id,sd)=>{ if(!L.competitors.includes(id)) return; mins.forEach(r=>{ const ratio=ss(m,r,sd)/Math.max(1,avg[r]); if(!best||ratio>best.ratio) best={ratio, id, m}; }); }));
      if(best && best.ratio>=1.3){ const f=fby(best.id); const fk= f.fama>=85?1 : (f.fama>=75?0.45 : 0.1);
        if(Math.random()<0.7*fk+spkVal(L.key,'ryker')) uqPush(s, {day:d+7, type:'ryker', key:L.key, j:L.played, mi:L.rounds[L.played].indexOf(best.m), fid:best.id}); } } }
  // Sweet Pain pierde: sus fans se enfadan
  round.forEach((m,mi)=>{ if(!m.result) return; const Lo=fby(m.result.loser); if(Lo && Lo.name==='Sweet Pain' && Math.random()<0.2) uqPush(s, {day:d+1, type:'sweet', key:L.key, fid:Lo.id, rival:m.result.winner}); });
  // minutazo a puro reggae: si hizo un minuto por encima de la media de la jornada
  const played=round.filter(m=>m.result && m.d && m.d.s);
  if(played.length){ const RS=roundsOf(played[0]); const mins=RS.map((R,i)=>R.t==='min'?i:-1).filter(i=>i>=0);
    const sideSum=(m,r,sd)=>{ let t=0; for(let j=0;j<5;j++) t+=dScore(m,r,sd,j); return t; };
    const avg={}; mins.forEach(r=>{ let t=0,n=0; played.forEach(m=>{ t+=sideSum(m,r,0)+sideSum(m,r,1); n+=2; }); avg[r]=t/n; });
    played.forEach(m=>{ [m.a,m.b].forEach((id,sd)=>{ const f=fby(id); const p=f&&UQ_REGGAE[f.name]; if(!p) return;
      if(mins.some(r=>sideSum(m,r,sd)>avg[r]) && Math.random()<p) uqPush(s, {day:d+2, type:'reggae', key:L.key, j:L.played, mi:L.rounds[L.played].indexOf(m), fid:id}); }); }); }
  round.forEach(m=>{ if(!m.result) return; const W=fby(m.result.winner); const p=W&&UQ_PREP[W.name];
    if(p && Math.random()<p) uqPush(s, {day:d+3, type:'prep', key:L.key, fid:W.id, rival:m.result.loser});
    [m.a,m.b].forEach(id=>{ const f=fby(id); if(f && f.name==='Driu') uqPush(s, {day:d+1, type:'driu', key:L.key, fid:id, rival: id===m.a?m.b:m.a}); }); });
}
function uqViral(s, B, comp, d){
  const ch=state.freestylers.find(f=>f.name==='Chuty'), ac=state.freestylers.find(f=>f.name==='Aczino'); if(!ch||!ac||!B) return;
  const is=m=>m && ((m.a===ch.id&&m.b===ac.id)||(m.a===ac.id&&m.b===ch.id));
  B.rounds.forEach((r,ri)=>r.forEach((m,mi)=>{ if(is(m)) uqPush(s, {day:d+1, type:'viral', comp, ri, mi, fid:ch.id}); }));
  if(is(B.third)) uqPush(s, {day:d+1, type:'viral', comp, ri:'third', mi:0, fid:ch.id});
}
function uqFace(id){ const f=fby(id); return `<span class="fm-face lg" style="${avatarDivStyle(f)}">${avatarContent(f)}</span>`; }
function showUQ(ev){
  const s=cur(); const f=fby(ev.fid); const L=s.leagues[ev.key]; let body='', acts=`<button class="btn primary" onclick="uqClose('${ev.id}')">Seguir</button>`, title='', kick='⚡ Última hora';
  if(ev.type==='refuse'){ title = ev.kind==='concert' ? `${f.name} no puede compaginar la FMS con sus conciertos` : ev.kind==='retired' ? `${f.name} está retirado de las batallas` : `${f.name} no está interesado en estar en la FMS`;
    body = `<p>${ev.kind==='no' ? `Le devuelves su contrato (${money(contractCost(f,ev.key))}) y tienes que buscar a otro freestyler para ${ldef(ev.key).name}.` : `Le devuelves el contrato, pero dice que sí le apetece hacer alguna exhibición esta temporada, y por menos dinero de lo normal.`}</p>`;
    acts=`<button class="btn primary" onclick="uqClose('${ev.id}'); showReplace('${ev.key}')">Buscar sustituto</button>`; }
  else if(ev.type==='papo'){ title='"FMS no paga lo que Papo gana"'; body=`<p>Papo quiere cobrar <b>${money(ev.newSal)}</b> esta temporada en ${ldef(ev.key).name}.</p>`;
    acts=`<button class="btn danger" onclick="uqPapo('${ev.id}', false)">No pagar (buscar sustituto)</button><button class="btn primary" onclick="uqPapo('${ev.id}', true)">Pagar ${money(ev.newSal)}</button>`; }
  else if(ev.type==='prep'){ kick='🕵️ Polémica'; title=`Acusan a ${f.name} de usar preparadas`; body=`<p>Tras su victoria contra ${fnameH(ev.rival)} circulan vídeos que dicen que llevaba rimas preparadas. La comunidad está que arde con los jueces.</p><p class="neg-v"><b>−5% de hype</b> para ${nameH(f)}, ${fnameH(ev.rival)} y la próxima jornada de ${ldef(ev.key).short}.</p>`; }
  else if(ev.type==='driu'){ kick='🤯 Redes'; title='El público no ha entendido nada'; body=`<p>La batalla de ${nameH(f)} contra ${fnameH(ev.rival)} ha dejado a todo el mundo descolocado.</p><p class="neg-v"><b>−10% de hype</b> para los dos.</p>`; }
  else if(ev.type==='zasko'){ kick=ev.good?'🔥 Redes':'😶 Redes'; title=ev.good?'Zasko tuvo un buen día':'Zasko tuvo un mal día';
    body= ev.good ? `<p>Zasko se salió ayer. Su batalla está volando en YouTube: <b class="pos-v">+15% de visitas</b>.</p>` : `<p>A Zasko no le salió nada ayer. <b class="neg-v">−15% de hype</b>.</p>`; }
  else if(ev.type==='pairv'){ const T={azuky:['🌐 Internet','Azuky y Nota Roja rompen internet','La batalla está en todas partes.'], rq:['⚔️ Redes','Patrocinados de Quesada contra el Elegido de Gazir','El pique entre los dos bandos dispara la batalla.'], women:['👑 Redes','Batalla femenina','La comunidad se vuelca con la batalla.']}[ev.sub];
    kick=T[0]; title=T[1]; body=`<div class="ex-row" style="justify-content:center; font-size:17px">${miniAvatar(ev.a,28)} ${fnameH(ev.a)} <span class="vs">vs</span> ${fnameH(ev.b)} ${miniAvatar(ev.b,28)}</div><p>${T[2]}</p><p>▶ ${fmtViews(ev.before||0)} → <b class="pos-v">${fmtViews(ev.after||0)}</b>${ev.inc?` · <b class="pos-v">+${money(ev.inc)}</b>`:''}</p>`; }
  else if(ev.type==='khan'){ kick='📉 Redes'; title='Un regreso decepcionante'; body= ev.ex ? `<p>La exhibición de ${nameH(f)} ha sido un desastre. La comunidad no da crédito.</p>` : `<p>${nameH(f)} cierra la temporada en ${ldef(ev.key).name} sin ganar una sola batalla y con 0 puntos. La comunidad no da crédito.</p>`; }
  else if(ev.type==='sweet'){ kick='😡 Redes'; title='Los fans de Sweet Pain se enfadan'; body=`<p>No han digerido la derrota contra ${fnameH(ev.rival)} y lo están pagando en redes.</p><p class="neg-v"><b>−10% de hype</b> para ${nameH(f)}.</p>`; }
  else if(ev.type==='ryker'){ kick='🎬 YouTube'; title=`Ryker hace un edit del minuto de ${f.name}`;
    body=`<div class="uq-face"><img class="ryker-logo" src="${(typeof EXTRA_IMG!=='undefined'&&EXTRA_IMG.ryker)||''}" alt="Ryker"></div><p>El canal de Ryker ha subido un edit del minutazo de ${nameH(f)} y ya va por <b>${fmtViews(ev.edit||1000000)}</b> de visitas. La batalla original no para de subir.</p><p>▶ ${fmtViews(ev.before||0)} → <b class="pos-v">${fmtViews(ev.after||0)}</b>${ev.inc?` · <b class="pos-v">+${money(ev.inc)}</b>`:''}</p>`; }
  else if(ev.type==='reggae'){ kick='🎶 Redes'; title=`${f.name} hizo un minutazo a puro reggae`; body=`<p>El minuto de ${nameH(f)} se ha hecho viral y su batalla no para de sumar.</p><p>▶ ${fmtViews(ev.before||0)} → <b class="pos-v">${fmtViews(ev.after||0)}</b>${ev.inc?` · <b class="pos-v">+${money(ev.inc)}</b>`:''}</p>`; }
  else if(ev.type==='local'){ kick='😤 Redes'; title='Los fans se quejan del localismo'; body=`<p>${nameH(f)} gana el ${ev.comp==='fms'?INTL.name:RB_INT.name} en México y las redes se llenan de quejas: dicen que le favorecieron por jugar en casa.</p><p class="neg-v"><b>−10% de hype</b> para ${nameH(f)} y para todos los participantes.</p>`; }
  else if(ev.type==='rival'){ const V=RIVAL_VARS[ev.v||0]; kick=V[0]; title=esc(rivalFill(V[1],ev));
    body=`<div class="ex-row" style="justify-content:center; font-size:17px">${miniAvatar(ev.a,34)} ${fnameH(ev.a)} <span class="vs">vs</span> ${fnameH(ev.b)} ${miniAvatar(ev.b,34)}</div>
      <p>${esc(rivalFill(V[2],ev))}</p>
      <div class="rv-cmp"><div><small>Antes</small><b>${fmtViews(ev.before||0)}</b></div><span class="rv-arrow">→</span><div><small>Después</small><b class="pos-v">${fmtViews(ev.after||0)}</b></div></div>
      <p style="text-align:center"><b class="pos-v">+15% de visitas</b>${ev.inc?` · <b class="pos-v">+${money(ev.inc)}</b>`:''}</p>`; }
  else if(ev.type==='viral'){ kick='🌐 Internet'; title='Chuty y Aczino rompen internet'; body=`<p>La batalla de ayer en el ${ev.comp==='fms'?INTL.name:RB_INT.name} está en todas partes.</p><p>▶ ${fmtViews(ev.before||0)} → <b class="pos-v">${fmtViews(ev.after||0)}</b>${ev.inc?` · <b class="pos-v">+${money(ev.inc)}</b>`:''}</p>`; }
  else if(ev.type==='unavail'){ kick='📵 Baja'; title=`${f.name} no podrá estar en la J${ev.j+1}`; const ri=fby(ev.rival);
    const q=(state.ui.uqQ||'').toLowerCase(); const G=state.ui.uqGuest, D=state.ui.uqDay;
    const el=exhibEligible(s, ev.key).filter(x=>fMatch(x,q)).sort((a,b)=>b.fama-a.fama).slice(0,40); const days=uqRecupDays(s,ev);
    body=`<p>${nameH(f)} ${ev.why||UQ_UNAV[f.name].why}. ${nameH(ri)} hará una exhibición en su lugar y la batalla se jugará en una recuperativa antes de la siguiente jornada.</p>
      <div class="uq-split"><div class="uq-left"><div class="field-label" style="margin-top:10px">Rival de ${nameH(ri)} en la exhibición${G&&fby(G)?`: <b style="color:var(--white)">${nameH(fby(G))}</b>`:''}</div>
      <input id="uqQ" class="ex-q" placeholder="Buscar por nombre o país" value="${esc(state.ui.uqQ||'')}" oninput="state.ui.uqQ=this.value; showUQ(cur().uq.find(x=>x.id==='${ev.id}')); const e=document.getElementById('uqQ'); e.focus(); e.setSelectionRange(e.value.length,e.value.length);">
      <div class="pick-grid uq-grid">${el.map(x=>`<div class="pick-item ${G===x.id?'checked':''}" onclick="state.ui.uqGuest='${x.id}'; showUQ(cur().uq.find(y=>y.id==='${ev.id}'))">
        <span class="mini-avatar" style="width:32px;height:32px;font-size:15px;${avatarDivStyle(x)}">${avatarContent(x)}</span>
        <div style="min-width:0;"><div class="pname">${nameH(x)}</div>${styleTag(x)}<div class="pcountry">${esc(x.country)}</div></div>
        <div class="pick-stats">Nivel <b>${x.nivel}</b><br>Fama <b>${x.fama}</b><br><span class="sal">${moneyK(exhibCost(x,ev.key))}</span></div></div>`).join('')}</div></div>
      <div class="uq-right"><div class="field-label" style="margin-top:10px">Fecha de la recuperativa${D!=null?`: <b style="color:var(--white)">${fmtDay(s.year,D)}</b>`:''}</div>
      ${uqMiniCal(s, ev, days, D)}</div></div>`;
    acts=`<button class="btn primary" ${G&&D!=null?'':'disabled'} onclick="uqSetUnavail('${ev.id}', state.ui.uqGuest, state.ui.uqDay)">Confirmar</button>`; }
  else if(ev.type==='recup'){ const m=L.rounds[ev.j][ev.mi]; const p=ptbOf(m); kick='🎤 Recuperativa'; title=`Batalla recuperativa · J${ev.j+1} de ${ldef(ev.key).short}`;
    body=`<div class="ex-row" style="justify-content:center; font-size:18px">${miniAvatar(m.a,28)} ${fnameH(m.a)} <span class="vs">vs</span> ${fnameH(m.b)} ${miniAvatar(m.b,28)}</div>
      <p style="text-align:center">Gana <b>${fnameH(m.result.winner)}</b> ${esc(m.lb||'')} · PTB ${fpt(p[0])}–${fpt(p[1])} · ▶ ${fmtViews(m.views)}</p>`; }
  openModal(`<div class="uq">${['prep','driu','zasko','refuse','papo','unavail','sweet','reggae','khan','local'].includes(ev.type)&&f?`<div class="uq-face">${uqFace(f.id)}</div>`:''}<div class="st-kicker">${kick} · ${fmtDay(s.year,ev.day)}</div><h3 style="margin:4px 0 10px">${title}</h3>${body}</div>
    <div class="modal-actions">${acts}</div>`, ev.type==='unavail' ? 'uqwide' : undefined);
  themeEl(document.getElementById('modalRoot'), ev.key);
}
function uqMiniCal(s, ev, days, sel){
  const ok=new Set(days); const from=ev.jday-2, to=Math.max(...days)+1;
  const start=from - ((dayToDate(s.year,from).getUTCDay()+6)%7);   // empieza en lunes
  const end=to + (6-((dayToDate(s.year,to).getUTCDay()+6)%7));
  const MS=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  let h='<div class="mcal"><div class="mcal-h">'+['L','M','X','J','V','S','D'].map(x=>`<span>${x}</span>`).join('')+'</div><div class="mcal-g">';
  for(let d=start; d<=end; d++){ if(d<0 || d>=daysInYear(s.year)){ h+='<span class="mc off"></span>'; continue; }
    const dt=dayToDate(s.year,d); const n=dt.getUTCDate(); const lbl=(n===1||d===start)?`<small>${MS[dt.getUTCMonth()]}</small>`:'';
    const ev2=eventsByDay(s)[d]; const rb=rbByDay(s)[d];
    const cls = d===ev.jday ? 'jor' : (ok.has(d) ? (d===sel?'sel':'ok') : 'off');
    const tag = d===ev.jday ? 'J'+(ev.j+1) : (ev2 ? ldef(ev2.key).short : (rb ? 'RB' : ''));
    h+= ok.has(d) ? `<button class="mc ${cls}" onclick="state.ui.uqDay=${d}; showUQ(cur().uq.find(y=>y.id==='${ev.id}'))">${lbl}<b>${n}</b></button>` : `<span class="mc ${cls}">${lbl}<b>${n}</b>${tag?`<i>${tag}</i>`:''}</span>`; }
  return h+'</div></div>';
}
function uqClose(id){ const s=cur(); const ev=(s.uq||[]).find(x=>x.id===id); if(ev){ ev.show=false; if(ev.type==='refuse') ev.done=true; } closeModal(); render(); }
function showReplace(key){
  const s=cur(); const L=s.leagues[key]; const old=(L.pendingRep||[])[0]; if(!old){ render(); return; }
  const q=(state.ui.repQ||'').toLowerCase(); const list=uqCandidates(s,key).filter(f=>fMatch(f,q)).slice(0,60);
  openModal(`<h3>Sustituto para ${fnameH(old)} · ${ldef(key).name}</h3>
    <p class="step-note" style="margin-bottom:8px">Ocupará su plaza en todos sus cruces. Caja: ${money(state.company.money)}</p>
    <input id="repQ" placeholder="Buscar por nombre o país" value="${esc(state.ui.repQ||'')}" oninput="state.ui.repQ=this.value; showReplace('${key}'); const e=document.getElementById('repQ'); e.focus(); e.setSelectionRange(e.value.length,e.value.length);">
    <div class="pick-grid rep-grid">${list.map(f=>{ const c=contractCost(f,key); const fx=isForeign(f,key); return `<div class="pick-item" onclick="pickReplace('${key}','${old}','${f.id}')">
      <span class="mini-avatar" style="width:32px;height:32px;font-size:15px;${avatarDivStyle(f)}">${avatarContent(f)}</span>
      <div style="min-width:0;"><div class="pname">${nameH(f)}</div>${styleTag(f)}<div class="pcountry">${esc(f.country)}${fx?' <span class="tag-mini foreign">✈ viajes</span>':''}</div></div>
      <div class="pick-stats">Nivel <b>${f.nivel}</b><br>Fama <b>${f.fama}</b><br>Hype <b>${Math.round(f.hype||0)}</b><br><span class="sal">${moneyK(c)}</span></div></div>`; }).join('') || '<div class="step-note">Nadie coincide con la búsqueda.</div>'}</div>`, true);
}
function pickReplace(key, old, id){ const s=cur(); const f=fby(id); const c=contractCost(f,key); if(state.company.money<c){ toast(`No te llega: ${fname(id)} pide ${money(c)}.`); return; }
  const r=UQ_REFUSE[f.name]; if(r && !r.papo && !state.company.infinite && Math.random()<r.p-spkVal(key,'refuse')){ if(!s.refused) s.refused=[]; s.refused.push(id); if(r.kind) f.exOffer=s.year;
    toast(r.kind==='concert'?`${f.name} no puede compaginarlo con sus conciertos.`:r.kind==='retired'?`${f.name} está retirado de las batallas.`:`${f.name} tampoco está interesado en estar en la FMS.`); showReplace(key); return; }
  uqReplace(s,key,old,id); state.ui.repQ=''; closeModal(); const L=s.leagues[key]; if(L.pendingRep&&L.pendingRep.length) showReplace(key); else { toast(`${fname(id)} entra en ${ldef(key).name}.`); render(); } }

/* ---------- exhibiciones ---------- */
function exViewMult(m){ return ((fby(m.a).fama<80 || fby(m.b).fama<80) ? 0.5 : 0.7) * 0.75; }   // con el 0,8 de la liga: un 40% menos que antes
const EXH_UNKNOWN=60, EXH_FAMOUS=80;   // fama por debajo = desconocido · fama desde = con bastante fama
function exhibCost(f, key){ const y=cur()&&cur().year; const disc=(f.exOffer===y && UQ_REFUSE[f.name]) ? (UQ_REFUSE[f.name].exDisc||0) : 0; return Math.max(100, Math.round(contractCost(f,key)*0.025*(1-disc)*(1-fxVal(key,'exfee'))/100)*100); }
function exhibBusy(s){ const set=new Set(); s.activeKeys.forEach(k=>{ const L=s.leagues[k]; Object.entries(L.exhib||{}).forEach(([j,x])=>{ if(+j>=L.played){ set.add(x.a); set.add(x.b); } }); }); return set; }
function exhibEligible(s, key){ const busy=exhibBusy(s); const own=new Set(key&&s.leagues[key]?s.leagues[key].competitors:[]); return state.freestylers.filter(f=>!own.has(f.id) && !busy.has(f.id)); }
function renderExhib(s, L, key, j){
  const ex=L.exhib && L.exhib[j];
  if(ex && ex.m && ex.m.result){ const m=ex.m, r=m.result, p=ptbOf(m);
    return `<div class="ex-box done"><div class="ex-h">🎤 Exhibición</div><div class="ex-row">${miniAvatar(m.a,22)} ${fnameH(m.a)} <span class="vs">vs</span> ${fnameH(m.b)} ${miniAvatar(m.b,22)}</div>
      <div class="step-note">Gana ${fnameH(r.winner)}${r.tiebreak?' en réplica':''} · PTB ${fpt(p[0])}–${fpt(p[1])}${m.views?' · ▶ '+fmtViews(m.views):''}</div></div>`; }
  if(s.phase!=='live' || L.finished || j!==L.played) return '';
  if(ex){ return `<div class="ex-box"><div class="ex-h">🎤 Exhibición en esta jornada</div><div class="ex-row">${miniAvatar(ex.a,22)} ${fnameH(ex.a)} <span class="vs">vs</span> ${fnameH(ex.b)} ${miniAvatar(ex.b,22)}</div>
      <div class="step-note">Coste ${money(ex.cost)} · la jornada tendrá 6 batallas. A los 7 días la comunidad dirá si los quiere en la FMS.</div>
      <button class="btn small danger" style="margin-top:8px" onclick="cancelExhib('${key}')">Cancelar (se devuelve el dinero)</button></div>`; }
  const A=state.ui['exA_'+key]||'', B=state.ui['exB_'+key]||''; const q=(state.ui['exQ_'+key]||'').toLowerCase();
  const el=exhibEligible(s, key).filter(f=>fMatch(f,q)).sort((a,b)=>b.fama-a.fama).slice(0,48);
  const cost=(A&&fby(A)?exhibCost(fby(A),key):0)+(B&&fby(B)?exhibCost(fby(B),key):0);
  const slot=(id,lbl)=>{ const f=id&&fby(id); return f? `<button class="ex-slot on" onclick="exPick('${key}','${id}')" title="Quitar">${miniAvatar(id,34)}<span><b>${nameH(f)}</b><small>${esc(f.country)} · fama ${f.fama} · ${moneyK(exhibCost(f,key))}</small></span><i>✕</i></button>` : `<div class="ex-slot"><span class="sp-plus">+</span><span><b>${lbl}</b><small>Elige abajo</small></span></div>`; };
  return `<div class="ex-box"><div class="ex-h">🎤 Exhibición (opcional)</div>
    <p class="step-note">Prueba a dos freestylers que no están en ninguna FMS. Pueden estar compitiendo en otra FMS. Cobran una pequeña parte de su salario (los extranjeros, con sus viajes). Si hacen buena batalla la comunidad los pedirá para la próxima temporada.</p>
    <div class="ex-slots">${slot(A,'Freestyler 1')}<span class="vs">VS</span>${slot(B,'Freestyler 2')}</div>
    <input id="exQ_${key}" class="ex-q" placeholder="Buscar por nombre o país" value="${esc(state.ui['exQ_'+key]||'')}" oninput="state.ui['exQ_${key}']=this.value; render()">
    <div class="pick-grid ex-grid">${el.map(f=>{ const on=f.id===A||f.id===B; return `<div class="pick-item ${on?'checked':''}" onclick="exPick('${key}','${f.id}')">
      <span class="mini-avatar" style="width:32px;height:32px;font-size:15px;${avatarDivStyle(f)}">${avatarContent(f)}</span>
      <div style="min-width:0;"><div class="pname">${nameH(f)}</div>${styleTag(f)}<div class="pcountry">${esc(f.country)}</div></div>
      <div class="pick-stats">Nivel <b>${f.nivel}</b><br>Fama <b>${f.fama}</b><br><span class="sal">${moneyK(exhibCost(f,key))}</span></div></div>`; }).join('') || '<div class="step-note">Nadie coincide con la búsqueda.</div>'}</div>
    <button class="btn small primary" style="margin-top:8px" ${A&&B&&A!==B?'':'disabled'} onclick="organizeExhib('${key}')">Organizar exhibición${cost?' · '+money(cost):''}</button></div>`;
}
function exPick(key, id){ const a='exA_'+key, b='exB_'+key;
  if(state.ui[a]===id) delete state.ui[a]; else if(state.ui[b]===id) delete state.ui[b]; else if(!state.ui[a]) state.ui[a]=id; else state.ui[b]=id; render(); }
function organizeExhib(key){
  const s=cur(); const L=s.leagues[key]; const a=state.ui['exA_'+key], b=state.ui['exB_'+key];
  if(!a||!b||a===b) return; const el=new Set(exhibEligible(s, key).map(f=>f.id)); if(!el.has(a)||!el.has(b)){ toast('Alguno de los dos ya no está disponible.'); return; }
  for(const id of [a,b]){ if(uqExhibRefuses(s, fby(id))){ toast(`${fname(id)} no está interesado en hacer una exhibición.`); return; } }
  const cost=exhibCost(fby(a),key)+exhibCost(fby(b),key);
  if(state.company.money<cost){ toast(`No te llega: la exhibición cuesta ${money(cost)}.`); return; }
  if(!L.exhib) L.exhib={}; L.exhib[L.played]={a,b,cost};
  state.company.money-=cost; s.fin.salaries+=cost; delete state.ui['exA_'+key]; delete state.ui['exB_'+key];
  toast(`Exhibición cerrada: ${fname(a)} vs ${fname(b)} en la J${L.played+1}.`); render();
}
function cancelExhib(key){ const s=cur(); const L=s.leagues[key]; const ex=L.exhib&&L.exhib[L.played]; if(!ex||ex.m) return;
  state.company.money+=ex.cost; s.fin.salaries-=ex.cost; delete L.exhib[L.played]; render(); }
function applyExhibEvent(s, xe){
  xe.done=true;
  // desconocido + alguien con bastante fama, y los dos la rompen: el desconocido se dispara (+6 de fama en vez de +2)
  const fs=xe.ids.map(fby); xe.fg=xe.ids.map((id,i)=>{ if(!xe.good[i]) return 0; const o=fs[1-i];
    return (xe.good[0] && xe.good[1] && fs[i] && o && fs[i].fama<EXH_UNKNOWN && o.fama>=EXH_FAMOUS) ? 6 : 2; });
  xe.ids.forEach((id,i)=>{ const f=fby(id); if(!f) return; const g=xe.good[i];
    addHype(id, g?12:-10); if(g) addFama(id,xe.fg[i]); else addFama(id,-2);
    f.demand={year:s.year+1, good:g}; const lk=signedLeagueOf(s,id); if(!xe.lk) xe.lk=[]; xe.lk[i]=(lk && lk!==xe.key) ? lk : null; });
  addLog(s, xe.day, `🎤 Exhibición de ${ldef(xe.key).short}: ${xe.ids.map((id,i)=>`${fname(id)} ${xe.good[i]?'convence a la comunidad':'no convence'}`).join(' · ')}.`, xe.good.some(Boolean)?'good':'bad');
}
function showExhibEvent(xe){
  const s=cur();
  openModal(`<div class="st-kicker">🎤 La comunidad opina · ${fmtDay(s.year,xe.day)}</div>
    <h3 style="margin:4px 0 12px">Exhibición de ${ldef(xe.key).name} (J${xe.j+1})</h3>
    <div class="ex-verdicts">${xe.ids.map((id,i)=>{ const f=fby(id); const g=xe.good[i];
      return `<div class="ex-v ${g?'good':'bad'}"><span class="fm-face" style="${avatarDivStyle(f)}">${avatarContent(f)}</span><div><b>${nameH(f)}</b>
        <div>${g?((xe.lk&&xe.lk[i])?`La comunidad quiere que se traspase a ${ldef(xe.key).name}`:`La comunidad lo quiere en la FMS ${s.year+1}`):((xe.lk&&xe.lk[i])?`La comunidad no lo quiere en ${ldef(xe.key).name}`:'La comunidad no lo quiere en la FMS')}</div>
        <small class="${g?'pos-v':'neg-v'}">${g?`+12 hype · +${(xe.fg&&xe.fg[i])||2} fama${(xe.fg&&xe.fg[i])===6?' · ¡el desconocido se da a conocer!':''}`:'−10 hype · −2 fama'}</small></div></div>`; }).join('')}</div>
    <div class="modal-actions"><button class="btn primary" onclick="closeModal(); render()">Seguir</button></div>`);
  themeEl(document.getElementById('modalRoot'), xe.key);
}
function scheduleStream(s, key, j, d){
  if(Math.random()>STREAM_CHANCE) return;
  const ks=Object.keys(STREAMERS); const who=ks[Math.floor(Math.random()*ks.length)];
  if(!s.streams) s.streams=[];
  const pg=Math.min(0.95, STREAMERS[who].pGood + fxVal(key,'stream'));
  s.streams.push({day:d+1, key, j, who, good:Math.random()<pg, done:false});
}
function applyStream(s, st){
  const L=s.leagues[st.key]; st.done=true; st.shield=leagueHasFx(st.key,'shield');
  const exs=[L.exhib&&L.exhib[st.j], L.fexhib&&L.fexhib[st.j]].filter(x=>x&&x.m&&x.m.result);
  const round=[...exs.map(x=>x.m), ...L.rounds[st.j].filter(m=>m.result && !m.recup)];
  const absent=new Set(L.fexhib&&L.fexhib[st.j] ? [L.fexhib[st.j].missing] : []);
  const hIds=[...new Set([...L.competitors.filter(id=>!absent.has(id)), ...exs.flatMap(x=>[x.a,x.b])])];
  if(st.good){
    st.rows=round.map(m=>{ const before=m.views||0; m.views=Math.round(before*1.1); return [m.a,m.b,before,m.views]; });
    const extra=st.rows.reduce((a,r)=>a+(r[3]-r[2]),0); st.extra=Math.round(extra*VIEW_RATE);
    state.company.money+=st.extra; s.fin.income+=st.extra; s.fin.views=(s.fin.views||0)+st.extra; L.income+=st.extra;
    // y +10% de hype a toda la plantilla (mínimo +2 para que se note en los que tienen poco)
    st.hrows=hIds.map(id=>{ const f=fby(id); const before=f.hype||0; f.hype=Math.round(clamp(before+Math.max(before*0.1,2),1,99)*10)/10; return [id,before,f.hype]; });
    addLog(s, st.day, `📺 <b>${STREAMERS[st.who].name}</b> habló bien de la J${st.j+1} de ${ldef(st.key).name} en su stream: +10% visitas (+${moneyK(st.extra)}) y +10% de hype a la plantilla.`, 'good');
  } else {
    st.rows=hIds.map(id=>{ const f=fby(id); const before=f.hype||0; f.hype=Math.round(before*(st.shield?0.95:0.9)*10)/10; return [id,before,f.hype]; });
    addLog(s, st.day, `📺 <b>${STREAMERS[st.who].name}</b> habló mal de la J${st.j+1} de ${ldef(st.key).name} en su stream: −10% de hype a toda la plantilla.`, 'bad');
  }
}
function showStream(st){
  const S=STREAMERS[st.who]; const s=cur();
  const body = st.good
    ? `<div class="st-table"><div class="st-h"><span>Batalla</span><span>Antes</span><span>Después</span></div>${st.rows.map(([a,b,bf,af])=>`<div class="st-r"><span>${fnameH(a)} <i>vs</i> ${fnameH(b)}</span><span>${bf.toLocaleString('es-ES')}</span><span class="pos-v">${af.toLocaleString('es-ES')} <small>+${(af-bf).toLocaleString('es-ES')}</small></span></div>`).join('')}</div>
       <div class="st-total">Total extra: <b class="pos-v">+${st.rows.reduce((x,r)=>x+r[3]-r[2],0).toLocaleString('es-ES')} visitas</b> · <b class="pos-v">+${money(st.extra)}</b></div>
       ${st.hrows?`<button class="st-more" onclick="const x=document.getElementById('stHype'); const o=x.hidden; x.hidden=!o; this.classList.toggle('open',o); this.querySelector('span').textContent=o?'Ocultar aumento de hype':'Ver aumento de hype';" aria-controls="stHype"><i>▼</i><span>Ver aumento de hype</span></button><div id="stHype" hidden><div class="st-table"><div class="st-h"><span>Freestyler</span><span>Hype antes</span><span>Después</span></div>${st.hrows.map(([id,bf,af])=>`<div class="st-r"><span>${fnameH(id)}</span><span>${Math.round(bf)}</span><span class="pos-v">${Math.round(af)} <small>+${Math.round(af-bf)}</small></span></div>`).join('')}</div></div>`:''}`
    : `<div class="st-table"><div class="st-h"><span>Freestyler</span><span>Hype antes</span><span>Después</span></div>${st.rows.map(([id,bf,af])=>`<div class="st-r"><span>${fnameH(id)}</span><span>${Math.round(bf)}</span><span class="neg-v">${Math.round(af)} <small>−${Math.round(bf-af)}</small></span></div>`).join('')}</div>`;
  openModal(`<div class="st-top">${streamerPhoto(S)?`<img class="st-photo ${st.good?'good':'bad'}" src="${streamerPhoto(S)}" alt="${esc(S.name)}">`:`<div class="st-photo st-init ${st.good?'good':'bad'}">${esc(S.name[0])}</div>`}<div>
      <div class="st-kicker">📺 En directo · ${fmtDay(s.year,st.day)}</div>
      <h3 style="margin:2px 0 4px">${esc(S.name)} ha hablado ${st.good?'bien':'mal'} de tu jornada</h3>
      <p class="step-note">${st.good?`Le gustó la J${st.j+1} de ${ldef(st.key).name}. Sus seguidores van a verla: <b>+10% de visitas</b> en todas las batallas y <b>+10% de hype</b> a tus competidores de esta liga.`:`No le gustó la J${st.j+1} de ${ldef(st.key).name}. La conversación se vuelve en contra: <b>−${st.shield?5:10}% de hype</b> a tus competidores de esta liga${st.shield?' (Twitch amortigua el golpe)':''}.`}</p></div></div>
    ${body}
    <div class="modal-actions"><button class="btn primary" onclick="closeModal(); render()">Seguir</button></div>`, 'wide stream');
  themeEl(document.getElementById('modalRoot'), st.key);
}

