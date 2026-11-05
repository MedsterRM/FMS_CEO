/* =========================================================================
   CELEBRACIONES DE CAMPEÓN (FMS nacional, FMS Internacional, Red Bull Internacional)
========================================================================= */
function confettiHtml(colors, n){
  let h=''; for(let i=0;i<n;i++){ const c=colors[i%colors.length]; const l=Math.random()*100, d=Math.random()*2.6, du=2.6+Math.random()*2.4, w=6+Math.random()*7, r=Math.random()*360;
    h+=`<i style="left:${l}%;background:${c};width:${w}px;height:${w*0.45}px;animation-delay:${d}s;animation-duration:${du}s;transform:rotate(${r}deg)"></i>`; }
  return `<div class="cel-confetti" aria-hidden="true">${h}</div>`;
}
function openCelebration(o){
  const f=fby(o.id); if(!f) return;
  let root=document.getElementById('celeb'); if(!root){ root=document.createElement('div'); root.id='celeb'; document.body.appendChild(root); }
  root.innerHTML=`<div class="cel cel-${o.theme}" style="--celc:${o.colors[0]}" role="dialog" aria-label="${esc(o.title)}">
    <div class="cel-rays" aria-hidden="true"></div>${confettiHtml(o.colors, 90)}
    <div class="cel-body">
      <img class="cel-logo" src="${o.logo}" alt="">
      <div class="cel-kicker">${o.kicker}</div>
      <div class="cel-face" style="${avatarDivStyle(f)}">${avatarContent(f)}</div>
      <div class="cel-icon">${o.icon}</div>
      <div class="cel-name">${esc(f.name)}</div>
      <div class="cel-title">${o.title}</div>
      <div class="cel-sub">${o.sub||''}</div>
      <button class="btn primary cel-btn" onclick="closeCelebration()">Continuar</button>
    </div></div>`;
}
function closeCelebration(){ const r=document.getElementById('celeb'); if(r) r.innerHTML=''; render(); const a=state.ui.afterCel; state.ui.afterCel=null; if(a && a.indexOf('champ:')===0) setTimeout(()=>openChamp(a.slice(6)), 80); if(a==='intlViews') setTimeout(showIntlViews, 60); }
function showIntlViews(){
  const s=cur(); const B=s.intl && s.intl.bracket; if(!B) return;
  const KO=['Octavos de final','Cuartos de final','Semifinales'];
  const sec=[]; B.rounds.forEach((r,ri)=>{ if(ri<B.rounds.length-1) sec.push([KO[ri]||'Ronda', r]); }); sec.push(['3er y 4º puesto',[B.third]]); sec.push(['Final',[B.rounds[B.rounds.length-1][0]]]);
  let n=0; state.ui.kov=[]; state.ui.kovMoney=true;
  const rows=sec.map(([t,ms])=>`<div class="kov-h">${t}</div>`+ms.map(m=>{ const i=n++; state.ui.kov.push(m.views||0); const wa=m.result.winner===m.a;
    return `<div class="fm-srow"><div class="fm-sb"><span class="${wa?'w':'l'}">${fmFace(m.a)}${fnameH(m.a)}</span><span class="fm-sres">vs<small>gana ${fnameH(m.result.winner)}</small></span><span class="${wa?'l':'w'} r">${fnameH(m.b)}${fmFace(m.b)}</span></div>
      <div class="fm-views"><span class="fm-vn" id="kov${i}">—</span><button class="btn small" id="kob${i}" onclick="kovReveal(${i})">Revelar visitas</button></div></div>`; }).join('')).join('');
  openModal(`<h3>${INTL.name} ${s.year} · visitas</h3><div class="kov">${rows}</div><div class="fm-sum-foot" id="kovFoot"></div>
    <div class="modal-actions"><button class="btn" onclick="kovAll()">Revelar todas</button><button class="btn primary" onclick="closeModal(); render(); const c=cur().intl.champTw; if(c && !c.shown) setTimeout(()=>openIntlChamp(), 80);">Seguir</button></div>`, true);
  themeEl(document.getElementById('modalRoot'), INTL.key);
}
function kovReveal(i){ const el=document.getElementById('kov'+i), b=document.getElementById('kob'+i); if(!el||!b||b.disabled) return; b.disabled=true; b.style.visibility='hidden';
  countUp(el, 0, state.ui.kov[i]||0, 1400, x=>Math.round(x).toLocaleString('es-ES')+' visitas');
  if(document.querySelectorAll('[id^="kob"]:not([disabled])').length===0){ const t=state.ui.kov.reduce((a,x)=>a+x,0); setTimeout(()=>{ const f=document.getElementById('kovFoot'); if(f) f.innerHTML=`Total: <b>${t.toLocaleString('es-ES')}</b> visitas`+(state.ui.kovMoney?` · <b class="pos-v">${money(Math.round(t*VIEW_RATE))}</b> en YouTube`:''); }, 1450); } }
function kovAll(){ (state.ui.kov||[]).forEach((_,i)=>setTimeout(()=>kovReveal(i), i*150)); }
function celebrateFMSLeague(key){
  const s=cur(); const L=s.leagues[key]; const id=L.finalStandings[0]; const d=ldef(key);
  const st=computeStandings(L).find(r=>r.id===id)||{};
  const mvps=(L.mvps||[]).filter(m=>m&&m.id===id).length;
  const th=LEAGUE_THEME[key]||{red:'#e2101f', bright:'#ff2436'};
  if(L.champTw && !L.champTw.shown) state.ui.afterCel='champ:'+key;
  openCelebration({theme:'fms', logo:LOGOS[key], kicker:`${d.name} · Temporada ${s.year}`, icon:'💍', id,
    title:`Campeón de ${d.name}`, sub:`${st.pts||0} puntos · ${(st.v||0)+(st.vr||0)} victorias${mvps?` · ${mvps} MVP${mvps>1?'s':''}`:''}`,
    colors:[th.red, th.bright, '#ffffff', d.badge]});
}
function celebrateIntl(key){
  const s=cur(); const ev=showEv(s,key);
  if(key===INTL.key){ state.ui.afterCel='intlViews'; } if(key===INTL.key) openCelebration({theme:'gold', logo:LOGOS.fms_internacional, kicker:`${INTL.name} ${s.year}${ev.sede?' · '+ev.sede:''}`, icon:'🏆', id:ev.champion,
      title:'Campeón Internacional', sub:`Ganó la final a ${esc(fname(ev.runnerUp))}`, colors:['#D4AF37','#EFCB5E','#fff3c4','#8A6E1F']});
  else openCelebration({theme:'rb', logo:RB_LOGO, kicker:`${RB_INT.name} ${s.year} · ${ev.sede}`, icon:'🏆', id:ev.champion,
      title:'Campeón del mundo de Red Bull Batalla', sub:`Ganó la final a ${esc(fname(ev.runnerUp))}`, colors:['#DB0A40','#1B2A6B','#F5C400','#ffffff']});
}
function shContinue(){ const key=SHOW&&SHOW.key; closeRBShow(); if(key===INTL.key||key===RB_INT.key) celebrateIntl(key); }
function fmContinue(){
  const key=SHOW&&SHOW.key, j=SHOW&&SHOW.j, replay=SHOW&&SHOW.replay; closeRBShow();
  const L=cur().leagues[key];
  if(!replay && L && L.finished && j===nJ(key)-1) celebrateFMSLeague(key);
}

