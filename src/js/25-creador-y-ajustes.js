/* ---- pantalla del creador al abrir el juego ---- */
function showCreator(){
  const img=(typeof EXTRA_IMG!=='undefined' && EXTRA_IMG.creator) || '';
  openModal(`<div class="creator">${img?`<img class="creator-img" src="${img}" alt="Perfil de X de Medster">`:''}
    <h3 style="margin:14px 0 6px">FMS CEO · un juego de Medster</h3>
    <p>¡Hola! Soy <b>Medster</b> (<a href="https://x.com/MedsterRM" target="_blank" rel="noopener">@MedsterRM</a> en X), el creador de este proyecto.</p>
    <p>Es un juego hecho por y para fans de las batallas de freestyle, gratuito y sin ánimo de lucro.</p>
    <p>Si encuentras <b>fallos</b> en el juego o tienes <b>sugerencias</b>, escríbeme por X y lo miro. ¡Gracias por jugar!</p></div>
    <div class="modal-actions"><a class="btn" href="https://x.com/MedsterRM" target="_blank" rel="noopener">Ir a @MedsterRM</a><button class="btn primary" onclick="closeModal()">Jugar</button></div>`);
}

/* ---- ajustes: reiniciar y añadir competidores ---- */
var GEAR_SVG='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M19.14 12.94a7.07 7.07 0 0 0 .05-.94 7.07 7.07 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.03 7.03 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 2h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.59.24-1.13.56-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22L2.7 8.48a.5.5 0 0 0 .12.64l2.03 1.58a7.07 7.07 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.3.61.22l2.39-.96c.5.38 1.04.7 1.63.94l.36 2.54c.04.24.25.42.49.42h3.8c.24 0 .45-.18.49-.42l.36-2.54c.59-.24 1.13-.56 1.63-.94l2.39.96c.22.08.48 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"/></svg>';
function gameMark(){ const l=(typeof EXTRA_IMG!=='undefined' && EXTRA_IMG.gamelogo); return l ? `<img class="mark mark-img" src="${l}" alt="FMS CEO">` : '<div class="mark">F</div>'; }
var CUSTOM_KEY='fms_ceo_custom_fs';
function customFS(){ try{ return JSON.parse(localStorage.getItem(CUSTOM_KEY)||'[]'); }catch(e){ return []; } }
function saveCustomFS(list){ try{ localStorage.setItem(CUSTOM_KEY, JSON.stringify(list)); }catch(e){ toast('No se pudo guardar el competidor (almacenamiento lleno).'); } }
function customToF(c){ return {id:uid('f'), name:c.name, country:c.country, nivel:50, fama:50, hype:randHype(50), style:c.style, photo:c.photo||null, custom:true}; }
var CUSTOM_COUNTRIES=['España','Argentina','México','Chile','Perú','Colombia','Uruguay','Venezuela','Cuba','Puerto Rico','República Dominicana','Panamá','Costa Rica','Guatemala','Honduras','El Salvador','Nicaragua','Ecuador','Bolivia','Paraguay','EEUU'];
function openSettings(){
  openModal(`<h3>⚙️ Ajustes</h3>
    <div class="set-list">
      <button class="set-item" onclick="openAddFS()"><span class="set-ic">➕</span><span><b>Añadir competidor</b><small>Crea un freestyler nuevo con su nacionalidad, foto y estilo</small></span></button>
      <button class="set-item danger" onclick="confirmRestart()"><span class="set-ic">🔄</span><span><b>Reiniciar juego</b><small>Borra la partida actual y empieza de cero</small></span></button>
    </div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Cerrar</button></div>`);
}
function confirmRestart(){
  openModal(`<h3>Reiniciar juego</h3><p class="step-note">Se borrará la partida actual. Los competidores que hayas creado se mantienen. Si quieres conservar la partida, expórtala antes.</p>
    <div class="modal-actions"><button class="btn" onclick="openSettings()">Cancelar</button><button class="btn danger" onclick="doReset()">Reiniciar</button></div>`);
}
function openAddFS(){
  const d=state.ui.newFS||(state.ui.newFS={name:'', country:'España', style:'Punchline', photo:null});
  openModal(`<h3>➕ Añadir competidor</h3>
    <div class="nf-wrap"><label class="nf-photo" title="Elegir imagen">${d.photo?`<img src="${d.photo}" alt="">`:'<span>Subir<br>imagen</span>'}<input type="file" accept="image/*" onchange="nfPhoto(this)"></label>
      <div class="nf-fields">
        <label class="field-label">Nombre (aka)<input id="nf_name" value="${esc(d.name)}" maxlength="30" oninput="state.ui.newFS.name=this.value" placeholder="Nombre del freestyler"></label>
        <label class="field-label">Nacionalidad<select onchange="state.ui.newFS.country=this.value">${CUSTOM_COUNTRIES.map(c=>`<option ${c===d.country?'selected':''}>${c}</option>`).join('')}</select></label>
        <label class="field-label">Estilo<select onchange="state.ui.newFS.style=this.value; openAddFS()">${STYLE_NAMES.map(st=>`<option ${st===d.style?'selected':''}>${st}</option>`).join('')}</select></label>
        <p class="step-note" style="margin:2px 0 0">${esc(STYLES[d.style].txt)}</p>
        <p class="step-note" style="margin:6px 0 0">Empieza con <b>50 de nivel</b> y <b>50 de fama</b>.</p>
      </div></div>
    ${customFS().length?`<div class="field-label" style="margin-top:12px">Creados por ti</div><div class="un-people">${customFS().map(c=>`<span class="un-p">${c.photo?`<img class="nf-mini" src="${c.photo}" alt="">`:''}${esc(c.name)} <small>${esc(c.country)}</small></span>`).join('')}</div>`:''}
    <div class="modal-actions"><button class="btn" onclick="openSettings()">Volver</button><button class="btn primary" onclick="nfSave()">Añadir</button></div>`);
}
function nfPhoto(inp){ const f=inp.files&&inp.files[0]; if(!f) return; const r=new FileReader();
  r.onload=()=>{ const im=new Image(); im.onload=()=>{ const S=160, c=document.createElement('canvas'); c.width=S; c.height=S; const g=c.getContext('2d');
      const k=Math.max(S/im.width, S/im.height), w=im.width*k, h=im.height*k; g.drawImage(im,(S-w)/2,(S-h)/2.6,w,h);
      state.ui.newFS.photo=c.toDataURL('image/jpeg',0.82); openAddFS(); }; im.src=r.result; }; r.readAsDataURL(f); }
function nfSave(){ const d=state.ui.newFS; const name=(d.name||'').trim(); if(!name){ toast('Ponle un nombre.'); return; }
  const all=customFS(); if(all.some(c=>c.name.toLowerCase()===name.toLowerCase()) || (state.freestylers||[]).some(f=>f.name.toLowerCase()===name.toLowerCase())){ toast('Ya existe un competidor con ese nombre.'); return; }
  const c={name, country:d.country, style:d.style, photo:d.photo||null}; all.push(c); saveCustomFS(all);
  if(state.company && state.freestylers){ state.freestylers.push(customToF(c)); save(); }
  state.ui.newFS=null; toast(`${name} añadido a la base de competidores.`); openAddFS(); render(); }
