/* ---------- init ---------- */
function init(){
  state.ui.devStats=false;
  if(load()) state.view={name:'dashboard',params:{}}; else state.view={name:'welcome',params:{}};
  render();
  window.addEventListener('pagehide', ()=>{ if(state.company) save(); });
}
init();
setTimeout(()=>{ try{ showCreator(); }catch(e){} }, 350);

