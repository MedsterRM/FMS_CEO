/* =========================================================================
   BATALLAS FMS: 4 rondas, 5 jueces, PTB, réplicas y mano alzada
========================================================================= */
const ROUND_SETS = {
  short:[{n:'Random Mode',t:'random',max:10,min:1},{n:'Primer minuto libre',t:'min',max:10,min:1},{n:'Segundo minuto libre',t:'min',max:10,min:1},{n:'Deluxe',t:'deluxe',max:10,min:1}],
  long:[{n:'Easy Mode',t:'easy',max:30,min:0},{n:'Hard Mode',t:'hard',max:30,min:0},{n:'Temáticas',t:'tema',max:44,min:0},{n:'Random Mode',t:'random',max:38,min:0},
        {n:'Primer minuto libre',t:'min',max:30,min:0},{n:'Segundo minuto libre',t:'min',max:30,min:0},{n:'Deluxe',t:'deluxe',max:42,min:0}]
};
const FMS_ROUNDS = ROUND_SETS.short.map(r=>r.n);
const TIEP_S=0, TIEP_L=0.1;
const PAIR_DEADLINE=10;   // días de antelación para tener los cruces
function roundsOf(m){ return (m && m.d && m.d.f==='L') ? ROUND_SETS.long : ROUND_SETS.short; }
function seasonFormat(s){ return (s && s.format==='long') ? 'long' : 'short'; }
const TICKET_MULT = 1.8;     // taquilla reforzada
const VIEW_RATE = 0.006;     // € por visita de YouTube
function scoreChar(n){ return String.fromCharCode(96+n); }
function dScore(m, r, side, j){ const v=m.d.s.charCodeAt(r*10+side*5+j)-96; return m.d.e===2 ? v/2 : v; }
function fpt(n){ return Number.isInteger(n) ? n.toLocaleString('es-ES') : n.toLocaleString('es-ES',{minimumFractionDigits:1, maximumFractionDigits:1}); }
// PTB: a cada competidor no le cuentan el juez que más le puntúa ni el que menos (cuentan 3 de 5)
function countedJudges(m, sd){ const T=[0,1,2,3,4].map(j=>{ let t=0; for(let r=0;r<roundsOf(m).length;r++) t+=dScore(m,r,sd,j); return [j,t]; });
  T.sort((a,b)=>a[1]-b[1]); return new Set(T.slice(1,4).map(x=>x[0])); }
function ptbOf(m){ if(!m.d||!m.d.s) return null; const nr=roundsOf(m).length; const t=[0,0];
  for(let sd=0;sd<2;sd++){ const cj=countedJudges(m,sd); for(let r=0;r<nr;r++) for(const j of cj) t[sd]+=dScore(m,r,sd,j); } return t; }
function judgeTotals(m){ const A=[0,0,0,0,0], B=[0,0,0,0,0]; const nr=roundsOf(m).length; for(let r=0;r<nr;r++) for(let j=0;j<5;j++){ A[j]+=dScore(m,r,0,j); B[j]+=dScore(m,r,1,j); } return [A,B]; }
function votesAB(m){
  if(!m.d) return m.result&&m.result.tiebreak ? 'Réplica' : '';
  const v=m.d.v; const nA=[...v].filter(x=>x==='A').length, nB=[...v].filter(x=>x==='B').length, nR=[...v].filter(x=>x==='R').length;
  if(m.d.h){ const aW=m.result.winner===m.a; const ha=aW?m.d.h[0]:m.d.h[1], hb=aW?m.d.h[1]:m.d.h[0]; return `Réplica · mano alzada ${ha}-${hb}`; }
  return `${nA}-${nB}${nR?` (${nR} réplica${nR>1?'s':''})`:''}`;
}
function fmsLabel(m){
  if(!m.d) return m.result&&m.result.tiebreak ? 'Réplica' : '';
  const v=m.d.v; const aW=m.result.winner===m.a;
  const nA=[...v].filter(x=>x==='A').length, nB=[...v].filter(x=>x==='B').length, nR=[...v].filter(x=>x==='R').length;
  if(m.d.h) return `Réplica · mano alzada ${m.d.h[0]}-${m.d.h[1]}`;
  const w=aW?nA:nB, l=aW?nB:nA;
  return `${w}-${l}${nR?` (${nR} réplica${nR>1?'s':''})`:''}`;
}
function simulateFMSBattle(m, lvB){
  const A=fby(m.a), B=fby(m.b); lvB=lvB||0;
  const fa=gauss()*7, fb=gauss()*7;     // forma del día: no siempre se rinde al nivel
  const fmt=WS_SHORT ? 'short' : seasonFormat(cur()); const RS=ROUND_SETS[fmt];
  const SA=STYLES[styleOf(A)], SB=STYLES[styleOf(B)];
  const perf=(F,S,form,rt)=>{
    if(F.name==='Khan') return 47.5 + form*0.4 + gauss()*4;    // PTB muy bajo (60-120 en formato largo)
    if(F.name==='Navas') return 57 + form*0.4 + gauss()*4;     // bajo (110-170 en formato largo)
    let p=F.nivel+lvB+form+gauss()*8*S.v+(S.m[rt]||0)+((S.fmt&&S.fmt[fmt])||0)+(UQ_PERF[F.id]||0);
    if(S.spike && Math.random()<0.12) p+=11; return p; };
  let s='';
  const tA=[0,0,0,0,0], tB=[0,0,0,0,0];
  for(const R of RS){
    const pa=perf(A,SA,fa,R.t), pb=perf(B,SB,fb,R.t);
    // escala 1-10. Largo: notas más bajas (como en la FMS real, ~35% del máximo de media)
    const ba = fmt==='long' ? 3.5+(pa-80)*0.07 : 6.4+(pa-78)/11, bb = fmt==='long' ? 3.5+(pb-80)*0.07 : 6.4+(pb-78)/11;
    const k=R.max/10; const tieP = fmt==='long' ? TIEP_L : TIEP_S;
    const sc=x=>{ let v=clamp(Math.round(x*k*2)/2,R.min,R.max);   // medios puntos
      if(v>=R.max && Math.random()<0.93) v=R.max-(Math.random()<0.6?0.5:1);   // la nota máxima es rarísima
      return v; };
    const ra=[], rb=[];
    for(let j=0;j<5;j++){
      let sa=sc(ba+gauss()*0.5), sb=sc(bb+gauss()*0.5);
      if(Math.abs(ba-bb)<1.5 && Math.random()<tieP){ const x=sc((ba+bb)/2+gauss()*0.5); sa=sb=x; }
      ra.push(sa); rb.push(sb); tA[j]+=sa; tB[j]+=sb;
    }
    s+=ra.map(x=>scoreChar(x*2)).join('')+rb.map(x=>scoreChar(x*2)).join('');
  }
  // réplica si la diferencia de un juez es de 1,5 o menos (corto) o de 5 o menos (largo); a partir de 2 / 5,5 es victoria directa
  const RT = fmt==='long' ? 5 : 1.5;
  let v=''; for(let j=0;j<5;j++) v+= tA[j]-tB[j]>RT?'A':(tB[j]-tA[j]>RT?'B':'R');
  const nA=[...v].filter(x=>x==='A').length, nB=[...v].filter(x=>x==='B').length, nR=[...v].filter(x=>x==='R').length;
  let aWins, h=null, tiebreak=false;
  if(nA<3 && nB<3){   // sin 3 votos para nadie → réplica (p. ej. 2-2-1 o 2 votos + 2 réplicas + 1)
    tiebreak=true;
    const p=1/(1+Math.pow(10,((B.nivel+fb)-(A.nivel+fa))/18));
    let ha=0; for(let j=0;j<5;j++) if(Math.random()<p) ha++;
    aWins=ha>=3; h=aWins?[ha,5-ha]:[5-ha,ha];
  } else aWins=nA>nB;
  if(A.name==='Khan' && B.name!=='Khan') aWins=false; else if(B.name==='Khan' && A.name!=='Khan') aWins=true;
  const W=aWins?A:B, Lo=aWins?B:A;
  m.d={s, v, h, e:2}; if(fmt==='long') m.d.f='L';
  m.result={winner:W.id, loser:Lo.id, tiebreak};
  battleHype(W, Lo);
  m.lb=fmsLabel(m);
  return {upset:(Lo.nivel-W.nivel)>=10, tiebreak, W, Lo};
}
// visitas de YouTube: la fama es lo que más pesa, luego el hype y un poco el nivel
// batallas repetidas temporada tras temporada: a partir de la 3ª seguida, -10% de visitas por temporada
const PAIR_CACHE={};
var RIVALS=[['Chuty','Gazir'],['Chuty','Aczino'],['Chuty','Cacha'],['Cacha','Papo'],['Cacha','Abel'],['Cacha','Wos'],['Wos','Aczino'],['Navas','Gazir'],['Navas','Bélico'],
  ['Sara Socas','Sweet Pain'],['Sweet Pain','Stuart'],['Valles-T','El Menor'],['El Menor','Lokillo'],['Teorema','Aczino'],['El Menor','Gazir'],['Dyse','Exe'],['Aczino','Jack Andrenalina'],
  ['Sara Socas','Rapder'],['Dtoke','Skone'],['Mecha','Papo'],['Mecha','Nacho'],['Navas','El Menor'],['Skone','Chuty'],['Mowlihawk','Navas'],['Mowlihawk','Alek'],['Mowlihawk','Nocre'],['KG','Chang'],
  ['KG','Navas'],['Dominic','RC'],['Fat N','Puppy'],['Carpediem','Valles-T'],['Force','Segrelles'],['Skone','Rapder'],['Rife','Abel'],['Papo','Kodigo'],['Exe','HDR'],
  ['Dybbuk','CTZ'],['Cacha','Mecha'],['Dybbuk','Stuart'],['Mecha','Sophia'],['Bnet','Valles-T'],['Nekroos','Jaze']];
// 15 variantes del evento de rivalidad: [kicker, título, texto]  ({A}/{B} = los dos, {W} ganador, {L} perdedor, {C} competición)
var RIVAL_VARS=[
  ['⚔️ Rivalidad','{A} vs {B}: el pique sigue vivo','La rivalidad entre los dos ha incendiado las redes tras la batalla en {C}: todo el mundo quiere verla.'],
  ['🔥 Redes','{W} se lleva el duelo contra {L}','Los fans de {L} no lo aceptan y los de {W} no paran de compartir los mejores momentos. La batalla no deja de sumar.'],
  ['🎤 Barras','La barra que todo el mundo comenta','{W} le soltó a {L} una barra personal que ya circula en todos los clips. Nadie habla de otra cosa.'],
  ['🗳️ Encuestas','¿Quién ganó de verdad?','La comunidad está dividida a partes iguales sobre {A} vs {B}. Las encuestas en X están 50/50 y cada voto trae a más gente a ver la batalla.'],
  ['🎬 Reacciones','Los streamers reaccionan a {A} vs {B}','Medio mundo del freestyle ha hecho directo reaccionando a la batalla. Las visitas se disparan.'],
  ['📼 Historia','Otro capítulo de una rivalidad histórica','{A} y {B} suman un enfrentamiento más y la gente ya hace recopilatorios de todos sus cruces.'],
  ['😤 Tensión','No se dieron la mano','Al terminar {A} vs {B} ninguno quiso saludar al otro. El vídeo del momento corre por todas partes.'],
  ['📱 Stories','{L} responde en redes','{L} ha subido una story contestando a {W} tras la batalla. La comunidad vuelve a ver la batalla para entender el contexto.'],
  ['🎵 Tiraeras','Amenaza de tiraera','{L} insinúa que va a sacar un tema contra {W}. La batalla original se convierte en tendencia.'],
  ['⚖️ Jueces','Polémica con los jueces','La afición de {L} se queja de las votaciones contra {W}. El debate sobre los jueces le da a la batalla un empujón de visitas.'],
  ['🎙️ Entrevista','{W}: "Con {L} siempre es especial"','En la entrevista post-batalla {W} reconoció que contra {L} se motiva más que contra nadie. La frase se ha hecho viral.'],
  ['🔁 Revancha','La gente pide la revancha','Tras {A} vs {B}, el hashtag pidiendo otra batalla entre los dos es tendencia. Todos vuelven a ver la última.'],
  ['💬 Memes','{A} vs {B} ya es un meme','Las caras, los gestos y las réplicas de la batalla están por todas partes en forma de meme.'],
  ['🕵️ Polémica','"{W} ganó con preparadas"','Parte del público está convencido de que {W} llevaba rimas preparadas contra {L}. Las acusaciones y los vídeos analizando cada ronda disparan las visitas.'],
  ['🏟️ Localismo','Ha estallado la polémica: el público favoreció a {W}','{W} jugaba en casa en {C} y le ganó a {L}. Muchos dicen que el público lo empujó a la victoria y las redes arden.'],
];
var RIVAL_DEFER=false;
var SPK_BH=0;   // hype extra de batalla que da el speaker   // en jornadas de liga el +15% llega al día siguiente como evento
function rivalFill(t, ev){ const w=ev.w||ev.a, l=w===ev.a?ev.b:ev.a; const C=ev.comp==='fms'?'el '+INTL.name:(ev.j!=null?`la J${ev.j+1} de ${ldef(ev.key).name}`:ldef(ev.key).name);
  return t.replace(/\{A\}/g,fname(ev.a)).replace(/\{B\}/g,fname(ev.b)).replace(/\{W\}/g,fname(w)).replace(/\{L\}/g,fname(l)).replace(/\{C\}/g,C); }
function isRival(a, b){ const A=fby(a), B=fby(b); if(!A||!B) return false; const x=nrm(A.name), y=nrm(B.name); return RIVALS.some(([p,q])=>(nrm(p)===x&&nrm(q)===y)||(nrm(p)===y&&nrm(q)===x)); }
var VIEW_STAR={'Navas':1.3, 'Jaze':1.3};   // sus batallas dan más visitas que la media
const MISMATCH_EXEMPT=['Trueno','Wos','TiagoPZK','Azuky','Walls'];
const LOW_VIEW_EXEMPT=['El Menor','Kaiser','Teorema','Nitro','Metalingüística','Ricto','Aczino','Azuky'];
const NO_FATIGUE=['El Menor','Teorema'];
function seasonPairs(s){
  if(s.phase==='done' && PAIR_CACHE[s.number]) return PAIR_CACHE[s.number];
  const set=new Set(); const add=m=>{ if(m&&m.a&&m.b) set.add(pairKey(m.a,m.b)); };
  Object.values(s.leagues||{}).forEach(L=>{ (L.rounds||[]).flat().forEach(m=>{ if(m.result) add(m); }); Object.values(L.exhib||{}).forEach(x=>add(x.m)); });
  const ko=b=>{ if(b){ b.rounds.flat().forEach(add); add(b.third); } };
  if(s.intl) ko(s.intl.bracket); if(s.rb && s.rb.events){ s.rb.events.forEach(e=>ko(e.bracket)); if(s.rb.inter) ko(s.rb.inter.bracket); }
  if(s.phase==='done') PAIR_CACHE[s.number]=set; return set;
}
function pairFatigue(a, b){
  if(!state.seasons || !state.seasons.length) return 1; if(NO_FATIGUE.includes(fname(a)) || NO_FATIGUE.includes(fname(b))) return 1; const k=pairKey(a,b); let n=1;   // la temporada actual cuenta
  for(let i=state.seasons.length-2;i>=0;i--){ if(seasonPairs(state.seasons[i]).has(k)) n++; else break; }
  return n>=3 ? Math.max(0.3, 1-0.1*(n-2)) : 1;
}
function battleViews(m, mult){
  const A=fby(m.a), B=fby(m.b); if(!A||!B) return 0;
  const score=0.55*(A.fama+B.fama)/2 + 0.30*Math.min(200, hypeOf(m.a)+hypeOf(m.b)+SPK_BH)/2 + 0.15*(A.nivel+B.nivel)/2;
  const lvl=(A.nivel+B.nivel)/2; const lvlF=clamp(0.5+(lvl-64)/36, 0.5, 1.1);   // batallas de nivel bajo: algo menos de visitas
  let v=1000*Math.pow(10, clamp((score-25)/70,0,1.25)*3.4) * Math.exp(gauss()*0.35) * (mult||1) * lvlF;
  if(m.result && m.result.tiebreak) v*=1.15;
  [A,B].forEach(F=>{ const vm=STYLES[styleOf(F)].views; if(vm) v*=vm; });
  if(m.result && isUpset(fby(m.result.winner), fby(m.result.loser))) v*=1.25;
  [A,B].forEach(F=>{ if(VIEW_STAR[F.name]) v*=VIEW_STAR[F.name]; });
  { const hi=Math.max(A.fama,B.fama), diff=Math.abs(A.fama-B.fama);   // famoso contra alguien con poca fama: menos visitas
    if(hi>=78 && diff>=15 && !(MISMATCH_EXEMPT.includes(A.name)||MISMATCH_EXEMPT.includes(B.name))) v*=1-Math.min(0.35,(diff-15)*0.012); }
  [A,B].forEach(F=>{ if((F.country==='Chile' || F.country==='México') && !LOW_VIEW_EXEMPT.includes(F.name)) v*=0.85; });
  v*=pairFatigue(m.a, m.b);
  if(!RIVAL_DEFER && isRival(m.a, m.b)) v*=1.15;
  return Math.max(1000, Math.round(v));
}
function fmtViews(n){ if(n>=1e6) return (n/1e6).toLocaleString('es-ES',{maximumFractionDigits:1})+' M'; if(n>=1e3) return Math.round(n/1e3).toLocaleString('es-ES')+' K'; return String(n); }
function noBackToBack(ord, round){   // mantiene el orden por hype en lo posible, pero nadie batalla dos veces seguidas
  const n=ord.length, used=new Array(n).fill(false), out=[]; let steps=0;
  const clash=(x,y)=>{ const a=round[x[0]], b=round[y[0]]; return a.a===b.a||a.a===b.b||a.b===b.a||a.b===b.b; };
  const dfs=()=>{ if(out.length===n) return true; if(steps++>20000) return false;
    for(let i=0;i<n;i++){ if(used[i]) continue; if(out.length && clash(out[out.length-1], ord[i])) continue;
      used[i]=true; out.push(ord[i]); if(dfs()) return true; out.pop(); used[i]=false; }
    return false; };
  return dfs() ? out : ord;
}
function jornadaOrder(round){ return round.map((m,i)=>[i, hypeOf(m.a)+hypeOf(m.b)]).sort((x,y)=>x[1]-y[1]); }

/* ---------- top 10 de visitas de la temporada ---------- */
function seasonTopBattles(s, n){
  const out=[]; const KO=['Octavos','Cuartos','Semifinal','Final'];
  const push=(m, logo, comp)=>{ if(m && m.result && m.views) out.push({m, logo, comp}); };
  s.activeKeys.forEach(k=>{ const L=s.leagues[k]; (L.rounds||[]).forEach((r,ri)=> r.forEach(m=>push(m, LOGOS[k], `${ldef(k).name} · J${ri+1}`))); });
  if(s.intl && s.intl.bracket){ s.intl.bracket.rounds.forEach((r,ri)=>r.forEach(m=>push(m, LOGOS.fms_internacional, `${INTL.name} · ${KO[ri]}`))); push(s.intl.bracket.third, LOGOS.fms_internacional, `${INTL.name} · 3er puesto`); }
  if(rbOn(s)){ [...s.rb.events, s.rb.inter].forEach(ev=>{ if(!ev.bracket) return; const nm=ev===s.rb.inter?RB_INT.name:rbdef(ev.key).name;
    ev.bracket.rounds.forEach((r,ri)=>r.forEach(m=>push(m, RB_LOGO, `${nm} · ${KO[ri]}`))); push(ev.bracket.third, RB_LOGO, `${nm} · 3er puesto`); }); }
  return out.sort((a,b)=>b.m.views-a.m.views).slice(0,n||10);
}
function seasonTopFreestylers(s, n){
  const T={}; const add=(m,k)=>{ if(!m||!m.result||!m.views) return; [m.a,m.b].forEach(id=>{ if(!id) return; (T[id]=T[id]||{id, views:0, n:0, keys:[]}); T[id].views+=m.views; T[id].n++; if(k && !T[id].keys.includes(k)) T[id].keys.push(k); }); };
  s.activeKeys.forEach(k=>{ const L=s.leagues[k]; (L.rounds||[]).flat().forEach(m=>add(m,k)); Object.values(L.exhib||{}).forEach(x=>add(x.m,k)); Object.values(L.fexhib||{}).forEach(x=>add(x.m,k)); });
  if(s.intl && s.intl.bracket){ s.intl.bracket.rounds.flat().forEach(m=>add(m,INTL.key)); add(s.intl.bracket.third,INTL.key); }
  const ord=[...s.activeKeys, INTL.key]; Object.values(T).forEach(t=>t.keys.sort((a,b)=>ord.indexOf(a)-ord.indexOf(b)));
  return Object.values(T).sort((a,b)=>b.views-a.views).slice(0,n||10);
}
function topFreestylersHtml(s){
  const top=seasonTopFreestylers(s,10); if(!top.length) return '';
  return `<div class="section-title" style="margin-top:18px"><h2 style="font-size:22px">Top 10 freestylers con más visitas</h2></div>
  <div class="tb-list">${top.map((t,i)=>{ const f=fby(t.id); return `<div class="tb-row"><span class="tb-pos">${i+1}</span>
      <span class="tb-face w" style="${avatarDivStyle(f)}">${avatarContent(f)}</span>
      <div class="tb-info"><div class="tb-names"><span class="w">${nameH(f)}</span></div><div class="tb-meta">${t.n} batalla${t.n>1?'s':''}</div></div>
      <div class="tb-logos">${t.keys.map(k=>LOGOS[k]?`<img src="${LOGOS[k]}" alt="${esc(ldef(k).name)}" title="${esc(ldef(k).name)}">`:'').join('')}</div>
      <div class="tb-views">${fmtViews(t.views)}<small>visitas</small></div></div>`; }).join('')}</div>`;
}
function topBattlesHtml(s){
  const top=seasonTopBattles(s,10); if(!top.length) return '';
  return `<div class="section-title" style="margin-top:18px"><h2 style="font-size:22px">Top 10 batallas más vistas</h2></div>
  <div class="tb-list">${top.map((t,i)=>{ const m=t.m; const wa=m.result.winner===m.a; const res=m.lb || (m.result.tiebreak?'Réplica':'');
    return `<div class="tb-row"><span class="tb-pos">${i+1}</span><img class="tb-logo" src="${t.logo}" alt="">
      <div class="tb-faces"><span class="tb-face ${wa?'w':''}" style="${avatarDivStyle(fby(m.a))}">${avatarContent(fby(m.a))}</span><span class="tb-face ${wa?'':'w'}" style="${avatarDivStyle(fby(m.b))}">${avatarContent(fby(m.b))}</span></div>
      <div class="tb-info"><div class="tb-names"><span class="${wa?'w':''}">${fnameH(m.a)}</span> <i>vs</i> <span class="${wa?'':'w'}">${fnameH(m.b)}</span></div>
      <div class="tb-meta">${esc(t.comp)} · gana ${fnameH(m.result.winner)}${res?' · '+esc(res):''}</div></div>
      <div class="tb-views">${fmtViews(m.views)}<small>visitas</small></div></div>`; }).join('')}</div>`;
}

/* ---------- espectáculo de la jornada ---------- */
function openFMSShow(key, jReplay){
  const s=cur(); const L=s.leagues[key];
  const replay = jReplay!=null;
  const j = replay ? jReplay : L.played;
  SHOW={kind:'fms', key, j, tok:1, phase:'intro', replay};
  if(!replay){
    if(!L.shown) L.shown={}; L.shown[j]=true;
    advance('day');
    if(!L.rounds[j] || !L.rounds[j][0].result){ closeRBShow(); return; }
  }
  const def=ldef(key);
  let root=document.getElementById('rbShow');
  if(!root){ root=document.createElement('div'); root.id='rbShow'; document.body.appendChild(root); }
  themeEl(root, key);
  root.innerHTML=`<div class="rbs fms" role="dialog" aria-label="${def.name} jornada ${j+1}">
    <div class="rbs-top"><img class="rb-mark sm fm-logo" src="${LOGOS[key]}" alt=""><div style="min-width:0"><div class="rbs-title">${def.name} · Jornada ${j+1}</div>
      <div class="rbs-sub">${fmtDay(s.year,L.dates[j])} ${s.year}</div></div>
      <span class="top-spacer"></span><button class="btn small ghost" id="fmSkip" onclick="fmSkip()">Saltar</button></div>
    <div class="fm-stage" id="fmStage"></div>
    <div class="rbs-bottom" id="shBottom"></div></div>`;
  fmRun(SHOW.tok);
}
function fmData(){ const s=cur(); const L=s.leagues[SHOW.key]; const base=L.rounds[SHOW.j]; const o0=(L.ord&&L.ord[SHOW.j]) || jornadaOrder(base);
  const list=[]; [L.exhib&&L.exhib[SHOW.j], L.fexhib&&L.fexhib[SHOW.j]].forEach(x=>{ if(x && x.m && x.m.result) list.push([x.m, hypeOf(x.a)+hypeOf(x.b)]); });   // las exhibiciones abren la jornada
  o0.forEach(([i,h])=>{ const m=base[i]; if(m && m.result && !m.recup) list.push([m,h]); });
  const round=list.map(x=>x[0]); const ord=list.map((x,i)=>[i,x[1]]);
  return {s, L, round, ord}; }
function fmStage(){ return document.getElementById('fmStage'); }
function fmK(){ return shSpeed().k; }
function fmAlive(tok){ return SHOW && SHOW.kind==='fms' && SHOW.tok===tok; }
function fmSkip(){ if(!SHOW) return; SHOW.tok++; SHOW.nextRes=null; fmSummary(); }
function countUp(el, from, to, ms, fmt){
  if(!el) return; const t0=performance.now(); fmt=fmt||(x=>Math.round(x).toLocaleString('es-ES'));
  const step=now=>{ const p=Math.min(1,(now-t0)/ms); const e=1-Math.pow(1-p,3); el.textContent=fmt(from+(to-from)*e); if(p<1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function fmFace(id, cls){ const f=fby(id); return `<span class="fm-face ${cls||''}" style="${avatarDivStyle(f)}">${avatarContent(f)}</span>`; }
async function fmRun(tok){
  const {L, round, ord}=fmData(); const k=fmK;
  // 1. intro
  fmStage().innerHTML=`<div class="fm-intro"><img src="${LOGOS[SHOW.key]}" alt=""><div class="fm-intro-small">Empieza la</div><div class="fm-intro-big">Jornada ${SHOW.j+1}</div></div>`;
  await shWait(3200*k()); if(!fmAlive(tok)) return;
  // 2. cartel, de menos a más hype
  fmStage().innerHTML=`<div class="fm-lineup"><div class="fm-lineup-t">Cartel de la jornada <small>de menos a más hype</small></div>${ord.map(([i,hs],n)=>{ const m=round[i];
    return `<div class="fm-card" id="fmCard${n}"><span class="fm-n">${n+1}</span>${fmFace(m.a)}<span class="fm-cn">${fnameH(m.a)}</span><span class="fm-cvs">VS</span><span class="fm-cn r">${fnameH(m.b)}</span>${fmFace(m.b)}<span class="fm-hs">${m.ex?'<b class="fm-ex">EXHIBICIÓN</b> ':''}🔥 ${Math.round(hs)}</span></div>`; }).join('')}</div>`;
  for(let n=0;n<ord.length;n++){ await shWait(950*k()); if(!fmAlive(tok)) return; document.getElementById('fmCard'+n).classList.add('in'); }
  await shWait(2200*k()); if(!fmAlive(tok)) return;
  // 3. batallas
  for(let n=0;n<ord.length;n++){ if(!await fmBattle(tok, n)) return; }
  // 4. MVP
  const mv=L.mvps&&L.mvps[SHOW.j];
  if(mv){
    const st=computeStandings(L); const q=(cur().intlEnabled && !isWS(SHOW.key))? intlSlotsPerLeague(natKeys(cur()).length):0;
    fmStage().innerHTML=`<div class="fm-mvpwrap" id="fmMW">
      <div class="fm-table-side"><div class="fm-lineup-t" style="font-size:24px;text-align:left">Clasificación · tras la J${SHOW.j+1}</div>
        <table class="standings fm-st"><thead><tr><th>#</th><th>Freestyler</th><th class="num">PJ</th><th class="num">PTS</th></tr></thead><tbody>
        ${st.map((r,i)=>`<tr class="${i<q?'q':''} ${i>=st.length-2?'rel':''} ${r.id===mv.id?'mvp':''}" style="--i:${i}"><td class="pos">${i+1}</td><td><span style="display:inline-flex;align-items:center;gap:8px">${miniAvatar(r.id,22)} ${fnameH(r.id)}${r.id===mv.id?' <span class="mvp-tag">MVP</span>':''}</span></td><td class="num">${r.pj}</td><td class="pts num">${r.pts}</td></tr>`).join('')}
        </tbody></table></div>
      <div class="fm-mvp"><div class="fm-intro-small">MVP de la jornada</div>${fmFace(mv.id,'xl')}<div class="fm-mvp-name">${fnameH(mv.id)}</div><div class="fm-mvp-pts"><b id="fmMvpPts">0</b> puntos</div></div></div>`;
    countUp(document.getElementById('fmMvpPts'), 0, mv.pts, 1200*k(), x=>fpt(Math.round(x*2)/2)); await shWait(3200*k()); if(!fmAlive(tok)) return;
    document.getElementById('fmMW').classList.add('split');
    await shWait(900); if(!fmAlive(tok)) return;
    await fmWaitNext('Ver resultados y visitas'); if(!fmAlive(tok)) return;
  }
  fmSummary();
}
async function fmBattle(tok, n){
  const {round, ord}=fmData(); const m=round[ord[n][0]]; const k=fmK;
  const rail=ord.map(([i],x)=>{ const mm=round[i]; return `<span class="fm-pip ${x<n?'done':(x===n?'now':'')}">${x<n?fnameH(mm.result.winner):(x+1)}</span>`; }).join('');
  fmStage().innerHTML=`<div class="fm-rail">${rail}</div>
  <div class="fm-battle">
    <div class="fm-side" id="fmSA">${fmFace(m.a,'lg')}<div class="fm-name">${fnameH(m.a)}</div>${styleTag(fby(m.a))}<div class="fm-ptbrow"><span class="fm-plus" id="fmXA"></span><div class="fm-ptb" id="fmPA">0</div></div><div class="fm-ptbl">PTB</div></div>
    <div class="fm-mid"><div class="fm-bn">${m.ex?'Exhibición':`Batalla ${n+1}/${ord.length}`}</div><div class="fm-round" id="fmRound">&nbsp;</div><div class="fm-vs">VS</div></div>
    <div class="fm-side" id="fmSB">${fmFace(m.b,'lg')}<div class="fm-name">${fnameH(m.b)}</div>${styleTag(fby(m.b))}${m.ep?'<span class="tag-mini ep">EXTRAPLAYER</span>':''}<div class="fm-ptbrow"><div class="fm-ptb" id="fmPB">0</div><span class="fm-plus" id="fmXB"></span></div><div class="fm-ptbl">PTB</div></div>
  </div>
  <div class="fm-table-wrap"><table class="fm-judges"><thead><tr><th>Ronda</th>${[1,2,3,4,5].map(j=>`<th>J${j}</th>`).join('')}</tr></thead><tbody>
    ${roundsOf(m).map((R,r)=>`<tr id="fmR${r}"><td class="fm-rn">${R.n}${roundsOf(m)===ROUND_SETS.long?` <small>/${R.max}</small>`:''}</td>${[0,1,2,3,4].map(j=>`<td id="fmC${r}_${j}"></td>`).join('')}</tr>`).join('')}
    <tr class="fm-tot"><td class="fm-rn">Total</td>${[0,1,2,3,4].map(j=>`<td id="fmT${j}"></td>`).join('')}</tr>
    <tr class="fm-votes"><td class="fm-rn">Voto</td>${[0,1,2,3,4].map(j=>`<td id="fmV${j}"></td>`).join('')}</tr>
  </tbody></table></div>
  <div class="fm-verdict" id="fmVerdict"></div>`;
  await shWait(1300*k()); if(!fmAlive(tok)) return false;
  const tot=[0,0]; const jt=[[0,0,0,0,0],[0,0,0,0,0]];
  const RS=roundsOf(m); const lk=1; const longF=RS.length>4;
  const cjA=countedJudges(m,0), cjB=countedJudges(m,1);
  for(let r=0;r<RS.length;r++){
    const rd=document.getElementById('fmRound'); rd.textContent=RS[r].n; rd.classList.remove('flash'); void rd.offsetWidth; rd.classList.add('flash');
    document.getElementById('fmR'+r).classList.add('now');
    await shWait(1100*k()*lk); if(!fmAlive(tok)) return false;
    let ra=0, rb=0;
    for(let j=0;j<5;j++){
      const a=dScore(m,r,0,j), b=dScore(m,r,1,j); if(cjA.has(j)) ra+=a; if(cjB.has(j)) rb+=b; jt[0][j]+=a; jt[1][j]+=b;
      const c=document.getElementById(`fmC${r}_${j}`); c.innerHTML=`<span class="${a>b?'hi':''}">${fpt(a)}</span><i>-</i><span class="${b>a?'hi':''}">${fpt(b)}</span>`; c.classList.add('pop');
      await shWait(280*k()*lk); if(!fmAlive(tok)) return false;
    }
    // PTB de la ronda en verde junto al marcador (por fuera), y luego sube el total
    const xa=document.getElementById('fmXA'), xb=document.getElementById('fmXB');
    xa.textContent='+'+fpt(ra); xb.textContent='+'+fpt(rb); [xa,xb].forEach(x=>{ x.classList.remove('show'); void x.offsetWidth; x.classList.add('show'); });
    await shWait((longF?1500:900)*k()); if(!fmAlive(tok)) return false;
    countUp(document.getElementById('fmPA'), tot[0], tot[0]+ra, 1000*k()*lk, x=>fpt(Math.round(x*2)/2)); countUp(document.getElementById('fmPB'), tot[1], tot[1]+rb, 1000*k()*lk, x=>fpt(Math.round(x*2)/2));
    await shWait(900*k()); if(!fmAlive(tok)) return false; [xa,xb].forEach(x=>x.classList.remove('show'));
    tot[0]+=ra; tot[1]+=rb;
    document.getElementById('fmR'+r).classList.remove('now');
    await shWait(1600*k()*lk); if(!fmAlive(tok)) return false;
  }
  for(let j=0;j<5;j++){ const t=document.getElementById('fmT'+j); t.innerHTML=`<span class="${jt[0][j]>jt[1][j]?'hi':''} ${cjA.has(j)?'':'nc'}" ${cjA.has(j)?'':'title="No cuenta para el PTB (nota más alta o más baja)"'}>${fpt(jt[0][j])}</span><i>-</i><span class="${jt[1][j]>jt[0][j]?'hi':''} ${cjB.has(j)?'':'nc'}" ${cjB.has(j)?'':'title="No cuenta para el PTB (nota más alta o más baja)"'}>${fpt(jt[1][j])}</span>`; }
  await shWait(1000*k()); if(!fmAlive(tok)) return false;
  for(let j=0;j<5;j++){
    const v=m.d.v[j]; const el=document.getElementById('fmV'+j);
    el.innerHTML = v==='R' ? '<span class="fm-vr">Réplica</span>' : `<span class="fm-vw">${esc((fby(v==='A'?m.a:m.b).name))}</span>`; el.classList.add('pop');
    await shWait(600*k()); if(!fmAlive(tok)) return false;
  }
  const V=document.getElementById('fmVerdict'); const W=m.result.winner;
  if(m.d.h){
    V.innerHTML=`<span class="fm-rep">¡Réplica!</span>`; await shWait(2000*k()); if(!fmAlive(tok)) return false;
    V.innerHTML=`<span class="fm-rep sm">Réplica</span> A mano alzada: gana <b>${fnameH(W)}</b> ${m.d.h[0]}-${m.d.h[1]}`;
  } else V.innerHTML=`Gana <b>${fnameH(W)}</b> ${esc(fmsLabel(m))}`;
  document.getElementById(W===m.a?'fmSA':'fmSB').classList.add('won');
  document.getElementById(W===m.a?'fmSB':'fmSA').classList.add('lost');
  await shWait(900*k()); if(!fmAlive(tok)) return false;
  await fmWaitNext(n+1<fmData().ord.length ? 'Siguiente batalla' : 'Ver MVP de la jornada');
  return fmAlive(tok);
}
function fmWaitNext(label){
  return new Promise(res=>{ if(!SHOW) return res(); SHOW.nextRes=res;
    shSetBottom(`<button class="btn primary" id="fmNext" onclick="fmNext()">${label} ›</button>`);
    const b=document.getElementById('fmNext'); if(b) b.focus(); });
}
function fmNext(){ if(!SHOW) return; const r=SHOW.nextRes; SHOW.nextRes=null; shSetBottom(''); if(r) r(); }
function fmSummary(){
  if(!SHOW) return; SHOW.phase='done';
  const {L, round, ord}=fmData(); const mv=L.mvps&&L.mvps[SHOW.j];
  const sk=document.getElementById('fmSkip'); if(sk) sk.style.display='none';
  const total=round.reduce((a,m)=>a+(m.views||0),0);
  fmStage().classList.add('sum'); fmStage().innerHTML=`<div class="fm-sum">
    <div class="fm-lineup-t">Resultados de la jornada ${SHOW.j+1}</div>
    ${mv?`<div class="fm-sum-mvp">⭐ MVP: <b>${fnameH(mv.id)}</b> · ${fpt(mv.pts)} puntos</div>`:''}
    ${ord.map(([i],n)=>{ const m=round[i]; const wa=m.result.winner===m.a; const p=ptbOf(m);
      return `<div class="fm-srow"><div class="fm-sb"><span class="${wa?'w':'l'}">${fmFace(m.a)}${fnameH(m.a)}</span><span class="fm-sres">${p?fpt(p[0])+' – '+fpt(p[1]):'vs'}<small>${esc(votesAB(m))}</small></span><span class="${wa?'l':'w'} r">${m.ep?'<span class="tag-mini ep">EXTRAPLAYER</span>':''}${fnameH(m.b)}${fmFace(m.b)}</span></div>
        <div class="fm-views"><span class="fm-vn" id="fmVw${n}">—</span><button class="btn small" id="fmVb${n}" onclick="fmReveal(${n})">Revelar visitas</button></div></div>`; }).join('')}
    <div class="fm-sum-foot" id="fmFoot"></div></div>`;
  shSetBottom(`<button class="btn" onclick="fmRevealAll()">Revelar todas</button><button class="btn primary" onclick="fmContinue()">Continuar</button>`);
  SHOW.revealed=new Set(); SHOW.total=total;
}
function fmReveal(n){
  if(!SHOW||SHOW.kind!=='fms'||SHOW.revealed.has(n)) return;
  const {round, ord}=fmData(); const m=round[ord[n][0]]; SHOW.revealed.add(n);
  const b=document.getElementById('fmVb'+n); if(b) b.remove();
  const el=document.getElementById('fmVw'+n); el.classList.add('on');
  countUp(el, 0, m.views||0, 1500, x=>Math.round(x).toLocaleString('es-ES')+' visitas');
  if(SHOW.revealed.size===ord.length) setTimeout(()=>{ const f=document.getElementById('fmFoot'); if(f&&SHOW) f.innerHTML=`Total: <b>${SHOW.total.toLocaleString('es-ES')}</b> visitas · <b class="pos-v">${money(Math.round(SHOW.total*VIEW_RATE))}</b> en YouTube`; }, 1550);
}
function fmRevealAll(){ const {ord}=fmData(); ord.forEach((_,n)=>setTimeout(()=>fmReveal(n), n*180)); }


