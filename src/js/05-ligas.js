/* =========================================================================
   LIGAS: round robin y clasificación
========================================================================= */
function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function buildRoundRobin(ids){
  let list=ids.slice(); if(list.length%2) list.push(null);
  const total=list.length, half=total/2, rounds=[];
  for(let r=0;r<total-1;r++){
    const rm=[];
    for(let i=0;i<half;i++){ const a=list[i], b=list[total-1-i]; if(a!=null && b!=null) rm.push({id:uid('m'), a, b, result:null}); }
    rounds.push(rm);
    const fixed=list[0], rest=list.slice(1); rest.unshift(rest.pop()); list=[fixed,...rest];
  }
  return rounds;
}
function computeStandings(L){
  const t={}; L.competitors.forEach(id=> t[id]={id, pts:0, pj:0, v:0, vr:0, dr:0, d:0});
  L.rounds.flat().forEach(m=>{
    if(!m.result) return; const w=t[m.result.winner], l=t[m.result.loser]; if(!w && !l) return;
    if(w) w.pj++; if(l) l.pj++;
    if(m.result.tiebreak){ if(w){ w.vr++; w.pts+=2; } if(l){ l.dr++; l.pts+=1; } } else { if(w){ w.v++; w.pts+=3; } if(l) l.d++; }
  });
  // empate a puntos: decide quién ganó el enfrentamiento directo; si no se han enfrentado, da igual el orden
  const h2h={}; L.rounds.flat().forEach(m=>{ if(m.result) h2h[pairKey(m.a,m.b)]=m.result.winner; });
  return Object.values(t).sort((a,b)=>{ if(b.pts!==a.pts) return b.pts-a.pts;
    const w=h2h[pairKey(a.id,b.id)]; if(w===a.id) return -1; if(w===b.id) return 1; return 0; });
}
function intlSlotsPerLeague(n){ return n===4?4:(n===5?3:(n===6?2:0)); }

/* =========================================================================
   ENFRENTAMIENTOS: comprobar que una elección manual deja un calendario válido
   (cada pareja se enfrenta una sola vez en las 9 jornadas)
========================================================================= */
function pairKey(a,b){ return a<b ? a+'|'+b : b+'|'+a; }
function playedPairsOf(L){ const s=new Set(); L.rounds.slice(0,L.played).forEach(r=>r.forEach(m=>s.add(pairKey(m.a,m.b)))); return s; }
// Devuelve las rondas que faltan (la primera incluye las parejas fijadas) o null si no hay forma de cuadrarlas.
function solveRounds(players, used, fixed, nRounds){
  const n=players.length; const idx={}; players.forEach((p,i)=>idx[p]=i);
  for(let attempt=0; attempt<6; attempt++){
    const avail=players.map(()=>new Set());
    for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) if(!used.has(pairKey(players[i],players[j]))){ avail[i].add(j); avail[j].add(i); }
    const rounds=[]; let nodes=0; const budget=30000;
    let ok=true; const matched0=new Array(n).fill(false); const pairs0=[];
    for(const [a,b] of fixed){
      const i=idx[a], j=idx[b];
      if(i==null||j==null||matched0[i]||matched0[j]||!avail[i].has(j)){ return null; }
      matched0[i]=matched0[j]=true; avail[i].delete(j); avail[j].delete(i); pairs0.push([i,j]);
    }
    const matchRound=(matched,pairs,cb)=>{
      if(++nodes>budget) return false;
      let v=-1; for(let i=0;i<n;i++) if(!matched[i]){ v=i; break; }
      if(v<0) return cb(pairs);
      const opts=shuffle([...avail[v]].filter(u=>!matched[u]));
      for(const u of opts){
        matched[v]=matched[u]=true; avail[v].delete(u); avail[u].delete(v); pairs.push([v,u]);
        if(matchRound(matched,pairs,cb)) return true;
        pairs.pop(); avail[v].add(u); avail[u].add(v); matched[v]=matched[u]=false;
      }
      return false;
    };
    const build=(r)=>{
      if(r===nRounds) return true;
      const matched = r===0 ? matched0 : new Array(n).fill(false);
      const pairs = r===0 ? pairs0 : [];
      return matchRound(matched, pairs, p=>{ rounds[r]=p.slice(); if(build(r+1)) return true; return false; });
    };
    if(build(0)) return rounds.map(r=>r.map(([i,j])=>[players[i],players[j]]));
    if(nodes<=budget) return null; // búsqueda completa sin solución: imposible de verdad
  }
  return null;
}
function nextRoundEditable(L){ return !L.finished && L.rounds.length && !L.confirmed[L.played]; }
