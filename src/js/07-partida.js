/* =========================================================================
   PARTIDA: nueva / importar / exportar
========================================================================= */
function newGame(){
  const name=(document.getElementById('ng_name').value||'').trim()||'FMS';
  state.company={name, stars:0, reputation:0, money:START_MONEY, dbv:3}; state.ui.tutQ=null;
  if(!state.ui.importedPool) state.freestylers=generatePool();
  else state.freestylers=state.ui.importedPool;
  customFS().forEach(c=>{ if(!state.freestylers.some(f=>f.name.toLowerCase()===c.name.toLowerCase())) state.freestylers.push(customToF(c)); });
  state.seasons=[]; state.seasons.push(newSeason(null));
  state.ui.importedPool=null; state.company.spStart=true; sponsorOffers(0, 3);
  goto('dashboard');
}
function importPoolFile(ev){
  const file=ev.target.files[0]; if(!file) return;
  const r=new FileReader();
  r.onload=()=>{
    try{
      const d=JSON.parse(r.result);
      const list=(d.freestylers||[]).filter(f=>f && f.name);
      if(list.length<10) throw new Error('pocos');
      state.ui.importedPool=list.map(f=>{ const st=genStats(); return {id:uid('f'), name:f.name, country:f.country||'España', photo:f.photo||null, nivel:st.nivel, fama:st.fama}; });
      toast(`Importados ${list.length} freestylers. Se les han asignado nivel y fama al azar.`);
    }catch(e){ toast('Ese archivo no tiene una lista de freestylers válida (exporta desde tu gestor).'); }
    render();
  };
  r.readAsText(file); ev.target.value='';
}
function exportGame(){
  const dump={company:state.company, freestylers:state.freestylers, seasons:state.seasons, _counter:state._counter};
  const blob=new Blob([JSON.stringify(dump)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`fms_ceo_${cur()?cur().year:'partida'}.json`; a.click();
}
function importGameFile(ev){
  const file=ev.target.files[0]; if(!file) return;
  const r=new FileReader();
  r.onload=()=>{
    try{ const d=JSON.parse(r.result); if(!d.company) throw 0;
      state.company=d.company; state.freestylers=d.freestylers; state.seasons=d.seasons; state._counter=d._counter||1;
      toast('Partida cargada.'); goto('dashboard');
    }catch(e){ toast('Ese archivo no es una partida de FMS CEO.'); }
  };
  r.readAsText(file); ev.target.value='';
}
function resetGame(){
  openModal(`<h3>Borrar partida</h3><p class="step-note">Se pierde la empresa, las temporadas y los freestylers. Exporta antes si quieres conservarla.</p>
  <div class="modal-actions"><button class="btn" onclick="closeModal()">Cancelar</button><button class="btn danger" onclick="doReset()">Borrar partida</button></div>`);
}
function doReset(){ try{ localStorage.removeItem(STORAGE_KEY); }catch(e){} state.company=null; state.seasons=[]; state.freestylers=[]; closeModal(); goto('welcome'); }
