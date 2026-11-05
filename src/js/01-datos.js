
/* =========================================================================
   FMS CEO · datos y constantes
========================================================================= */
const COUNTRY_COLORS = {"España":"#E2101F","Argentina":"#5DADE2","Chile":"#0B2545","Colombia":"#F2C230","Cuba":"#0033A0","México":"#006341","Panamá":"#00205B","Perú":"#D91023","Puerto Rico":"#ED1C24","República Dominicana":"#002D62","Venezuela":"#FFCC00","Sudamérica":"#2E8B57","Centroamérica":"#1F6FB2","Caribe":"#00A8A2","Bolivia":"#2E8B47","Ecuador":"#FFD100","Uruguay":"#57A0D3","Paraguay":"#D52B1E","Costa Rica":"#002B7F","Guatemala":"#4997D0","Honduras":"#0073CF","El Salvador":"#0047AB","Nicaragua":"#0067C6","EEUU":"#3C3B6E","Brasil":"#009739","Italia":"#009246","Francia":"#0055A4","Portugal":"#006600","Guinea Ecuatorial":"#009A44"};
function countryColor(c){ return COUNTRY_COLORS[c] || "#7a0a13"; }
function shadeColor(hex, percent){
  const num = parseInt(hex.replace('#',''),16);
  let r=(num>>16)+Math.round(255*percent/100), g=((num>>8)&255)+Math.round(255*percent/100), b=(num&255)+Math.round(255*percent/100);
  r=Math.max(0,Math.min(255,r)); g=Math.max(0,Math.min(255,g)); b=Math.max(0,Math.min(255,b));
  return '#'+(0x1000000+r*0x10000+g*0x100+b).toString(16).slice(1);
}
function avatarStyle(country){ const c=countryColor(country); return `background:linear-gradient(135deg, ${c}, ${shadeColor(c,-45)});`; }
function nrm(x){ return String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); }
function fMatch(f,q){ if(!q) return true; const n=nrm(q).trim(); return nrm(f.name).includes(n) || nrm(f.country).includes(n); }
function photoOf(f){ return f ? (f.photo || (typeof FACES!=='undefined' && FACES[f.name]) || null) : null; }
function avatarDivStyle(f){ return photoOf(f) ? '' : avatarStyle(f? f.country : ''); }
function avatarContent(f){ const ph=photoOf(f); return ph ? `<img src="${ph}" alt="">` : (f? esc(f.name[0]) : '?'); }
function miniAvatar(id, size){
  const f=fby(id); if(!f) return '';
  return `<span class="mini-avatar" style="width:${size}px;height:${size}px;font-size:${Math.round(size*0.5)}px; ${avatarDivStyle(f)}">${avatarContent(f)}</span>`;
}
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

const LEAGUES = [
  {key:'fms_espana',    name:'FMS España',    short:'ESP', countries:['España'],    badge:'#E67E22', fg:'#fff'},
  {key:'fms_argentina', name:'FMS Argentina', short:'ARG', countries:['Argentina'], badge:'#64B5F6', fg:'#1a1a1a'},
  {key:'fms_mexico',    name:'FMS México',    short:'MEX', countries:['México'],    badge:'#2E7D32', fg:'#fff'},
  {key:'fms_chile',     name:'FMS Chile',     short:'CHI', countries:['Chile'],     badge:'#1A237E', fg:'#fff'},
  {key:'fms_peru',      name:'FMS Perú',      short:'PER', countries:['Perú'],      badge:'#E53935', fg:'#fff'},
  {key:'fms_colombia',  name:'FMS Colombia',  short:'COL', countries:['Colombia'],  badge:'#FFC107', fg:'#1a1a1a'},
  {key:'fms_caribe',    name:'FMS Caribe',    short:'CAR', countries:['Caribe','Venezuela','Cuba','Puerto Rico','República Dominicana','Panamá','Costa Rica','Guatemala','Honduras','El Salvador','Nicaragua','Centroamérica','EEUU'], badge:'#8BC34A', fg:'#1a1a1a'},
];
const INTL = {key:'fms_internacional', name:'FMS Internacional', short:'INTL', badge:'#D4AF37', fg:'#1a1a1a'};
const LEAGUE_THEME = {
  fms_argentina:{red:'#00B8D4', bright:'#26E1F5', dark:'#006C7A'},
  fms_chile:{red:'#1A3FA0', bright:'#3D5FC7', dark:'#0D2160'},
  fms_mexico:{red:'#1B6B3A', bright:'#2E8F50', dark:'#0D3D20'},
  fms_caribe:{red:'#00A8A2', bright:'#2BD6CE', dark:'#00645F'},
  fms_colombia:{red:'#C99A12', bright:'#F2C230', dark:'#7A5D08'},
  fms_peru:{red:'#C0392B', bright:'#E85A45', dark:'#7A1F14'},
  fms_internacional:{red:'#B8932A', bright:'#EFCB5E', dark:'#6E5714'},
  fms_ws:{red:'#8E44FF', bright:'#B98CFF', dark:'#4B1D99'},
  redbull:{red:'#C8102E', bright:'#E8314F', dark:'#1B2A6B'},
};
// Logos oficiales (fijos, no editables)
const LOGOS = {"fms_argentina": "{{asset:logos/fms_argentina.jpg}}", "fms_caribe": "{{asset:logos/fms_caribe.jpg}}", "fms_chile": "{{asset:logos/fms_chile.jpg}}", "fms_colombia": "{{asset:logos/fms_colombia.jpg}}", "fms_espana": "{{asset:logos/fms_espana.jpg}}", "fms_mexico": "{{asset:logos/fms_mexico.jpg}}", "fms_peru": "{{asset:logos/fms_peru.jpg}}", "fms_internacional": "{{asset:logos/fms_internacional.jpg}}", "redbull": "{{asset:logos/redbull.png}}"};
const RB_LOGO = LOGOS.redbull;
const WS = {key:'fms_ws', name:'FMS World Series', short:'WS', countries:null, badge:'#8E44FF', fg:'#fff'};
const WS_JORNADAS = 5;
function isWS(k){ return k===WS.key; }
function natKeys(s){ return s.activeKeys.filter(k=>!isWS(k)); }
function nJ(k){ return isWS(k) ? WS_JORNADAS : JORNADAS; }
function wsRange(s){ const L=s.leagues[WS.key]; if(!L || !L.dates.length) return null; return [Math.min(...L.dates), Math.max(...L.dates)]; }
function ldef(key){ return key===INTL.key ? INTL : (key===WS.key ? WS : LEAGUES.find(l=>l.key===key)); }

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MESES_C = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const DOW = ['L','M','X','J','V','S','D'];

// Reglas de la empresa
const STAR_THRESHOLDS = [0, 70, 220, 450, 780, 1200];   // reputación necesaria para 0..5 estrellas
const START_MONEY = 250000;
const JORNADAS = 9;
function maxLeagues(stars){ return Math.min(6, stars+1); }
function starsFor(rep){ let s=0; STAR_THRESHOLDS.forEach((t,i)=>{ if(rep>=t) s=i; }); return s; }

// Hype: días seguidos sin jornada de esa liga -> pérdida diaria
const GAP_OK = 21, GAP_WARN = 35;
function decayRate(gap){ return gap<=GAP_OK ? 0 : (gap<=GAP_WARN ? 0.4 : 1.0); }

/* ---------- fechas ---------- */
function daysInYear(y){ return ((y%4===0 && y%100!==0) || y%400===0) ? 366 : 365; }
function dayToDate(y,d){ return new Date(Date.UTC(y,0,1+d)); }
function dateToDay(y,m,dd){ return Math.round((Date.UTC(y,m,dd)-Date.UTC(y,0,1))/86400000); }
function fmtDay(y,d){ const t=dayToDate(y,d); return t.getUTCDate()+' '+MESES_C[t.getUTCMonth()]; }
function monthOf(y,d){ return dayToDate(y,d).getUTCMonth(); }
function money(n){ const s=Math.round(n).toLocaleString('es-ES'); return s+' €'; }
function moneyK(n){ const a=Math.abs(n); const s = a>=1000 ? (Math.round(a/100)/10).toLocaleString('es-ES')+'k' : Math.round(a)+''; return (n<0?'-':'')+s+' €'; }

/* ---------- generador de freestylers ficticios ---------- */
const SYL_A = ['Ka','Zu','Ne','Ro','Vi','Da','Mo','Te','Lu','Bra','Dre','Fe','Gro','Ix','Ja','Ky','Le','Ma','No','Pa','Qui','Re','Sa','To','Ul','Va','Xe','Yo','Zo','Cho','Tra','Kre','Plu','Sto','Bu','Ci','Gu','Hu','Ri','Se'];
const SYL_B = ['','','r','n','l','x','k','s','z','m','nd','rk','sk','lv','nt'];
const SYL_C = ['o','a','e','i','ix','on','ek','as','or','ux','in','al','us','er','ez','ow','ah','yn'];
function rnd(a,b){ return a + Math.random()*(b-a); }
function rint(a,b){ return Math.floor(rnd(a,b+1)); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function gauss(){ let u=0,v=0; while(!u) u=Math.random(); while(!v) v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
function clamp(x,a,b){ return Math.max(a,Math.min(b,x)); }
function genName(used){
  for(let t=0;t<200;t++){
    let n = pick(SYL_A)+pick(SYL_B)+pick(SYL_C);
    if(Math.random()<0.35) n += pick(SYL_A).toLowerCase()+pick(SYL_C);
    const r=Math.random();
    if(r<0.07) n = 'El '+n; else if(r<0.13) n = n+'-T'; else if(r<0.18) n = 'MC '+n; else if(r<0.22) n = 'Lil '+n; else if(r<0.25) n = n+' Flow';
    if(!used.has(n.toLowerCase())){ used.add(n.toLowerCase()); return n; }
  }
  return 'Freestyler '+(used.size+1);
}
function genStats(){
  const nivel = Math.round(clamp(64 + gauss()*11, 38, 95));
  const fama = Math.round(clamp(nivel - 10 + gauss()*13, 10, 98));
  return {nivel, fama};
}
// Preset de freestylers reales. País = liga/región con la que se les asocia. Nivel y fama son estimaciones editables (DEV).
// Freestylers reales de FMS y de Red Bull Batalla (2016-2026). País = región con la que compiten (los de Red Bull EEUU van como EEUU).
// Los de país 'Sudamérica'/'Centroamérica' compitieron en esas finales regionales sin país confirmado.
const REAL_PRESET = {
  "España": [["Chuty", 95, 94], ["Gazir", 94, 91], ["Arkano", 86, 89], ["Bnet", 91, 93], ["Zasko", 89, 87], ["Skone", 89, 89], ["Mnak", 84, 78], ["Sweet Pain", 88, 84], ["Blon", 82, 89], ["Dani VK", 81, 73], ["Hander", 76, 77], ["Sawi Elekipo", 74, 64], ["Force", 74, 89], ["Le33", 74, 62], ["Alek", 78, 77], ["Mounts", 77, 71], ["Tirpa", 81, 85], ["Michu", 67, 58], ["Fabiuki", 77, 75], ["Bta", 72, 77], ["Jesús LC", 72, 56], ["Kmbra", 77, 79], ["Nez", 75, 55], ["Barón", 73, 73], ["Mr. Ego", 80, 86], ["Invert", 74, 83], ["Khan", 32, 81], ["Sara Socas", 77, 88], ["Navas", 71, 86], ["Mowlihawk", 65, 84], ["Bélico", 75, 74], ["Nocre", 74, 71], ["BTP", 71, 62], ["Errecé", 76, 81], ["Adriana", 51, 53], ["Piromana", 55, 61], ["Segrelles", 78, 76], ["Owen", 68, 51], ["Spolker", 67, 61], ["Argente", 61, 55], ["Davisito", 70, 89], ["Mr Aaron", 67, 65], ["CDFlex", 66, 75], ["Ander2K", 73, 70], ["Sozat", 65, 65], ["Ibán", 74, 71], ["Zyko GDH", 68, 51], ["Piezas", 79, 86], ["Lgido", 76, 71], ["Dr. Filtros", 74, 72], ["Pirry", 67, 71], ["Azeta", 45, 35], ["NQP", 78, 76], ["Babi", 77, 78], ["Mike Shinobi", 70, 77], ["MC Men", 78, 83], ["Peret", 66, 65], ["Soen", 70, 72], ["Krisan", 74, 78], ["Nacho SRK", 75, 79], ["Botta", 72, 77], ["Nacho Argentino", 71, 61], ["Ortega", 64, 60], ["Arcoiris", 58, 65], ["Kavron", 75, 67], ["Akar", 66, 61], ["Ortiz", 45, 35], ["Titus", 73, 75], ["Kensuke", 67, 77], ["Niki DMT", 69, 71], ["Kinkiwinky", 60, 62], ["Rubenico", 70, 70], ["Swit Eme", 76, 83], ["Driu", 42, 66], ["Walls", 84, 89], ["Pyro", 65, 62], ["NachoLCM", 60, 50], ["Triple R", 67, 73], ["Estrimo", 31, 66], ["Godlemon", 45, 35], ["Jaloner", 96, 88], ["Jorge Mauro", 62, 59], ["Bohemia", 64, 67], ["Santi", 74, 76], ["Rayban", 77, 81], ["Tanquecrack", 57, 71], ["NG", 62, 76], ["Perry", 61, 51], ["Kusho", 66, 58], ["Conde", 46, 46], ["JC Snake", 64, 64], ["Tyler", 56, 55], ["Vokbulario", 56, 55], ["Cafú", 56, 55]],
  "Argentina": [["Stuart", 88, 86], ["Larrix", 89, 84], ["Mecha", 91, 87], ["Wos", 89, 97], ["Papo", 88, 95], ["Dtoke", 82, 91], ["Dani Ribba", 78, 84], ["Kodigo", 85, 86], ["Trueno", 87, 99], ["Klan", 83, 81], ["G Sony", 80, 81], ["Replik", 84, 87], ["Jesse Pungaz", 75, 71], ["Nacho", 76, 75], ["Naista", 72, 78], ["Zaina", 75, 83], ["MP", 81, 79], ["Tata", 74, 81], ["Katra", 72, 62], ["Wolf", 72, 58], ["Mito", 70, 62], ["Dybbuk", 75, 71], ["DAC", 62, 56], ["Jaff", 67, 56], ["CTZ", 77, 78], ["MKS", 77, 82], ["Cacha", 77, 88], ["Sub", 77, 83], ["Nasir Catriel", 62, 55], ["Barto", 66, 61], ["Exe", 80, 77], ["HDR", 73, 80], ["Sophia", 71, 74], ["Abel", 79, 82], ["Cobe CLK", 63, 65], ["1Tobi", 72, 74], ["Dyse", 82, 76], ["GW", 65, 62], ["Ritter", 70, 71], ["Franchute", 77, 78], ["Rife", 77, 78], ["TiagoPZK", 83, 91], ["Lit Killah", 83, 95], ["Duki", 80, 99], ["Roma", 70, 77], ["Dozer", 71, 76], ["G5", 71, 67], ["Brasita", 60, 55], ["Parker", 70, 72], ["Alkoy", 75, 75], ["Snake", 68, 71], ["Acru", 92, 88], ["Frescolate", 76, 82], ["Dam", 79, 81]],
  "México": [["Aczino", 95, 98], ["Jony Beltrán", 89, 91], ["Azuky", 86, 94], ["Rapder", 84, 83], ["Lobo Estepario", 85, 82], ["Yoiker", 76, 74], ["RC", 83, 82], ["Dante", 72, 64], ["Skiper", 86, 80], ["Ari Carrillo", 71, 60], ["Zticma", 75, 77], ["Dominic", 72, 68], ["Garza", 71, 72], ["Jack Andrenalina", 72, 82], ["Nota Roja", 70, 48], ["Soto", 60, 48], ["Xavlac", 65, 48], ["Damián", 69, 46], ["Lobo López", 68, 87], ["Xhavez", 71, 72], ["Fat Tony", 66, 65], ["Potencia", 73, 70], ["DangerAK", 21, 68], ["Saturno", 64, 56], ["Dalia", 72, 78], ["Sandra", 64, 71], ["Hadrian", 74, 81], ["Vens", 64, 59]],
  "Chile": [["El Menor", 94, 92], ["Teorema", 91, 93], ["Acertijo", 84, 80], ["Nitro", 87, 87], ["Kaiser", 84, 89], ["Tom Crowley", 79, 76], ["Stigma", 77, 81], ["Ricto", 88, 84], ["Joqerr", 76, 74], ["Drose", 83, 86], ["Pepe Grillo", 74, 76], ["Jokker", 74, 62], ["Metalingüística", 83, 85], ["Racso", 73, 58], ["Esezeta", 72, 78], ["Rodamiento", 78, 76], ["Anubis", 79, 72], ["Basek", 72, 66], ["Satim", 61, 65], ["Blade", 71, 65], ["99", 70, 64], ["Bigtamina", 72, 67], ["Adesong", 78, 64], ["Elemece", 70, 64], ["Eskai", 60, 54], ["ChysteMC", 80, 84], ["BTI", 62, 69], ["Destello", 70, 67], ["Fusok", 72, 66], ["Scub", 70, 72]],
  "Perú": [["Jaze", 93, 94], ["Jota", 86, 84], ["Stick", 84, 74], ["KG", 84, 85], ["Nekroos", 88, 87], ["Litzen", 76, 74], ["Skill", 87, 82], ["Choque", 76, 80], ["Strike", 75, 73], ["Jair Wong", 71, 74], ["Vijay Kesh", 85, 89], ["Diego MC", 74, 60], ["Kian", 79, 79], ["Ramset", 72, 56], ["Ghost", 72, 56], ["Xplain", 79, 76], ["Almendrades", 78, 79], ["Piero Pistas", 70, 54], ["Katacrist", 70, 48], ["Xilo", 68, 44], ["Scope", 68, 44], ["Maricielo", 67, 44], ["Letras Tarapoto", 67, 42], ["Blaxi Mental", 67, 42], ["Sumeria", 67, 83], ["Scraps", 74, 62], ["Venti", 67, 62], ["Dexuz", 72, 76], ["Danu", 72, 70], ["Icon", 62, 66], ["Necia", 76, 71], ["Gasper", 70, 72], ["Papicha", 72, 67], ["MSL", 61, 55]],
  "Colombia": [["Valles-T", 88, 89], ["Marithea", 89, 88], ["Lokillo", 85, 93], ["Filósofo", 81, 74], ["J1", 76, 60], ["Coloso", 75, 62], ["Puppy", 81, 71], ["RBN", 74, 60], ["Airon", 74, 60], ["Carpediem", 86, 82], ["Elevn", 74, 56], ["Fat N", 82, 84], ["Ken Zingle", 72, 58], ["Token", 72, 54], ["Axl Evans", 68, 44], ["Coffy", 68, 44], ["Urko", 73, 78], ["Visionario", 76, 74], ["Pandora", 67, 72], ["Lil White", 67, 65], ["Dima", 67, 65], ["Kore", 68, 65], ["Nico B", 75, 56], ["Flama", 68, 65], ["Gafas", 67, 51], ["Andy Ink", 61, 48], ["Tormenta", 59, 51], ["JM Serna", 70, 73]],
  "Venezuela": [["Chang", 86, 83], ["Letra", 82, 80], ["Black Code", 83, 78], ["Lit Ignis", 69, 46], ["Lancer Lirical", 79, 76], ["MCKlopedia", 80, 86], ["Gavyria", 64, 75], ["Oner", 70, 66], ["Akapellah", 83, 87], ["AdonysX", 79, 62], ["Freites", 77, 58], ["White Caracas", 75, 56], ["Bobby", 68, 44], ["Imigrante", 68, 44], ["Lou T", 68, 44]],
  "Ecuador": [["Mac Tempo", 80, 66], ["Abel EC", 76, 56], ["Alfredozki", 75, 56], ["Switch", 74, 58], ["Melo", 72, 50], ["Eppico", 71, 48], ["Big Mind", 69, 44], ["Punch", 69, 44], ["Andy Novem", 68, 42], ["Adulterio", 68, 42], ["Amir", 67, 42], ["Acxel Rapster", 66, 40], ["Santo Skill", 66, 40]],
  "Uruguay": [["Spektro", 79, 71], ["Wordplay", 72, 50], ["Naicen", 69, 44], ["Alexunder", 68, 42], ["SOK", 67, 42], ["Vostok", 67, 42], ["Punisher", 67, 40], ["Rasta", 72, 69], ["Ualde", 66, 41], ["SFJ", 66, 43], ["Varela", 66, 45], ["Hammer", 74, 71], ["Morfeo", 66, 41], ["Cronin", 66, 40]],
  "Paraguay": [["Drazer", 72, 50], ["Mister H", 68, 44]],
  "Bolivia": [["Minos", 72, 50]],
  "República Dominicana": [["Éxodo Lirical", 78, 76], ["KDT", 70, 48], ["Shield Master", 69, 46]],
  "Costa Rica": [["SNK", 74, 70], ["RVS", 69, 46], ["P8", 68, 44], ["Blackhawk", 68, 44], ["Eros EQ", 67, 67], ["Kenyari", 67, 42], ["Cehzar", 67, 42], ["Bana", 68, 44], ["Nicosan", 68, 44]],
  "Guatemala": [["Ritmodelia", 74, 76]],
  "Panamá": [["Aldahir", 71, 65], ["UFO", 70, 48], ["Índico", 69, 66], ["Bway Woody", 67, 42]],
  "El Salvador": [["Zaki", 72, 56], ["Zeu", 68, 44], ["Reos", 68, 44], ["Verso One", 68, 44], ["Jafet", 68, 44], ["Odil", 67, 42]],
  "Nicaragua": [["Pseudocódigo", 68, 44], ["Blaze", 67, 42]],
  "Honduras": [["Terrorista", 68, 44], ["Androide", 68, 56]],
  "Puerto Rico": [["Yartzi", 82, 72], ["Outlaw", 67, 42], ["Knnon", 66, 40]],
  "Cuba": [["Reverse", 84, 74]]
};
function presetPhoto(name){ return name==='Force' ? STREAMERS.force.photo : null; }
function randHype(fama){ return fama==null ? Math.round(clamp(50+gauss()*20,1,99)) : Math.round(clamp(fama*0.85+6+gauss()*7,1,99)); }   // hype inicial: va con la fama, pero no exacto
const PRESET_LEGENDS = ["Chuty", "Gazir", "Arkano", "Bnet", "Skone", "Invert", "Khan", "Piezas", "Walls", "Pyro", "Jaloner", "Wos", "Papo", "Dtoke", "Trueno", "TiagoPZK", "Lit Killah", "Duki", "Frescolate", "Aczino", "Hadrian", "Kaiser", "Ricto", "ChysteMC", "Jaze", "Lokillo", "MCKlopedia", "Akapellah"];
function generatePool(){
  const out=[];
  Object.entries(REAL_PRESET).forEach(([country,list])=> list.forEach(([name,nivel,fama])=> out.push({id:uid('f'), name, country, nivel, fama, hype:randHype(fama), photo:presetPhoto(name), legend: PRESET_LEGENDS.includes(name), style:defaultStyle(name)})));
  return out;
}
const LEGEND_MULT = 1.5;  // las leyendas cobran un 50% más solo por serlo
/* ---- estilos de freestyle ---- */
// v: variabilidad entre rondas (1 = normal) · m: ventaja/desventaja por tipo de ronda (en puntos de nivel)
const STYLES = {
  'Punchline':  {v:0.6, m:{deluxe:4, min:-4},                         txt:'Cuadrado y constante. Destaca en el Deluxe, sufre en los minutos libres.'},
  'Ingenio':    {v:0.6, m:{tema:5, min:-4},                           txt:'Cuadrado y constante. Destaca en Temáticas, baja en los minutos.'},
  'Métrico':    {v:1.5, m:{min:4, easy:4, tema:-4, random:-4},        txt:'Muy irregular. Destaca en minutos y Easy Mode, baja en Temáticas y Random Mode.'},
  'Flow':       {v:1.5, m:{easy:-4, hard:-4, min:4},                  txt:'Muy irregular. Sube en los minutos, baja en Easy y Hard Mode.'},
  'Showman':    {v:1,   m:{}, views:1.15,                             txt:'No destaca en ninguna ronda, pero sus batallas tienen más visitas.'},
  'Disonante':  {v:1,   m:{deluxe:4, easy:4, min:-4, tema:-4, hard:-4}, fmt:{short:2, long:-2}, txt:'Rinde mejor en formato corto. Destaca en Deluxe y Easy, baja en minutos, Temáticas y Hard.'},
  'Teatral':    {v:1.15,m:{random:5, deluxe:-4},                      txt:'Muy expresivo. Destaca en Random Mode, baja en el Deluxe.'},
  'Coherencia': {v:0.6, m:{hard:-4, easy:4},                          txt:'Cuadrado y constante. Destaca en Easy Mode, baja en Hard Mode.'},
  'Poético':    {v:0.6, m:{}, spike:true,                             txt:'Constante, pero de vez en cuando se sale en una ronda.'},
};
const STYLE_NAMES = Object.keys(STYLES);
const STYLE_PRESET = {"Chuty": "Ingenio", "Gazir": "Ingenio", "Arkano": "Punchline", "Bnet": "Métrico", "Zasko": "Métrico", "Skone": "Showman", "Mnak": "Punchline", "Sweet Pain": "Poético", "Blon": "Ingenio", "Dani VK": "Ingenio", "Hander": "Punchline", "Sawi Elekipo": "Punchline", "Force": "Punchline", "Le33": "Flow", "Alek": "Coherencia", "Mounts": "Ingenio", "Tirpa": "Poético", "Michu": "Flow", "Fabiuki": "Métrico", "Bta": "Punchline", "Jesús LC": "Punchline", "Kmbra": "Poético", "Nez": "Ingenio", "Barón": "Métrico", "Mr. Ego": "Showman", "Invert": "Showman", "Khan": "Flow", "Sara Socas": "Flow", "Navas": "Disonante", "Mowlihawk": "Showman", "Bélico": "Poético", "Nocre": "Punchline", "BTP": "Punchline", "Errecé": "Flow", "Adriana": "Punchline", "Piromana": "Poético", "Segrelles": "Métrico", "Owen": "Punchline", "Spolker": "Métrico", "Argente": "Showman", "Davisito": "Punchline", "Mr Aaron": "Métrico", "CDFlex": "Showman", "Ander2K": "Métrico", "Sozat": "Flow", "Ibán": "Métrico", "Zyko GDH": "Punchline", "Piezas": "Flow", "Lgido": "Punchline", "Dr. Filtros": "Disonante", "Pirry": "Flow", "Azeta": "Coherencia", "NQP": "Métrico", "Babi": "Showman", "Mike Shinobi": "Flow", "MC Men": "Showman", "Peret": "Punchline", "Soen": "Punchline", "Krisan": "Punchline", "Nacho SRK": "Métrico", "Botta": "Showman", "Nacho Argentino": "Métrico", "Ortega": "Disonante", "Arcoiris": "Disonante", "Kavron": "Punchline", "Akar": "Flow", "Ortiz": "Coherencia", "Titus": "Showman", "Kensuke": "Showman", "Niki DMT": "Punchline", "Kinkiwinky": "Disonante", "Rubenico": "Métrico", "Swit Eme": "Poético", "Driu": "Disonante", "Walls": "Ingenio", "Pyro": "Teatral", "NachoLCM": "Punchline", "Triple R": "Métrico", "Estrimo": "Punchline", "Godlemon": "Métrico", "Jaloner": "Métrico", "Jorge Mauro": "Punchline", "Bohemia": "Punchline", "Santi": "Ingenio", "Rayban": "Showman", "Tanquecrack": "Showman", "NG": "Coherencia", "Stuart": "Poético", "Larrix": "Teatral", "Mecha": "Punchline", "Wos": "Flow", "Papo": "Métrico", "Dtoke": "Showman", "Dani Ribba": "Flow", "Kodigo": "Flow", "Trueno": "Flow", "Klan": "Punchline", "G Sony": "Flow", "Replik": "Poético", "Jesse Pungaz": "Flow", "Nacho": "Punchline", "Naista": "Punchline", "Zaina": "Ingenio", "MP": "Flow", "Tata": "Teatral", "Katra": "Punchline", "Wolf": "Ingenio", "Mito": "Coherencia", "Dybbuk": "Showman", "DAC": "Ingenio", "Jaff": "Teatral", "CTZ": "Poético", "MKS": "Punchline", "Cacha": "Showman", "Sub": "Punchline", "Nasir Catriel": "Punchline", "Barto": "Punchline", "Exe": "Ingenio", "HDR": "Showman", "Sophia": "Poético", "Abel": "Métrico", "Cobe CLK": "Showman", "1Tobi": "Flow", "Dyse": "Coherencia", "GW": "Punchline", "Ritter": "Métrico", "Franchute": "Showman", "Rife": "Poético", "TiagoPZK": "Flow", "Lit Killah": "Métrico", "Duki": "Flow", "Roma": "Punchline", "Dozer": "Punchline", "G5": "Flow", "Brasita": "Punchline", "Parker": "Punchline", "Alkoy": "Flow", "Snake": "Flow", "Acru": "Métrico", "Frescolate": "Punchline", "Dam": "Métrico", "Aczino": "Punchline", "Jony Beltrán": "Showman", "Azuky": "Punchline", "Rapder": "Punchline", "Lobo Estepario": "Punchline", "Yoiker": "Punchline", "RC": "Flow", "Dante": "Punchline", "Skiper": "Ingenio", "Ari Carrillo": "Punchline", "Zticma": "Showman", "Dominic": "Punchline", "Garza": "Showman", "Jack Andrenalina": "Showman", "Nota Roja": "Teatral", "Soto": "Punchline", "Xavlac": "Punchline", "Damián": "Punchline", "Lobo López": "Showman", "Xhavez": "Punchline", "Fat Tony": "Punchline", "Potencia": "Ingenio", "DangerAK": "Punchline", "Saturno": "Ingenio", "Dalia": "Showman", "Sandra": "Punchline", "Hadrian": "Ingenio", "Vens": "Showman", "El Menor": "Métrico", "Teorema": "Métrico", "Acertijo": "Ingenio", "Nitro": "Punchline", "Kaiser": "Showman", "Tom Crowley": "Punchline", "Stigma": "Flow", "Ricto": "Métrico", "Joqerr": "Showman", "Drose": "Métrico", "Pepe Grillo": "Ingenio", "Jokker": "Punchline", "Metalingüística": "Métrico", "Racso": "Punchline", "Esezeta": "Flow", "Rodamiento": "Ingenio", "Anubis": "Métrico", "Basek": "Punchline", "Satim": "Showman", "Blade": "Punchline", "99": "Ingenio", "Bigtamina": "Punchline", "Adesong": "Métrico", "Elemece": "Ingenio", "Eskai": "Punchline", "ChysteMC": "Métrico", "BTI": "Punchline", "Destello": "Showman", "Fusok": "Ingenio", "Scub": "Métrico", "Jaze": "Flow", "Jota": "Flow", "Stick": "Punchline", "KG": "Flow", "Nekroos": "Punchline", "Litzen": "Punchline", "Skill": "Poético", "Choque": "Punchline", "Strike": "Ingenio", "Jair Wong": "Showman", "Vijay Kesh": "Teatral", "Diego MC": "Punchline", "Kian": "Métrico", "Ramset": "Punchline", "Ghost": "Punchline", "Xplain": "Métrico", "Almendrades": "Ingenio", "Piero Pistas": "Punchline", "Katacrist": "Punchline", "Xilo": "Punchline", "Scope": "Punchline", "Maricielo": "Punchline", "Letras Tarapoto": "Punchline", "Blaxi Mental": "Punchline", "Sumeria": "Showman", "Scraps": "Punchline", "Venti": "Ingenio", "Dexuz": "Ingenio", "Danu": "Punchline", "Icon": "Punchline", "Necia": "Ingenio", "Gasper": "Punchline", "Papicha": "Ingenio", "MSL": "Ingenio", "Valles-T": "Punchline", "Marithea": "Ingenio", "Lokillo": "Showman", "Filósofo": "Poético", "J1": "Punchline", "Coloso": "Ingenio", "Puppy": "Ingenio", "RBN": "Punchline", "Airon": "Punchline", "Carpediem": "Métrico", "Elevn": "Punchline", "Fat N": "Showman", "Ken Zingle": "Punchline", "Token": "Punchline", "Axl Evans": "Punchline", "Coffy": "Ingenio", "Urko": "Showman", "Visionario": "Flow", "Pandora": "Ingenio", "Lil White": "Métrico", "Dima": "Métrico", "Kore": "Ingenio", "Nico B": "Punchline", "Flama": "Ingenio", "Gafas": "Ingenio", "Andy Ink": "Punchline", "Tormenta": "Coherencia", "JM Serna": "Ingenio", "Chang": "Ingenio", "Letra": "Coherencia", "Black Code": "Ingenio", "Lit Ignis": "Punchline", "Lancer Lirical": "Flow", "MCKlopedia": "Flow", "Gavyria": "Punchline", "Oner": "Punchline", "Akapellah": "Flow", "AdonysX": "Punchline", "Freites": "Punchline", "White Caracas": "Punchline", "Bobby": "Punchline", "Imigrante": "Punchline", "Lou T": "Punchline", "Mac Tempo": "Punchline", "Abel EC": "Ingenio", "Alfredozki": "Punchline", "Switch": "Ingenio", "Melo": "Punchline", "Eppico": "Punchline", "Big Mind": "Punchline", "Punch": "Punchline", "Andy Novem": "Punchline", "Adulterio": "Punchline", "Amir": "Punchline", "Acxel Rapster": "Punchline", "Santo Skill": "Punchline", "Spektro": "Ingenio", "Wordplay": "Punchline", "Naicen": "Punchline", "Alexunder": "Punchline", "SOK": "Punchline", "Vostok": "Punchline", "Punisher": "Punchline", "Rasta": "Poético", "Ualde": "Punchline", "SFJ": "Punchline", "Varela": "Punchline", "Hammer": "Ingenio", "Morfeo": "Punchline", "Cronin": "Punchline", "Drazer": "Punchline", "Mister H": "Punchline", "Minos": "Punchline", "Éxodo Lirical": "Showman", "KDT": "Punchline", "Shield Master": "Punchline", "SNK": "Ingenio", "RVS": "Punchline", "P8": "Punchline", "Blackhawk": "Punchline", "Eros EQ": "Ingenio", "Kenyari": "Punchline", "Cehzar": "Punchline", "Bana": "Punchline", "Nicosan": "Punchline", "Ritmodelia": "Ingenio", "Aldahir": "Ingenio", "UFO": "Punchline", "Índico": "Ingenio", "Bway Woody": "Punchline", "Zaki": "Ingenio", "Zeu": "Punchline", "Reos": "Punchline", "Verso One": "Ingenio", "Jafet": "Punchline", "Odil": "Punchline", "Pseudocódigo": "Punchline", "Blaze": "Punchline", "Terrorista": "Punchline", "Androide": "Punchline", "Yartzi": "Ingenio", "Outlaw": "Punchline", "Knnon": "Punchline", "Reverse": "Flow", "Perry": "Ingenio", "Kusho": "Poético", "Conde": "Teatral", "JC Snake": "Ingenio", "Tyler": "Punchline", "Vokbulario": "Coherencia", "Cafú": "Punchline"};   // bloc de notas de la base de datos
function defaultStyle(name){ if(STYLE_PRESET[name]) return STYLE_PRESET[name]; let h=0; for(const ch of name) h=(h*31+ch.charCodeAt(0))>>>0; return STYLE_NAMES[h%STYLE_NAMES.length]; }
function styleOf(f){ return (f && STYLES[f.style]) ? f.style : (f ? defaultStyle(f.name) : 'Showman'); }
function styleTag(f){ const st=styleOf(f); return `<span class="style-tag st-${st.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}" title="${esc(STYLES[st].txt)}">${st}</span>`; }
const FOREIGN_MULT = 1.25; // un extranjero cuesta un 25% más por viajes
function isForeign(f, key){ if(isWS(key)) return false; const d=ldef(key); return !!(d && d.countries && !d.countries.includes(f.country)); }
const STAR_SALARY = 0.15;  // cada estrella de la empresa: los freestylers piden un 15% más
function contractCost(f, key){ if(isWS(key)) return Math.round(contractCostBase(f,key)*0.5/100)*100; return contractCostBase(f,key); }
function contractCostBase(f, key){ const st=(state.company&&state.company.stars)||0; const nk=(typeof fxVal==='function') ? 1-fxVal(key,'salary') : 1; const base=salaryOf(f)*(1+STAR_SALARY*st)*(isForeign(f,key)?FOREIGN_MULT:1); const capped = f.name==='Walls' ? base : Math.min(SALARY_CAP, base); return Math.round(capped*nk/100)*100; }
const SALARY_CAP = 65000;   // nadie cobra más de 65K de sueldo (salvo Walls)
const UQ_SAL = {'Walls':1.6, 'Wos':1.15, 'Trueno':1.15, 'Duki':1.15, 'TiagoPZK':1.15, 'Jaloner':1.15, 'Lit Killah':1.15};
function salaryOf(f){
  const v = 0.6*f.nivel + 0.4*f.fama;
  const raw = (600 + Math.pow(Math.max(0,(v-35))/60, 2.3)*32000) * (f.legend ? LEGEND_MULT : 1) * 0.9 * (UQ_SAL[f.name]||1);
  return Math.round((f.name==='Walls' ? raw : Math.min(SALARY_CAP, raw))/100)*100;
}

