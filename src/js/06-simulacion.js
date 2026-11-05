/* =========================================================================
   SIMULACIÓN
========================================================================= */
function addLog(s, day, text, type){ s.log.unshift({day, text, type:type||''}); if(s.log.length>200) s.log.length=200; }
function avgFama(ids){ return ids.length ? ids.reduce((a,id)=>a+fby(id).fama,0)/ids.length : 0; }

function styleVariety(ids){
  const c={}; ids.forEach(id=>{ const st=styleOf(fby(id)); c[st]=(c[st]||0)+1; });
  const n=Object.keys(c).length, max=Math.max(0,...Object.values(c));
  const rep=Object.entries(c).filter(([k,v])=>v>=4).map(([k])=>k);
  const bonus = rep.length ? -25 : Math.round(Math.max(0,n-3)*2.5);
  return {n, max, rep, bonus, counts:c};
}
function startSeason(){
  const s=cur(); const issues=preseasonIssues(s);
  if(issues.length){ toast(issues[0]); return; }
  const stars=state.company.stars;
  s.activeKeys.forEach(k=>{
    const L=s.leagues[k];
    L.dates.sort((a,b)=>a-b);
    L.rounds= isWS(k) ? wsBuildRounds(L) : buildRoundRobin(shuffle(L.competitors));
    let h = 30 + avgFama(L.competitors)*0.35 + stars*3;
    if(L.prevHype!=null) h += (L.prevHype-50)*0.2;
    const sv=styleVariety(L.competitors); h += sv.bonus; L.styleVar=sv;
    if(isWS(k)){ const nc={}; L.competitors.forEach(id=>{ const c=fby(id).country; nc[c]=(nc[c]||0)+1; }); const rep4=Object.entries(nc).filter(([c,v])=>v>=4).map(([c])=>c);
      if(rep4.length){ L.competitors.forEach(id=>{ const f=fby(id); f.hype=Math.round(clamp((f.hype||50)*0.9,1,99)*10)/10; });
        addLog(s, 0, `${WS.name}: la comunidad se queja de que el cartel tiene demasiados de ${rep4.join(' y ')}. La plantilla pierde un 10% de hype.`, 'bad'); } }
    const sk=state.freestylers.find(f=>f.name==='Skone'); L.skoneMx=false;
    if(k==='fms_mexico' && sk && L.competitors.includes(sk.id)){ sk.hype=99; L.skoneMx=true; addLog(s, 0, '🇲🇽 Skone llega a FMS México y revienta las redes: hype al máximo, +10% de taquilla en la liga y sus batallas tendrán un 10% más de visitas.', 'gold'); }
    if(sv.rep.length){ L.competitors.forEach(id=>{ const f=fby(id); f.hype=Math.round(clamp((f.hype||50)*0.8,1,99)*10)/10; });
      addLog(s, 0, `${ldef(k).name}: demasiados ${sv.rep.join(' y ')} en el cartel. El público lo ve repetitivo: la liga arranca con mucho menos hype y la plantilla pierde un 20%.`, 'bad'); }
    else if(sv.bonus>0) addLog(s, 0, `${ldef(k).name}: cartel variado (${sv.n} estilos distintos), +${sv.bonus} de hype de salida.`, 'good');
    L.hype = clamp(Math.round(h),5,95);
    L.lastEventDay = -14; L.played=0; L.finished=false;
  });
  s.phase='live'; s.day=0; state.ui.calMonth=null;
  rbDraw(s);
  s.repStart=state.company.reputation; s.starsStart=state.company.stars;
  addLog(s, 0, `Arranca la temporada ${s.year} con ${s.activeKeys.length} liga(s)${s.intlEnabled?' + Internacional':''}.`, 'gold');
  goto('dashboard');
}

/* ---------- Hype de freestylers ---------- */
const HYPE_STREAK = 0.6;    // por victoria: 0,6 × racha (1ª +0,6, 2ª +1,2, 3ª +1,8…)
const LEGEND_HYPE = 1.5;   // las leyendas ganan un 50% más de hype
function absDay(){ const s=cur(); return s? s.year*366+(s.day||0) : 0; }
function addHype(id, n){ const f=fby(id); if(!f||!n) return; if(n>0 && f.legend) n*=LEGEND_HYPE; f.hype=Math.round(clamp((f.hype||50)+n,1,99)*10)/10; }
function hypeOf(id){ const f=fby(id); return f? Math.round(f.hype||0) : 0; }
function isUpset(W, Lo){ return (Lo.nivel-W.nivel)>=8 || (Lo.legend && !W.legend && Lo.nivel>W.nivel); }
function battleHype(W, Lo){
  W.lastB=Lo.lastB=absDay();
  W.streak=(W.streak||0)+1; Lo.streak=0;
  let g=Math.min(HYPE_STREAK*W.streak, 6);
  if(isUpset(W,Lo)) g += 2 + Math.max(0,Lo.nivel-W.nivel)*0.35 + (Lo.legend?3:0);
  addHype(W.id, g);
}
// premios de hype por competiciones (final, título y finales "imposibles")
function finalHype(champ, runner, big){
  const C=fby(champ), R=fby(runner); if(!C||!R) return '';
  addHype(runner, big?8:3);
  addHype(champ, big?14:6);
  if(isUpset(C,R)){ const extra=(big?14:8)+Math.max(0,R.nivel-C.nivel)*0.6; addHype(champ, extra); return ` ¡Final sorpresa! ${C.name} dispara su hype.`; }
  return '';
}
function simulateBattle(m, bonus){
  const A=fby(m.a), B=fby(m.b);
  const na=A.nivel+(bonus?bonus(A.id):0), nb=B.nivel+(bonus?bonus(B.id):0);
  const pA = 1/(1+Math.pow(10,(nb-na)/18));
  const aWins = Math.random()<pA;
  const W=aWins?A:B, Lo=aWins?B:A;
  const diff=Math.abs(A.nivel-B.nivel);
  const tiebreak = Math.random() < (diff<6?0.32:(diff<12?0.2:0.1));
  m.result={winner:W.id, loser:Lo.id, tiebreak};
  battleHype(W, Lo);
  return {upset: (Lo.nivel-W.nivel)>=10, tiebreak, W, Lo};
}

function runLeagueJornada(s, L, d){
  const def=ldef(L.key); const stars=state.company.stars;
  const round=L.rounds[L.played]; const jn=L.played+1;
  let replicas=0, upsets=0, highlight=null;
  const ord=isWS(L.key) ? noBackToBack(jornadaOrder(round), round) : jornadaOrder(round); if(!L.ord) L.ord=[]; L.ord[L.played]=ord;
  WS_SHORT = isWS(L.key);
  const zk=uqZaskoRoll(s, L);
  if(isWS(L.key) && L.wsSede && L.wsSede[L.played]){ const sd=L.wsSede[L.played]; round.forEach(m=>[m.a,m.b].forEach(id=>{ const f=fby(id); if(f && f.country===sd) UQ_PERF[id]=(UQ_PERF[id]||0)+LOCAL_BONUS; })); }   // Zasko: buen o mal día (se sabe al día siguiente)
  ord.forEach(([i])=>{ const m=round[i]; if(m.postponed || !m.b) return;
    const r=simulateFMSBattle(m, fxVal(L.key,'nivel')+spkLv(L.key));
    if(r.tiebreak) replicas++;
    if(r.upset){ upsets++; if(!highlight) highlight=`sorpresa: ${r.W.name} tumba a ${r.Lo.name}`; }
  });
  if(!highlight && replicas) { const m=round.find(x=>x.result && x.result.tiebreak); highlight=`${fname(m.result.winner)} gana a ${fname(m.result.loser)} en réplica`; }
  const prime=isPrimeDay(s.year,d) || leagueHasFx(L.key,'weekday');
  const income = Math.round((isWS(L.key)?2.2:1) * (L.skoneMx?1.1:1) * ((L.key==='fms_chile'||L.key==='fms_mexico')?1.3:1) * (5000 + avgFama(L.competitors)*110) * (0.35 + L.hype/70) * (1+0.06*stars) * (prime?1:WEEKDAY_TICKET) * TICKET_MULT * (1+fxVal(L.key,'ticket')));
  const vmBase=0.8*(isWS(L.key)?1.6:1)*(1+0.08*stars)*(1+fxVal(L.key,'views'))*(leagueHasFx(L.key,'nivel')?1.03:1);
  const vm=vmBase*(isWS(L.key)?0.4:0.7);
  UQ_PERF={};
  SPK_BH=spkVal(L.key,'bhype'); RIVAL_DEFER=true; round.forEach(m=>{ m.views = (m.postponed||!m.b) ? 0 : Math.round(battleViews(m, vm)*uqViewMult(s,L,m,zk)); }); RIVAL_DEFER=false;
  round.forEach((m,mi)=>{ if(m.views && isRival(m.a,m.b) && Math.random()<0.75) uqPush(s, {day:d+1, type:'rival', key:L.key, j:L.played, mi, a:m.a, b:m.b, w:m.result&&m.result.winner, v:rint(0,13)}); });
  const fx = L.fexhib && L.fexhib[L.played];
  if(fx && fby(fx.a) && fby(fx.b)){ const m=fx.m={id:uid('x'), a:fx.a, b:fx.b, result:null, ex:true, forced:true}; simulateFMSBattle(m, (leagueHasFx(L.key,'nivel')?2:0)+spkLv(L.key)); m.views=Math.round(battleViews(m, vmBase)*exViewMult(m)); }
  const ex = L.exhib && L.exhib[L.played];
  if(ex && fby(ex.a) && fby(ex.b)){
    const m=ex.m={id:uid('x'), a:ex.a, b:ex.b, result:null, ex:true};
    simulateFMSBattle(m, (leagueHasFx(L.key,'nivel')?2:0)+spkLv(L.key)); m.views=Math.round(battleViews(m, vmBase)*exViewMult(m));
    const all=round.filter(r=>r.result).flatMap(r=>ptbOf(r)); const avg=all.reduce((a,x)=>a+x,0)/Math.max(1,all.length); const p=ptbOf(m);
    ex.good=[p[0]>=avg*0.97 || (m.result.winner===m.a && p[0]>=avg*0.9), p[1]>=avg*0.97 || (m.result.winner===m.b && p[1]>=avg*0.9)];
    if(!s.exEvents) s.exEvents=[];
    s.exEvents.push({day:d+7, key:L.key, j:L.played, ids:[ex.a,ex.b], good:ex.good.slice(), done:false});
  }
  WS_SHORT=false; SPK_BH=0;
  const views = round.reduce((a,m)=>a+m.views,0) + (ex&&ex.m ? ex.m.views : 0) + (fx&&fx.m ? fx.m.views : 0);
  uqAfterJornada(s, L, round, d, zk);
  const viewsIncome = Math.round(views*VIEW_RATE);
  // MVP: más puntos sumando los 5 jueces
  let mvp=null; round.forEach(m=>{ const p=ptbOf(m); if(!p) return; [[m.a,p[0]],[m.b,p[1]]].forEach(([id,pts])=>{ if(!L.competitors.includes(id)) return; if(!mvp||pts>mvp.pts) mvp={id,pts}; }); });
  if(!L.mvps) L.mvps=[]; L.mvps[L.played]=mvp;
  if(mvp && leagueHasFx(L.key,'mvp')){ addFama(mvp.id,2); addHype(mvp.id,4); }
  { const hv=fxVal(L.key,'hype'); if(hv) L.competitors.forEach(id=>addHype(id,hv)); }
  const spon = sponsorIncome(L.key);
  const cost = Math.round((7600 + 1000*stars + 500*(s.activeKeys.length-1)) * (1-fxVal(L.key,'prod')));   // producción: más cara cuanto más grande es la empresa
  state.company.money += income + viewsIncome + spon - cost;
  s.fin.sponsors=(s.fin.sponsors||0)+spon;
  s.fin.income += income + viewsIncome + spon; s.fin.views=(s.fin.views||0)+viewsIncome; s.fin.production += cost; L.income += income + viewsIncome;
  const rep = Math.round(L.hype/8 + replicas + upsets) + fxVal(L.key,'rep');
  state.company.reputation += rep;
  const hypeGain = 5 + replicas*1.5 + upsets*2;
  L.hype = clamp(L.hype + hypeGain, 0, 100);
  scheduleStream(s, L.key, L.played, d);
  L.played++; L.lastEventDay=d;
  addLog(s, d, `<b>${def.name} · J${jn}</b>: ${highlight||'5 batallas sin sorpresas'}. MVP ${mvp?fname(mvp.id):'—'}. Taquilla ${moneyK(income)}${prime?'':' (entre semana)'}, ${fmtViews(views)} visitas (${moneyK(viewsIncome)})${spon?`, patrocinios ${moneyK(spon)}`:''}, +${rep} rep.`, 'good');
  if(L.played>=nJ(L.key)){
    L.finished=true;
    L.finalStandings=computeStandings(L).map(r=>r.id);
    L.relegated= isWS(L.key) ? [] : L.finalStandings.slice(-2);
    addHype(L.finalStandings[0], 6); addHype(L.finalStandings[1], 2); try{ chGenerate(s, L.key); }catch(e){ console.error(e); }
    addLog(s, d, `🏆 <b>${fname(L.finalStandings[0])}</b> campeón de ${def.name}.${L.relegated.length?` Descienden ${L.relegated.map(fname).join(' y ')}.`:''}`, 'gold');
  }
}

/* --- clasificación al Internacional (mismo sistema que el gestor original) --- */
function bestOf(ids, s){
  // desempate para comodines: puntos en su liga, luego nivel
  const pts={};
  natKeys(s).forEach(k=>{ computeStandings(s.leagues[k]).forEach(r=> pts[r.id]=r.pts); });
  return ids.slice().sort((a,b)=> (pts[b]||0)-(pts[a]||0) || fby(b).nivel-fby(a).nivel);
}
function intlQualifiers(s){
  const keys=natKeys(s); const n=keys.length;
  const st=k=> s.leagues[k].finalStandings;
  if(n===4){ const out=[]; for(let p=0;p<4;p++) keys.forEach(k=> out.push(st(k)[p])); return {ids:out, note:'Top 4 de cada liga.'}; }
  if(n===5){
    const out=[]; for(let p=0;p<3;p++) keys.forEach(k=> out.push(st(k)[p]));
    const wc=bestOf(keys.map(k=>st(k)[3]), s)[0]; out.push(wc);
    return {ids:out, note:`Top 3 de cada liga + comodín: ${fname(wc)} (mejor cuarto).`, wildcards:[wc]};
  }
  // 6 ligas: top 2 (12) + cupo de campeón + 3 comodines entre terceros
  const D=s.defendingChampion; const top2=[]; keys.forEach(k=>{ top2.push(st(k)[0], st(k)[1]); });
  let dKey=null, dPos=null;
  if(D) keys.forEach(k=>{ const i=st(k).indexOf(D); if(i>=0 && dKey==null){ dKey=k; dPos=i; } });
  let extra=null, exclude=null, note='';
  if(dKey!=null && dPos<=1){ extra=st(dKey)[2]; exclude=dKey; note=`El campeón vigente ya entró por su liga; ${fname(extra)} (3º de ${ldef(dKey).short}) ocupa su cupo.`; }
  else if(D){ extra=D; if(dKey!=null && dPos===2) exclude=dKey; note=`Cupo de campeón vigente: ${fname(D)}.`; }
  const pool = keys.filter(k=>k!==exclude).map(k=>st(k)[2]).filter(id=> id && id!==extra);
  const need = 16 - top2.length - (extra?1:0);
  const wcs = bestOf(pool, s).slice(0, need);
  const out=[...top2]; if(extra) out.push(extra); out.push(...wcs);
  return {ids:out, note:`Top 2 de cada liga. ${note} Comodines (mejores terceros): ${wcs.map(fname).join(', ')}.`, wildcards:wcs};
}
function runIntl(s, d){
  const stars=state.company.stars;
  const q = s.intl.order ? {ids:s.intl.qualifiers, note:s.intl.note} : intlQualifiers(s);
  if(!s.intl.spkDone) intlSpkAuto(s);
  const sb=sedeBonus(s.intl.sede), slv=spkLv(INTL.key); SPK_BH=spkVal(INTL.key,'bhype');
  const ko=runKnockout(s.intl.order||shuffle(q.ids), (sb||slv)? (id=>(sb?sb(id):0)+slv) : null, 1.8*0.4*(1+0.08*stars)*(s.intl.lu? 1+s.intl.lu.delta/100 : 1)*(1+spkVal(INTL.key,'views'))); SPK_BH=0; { const fin=ko.bracket.rounds[ko.bracket.rounds.length-1][0]; fin.views=Math.round(fin.views*1.15*1.5); }   // Inter -60%, final -40%
  s.intl.bracket=ko.bracket; uqViral(s, ko.bracket, 'fms', d);
  { const B=ko.bracket; const chk=(m,ri,mi)=>{ if(!m||!m.result||!isRival(m.a,m.b)) return; const w=m.result.winner, l=m.result.loser; const sd=s.intl.sede;
      const loc=fby(w).country===sd && fby(l).country!==sd; if(loc || Math.random()<0.75) uqPush(s, {day:d+1, type:'rival', comp:'fms', key:INTL.key, ri, mi, a:m.a, b:m.b, w, v: loc?14:rint(0,13)}); };
    B.rounds.forEach((r,ri)=>r.forEach((m,mi)=>chk(m,ri,mi))); chk(B.third,'third',0); } uqLocalismo(s, q.ids, s.intl.sede, 'fms', d, ko.champion); s.intl.played=true; s.intl.qualifiers=q.ids; s.intl.note=q.note;
  s.intl.champion=ko.champion; s.intl.runnerUp=ko.runnerUp; s.intl.third=ko.third; s.intl.fourth=ko.fourth; try{ icGenerate(s); }catch(e){ console.error(e); }
  const avgH = s.activeKeys.reduce((a,k)=>a+s.leagues[k].hype,0)/s.activeKeys.length;
  const prime=isPrimeDay(s.year,d);
  const income=Math.round((40000 + avgFama(q.ids)*400) * (0.5 + avgH/100) * (1+0.12*stars) * (prime?1:WEEKDAY_TICKET) * TICKET_MULT);
  const vb=ko.bracket.rounds.flat().concat([ko.bracket.third]);
  const views=vb.reduce((a,m)=>a+(m.views||0),0); const viewsIncome=Math.round(views*VIEW_RATE);
  const hypeNote=finalHype(ko.champion, ko.runnerUp, true);
  const cost=40000 + 12000*stars;
  state.company.money += income+viewsIncome-cost; s.fin.income+=income+viewsIncome; s.fin.views=(s.fin.views||0)+viewsIncome; s.fin.production+=cost; s.intl.income=income+viewsIncome;
  const rep=25 + Math.round(avgH/10); state.company.reputation+=rep;
  addLog(s, d, `🌎 <b>${fname(s.intl.champion)}</b> gana el ${INTL.name}${s.intl.sede?' en '+s.intl.sede:''} ante ${fname(s.intl.runnerUp)}. Taquilla ${moneyK(income)}, ${fmtViews(views)} visitas (${moneyK(viewsIncome)}), +${rep} rep.${hypeNote}`, 'gold');
}

function monthEnd(s, m){
  // leyendas que llevan mucho sin batallar: la gente las echa de menos
  const now=s.year*366+dateToDay(s.year,m+1,0);
  state.freestylers.forEach(f=>{ if(!f.legend) return; if(f.lastB==null) f.lastB=now-30; const idle=now-f.lastB; if(idle>=90) addHype(f.id, idle>=180?2:1); });
  const months=monthsWithEvents(s);
  if(!months.has(m)){
    const pen = 8 + 2*state.company.stars;
    state.company.reputation = Math.max(0, state.company.reputation - pen);
    s.activeKeys.forEach(k=>{ const L=s.leagues[k]; if(!L.finished) L.hype=clamp(L.hype-4,0,100); });
    addLog(s, dateToDay(s.year,m+1,0), `Mes vacío en ${MESES[m].toLowerCase()}: la competencia se queda con tu público (−${pen} rep).`, 'bad');
  }
}

function simulateDay(auto){
  const s=cur(); if(s.phase!=='live') return null;
  const d=s.day, y=s.year, diy=daysInYear(y);
  if(!s.uqInit){ s.uqInit=true; uqSeasonStart(s); }
  // eventos únicos pendientes
  const uq=(s.uq||[]).find(x=>!x.done && x.day<=d);
  if(uq){ if(!uq.applied){ uq.applied=true; uqApply(s, uq); } if(auto) uqAuto(s, uq); else if(!uq.done || uq.show) return {pause:'uq', uq}; }
  for(const k of s.activeKeys){ const L=s.leagues[k]; if(L && L.pendingRep && L.pendingRep.length){ if(auto) uqAutoReplace(s,k); else return {pause:'replace', key:k}; } }
  const st=(s.streams||[]).find(x=>!x.done && x.day===d);
  if(st){ applyStream(s, st); if(!auto) return {pause:'stream', st}; }
  // exhibiciones: 7 días después, la comunidad opina
  const xe=(s.exEvents||[]).find(x=>!x.done && x.day<=d);
  if(xe){ applyExhibEvent(s, xe); if(!auto) return {pause:'exhib', xe}; }
  if(rbNeedsVote(s,d)) return {pause:'vote'};
  // revelación del line up: 15 días antes de la J1 de cada liga
  for(const k of s.activeKeys){ const L=s.leagues[k]; if(!L || L.finished || L.played>0 || (L.lu && L.lu.shown)) continue;
    const nd=L.dates.slice().sort((a,b)=>a-b)[0]; if(nd==null || d<nd-LU_DAYS) continue;
    if(!L.lu) luGenerate(s, k);
    if(auto) L.lu.shown=true; else return {pause:'lineup', key:k}; }
  if(s.intlEnabled && s.intl.date!=null && !s.intl.played && !(s.intl.lu && s.intl.lu.shown) && natKeys(s).every(k=>s.leagues[k].finished)){
    if(!s.intl.lu) luGenerate(s, INTL.key);
    if(auto) s.intl.lu.shown=true; else return {pause:'lineup', key:INTL.key}; }
  if(s.intlEnabled && s.intl.date!=null && !s.intl.played && s.intl.lu && s.intl.lu.shown && !s.intl.spkDone && natKeys(s).every(k=>s.leagues[k].finished)){
    if(auto || !intlSpkCands(s).length) intlSpkAuto(s); else return {pause:'ispk'}; }
  // los cruces de cada jornada tienen que estar elegidos 10 días antes
  for(const k of s.activeKeys){ const L=s.leagues[k]; if(!L || L.finished || !L.manual || L.confirmed[L.played]) continue;
    const nd=L.dates.slice().sort((a,b)=>a-b)[L.played]; if(nd!=null && d>=nd-PAIR_DEADLINE) return {pause:true, key:k, j:L.played+1, day:nd}; }
  // al día siguiente del límite de cruces: los enfrentamientos se hacen oficiales en redes
  for(const k of s.activeKeys){ const L=s.leagues[k]; if(!L || L.finished || !L.confirmed[L.played]) continue; const j=L.played;
    const nd=L.dates.slice().sort((a,b)=>a-b)[j]; if(nd==null || d<nd-PAIR_DEADLINE+1 || d>=nd || (L.pv && L.pv[j] && L.pv[j].shown)) continue;
    if(!L.pv || !L.pv[j]) pvGenerate(s, k, j);
    if(auto) L.pv[j].shown=true; else return {pause:'pairs', key:k, j}; }
  // 3 días antes de cada jornada: un 3% de que alguien enferme
  for(const k of s.activeKeys){ const L=s.leagues[k]; if(!L || L.finished || isWS(k) || L.played>=JORNADAS-1) continue; if(!L.illChk) L.illChk={};
    const nd=L.dates.slice().sort((a,b)=>a-b)[L.played]; if(nd==null || d<nd-3 || L.illChk[L.played]) continue; L.illChk[L.played]=true;
    const round=L.rounds[L.played]; if(!round || round.some(x=>x.postponed) || Math.random()>=0.03) continue;
    const opts=[]; round.forEach((m,mi)=>{ if(m.ep) return; opts.push([mi,m.a],[mi,m.b]); }); if(!opts.length) continue;
    const [mi,fid]=opts[Math.floor(Math.random()*opts.length)];
    const u=uqPush(s, {day:d, type:'unavail', key:k, j:L.played, mi, fid, jday:nd, why:'se ha puesto enfermo'}); u.applied=true; uqApply(s,u); if(auto) uqAuto(s,u); else return {pause:'uq', uq:u}; }
  // 5 días antes de cada jornada: ¿falla alguien?
  for(const k of s.activeKeys){ const L=s.leagues[k]; if(!L || L.finished || isWS(k) || L.played>=JORNADAS-1) continue; if(!L.uaChk) L.uaChk={};
    const nd=L.dates.slice().sort((a,b)=>a-b)[L.played]; if(nd==null || d<nd-5 || L.uaChk[L.played]) continue;
    L.uaChk[L.played]=true; uqCheckUnavailable(s, L, nd);
    const u=(s.uq||[]).find(x=>!x.done && x.day<=d); if(u){ u.applied=true; uqApply(s,u); if(auto) uqAuto(s,u); else return {pause:'uq', uq:u}; } }
  const u0=underByDay(s)[d];
  if(u0 && !u0.presented){ if(auto) u0.presented=true; else return {pause:'under', key:u0.key, day:d}; }
  const rb0=rbByDay(s)[d];
  if(rb0 && !rbEvent(s,rb0.key).presented){ if(auto) rbEvent(s,rb0.key).presented=true; else return {pause:'rb', key:rb0.key}; }
  const ev0=eventsByDay(s)[d];
  if(ev0 && ev0.key!==INTL.key){ const L0=s.leagues[ev0.key]; if(L0.manual && !L0.confirmed[L0.played]) return {pause:true, ...ev0};
    if(!L0.shown) L0.shown={}; if(!L0.shown[L0.played]){ if(auto) L0.shown[L0.played]=true; else return {pause:'fms', key:ev0.key}; } }
  if(ev0 && ev0.key===INTL.key && !s.intl.presented){ if(auto) s.intl.presented=true; else return {pause:'rb', key:INTL.key}; }
  s.activeKeys.forEach(k=>{
    const L=s.leagues[k]; if(L.finished) return;
    L.hype = clamp(L.hype - decayRate(d - L.lastEventDay - spkVal(k,'gap')), 3, 100);
  });
  const ev=eventsByDay(s)[d];
  if(ev){ if(ev.key===INTL.key) runIntl(s,d); else runLeagueJornada(s, s.leagues[ev.key], d); }
  const rev=rbByDay(s)[d];
  if(rev){ if(rev.key===RB_INT.key) runRBInter(s,d); else runRBEvent(s, rbEvent(s,rev.key), d); }
  const uev=underByDay(s)[d]; if(uev && !uev.played) runUnder(s, uev, d);
  if(d===diy-1 || monthOf(y,d+1)!==monthOf(y,d)) monthEnd(s, monthOf(y,d));
  s.day++;
  if(s.day>=diy) endSeason(s);
  return ev||rev||null;
}
function advance(mode){
  const s=cur(); if(s.phase!=='live') return;
  const played=[]; const startMonth=monthOf(s.year,s.day);
  let guard=0;
  while(s.phase==='live' && guard++<400){
    const ev=simulateDay(mode==='year');
    if(ev && ev.pause==='uq'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); showUQ(ev.uq); return;
    }
    if(ev && ev.pause==='pairs'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); openPairs(ev.key, ev.j); return;
    }
    if(ev && ev.pause==='lineup'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); openLineup(ev.key); return;
    }
    if(ev && ev.pause==='ispk'){ render(); state.ui.ispk=[]; showIntlSpeakers(); return; }
    if(ev && ev.pause==='replace'){ render(); showReplace(ev.key); return; }
    if(ev && ev.pause==='exhib'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); showExhibEvent(ev.xe); return;
    }
    if(ev && ev.pause==='stream'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); showStream(ev.st); return;
    }
    if(ev && ev.pause==='fms'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); openFMSShow(ev.key); return;
    }
    if(ev && ev.pause==='under'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); if(ev.key===MFU.key) openMFU(ev.day); else openRBShow(ev.key); return;
    }
    if(ev && ev.pause==='rb'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); openRBShow(ev.key); return;
    }
    if(ev && ev.pause==='vote'){
      toast(played.length? `Se jugaron ${played.length} fecha(s). Se abre la votación de Red Bull.` : 'Se abre la votación de comodines de Red Bull.');
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); setTimeout(showRBVote,30); return;
    }
    if(ev && ev.pause){
      if(played.length) toast(`Se jugaron ${played.length} fecha(s). Ahora toca elegir los enfrentamientos de la J${ev.j} de ${ldef(ev.key).name}.`);
      else toast(`Quedan ${Math.max(0,(ev.day!=null?ev.day:s.day)-s.day)} días para la J${ev.j} de ${ldef(ev.key).name}: elige los enfrentamientos (hay que tenerlos ${PAIR_DEADLINE} días antes).`);
      goto('league',{key:ev.key}); return;
    }
    if(ev) played.push(ev);
    if(mode==='day') break;
    if(mode==='event' && ev) break;
  }
  if(state.view.name==='calendar' && s.phase==='live') state.ui.calMonth=monthOf(s.year,s.day);
  if(s.phase==='done'){ render(); showSummary(); return; }
  if(played.length===1){ const e=played[0]; toast(e.key===INTL.key? `Se jugó el ${INTL.name}.` : (isRB(e.key)? `Se jugó la ${rbdef(e.key).name}: gana ${fname(rbEvent(s,e.key).champion)}.` : `Se jugó la J${e.j} de ${ldef(e.key).name}.`)); }
  else if(played.length>1) toast(`Se jugaron ${played.length} fechas.`);
  render();
}

function endSeason(s){
  s.phase='done';
  const avgH = s.activeKeys.reduce((a,k)=>a+s.leagues[k].hype,0)/Math.max(1,s.activeKeys.length);
  const bonus=Math.round(avgH/5);
  state.company.reputation += bonus;
  const before=state.company.stars;
  state.company.stars = Math.min(5, before+1);   // una estrella por temporada completada
  if(state.company.stars>before){ const offers=sponsorOffers(state.company.stars, 3+state.company.stars); s.newSponsorOffers=offers.length; }
  // evolución de freestylers
  const signed=new Set(s.activeKeys.flatMap(k=>s.leagues[k].competitors));
  state.freestylers.forEach(f=>{
    f.nivel = Math.round(clamp(f.nivel + rnd(-3,4), 35, 97));
    if(!signed.has(f.id)) f.fama = Math.round(clamp(f.fama - 1, 5, 99));
  });
  s.activeKeys.forEach(k=>{
    const st=s.leagues[k].finalStandings;
    st.forEach((id,i)=>{ const f=fby(id); const delta = i===0?8:(i<3?4:(i>=st.length-2 && !isWS(k)?-3:1)); f.fama=Math.round(clamp(f.fama+delta,5,99)); });
  });
  if(s.intl.champion){ const f=fby(s.intl.champion); f.fama=Math.round(clamp(f.fama+12,5,99)); }
  s.summary = {
    bonus, avgHype:Math.round(avgH), starsBefore:before, starsAfter:state.company.stars,
    repDelta: state.company.reputation - s.repStart,
    income:s.fin.income, views:s.fin.views||0, sponsors:s.fin.sponsors||0, salaries:s.fin.salaries, production:s.fin.production,
    emptyMonths: 12 - monthsWithEvents(s).size
  };
  addLog(s, daysInYear(s.year)-1, `Fin de la temporada ${s.year}. ${state.company.stars>before?'Subes a '+state.company.stars+'★.':(state.company.stars<before?'Bajas a '+state.company.stars+'★.':'Te mantienes en '+state.company.stars+'★.')}`, 'gold');
}
function showTutorial(t){
  const c=state.company;
  const body = t==='inf' ? `<div class="tut-icon">♾️</div><h3>¡Modo infinito desbloqueado!</h3>
      <p>Has completado una temporada con <b>5 estrellas</b>. A partir de ahora juegas en modo sandbox: sin límite de temporadas y con todo el juego abierto.</p>
      <p><b>Todos los competidores están desbloqueados</b>: los que antes rechazaban estar en la FMS o hacer exhibiciones ahora aceptan siempre.</p>
      <p class="tut-warn">Bueno… casi todos. Papo sigue siendo Papo.</p>`
    : t==='s2' ? `<div class="tut-icon">⭐</div><h3>¡Has ganado tu primera estrella!</h3>
      <p>Empieza la temporada 2. Con cada estrella tu empresa crece: ahora puedes tener <b>${maxLeagues(c.stars)} FMS activas</b> a la vez y cada liga admite <b>3 patrocinadores</b>.</p>
      <p>Abre la nueva liga desde <b>Ligas</b>, ficha a su plantilla y colócala en el calendario.</p>
      <p class="tut-warn">⚠️ Ojo: si repites las mismas batallas temporada tras temporada, la gente se cansa y esas batallas tendrán cada vez menos visitas. Renueva los carteles.</p>`
    : `<div class="tut-icon">🌎</div><h3>¡Has desbloqueado la FMS Internacional!</h3>
      <p>Con ${c.stars} estrellas puedes tener <b>4 FMS activas</b>, y con 4 ligas se abre la <b>FMS Internacional</b>: los mejores de cada liga se clasifican y se juega en eliminatorias en la sede que elijas.</p>
      <p>Actívala en el menú de la temporada, elige sede y ponle fecha después de la última jornada nacional. Es el evento que más taquilla y visitas deja.</p>`;
  openModal(`<div class="tut">${body}</div><div class="modal-actions"><button class="btn primary" onclick="closeModal()">Entendido</button></div>`);
}
function nextSeason(){
  const prev=cur(); if(prev.phase!=='done') return;
  state.seasons.slice(0,-1).forEach(o=>{ Object.values(o.leagues||{}).forEach(L=>(L.rounds||[]).flat().forEach(m=>{ if(m.d) delete m.d.s; })); });
  state.seasons.slice(0,-1).forEach(o=>{ Object.values(o.leagues||{}).forEach(L=>{ if(L.lu) delete L.lu.tweets; delete L.pv; if(L.champTw) delete L.champTw.tweets; }); if(o.intl && o.intl.lu) delete o.intl.lu.tweets; });   // los tuits de temporadas pasadas no se guardan
  state.seasons.push(newSeason(prev)); state.ui.calMonth=null;
  { const ns=cur(); ns.activeKeys.forEach(k=>preselectRoster(ns,k)); if(ns.activeKeys.includes(WS.key)){ const c=spState(); if(c.wsPool.length<3) sponsorOffers(state.company.stars||5, 3-c.wsPool.length, false, true); } }
  Object.keys(state.ui).filter(x=>/^(jnav_|exA_|exB_|exQ_|draft_)/.test(x)).forEach(x=>delete state.ui[x]);
  { const c=state.company; if(!c.tut) c.tut={};
    if(prev.starsStart>=5 && !c.infinite){ c.infinite=true; c.tut.inf=true; state.ui.pendingTut='inf'; }
    else if(c.stars>=1 && !c.tut.s2){ c.tut.s2=true; state.ui.pendingTut='s2'; }
    else if(c.stars>=3 && !c.tut.intl){ c.tut.intl=true; state.ui.pendingTut='intl'; } }
  if(state.seasons.length===2){ const c=spState(); if(c.sponsorPool.length<3) sponsorOffers(state.company.stars||0, 3-c.sponsorPool.length); }
  closeModal(); goto('dashboard');
  if(state.ui.pendingTut){ const t=state.ui.pendingTut; state.ui.pendingTut=null; setTimeout(()=>showTutorial(t), 120); }
}

