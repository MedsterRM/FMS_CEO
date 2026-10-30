/* =========================================================================
   PATROCINADORES (marcas ficticias)
========================================================================= */
const SPONSOR_BRANDS = [ // nombre, sector (mismo sector = incompatibles en la misma liga), colores
  ['Amazon','ecommerce','#232F3E','#FF9900'],['AliExpress','ecommerce','#E62E04','#ffffff'],
  ['OCB','papel','#111111','#ffffff'],
  ['Monster Energy','energetica','#000000','#7AC143'],
  ['Red Bull','energetica','#1B2A6B','#ffffff'],
  ['Pepsi','refresco','#004B93','#ffffff'],
  ['Coca-Cola','refresco','#E41E2B','#ffffff'],
  ['Fanta','refresco_n','#F7841B','#1a1a1a'],
  ['Adidas','ropa','#000000','#ffffff'],
  ['Nike','ropa','#111111','#ffffff'],
  ['Puma','ropa','#1a1a1a','#ffffff'],
  ['New Era','gorras','#0B2545','#ffffff'],
  ['JD Sports','tienda','#000000','#FFD200'],
  ['Foot Locker','tienda','#111111','#ffffff'],
  ['Spotify','musica','#1DB954','#000000'],
  ['Apple Music','musica','#FA243C','#ffffff'],
  ['Twitch','stream','#9146FF','#ffffff'],
  ['Kick','stream','#53FC18','#000000'],
  ['Movistar','teleco','#019DF4','#ffffff'],
  ['Vodafone','teleco','#E60000','#ffffff'],
  ['Claro','teleco','#DA291C','#ffffff'],
  ['Burger King','comida','#D62300','#F5EBDC'],
  ["McDonald's",'comida','#DA291C','#FFC72C'],
  ['KFC','comida','#A3080C','#ffffff'],
  ['PlayStation','consola','#003791','#ffffff'],
  ['Xbox','consola','#107C10','#ffffff'],
  ['Logitech G','perifericos','#00B8FC','#000000'],
  ['Razer','perifericos','#000000','#44D62C'],
  ['Samsung','movil','#1428A0','#ffffff'],
  ['Xiaomi','movil','#FF6900','#ffffff'],
  ['Jägermeister','licor','#1E4D2B','#F7A600'],
  ['Mahou','cerveza','#C8102E','#ffffff'],
  ['Corona','cerveza','#00205B','#F5C400'],
  ['Uber Eats','delivery','#06C167','#000000'],['Glovo','delivery','#FFC244','#00A082'],
  ['Booking','viajes','#003580','#ffffff'],['Ryanair','aerolinea','#073590','#F1C933'],['Iberia','aerolinea','#D7192D','#FFCC00'],
  ['Takis','snacks','#5B2C83','#F4D03F'],['Doritos','snacks','#E2231A','#ffffff'],
  ['Prime','isotonica','#1B1F3B','#E91E63'],['Gatorade','isotonica','#F26522','#ffffff'],
  ['Revolut','banco','#0A0A0A','#ffffff'],['Wallapop','compraventa','#13C1AC','#ffffff'],
  ['Shein','moda','#000000','#ffffff'],['Zara','moda2','#000000','#ffffff']
];
/* ---- patrocinadores con efectos especiales: pagan menos, pero dan ventajas en la liga donde están ---- */
const SPONSOR_FX = {
  'Red Bull':       {fx:'nivel',   mult:0.55, txt:'Neveras para los MCs: +2 de nivel en las jornadas (más PTB y un poco más de visitas)'},
  'Amazon':         {fx:'stream',  mult:0.6,  txt:'Material para la jornada: los streamers hablan bien con más frecuencia (+20%)'},
  'Monster Energy': {fx:'hype',    mult:0.6,  txt:'+2 de hype a toda la plantilla después de cada jornada'},
  'Spotify':        {fx:'views',   v:0.04, mult:0.65, txt:'Playlists de la liga: +4% de visitas en las batallas'},
  'Twitch':         {fx:'shield',  mult:0.65, txt:'Si un streamer habla mal, la plantilla solo pierde la mitad de hype'},
  'Nike':           {fx:'salary',  mult:0.6,  txt:'Viste a los MCs: los fichajes de esta liga cuestan un 10% menos'},
  'Coca-Cola':      {fx:'ticket',  mult:0.6,  txt:'Barra en el recinto: +15% de taquilla'},
  'Movistar':       {fx:'prod',    mult:0.6,  txt:'Pone la retransmisión: −30% en costes de producción'},
  'Burger King':    {fx:'weekday', mult:0.65, txt:'Promos entre semana: las jornadas de lunes a jueves no pierden taquilla'},
  'PlayStation':    {fx:'rep',     mult:0.65, txt:'Campaña conjunta: +3 de reputación por jornada'},
  'JD Sports':      {fx:'mvp',     mult:0.65, txt:'Premio al MVP: +2 de fama y +4 de hype al MVP de cada jornada'},
  // solo funcionan en una liga concreta (en las demás son un patrocinador normal)
  'Pepsi':          {fx:'salary', v:0.20, only:'fms_mexico',    txt:'Los fichajes de la liga cuestan un 20% menos'},
  'Corona':         {fx:'ticket', v:0.30, only:'fms_mexico',    txt:'+30% de taquilla'},
  'Mahou':          {fx:'ticket', v:0.30, only:'fms_espana',    txt:'+30% de taquilla'},
  'Vodafone':       {fx:'prod',   v:0.50, only:'fms_espana',    txt:'−50% en costes de producción'},
  'Adidas':         {fx:'salary', v:0.20, only:'fms_argentina', txt:'Los fichajes de la liga cuestan un 20% menos'},
  'Kick':           {fx:'stream', v:0.40, only:'fms_argentina', txt:'Los streamers hablan bien mucho más a menudo (+40%)'},
  'Claro':          {fx:'views',  v:0.05, only:'fms_colombia',  txt:'+5% de visitas en las batallas'},
  'Fanta':          {fx:'hype',   v:4,    only:'fms_peru',      txt:'+4 de hype a toda la plantilla después de cada jornada'},
  'Xiaomi':         {fx:'views',  v:0.05, only:'fms_chile',     txt:'+5% de visitas en las batallas'},
  "McDonald's":     {fx:'rep',    v:6,    only:'fms_caribe',    txt:'+6 de reputación por jornada'},
  'Uber Eats':      {fx:'exfee', v:0.10, mult:0.8, txt:'Las exhibiciones de esta liga cuestan un 10% menos'},
  'Booking':        {fx:'exfee', v:0.10, mult:0.8, txt:'Paga los hoteles: las exhibiciones de esta liga cuestan un 10% menos'},
  'Ryanair':        {fx:'exfee', v:0.10, mult:0.8, txt:'Vuelos baratos: las exhibiciones de esta liga cuestan un 10% menos'},
  'Prime':          {fx:'hype',  v:3,    mult:0.7, txt:'+3 de hype a toda la plantilla después de cada jornada'},
  'Takis':          {fx:'exfee', v:0.10, only:'fms_mexico', txt:'Las exhibiciones cuestan un 10% menos'},
  'Revolut':        {fx:'rep',   v:4,    mult:0.7, txt:'+4 de reputación por jornada'},
  'Samsung':        {fx:'views',  v:0.05, only:'fms_ws',        txt:'+5% de visitas en las batallas'},
  'Jägermeister':   {fx:'mvp',    v:1,    only:'fms_ws',        txt:'Premio al MVP: +2 de fama y +4 de hype al MVP de cada jornada'},
};
const FX_DEF={exfee:0.10, nivel:2, stream:0.2, hype:2, views:0.12, shield:1, salary:0.10, ticket:0.15, prod:0.30, weekday:1, rep:3, mvp:1};
function spFx(x){ return x && SPONSOR_FX[x.name] || null; }
function fxOn(x, key){ const e=spFx(x); return !!(e && (!e.only || e.only===key)); }
function fxVal(key, fx){ const c=state.company; const sl=c && c.sponsors && c.sponsors[key]; if(!sl) return spkFxAdd(key,fx); let v=0;
  sl.forEach(x=>{ if(x && fxOn(x,key) && spFx(x).fx===fx){ const e=spFx(x); v=Math.max(v, e.v!=null?e.v:FX_DEF[fx]); } }); return v + spkFxAdd(key,fx); }
function spkFxAdd(key, fx){ return ['stream','views','salary','exfee'].includes(fx) && typeof spkVal==='function' ? spkVal(key,fx) : 0; }
function leagueHasFx(key, fx){ return fxVal(key,fx)>0; }
function spPool(key){ const c=spState(); return isWS(key) ? c.wsPool : c.sponsorPool; }
function fxTag(x){ const e=spFx(x); return e ? `<span class="sp-fx">⚡ ${esc(e.txt)}${e.only?` <small>(solo en ${ldef(e.only).name}; en otra liga es un patrocinador normal)</small>`:''}</span>` : ''; }
function spState(){ const c=state.company; if(!c.sponsors) c.sponsors={}; if(!c.sponsorPool) c.sponsorPool=[]; if(!c.wsPool) c.wsPool=[];
  if(!c.spReal){ const ok=x=>x && SPONSOR_BRANDS.some(b=>b[0]===x.name); const lost=c.sponsorPool.filter(x=>!ok(x)).length+Object.values(c.sponsors).flat().filter(x=>x&&!ok(x)).length;
    c.sponsorPool=c.sponsorPool.filter(ok); Object.keys(c.sponsors).forEach(k=>{ c.sponsors[k]=c.sponsors[k].map(x=>ok(x)?x:null); });
    if(lost) sponsorOffers(c.stars||1, lost, true); c.spReal=true; }
  if(!c.spStart){ c.spStart=true; const any=c.sponsorPool.length || Object.values(c.sponsors).flat().some(Boolean); if(!any) sponsorOffers(c.stars||0, 3, true); }
  return c; }
function sponsorOffers(stars, n, raw, ws){
  const c=raw? state.company : spState(); const used=ws ? new Set([...(c.wsPool||[]).map(x=>x.name), ...((c.sponsors||{})[WS.key]||[]).map(x=>x&&x.name)]) : new Set([...c.sponsorPool.map(x=>x.name), ...Object.values(c.sponsors).flat().map(x=>x&&x.name)]);
  const free=shuffle(SPONSOR_BRANDS.filter(b=>!used.has(b[0])));
  const out=[];
  for(let i=0;i<n && i<free.length;i++){
    const [name,cat,bg,fg]=free[i];
    const fxm=((SPONSOR_FX[name]||{}).mult||1)*(ws?2:1);
    const amount=Math.round((1000+Math.random()*1800)*(1+0.35*stars)*fxm/100)*100;
    out.push({id:uid('sp'), name, cat, bg, fg, amount, stars});
  }
  if(ws){ if(!c.wsPool) c.wsPool=[]; c.wsPool.push(...out); } else { c.sponsorPool.push(...out); c.newOffers=(c.newOffers||0)+out.length; }
  return out;
}
function spLocked(x){ return !!(x && x.lockSeason!=null && cur() && x.lockSeason===cur().number); }
function sponsorSlotLimit(){ return (state.seasons && state.seasons.length>1) ? 3 : 1; }
function leagueSponsors(key){ const c=spState(); if(!c.sponsors[key]) c.sponsors[key]=[null,null,null]; return c.sponsors[key]; }
function sponsorIncome(key){ const lim=sponsorSlotLimit(); return Math.round(leagueSponsors(key).reduce((a,x,i)=>a+(x&&i<lim?x.amount:0),0)*(1+spkVal(key,'spons'))); }
function spBadge(x, big){ let n=x.name.replace(/ Energy| Music| Sports| G$/,''); if(n.length>8) n=n.split(/[\s-]/).map(w=>w[0]).join('').slice(0,3).toUpperCase(); if(n==='P') n='PS';
  const fs = n.length<=4 ? (big?14:12) : (n.length<=6 ? (big?11.5:10) : (big?10:8.5));
  return `<span class="sp-badge ${big?'big':''}" style="background:${x.bg};color:${x.fg};font-size:${fs}px" title="${esc(x.name)}">${esc(n)}</span>`; }
function ensureWSOffers(){ const s=cur(); if(!s || !s.activeKeys.includes(WS.key)) return; const c=spState(); if(c.wsOfferYear===s.year) return; c.wsOfferYear=s.year; if(c.wsPool.length<3) sponsorOffers(Math.max(5,state.company.stars||0), 4-c.wsPool.length, false, true); }
function renderSponsorSlots(key){
  if(isWS(key)) ensureWSOffers();
  const slots=leagueSponsors(key); const c=spState(); const total=sponsorIncome(key); const lim=sponsorSlotLimit();
  return `<div class="sp-box"><div class="sp-head"><b>Patrocinadores</b> <span class="step-note">${slots.filter((x,i)=>x&&i<lim).length}/${lim} · +${money(total)} por jornada</span>${spPool(key).length?`<span class="sp-pool">${spPool(key).length} oferta${spPool(key).length>1?'s':''} disponible${spPool(key).length>1?'s':''}</span>`:''}</div>
    <div class="sp-slots">${slots.map((x,i)=> i>=lim ? `<div class="sp-slot locked"><span class="sp-plus">🔒</span><span><b>Bloqueado</b><small>Se abre la próxima temporada</small></span></div>` : x ? `<button class="sp-slot on" onclick="openSponsorSlot('${key}',${i})">${spBadge(x)}<span><b>${esc(x.name)}${fxOn(x,key)?' ⚡':''}</b><small>+${money(x.amount)} / jornada${spLocked(x)?' · 🔒 hasta '+(cur().year+1):''}</small></span></button>`
      : `<button class="sp-slot" onclick="openSponsorSlot('${key}',${i})"><span class="sp-plus">+</span><span><b>Hueco libre</b><small>${spPool(key).length?'Elige un patrocinador':'Sin ofertas (llegan al ganar una estrella)'}</small></span></button>`).join('')}</div></div>`;
}
function openSponsorSlot(key, i){
  if(cur().phase!=='pre' && !leagueSponsors(key)[i]){ toast('Los patrocinadores solo se pueden colocar antes de empezar la temporada.'); return; }
  if(i>=sponsorSlotLimit()){ toast('En la primera temporada solo tienes 1 hueco de patrocinio.'); return; }
  const c=spState(); const slots=leagueSponsors(key); const curS=slots[i];
  if(spLocked(curS)){ openModal(`<h3>Patrocinio · ${ldef(key).name}</h3>
    <div class="sp-row cur">${spBadge(curS,true)}<div><b>${esc(curS.name)}</b><small>+${money(curS.amount)} por jornada</small>${fxTag(curS)}</div></div>
    <p class="step-note" style="margin:10px 0 0">🔒 Contrato firmado para esta temporada. Podrás cambiarlo o quitarlo a partir de ${cur().year+1}.</p>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Cerrar</button></div>`, true); return; }
  openModal(`<h3>Patrocinio · ${ldef(key).name}</h3>
    ${curS?`<div class="sp-row cur">${spBadge(curS,true)}<div><b>${esc(curS.name)}</b><small>Ahora en este hueco · +${money(curS.amount)} por jornada</small>${fxTag(curS)}</div><button class="btn small danger" onclick="removeSponsor('${key}',${i})">Quitar</button></div>`:''}
    <p class="step-note" style="margin:10px 0 8px">${spPool(key).length?'Ofertas disponibles. Cada patrocinador paga en cada jornada de esta liga. ⚠️ Una vez lo eliges, no podrás cambiarlo hasta la próxima temporada.':'No tienes ofertas libres. Llegan nuevas cada vez que tu empresa gana una estrella.'}</p>
    <div class="sp-list">${spPool(key).slice().sort((a,b)=>b.amount-a.amount).map(x=>{ const cl=sponsorClash(key,i,x);
      return `<button class="sp-row ${cl?'clash':''}" onclick="assignSponsor('${key}',${i},'${x.id}')" ${cl?'aria-disabled="true"':''}>${spBadge(x,true)}<div><b>${esc(x.name)}</b><small>${cl?`No compatible con ${esc(cl.name)}`:`Oferta de ${x.stars}★`}</small>${fxTag(x)}</div><span class="sp-amt">+${money(x.amount)}<small>por jornada</small></span></button>`; }).join('')}</div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Cerrar</button></div>`, true);
}
function sponsorClash(key, i, x){ const cat=x.cat||brandCat(x.name); const sl=leagueSponsors(key);   // la exclusividad solo cuenta dentro de la misma liga
  for(let n=0;n<sl.length;n++){ const y=sl[n]; if(!y || n===i) continue; if((y.cat||brandCat(y.name))===cat) return y; }
  return null; }
function brandCat(name){ const b=SPONSOR_BRANDS.find(b=>b[0]===name); return b? b[1] : name; }
function assignSponsor(key, i, id){ if(cur().phase!=='pre'){ toast('Los patrocinadores solo se pueden colocar antes de empezar la temporada.'); return; }
  if(i>=sponsorSlotLimit()) return;
  if(spLocked(leagueSponsors(key)[i])){ toast('Ese patrocinador tiene contrato hasta la próxima temporada.'); return; }
  const c=spState(); const slots=leagueSponsors(key); const k=spPool(key).findIndex(x=>x.id===id); if(k<0) return;
  const clash=sponsorClash(key, i, spPool(key)[k]); if(clash){ toast(`${spPool(key)[k].name} no es compatible con ${clash.name}: tienen exclusividad.`); return; }
  const x=spPool(key).splice(k,1)[0]; if(slots[i]) spPool(key).push(slots[i]); x.lockSeason=cur().number; slots[i]=x; c.newOffers=0;
  closeModal(); toast(`${x.name} patrocina ${ldef(key).name}: +${money(x.amount)} por jornada. Contrato cerrado hasta ${cur().year+1}.`); render();
}
function removeSponsor(key, i){ const c=spState(); const slots=leagueSponsors(key); if(spLocked(slots[i])){ toast('Ese patrocinador tiene contrato hasta la próxima temporada.'); return; } if(slots[i]){ spPool(key).push(slots[i]); slots[i]=null; } closeModal(); render(); }

