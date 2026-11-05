/* =========================================================================
   X: CAMPEÓN DE LIGA (después de la animación de campeón)
========================================================================= */
var WOMEN_FS=['NG','Azuky','Marithea','Sara Socas','Pandora','Sumeria','Necia','Bohemia','Piromana','Roma','Sandra','Eskai','Arcoiris','Adriana','Dalia','Dalia Castella','Sophia','Papicha','Babi'];
function isWoman(id){ const f=fby(id); return !!(f && WOMEN_FS.some(n=>nrm(n)===nrm(f.name))); }
var CH_COUNTRY={fms_espana:['ESPAÑA','españoles'],fms_argentina:['ARGENTINA','argentinos'],fms_mexico:['MÉXICO','mexicanos'],fms_chile:['CHILE','chilenos'],fms_peru:['PERÚ','peruanos'],fms_colombia:['COLOMBIA','colombianos'],fms_caribe:['CARIBE','caribeños']};
function champWord(n, fem){ const w=['','campeón','bicampeón','tricampeón','tetracampeón','pentacampeón','hexacampeón','heptacampeón','octacampeón'][n] || `${n} veces campeón`; return fem ? w.replace('campeón','campeona') : w; }
function leagueTitles(k, id){ let n=0, streak=0, broken=false; for(let i=state.seasons.length-1;i>=0;i--){ const o=state.seasons[i]; const L=o.leagues&&o.leagues[k];
    const won=!!(L && (o.activeKeys||[]).includes(k) && (L.finalStandings||[])[0]===id); if(won) n++; if(!broken){ if(won) streak++; else broken=true; } } return {n, streak}; }
var TWC={
  es:{ fan:['¡¡{CW}!! {n} campeón de {liga}, lo sabía desde la J1 🏆','{n} se lo ha ganado a pulso. Enhorabuena, máquina','Lloro. {n} {cw} de {liga} 🏆','Qué temporada se ha marcado {n}. Merecidísimo','Lo dije y lo repito: {n} es el mejor de {liga}','{n} campeón. Hoy es un gran día, tío 🔥'],
       neu:['Enhorabuena a {n}, {cw} de {liga}. Temporada muy sólida','Merecido el título de {n}, ha sido el más regular','Felicidades a {n}. Gran nivel durante toda la liga','{n} campeón de {liga}. Poco que discutir'],
       hateSoft:['No era mi favorito, pero enhorabuena a {n}. Se lo ha currado','Me esperaba otro campeón, pero chapó por {n}','{n} campeón… no es lo que quería, pero hay que reconocerlo'],
       rep:['¿Otra vez {n}? {t} títulos de {liga} ya. Siempre gana el mismo','{n} {cw}. {liga} empieza a ser aburrida','Que alguien le gane a {n}, por favor. {t} ligas ya','Ya ni me sorprende: {n} gana otra vez {liga}'],
       streak:['{k} años seguidos ganando {n}. Así no hay emoción','Otra temporada, otro título de {n}. Van {k} seguidos','{n} lleva {k} ligas seguidas. Hay que darle una vuelta a esto'] },
  la:{ fan:['¡¡{CW}!! {n} campeón de {liga}, lo sabía desde la fecha 1 🏆','{n} se lo ganó con todo. Felicitaciones, crack','Lloro. {n} {cw} de {liga} 🏆','Qué temporada hizo {n}. Merecidísimo','Lo dije y lo repito: {n} es el mejor de {liga}','{n} campeón. Hoy es un gran día 🔥'],
       neu:['Felicitaciones a {n}, {cw} de {liga}. Temporada muy sólida','Merecido el título de {n}, fue el más regular','Felicidades a {n}. Gran nivel en toda la liga','{n} campeón de {liga}. Poco que discutir'],
       hateSoft:['No era mi favorito, pero felicitaciones a {n}. Se lo trabajó','Esperaba otro campeón, pero respeto para {n}','{n} campeón… no es lo que quería, pero hay que reconocerlo'],
       rep:['¿Otra vez {n}? {t} títulos de {liga} ya. Siempre gana el mismo','{n} {cw}. {liga} se está volviendo aburrida','Que alguien le gane a {n}, por favor. {t} ligas ya','Ya ni me sorprende: {n} gana otra vez {liga}'],
       streak:['{k} años seguidos ganando {n}. Así no hay emoción','Otra temporada, otro título de {n}. Van {k} seguidos','{n} lleva {k} ligas seguidas. Algo hay que cambiar'] },
};
var TWC_DIA={ ar:{fan:['¡CAMPEÓÓÓN! {n} {cw} de {liga}, loco 🏆','Re merecido lo de {n}, posta'], rep:['Siempre {n}, siempre {n}… ya aburre, loco']},
  mx:{fan:['¡No manches, {n} {cw}! Bien merecido, carnal 🏆','Qué chido lo de {n}, se lo ganó'], rep:['Siempre {n}… ya aburre la neta']},
  cl:{fan:['¡{n} {cw} po! La raja 🏆','Bacán lo de {n}, se lo ganó'], rep:['Siempre {n}, weón… ya aburre']},
  pe:{fan:['¡Asu, {n} {cw}! Bien merecido, causa 🏆'], rep:['Siempre {n}… ya aburre, causa']},
  co:{fan:['¡Qué chimba, {n} {cw}! Merecido, parce 🏆'], rep:['Siempre {n}… ya aburre, parce']},
  car:{fan:['¡Brutal, {n} {cw}! Merecido, pana 🏆'], rep:['Siempre {n}… ya aburre esa vaina']},
  es:{fan:['Madre mía, {n} {cw}. Qué pasada 🏆'], rep:['Siempre {n}… ya cansa, tío']} };
var TWC_COMP={ es:['Enhorabuena, @{h}. Merecidísimo, campeón 🏆','Felicidades @{h}, ha sido un placer competir contigo esta temporada','Grande @{h}. El año que viene voy a por ti 😅'],
  la:['Felicitaciones, @{h}. Merecidísimo, campeón 🏆','Felicidades @{h}, fue un placer competir con vos esta temporada','Grande @{h}. El año que viene voy por vos 😅'] };
var TWC_OFF={ es:['🏆 ¡{n} es el {cw} de {liga} {y}! Enhorabuena, {campeon}','Tenemos {campeon}: {n} se corona en {liga} {y} 🏆','{n}, {cw} de {liga}. Gracias a todos por esta temporada 🏆'],
  la:['🏆 ¡{n} es el {cw} de {liga} {y}! Felicitaciones, {campeon}','Tenemos {campeon}: {n} se corona en {liga} {y} 🏆','{n}, {cw} de {liga}. Gracias a todos por esta temporada 🏆'] };
function chGenerate(s, k){
  const L=s.leagues[k]; const id=L.finalStandings[0]; if(!id) return; const liga=ldef(k).name; const fem=isWoman(id);
  const T=leagueTitles(k,id); const cw=champWord(T.n, fem); const campeon=fem?'campeona':'campeón';
  const real=TWITTEROS.filter(t=>!t.special).map(twAcc); const accs=shuffle(real);
  const lc = isWS(k) ? null : ldef(k).countries; const isLocal=a=> !lc || (a.country && lc.includes(a.country));
  const usedT=new Set(); const pk=list=>{ const f=list.filter(x=>!usedT.has(x)); const t=pick(f.length?f:list); usedT.add(t); return t; };
  const fill=(t,o)=>t.replace(/\{(\w+)\}/g,(m,x)=>o[x]!=null?o[x]:m);
  const C=(a,cat)=>{ const d=twDia(a&&a.country); return pk(((TWC_DIA[d]||{})[cat]||[]).concat(TWC[d==='es'?'es':'la'][cat])); };
  const o={n:fname(id), liga, cw, CW:cw.toUpperCase(), t:T.n, k:T.streak, y:s.year, campeon};
  const tw=[]; const add=(acc, text, sent)=>tw.push({h:acc.handle, n:acc.name, c:acc.country||null, v:!!acc.verified, img:acc.img||null, text, sent, at:0, likes:Math.round(Math.pow(Math.random(),2)*5000)+rint(10,90), rts:rint(5,600), cm:rint(5,120)});
  const used=new Set(); const like=a=>(a.fav||[]).some(n=>nrm(n)===nrm(fname(id))), dis=a=>(a.hate||[]).some(n=>nrm(n)===nrm(fname(id)));
  const off=leagueAcc(k); add(off, fill(pick(TWC_OFF[twDia(off.country)==='es'?'es':'la']), o), 1);
  accs.filter(like).slice(0,4).forEach(a=>{ used.add(a.handle); add(a, fill(C(a,'fan'),o), 1); });
  const repN = T.n>=3 ? (T.streak>=3 ? 3 : (T.streak>=2 ? 2 : 1)) : 0;
  accs.filter(a=>dis(a) && !used.has(a.handle)).slice(0, T.n>=3?2:1).forEach(a=>{ used.add(a.handle); add(a, fill(C(a, T.n>=3 ? (T.streak>=2?'streak':'rep') : 'hateSoft'),o), T.n>=3?-1:0); });
  accs.filter(a=>!used.has(a.handle) && !like(a) && isLocal(a)).slice(0,repN).forEach(a=>{ used.add(a.handle); add(a, fill(C(a, T.streak>=2 && Math.random()<0.6 ? 'streak':'rep'),o), -1); });
  accs.filter(a=>!used.has(a.handle) && !dis(a) && (isLocal(a) || Math.random()<0.15)).slice(0,rint(2,3)).forEach(a=>{ used.add(a.handle); add(a, fill(C(a,'neu'),o), 1); });
  // compañeros de liga felicitan (el subcampeón incluido), nunca un rival
  [L.finalStandings[1], ...shuffle(L.finalStandings.slice(2))].filter(x=>x && !isRival(x,id)).slice(0,rint(1,2)).forEach(x=>{ const f=fby(x);
    add({handle:twHandle(f.name), name:f.name, country:f.country, verified:true, img:photoOf(f)}, fill(pick(TWC_COMP[twDia(f.country)==='es'?'es':'la']),{h:twHandle(fname(id))}), 1); });
  if(GZ_CREW.some(n=>nrm(n)===nrm(fname(id)))){ const gz=state.freestylers.find(f=>f.name==='Gazir'); if(gz && gz.id!==id) add({handle:'gazir', name:'Gazir', country:gz.country, verified:true, img:photoOf(gz)}, fill(pick(PATRON_TX.gazirCH),{h:twHandle(fname(id)), cw, liga}), 1); }
  // última jornada: contra quién jugó
  const lastR=L.rounds[L.rounds.length-1]||[]; const fm=lastR.find(m=>m.a===id||m.b===id); const opp=fm ? (fm.a===id?fm.b:fm.a) : null; const won=fm && fm.result && fm.result.winner===id;
  const intl = !isWS(k) && s.intlEnabled && s.intl && s.intl.sede; const sedeF = intl ? flagOf(s.intl.sede) : '';
  const lf=leagueFlag(k); const nw=TW_NEWS[Math.random()<0.5?0:1]; const acc={...nw, img:EXTRA_IMG[nw.img]||null}; let text;
  const CC=CH_COUNTRY[k]||[isWS(k)?'LA WORLD SERIES':liga.toUpperCase(),'suyos'];
  if(nw.special==='mcn'){
    text=`${lf} ${fname(id).toUpperCase()} - ${cw.toUpperCase()} ${liga.toUpperCase()} ${s.year} ${lf}\n\n${fname(id)} ${opp?(won?`vence a ${fname(opp)} en la jornada final y gana`:`cae ante ${fname(opp)} en la jornada final, pero gana`):'gana'} ${isWS(k)?`la FMS World Series ${s.year}`:`la FMS Nacional de ${ldef(k).countries[0]==='Caribe'?'Caribe':ldef(k).countries[0]} ${s.year}`}!!!${T.n>1?` (${T.n}º título)`:''}${intl?`\n\nEstará en la FMS Internacional ${s.year}, en ${s.intl.sede} ${sedeF}`:''}`;
  } else {
    text=`¡El${fem?'la':''} ${(fem?'CAMPEONA':'CAMPEÓN')} de ${CC[0]} ${lf}! 🏆\n\n${nrm(fname(id)).toUpperCase()} se convirtió en ${fem?'la':'el'} ${cw} de la ${liga} ${lf} ${opp?(won?`tras vencer a ${fname(opp)} en la última jornada.`:`pese a caer ante ${fname(opp)} en la última jornada.`):''} 🔥${intl?`\n\n${fname(id)} estará representando a los ${CC[1]} en la FMS Internacional que se disputará en ${s.intl.sede} ${sedeF}.`:''}\n\n#FMS${nrm(liga.replace(/^FMS\s*/i,'')).replace(/[^a-z0-9]/g,'').replace(/^./,c=>c.toUpperCase())} 🏆`;
    text=text.replace('¡Ella CAMPEONA','¡La CAMPEONA');
  }
  add(acc, text, 0);
  L.champTw={id, cw, titles:T.n, streak:T.streak, tweets:tw, shown:false};
}
function openChamp(key){
  const s=cur(); const L=s.leagues[key]; const c= key===INTL.key ? (s.intl&&s.intl.champTw) : (L&&L.champTw); if(!c) return; c.shown=true; save(); document.body.classList.add('noscroll');
  const f=fby(c.id); const def=ldef(key); const tok={}; PV_ANIM=tok;
  openModal(`<h3 class="lu-title">${leagueHeadLogo(key)} ${esc(def.name)} ${s.year} · ${c.cw.charAt(0).toUpperCase()+c.cw.slice(1)}</h3>
    <div class="lu-wrap"><div class="ch-card"><div class="ch-ph" style="${avatarDivStyle(f)}">${avatarContent(f)}</div><div class="ch-trophy">${emoHtml('🏆')}</div>
      <div class="ch-name">${fnameH(c.id)}</div><div class="ch-word">${esc(c.cw.toUpperCase())}</div><div class="ch-meta">${c.titles>1?`${c.titles} títulos de ${esc(def.name)}${c.streak>1?` · ${c.streak} seguidos`:''}`:'Primer título de '+esc(def.name)}</div></div>
      <div class="lu-x"><div class="lu-xhead"><span class="lu-xlogo">𝕏</span> Tendencias · <b>#${esc(twHandle(f.name).replace(/^./,x=>x.toUpperCase()))}${esc(nrm(c.cw).replace(/[^a-z]/g,'').replace(/^./,x=>x.toUpperCase()))}</b></div><div class="lu-feed" id="luFeed"></div></div></div>
    <div class="modal-actions"><button class="btn" id="luSkip" onclick="chSkip()">Revelar todo</button><button class="btn primary" onclick="PV_ANIM=null; closeModal(); render()">Seguir</button></div>`, 'lineup');
  themeEl(document.getElementById('modalRoot'), key);
  const feed=document.getElementById('luFeed'); const show=i=>{ if(feed && c.tweets[i]) feed.insertAdjacentHTML('afterbegin', luTweetHtml(c.tweets[i])); };
  c.tweets.forEach((t,i)=>setTimeout(()=>{ if(PV_ANIM===tok) show(i); }, 500+i*550));
  window.chSkip=()=>{ PV_ANIM=null; if(feed){ feed.innerHTML=''; c.tweets.forEach((t,i)=>show(i)); } const b=document.getElementById('luSkip'); if(b) b.disabled=true; };
}
/* ---- "dejen de robarle": a partir de la J4 (J3 en la World Series) los fans de los de abajo se quejan ---- */
var TWR={
  es:['Dejad de robarle a {n}, por favor. Esa batalla la ganó','Otra vez le roban a {n}. Así no hay quien compita','Los jueces tienen algo contra {n}, no es normal','{n} {pos}º en la tabla con el nivel que tiene… algo falla','Lo de {n} esta temporada es un robo tras otro','Que revisen las votaciones de {n}, que no puede ser','Justicia para {n}. Va {pos}º y no se lo merece','A {n} le están tongando puntos jornada tras jornada'],
  la:['Dejen de robarle a {n}, por favor. Esa batalla la ganó','Otra vez le roban a {n}. Así no se puede competir','Los jueces tienen algo contra {n}, no es normal','{n} {pos}º en la tabla con el nivel que tiene… algo anda mal','Lo de {n} esta temporada es un robo tras otro','Que revisen las votaciones de {n}, no puede ser','Justicia para {n}. Va {pos}º y no se lo merece','A {n} le están tongando puntos fecha tras fecha'],
};
var TWR_DIA={ar:['Le roban a {n} todas las fechas, loco. Una vergüenza'],mx:['Neta le están robando a {n}, no manches'],cl:['Le roban a {n} todas las fechas, weón'],pe:['Le roban a {n} cada fecha, causa'],co:['Le están robando a {n}, parce, no es justo'],car:['Le roban a {n} cada fecha, pana'],es:['Le roban a {n} cada jornada, tío. Qué vergüenza']};

(function(){   // más variaciones en general
  const D={ es:{fav:['Lo de {n} en {liga} me ha alegrado la semana','{n} confirmado. Ya tengo excusa para ver {liga}','Si me preguntáis por un nombre del cartel: {n}','{n} en {liga} es justo lo que quería'],
               hate:['{n} no está entre mis preferidos, pero respeto la elección','Ojalá {n} me cierre la boca este año','A {n} le falta algo para convencerme'],
               otra:['Me llama la atención el cartel de {liga} este año','Puede que me enganche a {liga} esta temporada'],
               miss:['Sin {f}, {liga} pierde mucho','Me esperaba a {f} sí o sí en {liga}'], missVs:['Prefiero mil veces a {f} antes que a {n}, la verdad']},
    ar:{fav:['Lo de {n} en {liga} me alegró la semana','{n} confirmado. Ya tengo excusa para mirar {liga}','Si me preguntan por un nombre del cartel: {n}','{n} en {liga} es justo lo que quería'],
        hate:['{n} no está entre mis preferidos, pero respeto la elección','Ojalá {n} me cierre la boca este año','A {n} le falta algo para convencerme'],
        otra:['Me llama la atención el cartel de {liga} este año','Capaz que me engancho a {liga} esta temporada'],
        miss:['Sin {f}, {liga} pierde un montón','Esperaba a {f} sí o sí en {liga}'], missVs:['Prefiero mil veces a {f} antes que a {n}, posta']},
    mx:{fav:['Lo de {n} en {liga} me alegró la semana','{n} confirmado. Ya tengo pretexto para ver {liga}','Si me preguntan por un nombre del cartel: {n}','{n} en {liga} es justo lo que quería, neta'],
        hate:['{n} no está entre mis favoritos, pero respeto la decisión','Ojalá {n} me calle la boca este año','A {n} le falta algo para convencerme'],
        otra:['Me llama la atención el cartel de {liga} este año','A lo mejor me engancho a {liga} esta temporada'],
        miss:['Sin {f}, {liga} pierde mucho','Esperaba a {f} sí o sí en {liga}'], missVs:['Prefiero mil veces a {f} que a {n}, la neta']},
    neu:{fav:['{n} en {liga} es justo lo que quería'], hate:['{n} no está entre mis favoritos, pero respeto la elección'], otra:['Me llama la atención el cartel de {liga}'], miss:['Sin {f}, {liga} pierde mucho'], missVs:['Prefiero a {f} antes que a {n}']} };
  for(const d in D) for(const c in D[d]) TWD[d][c]=(TWD[d][c]||[]).concat(D[d][c]);
  ['cl','pe','co','car'].forEach(d=>{ for(const c in D.neu) TWD[d][c]=(TWD[d][c]||[]).concat(D.neu[c]); });
  const G={ es:{meh:['{n} es la incógnita del cartel','Veremos si {n} está a la altura de {liga}','{n} tiene una oportunidad de oro este año'], rep:['{n} en {liga} por {k}ª vez seguida. Tocaría un descanso'], nuevo:['{n} estrena FMS. Mucha suerte'], top:['Este cartel de {liga} es de los que se recuerdan'], low:['Cartel discreto en {liga}. A ver si sorprenden'], styleOk:['Un estilo de cada, como debe ser'], bomb:['No me lo creo: {n} en {liga}']},
            la:{meh:['{n} es la incógnita del cartel','Veremos si {n} está a la altura de {liga}','{n} tiene una oportunidad de oro este año'], rep:['{n} en {liga} por {k}ª vez seguida. Tocaría un descanso'], nuevo:['{n} estrena FMS. Mucha suerte'], top:['Este cartel de {liga} es de los que se recuerdan'], low:['Cartel discreto en {liga}. A ver si sorprenden'], styleOk:['Un estilo de cada uno, como debe ser'], bomb:['No lo puedo creer: {n} en {liga}']} };
  for(const d in G) for(const c in G[d]) TWG[d][c]=(TWG[d][c]||[]).concat(G[d][c]);
  const P={ both:['{a} vs {b}: la que más ganas tengo de ver en toda la temporada','Ojalá {a} vs {b} vaya a réplica y dure más'], hateBoth:['{a} vs {b}, no es mi tipo de batalla'], vs:['Que {a} demuestre contra {b} quién manda'],
    fav:['{a} contra {b}, voy con {a} a muerte','Seguro que {a} saca algo grande contra {b}','{a} vs {b}, la tengo marcada en el calendario'], rep:['{a} vs {b} otra vez. Ya podrían cambiar algo'],
    rival:['{a} y {b} se tienen ganas. Se va a notar'], ex:['La exhibición {a} vs {b} me parece un acierto'], gen:['{a} vs {b} tiene pinta de sorpresa','No sé quién gana el {a} vs {b}, y eso me encanta','{a} vs {b}: duelo de estilos'] };
  for(const c in P) TWP_BASE[c]=TWP_BASE[c].concat(P[c]);
  const C={ es:{fan:['{n}, {cw}. Te lo has ganado, máquina 🏆','Lo que he disfrutado esta temporada de {n}. Campeón merecido'], neu:['Campeón justo: {n} ha sido el más constante'], hateSoft:['No es mi campeón, pero {n} ha hecho una gran temporada'], rep:['Otro título para {n}. Esto ya parece un monólogo']},
            la:{fan:['{n}, {cw}. Te lo ganaste, crack 🏆','Lo que disfruté esta temporada de {n}. Campeón merecido'], neu:['Campeón justo: {n} fue el más constante'], hateSoft:['No es mi campeón, pero {n} hizo una gran temporada'], rep:['Otro título para {n}. Esto ya parece un monólogo']} };
  for(const d in C) for(const c in C[d]) TWC[d][c]=TWC[d][c].concat(C[d][c]);
  TWR.es.push('{n} merece estar más arriba. Algo raro pasa con sus votaciones','Robo tras robo a {n}. Y luego dicen que no hay favoritismos');
  TWR.la.push('{n} merece estar más arriba. Algo raro pasa con sus votaciones','Robo tras robo a {n}. Y después dicen que no hay favoritismo');
  // competidores
  const GO={ es:['Último día de preparación. Nos vemos en {liga}','Esta temporada vengo distinto. {liga}, preparaos','Agradecido de estar en {liga} un año más. A disfrutar','Mucho trabajo detrás de esta temporada. Ahora toca demostrarlo','A por el título. Ni más ni menos','Que nadie se confíe conmigo este año en {liga}'],
    ar:['Último día de preparación. Nos vemos en {liga}','Esta temporada vengo distinto. {liga}, prepárense','Agradecido de estar en {liga} un año más. A disfrutar','Mucho laburo detrás de esta temporada. Ahora toca demostrarlo','Vamos por el título. Ni más ni menos'],
    mx:['Último día de preparación. Nos vemos en {liga}','Esta temporada vengo diferente. {liga}, prepárense','Agradecido de estar en {liga} un año más. A disfrutar, raza','Mucha chamba detrás de esta temporada. Ahora toca demostrarlo','Vamos por el título, carnal'],
    cl:['Esta temporada vengo distinto po. {liga}, prepárense','Harta pega detrás de esta temporada. A demostrarlo'], pe:['Esta temporada vengo distinto, causa. {liga}, prepárense','Mucha chamba detrás de esta temporada. A demostrarlo'],
    co:['Esta temporada vengo distinto, parce. {liga}, prepárense','Mucho camello detrás de esta temporada. A demostrarlo'], car:['Esta temporada vengo distinto, pana. {liga}, prepárense','Mucho trabajo detrás de esta temporada. A demostrarlo'],
    neu:['Esta temporada vengo distinto. {liga}, prepárense','Mucho trabajo detrás de esta temporada. Ahora toca demostrarlo'] };
  for(const d in GO) TW_GO[d]=(TW_GO[d]||[]).concat(GO[d]);
  const PC={ es:['Ganas de que llegue el día. @{h}, nos vemos','Buena batalla la que nos espera, @{h}','A dejarlo todo contra @{h}. Que disfrute la gente','Contra @{h} siempre salen cosas buenas. Allí estaré'],
    ar:['Ganas de que llegue el día. @{h}, nos vemos','Linda batalla nos espera, @{h}','A dejar todo contra @{h}. Que disfrute la gente','Contra @{h} siempre salen cosas buenas. Ahí voy a estar'],
    mx:['Ya quiero que llegue el día. @{h}, nos vemos','Buena batalla nos espera, @{h}','A dejarlo todo contra @{h}. Que disfrute la raza'],
    cl:['Buena batalla nos espera, @{h} po'], pe:['Buena batalla nos espera, @{h}, causa'], co:['Buena batalla nos espera, @{h}, parce'], car:['Buena batalla nos espera, @{h}, pana'], neu:['Buena batalla nos espera, @{h}'] };
  for(const d in PC) TWP_COMP[d]=(TWP_COMP[d]||[]).concat(PC[d]);
  TWC_COMP.es.push('Felicidades @{h}. Te lo has currado toda la temporada','Campeón con todas las letras, @{h}. Enhorabuena','Chapó, @{h}. Nos vemos el año que viene');
  TWC_COMP.la.push('Felicidades @{h}. Te lo trabajaste toda la temporada','Campeón con todas las letras, @{h}. Felicitaciones','Respeto, @{h}. Nos vemos el año que viene');
})();

(function(){   // gran tanda de variaciones para los tuiteros
  const add=(obj,key,arr)=>{ obj[key]=(obj[key]||[]).concat(arr); };
  const D={
    es:{ fav:['Con {n} en {liga} ya sé dónde voy a estar cada jornada','{n} en el cartel. Mi temporada acaba de empezar','No hay cartel malo si está {n}','{n} y yo, otra temporada juntos','Que alguien me pellizque: {n} en {liga}','{n} confirmado. Ya me he comprado las palomitas','Lo de meter a {n} es de diez','{n} en {liga}. Esto pinta muy bien'],
         hate:['{n} no termina de engancharme, pero suerte','Con {n} no conecto, qué le vamos a hacer','Por mí habría ido otro antes que {n}','{n} en {liga}… vale, lo acepto','{n} no es mi estilo, pero le daré una oportunidad'],
         hateF:['Con {n} ahí, {liga} me la ahorro','{liga} con {n}: no es para mí este año','Ni con la mejor jornada me veo {liga} con {n}'],
         favF:['Me hago de {liga} este año solo por {n}','{n} en {liga}: tocará trasnochar','Por {n} sigo {liga} aunque no sea la mía'],
         swap:['Fichar a {n} habiendo {f}… no lo pillo','{f} estaba ahí y traen a {n}. En fin','Con {f} disponible, lo de {n} no tiene sentido'],
         ret:['Ha vuelto {n}. Ya era hora','La vuelta de {n} es lo mejor del cartel','{n} de vuelta. Ahora sí'],
         otra:['El cartel de {liga} me ha sorprendido para bien','{liga} tiene buena pinta desde aquí','Puede que {liga} sea la liga del año'],
         miss:['¿Y {f}? Que alguien me lo explique','Me falta {f} en este cartel','{liga} sin {f} no es {liga}'], missVs:['{n} sí y {f} no. Vale, vale…','Cambiaría a {n} por {f} sin pensarlo'] },
    ar:{ fav:['Con {n} en {liga} ya sé dónde voy a estar cada fecha','{n} en el cartel. Mi temporada arrancó','No hay cartel malo si está {n}','{n} y yo, otra temporada juntos','Que alguien me pellizque: {n} en {liga}','{n} confirmado. Ya preparé el mate','Lo de meter a {n} es de diez','{n} en {liga}. Pinta re bien'],
         hate:['{n} no me termina de enganchar, pero suerte','Con {n} no conecto, qué le vamos a hacer','Para mí tendría que haber ido otro antes que {n}','{n} en {liga}… bueno, lo acepto','{n} no es mi estilo, pero le voy a dar una chance'],
         hateF:['Con {n} ahí, {liga} me la ahorro','{liga} con {n}: no es para mí este año','Ni en pedo miro {liga} con {n}'],
         favF:['Me hago de {liga} este año solo por {n}','{n} en {liga}: habrá que trasnochar','Por {n} sigo {liga} aunque no sea la mía'],
         swap:['Traer a {n} habiendo {f}… no lo entiendo','{f} estaba ahí y traen a {n}. Bueno','Con {f} disponible, lo de {n} no tiene sentido'],
         ret:['Volvió {n}. Ya era hora','La vuelta de {n} es lo mejor del cartel','{n} de vuelta. Ahora sí'],
         otra:['El cartel de {liga} me sorprendió para bien','{liga} pinta bien desde acá','Capaz que {liga} es la liga del año'],
         miss:['¿Y {f}? Que alguien me lo explique','Me falta {f} en este cartel','{liga} sin {f} no es {liga}'], missVs:['{n} sí y {f} no. Dale, dale…','Cambiaría a {n} por {f} sin pensarlo'] },
    mx:{ fav:['Con {n} en {liga} ya sé dónde voy a estar cada jornada','{n} en el cartel. Mi temporada ya empezó','No hay cartel malo si está {n}','{n} y yo, otra temporada juntos','Que alguien me pellizque: {n} en {liga}','{n} confirmado. Ya tengo las palomitas','Meter a {n} fue un acierto, neta','{n} en {liga}. Se ve bien chido'],
         hate:['{n} no me termina de enganchar, pero suerte','Con {n} no conecto, ni modo','Para mí debió ir otro antes que {n}','{n} en {liga}… bueno, lo acepto','{n} no es mi estilo, pero le daré chance'],
         hateF:['Con {n} ahí, {liga} me la ahorro','{liga} con {n}: no es para mí este año','Ni de chiste veo {liga} con {n}'],
         favF:['Me hago de {liga} este año nomás por {n}','{n} en {liga}: tocará desvelarse','Por {n} sigo {liga} aunque no sea la mía'],
         swap:['Traer a {n} habiendo {f}… no le entiendo','{f} estaba ahí y traen a {n}. Ni modo','Con {f} disponible, lo de {n} no tiene sentido'],
         ret:['Regresó {n}. Ya era hora','El regreso de {n} es lo mejor del cartel','{n} de regreso. Ahora sí'],
         otra:['El cartel de {liga} me sorprendió para bien','{liga} se ve bien desde acá','A lo mejor {liga} es la liga del año'],
         miss:['¿Y {f}? Que alguien me explique','Me falta {f} en este cartel','{liga} sin {f} no es {liga}'], missVs:['{n} sí y {f} no. Ajá…','Cambiaría a {n} por {f} sin pensarlo'] },
  };
  ['cl','pe','co','car','neu'].forEach(d=>{ D[d]={}; for(const c in D.mx) D[d][c]=D.mx[c].filter(t=>!/neta|chido|ni modo|ajá|no le entiendo|Ni de chiste|nomás|desvelarse/i.test(t)); });
  for(const d in D) for(const c in D[d]) add(TWD[d],c,D[d][c]);
  const G={ es:{ styleRep:['Un cartel con tantos {st}s va a hacerse largo','{c} {st}s… pedazo de monotonía'], styleOk:['Estilos variados en {liga}. Bien pensado','Para todos los gustos este cartel'], styleMid:['Algún {st} de más en {liga}, pero bueno'],
                 rep:['{n} parece fijo en {liga}. {k} años ya','Respeto a {n}, pero {k} temporadas seguidas es mucho'], same:['El cartel de {liga} me suena de algo… del año pasado'], nuevo:['Primera temporada de {n} en FMS. Ojalá le vaya bien','{n} llega nuevo a FMS. Ganas de verle'],
                 top:['Este cartel de {liga} no tiene ni un punto débil','Pocas veces se ha visto un {liga} así'], low:['Cartel corto de nombres en {liga}','Esperaba un {liga} con más pegada'], meh:['Ni frío ni calor con {n}','{n} puede ser la revelación o pasar sin pena ni gloria','A {n} le toca dar un paso adelante'], bomb:['Lo de {n} en {liga} no me lo esperaba nadie','Fichajazo: {n} en {liga}'], wsLow:['{n} en la World Series… se supone que aquí están los mejores'] },
            la:{ styleRep:['Un cartel con tantos {st}s se va a hacer largo','{c} {st}s… qué monotonía'], styleOk:['Estilos variados en {liga}. Bien pensado','Para todos los gustos este cartel'], styleMid:['Algún {st} de más en {liga}, pero bueno'],
                 rep:['{n} parece fijo en {liga}. {k} años ya','Respeto a {n}, pero {k} temporadas seguidas es mucho'], same:['El cartel de {liga} me suena de algo… del año pasado'], nuevo:['Primera temporada de {n} en FMS. Ojalá le vaya bien','{n} llega nuevo a FMS. Ganas de verlo'],
                 top:['Este cartel de {liga} no tiene ni un punto débil','Pocas veces se vio un {liga} así'], low:['Cartel corto de nombres en {liga}','Esperaba un {liga} con más peso'], meh:['Ni frío ni calor con {n}','{n} puede ser la revelación o pasar sin pena ni gloria','A {n} le toca dar un paso adelante'], bomb:['Lo de {n} en {liga} no se lo esperaba nadie','Fichajazo: {n} en {liga}'], wsLow:['{n} en la World Series… se supone que acá están los mejores'] } };
  for(const d in G) for(const c in G[d]) add(TWG[d],c,G[d][c]);
  const P={ both:['{a} vs {b}, mis dos debilidades en la misma batalla','Batalla soñada: {a} contra {b}','{a} y {b}: no puedo perder','Que dure veinte minutos el {a} vs {b}','La batalla de la temporada: {a} vs {b}'],
    hateBoth:['{a} vs {b}… ni fu ni fa','{a} contra {b}: pausa para el café','No me interesa el {a} vs {b}, la verdad'],
    vs:['{a}, gánale a {b} y alégrame el día','Que {a} se imponga a {b}, por favor','{a} tiene que demostrarle a {b} quién es'],
    fav:['{a} contra {b}: mi batalla de la jornada','Pendiente del {a} vs {b}','{a} llega fino para medirse a {b}','Hoy toca sufrir con {a} contra {b}','Con {a} enfrente de {b} no me lo pierdo','{a} vs {b}, ojalá salga una batallón'],
    rep:['{a} vs {b} otra vez, ya se sabe hasta el guion','Cambiar los cruces no cuesta tanto: {a} vs {b} de nuevo','{a} contra {b} por {k}ª temporada. Sin palabras'],
    rival:['{a} vs {b}: pique asegurado','Se tienen ganas: {a} contra {b}','{a} y {b} cara a cara. Saltan chispas seguro'],
    ex:['Exhibición {a} vs {b}: puro espectáculo','La exhibición {a} vs {b} me parece de diez'],
    gen:['{a} vs {b} puede ir a réplica','Cruce raro el {a} vs {b}, pero interesante','{a} contra {b}: a ver quién se adapta mejor','{a} vs {b} me tiene intrigado','No descarto sorpresa en el {a} vs {b}'] };
  for(const c in P) add(TWP_BASE,c,P[c]);
  const C={ es:{ fan:['Lo sabía, {n}. Sabía que eras el mejor 🏆','{n} {cw}. Qué temporada, qué orgullo','Me he emocionado con lo de {n}. Campeonazo'], neu:['Título merecido para {n}, sin discusión','{n} ha sido el mejor de {liga} y ahí está el resultado'], hateSoft:['Enhorabuena a {n}, aunque mi favorito era otro'], rep:['Otra liga para {n}… alguien que le pare','{n} gana {liga} otra vez. Ya se veía venir'], streak:['{k} seguidas de {n}. Hay que buscarle rival ya'] },
            la:{ fan:['Lo sabía, {n}. Sabía que eras el mejor 🏆','{n} {cw}. Qué temporada, qué orgullo','Me emocioné con lo de {n}. Campeonazo'], neu:['Título merecido para {n}, sin discusión','{n} fue el mejor de {liga} y ahí está el resultado'], hateSoft:['Felicitaciones a {n}, aunque mi favorito era otro'], rep:['Otra liga para {n}… que alguien lo pare','{n} gana {liga} otra vez. Se veía venir'], streak:['{k} seguidas de {n}. Hay que buscarle rival ya'] } };
  for(const d in C) for(const c in C[d]) add(TWC[d],c,C[d][c]);
  add(TWR,'es',['Que alguien le explique a los jueces lo de {n}','{n} merece más puntos de los que le dan','No es normal cómo están puntuando a {n}']);
  add(TWR,'la',['Que alguien le explique a los jueces lo de {n}','{n} merece más puntos de los que le dan','No es normal cómo están puntuando a {n}']);
  add(TWDS.es,'rel',['{a} vs {b}: duelo por la permanencia','Quien pierda el {a} vs {b} lo tiene muy negro']); add(TWDS.la,'rel',['{a} vs {b}: duelo por la permanencia','El que pierda el {a} vs {b} la tiene muy difícil']);
  add(TWDS.es,'relFav',['Vamos {f}, tú no bajas. A por {o}']); add(TWDS.la,'relFav',['Vamos {f}, vos no bajás. A ganarle a {o}']);
  add(TWT.es,'title',['El {a} vs {b} puede decidir quién se lleva {liga}']); add(TWT.la,'title',['El {a} vs {b} puede definir quién se lleva {liga}']);
  add(TWT.es,'decided',['Liga sentenciada. Lo que queda es de trámite']); add(TWT.la,'decided',['Liga sentenciada. Lo que queda es puro trámite']);
})();

