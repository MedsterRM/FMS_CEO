/* =========================================================================
   ESTADO
========================================================================= */
const STORAGE_KEY = 'fms_ceo_v1';
let state = { company:null, freestylers:[], seasons:[], logos:{}, _counter:1, view:{name:'dashboard', params:{}}, ui:{} };
let _skipScrollRestore = false;
function uid(p){ return p + (state._counter++); }
function fby(id){ return state.freestylers.find(f=>f.id===id); }
function fname(id){ const f=fby(id); return f? f.name : '—'; }
function nameH(f){ return f ? esc(f.name) : '—'; }
function fnameH(id){ return nameH(fby(id)); }
function cur(){ return state.seasons[state.seasons.length-1]; }

function save(){
  try{
    const dump = {company:state.company, freestylers:state.freestylers, seasons:state.seasons, _counter:state._counter};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dump, (k,v)=> (k==='img' && typeof v==='string' && v.startsWith('data:')) ? undefined : v));   // las fotos de los tuits se recuperan al pintar
    state.ui.saveFailed=false;
  }catch(e){
    if(!state.ui.saveFailed){ state.ui.saveFailed=true; setTimeout(()=>toast('No cabe más en el guardado del navegador (demasiadas imágenes). Exporta la partida para no perderla.'),50); }
  }
}
function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY); if(!raw) return false;
    const d = JSON.parse(raw); if(!d || !d.company) return false;
    state.company=d.company; state.freestylers=d.freestylers||[]; state.seasons=d.seasons||[]; state._counter=d._counter||1;
    state.seasons.forEach((s,i)=>{ const last=i===state.seasons.length-1;
      if(last && s.phase==='pre' && (!s.rb || !s.rb.drawn)) rbGenerateSchedule(s, state.seasons.slice(0,i));
      if(last && !s.under && s.phase!=='done') underGenerate(s, s.phase==='live'?s.day+1:0);
      else if(!s.rb) s.rb={off:true};
      if(last) Object.values(s.leagues||{}).forEach(L=>{ if(!L.finished) L.manual=true; }); });
    syncRealPool(); customFS().forEach(c=>{ if(!state.freestylers.some(f=>f.name.toLowerCase()===c.name.toLowerCase())) state.freestylers.push(customToF(c)); });
    return true;
  }catch(e){ return false; }
}

function newLeagueSeason(key, prev){
  return {
    key, competitors:[], contracts:{}, dates:[], rounds:[], played:0, finished:false,
    hype:0, lastEventDay:-14, finalStandings:[], relegated:[],
    blocked: prev && prev.leagues[key] ? (prev.leagues[key].relegated||[]).slice() : [],
    prevRoster: prev && prev.leagues[key] ? (prev.leagues[key].competitors||[]).slice() : [],
    prevHype: prev && prev.leagues[key] ? prev.leagues[key].hype : null,
    income:0, manual: true, confirmed:{}
  };
}
function newSeason(prev){
  const year = prev ? prev.year+1 : 2027;
  const limit = maxLeagues(state.company.stars);
  const keys = prev ? [...natKeys(prev).slice(0, limit), ...(prev.activeKeys.includes(WS.key) && state.company.stars>=5 ? [WS.key] : [])] : [LEAGUES[0].key];
  const leagues = {}; keys.forEach(k=> leagues[k]=newLeagueSeason(k, prev));
  const season = {
    number: prev? prev.number+1 : 1, year, phase:'pre', day:0, format: prev && prev.format==='long' ? 'long' : 'short',
    activeKeys: keys, leagues,
    intlEnabled: !!(prev && prev.intlEnabled && keys.filter(k=>!isWS(k)).length>=4),
    intl:{date:null, sede:null, played:false, bracket:null, qualifiers:[], champion:null, runnerUp:null, third:null, fourth:null},
    defendingChampion: prev ? (prev.intl.champion || prev.defendingChampion || null) : null,
    log:[], fin:{salaries:0, income:0, production:0},
    repStart: state.company.reputation, starsStart: state.company.stars, moneyStart: state.company.money,
    summary:null
  };
  rbGenerateSchedule(season, state.seasons.slice()); underGenerate(season, 0);
  return season;
}
function ensureLeague(s, key){ if(!s.leagues[key]){ const prev = state.seasons[state.seasons.length-2]; s.leagues[key]=newLeagueSeason(key, prev); } return s.leagues[key]; }

