/* =========================================================================
   SPEAKERS / HOSTS: uno por liga (obligatorio). Pasiva completa en su país, reducida fuera.
========================================================================= */
var SPEAKERS=[
  {name:'Bekaesh',    cost:2500, country:'España',    fx:'stream', v:0.05, vf:0.025, txt:'Las jornadas son más amenas: {p} de probabilidad de que los streamers hablen bien de tu jornada'},
  {name:'Kenan',      cost:2000, country:'España',    fx:'ryker',  v:0.07, vf:0.04,  txt:'Aumenta el rendimiento de los competidores: {p} de probabilidad de Minutazos de Ryker'},
  {name:'Sarita',     cost:700,  country:'España',    fx:'exfee',  v:0.05, vf:0.025, txt:'Las exhibiciones cuestan un {m} menos'},
  {name:'Misionero',  cost:2500, country:'Argentina', fx:'views',  v:0.05, vf:0.025, txt:'{p} de visitas en las batallas'},
  {name:'Serko Fu',   cost:1500, country:'México',    fx:'salary', v:0.03, vf:0.01,  txt:'Reduce el salario de los competidores un {m}'},
  {name:'MKS',        cost:1500, fs:true,             fx:'refuse', v:0.05, vf:0.03,  txt:'Los competidores que rechazan la FMS tienen {p} de probabilidad de aceptar'},
  {name:'Dante',      cost:1500, fs:true,             fx:'bhype',  v:10,   vf:5,     txt:'+{n} puntos de hype en las batallas'},
  {name:'Victor Sur', cost:800,  country:'Argentina', fx:'spons',  v:0.05, vf:0.03,  txt:'{p} de ganancias de los patrocinadores'},
  {name:'Nazo',       cost:1500, country:'Colombia',  fx:'bhype',  v:10,   vf:5,     txt:'+{n} puntos de hype en las batallas'},
  {name:'Metz',       cost:2000, country:'Perú',      fx:'ptb',    v:0.04, vf:0.02,  txt:'Los competidores suben de nivel: {p} de PTB en las jornadas'},
  {name:'Cayu',       cost:1500, country:'Chile',     fx:'salary', v:0.03, vf:0.01,  txt:'Reduce el salario de los competidores un {m}'},
  {name:'Queen Mery', cost:2500, country:'España',    fx:'views',  v:0.05, vf:0.025, txt:'{p} de visitas en las batallas'},
  {name:'Shulio',     cost:700,  country:'Argentina', fx:'exfee',  v:0.05, vf:0.025, txt:'Las exhibiciones cuestan un {m} menos'},
  {name:'Clipper',    cost:700,  country:'Uruguay',   fx:'exfee',  v:0.05, vf:0.025, txt:'Las exhibiciones cuestan un {m} menos'},
  {name:'Marina',     cost:1000, country:'España',    fx:'gap',    v:10,   vf:5,     txt:'Las jornadas pueden estar {n} días más separadas sin perder hype'},
  {name:'Mbaka',      cost:2000, country:'España',    fx:'ptb',    v:0.04, vf:0.02,  txt:'Los competidores suben de nivel: {p} de PTB en las jornadas'},
];
function spkBy(n){ return SPEAKERS.find(x=>x.name===n); }
function spkFs(sp){ return sp.fs ? state.freestylers.find(f=>nrm(f.name)===nrm(sp.name)) : null; }
function spkCountry(sp){ const f=spkFs(sp); return sp.country || (f?f.country:'—'); }
function spkImg(sp){ const f=spkFs(sp); if(f) return photoOf(f); const k='spk_'+sp.name.toLowerCase().replace(/[^a-z]/g,''); return (typeof EXTRA_IMG!=='undefined' && EXTRA_IMG[k]) || null; }
function spkLocal(sp, key){
  if(key===INTL.key || isWS(key)) return true;
  const def=ldef(key); const c=spkCountry(sp); if(!def || !def.countries) return true;
  if(def.countries.includes(c)) return true;
  if(key==='fms_caribe') return c==='México' || !LEAGUES.some(l=>l.countries.includes(c));
  return false;
}
function spkAmt(sp, key){ return spkLocal(sp,key) ? sp.v : sp.vf; }
function spkTxt(sp, key){ const a=spkAmt(sp,key); const pc=x=>(Math.round(x*1000)/10).toLocaleString('es-ES')+'%';
  return sp.txt.replace('{p}','+'+pc(a)).replace('{m}',pc(a)).replace('{n}',String(a)); }
function spkVal(key, fx){
  const s=cur(); if(!s) return 0; let names=[];
  if(key===INTL.key) names=(s.intl && s.intl.speakers)||[]; else { const L=s.leagues && s.leagues[key]; if(L) names=spkList(L); }
  let v=0; names.forEach(n=>{ const sp=spkBy(n); if(sp && sp.fx===fx) v+=spkAmt(sp,key); }); return v;
}
function spkLv(key){ return spkVal(key,'ptb')*75; }   // +4% de PTB ≈ +3 de nivel
function spkList(L){ if(!L) return []; if(!L.speakers){ L.speakers = L.speaker ? [L.speaker] : []; L.spkCosts = L.speaker ? {[L.speaker]:L.spkCost||0} : {}; delete L.speaker; delete L.spkCost; } return L.speakers; }
function spkSlots(key){ return isWS(key) ? 2 : ((state.company && state.company.stars>=3) ? 2 : 1); }
function speakerKeyOf(s, name, onlyNat){ return s.activeKeys.find(k=>(!onlyNat || !isWS(k)) && s.leagues[k] && spkList(s.leagues[k]).includes(name)) || null; }
function isSpeakerId(s, id){ const f=fby(id); return !!(f && SPEAKERS.some(sp=>sp.fs && nrm(sp.name)===nrm(f.name) && speakerKeyOf(s, sp.name))); }
function competesAnywhere(s, id){ return s.activeKeys.some(k=>s.leagues[k] && s.leagues[k].competitors.includes(id)); }
function spkRecontract(s, key){ const L=s.leagues[key];
  L.competitors.forEach(id=>{ const n=contractCost(fby(id),key), o=L.contracts[id]||0; if(n!==o){ state.company.money-=(n-o); s.fin.salaries+=(n-o); L.contracts[id]=n; } }); }
function spkRefundAll(s, L){ spkList(L).forEach(n=>{ const c=(L.spkCosts||{})[n]||0; state.company.money+=c; s.fin.salaries-=c; }); L.speakers=[]; L.spkCosts={}; }
// en una liga nacional un speaker solo puede estar en una; en la World Series se pueden repetir los de las nacionales
function spkBusy(s, key, sp){ const f=spkFs(sp); if(f && competesAnywhere(s,f.id)) return 'Compite en un line up';
  if(isWS(key)) return null; const o=speakerKeyOf(s, sp.name, true); return (o && o!==key) ? 'Host de '+ldef(o).short : null; }
function setSpeaker(key, name){
  const s=cur(); if(s.phase!=='pre') return; const L=s.leagues[key]; const list=spkList(L);
  const i=list.indexOf(name);
  if(i>=0){ const c=(L.spkCosts||{})[name]||0; state.company.money+=c; s.fin.salaries-=c; list.splice(i,1); delete L.spkCosts[name]; spkRecontract(s,key); render(); return; }
  const sp=spkBy(name); if(!sp) return;
  const busy=spkBusy(s,key,sp); if(busy){ toast(busy==='Compite en un line up' ? `${name} está en un line up como competidor: no puede ser host.` : `${name} ya es host de otra liga nacional.`); render(); return; }
  if(list.length>=spkSlots(key)){ if(spkSlots(key)===1){ setSpeaker(key, list[0]); return setSpeaker(key, name); } toast(`Ya tienes ${spkSlots(key)} speakers en ${ldef(key).name}. Quita uno primero.`); return; }
  if(state.company.money<sp.cost){ toast(`No te llega: ${name} cobra ${money(sp.cost)}.`); render(); return; }
  list.push(name); if(!L.spkCosts) L.spkCosts={}; L.spkCosts[name]=sp.cost; state.company.money-=sp.cost; s.fin.salaries+=sp.cost;
  spkRecontract(s,key); render();
}
function renderSpeakerBox(s, key){
  const L=s.leagues[key]; const list=spkList(L); const slots=spkSlots(key); const curs=list.map(spkBy).filter(Boolean);
  const open=state.ui['spkOpen_'+key] || curs.length<slots;
  const card=(sp, sel)=>{ const loc=spkLocal(sp,key); const busy= !sel && spkBusy(s,key,sp); const img=spkImg(sp);
    return `<button class="spk-card ${sel?'on':''} ${busy?'busy':''}" ${busy?'aria-disabled="true"':''} onclick="setSpeaker('${key}','${esc(sp.name)}')" title="${sel?'Quitar':'Elegir'}">
      <span class="spk-ph">${img?`<img src="${img}" alt="">`:esc(sp.name[0])}</span>
      <span class="spk-body"><span class="spk-nm">${esc(sp.name)}${sp.fs?' <small class="tag-mini">freestyler</small>':''}</span>
        <span class="spk-meta">${esc(spkCountry(sp))} · <b>${moneyK(sp.cost)}</b> · <span class="spk-loc ${loc?'l':'f'}">${loc?'Local':'Fuera'}</span></span>
        <span class="spk-fx">🎙️ ${esc(spkTxt(sp,key))}</span>
        ${busy?`<span class="spk-busy">${esc(busy)}</span>`:''}${sel?'<span class="spk-busy" style="color:var(--muted,#9a9aa6)">Toca para quitar</span>':''}</span></button>`; };
  const all=SPEAKERS.slice().sort((a,b)=>b.cost-a.cost || a.name.localeCompare(b.name));
  return `<div class="spk-box"><div class="spk-head"><h3>🎙️ ${slots>1?'Hosts / Speakers':'Host / Speaker'} <small class="step-note">${curs.length}/${slots}</small></h3>${curs.length?`<button class="btn small" onclick="state.ui['spkOpen_${key}']=!state.ui['spkOpen_${key}']; render()">${open?'Ocultar':'Cambiar'}</button>`:'<span class="tag-mini pend">Obligatorio</span>'}</div>
    ${isWS(key)?'<p class="step-note" style="margin:-4px 0 8px">En la World Series puedes repetir speakers de tus ligas nacionales.</p>':''}
    ${curs.length?`<div class="spk-grid sel">${curs.map(sp=>card(sp,true)).join('')}</div>`:''}
    ${open?`<div class="spk-grid">${all.filter(sp=>!list.includes(sp.name)).map(sp=>card(sp,false)).join('')}</div>`:''}</div>`;
}
/* ---- speakers del Internacional ---- */
function intlSpkCands(s){ return [...new Set(s.activeKeys.flatMap(k=>spkList(s.leagues[k])))]; }
function intlSpkMax(s){ return Math.min(2, intlSpkCands(s).length); }
function intlSpkAuto(s){ s.intl.speakers=intlSpkCands(s).sort((a,b)=>spkBy(b).cost-spkBy(a).cost).slice(0,intlSpkMax(s)); s.intl.spkDone=true; }
function showIntlSpeakers(){
  const s=cur(); const sel=state.ui.ispk||(state.ui.ispk=[]); const max=intlSpkMax(s);
  const cands=intlSpkCands(s).map(spkBy).filter(Boolean).sort((a,b)=>b.cost-a.cost);
  openModal(`<h3>🎙️ Speakers del ${INTL.name}</h3><p class="step-note">Elige <b>${max}</b> de los hosts que han trabajado esta temporada en tus ligas. En el Internacional todos aplican su pasiva completa.</p>
    <div class="spk-grid">${cands.map(sp=>{ const on=sel.includes(sp.name); const img=spkImg(sp);
      return `<button class="spk-card ispk-card ${on?'on':''}" data-n="${esc(sp.name)}" onclick="ispkToggle('${esc(sp.name)}')"><span class="spk-ph">${img?`<img src="${img}" alt="">`:esc(sp.name[0])}</span>
        <span class="spk-body"><span class="spk-nm">${esc(sp.name)}</span><span class="spk-meta">${esc(spkCountry(sp))}</span><span class="spk-fx">🎙️ ${esc(spkTxt(sp,INTL.key))}</span></span>${on?'<span class="vote-check">✓</span>':''}</button>`; }).join('')}</div>
    <div class="modal-actions"><span class="step-note" style="margin-right:auto">Elegidos <b id="ispkN">${sel.length}</b>/${max}</span><button class="btn primary" id="ispkOk" ${sel.length?'':'disabled'} onclick="ispkConfirm()">Confirmar</button></div>`, true);
  themeEl(document.getElementById('modalRoot'), INTL.key);
}
function ispkToggle(n){ const s=cur(); const sel=state.ui.ispk||(state.ui.ispk=[]); const i=sel.indexOf(n); if(i>=0) sel.splice(i,1); else if(sel.length<intlSpkMax(s)) sel.push(n); else { toast(`Solo puedes elegir ${intlSpkMax(s)} speakers.`); return; }
  // sin reabrir el modal: así no se pierde el scroll
  document.querySelectorAll('.ispk-card').forEach(b=>{ const on=sel.includes(b.dataset.n); b.classList.toggle('on',on); const ck=b.querySelector('.vote-check'); if(on && !ck) b.insertAdjacentHTML('beforeend','<span class="vote-check">✓</span>'); if(!on && ck) ck.remove(); });
  const c=document.getElementById('ispkN'); if(c) c.textContent=sel.length; const bt=document.getElementById('ispkOk'); if(bt) bt.disabled=!sel.length; }
function ispkConfirm(){ const s=cur(); s.intl.speakers=(state.ui.ispk||[]).slice(); s.intl.spkDone=true; state.ui.ispk=[]; closeModal(); toast('Speakers del Internacional confirmados.'); render(); }

