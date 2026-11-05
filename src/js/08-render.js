/* =========================================================================
   RENDER
========================================================================= */
function goto(name, params){ params=params||{}; if(name==='league' && !params.from) params.from = state.view.name==='league' ? (state.view.params.from||'leagues') : state.view.name; state.view={name, params}; _skipScrollRestore=true; render(); }
function themeEl(el, key){
  const uc = /^u_/.test(key||'') && typeof udef==='function' && udef(key) ? udef(key).color : null;
  const t = LEAGUE_THEME[key] || (uc ? {red:uc, bright:`color-mix(in srgb, ${uc} 70%, #fff)`, dark:`color-mix(in srgb, ${uc} 60%, #000)`} : (/^rb_/.test(key||'') ? LEAGUE_THEME.redbull : {red:'#e2101f', bright:'#ff2436', dark:'#7a0a13'}));
  el.style.setProperty('--red',t.red); el.style.setProperty('--red-bright',t.bright); el.style.setProperty('--red-dark',t.dark);
}
function applyViewTheme(){
  const el=document.documentElement; let key=null;
  if(state.view.name==='league') key=state.view.params.key;
  if(state.view.name==='intl') key=INTL.key;
  if(state.view.name==='redbull') key='redbull';
  const t=key? LEAGUE_THEME[key] : null;
  if(t){ el.style.setProperty('--red',t.red); el.style.setProperty('--red-bright',t.bright); el.style.setProperty('--red-dark',t.dark); }
  else { el.style.removeProperty('--red'); el.style.removeProperty('--red-bright'); el.style.removeProperty('--red-dark'); }
}
function render(){
  const active=document.activeElement; let focusId=null, s0=null, s1=null;
  if(active && active.id && document.getElementById('app').contains(active)){ focusId=active.id; if(typeof active.selectionStart==='number'){ s0=active.selectionStart; s1=active.selectionEnd; } }
  const skip=_skipScrollRestore; _skipScrollRestore=false;
  const prevY=window.scrollY;
  const pg=document.querySelector('.pick-grid'); const pgTop=pg? pg.scrollTop : null;
  if(state.company) save();
  const paint=()=>{
    applyViewTheme();
    renderTopbar();
    document.getElementById('app').innerHTML = renderView();
    if(focusId){ const el=document.getElementById(focusId); if(el){ el.focus(); if(s0!=null && el.setSelectionRange){ try{ el.setSelectionRange(s0,s1); }catch(e){} } } }
    tutTick();
    if(skip) window.scrollTo(0,0);
    else { window.scrollTo(0,prevY); const npg=document.querySelector('.pick-grid'); if(npg && pgTop!=null) npg.scrollTop=pgTop; }
  };
  if(typeof requestAnimationFrame==='function') requestAnimationFrame(paint); else setTimeout(paint,0);
}
let _toastTimer=null;
function toast(msg){
  if(typeof SHOW!=='undefined' && SHOW) return;   // durante el espectáculo manda la línea de estado
  let el=document.getElementById('toast');
  if(!el){ el=document.createElement('div'); el.id='toast'; el.className='toast'; el.setAttribute('role','status'); document.body.appendChild(el); }
  el.innerHTML=msg; el.style.display='block';
  clearTimeout(_toastTimer); _toastTimer=setTimeout(()=>{ el.style.display='none'; }, 3200);
}
function openModal(html, wide){ const mr=document.getElementById('modalRoot'); ['--red','--red-bright','--red-dark'].forEach(v=>mr.style.removeProperty(v)); mr.innerHTML=`<div class="modal-bg" onclick="if(event.target===this) closeModal()"><div class="modal ${wide===true?'wide':(wide||'')}">${html}</div></div>`; }
function closeModal(){ document.getElementById('modalRoot').innerHTML=''; document.body.classList.remove('noscroll'); }
function starsHtml(n){ let h=''; for(let i=0;i<5;i++) h+= i<n? '★' : '<span class="off">★</span>'; return `<span class="stars" aria-label="${n} de 5 estrellas">${h}</span>`; }
function leagueDot(key, size){
  const d=ldef(key); const logo=LOGOS[key];
  if(logo){ const s=size||18; return `<img class="lg-logo" src="${logo}" alt="" style="width:${s}px;height:${s}px">`; }
  return `<span class="lg-dot" style="background:${d.badge}${size?`;width:${size}px;height:${size}px;border-radius:${Math.round(size/4)}px`:''}"></span>`;
}
function leagueHeadLogo(key){
  const d=ldef(key); const logo=LOGOS[key];
  return `<span class="logo-slot">${logo?`<img src="${logo}" alt="${d.name}">`:`<span style="background:${d.badge};color:${d.fg}">${d.short}</span>`}</span>`;
}
function hypeColor(h){ return h>=60?'#4bd18f':(h>=35?'#e0b23c':'#ff6b6b'); }
function hypeBar(h){ return `<div class="hype-row">Hype <div class="hype"><i style="width:${clamp(h,0,100)}%; background:${hypeColor(h)}"></i></div><b>${Math.round(h)}</b></div>`; }

function renderTopbar(){
  const tb=document.getElementById('topbar');
  if(!state.company){ tb.innerHTML=`<div class="topbar"><div class="brand">${gameMark()}<div class="name">FMS <span>CEO</span></div></div><div class="top-spacer"></div><button class="btn small gear-btn" onclick="openSettings()" title="Ajustes" aria-label="Ajustes">${GEAR_SVG}</button></div>`; return; }
  const s=cur();
  const tabs=[['dashboard','Inicio'],['calendar','Calendario'],['leagues','Ligas']];
  if(s.intlEnabled || s.intl.played) tabs.push(['intl','Internacional']);
  tabs.push(['redbull','Red Bull'],['freestylers','Freestylers'],['history','Historial']);
  const dateTxt = s.phase==='pre' ? `Pretemporada ${s.year}` : (s.phase==='done' ? `Temporada ${s.year} cerrada` : fmtDay(s.year,s.day)+' '+s.year);
  tb.innerHTML=`<div class="topbar">
    <div class="brand">${gameMark()}<div class="name">FMS <span>CEO</span></div></div>
    <div class="navtabs">${tabs.map(([k,l])=>`<button class="navtab ${state.view.name===k||(k==='leagues'&&state.view.name==='league')?'active':''}" onclick="goto('${k}')">${l}</button>`).join('')}</div>
    <div class="top-spacer"></div>
    <button class="btn small gear-btn" onclick="openSettings()" title="Ajustes" aria-label="Ajustes">${GEAR_SVG}</button>
    <div class="date-pill">${dateTxt} &nbsp;<span class="m ${state.company.money<0?'neg':''}">${moneyK(state.company.money)}</span></div>
    ${s.phase==='live'? `<div class="time-controls">
      <button class="btn small primary" onclick="animatedAdvance('event')">Próxima fecha</button>
    </div>`:''}
  </div>`;
}
function renderView(){
  if(!state.company) return renderWelcome();
  switch(state.view.name){
    case 'calendar': return renderCalendar();
    case 'leagues': return renderLeagues();
    case 'league': return renderLeague(state.view.params.key);
    case 'intl': return renderIntl();
    case 'redbull': return renderRedBull();
    case 'freestylers': return renderFreestylers();
    case 'history': return renderHistory();
    default: return renderDashboard();
  }
}

/* ---------- bienvenida ---------- */
function renderWelcome(){
  const imp=state.ui.importedPool;
  return `<div class="welcome">
    <div class="hero" style="display:block;">
      <h1>Eres el CEO de FMS</h1>
      <p>Empiezas con 0 estrellas, ${money(START_MONEY)} y una sola liga. Cada temporada que completas sumas 1 estrella y desbloqueas una liga más (con 3★ y 4 ligas, el Internacional). Ficha a los 10 freestylers, reparte las 9 jornadas por el año y haz crecer la empresa hasta las 5 estrellas.</p>
    </div>
    <div class="step" style="margin-top:16px;">
      <label class="field-label" for="ng_name">Nombre de la empresa</label>
      <input id="ng_name" value="FMS" style="width:100%; margin-bottom:14px;">
      <span class="field-label">Freestylers</span>
      <p class="step-note" style="margin-bottom:10px;">${imp? `Usarás <b>${imp.length}</b> freestylers importados de tu gestor.` : 'Por defecto se carga el preset de freestylers reales de las FMS (nivel y fama estimados). También puedes importar tu lista desde el JSON que exporta tu gestor de temporadas.'}</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button class="btn" onclick="document.getElementById('poolFileInput').click()">Importar freestylers (.json)</button>
        ${imp?`<button class="btn ghost" onclick="state.ui.importedPool=null; render()">Usar generados</button>`:''}
        <div class="top-spacer"></div>
        <button class="btn primary" onclick="newGame()">Empezar partida</button>
      </div>
      <p class="step-note" style="margin-top:14px;">¿Tienes una partida guardada en archivo? <button class="btn small ghost" onclick="document.getElementById('gameFileInput').click()">Cargar partida</button></p>
    </div>
  </div>`;
}

/* ---------- inicio ---------- */
function renderCompanyHero(){
  const c=state.company; const s=cur();
  const next=STAR_THRESHOLDS[c.stars+1];
  const prevT=STAR_THRESHOLDS[c.stars];
  const pct = next? clamp((c.reputation-prevT)/(next-prevT)*100,0,100) : 100;
  return `<div class="hero" style="display:block;">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:16px; flex-wrap:wrap;">
      <div><h1>${esc(c.name)}</h1><p>Temporada ${s.number} · ${s.year}</p></div>
      <div style="text-align:right;">${starsHtml(c.stars)}<p>Hasta ${maxLeagues(c.stars)} liga(s) activa(s)${c.stars>=3?' · Internacional desde 4 ligas':''}</p></div>
    </div>
    <div class="kpis">
      <div class="kpi"><div class="k-l">Caja</div><div class="k-v ${c.money<0?'neg':''}">${money(c.money)}</div></div>
      <div class="kpi"><div class="k-l">Reputación</div><div class="k-v">${Math.round(c.reputation)}</div>
        <div class="k-l" style="margin-top:4px;">${c.stars<5? `Al cerrar la temporada: ${c.stars+1}★ y hasta ${maxLeagues(c.stars+1)} ligas` : 'Máximo de estrellas'}</div></div>
      <div class="kpi"><div class="k-l">Ingresos temporada</div><div class="k-v">${moneyK(s.fin.income)}</div></div>
      <div class="kpi"><div class="k-l">Gastos temporada</div><div class="k-v">${moneyK(s.fin.salaries+s.fin.production)}</div></div>
    </div>
  </div>`;
}
function renderDashboard(){
  const s=cur();
  let h=renderCompanyHero();
  h+=sponsorBanner();
  if(s.phase==='pre') h+=renderPreseason(s);
  else h+=renderLiveDashboard(s);
  return h;
}
function renderPreseason(s){
  const stars=state.company.stars; const limit=maxLeagues(stars);
  const leaguesOk = s.activeKeys.length>0;
  const rostersOk = leaguesOk && s.activeKeys.every(k=>s.leagues[k].competitors.length===10);
  const totalDates = s.activeKeys.reduce((a,k)=>a+nJ(k),0) + (s.intlEnabled?1:0);
  const placed = s.activeKeys.reduce((a,k)=>a+s.leagues[k].dates.length,0) + (s.intlEnabled && s.intl.date!=null?1:0);
  const issues=preseasonIssues(s);
  const calOk = leaguesOk && placed===totalDates && !issues.some(i=>i.includes('calendario')||i.includes('Internacional'));
  return `<div class="section-title"><h2>Pretemporada</h2></div>
  <div class="steps">
    <div class="step ${leaguesOk?'ok':''}">
      <div class="step-head"><div class="step-num">1</div><h3>Ligas activas</h3><span class="counter"><span class="n">${natKeys(s).length}</span>/${limit}</span></div>
      <div class="league-toggle-grid">
        ${LEAGUES.map(l=>{ const on=s.activeKeys.includes(l.key); const locked=!on && natKeys(s).length>=limit;
          return `<button class="ltoggle ${on?'on':''} ${locked?'locked':''}" onclick="toggleLeague('${l.key}')" aria-pressed="${on}">${leagueDot(l.key)}<span>${l.name}<small>${on?'Activa':(locked?`Necesitas más estrellas`:'Inactiva')}</small></span></button>`; }).join('')}
        <button class="ltoggle ${s.intlEnabled?'on':''} ${natKeys(s).length<4?'locked':''}" onclick="toggleIntl()" aria-pressed="${s.intlEnabled}">${leagueDot(INTL.key)}<span>${INTL.name}<small>${natKeys(s).length<4?'Requiere 4 ligas':(s.intlEnabled?'Activo · 16 plazas':'Inactivo')}</small></span></button>
        <button class="ltoggle ${s.activeKeys.includes(WS.key)?'on':''} ${(state.company.stars||0)<5?'locked':''}" onclick="toggleLeague('${WS.key}')" aria-pressed="${s.activeKeys.includes(WS.key)}">${leagueDot(WS.key)}<span>${WS.name}<small>${(state.company.stars||0)<5?'Requiere 5 estrellas':(s.activeKeys.includes(WS.key)?'Activa · no ocupa cupo':'Inactiva · no ocupa cupo')}</small></span></button>
      </div>
      ${s.intlEnabled? sedePicker() : ''}
    </div>
    <div class="step ${rostersOk?'ok':''}">
      <div class="step-head"><div class="step-num">2</div><h3>Fichajes</h3></div>
      <p class="step-note" style="margin-bottom:10px;">10 freestylers por liga. El contrato de la temporada se paga al fichar. Cada freestyler solo puede estar en una liga nacional${s.activeKeys.includes(WS.key)?' (la World Series va aparte: cobran la mitad y pueden compaginarla)':''}.</p>
      <div class="card-list">${s.activeKeys.map(k=>{ const L=s.leagues[k]; const pay=L.competitors.reduce((a,id)=>a+(L.contracts[id]||0),0);
        return `<div class="tcard" onclick="goto('league',{key:'${k}'})">${leagueDot(k)}<div class="info"><div class="tname">${ldef(k).name}</div><div class="tmeta">Nómina ${moneyK(pay)}</div></div><span class="status ${L.competitors.length===10?'done':'pending'}">${L.competitors.length}/10</span></div>`; }).join('')}</div>
    </div>
    <div class="step ${calOk?'ok':''}">
      <div class="step-head"><div class="step-num">3</div><h3>Calendario</h3><span class="counter"><span class="n">${placed}</span>/${totalDates} fechas</span></div>
      <p class="step-note" style="margin-bottom:10px;">Si dejas más de ${GAP_OK} días entre jornadas de una liga, empieza a perder hype; pasados ${GAP_WARN}, lo pierde rápido. Cada mes del año sin ningún evento te cuesta reputación.</p>
      ${rostersOk? `<button class="btn" onclick="goto('calendar',{from:'dashboard'})">Abrir calendario</button>` : `<button class="btn" disabled style="opacity:.45;cursor:not-allowed">Abrir calendario</button> <span class="step-note">Se desbloquea al completar los fichajes.</span>`}
    </div>
  </div>
  <div class="step ok" style="margin-top:14px;">
    <div class="step-head"><div class="step-num">4</div><h3>Formato de batalla</h3></div>
    <div class="mode-toggle" role="group" aria-label="Formato de batalla">
      <button class="seg ${seasonFormat(s)==='short'?'on':''}" onclick="setFormat('short')" aria-pressed="${seasonFormat(s)==='short'}">Corto</button>
      <button class="seg ${seasonFormat(s)==='long'?'on':''}" onclick="setFormat('long')" aria-pressed="${seasonFormat(s)==='long'}">Largo</button>
    </div>
    <p class="step-note" style="margin-top:8px;">${seasonFormat(s)==='short' ? 'Random Mode, 2 minutos libres y Deluxe. Cada juez puntúa del 1 al 10 por ronda.'+(s.activeKeys.includes(WS.key)?' La World Series siempre se juega en formato corto.':'') : 'Easy Mode (0-30), Hard Mode (0-30), Temáticas (0-44), Random Mode (0-38), 2 minutos libres (0-30 cada uno) y Deluxe (0-42). Más rondas, más peso de los estilos.'+(s.activeKeys.includes(WS.key)?' La World Series siempre se juega en formato corto.':'')}</p>
  </div>
  <div style="display:flex; align-items:center; gap:14px; margin-top:20px; flex-wrap:wrap;">
    <div class="step-note" style="flex:1;">${issues.length? `Falta: ${esc(issues[0])}${issues.length>1?` (y ${issues.length-1} más)`:''}` : 'Todo listo.'}</div>
    <button class="btn primary" ${issues.length?'disabled':''} onclick="startSeason()">Iniciar temporada ${s.year}</button>
  </div>`;
}
function setFormat(v){ const s=cur(); if(s.phase!=='pre') return; s.format=v; render(); }
function sponsorBanner(){ const c=spState(); if(!c.sponsorPool.length) return ''; if(cur() && cur().phase!=='pre') return ''; const lim=sponsorSlotLimit(); const sc=cur(); if(!sc || !natKeys(sc).some(k=>leagueSponsors(k).slice(0,lim).some(x=>!x))) return ''; return `<div class="banner sp-banner">🤝 Tienes <b>&nbsp;${c.sponsorPool.length} oferta${c.sponsorPool.length>1?'s':''} de patrocinio&nbsp;</b> sin colocar. Cada FMS activa admite ${sponsorSlotLimit()} patrocinador${sponsorSlotLimit()>1?'es':''}${sponsorSlotLimit()<3?' (3 desde la 2ª temporada)':''}.&nbsp;<button class="btn small primary" onclick="goto('league',{key:'${cur().activeKeys[0]||LEAGUES[0].key}'})">Colocar</button></div>`; }
function renderLiveDashboard(s){
  const evs=[...seasonEvents(s), ...rbEventsList(s), ...(rbOn(s)&&!s.rb.inter.voted?[{day:s.rb.inter.voteDay, key:'vote'}]:[])].filter(e=>e.day>=s.day).sort((a,b)=>a.day-b.day).slice(0,6);
  let h='';
  if(s.phase==='done'){
    h+=`<div class="banner" style="margin-top:20px;">La temporada ${s.year} ha terminado.&nbsp;<button class="btn small" onclick="showSummary()">Ver resumen</button>&nbsp;<button class="btn small primary" onclick="nextSeason()">Preparar temporada ${s.year+1}</button></div>`;
  } else {

  }
  h+=`<div class="section-title"><h2>Ligas</h2></div><div class="league-toggle-grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));">${s.activeKeys.map(k=>leagueCard(s,k)).join('')}</div>`;
  if(s.phase==='live'){
    h+=`<div class="section-title"><h2>Próximas fechas</h2></div>
    ${evs.length? `<div class="news">${evs.map(e=>`<div class="news-item ${isRB(e.key)||e.key==='vote'?'rb':''}"><span class="nd">${fmtDay(s.year,e.day)}</span>${e.key==='vote'?rbDot(RB_INT.key):anyDot(e.key)}<span>${e.key==='vote'?'🗳️ Votación de comodines Red Bull':(isRB(e.key)? rbdef(e.key).name+(e.key===RB_INT.key?' · 📍 '+s.rb.inter.sede:'') : `${ldef(e.key).name}${e.j?` · Jornada ${e.j}`:' · Eliminatoria de 16'}`)}${e.day===s.day?' <span class="rtag">hoy</span>':''}</span></div>`).join('')}</div>` : `<div class="step-note">No quedan fechas este año.</div>`}`;
  }
  h+=`<div class="section-title"><h2>Noticias</h2></div>${s.log.length?`<div class="news">${s.log.slice(0,25).map(n=>`<div class="news-item ${n.type}"><span class="nd">${fmtDay(s.year,Math.max(0,n.day))}</span><span>${n.text}</span></div>`).join('')}</div>`:'<div class="step-note">Aún no ha pasado nada.</div>'}`;
  return h;
}
function leagueCard(s,k){
  const L=s.leagues[k]; const st=computeStandings(L);
  const nextD=L.finished? null : L.dates[L.played];
  return `<div class="step" style="cursor:pointer;" onclick="goto('league',{key:'${k}'})">
    <div style="display:flex; align-items:center; gap:8px; font-weight:700;">${leagueDot(k)} ${ldef(k).name}<span class="top-spacer"></span><span class="status ${L.finished?'done':'live'}">${L.finished?'Finalizada':`J${L.played}/${nJ(k)}`}</span></div>
    ${hypeBar(L.hype)}
    <div class="hype-row" style="justify-content:space-between;"><span>${L.finished?'Campeón':'Líder'}: <b style="text-align:left">${st[0]&&st[0].pj? fnameH(st[0].id):'—'}</b></span><span>${nextD!=null?'Próxima '+fmtDay(s.year,nextD):''}</span></div>
  </div>`;
}
function confirmSimYear(){
  openModal(`<h3>Simular hasta fin de año</h3><p class="step-note">Se jugarán todas las fechas que quedan y se cerrará la temporada ${cur().year}.</p>
  <div class="modal-actions"><button class="btn" onclick="closeModal()">Cancelar</button><button class="btn primary" onclick="closeModal(); animatedAdvance('year')">Simular</button></div>`);
}
function sumRight(s){
  return `<div class="sum-tabs"><button class="seg on" onclick="sumTab(this,0)">Top 10 batallas</button><button class="seg" onclick="sumTab(this,1)">Top 10 freestylers</button></div>
    <div class="sum-pane on">${topBattlesHtml(s)||'<p class="step-note">Sin batallas.</p>'}</div><div class="sum-pane">${topFreestylersHtml(s)||'<p class="step-note">Sin datos.</p>'}</div>`;
}
function sumTab(btn,i){ const w=btn.closest('.sum-right'); w.querySelectorAll('.sum-tabs .seg').forEach((b,k)=>b.classList.toggle('on',k===i)); w.querySelectorAll('.sum-pane').forEach((p,k)=>p.classList.toggle('on',k===i)); }
function champRows(s){
  return `${s.activeKeys.map(k=>`<div class="sum-row"><span>${leagueDot(k)} ${ldef(k).name}</span><span>🏆 ${fnameH(s.leagues[k].finalStandings[0])}</span></div>`).join('')}
    ${s.intl.champion?`<div class="sum-row"><span>${leagueDot(INTL.key)} ${INTL.name}</span><span>🌎 ${fnameH(s.intl.champion)}</span></div>`:''}
    ${rbOn(s)&&s.rb.inter.champion?`<div class="sum-row"><span>${rbDot(RB_INT.key)} ${RB_INT.name} (${s.rb.inter.sede})</span><span>🔴 ${fnameH(s.rb.inter.champion)}</span></div>`:''}`;
}
function showSummary(){
  const s=cur(); const m=s.summary; if(!m) return;
  const net=m.income-m.salaries-m.production;
  openModal(`<h3>Temporada ${s.year}</h3>
    <div class="sum-grid"><div class="sum-left">
    <div style="margin-bottom:10px;">${starsHtml(m.starsAfter)} ${m.starsAfter>m.starsBefore?'<span class="pos-v"> ¡Subes de estrella!</span>':''}</div>
    <div class="sum-sec">Campeones</div>${champRows(s)}
    <div class="sum-sec">Balance</div>
    <div class="sum-row"><span>Ingresos (taquilla + visitas)</span><b class="pos-v">${money(m.income)}</b></div>
    ${m.views?`<div class="sum-row"><span>· de ellos, por visitas</span><b class="pos-v">${money(m.views)}</b></div>`:''}
    ${m.sponsors?`<div class="sum-row"><span>· de ellos, patrocinios</span><b class="pos-v">${money(m.sponsors)}</b></div>`:''}
    <div class="sum-row"><span>Contratos</span><b class="neg-v">−${money(m.salaries)}</b></div>
    <div class="sum-row"><span>Producción de eventos</span><b class="neg-v">−${money(m.production)}</b></div>
    <div class="sum-row sum-total"><span>Balance</span><b class="${net>=0?'pos-v':'neg-v'}">${money(net)}</b></div>
    <div class="sum-row"><span>Reputación ganada</span><b class="${m.repDelta>=0?'pos-v':'neg-v'}">${m.repDelta>=0?'+':''}${Math.round(m.repDelta)}</b></div>
    <div class="sum-row"><span>Meses sin eventos</span><b>${m.emptyMonths}</b></div>
    ${s.newSponsorOffers?`<div class="banner sp-banner" style="margin:8px 0">🤝 ¡Nueva estrella! ${s.newSponsorOffers} marcas quieren patrocinarte.</div>`:''}
    </div><div class="sum-right">${sumRight(s)}</div></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Cerrar</button>${s===cur()&&s.phase==='done'?`<button class="btn primary" onclick="nextSeason()">Preparar temporada ${s.year+1}</button>`:''}</div>`, 'summary');
}

/* ---------- calendario ---------- */
function renderCalendar(){
  const s=cur(); const y=s.year;
  if(state.ui.calMonth==null) state.ui.calMonth = s.phase==='live'? monthOf(y,s.day) : 0;
  const m=state.ui.calMonth;
  const byDay=eventsByDay(s); const months=monthsWithEvents(s); const rbDay=rbByDay(s);
  const tool=state.ui.calTool && (s.activeKeys.includes(state.ui.calTool) || state.ui.calTool===INTL.key) ? state.ui.calTool : s.activeKeys[0];
  const back=state.view.params&&state.view.params.from==='dashboard';
  let h=`${back?`<div class="back-link" onclick="goto('dashboard')">‹ Inicio</div>`:''}<div class="detail-head"><h1>Calendario ${y}</h1>${back?`<button class="btn small" style="margin-left:auto" onclick="goto('dashboard')">Volver al inicio</button>`:''}</div>`;
  if(s.phase==='pre'){
    if(!rostersComplete(s)){
      const pend=s.activeKeys.filter(k=>s.leagues[k].competitors.length<10);
      return h+`<div class="empty-state"><span class="big">Primero el line up</span>El calendario se elige cuando todas las ligas tienen sus 10 freestylers.${pend.length?` Falta: ${pend.map(k=>`${ldef(k).name} (${s.leagues[k].competitors.length}/10)`).join(', ')}.`:''}<div style="margin-top:14px;"><button class="btn primary" onclick="goto('dashboard')">Ir a fichajes</button></div></div>`;
    }
    h+=`<div class="banner">Elige una liga y toca días vacíos para poner sus jornadas. Toca una fecha ya puesta para quitarla. No puede haber dos eventos el mismo día, y los días de Red Bull están ocupados. De lunes a jueves la taquilla es un ${Math.round((1-WEEKDAY_TICKET)*100)}% menor que de viernes a domingo (🎟).${s.intlEnabled?' El Internacional se coloca cuando estén todas las jornadas nacionales, y siempre después de la última.':''}</div>
    <div class="cal-tools">
      ${s.activeKeys.map(k=>{ const n=s.leagues[k].dates.length; return `<button class="cal-tool ${tool===k?'sel':''}" onclick="state.ui.calTool='${k}'; render()" aria-pressed="${tool===k}">${leagueDot(k)}${ldef(k).short}<span class="cnt ${n===nJ(k)?'full':''}">${n}/${nJ(k)}</span></button>`; }).join('')}
      ${s.intlEnabled?`<button class="cal-tool ${tool===INTL.key?'sel':''}" onclick="state.ui.calTool='${INTL.key}'; render()">${leagueDot(INTL.key)}INTL<span class="cnt ${s.intl.date!=null?'full':''}">${s.intl.date!=null?1:0}/1</span></button>`:''}
      <span class="top-spacer"></span>
      <button class="btn small danger" onclick="clearSchedule()">Vaciar</button>
    </div>`;
  }
  h+=`<div class="cal-toolbar">
    <button class="btn small" ${m===0?'disabled':''} onclick="state.ui.calMonth=${m-1}; render()" aria-label="Mes anterior">‹</button>
    <div class="cal-month-title">${MESES[m]}</div>
    <button class="btn small" ${m===11?'disabled':''} onclick="state.ui.calMonth=${m+1}; render()" aria-label="Mes siguiente">›</button>
    ${s.phase==='live'?`<button class="btn small ghost" onclick="state.ui.calMonth=${monthOf(y,s.day)}; render()">Hoy</button>`:''}
  </div>`;
  const first=dateToDay(y,m,1); const dim=new Date(Date.UTC(y,m+1,0)).getUTCDate();
  const lead=(dayToDate(y,first).getUTCDay()+6)%7;
  h+=`<div class="cal-grid">${DOW.map(d=>`<div class="cal-dow">${d}</div>`).join('')}`;
  for(let i=0;i<lead;i++) h+=`<div class="cal-cell out"></div>`;
  for(let dd=1; dd<=dim; dd++){
    const d=first+dd-1; const ev=byDay[d]; const wd=(lead+dd-1)%7;
    const cls=['cal-cell']; if(wd>=5) cls.push('weekend'); if(s.phase==='pre' && wd>=4) cls.push('prime');
    if(s.phase==='live' && d<s.day) cls.push('past');
    if(s.phase==='pre' && !ev && tool===INTL.key && (natKeys(s).some(k=>s.leagues[k].dates.length<JORNADAS) || d<=lastNationalDay(s))) cls.push('blocked');
    if(s.phase==='pre' && !ev && tool!==INTL.key && s.intlEnabled && s.intl.date!=null && d>=s.intl.date) cls.push('blocked'); if(s.phase==='live' && d===s.day) cls.push('today');
    const resv = s.phase==='pre' && !ev && d<LU_RESERVED && tool!==INTL.key; if(resv) cls.push('reserved');
    const adj = s.phase==='pre' && !ev && !resv && tool!==INTL.key && s.leagues[tool] && s.leagues[tool].dates.some(x=>Math.abs(x-d)===1); if(adj) cls.push('blocked','adj');
    let inner=`<span class="cal-dnum">${dd}</span>${resv?'<span class="cal-na">No disponible</span>':''}`;
    if(ev){
      const def=ldef(ev.key); const played = s.phase!=='pre' && d<s.day || s.phase==='done';
      let sub='';
      if(ev.key===INTL.key) sub = s.intl.champion? '🏆 '+fnameH(s.intl.champion) : 'Eliminatoria';
      else sub = def.name;
      inner+=`<div class="cal-ev ${played?'played':''}" style="background:${def.badge}; color:${def.fg}">${LOGOS[ev.key]?`<img class="cal-logo" src="${LOGOS[ev.key]}" alt="">`:''}${ev.key===INTL.key?'INTL':def.short+' · J'+ev.j}<small>${sub}</small></div>`;
    }
    const rev=rbDay[d];
    if(rev){ const played=(s.phase==='live'&&d<s.day)||s.phase==='done'; const re=rbEvent(s,rev.key);
      inner+=`<div class="cal-ev rb ${rev.key===RB_INT.key?'int':''} ${played?'played':''}">RB ${rbdef(rev.key).short}<small>${re.champion?'🏆 '+fnameH(re.champion):(rev.key===RB_INT.key?'📍 '+s.rb.inter.sede:rbdef(rev.key).name)}</small></div>`; }
    const uev=underByDay(s)[d]; if(uev){ const ud=udef(uev.key); const pl=uev.played; inner+=`<div class="cal-ev under ${pl?'played':''}" style="background:${ud.color}">${ulogo(uev.key)?`<img class="cal-logo" src="${ulogo(uev.key)}" alt="">`:''}${ud.short}${uev.n?' '+uev.n:''}<small>${uev.champion?'🏆 '+fnameH(uev.champion):ud.name}</small></div>`; }
    if(rbOn(s) && d===s.rb.inter.voteDay) inner+=`<div class="cal-vote">🗳️ Votación RB</div>`;
    h+=`<button class="${cls.join(' ')}" onclick="calClick(${d})" aria-label="${dd} de ${MESES[m]}${ev?', '+ldef(ev.key).name+(ev.j?' jornada '+ev.j:''):''}${rev?', '+rbdef(rev.key).name:''}">${inner}</button>`;
  }
  h+=`</div>`;
  // tira de meses
  const curM = s.phase==='live'? monthOf(y,s.day) : -1;
  h+=`<div class="section-title"><h2>Año completo</h2></div><div class="month-strip">${MESES_C.map((mm,i)=>{ const n=seasonEvents(s).filter(e=>monthOf(y,e.day)===i).length;
    return `<button class="ms-cell ${n?'':'empty'} ${i===m?'cur':''}" onclick="state.ui.calMonth=${i}; render()" title="${MESES[i]}">${mm}<span class="n">${n}</span></button>`; }).join('')}</div>
  <p class="step-note" style="margin-top:6px;">${12-months.size} mes(es) sin eventos → −${(12-months.size)*(8+2*state.company.stars)} de reputación.</p>`;
  // análisis
  if(s.activeKeys.some(k=>s.leagues[k].dates.length)){
    h+=`<div class="section-title"><h2>Distancia entre jornadas</h2></div><div class="analysis">${s.activeKeys.map(k=>{
      const gaps=gapsFor(s,k); const loss=Math.round(projectedHypeLoss(s,k));
      return `<div class="analysis-row"><div class="ar-head">${leagueDot(k)} ${ldef(k).name}<span class="top-spacer"></span><span class="step-note">Hype en riesgo: <b style="color:${loss>40?'#ff6b6b':(loss>15?'#e0b23c':'#4bd18f')}">−${loss}</b></span></div>
      <div class="gap-list">${gaps.map((g,i)=>`<span class="gap ${gapClass(g)}" title="${i===0?'Desde el inicio de temporada':'Desde la jornada '+i}">${i===0?'Inicio':'J'+i}→J${i+1}: ${g}d</span>`).join('')||'<span class="step-note">Sin fechas.</span>'}</div></div>`; }).join('')}</div>`;
  }
  return h;
}

/* ---------- ligas ---------- */
function renderLeagues(){
  const s=cur();
  return `<div class="detail-head"><h1>Ligas ${s.year}</h1></div>
  ${s.activeKeys.length? `<div class="league-toggle-grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));">${s.activeKeys.map(k=> s.phase==='pre' ? `<div class="step" style="cursor:pointer" onclick="goto('league',{key:'${k}'})"><div style="display:flex;gap:8px;align-items:center;font-weight:700;">${leagueDot(k)} ${ldef(k).name}<span class="top-spacer"></span><span class="status ${s.leagues[k].competitors.length===10?'done':'pending'}">${s.leagues[k].competitors.length}/10</span></div></div>` : leagueCard(s,k)).join('')}</div>` : `<div class="empty-state"><span class="big">Sin ligas activas</span>Actívalas en Inicio.</div>`}`;
}
function renderLeague(key){
  const s=cur(); const L=s.leagues[key]; const def=ldef(key);
  if(!L) return `<div class="empty-state"><span class="big">Liga no activa</span></div>`;
  const from=state.view.params.from||'leagues'; const backNames={dashboard:'Inicio', leagues:'Ligas', calendar:'Calendario', intl:'Internacional', freestylers:'Freestylers', history:'Historial'};
  const back = backNames[from]? from : 'leagues';
  let h=`<div class="back-link" onclick="goto('${back}')">‹ ${backNames[back]}</div>
  <div class="detail-head">${leagueHeadLogo(key)}<h1>${def.name} ${s.year}</h1></div>`;
  h+=renderSponsorSlots(key);
  if(s.phase==='pre') return h+renderSpeakerBox(s,key)+renderSigning(s,key);
  h+=hypeBar(L.hype);
  spkList(L).map(spkBy).filter(Boolean).forEach(sp=>{ const im=spkImg(sp); h+=`<div class="spk-live">${im?`<img src="${im}" alt="">`:''}<span>🎙️ Host: <b>${esc(sp.name)}</b> · ${esc(spkTxt(sp,key))}</span></div>`; });
  { const jj=Math.min(L.played, nJ(key)-1); const pvx=L.pv&&L.pv[jj]; if(pvx && pvx.shown && !L.finished && jj===L.played) h+=`<div class="lu-again"><button class="btn small" onclick="openPairs('${key}',${jj})">📣 Enfrentamientos oficiales J${jj+1} · ${pvx.delta>=0?'+':''}${pvx.delta} hype</button></div>`; }
  if(L.finished && L.champTw) h+=`<div class="lu-again"><button class="btn small" onclick="openChamp('${key}')">🏆 Reacciones al campeón en X</button></div>`;
  if(L.lu && L.lu.shown) h+=`<div class="lu-again"><button class="btn small" onclick="openLineup('${key}')">📣 Revelación del line up · reacción ${L.lu.delta>=0?'+':''}${L.lu.delta} hype</button></div>`;
  if(L.manual && !L.finished) h+=renderPairingEditor(s,key);
  const st=computeStandings(L); const n=natKeys(s).length;
  const q = (s.intlEnabled && !isWS(key)) ? intlSlotsPerLeague(n) : 0;
  h+=`<div class="section-title"><h2>Clasificación</h2>${q?`<span class="tag">Top ${q} al Internacional</span>`:''}</div>
  <div style="overflow-x:auto;"><table class="standings"><thead><tr><th>#</th><th>Freestyler</th><th class="num">PJ</th><th class="num">V</th><th class="num">VR</th><th class="num">DR</th><th class="num">D</th><th class="num">PTS</th></tr></thead><tbody>
  ${st.map((r,i)=>{ const rel=!isWS(key) && i>=st.length-2; const isQ=i<q;
    return `<tr class="${isQ?'q':''} ${rel?'rel':''}"><td class="pos">${i+1}</td><td><span style="display:inline-flex;align-items:center;gap:8px;cursor:pointer" onclick="showFreestyler('${r.id}')">${miniAvatar(r.id,24)} ${fnameH(r.id)}</span>${isQ?'<span class="qbadge">INTL</span>':''}${(()=>{ const n=L.rounds.flat().filter(m=>m.postponed&&!m.result&&(m.a===r.id||m.b===r.id)).length; return n?`<span class="tag-mini pend">⏳ ${n} batalla${n>1?'s':''} pendiente${n>1?'s':''}</span>`:''; })()}${rel&&L.played?'<span class="tag-mini" style="background:#2a2a2e;color:var(--gray)">Descenso</span>':''}</td>
    <td class="num">${r.pj}</td><td class="num">${r.v}</td><td class="num">${r.vr}</td><td class="num">${r.dr}</td><td class="num">${r.d}</td><td class="pts num">${r.pts}</td></tr>`; }).join('')}
  </tbody></table></div>
  <p class="step-note" style="margin-top:-14px; margin-bottom:10px;">Victoria 3 · Victoria en réplica 2 · Derrota en réplica 1 · Derrota 0</p>`;
  const navKey='jnav_'+key;
  let j = state.ui[navKey]; if(j==null) j=Math.max(0,Math.min(nJ(key)-1, L.played? L.played-1 : 0));
  const round=L.rounds[j]||[];
  h+=`<div class="section-title"><h2>Jornadas</h2></div>
  <div class="jornada-nav"><button class="btn small" ${j===0?'disabled':''} onclick="state.ui['${navKey}']=${j-1}; render()">‹</button>
  <div class="jornada-nav-label">Jornada ${j+1} · ${fmtDay(s.year,L.dates[j])}${isWS(key)&&L.wsSede&&L.wsSede[j]?' · '+esc(L.wsSede[j]):''} ${j<L.played?'<span class="jdone">· jugada</span>':(L.manual && !L.confirmed[j]?'<span class="jprov">· provisional</span>':(L.manual?'<span class="jdone">· elegida</span>':''))}</div>
  <button class="btn small" ${j===nJ(key)-1?'disabled':''} onclick="state.ui['${navKey}']=${j+1}; render()">›</button></div>
  <div class="matches-grid">${round.map(m=>{ const r=m.result; const wa=r&&r.winner===m.a, wb=r&&r.winner===m.b;
    return `<div class="match" style="min-height:0;"><div class="match-head">
      <div class="match-side left ${wa?'win':''}">${miniAvatar(m.a,22)}<span class="side-name">${fnameH(m.a)}</span></div><div class="vs">vs</div>
      <div class="match-side right ${wb?'win':''}"><span class="side-name">${m.ep&&!m.b?'<i class="step-note">Extraplayer</i>':fnameH(m.b)}${m.ep&&m.b?' <span class="tag-mini ep">EP</span>':''}</span>${miniAvatar(m.b,22)}</div></div>
      <div class="match-result"><span>${r? `Gana ${fnameH(r.winner)}${r.tiebreak?' <span class="rtag">réplica</span>':''}${m.recup?' <span class="rtag">recuperativa</span>':''}` : (m.postponed?`Aplazada${m.recupDay!=null?' · recuperativa el '+fmtDay(s.year,m.recupDay):''}`:'Pendiente')}</span><span>${(()=>{ const p=ptbOf(m); return p? 'PTB '+fpt(p[0])+'–'+fpt(p[1]) : fby(m.a).nivel+' · '+(fby(m.b)?fby(m.b).nivel:'—'); })()}</span></div>
      ${r&&(m.lb||m.views)?`<div class="match-result" style="margin-top:2px"><span>${esc(m.lb||'')}</span><span>${m.views?'▶ '+fmtViews(m.views):''}</span></div>`:''}</div>`; }).join('')}</div>
  ${renderExhib(s,L,key,j)}${(()=>{ const fx=L.fexhib&&L.fexhib[j]; if(!fx) return ''; const m=fx.m;
    return `<div class="ex-box done"><div class="ex-h">🎤 Exhibición obligada</div><div class="ex-row">${miniAvatar(fx.a,22)} ${fnameH(fx.a)} <span class="vs">vs</span> ${fnameH(fx.b)} ${miniAvatar(fx.b,22)}</div>
      <div class="step-note">${m&&m.result?`Gana ${fnameH(m.result.winner)} · PTB ${fpt(ptbOf(m)[0])}–${fpt(ptbOf(m)[1])}`:`Sustituye a la batalla aplazada de ${fnameH(fx.missing)}`}</div></div>`; })()}
  ${j<L.played && L.mvps && L.mvps[j]?`<div class="jornada-foot"><span>⭐ MVP: <b>${fnameH(L.mvps[j].id)}</b> · ${fpt(L.mvps[j].pts)} pts</span>${round[0]&&round[0].d&&round[0].d.s?`<button class="btn small" onclick="openFMSShow('${key}',${j})">▶ Ver jornada</button>`:''}</div>`:''}`;
  return h;
}
function renderSigning(s,key){
  const L=s.leagues[key]; const def=ldef(key);
  const fk='sf_'+key; const filter=state.ui[fk]||''; const allC=state.ui['sall_'+key]; const sort=state.ui['ssort_'+key]||'fama';
  let pool=state.freestylers.filter(f=> allC || !def.countries || def.countries.includes(f.country) || L.competitors.includes(f.id));
  if(filter) pool=pool.filter(f=> fMatch(f,filter));
  const sorters={nivel:(a,b)=>b.nivel-a.nivel, fama:(a,b)=>b.fama-a.fama, salario:(a,b)=>contractCost(a,key)-contractCost(b,key), hype:(a,b)=>(b.hype||0)-(a.hype||0)};
  pool.sort(sorters[sort]);
  const pay=L.competitors.reduce((a,id)=>a+(L.contracts[id]||0),0);
  const canKeep = L.prevRoster.length>0;
  return `<div class="selector-box">
    <div class="selector-top">
      <div class="counter"><span class="n">${L.competitors.length}</span>/10 fichados · nómina ${money(pay)} · caja ${money(state.company.money)}</div>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        ${canKeep?`<button class="btn small" onclick="keepRoster('${key}')">Renovar plantilla anterior</button>`:''}
        ${L.competitors.length?`<button class="btn small danger" onclick="releaseAll('${key}')">Liberar todos</button>`:''}
      </div>
    </div>
    ${L.competitors.length?`<div class="picked-strip"><div class="picked-strip-label">Plantilla</div><div class="picked-chips">${L.competitors.map(id=>`<span class="picked-chip" onclick="toggleSign('${key}','${id}')">${miniAvatar(id,22)}${fnameH(id)}<span class="picked-chip-x">×</span></span>`).join('')}</div></div>`:''}
    <div class="selector-top">
      <input id="search_${key}" class="searchbox" placeholder="Buscar freestyler" value="${esc(filter)}" oninput="state.ui['${fk}']=this.value; render()">
      <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
        <select onchange="state.ui['ssort_${key}']=this.value; render()" aria-label="Ordenar">${['nivel','fama','hype','salario'].map(o=>`<option value="${o}" ${sort===o?'selected':''}>Ordenar por ${o}</option>`).join('')}</select>
        <label class="step-note" style="display:flex;gap:6px;align-items:center;"><input type="checkbox" ${allC?'checked':''} onchange="state.ui['sall_${key}']=this.checked; render()"> Todos los países</label>
      </div>
    </div>
    ${(()=>{ if(!L.competitors.length) return ''; const sv=styleVariety(L.competitors);
      const chips=Object.entries(sv.counts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${styleTag({style:k,name:k})}<b class="sv-n ${v>=4?'bad':''}">×${v}</b>`).join(' ');
      const ncw={}; if(isWS(key)) L.competitors.forEach(id=>{ const c=fby(id).country; ncw[c]=(ncw[c]||0)+1; }); const natRep=Object.entries(ncw).filter(([c,v])=>v>=4).map(([c])=>c);
      return `${natRep.length?`<div class="sv-box bad"><b>Nacionalidades</b> · ⚠️ ${natRep.join(' y ')} con 4 o más competidores: la comunidad se quejará y la plantilla perderá un 10% de hype.</div>`:''}<div class="sv-box ${sv.rep.length?'bad':(sv.bonus>0?'good':'')}"><div><b>Variedad de estilos</b> · ${sv.rep.length? `⚠️ ${sv.rep.join(' y ')} repetido 4+ veces: la liga empezará con mucho menos hype y la plantilla perderá un 20%` : `${sv.n} estilos distintos: ${sv.bonus>0?'+'+sv.bonus:'+0'} de hype al arrancar`}</div><div class="sv-chips">${chips}</div></div>`; })()}
    <div class="pick-grid">${pool.map(f=>{
      const checked=L.competitors.includes(f.id); const other=!checked && !isWS(key) && signedLeagueOf(s,f.id); const blocked=L.blocked.includes(f.id);
      const fx=isForeign(f,key); const sal=checked? L.contracts[f.id] : contractCost(f,key); const cant=!checked && sal>state.company.money;
      const od=other? ldef(other):null;
      return `<div class="pick-item ${checked?'checked':''} ${other||cant?'disabled':''} ${blocked?'relegated':''}" onclick="toggleSign('${key}','${f.id}')">
        <span class="mini-avatar" style="width:32px;height:32px;font-size:15px;${avatarDivStyle(f)}">${avatarContent(f)}</span>
        <div style="min-width:0;"><div class="pname">${nameH(f)}</div>${styleTag(f)}${f.demand&&f.demand.year===s.year?(f.demand.good?'<span class="tag-mini dem good">🔥 Pedido por la comunidad</span>':'<span class="tag-mini dem bad">👎 No lo quieren</span>'):''}<div class="pcountry">${esc(f.country)}${fx?' <span class="tag-mini foreign" title="Extranjero: +'+Math.round((FOREIGN_MULT-1)*100)+'% por viajes">✈ viajes</span>':''}</div>
        ${od?`<span class="league-badge-tag" style="background:${od.badge};color:${od.fg}">${od.short}</span>`:''}${blocked?`<div class="relegated-tag">Descendió · vuelve en ${s.year+1}</div>`:''}</div>
        <div class="pick-stats">Nivel <b>${f.nivel}</b><br>Fama <b>${f.fama}</b><br>Hype <b>${f.hype!=null?Math.round(f.hype):'—'}</b><br><span class="sal">${moneyK(sal)}</span></div>
      </div>`; }).join('') || '<div class="step-note">Nadie coincide con la búsqueda.</div>'}</div>
  </div>`;
}

/* ---------- internacional ---------- */
function renderIntl(){
  const s=cur(); const b=s.intl.bracket;
  let h=`<div class="detail-head">${leagueHeadLogo(INTL.key)}<h1>${INTL.name} ${s.year}</h1></div>`;
  if(s.intl.champTw) h+=`<div class="lu-again"><button class="btn small" onclick="openChamp('${INTL.key}')">🏆 Reacciones al campeón en X</button></div>`;
  if(s.intl.lu && s.intl.lu.shown) h+=`<div class="lu-again"><button class="btn small" onclick="openLineup('${INTL.key}')">📣 Revelación del line up · ${s.intl.lu.delta>=0?'+':''}${s.intl.lu.delta}% visitas</button></div>`;
  if(!s.intlEnabled && !b) return h+`<div class="empty-state"><span class="big">No activo</span>Necesitas 4 ligas activas para organizarlo.</div>`;
  if(!b){
    const n=s.activeKeys.length;
    return h+(s.phase==='pre'?sedePicker():'')+`<div class="banner">${s.intl.sede?`📍 ${s.intl.sede}. `:''}${s.intl.date!=null?`Se juega el <b>${fmtDay(s.year,s.intl.date)}</b>. `:'Aún sin fecha. '}Clasificación: ${n===4?'top 4 de cada una de las 4 ligas':(n===5?'top 3 de cada liga (15) + el mejor cuarto':'top 2 de cada liga (12) + cupo del campeón vigente + mejores terceros')}. Los cruces se sortean el día del evento.</div>
    ${s.defendingChampion?`<p class="step-note">Campeón vigente: <b>${fnameH(s.defendingChampion)}</b></p>`:''}`;
  }
  const names=['Octavos','Cuartos','Semifinal','Final'];
  h+=`<div class="banner">${s.intl.sede?'📍 '+s.intl.sede+'. ':''}${esc(s.intl.note||'')}</div><div class="bracket-scroll"><div class="bracket">${b.rounds.map((r,ri)=>`<div class="round"><div class="rlabel">${names[ri]||'Ronda '+(ri+1)}</div>${r.map(m=>bm(m)).join('')}</div>`).join('')}
  <div class="round"><div class="rlabel">3er puesto</div>${bm(b.third)}</div></div></div>
  <div class="podium3">
    <div class="podium-card p1"><div class="medal">1º</div><div class="pname">${fnameH(s.intl.champion)}</div><div class="plabel">Campeón</div></div>
    <div class="podium-card p2"><div class="medal">2º</div><div class="pname">${fnameH(s.intl.runnerUp)}</div><div class="plabel">Subcampeón</div></div>
    <div class="podium-card p3"><div class="medal">3º</div><div class="pname">${fnameH(s.intl.third)}</div><div class="plabel">Tercer puesto</div></div>
  </div>`;
  return h;
}
function bm(m){
  const slot=(id)=>`<div class="bslot ${m.result&&m.result.winner===id?'winner':''}"><span style="display:flex;align-items:center;gap:7px;">${miniAvatar(id,20)}${fnameH(id)}</span>${m.result&&m.result.winner===id&&m.result.tiebreak?'<span class="rtag">réplica</span>':''}</div>`;
  return `<div class="bmatch">${slot(m.a)}${slot(m.b)}</div>`;
}

/* ---------- freestylers ---------- */
function renderFreestylers(){
  const s=cur(); const q=state.ui.fq||''; const c=state.ui.fc||''; const sort=state.ui.fs||'nivel';
  let list=state.freestylers.slice();
  if(q) list=list.filter(f=>fMatch(f,q));
  if(c) list=list.filter(f=>f.country===c);
  list.sort(sort==='fama'?(a,b)=>b.fama-a.fama:sort==='hype'?(a,b)=>(b.hype||0)-(a.hype||0):(sort==='salario'?(a,b)=>salaryOf(b)-salaryOf(a):(a,b)=>b.nivel-a.nivel));
  const countries=[...new Set(state.freestylers.map(f=>f.country))].sort();
  return `<div class="detail-head"><h1>Freestylers</h1><span class="tag" style="font-family:var(--font-cond);color:var(--gray)">${state.freestylers.length}</span></div>
  <div class="fl-toolbar">
    <input id="fq" placeholder="Buscar" value="${esc(q)}" oninput="state.ui.fq=this.value; render()">
    <select onchange="state.ui.fc=this.value; render()" aria-label="País"><option value="">Todos los países</option>${countries.map(x=>`<option ${x===c?'selected':''}>${esc(x)}</option>`).join('')}</select>
    <select onchange="state.ui.fs=this.value; render()" aria-label="Ordenar">${['nivel','fama','hype','salario'].map(o=>`<option value="${o}" ${o===sort?'selected':''}>Por ${o}</option>`).join('')}</select>
  </div>
  <div class="fl-grid">${list.map(f=>{ const lk=signedLeagueOf(s,f.id); const d=lk?ldef(lk):null;
    return `<div class="fl-card" onclick="showFreestyler('${f.id}')"><div class="fl-avatar" style="${avatarDivStyle(f)}">${avatarContent(f)}</div>
    <div style="min-width:0;"><div class="fname">${nameH(f)}</div><div class="fcountry">${esc(f.country)}${d?` <span class="tag-mini" style="background:${d.badge};color:${d.fg}">${d.short}</span>`:''}</div></div>
    <div class="pick-stats">Nivel <b>${f.nivel}</b><br>Fama <b>${f.fama}</b><br>Hype <b>${f.hype!=null?Math.round(f.hype):'—'}</b><br><span class="sal">${moneyK(salaryOf(f))}</span></div></div>`; }).join('')}</div>`;
}
function titlesOf(id){
  const t=[];
  state.seasons.forEach(s=>{
    if(s.phase==='pre') return;
    s.activeKeys.forEach(k=>{ const L=s.leagues[k]; if(L.finished && L.finalStandings[0]===id) t.push(`${ldef(k).name} ${s.year}`); });
    if(s.intl.champion===id) t.push(`${INTL.name} ${s.year}`);
    if(rbOn(s)){ s.rb.events.forEach(e=>{ if(e.champion===id) t.push(`${rbdef(e.key).name} ${s.year}`); }); if(s.rb.inter.champion===id) t.push(`${RB_INT.name} ${s.year}`); }
    (s.under||[]).forEach(e=>{ if(e.champion===id) t.push(`${udef(e.key).name} ${s.year}`); });
  });
  return t;
}
function showFreestyler(id){
  const f=fby(id); const s=cur(); const lk=signedLeagueOf(s,id); const t=titlesOf(id);
  openModal(`<div class="profile-top" style="margin-bottom:10px;">
    <button class="profile-avatar avatar-edit" style="${avatarDivStyle(f)}" onclick="pickImage({type:'photo', id:'${id}'})" aria-label="Cambiar foto">${avatarContent(f)}<em>Foto</em></button>
    <div style="min-width:0; flex:1;"><h3 style="margin:0">${nameH(f)}</h3><div class="pc">${esc(f.country)}${lk?' · '+ldef(lk).name:' · Libre'}</div>
    <div class="avatar-upload-btns"><button class="btn small" onclick="pickImage({type:'photo', id:'${id}'})">${f.photo?'Cambiar foto':'Subir foto'}</button>${f.photo?`<button class="btn small danger" onclick="removePhoto('${id}')">Quitar foto</button>`:''}</div></div></div>
  <label class="field-label" for="fs_name">Nombre</label>
  <div class="formrow"><input id="fs_name" value="${esc(f.name)}" maxlength="40" onkeydown="if(event.key==='Enter') renameFreestyler('${id}')"><button class="btn" onclick="renameFreestyler('${id}')">Guardar nombre</button></div>
  <div class="stat-bars">
    <div class="hype-row">Nivel <div class="hype"><i style="width:${f.nivel}%;background:var(--red-bright)"></i></div><b>${f.nivel}</b></div>
    <div class="hype-row">Fama <div class="hype"><i style="width:${f.fama}%;background:var(--gold)"></i></div><b>${f.fama}</b></div>
    <div class="hype-row">Hype <div class="hype"><i style="width:${f.hype||0}%;background:#b26bff"></i></div><b>${f.hype!=null?Math.round(f.hype):'—'}</b></div>
  </div>
  <div class="style-box">${styleTag(f)}<span>${esc(STYLES[styleOf(f)].txt)}</span></div>
  ${state.ui.devStats?`<div class="dev-box"><span class="field-label" style="color:#e0b23c">DEV · editar parámetros</span>
    <div class="formrow"><label class="dev-field">Nivel<input id="dev_nivel" type="number" min="1" max="99" value="${f.nivel}"></label><label class="dev-field">Fama<input id="dev_fama" type="number" min="1" max="99" value="${f.fama}"></label><label class="dev-field">Hype<input id="dev_hype" type="number" min="1" max="99" value="${f.hype!=null?Math.round(f.hype):50}"></label><label class="dev-field">Estilo<select id="dev_style">${STYLE_NAMES.map(n=>`<option ${styleOf(f)===n?'selected':''}>${n}</option>`).join('')}</select></label><label class="dev-check" style="width:auto;margin:0 0 8px;"><input id="dev_legend" type="checkbox" ${f.legend?'checked':''}> Leyenda (oculto)</label><button class="btn" onclick="devSaveStats('${id}')">Guardar</button></div></div>`:''}
  <div class="sum-row"><span>Pide por temporada</span><b>${money(salaryOf(f))}</b></div>
  <div class="sum-row"><span>Títulos</span><span>${t.length? t.map(esc).join(', ') : '—'}</span></div>
  <div class="modal-actions"><button class="btn" onclick="closeModal()">Cerrar</button></div>`);
}
function renameFreestyler(id){
  const v=(document.getElementById('fs_name').value||'').trim();
  if(!v){ toast('El nombre no puede quedar vacío.'); return; }
  if(state.freestylers.some(f=>f.id!==id && f.name.toLowerCase()===v.toLowerCase())){ toast('Ya hay un freestyler con ese nombre.'); return; }
  fby(id).name=v; toast('Nombre guardado.'); render(); showFreestyler(id);
}
function removePhoto(id){ fby(id).photo=null; render(); showFreestyler(id); }

/* ---------- imágenes (fotos y logos) ---------- */
function pickImage(target){ state.ui.imgTarget=target; document.getElementById('imgFileInput').click(); }
function onImageFile(ev){
  const file=ev.target.files[0]; ev.target.value=''; const t=state.ui.imgTarget; if(!file||!t) return;
  if(!file.type.startsWith('image/')){ toast('Ese archivo no es una imagen.'); return; }
  const r=new FileReader();
  r.onload=()=>{
    const img=new Image();
    img.onload=()=>{
      let url;
      if(t.type==='photo') url=resizeImage(img, 220, true, 'image/jpeg');
      else url=resizeImage(img, 256, false, file.type==='image/jpeg'?'image/jpeg':'image/png');
      if(t.type==='photo'){ fby(t.id).photo=url; render(); showFreestyler(t.id); }

    };
    img.onerror=()=>toast('No se pudo leer esa imagen.');
    img.src=r.result;
  };
  r.readAsDataURL(file);
}
// foto: recorte cuadrado centrado; logo: cabe entero manteniendo transparencia
function resizeImage(img, max, square, mime){
  const c=document.createElement('canvas'); const ctx=c.getContext('2d');
  if(square){
    const side=Math.min(img.width,img.height); c.width=c.height=Math.min(max,side);
    ctx.drawImage(img,(img.width-side)/2,(img.height-side)/2,side,side,0,0,c.width,c.height);
  } else {
    const k=Math.min(1, max/Math.max(img.width,img.height)); c.width=Math.round(img.width*k); c.height=Math.round(img.height*k);
    ctx.drawImage(img,0,0,c.width,c.height);
  }
  return c.toDataURL(mime, 0.85);
}
/* ---------- modo desarrollador (temporal) ---------- */
function openDev(){
  const c=state.company;
  openModal(`<h3>Modo desarrollador</h3>
  <p class="step-note" style="margin-bottom:12px;">Herramienta temporal para probar. Los cambios se aplican al momento.</p>
  <label class="field-label" for="dev_money">Dinero (€)</label>
  <div class="formrow"><input id="dev_money" type="number" step="1000" value="${Math.round(c.money)}"></div>
  <div class="formrow" style="gap:6px;">${[50000,250000,1000000].map(v=>`<button class="btn small" onclick="document.getElementById('dev_money').value=${Math.round(c.money)}+${v}">+${moneyK(v)}</button>`).join('')}</div>
  <span class="field-label">Estrellas</span>
  <div class="formrow" style="gap:6px;">${[0,1,2,3,4,5].map(n=>`<button class="btn small ${state.ui.devStars===n||(state.ui.devStars==null&&c.stars===n)?'primary':''}" onclick="devPickStars(${n})">${n}★</button>`).join('')}</div>
  <label class="field-label" for="dev_rep">Reputación (se ajusta sola al elegir estrellas)</label>
  <div class="formrow"><input id="dev_rep" type="number" value="${Math.round(c.reputation)}"></div>
  <div class="modal-actions" style="flex-wrap:wrap;">
    <label class="dev-check" style="margin-right:auto;"><input type="checkbox" ${state.ui.devStats?'checked':''} onchange="state.ui.devStats=this.checked"> Editar nivel y fama en la ficha de cada freestyler</label>
    <button class="btn" onclick="devNewFreestyler()">Añadir freestyler</button>
    <button class="btn danger" onclick="devConfirmReset()">Reiniciar juego desde 0</button>
    ${cur().phase==='pre'?`<button class="btn" onclick="devApply(); devAutoSign()">Aplicar y autocompletar fichajes</button>`:''}
    <button class="btn" onclick="state.ui.devStars=null; closeModal()">Cancelar</button>
    <button class="btn primary" onclick="devApply()">Aplicar</button>
  </div>`);
}
function devPickStars(n){
  const money=document.getElementById('dev_money').value;
  state.ui.devStars=n; openDev();
  document.getElementById('dev_money').value=money;
  document.getElementById('dev_rep').value=STAR_THRESHOLDS[n];
}
function devApply(){
  const c=state.company;
  const m=parseFloat(document.getElementById('dev_money').value);
  const r=parseFloat(document.getElementById('dev_rep').value);
  if(!isNaN(m)) c.money=m;
  const starsBefore=c.stars;
  if(state.ui.devStars!=null) c.stars=state.ui.devStars;
  if(!isNaN(r)){ c.reputation=Math.max(0,r); }
  if(c.stars>starsBefore) sponsorOffers(c.stars, 3+c.stars);
  state.ui.devStars=null;
  closeModal(); toast(`DEV: ${money(c.money)} · ${c.stars}★ · ${Math.round(c.reputation)} rep.`); render();
}
function devSaveStats(id){
  const f=fby(id);
  const n=parseInt(document.getElementById('dev_nivel').value,10), fa=parseInt(document.getElementById('dev_fama').value,10);
  if(isNaN(n)||isNaN(fa)){ toast('Pon números entre 1 y 99.'); return; }
  const hy=parseInt(document.getElementById('dev_hype').value,10); if(!isNaN(hy)) f.hype=clamp(hy,1,99);
  f.nivel=clamp(n,1,99); f.fama=clamp(fa,1,99); f.legend=document.getElementById('dev_legend').checked; const se=document.getElementById('dev_style'); if(se) f.style=se.value;
  toast(`${f.name}: nivel ${f.nivel}, fama ${f.fama}, hype ${Math.round(f.hype)}. Su salario pasa a ${money(salaryOf(f))} (los contratos ya firmados no cambian).`);
  render(); showFreestyler(id);
}
function devNewFreestyler(){
  state.ui.devStars=null;
  const countries=[...new Set([...LEAGUES.flatMap(l=>l.countries), ...state.freestylers.map(f=>f.country)])].sort((a,b)=>a.localeCompare(b,'es'));
  openModal(`<h3>Añadir freestyler</h3>
  <label class="field-label" for="nf_name">Nombre</label>
  <div class="formrow"><input id="nf_name" maxlength="40" placeholder="Nombre artístico"></div>
  <label class="field-label" for="nf_country">País</label>
  <div class="formrow"><input id="nf_country" list="nf_countries" placeholder="Elige o escribe un país"><datalist id="nf_countries">${countries.map(c=>`<option value="${esc(c)}">`).join('')}</datalist></div>
  <div class="formrow"><label class="dev-field">Nivel<input id="nf_nivel" type="number" min="1" max="99" value="70"></label><label class="dev-field">Fama<input id="nf_fama" type="number" min="1" max="99" value="60"></label><label class="dev-field">Hype<input id="nf_hype" type="number" min="1" max="99" value="50"></label></div>
  <label class="dev-check"><input id="nf_legend" type="checkbox"> Leyenda (oculto)</label>
  <p class="step-note">La foto se sube después desde su ficha. Para que salga por defecto en una liga, usa un país de esa liga (Caribe acepta "Caribe", Venezuela, Cuba, Puerto Rico, República Dominicana y Panamá).</p>
  <div class="modal-actions"><button class="btn" onclick="openDev()">Volver</button><button class="btn" onclick="devCreateFreestyler(true)">Crear y añadir otro</button><button class="btn primary" onclick="devCreateFreestyler(false)">Crear</button></div>`);
  setTimeout(()=>{ const el=document.getElementById('nf_name'); if(el) el.focus(); },50);
}
function devCreateFreestyler(another){
  const name=(document.getElementById('nf_name').value||'').trim();
  const country=(document.getElementById('nf_country').value||'').trim();
  const nivel=parseInt(document.getElementById('nf_nivel').value,10), fama=parseInt(document.getElementById('nf_fama').value,10);
  if(!name){ toast('Ponle un nombre.'); return; }
  if(!country){ toast('Elige o escribe un país.'); return; }
  if(isNaN(nivel)||isNaN(fama)){ toast('Nivel y fama tienen que ser números entre 1 y 99.'); return; }
  if(state.freestylers.some(f=>f.name.toLowerCase()===name.toLowerCase())){ toast('Ya existe un freestyler con ese nombre.'); return; }
  const f={id:uid('f'), name, country, nivel:clamp(nivel,1,99), fama:clamp(fama,1,99), hype:clamp(parseInt(document.getElementById('nf_hype').value,10)||50,1,99), legend:document.getElementById('nf_legend').checked};
  state.freestylers.push(f);
  toast(`${f.name} añadido (${f.country}, pide ${money(salaryOf(f))}).`);
  render();
  if(another){ devNewFreestyler(); document.getElementById('nf_country').value=country; }
  else showFreestyler(f.id);
}
function devConfirmReset(){
  state.ui.devStars=null;
  openModal(`<h3>Reiniciar juego desde 0</h3><p class="step-note">Se borra todo: empresa, temporadas, freestylers (con sus nombres y fotos) y logos. Vuelves a la pantalla de nueva partida.</p>
  <div class="modal-actions"><button class="btn" onclick="openDev()">Volver</button><button class="btn danger" onclick="doReset()">Reiniciar todo</button></div>`);
}
function devAutoSign(){
  const s=cur(); if(s.phase!=='pre') return;
  s.activeKeys.forEach(k=>{
    const L=s.leagues[k]; const def=ldef(k);
    const pool=state.freestylers.filter(f=>!signedLeagueOf(s,f.id) && !L.blocked.includes(f.id)).sort((a,b)=>(def.countries.includes(b.country)-def.countries.includes(a.country)) || b.nivel-a.nivel);
    for(const f of pool){ if(L.competitors.length>=10) break; if(state.company.money<contractCost(f,k)) continue; toggleSign(k,f.id); }
  });
  render();
}

/* ---------- historial ---------- */
function renderHistory(){
  const done=state.seasons.filter(s=>s.phase==='done').slice().reverse();
  return `<div class="detail-head"><h1>Historial</h1></div>
  ${done.length? `<div class="hist-list">${done.map(s=>`<div class="hist-item" onclick="showSeasonSummary(${s.number})"><div class="hn">${s.year}</div>
    <div class="hstat">${s.activeKeys.map(k=>`${ldef(k).short}: ${fnameH(s.leagues[k].finalStandings[0])}`).join(' · ')}${s.intl.champion?` · INTL: ${fnameH(s.intl.champion)}`:''}</div>${starsHtml(s.summary?s.summary.starsAfter:0)}</div>`).join('')}</div>`
  : `<div class="empty-state"><span class="big">Sin temporadas cerradas</span>Aquí aparecerán los campeones y el balance de cada año.</div>`}
  <div class="section-title"><h2>Partida</h2></div>
  <div style="display:flex; gap:8px; flex-wrap:wrap;">
    <button class="btn" onclick="exportGame()">Exportar partida</button>
    <button class="btn" onclick="document.getElementById('gameFileInput').click()">Cargar partida</button>
    <button class="btn danger" onclick="resetGame()">Borrar partida</button>
  </div>
  <p class="step-note" style="margin-top:8px;">La partida se guarda sola en este navegador. Exporta para tener copia o pasarla a otro dispositivo.</p>`;
}
function showSeasonSummary(num){
  const s=state.seasons.find(x=>x.number===num); if(!s) return;
  const m=s.summary; if(!m) return;
  const net=m.income-m.salaries-m.production;
  openModal(`<h3>Temporada ${s.year}</h3>
    <div class="sum-grid"><div class="sum-left">${starsHtml(m.starsAfter)}
    <div class="sum-sec">Campeones</div>${champRows(s)}
    <div class="sum-sec">Balance</div>
    <div class="sum-row"><span>Ingresos</span><b class="pos-v">${money(m.income)}</b></div>
    <div class="sum-row"><span>Gastos</span><b class="neg-v">−${money(m.salaries+m.production)}</b></div>
    <div class="sum-row sum-total"><span>Balance</span><b class="${net>=0?'pos-v':'neg-v'}">${money(net)}</b></div>
    <div class="sum-row"><span>Reputación</span><b>${m.repDelta>=0?'+':''}${Math.round(m.repDelta)}</b></div>
    <div class="sum-row"><span>Meses sin eventos</span><b>${m.emptyMonths}</b></div>
    </div><div class="sum-right">${sumRight(s)}</div></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Cerrar</button></div>`, 'summary');
}

/* ---------- init ---------- */
