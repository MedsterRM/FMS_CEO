/* =========================================================================
   REVELACIÓN DEL LINE UP: 15 días antes de la J1, la comunidad opina en X
========================================================================= */
var LU_DAYS = 15;
var LU_RESERVED = 20;   // primeros 20 días de enero: reservados para la revelación de line ups
/* Cuentas de X: TWITTEROS (reales, con color de país), TW_NEWS (McNoticias / Info Freestyle) y tuiteros genéricos de relleno */
function luStreak(s, k, id){   // temporadas seguidas anteriores en esta misma liga
  let n=0; for(let i=state.seasons.length-2;i>=0;i--){ const o=state.seasons[i];
    if(k===INTL.key){ if(o.intl && (o.intl.qualifiers||[]).includes(id)) n++; else break; continue; }
    const L=o.leagues&&o.leagues[k];
    if(L && (o.activeKeys||[]).includes(k) && (L.competitors||[]).includes(id)) n++; else break; } return n;
}
function luEverIn(s, id){ return state.seasons.slice(0,-1).some(o=>Object.keys(o.leagues||{}).some(k=>(o.activeKeys||[]).includes(k) && (o.leagues[k].competitors||[]).includes(id))); }
var TWITTEROS = [
  {"handle":"Quesadacid","name":"Rodrigo Quesada","country":"España","verified":true,"img":"@quesada","fav":[],"hate":[],"special":"quesada"},
  {"handle": "CTZismo", "name": "CTZismo", "country": "España", "verified": false, "img": "tw_ctzismo", "fav": [], "hate": []},
  {"handle": "SawiEleskizo", "name": "SawiEleskizo", "country": "México", "verified": false, "img": "tw_sawieleskizo", "fav": ["Gazir", "Bnet", "Mecha"], "hate": ["Cacha", "Stick", "Nitro"]},
  {"handle": "AhiDiceYuji", "name": "Yuji", "country": "España", "verified": false, "img": "tw_ahidiceyuji", "fav": ["Skone", "Chuty", "Gazir"], "hate": ["Navas", "Kodigo", "Vijay Kesh"]},
  {"handle": "fabiukismo", "name": "Fabiukismo", "country": null, "verified": false, "img": "tw_fabiukismo", "fav": ["Fabiuki", "Acertijo", "Gazir"], "hate": ["Yoiker", "Barón", "Cacha"]},
  {"handle": "KzgLegendary_", "name": "KzgLegendary", "country": "España", "verified": false, "img": "tw_kzglegendary_", "fav": ["Teorema", "Sweet Pain", "Acru"], "hate": ["Dybbuk", "Acertijo", "Barón"]},
  {"handle": "hbrsg_", "name": "motera", "country": "España", "verified": false, "img": "tw_hbrsg_", "fav": ["Bnet", "Acru"], "hate": ["Gazir", "Dybbuk", "Zasko"]},
  {"handle": "IgnoreF3", "name": "IgnoreF", "country": "Perú", "verified": false, "img": "tw_ignoref3", "fav": ["Jaze", "Acru", "Reverse"], "hate": ["Force", "Drose", "Acertijo"]},
  {"handle": "Benja_LIT", "name": "benja ☽", "country": "Chile", "verified": false, "img": "tw_benja_lit", "fav": ["Sweet Pain", "Teorema", "Abel"], "hate": ["Cacha", "Skone", "Acertijo"]},
  {"handle": "erchelsifut", "name": "Brais", "country": "España", "verified": false, "img": "tw_erchelsifut", "fav": ["Bnet", "Walls", "Jaze"], "hate": ["Navas", "Nitro", "Nekroos"]},
  {"handle": "SantiagoMagda1", "name": "Pity Martínez", "country": "Argentina", "verified": false, "img": "tw_santiagomagda1", "fav": ["Alkoy", "Bnet", "Zasko"], "hate": ["Larrix", "Dybbuk", "Gazir"]},
  {"handle": "ElVacileDeSKONE", "name": "ElVacileDeSKONE", "country": "España", "verified": false, "img": "tw_elvaciledeskone", "fav": ["Skone"], "hate": []},
  {"handle": "diegidioos", "name": "Diegooo 🇪🇸", "country": "España", "verified": false, "img": "tw_diegidioos", "fav": ["Gazir", "Bnet", "Rayban"], "hate": ["Nekroos", "Nitro", "Azuky"]},
  {"handle": "AKA_Porrismo", "name": "Zeker Roken", "country": "México", "verified": false, "img": "tw_aka_porrismo", "fav": ["Zasko", "Jony Beltrán", "Chuty"], "hate": ["Acertijo", "Kodigo", "Navas"]},
  {"handle": "uknowjav1", "name": "JAVIUKNOW", "country": "Argentina", "verified": true, "img": "tw_uknowjav1", "fav": ["Bnet", "Abel", "Navas"], "hate": ["Aczino", "Chuty", "Rapder"]},
  {"handle": "DavidEgidooo", "name": "David Egido Domenech", "country": "España", "verified": false, "img": "tw_davidegidooo", "fav": ["Nocre", "Sweet Pain", "Segrelles"], "hate": ["Jesús LC", "Mounts", "Lgido"]},
  {"handle": "Jalonerista", "name": "AlanBR", "country": "Chile", "verified": false, "img": "tw_jalonerista", "fav": ["El Menor", "Zasko", "Abel"], "hate": ["Acertijo", "Rapder", "Skone"]},
  {"handle": "Vazcoo_", "name": "Vazcoo", "country": "México", "verified": false, "img": "tw_vazcoo_", "fav": ["Zasko", "Bnet", "Teorema"], "hate": ["Rapder", "Azuky", "Dybbuk"]},
  {"handle": "Letoinia", "name": "Tiaguiño MC", "country": "Chile", "verified": false, "img": "tw_letoinia", "fav": ["Teorema", "Aczino", "Stigma"], "hate": ["Mecha", "Dybbuk", "Cacha"]},
  {"handle": "Ruvii____", "name": "Ruvi", "country": null, "verified": false, "img": "tw_ruvii____", "fav": ["Acru", "Papo", "Nitro"], "hate": []},
  {"handle": "elbrozas02", "name": "BRZ", "country": "España", "verified": false, "img": "tw_elbrozas02", "fav": ["Sweet Pain", "Bnet", "Chuty"], "hate": ["Force", "Xhavez", "Nitro"]},
  {"handle": "renzopr4", "name": "Ren", "country": "EEUU", "verified": false, "img": "tw_renzopr4", "fav": ["Gazir", "Chuty", "Teorema"], "hate": ["Rapder", "Dybbuk", "Acertijo"]},
  {"handle": "YairData", "name": "Yair", "country": "México", "verified": false, "img": "tw_yairdata", "fav": ["MCKlopedia", "Hadrian", "Piezas"], "hate": ["Tirpa", "Navas", "Segrelles"]},
  {"handle": "Emiaj761", "name": "Emiaj76", "country": "España", "verified": false, "img": "tw_emiaj761", "fav": ["Gazir", "Alek", "Mecha"], "hate": ["Kodigo", "Rapder", "Replik"]},
  {"handle": "DrekaaUC", "name": "Drekaa UC", "country": "España", "verified": false, "img": "tw_drekaauc", "fav": ["Chuty", "Sweet Pain", "Mecha"], "hate": ["Rapder", "Dima"]},
  {"handle": "FandeTrunks_", "name": "Trunks", "country": "República Dominicana", "verified": false, "img": "tw_fandetrunks_", "fav": ["El Menor", "Teorema", "Stuart"], "hate": ["Navas", "Force", "KG"]},
  {"handle": "eljaiskore_BS", "name": "Jaiskor", "country": "Perú", "verified": false, "img": "tw_eljaiskore_bs", "fav": ["Jaze", "Jota", "Trueno"], "hate": ["Navas", "Jair Wong", "Acertijo"]},
  {"handle": "LaVozDelFri", "name": "LaVozDelFreestyle", "country": "México", "verified": false, "img": "tw_lavozdelfri", "fav": ["Sweet Pain", "Zasko", "Teorema"], "hate": ["Cacha", "Valles-T", "Rapder"]},
  {"handle": "AfiduPingon", "name": "Afidu Alarako", "country": "Perú", "verified": false, "img": "tw_afidupingon", "fav": ["Scraps", "Papo", "Vokbulario"], "hate": ["Navas", "Dalia", "Papicha"]},
  {"handle": "Freekys", "name": "Freekys", "country": "España", "verified": false, "img": "tw_freekys", "fav": ["Sweet Pain", "Reverse", "Jaze"], "hate": ["Force", "Azuky", "Jesús LC"]},
  {"handle": "fripuro_", "name": "fripuro", "country": "Argentina", "verified": false, "img": "tw_fripuro_", "fav": ["Mecha", "Abel", "Bnet"], "hate": ["Rodamiento", "Acertijo", "KG"]},
  {"handle": "ErrorJudicialNF", "name": "n0facefighter", "country": "Perú", "verified": false, "img": "tw_errorjudicialnf", "fav": ["Duki", "Jaze", "MCKlopedia"], "hate": []},
  {"handle": "kora", "name": "SI ROMAN ES EL PILOTO BOCA ES EL CHAPECOPENSE", "country": "Argentina", "verified": false, "img": "tw_kora", "fav": ["Zasko", "Abel", "Bnet"], "hate": ["Force", "Letra", "Acertijo"]},
  {"handle": "NOZHITO1", "name": "NOZHITO", "country": "Panamá", "verified": false, "img": "tw_nozhito1", "fav": ["Aldahir", "UFO"], "hate": []},
  {"handle": "Deap1616", "name": "ashe", "country": "Argentina", "verified": false, "img": "tw_deap1616", "fav": ["Abel", "Larrix", "Tirpa"], "hate": ["Rapder", "Acertijo", "Force"]},
  {"handle": "IkerRM_", "name": "IkerRM", "country": "España", "verified": false, "img": "tw_ikerrm_", "fav": ["Gazir", "Valles-T", "Chuty"], "hate": ["Navas", "Nekroos", "Nitro"]},
  {"handle": "el_biontito", "name": "Biont", "country": "España", "verified": false, "img": "tw_el_biontito", "fav": ["Zasko", "Abel", "KG"], "hate": ["Dybbuk", "Pandora", "Acertijo"]},
  {"handle": "SalazarSixi", "name": "AKA", "country": null, "verified": false, "img": "tw_salazarsixi", "fav": ["Jaze", "KG", "Teorema"], "hate": ["Azuky", "Fat N", "Navas"]},
  {"handle": "Awel0_", "name": "Awelo", "country": "Chile", "verified": true, "img": "tw_awel0_", "fav": ["El Menor", "Abel", "Zasko"], "hate": ["Rapder", "Nitro", "Valles-T"]},
  {"handle": "elreydelhielo_", "name": "Rey del Hielo", "country": "España", "verified": false, "img": "tw_elreydelhielo_", "fav": ["Jaloner"], "hate": ["Almendrades", "Marithea", "Gazir"]},
  {"handle": "MarconoNotFound", "name": "MARCONE CANGREJO MUTANTE", "country": "Argentina", "verified": false, "img": "tw_marcononotfound", "fav": ["Mnak", "Mecha", "RC"], "hate": ["Larrix", "Kaiser", "Drose"]},
  {"handle": "xgbrlmthsx", "name": "GP", "country": "Venezuela", "verified": false, "img": "tw_xgbrlmthsx", "fav": ["Stuart", "Joqerr", "Larrix"], "hate": ["Rapder", "Dybbuk", "Hammer"]},
  {"handle": "cronicasportcat", "name": "Àlex", "country": "España", "verified": false, "img": "tw_cronicasportcat", "fav": ["Bnet", "Ibán", "Nocre"], "hate": ["Navas", "Nekroos", "KG"]},
  {"handle": "GriselGonz44241", "name": "uriel gonzalez", "country": "Argentina", "verified": false, "img": "tw_griselgonz44241", "fav": ["Dtoke", "Gazir", "Mecha"], "hate": ["Kaiser", "Navas", "Ramset"]},
  {"handle": "DonatoFerr75055", "name": "DoroMC 🇺🇾", "country": "Uruguay", "verified": false, "img": "tw_donatoferr75055", "fav": ["Jony Beltrán", "Cacha", "Sweet Pain"], "hate": ["Abel", "Navas", "Michu"]},
  {"handle": "Chipi139", "name": "Chipi", "country": "España", "verified": false, "img": "tw_chipi139", "fav": ["Sweet Pain", "Zasko", "Fabiuki"], "hate": ["Rapder", "Nekroos", "Fat N"]},
  {"handle": "ModorkFN", "name": "AlexanderYSB", "country": "México", "verified": false, "img": "tw_modorkfn", "fav": ["Gazir", "Bnet", "Sweet Pain"], "hate": ["Nitro", "Letra", "Nekroos"]},
  {"handle": "lil_puppet25", "name": "lil puppet 🇨🇱", "country": "Chile", "verified": false, "img": "tw_lil_puppet25", "fav": ["Teorema", "Mecha"], "hate": ["Kodigo", "Rapder", "Sara Socas"]},
  {"handle": "1903_apoyoatleti", "name": "1903_apoyoatleti", "country": "España", "verified": false, "img": "tw_1903_apoyoatleti", "fav": ["El Menor", "Gazir", "Chuty"], "hate": ["Aczino", "Alek", "Navas"]},
  {"handle": "Mastantuonism01", "name": "Mastantuonismo", "country": "Argentina", "verified": false, "img": "tw_mastantuonism01", "fav": ["Mecha", "Sweet Pain", "Jony Beltrán"], "hate": ["Dybbuk", "KG", "Chang"]},
  {"handle": "Lainho_", "name": "Laíño", "country": "España", "verified": false, "img": "tw_lainho_", "fav": ["Alek", "Nez", "Perry"], "hate": ["Dani VK", "Michu"]},
  {"handle": "ernizito", "name": "ernizito", "country": "Argentina", "verified": false, "img": "tw_ernizito", "fav": ["Zasko", "Jaze", "Mecha"], "hate": ["Acertijo", "Larrix", "Rapder"]},
  {"handle": "NPCMEXA", "name": "Npcmexicano", "country": "México", "verified": false, "img": "tw_npcmexa", "fav": ["El Menor", "Larrix", "Skone"], "hate": ["Gazir", "KG", "Valles-T"]},
  {"handle": "Fabhy__", "name": "FABHY_17", "country": "España", "verified": false, "img": "tw_fabhy__", "fav": ["Barón", "Xhavez", "CTZ"], "hate": ["Lobo Estepario", "Filósofo"]},
  {"handle": "Rasec_MF_", "name": "RaseC_B.A.", "country": "España", "verified": false, "img": "tw_rasec_mf_", "fav": ["Zasko", "Abel", "Joqerr"], "hate": ["Sara Socas", "Rapder", "Nitro"]},
  {"handle": "rexo_tw", "name": "santicarrasco", "country": "Argentina", "verified": false, "img": "tw_rexo_tw", "fav": ["Sweet Pain", "Replik", "Jaze"], "hate": ["Cacha", "Nitro", "Navas"]},
  {"handle": "Psychokiler9", "name": "Kiler", "country": "España", "verified": false, "img": "tw_psychokiler9", "fav": ["Arkano", "Skone", "Mr. Ego"], "hate": ["Navas", "Nitro", "Rapder"]},
  {"handle": "2BravoCharlie", "name": "BravoCharlie 🇻🇪", "country": "Venezuela", "verified": false, "img": "tw_2bravocharlie", "fav": ["Letra", "Chang", "Black Code"], "hate": ["Navas", "Naista", "Airon"]},
  {"handle": "KojiroRap30", "name": "KojiroRap", "country": "Colombia", "verified": false, "img": "tw_kojirorap30", "fav": ["Lokillo", "Chuty", "Jaze"], "hate": ["Cacha", "Azuky", "KG"]},
  {"handle": "Joaquin_nunez7", "name": "Xseven7", "country": "Perú", "verified": false, "img": "tw_joaquin_nunez7", "fav": ["Bnet", "Abel", "Jaze"], "hate": ["Force", "Dybbuk", "Jair Wong"]},
  {"handle": "marconcentrado", "name": "marco", "country": "México", "verified": false, "img": "tw_marconcentrado", "fav": ["Acru", "Tata", "Bnet"], "hate": ["Cacha", "Acertijo", "Rapder"]},
  {"handle": "BLEDOXD", "name": "blaxx", "country": "Chile", "verified": false, "img": "tw_bledoxd", "fav": ["El Menor", "Valles-T", "Rife"], "hate": ["Navas", "Michu", "Dybbuk"]},
  {"handle": "acciomas", "name": "acciomas", "country": "España", "verified": false, "img": "tw_acciomas", "fav": ["Stuart", "Chuty", "Replik"], "hate": ["Valles-T", "Force", "Acertijo"]},
  {"handle": "ElGatonto", "name": "bronx", "country": "Argentina", "verified": false, "img": "tw_elgatonto", "fav": ["Acru", "Aczino", "El Menor"], "hate": ["Naista", "Gazir", "Dybbuk"]},
  {"handle": "mauzun_06", "name": "M_zeta", "country": "Ecuador", "verified": false, "img": "tw_mauzun_06", "fav": ["Navas", "Abel", "Ritter"], "hate": ["Cacha", "Acertijo", "Garza"]},
  {"handle": "Mcflyxfree", "name": "Alfredo", "country": "Venezuela", "verified": false, "img": "tw_mcflyxfree", "fav": ["Chang", "Blon", "Zasko"], "hate": ["Mounts", "Nekroos", "Cacha"]},
  {"handle": "langonismo_13", "name": "SI ES NENE PONELE ACRU", "country": "Argentina", "verified": false, "img": "tw_langonismo_13", "fav": ["Abel", "Stuart", "Ibán"], "hate": ["KG", "Fat N", "Azuky"]},
  {"handle": "matogofc", "name": "matogo", "country": "España", "verified": false, "img": "tw_matogofc", "fav": ["Navas", "Chuty", "Bnet"], "hate": ["Force", "Aczino", "El Menor"]},
  {"handle": "LibanielNorena", "name": "Lib", "country": "Colombia", "verified": false, "img": "tw_libanielnorena", "fav": ["Abel", "Teorema", "Nocre"], "hate": ["Aczino", "Nitro", "Dybbuk"]},
  {"handle": "yebrayeah", "name": "aka.braye", "country": "España", "verified": false, "img": "tw_yebrayeah", "fav": ["Reverse", "Xhavez", "Teorema"], "hate": ["Black Code", "Abel", "Drose"]},
  {"handle": "JoseleJr99", "name": "Josele", "country": "España", "verified": false, "img": "tw_joselejr99", "fav": ["Mr Aaron"], "hate": ["Gazir", "Marithea", "Rapder"]},
  {"handle": "ReinoBlaugrana", "name": "Reino", "country": null, "verified": false, "img": "tw_reinoblaugrana", "fav": ["Sweet Pain", "Stuart", "Filósofo"], "hate": ["Dybbuk", "Larrix", "KG"]},
  {"handle": "way2fresh30", "name": "Omar carpio", "country": "Ecuador", "verified": false, "img": "tw_way2fresh30", "fav": ["Gazir", "Larrix", "Abel"], "hate": ["Azuky", "Switch", "Navas"]},
  {"handle": "Dan_x2g", "name": "Dan", "country": null, "verified": false, "img": "tw_dan_x2g", "fav": ["Jaze", "Necia", "Diego MC"], "hate": ["Sumeria", "Papicha", "Jair Wong"]},
  {"handle": "porrinhoo", "name": "porrinho", "country": "España", "verified": false, "img": "tw_porrinhoo", "fav": ["Gazir", "Krisan", "Sweet Pain"], "hate": ["Rapder", "Aczino", "Fat N"]},
  {"handle": "cleto1902", "name": "Cleto DKNO", "country": "Argentina", "verified": false, "img": "tw_cleto1902", "fav": ["Mecha", "Valles-T", "Reverse"], "hate": ["El Menor", "Navas", "Rapder"]},
  {"handle": "Dieggoalonnso", "name": "dieggoalonnso", "country": "España", "verified": false, "img": "tw_dieggoalonnso", "fav": ["Gazir", "Jony Beltrán", "99"], "hate": ["KG", "Navas", "Nota Roja"]},
  {"handle": "_osk44", "name": "Oscar", "country": "Argentina", "verified": false, "img": "tw__osk44", "fav": ["Dyse", "Mecha", "Zasko"], "hate": ["Dybbuk", "Rapder", "Lokillo"]},
  {"handle": "moskifreestyle", "name": "Moski", "country": "España", "verified": false, "img": "tw_moskifreestyle", "fav": ["Acru", "Abel", "Teorema"], "hate": ["Kodigo", "Rapder", "Barón"]},
  {"handle": "Shade2901", "name": "TE CAYERON TODOS LOS PUNCHLINES JUNTOS", "country": "Argentina", "verified": false, "img": "tw_shade2901", "fav": ["Mecha", "Gazir", "Abel"], "hate": ["Azuky", "Navas", "Nota Roja"]},
  {"handle": "TengomilPiplups", "name": "Iván Pastore", "country": "España", "verified": false, "img": "tw_tengomilpiplups", "fav": ["Exe", "Chuty", "Skone"], "hate": ["Navas", "HDR", "Bélico"]},
  {"handle": "rodrigo_zarate1", "name": "Rodrigo Zarate ()", "country": "Argentina", "verified": false, "img": "tw_rodrigo_zarate1", "fav": ["Gazir", "Mecha", "Exe"], "hate": ["Rapder", "Dybbuk", "El Menor"]},
  {"handle": "GameExiliado", "name": "GameExiliado", "country": "España", "verified": false, "img": "tw_gameexiliado", "fav": ["Skone", "Larrix", "Chuty"], "hate": ["Rapder", "Navas", "Azuky"]},
  {"handle": "RicoGercho", "name": "VersettRMU", "country": "España", "verified": false, "img": "tw_ricogercho", "fav": ["Skone", "Bnet", "Walls"], "hate": ["Sara Socas", "Abel", "Acertijo"]},
  {"handle": "Leoo_Cantero", "name": "Leo", "country": "Argentina", "verified": false, "img": "tw_leoo_cantero", "fav": ["Mecha", "Jaze", "Gazir"], "hate": ["Force", "Cacha", "Rapder"]},
  {"handle": "o_reynildoATM", "name": "#freereinildo", "country": "España", "verified": false, "img": "tw_o_reynildoatm", "fav": ["Bnet", "Jaze", "Replik"], "hate": ["Force", "Nekroos", "Lgido"]},
  {"handle": "MauArce21", "name": "MAU 1889", "country": "Argentina", "verified": false, "img": "tw_mauarce21", "fav": ["Dani Ribba", "Stuart", "Teorema"], "hate": ["Klan", "Replik", "Aczino"]},
  {"handle": "TenPantalla", "name": "Alonso Talavera 29", "country": "Perú", "verified": false, "img": "tw_tenpantalla", "fav": ["Venti"], "hate": ["Jair Wong", "Sumeria"]},
  {"handle": "CoBaT0_", "name": "CoBaT0", "country": "Colombia", "verified": false, "img": "tw_cobat0_", "fav": ["Zasko", "Teorema", "Abel"], "hate": ["Nitro", "Rapder", "Cacha"]},
  {"handle": "KiTsuN3_19", "name": "Comandante Kitsune", "country": "Puerto Rico", "verified": false, "img": "tw_kitsun3_19", "fav": ["Teorema", "Sweet Pain", "Wos"], "hate": ["Rapder", "Acertijo", "Force"]},
  {"handle": "larriva_j", "name": "JLarriva", "country": "Ecuador", "verified": false, "img": "tw_larriva_j", "fav": ["Gazir", "Tom Crowley", "Blon"], "hate": ["Navas", "Rapder", "Rodamiento"]},
  {"handle": "Marc254222", "name": "Marc", "country": "España", "verified": false, "img": "tw_marc254222", "fav": ["Chuty", "Bnet", "Acru"], "hate": ["Sara Socas", "Nocre", "El Menor"]},
  {"handle": "Bautistamenaje", "name": "Bautitamenaje", "country": "Argentina", "verified": false, "img": "tw_bautistamenaje", "fav": ["Bnet", "Stuart", "El Menor"], "hate": ["Navas", "Drose", "HDR"]},
  {"handle": "edersanv", "name": "edersan", "country": null, "verified": false, "img": "tw_edersanv", "fav": ["Abel", "Ibán", "Fabiuki"], "hate": ["Azuky", "CDFlex", "Rapder"]},
  {"handle": "ElMaxTO", "name": "TheMaxTO", "country": "México", "verified": false, "img": "tw_elmaxto", "fav": ["Aczino", "Jaze", "Teorema"], "hate": ["Navas", "Rapder", "Black Code"]},
  {"handle": "3l_F3NIXx", "name": "Diego_Mtz", "country": "México", "verified": false, "img": "tw_3l_f3nixx", "fav": ["Stuart", "Sweet Pain", "Teorema"], "hate": ["Rapder", "Dybbuk", "Replik"]},
  {"handle": "Carlito52323616", "name": "Carlos :)", "country": "México", "verified": false, "img": "tw_carlito52323616", "fav": ["Gazir", "Aczino", "Chuty"], "hate": ["Replik", "Navas", "Jony Beltrán"]},
  {"handle": "SaulRH3", "name": "KGismo", "country": "México", "verified": false, "img": "tw_saulrh3", "fav": ["KG", "Sweet Pain", "Sub"], "hate": ["Dybbuk", "Azuky", "Force"]},
  {"handle": "JuanManuel25339", "name": "Juan Manuel Abellaneda", "country": null, "verified": false, "img": "tw_juanmanuel25339", "fav": ["Navas", "Zasko", "Bélico"], "hate": ["Force", "Aczino", "Gazir"]},
  {"handle": "DiaFreestyler", "name": "Diario Freestyler", "country": null, "verified": false, "img": "tw_diafreestyler", "fav": ["Stuart", "Nacho SRK"], "hate": ["Force", "Hander", "Naista"]},
  {"handle": "GGFRESH0", "name": "nanomesias", "country": null, "verified": false, "img": "tw_ggfresh0", "fav": ["Bnet", "Zasko", "Arkano"], "hate": ["Rapder", "Aczino", "Mecha"]},
  {"handle": "joaq_ferrari", "name": "Swaggy J", "country": "Uruguay", "verified": false, "img": "tw_joaq_ferrari", "fav": ["Acru", "Aczino", "Jaze"], "hate": ["Rapder", "Navas", "Cacha"]},
  {"handle": "aaronsit00", "name": "Aaronsit00", "country": null, "verified": false, "img": "tw_aaronsit00", "fav": ["Mnak", "Acru", "Bnet"], "hate": ["Navas", "Kodigo", "Hander"]},
  {"handle": "nickzfn94", "name": "nickzzën", "country": "España", "verified": false, "img": "tw_nickzfn94", "fav": ["Gazir", "Trueno", "Acru"], "hate": ["Teorema", "Acertijo", "Sweet Pain"]},
  {"handle": "Txuntxu138083", "name": "txuntxu", "country": "Colombia", "verified": false, "img": "tw_txuntxu138083", "fav": ["Teorema", "Abel", "Valles-T"], "hate": ["Alek", "Stuart", "Nitro"]},
  {"handle": "WinteRNR9", "name": "GreenSnow", "country": "EEUU", "verified": false, "img": "tw_winternr9", "fav": ["Aczino", "Acru", "Chuty"], "hate": ["CTZ", "Mecha", "Abel"]},
  {"handle": "jotabolsilludo", "name": "Jota", "country": "Uruguay", "verified": false, "img": "tw_jotabolsilludo", "fav": ["Skone", "Zasko", "Teorema"], "hate": ["Navas", "Rapder", "Sophia"]},
  {"handle": "sotelo__08", "name": "el_killer08", "country": "España", "verified": false, "img": "tw_sotelo__08", "fav": ["Wos", "Acru", "Sweet Pain"], "hate": ["Rapder", "Force", "Fat N"]},
  {"handle": "DavidGJamal", "name": "David G. Jamal", "country": "España", "verified": false, "img": "tw_davidgjamal", "fav": ["Zasko", "Sweet Pain", "Krisan"], "hate": ["Force", "Azuky", "Gazir"]},
  {"handle": "freestylereal06", "name": "freestylereal", "country": "España", "verified": false, "img": "tw_freestylereal06", "fav": ["Navas", "Dr. Filtros", "Bnet"], "hate": ["Aczino", "Force", "Gazir"]},
  {"handle": "Multinecz", "name": "Multinecz", "country": "Chile", "verified": false, "img": "tw_multinecz", "fav": ["Ricto", "Zasko", "Marithea"], "hate": ["Nekroos", "Navas", "Fat N"]},
  {"handle": "jemzukii", "name": "jem #largatevelazco", "country": "Perú", "verified": false, "img": "tw_jemzukii", "fav": ["Nitro", "Kodigo", "Fusok"], "hate": ["Navas", "Sumeria", "Dalia"]},
  {"handle": "Shoviii_", "name": "Shovii", "country": "Colombia", "verified": false, "img": "tw_shoviii_", "fav": ["Gazir", "Valles-T", "El Menor"], "hate": ["Rapder", "Almendrades", "Fat N"]},
  {"handle": "SToilet86312", "name": "°Kyzen 🇲🇽°", "country": "México", "verified": false, "img": "tw_stoilet86312", "fav": ["Skiper", "Dominic"], "hate": ["Dybbuk", "Knnon", "Acertijo"]},
  {"handle": "DRossox", "name": "Rfs", "country": "Colombia", "verified": false, "img": "tw_drossox", "fav": ["Valles-T", "Teorema", "Bnet"], "hate": ["Puppy", "Navas", "Force"]},
  {"handle": "Fernando_Soto11", "name": "Fernando Soto", "country": "México", "verified": false, "img": "tw_fernando_soto11", "fav": ["Teorema", "Aczino", "Valles-T"], "hate": ["Azuky", "Navas", "Drose"]},
  {"handle": "just__ld19", "name": "LD", "country": "Colombia", "verified": false, "img": "tw_just__ld19", "fav": ["Trueno", "Bnet", "Puppy"], "hate": ["Rapder", "Acertijo", "Stick"]},
  {"handle": "MGJVYB", "name": "ex manu baby", "country": "España", "verified": false, "img": "tw_mgjvyb", "fav": ["Jaze", "Acru", "Sweet Pain"], "hate": ["Vijay Kesh", "Blon", "Dybbuk"]},
  {"handle": "jxandi_vz", "name": "Jxandi", "country": "Venezuela", "verified": false, "img": "tw_jxandi_vz", "fav": ["Papo", "Chang", "Fabiuki"], "hate": ["Navas", "Dybbuk", "Hander"]},
  {"handle": "6ancap6Lib", "name": "FanDelFree 🇲🇽", "country": "México", "verified": false, "img": "tw_6ancap6lib", "fav": ["Abel", "Zasko"], "hate": ["Cacha", "Rapder", "Valles-T"]},
  {"handle": "gutifiosoo", "name": "Gutifioso", "country": "España", "verified": false, "img": "tw_gutifiosoo", "fav": ["Teorema", "Bnet", "Sweet Pain"], "hate": ["Navas", "CDFlex", "Drose"]},
  {"handle": "Sarto0d", "name": "Sarto.0", "country": "Argentina", "verified": false, "img": "tw_sarto0d", "fav": ["Mecha", "Dyse", "El Menor"], "hate": ["Azuky", "Dalia", "Chang"]},
  {"handle": "TukiSaint", "name": "TUKI", "country": "Argentina", "verified": false, "img": "tw_tukisaint", "fav": ["Abel", "Mecha", "1Tobi"], "hate": ["Filósofo", "KG", "Aczino"]},
  {"handle": "Marco_Ramirez7", "name": "Marco R. Martinez", "country": "Honduras", "verified": false, "img": "tw_marco_ramirez7", "fav": ["Chuty", "Jaze", "Aczino"], "hate": ["Abel", "Nocre", "Dani VK"]},
  {"handle": "tinchotinchea", "name": "Tincherismo🇪🇸", "country": "España", "verified": false, "img": "tw_tinchotinchea", "fav": ["Sweet Pain", "Bnet", "Zasko"], "hate": ["Force", "Nitro", "Sara Socas"]},
  {"handle": "DomadasGato", "name": "⭐️ 16 🦅", "country": "México", "verified": false, "img": "tw_domadasgato", "fav": ["Aczino", "Wos", "Kodigo"], "hate": ["KG", "Fat N", "CTZ"]},
  {"handle": "LuccaPugliese", "name": "Lucca Supreme", "country": "Argentina", "verified": false, "img": "tw_luccapugliese", "fav": ["Bnet", "Papo", "Zasko"], "hate": ["Dybbuk", "Force", "Acertijo"]},
  {"handle": "prensasinsaber_", "name": "Francisco 🇦🇷", "country": "Argentina", "verified": false, "img": "tw_prensasinsaber_", "fav": ["Abel", "Bnet", "Teorema"], "hate": ["Navas", "Azuky", "Acertijo"]},
  {"handle": "kyforgothisname", "name": "kyzanoesta", "country": "México", "verified": false, "img": "tw_kyforgothisname", "fav": ["Jaze", "Teorema", "Acru"], "hate": ["Rapder", "Segrelles", "Acertijo"]},
  {"handle": "Joel_Otero22", "name": "Joeel_22", "country": "España", "verified": false, "img": "tw_joel_otero22", "fav": ["Abel", "Fabiuki", "KG"], "hate": ["Cacha", "Rapder", "Nitro"]},
  {"handle": "paco10809914", "name": "Antifarias", "country": "Colombia", "verified": false, "img": "tw_paco10809914", "fav": ["Papo", "Chuty", "Bélico"], "hate": ["Navas", "Rapder", "Almendrades"]},
  {"handle": "martingzlez", "name": "Martin González", "country": "Colombia", "verified": false, "img": "tw_martingzlez", "fav": ["Fabiuki", "Larrix", "El Menor"], "hate": ["Navas", "Rapder", "Black Code"]},
  {"handle": "AKA_FMK", "name": "efe", "country": "España", "verified": false, "img": "tw_aka_fmk", "fav": ["Zasko", "Bnet", "Ibán"], "hate": ["Gazir", "El Menor", "Valles-T"]},
  {"handle": "Batallas_Mc", "name": "BatallasMc", "country": null, "verified": false, "img": "tw_batallas_mc", "fav": ["Teorema", "Visionario", "Klan"], "hate": ["Kian", "Dybbuk", "Rapder"]}
];
/* ---- habla de cada país: los tuiteros escriben con sus palabras ---- */
function twDia(c){ if(!c) return 'neu'; if(c==='España') return 'es'; if(c==='Argentina'||c==='Uruguay') return 'ar'; if(c==='México'||c==='EEUU') return 'mx';
  if(c==='Chile') return 'cl'; if(c==='Perú'||c==='Ecuador'||c==='Bolivia') return 'pe'; if(c==='Colombia') return 'co'; return 'car'; }
var TWD={
  es:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} yo me lo veo todo, no hay más que hablar','Tío, que está {n}. Me lo apunto todo','Con {n} esta liga ya es otra cosa, qué pasada','{n} va a petarlo en {liga}, apuntadlo','Me flipa que esté {n}. Por fin una decisión con sentido'],
    hate:['{n} no es para mí, lo siento. Había otros que me apetecían más','{n} en {liga}... no termina de convencerme','Con todo el respeto a {n}, había opciones que me molaban más','No conecto con el estilo de {n}, esta vez no me ilusiona','A {n} le respeto, pero en este cartel no lo veo'],
    hateF:['Pues este año paso de {liga}, con {n} no me la veo','Con {n} en {liga} ya sé qué liga no me voy a ver','{liga} con {n}... me quedo con la mía, gracias'],
    favF:['No soy de ver {liga}, pero con {n} me la voy a tragar entera','Solo por {n} me engancho este año a {liga}','{n} en {liga}. Pues tocará verla 🔥'],
    swap:['Para traer a {n} podíais haber traído a {f}, vamos digo yo','¿Fichar a {n} teniendo a {f} disponible? No lo entiendo','Si había que traer a alguien de fuera, que fuera {f} y no {n}'],
    ret:['¡VUELVE {n}! Llevaba años esperando esto 🔥','{n} de vuelta en FMS. Se me ha puesto la piel de gallina','Lo que he echado de menos a {n}. Bienvenido otra vez'],
    retN:['Qué bien que vuelva {n}, se echaba en falta','Mira quién vuelve: {n}. Buena noticia'],
    retL:['¿Vuelve {n}? Bueno, a ver qué tal','{n} otra vez por aquí. Vale, sin más'],
  },
  ar:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} lo veo todo, no hay con qué darle','Está {n}, loco. Re manija','Con {n} esta liga es otra cosa, una locura','{n} la va a romper en {liga}, anótenlo','Posta, que esté {n} es lo mejor que le pudo pasar a {liga}'],
    hate:['{n} no me cierra, perdón. Había otros que me gustaban más','{n} en {liga}... no me termina de convencer','Con todo el respeto a {n}, había mejores opciones','No conecto con el estilo de {n}, esta vez no me entusiasma','A {n} lo respeto, pero en este cartel no lo veo'],
    hateF:['Este año no miro {liga}, con {n} no me la banco','Con {n} en {liga} ya sé qué liga no voy a mirar','{liga} con {n}... me quedo con la nuestra'],
    favF:['No suelo mirar {liga}, pero con {n} la veo toda','Solo por {n} me prendo este año a {liga}','{n} en {liga}. Habrá que mirarla 🔥'],
    swap:['Para traer a {n} hubieran traído a {f}, ¿no?','¿Traer a {n} teniendo a {f}? No lo entiendo, posta','Si había que traer a alguien de afuera, que sea {f} y no {n}'],
    ret:['¡VUELVE {n}! Hace años que espero esto 🔥','{n} de vuelta en FMS. Se me pone la piel de gallina','Cómo extrañaba a {n}. Bienvenido de nuevo, loco'],
    retN:['Qué bueno que vuelva {n}, se lo extrañaba','Miren quién vuelve: {n}. Buena noticia'],
    retL:['¿Vuelve {n}? Bueno, veremos','{n} otra vez por acá. Dale, sin más'],
  },
  mx:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} lo veo todo, neta','No manches, está {n}. Qué chido','Con {n} esta liga es otra cosa, está cañón','{n} va a romperla en {liga}, apúntenlo','Qué buena decisión meter a {n}, carnal'],
    hate:['{n} no es para mí, la neta. Había otros que me gustaban más','{n} en {liga}... no me termina de convencer','Con todo respeto a {n}, había mejores opciones','No conecto con el estilo de {n}, esta vez no me emociona','A {n} lo respeto, pero en este cartel no lo veo'],
    hateF:['Este año no veo {liga}, con {n} ni de chiste','Con {n} en {liga} ya sé qué liga no voy a ver','{liga} con {n}... mejor me quedo con la de aquí'],
    favF:['No suelo ver {liga}, pero con {n} la veo completita','Nomás por {n} me pongo a ver {liga} este año','{n} en {liga}. Pues a verla 🔥'],
    swap:['Para traer a {n} mejor hubieran traído a {f}, ¿no?','¿Traer a {n} teniendo a {f}? No le entiendo','Si iban a traer a alguien de fuera, que fuera {f} y no {n}'],
    ret:['¡REGRESA {n}! Llevo años esperando esto 🔥','{n} de vuelta en FMS. Se me enchina la piel','Cómo extrañaba a {n}. Bienvenido otra vez, carnal'],
    retN:['Qué chido que regrese {n}, hacía falta','Miren quién regresa: {n}. Buena noticia'],
    retL:['¿Regresa {n}? Bueno, a ver qué tal','{n} otra vez por aquí. Va, sin más'],
  },
  cl:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} lo veo todo po','Está {n}, weón. La raja','Con {n} esta liga es otra cosa, bacán','{n} la va a romper en {liga}, anótenlo','Buena decisión meter a {n}, cachai'],
    hate:['{n} no es para mí, sorry. Había otros que me tincaban más','{n} en {liga}... no me convence mucho','Con todo respeto a {n}, había mejores opciones po','No conecto con el estilo de {n}, esta vez no me prende','A {n} lo respeto, pero en este cartel no lo veo'],
    hateF:['Este año no veo {liga}, con {n} no me la puedo','Con {n} en {liga} ya sé qué liga no voy a ver','{liga} con {n}... me quedo con la de acá'],
    favF:['No veo mucho {liga}, pero con {n} la veo entera','Solo por {n} me engancho con {liga} este año','{n} en {liga}. Habrá que verla po 🔥'],
    swap:['Para traer a {n} hubieran traído a {f} po','¿Traer a {n} teniendo a {f}? No cacho','Si iban a traer a alguien de afuera, que fuera {f} y no {n}'],
    ret:['¡VUELVE {n}! Llevo años esperando esto 🔥','{n} de vuelta en FMS. Se me puso la piel de gallina','Cómo extrañaba a {n}. Bienvenido de vuelta'],
    retN:['Bacán que vuelva {n}, se le echaba de menos','Miren quién vuelve: {n}. Buena noticia'],
    retL:['¿Vuelve {n}? Ya, veamos','{n} otra vez por acá. Ya po, sin más'],
  },
  pe:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} lo veo todo, causa','Asu, está {n}. Chévere','Con {n} esta liga es otra cosa, bacán','{n} la va a romper en {liga}, apunten','Buena decisión meter a {n} pe'],
    hate:['{n} no es para mí, disculpen. Había otros que me gustaban más','{n} en {liga}... no me convence','Con todo respeto a {n}, había mejores opciones','No conecto con el estilo de {n}, esta vez no me emociona','A {n} lo respeto, pero en este cartel no lo veo'],
    hateF:['Este año no veo {liga}, con {n} no la paso','Con {n} en {liga} ya sé qué liga no voy a ver','{liga} con {n}... me quedo con la de acá, causa'],
    favF:['No veo mucho {liga}, pero con {n} la veo toda','Solo por {n} me engancho con {liga} este año','{n} en {liga}. A verla pe 🔥'],
    swap:['Para traer a {n} hubieran traído a {f} pe','¿Traer a {n} teniendo a {f}? No entiendo, causa','Si iban a traer a alguien de afuera, que fuera {f} y no {n}'],
    ret:['¡VUELVE {n}! Años esperando esto 🔥','{n} de vuelta en FMS. Se me pone la piel de gallina','Cómo extrañaba a {n}. Bienvenido otra vez, causa'],
    retN:['Chévere que vuelva {n}, hacía falta','Miren quién vuelve: {n}. Buena noticia'],
    retL:['¿Vuelve {n}? Bueno, a ver qué tal','{n} otra vez por acá. Ya, sin más'],
  },
  co:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} lo veo todo, parce','Uff, está {n}. Qué chimba','Con {n} esta liga es otra cosa, muy bacano','{n} la va a romper en {liga}, anótenlo','Buena decisión meter a {n}, parcero'],
    hate:['{n} no es para mí, qué pena. Había otros que me gustaban más','{n} en {liga}... no me convence','Con todo respeto a {n}, había mejores opciones','No conecto con el estilo de {n}, esta vez no me emociona','A {n} lo respeto, pero en este cartel no lo veo'],
    hateF:['Este año no veo {liga}, con {n} no le jalo','Con {n} en {liga} ya sé qué liga no voy a ver','{liga} con {n}... me quedo con la de acá, parce'],
    favF:['No veo mucho {liga}, pero con {n} la veo toda','Solo por {n} me pego a {liga} este año','{n} en {liga}. Toca verla 🔥'],
    swap:['Para traer a {n} hubieran traído a {f}, parce','¿Traer a {n} teniendo a {f}? No entiendo','Si iban a traer a alguien de afuera, que fuera {f} y no {n}'],
    ret:['¡VUELVE {n}! Llevo años esperando esto 🔥','{n} de vuelta en FMS. Se me erizó la piel','Cómo extrañaba a {n}. Bienvenido otra vez, parce'],
    retN:['Bacano que vuelva {n}, hacía falta','Miren quién vuelve: {n}. Buena noticia'],
    retL:['¿Vuelve {n}? Bueno, a ver qué tal','{n} otra vez por acá. Listo, sin más'],
  },
  car:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} lo veo todo, pana','Está {n}, brutal','Con {n} esta liga es otra cosa, qué nota','{n} la va a romper en {liga}, anótenlo','Buena decisión meter a {n}, chévere'],
    hate:['{n} no es para mí, disculpen. Había otros que me gustaban más','{n} en {liga}... no me convence esa vaina','Con todo respeto a {n}, había mejores opciones','No conecto con el estilo de {n}, esta vez no me emociona','A {n} lo respeto, pero en este cartel no lo veo'],
    hateF:['Este año no veo {liga}, con {n} no','Con {n} en {liga} ya sé qué liga no voy a ver','{liga} con {n}... paso, pana'],
    favF:['No veo mucho {liga}, pero con {n} la veo toda','Solo por {n} me pego a {liga} este año','{n} en {liga}. A verla 🔥'],
    swap:['Para traer a {n} hubieran traído a {f}, pana','¿Traer a {n} teniendo a {f}? No entiendo esa vaina','Si iban a traer a alguien de afuera, que fuera {f} y no {n}'],
    ret:['¡VUELVE {n}! Llevo años esperando esto 🔥','{n} de vuelta en FMS. Brutal','Cómo extrañaba a {n}. Bienvenido otra vez, pana'],
    retN:['Chévere que vuelva {n}, hacía falta','Miren quién vuelve: {n}. Buena noticia'],
    retL:['¿Vuelve {n}? Bueno, a ver','{n} otra vez por aquí. Bien, sin más'],
  },
  neu:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} lo veo todo, no hay más que hablar','Está {n}. Gran noticia','Con {n} esta liga es otra cosa','{n} va a destacar en {liga}, anótenlo','Buena decisión incluir a {n}'],
    hate:['{n} no es para mí, disculpen. Había otros que me gustaban más','{n} en {liga}... no me convence','Con todo respeto a {n}, había mejores opciones','No conecto con el estilo de {n}, esta vez no me emociona','A {n} lo respeto, pero en este cartel no lo veo'],
    hateF:['Este año no veré {liga}, con {n} no me llama','Con {n} en {liga} ya sé qué liga no voy a ver','{liga} con {n}... esta vez paso'],
    favF:['No suelo ver {liga}, pero con {n} la veré entera','Solo por {n} veré {liga} este año','{n} en {liga}. Habrá que verla 🔥'],
    swap:['Para traer a {n} podrían haber traído a {f}','¿Traer a {n} teniendo a {f} disponible? No lo entiendo','Si había que traer a alguien de fuera, mejor {f} que {n}'],
    ret:['¡VUELVE {n}! Llevaba años esperando esto 🔥','{n} de vuelta en FMS. Qué emoción','Cuánto extrañaba a {n}. Bienvenido de nuevo'],
    retN:['Qué bien que vuelva {n}, hacía falta','Miren quién vuelve: {n}. Buena noticia'],
    retL:['¿Vuelve {n}? Bueno, veremos','{n} otra vez por aquí. Sin más'],
  },
};
// temas generales: España (vosotros) o Latinoamérica (ustedes)
var TWG={
  es:{
    styleRep:['{c} {st}s en el mismo cartel, va a ser la liga más monótona','Todo {st}s, ¿en serio? Dadle algo de variedad a {liga}','¿Quién ha hecho este cartel? {c} {st}s… van a ser todas las batallas iguales'],
    styleOk:['Qué cartel más variado: {st1}, {st2}, {st3}… así sí','Buen equilibrio de estilos en {liga} este año, nadie se va a aburrir','Mola que haya de todo en el cartel, cada jornada va a ser distinta'],
    styleMid:['Bastantes {st}s en {liga} este año… a ver si no se hace repetitivo'],
    rep:['{n} lleva {k} años seguidos en {liga}, dejad paso a otros','Otra vez {n}… {k} temporadas seguidas, ya cansa','¿{n} de nuevo? Hay vida más allá de {n}, eh'],
    same:['Prácticamente el mismo cartel que el año pasado, qué pereza','{liga} repitiendo a {c} del año pasado. Renovad un poco'],
    nuevo:['¡Por fin {n} en FMS! Se lo merecía hace tiempo','{n} debuta en FMS, a ver cómo se adapta','Ojo con {n}, que viene con hambre'],
    top:['Cartelazo. Esto es nivel internacional','No hay relleno en este cartel, {liga} viene fuerte','El mejor line up de {liga} que recuerdo'],
    low:['No conozco a la mitad del cartel…','Line up flojito, la verdad. Esperaba más de {liga}','¿Esto es {liga} o una liga under?'],
    meh:['A ver qué tal {n} este año','{n}… bueno, puede dar la sorpresa','Curiosidad por ver a {n} en {liga}'],
    bomb:['BOMBAZO. {n} en {liga}','Nadie se esperaba a {n} y aquí está','Con {n} ya tengo motivo para ver todas las jornadas'],
  },
  la:{
    styleRep:['{c} {st}s en el mismo cartel, va a ser la liga más monótona','Puros {st}s, ¿en serio? Denle algo de variedad a {liga}','¿Quién armó este cartel? {c} {st}s… van a ser todas las batallas iguales'],
    styleOk:['Qué cartel tan variado: {st1}, {st2}, {st3}… así sí','Buen equilibrio de estilos en {liga} este año, nadie se va a aburrir','Me gusta que haya de todo en el cartel, cada jornada va a ser distinta'],
    styleMid:['Bastantes {st}s en {liga} este año… ojalá no se haga repetitivo'],
    rep:['{n} lleva {k} años seguidos en {liga}, denle lugar a otros','Otra vez {n}… {k} temporadas seguidas, ya cansa','¿{n} de nuevo? Hay más gente aparte de {n}'],
    same:['Prácticamente el mismo cartel que el año pasado, qué flojera','{liga} repitiendo a {c} del año pasado. Renueven un poco'],
    nuevo:['¡Por fin {n} en FMS! Se lo merecía hace tiempo','{n} debuta en FMS, a ver cómo se adapta','Ojo con {n}, que viene con hambre'],
    top:['Cartelazo. Esto es nivel internacional','No hay relleno en este cartel, {liga} viene fuerte','El mejor line up de {liga} que recuerdo'],
    low:['No conozco a la mitad del cartel…','Line up flojito, la verdad. Esperaba más de {liga}','¿Esto es {liga} o una liga under?'],
    meh:['A ver qué tal {n} este año','{n}… bueno, puede dar la sorpresa','Curiosidad por ver a {n} en {liga}'],
    bomb:['BOMBAZO. {n} en {liga}','Nadie esperaba a {n} y aquí está','Con {n} ya tengo motivo para ver todas las jornadas'],
  },
};
/* ---- más variaciones de texto ---- */
(function(){
  const X={
    es:{
      fav:['Ya tengo plan para cada jornada: ver a {n}','Lo de {n} en {liga} es una alegría, de verdad','{n} dentro. Este año sí que me engancho','No me lo creo, {n} en el cartel. Temporadón','Que pongan a {n} el primero en el cartel, que se lo ha ganado'],
      hate:['Respeto mucho a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en vez de {n}, la verdad','{n} tiene su público, pero yo no soy de ese grupo','No me disgusta del todo, pero {n} no me llena','Le daré una oportunidad a {n}, aunque de primeras no me convence'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Pues nada, con {n} ahí {liga} no la veo ni de coña','Este año {liga} se queda sin mi visita, con {n} no me apetece'],
      favF:['Me la suda que no sea mi liga, {n} en {liga} me lo veo','Por {n} me hago fan de {liga} este año','Ojo, que está {n} en {liga}. Me la apunto'],
      swap:['Con {f} libre, ¿de verdad traéis a {n}? En fin','Fichajes de fuera los hay mejores: {f} sin ir más lejos. Lo de {n} no lo veo','Si queríais un extranjero, {f}. No hacía falta {n}'],
      ret:['Vuelve {n} y yo vuelvo a ver FMS. Así de simple 🔥','Lo que me alegra ver a {n} otra vez en un cartel'],
      retN:['Buena vuelta la de {n}, aporta experiencia'],
      retL:['Vuelve {n}. Bueno, veremos si sigue en forma'],
      otra:['Este año le echaré un ojo a {liga}, pinta interesante','No suelo seguir {liga}, pero el cartel tiene buena pinta','Curioso el line up de {liga}. A ver qué sale','{liga} viene con cosas interesantes este año','Desde aquí le daré una oportunidad a {liga}'],
    },
    ar:{
      fav:['Ya tengo plan para cada fecha: mirar a {n}','Que esté {n} en {liga} es una alegría, posta','{n} adentro. Este año me engancho seguro','No lo puedo creer, {n} en el cartel. Temporadón','Pongan a {n} primero en el cartel, que se lo ganó'],
      hate:['Respeto mucho a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en vez de {n}, la verdad','{n} tiene su público, pero yo no soy de ese grupo','No me disgusta del todo, pero {n} no me llena','Le voy a dar una chance a {n}, aunque de entrada no me convence'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Con {n} ahí, {liga} no la miro ni en pedo','Este año {liga} sin mí, con {n} no me dan ganas'],
      favF:['No es mi liga, pero con {n} en {liga} la miro igual','Por {n} me hago hincha de {liga} este año','Ojo que está {n} en {liga}. La agendo'],
      swap:['Con {f} libre, ¿en serio traen a {n}? Bueno','Hay mejores de afuera: {f}, sin ir más lejos. Lo de {n} no lo entiendo','Si querían un extranjero, {f}. No hacía falta {n}'],
      ret:['Vuelve {n} y vuelvo a mirar FMS. Así de simple 🔥','Qué alegría ver a {n} otra vez en un cartel'],
      retN:['Buena vuelta la de {n}, suma experiencia'],
      retL:['Vuelve {n}. Bueno, veremos si sigue en forma'],
      otra:['Este año le voy a pegar una mirada a {liga}, pinta bien','No suelo mirar {liga}, pero el cartel está interesante','Curioso el line up de {liga}. A ver qué onda','{liga} viene con cosas interesantes este año','Desde acá le voy a dar una chance a {liga}'],
    },
    mx:{
      fav:['Ya tengo plan para cada jornada: ver a {n}','Que esté {n} en {liga} me da gusto, neta','{n} adentro. Este año sí me engancho','No lo creo, {n} en el cartel. Temporadón','Pongan a {n} hasta arriba del cartel, se lo ganó'],
      hate:['Respeto mucho a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en lugar de {n}, la neta','{n} tiene su público, pero yo no soy de ese grupo','No me disgusta del todo, pero {n} no me llena','Le daré chance a {n}, aunque de entrada no me convence'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Con {n} ahí, {liga} no la veo ni de broma','Este año {liga} sin mí, con {n} no se me antoja'],
      favF:['No es mi liga, pero con {n} en {liga} sí la veo','Por {n} me vuelvo fan de {liga} este año','Aguas que está {n} en {liga}. Me la apunto'],
      swap:['Con {f} libre, ¿neta traen a {n}? Bueno','Hay mejores de fuera: {f}, por ejemplo. Lo de {n} no le entiendo','Si querían un extranjero, {f}. No hacía falta {n}'],
      ret:['Regresa {n} y regreso a ver FMS. Así de fácil 🔥','Qué gusto ver a {n} otra vez en un cartel'],
      retN:['Buen regreso el de {n}, aporta experiencia'],
      retL:['Regresa {n}. Bueno, a ver si sigue en forma'],
      otra:['Este año le echaré un ojo a {liga}, se ve interesante','No suelo ver {liga}, pero el cartel se ve chido','Curioso el line up de {liga}. A ver qué sale','{liga} trae cosas interesantes este año','Desde acá le daré chance a {liga}'],
    },
    cl:{
      fav:['Ya tengo panorama para cada fecha: ver a {n}','Que esté {n} en {liga} me tiene feliz','{n} adentro. Este año me engancho sí o sí','No lo creo, {n} en el cartel. Temporadón po','Pongan a {n} primero en el cartel, se lo ganó'],
      hate:['Respeto harto a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en vez de {n}, la verdad','{n} tiene su público, pero yo no soy de ese grupo','No me disgusta tanto, pero {n} no me llena','Le daré una oportunidad a {n}, aunque de entrada no me tinca'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Con {n} ahí, {liga} no la veo ni cagando','Este año {liga} sin mí, con {n} no me dan ganas'],
      favF:['No es mi liga, pero con {n} en {liga} la veo igual','Por {n} me hago fan de {liga} este año','Ojo que está {n} en {liga}. Me la anoto'],
      swap:['Con {f} libre, ¿en serio traen a {n}? Ya','Hay mejores de afuera: {f}, por ejemplo. Lo de {n} no lo cacho','Si querían un extranjero, {f}. No hacía falta {n}'],
      ret:['Vuelve {n} y vuelvo a ver FMS. Así de simple 🔥','Qué alegría ver a {n} otra vez en un cartel'],
      retN:['Buena vuelta la de {n}, aporta experiencia'],
      retL:['Vuelve {n}. Ya, veamos si sigue en forma'],
      otra:['Este año le pegaré una mirada a {liga}, se ve bacán','No veo mucho {liga}, pero el cartel está interesante','Curioso el line up de {liga}. A ver qué sale','{liga} viene con cosas interesantes este año','Desde acá le daré una oportunidad a {liga}'],
    },
    pe:{
      fav:['Ya tengo plan para cada fecha: ver a {n}','Que esté {n} en {liga} es una alegría, causa','{n} adentro. Este año me engancho sí o sí','No lo creo, {n} en el cartel. Temporadón','Pongan a {n} primero en el cartel, se lo ganó'],
      hate:['Respeto harto a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en vez de {n}, la verdad','{n} tiene su público, pero yo no soy de ese grupo','No me disgusta tanto, pero {n} no me llena','Le daré chance a {n}, aunque de frente no me convence'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Con {n} ahí, {liga} no la veo ni de vainas','Este año {liga} sin mí, con {n} no provoca'],
      favF:['No es mi liga, pero con {n} en {liga} la veo igual','Por {n} me hago fan de {liga} este año','Ojo que está {n} en {liga}. Me la apunto pe'],
      swap:['Con {f} libre, ¿en serio traen a {n}? Ya pe','Hay mejores de afuera: {f}, por ejemplo. Lo de {n} no lo entiendo','Si querían un extranjero, {f}. No hacía falta {n}'],
      ret:['Vuelve {n} y vuelvo a ver FMS. Así de simple 🔥','Qué alegría ver a {n} otra vez en un cartel'],
      retN:['Buena vuelta la de {n}, aporta experiencia'],
      retL:['Vuelve {n}. Ya, a ver si sigue en forma'],
      otra:['Este año le echaré un ojo a {liga}, se ve interesante','No veo mucho {liga}, pero el cartel está chévere','Curioso el line up de {liga}. A ver qué sale','{liga} viene con cosas interesantes este año','Desde acá le daré chance a {liga}'],
    },
    co:{
      fav:['Ya tengo plan para cada fecha: ver a {n}','Que esté {n} en {liga} es una felicidad, parce','{n} adentro. Este año me engancho sí o sí','No lo creo, {n} en el cartel. Temporadón','Pongan a {n} de primero en el cartel, se lo ganó'],
      hate:['Respeto mucho a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en vez de {n}, la verdad','{n} tiene su público, pero yo no soy de ese grupo','No me disgusta tanto, pero {n} no me llena','Le daré la oportunidad a {n}, aunque de entrada no me convence'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Con {n} ahí, {liga} no la veo ni por el chiras','Este año {liga} sin mí, con {n} no me provoca'],
      favF:['No es mi liga, pero con {n} en {liga} la veo igual','Por {n} me vuelvo hincha de {liga} este año','Pilas que está {n} en {liga}. Me la apunto'],
      swap:['Con {f} libre, ¿en serio traen a {n}? Bueno','Hay mejores de afuera: {f}, por ejemplo. Lo de {n} no lo entiendo','Si querían un extranjero, {f}. No hacía falta {n}'],
      ret:['Vuelve {n} y vuelvo a ver FMS. Así de sencillo 🔥','Qué alegría ver a {n} otra vez en un cartel'],
      retN:['Buena vuelta la de {n}, aporta experiencia'],
      retL:['Vuelve {n}. Bueno, a ver si sigue en forma'],
      otra:['Este año le pegaré una mirada a {liga}, se ve bacano','No veo mucho {liga}, pero el cartel está interesante','Curioso el line up de {liga}. A ver qué sale','{liga} viene con cosas interesantes este año','Desde acá le daré la oportunidad a {liga}'],
    },
    car:{
      fav:['Ya tengo plan para cada fecha: ver a {n}','Que esté {n} en {liga} es una alegría, pana','{n} adentro. Este año me engancho seguro','No lo creo, {n} en el cartel. Temporadón','Pongan a {n} de primero en el cartel, se lo ganó'],
      hate:['Respeto mucho a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en vez de {n}, la verdad','{n} tiene su público, pero yo no soy de ese grupo','No me disgusta tanto, pero {n} no me llena','Le daré la oportunidad a {n}, aunque de entrada no me convence'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Con {n} ahí, {liga} no la veo, pana','Este año {liga} sin mí, con {n} no provoca'],
      favF:['No es mi liga, pero con {n} en {liga} la veo igual','Por {n} me vuelvo fan de {liga} este año','Pendiente que está {n} en {liga}. Me la apunto'],
      swap:['Con {f} libre, ¿en serio traen a {n}? Bueno','Hay mejores de afuera: {f}, por ejemplo. Lo de {n} no lo entiendo','Si querían un extranjero, {f}. No hacía falta {n}'],
      ret:['Vuelve {n} y vuelvo a ver FMS. Así de simple 🔥','Qué alegría ver a {n} otra vez en un cartel'],
      retN:['Buena vuelta la de {n}, aporta experiencia'],
      retL:['Vuelve {n}. Bueno, a ver si sigue en forma'],
      otra:['Este año le echaré un ojo a {liga}, se ve brutal','No veo mucho {liga}, pero el cartel está interesante','Curioso el line up de {liga}. A ver qué sale','{liga} viene con cosas interesantes este año','Desde aquí le daré la oportunidad a {liga}'],
    },
    neu:{
      fav:['Ya tengo plan para cada jornada: ver a {n}','Que esté {n} en {liga} es una alegría','{n} dentro. Este año me engancho','No lo puedo creer, {n} en el cartel. Gran temporada','{n} merece estar arriba del cartel'],
      hate:['Respeto mucho a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en lugar de {n}','{n} tiene su público, pero yo no soy parte de él','No me disgusta del todo, pero {n} no me llena','Le daré una oportunidad a {n}, aunque de entrada no me convence'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Con {n} ahí, {liga} no la veré','Este año {liga} sin mí, con {n} no me apetece'],
      favF:['No es mi liga, pero con {n} en {liga} la veré igual','Por {n} me hago seguidor de {liga} este año','Atentos, que está {n} en {liga}. Me la apunto'],
      swap:['Con {f} disponible, ¿de verdad traen a {n}?','Hay mejores opciones de fuera: {f}, por ejemplo. Lo de {n} no lo entiendo','Si querían un extranjero, {f}. No hacía falta {n}'],
      ret:['Vuelve {n} y vuelvo a ver FMS. Así de simple 🔥','Qué alegría ver a {n} otra vez en un cartel'],
      retN:['Buena vuelta la de {n}, aporta experiencia'],
      retL:['Vuelve {n}. Veremos si sigue en forma'],
      otra:['Este año le echaré un ojo a {liga}, pinta interesante','No suelo ver {liga}, pero el cartel tiene buena pinta','Curioso el line up de {liga}. A ver qué sale','{liga} viene con cosas interesantes este año','Le daré una oportunidad a {liga} esta temporada'],
    },
  };
  for(const d in X) for(const c in X[d]) TWD[d][c]=(TWD[d][c]||[]).concat(X[d][c]);
  const Y={
    es:{
      styleRep:['Demasiados {st}s juntos. Va a costar que cada jornada se sienta distinta','{c} {st}s… a la organización le encanta ese estilo, por lo visto'],
      styleOk:['Cartel con estilos para todos los gustos. Bien hecho','Por fin un line up equilibrado: cada batalla va a ser un mundo'],
      rep:['{n}, {k} temporadas seguidas en {liga}. Que se renueve un poco la cosa','Con todo el cariño a {n}, pero {k} años seguidos en {liga} ya son muchos'],
      same:['Cambian dos nombres y lo venden como cartel nuevo','El line up de {liga} es casi un copia y pega del año pasado'],
      nuevo:['Primera vez de {n} en FMS. Ganas de ver qué propone','{n} se estrena en FMS. Le tengo fe','Qué bonito ver a {n} debutar en FMS'],
      top:['Cartel de lujo en {liga}. Va a ser una temporada histórica','Esto parece un Internacional. Enhorabuena a {liga}'],
      low:['Cartel un poco flojo este año. Ojalá den la sorpresa','Le falta algún nombre grande a {liga}, la verdad'],
      meh:['{n} en {liga}. Ni fu ni fa, ya veremos','Tengo curiosidad por cómo le va a {n}','{n} puede ser la sorpresa del año, quién sabe','A {n} no lo conozco mucho, me miraré sus batallas'],
      bomb:['¡¿{n} en {liga}?! Esto no me lo esperaba','Pedazo de fichaje: {n} en {liga}'],
    },
    la:{
      styleRep:['Demasiados {st}s juntos. Va a costar que cada jornada se sienta distinta','{c} {st}s… a la organización le encanta ese estilo, por lo visto'],
      styleOk:['Cartel con estilos para todos los gustos. Bien hecho','Por fin un line up equilibrado: cada batalla va a ser distinta'],
      rep:['{n}, {k} temporadas seguidas en {liga}. Que se renueve un poco la cosa','Con todo el cariño a {n}, pero {k} años seguidos en {liga} ya son muchos'],
      same:['Cambian dos nombres y lo venden como cartel nuevo','El line up de {liga} es casi un copiar y pegar del año pasado'],
      nuevo:['Primera vez de {n} en FMS. Ganas de ver qué propone','{n} se estrena en FMS. Le tengo fe','Qué lindo ver a {n} debutar en FMS'],
      top:['Cartel de lujo en {liga}. Va a ser una temporada histórica','Esto parece un Internacional. Felicitaciones a {liga}'],
      low:['Cartel un poco flojo este año. Ojalá den la sorpresa','Le falta algún nombre grande a {liga}, la verdad'],
      meh:['{n} en {liga}. Ni fu ni fa, ya veremos','Tengo curiosidad por cómo le va a {n}','{n} puede ser la sorpresa del año, quién sabe','A {n} no lo conozco mucho, voy a ver sus batallas'],
      bomb:['¡¿{n} en {liga}?! Esto no me lo esperaba','Tremendo fichaje: {n} en {liga}'],
    },
  };
  for(const d in Y) for(const c in Y[d]) TWG[d][c]=(TWG[d][c]||[]).concat(Y[d][c]);
})();
/* ---- todavía más variaciones ---- */
(function(){
  const Z={
    es:{ fav:['Me ha alegrado el día ver a {n} en {liga}','{n} es motivo suficiente para seguir {liga} entera','Ponedme a {n} todas las jornadas y soy feliz','Hay {n} en el cartel, ya no me pierdo ni una','Lo de {n} en {liga} es un acierto total'],
         hate:['{n} no es santo de mi devoción, pero le deseo suerte','Me habría gustado más otro perfil en lugar de {n}','No es lo que esperaba ver con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa, la verdad'],
         hateF:['Con {n} en {liga} prefiero ver otra cosa','{liga} este año me la salto, {n} no me engancha'],
         favF:['Por {n} me cruzo de liga sin problema','Este año sigo {liga} de reojo, que está {n}'],
         otra:['Le daré un vistazo a {liga} este año','Interesante lo que se viene en {liga}','Desde fuera, {liga} pinta bien'] },
    ar:{ fav:['Me alegró el día ver a {n} en {liga}','{n} es motivo suficiente para seguir {liga} entera','Pónganme a {n} todas las fechas y soy feliz','Está {n} en el cartel, no me pierdo ni una','Lo de {n} en {liga} es un golazo'],
         hate:['{n} no es de mis preferidos, pero le deseo suerte','Me hubiera gustado otro perfil en lugar de {n}','No es lo que esperaba con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa, la verdad'],
         hateF:['Con {n} en {liga} prefiero mirar otra cosa','{liga} este año la salteo, {n} no me engancha'],
         favF:['Por {n} me cruzo de liga sin drama','Este año miro {liga} de reojo, que está {n}'],
         otra:['Le voy a dar una mirada a {liga} este año','Interesante lo que se viene en {liga}','Desde afuera, {liga} pinta bien'] },
    mx:{ fav:['Me alegró el día ver a {n} en {liga}','{n} es razón suficiente para seguir {liga} completita','Pónganme a {n} cada jornada y soy feliz','Está {n} en el cartel, no me pierdo ninguna','Lo de {n} en {liga} es un acierto, neta'],
         hate:['{n} no es de mis favoritos, pero le deseo suerte','Me hubiera gustado otro perfil en lugar de {n}','No es lo que esperaba con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa, la neta'],
         hateF:['Con {n} en {liga} mejor veo otra cosa','{liga} este año me la salto, {n} no me late'],
         favF:['Por {n} me cambio de liga sin problema','Este año sigo {liga} de reojo, que está {n}'],
         otra:['Le daré una checada a {liga} este año','Interesante lo que viene en {liga}','Desde acá, {liga} se ve bien'] },
    cl:{ fav:['Me alegró el día ver a {n} en {liga}','{n} es razón suficiente para seguir {liga} entera','Pónganme a {n} todas las fechas y soy feliz','Está {n} en el cartel, no me pierdo ni una po','Lo de {n} en {liga} es un acierto total'],
         hate:['{n} no es de mis favoritos, pero le deseo suerte','Me hubiera gustado otro perfil en lugar de {n}','No es lo que esperaba con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa'],
         hateF:['Con {n} en {liga} prefiero ver otra cosa','{liga} este año me la salto, {n} no me engancha'],
         favF:['Por {n} me cambio de liga sin drama','Este año veo {liga} de reojo, que está {n}'],
         otra:['Le pegaré una mirada a {liga} este año','Interesante lo que viene en {liga}','Desde acá, {liga} se ve bacán'] },
    pe:{ fav:['Me alegró el día ver a {n} en {liga}','{n} es motivo suficiente para seguir {liga} entera','Pónganme a {n} todas las fechas y soy feliz','Está {n} en el cartel, no me pierdo ni una','Lo de {n} en {liga} es un acierto, causa'],
         hate:['{n} no es de mis favoritos, pero le deseo suerte','Me hubiera gustado otro perfil en lugar de {n}','No es lo que esperaba con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa'],
         hateF:['Con {n} en {liga} prefiero ver otra cosa','{liga} este año me la salto, {n} no me engancha'],
         favF:['Por {n} me cambio de liga sin roche','Este año veo {liga} de reojo, que está {n}'],
         otra:['Le echaré un ojo a {liga} este año','Interesante lo que viene en {liga}','Desde acá, {liga} se ve chévere'] },
    co:{ fav:['Me alegró el día ver a {n} en {liga}','{n} es motivo suficiente para seguir {liga} entera','Pónganme a {n} todas las fechas y quedo feliz','Está {n} en el cartel, no me pierdo ni una','Lo de {n} en {liga} es un acierto, parce'],
         hate:['{n} no es de mis favoritos, pero le deseo suerte','Me hubiera gustado otro perfil en lugar de {n}','No es lo que esperaba con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa'],
         hateF:['Con {n} en {liga} prefiero ver otra cosa','{liga} este año me la salto, {n} no me engancha'],
         favF:['Por {n} me cambio de liga sin problema','Este año veo {liga} de reojo, que está {n}'],
         otra:['Le pegaré una mirada a {liga} este año','Interesante lo que viene en {liga}','Desde acá, {liga} se ve bacano'] },
    car:{ fav:['Me alegró el día ver a {n} en {liga}','{n} es motivo suficiente para seguir {liga} entera','Pónganme a {n} todas las fechas y quedo feliz','Está {n} en el cartel, no me pierdo ni una','Lo de {n} en {liga} es un acierto, pana'],
          hate:['{n} no es de mis favoritos, pero le deseo suerte','Me hubiera gustado otro perfil en lugar de {n}','No es lo que esperaba con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa'],
          hateF:['Con {n} en {liga} prefiero ver otra cosa','{liga} este año me la salto, {n} no me engancha'],
          favF:['Por {n} me cambio de liga sin problema','Este año veo {liga} de reojo, que está {n}'],
          otra:['Le echaré un ojo a {liga} este año','Interesante lo que viene en {liga}','Desde aquí, {liga} se ve brutal'] },
    neu:{ fav:['Me alegró el día ver a {n} en {liga}','{n} es motivo suficiente para seguir {liga} entera','Con {n} cada jornada soy feliz','Está {n} en el cartel, no me pierdo ninguna','Incluir a {n} en {liga} es un acierto total'],
          hate:['{n} no es de mis favoritos, pero le deseo suerte','Me habría gustado otro perfil en lugar de {n}','No es lo que esperaba con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa'],
          hateF:['Con {n} en {liga} prefiero ver otra cosa','{liga} este año no la seguiré, {n} no me engancha'],
          favF:['Por {n} me cambio de liga sin problema','Este año seguiré {liga} de reojo, que está {n}'],
          otra:['Le daré un vistazo a {liga} este año','Interesante lo que viene en {liga}','Desde fuera, {liga} pinta bien'] },
  };
  for(const d in Z) for(const c in Z[d]) TWD[d][c]=(TWD[d][c]||[]).concat(Z[d][c]);
  const Y={
    es:{ meh:['{n} llega con ganas, a ver qué tal le sale','Me genera curiosidad {n}, nada más','{n} en {liga}. Puede dar juego'], nuevo:['Bienvenido a FMS, {n}. A disfrutar','{n} se lo ha currado para llegar aquí'], rep:['¿Otra vez {n}? Que entre sangre nueva','{n} ya es parte del mobiliario de {liga}'],
         top:['Qué barbaridad de cartel en {liga}','Este line up de {liga} da miedo'], low:['Esperaba un cartel con más nombres','Faltan cabezas de cartel en {liga}'], styleOk:['Estilos de todo tipo en {liga}. Así da gusto'], bomb:['Notición: {n} en {liga}'],
         wsLow:['¿{n} en la World Series? Se supone que es la liga de las superestrellas','Con todo el respeto a {n}, pero la World Series debería ser solo para los más grandes','{n} en la World Series no me cuadra. Aquí tienen que estar los top','Esperaba una World Series de lujo y meten a {n}…'] },
    la:{ meh:['{n} llega con ganas, a ver qué tal le va','Me da curiosidad {n}, nada más','{n} en {liga}. Puede dar que hablar'], nuevo:['Bienvenido a FMS, {n}. A disfrutar','{n} se lo trabajó para llegar acá'], rep:['¿Otra vez {n}? Que entre sangre nueva','{n} ya es parte de los muebles de {liga}'],
         top:['Qué locura de cartel en {liga}','Este line up de {liga} da miedo'], low:['Esperaba un cartel con más nombres','Faltan cabezas de cartel en {liga}'], styleOk:['Estilos de todo tipo en {liga}. Así da gusto'], bomb:['Bombazo: {n} en {liga}'],
         wsLow:['¿{n} en la World Series? Se supone que es la liga de las superestrellas','Con todo respeto a {n}, pero la World Series debería ser solo para los más grandes','{n} en la World Series no me cierra. Acá tienen que estar los top','Esperaba una World Series de lujo y meten a {n}…'] },
  };
  for(const d in Y) for(const c in Y[d]) TWG[d][c]=(TWG[d][c]||[]).concat(Y[d][c]);
})();
// cuentas oficiales de cada liga (despiden a quien se va a otra FMS)
function leagueAcc(k){ const d=ldef(k); return {handle:k, name:d.name, country:(d.countries&&d.countries[0])||null, verified:true, img:LOGOS[k]||null}; }
var TW_OFFICIAL={
  es:['Gracias por todo, @{h}. Mucha suerte en {liga} 🙏','Fue un honor tenerte en {prev}, @{h}. Te deseamos lo mejor en {liga}','Las puertas de {prev} siempre estarán abiertas para ti, @{h}. ¡A por todas en {liga}!'],
  la:['Gracias por todo, @{h}. Mucha suerte en {liga} 🙏','Fue un honor tenerte en {prev}, @{h}. Te deseamos lo mejor en {liga}','Las puertas de {prev} siempre van a estar abiertas, @{h}. ¡A romperla en {liga}!'],
  esC:['Nuestro campeón se va a {liga}. Cuidádnoslo bien 🏆','Os llevamos al campeón de {prev}, {liga}. Tratadlo como se merece 🏆','@{h}, campeón de {prev}, empieza una nueva etapa. {liga}, cuidad de nuestro campeón'],
  laC:['Nuestro campeón se va a {liga}. Cuídenlo mucho 🏆','Les mandamos al campeón de {prev}, {liga}. Trátenlo como se merece 🏆','@{h}, campeón de {prev}, empieza una nueva etapa. {liga}, cuiden a nuestro campeón'],
};

(function(){   // más variaciones para la revelación del line up
  const X={ es:{fav:['Ver a {n} en el cartel me ha dado la vida','{n} confirmado en {liga}. Ya puedo dormir tranquilo','Por fin, {n}. Lo estaba pidiendo a gritos'], hate:['{n} no es lo que esperaba para {liga}, pero bueno','No termino de verle a {n} en este cartel'], otra:['Echaré un ojo a {liga} de vez en cuando']},
    ar:{fav:['Ver a {n} en el cartel me alegró el día','{n} confirmado en {liga}. Ya puedo dormir tranquilo','Por fin, {n}. Lo venía pidiendo'], hate:['{n} no es lo que esperaba para {liga}, pero bueno','No lo termino de ver a {n} en este cartel'], otra:['Le voy a pegar una mirada a {liga} de vez en cuando']},
    mx:{fav:['Ver a {n} en el cartel me alegró el día','{n} confirmado en {liga}. Ya puedo dormir tranquilo','Por fin, {n}. Lo andaba pidiendo'], hate:['{n} no es lo que esperaba para {liga}, pero bueno','No lo termino de ver a {n} en este cartel'], otra:['Le daré una checada a {liga} de vez en cuando']},
    cl:{fav:['Ver a {n} en el cartel me alegró el día po','{n} confirmado en {liga}. Bacán'], hate:['{n} no es lo que esperaba para {liga}, pero ya'], otra:['Le pegaré una mirada a {liga} de repente']},
    pe:{fav:['Ver a {n} en el cartel me alegró el día, causa','{n} confirmado en {liga}. Chévere'], hate:['{n} no es lo que esperaba para {liga}, pero ya fue'], otra:['Le echaré un ojo a {liga} de vez en cuando']},
    co:{fav:['Ver a {n} en el cartel me alegró el día, parce','{n} confirmado en {liga}. Bacano'], hate:['{n} no es lo que esperaba para {liga}, pero bueno'], otra:['Le pegaré una mirada a {liga} de vez en cuando']},
    car:{fav:['Ver a {n} en el cartel me alegró el día, pana','{n} confirmado en {liga}. Brutal'], hate:['{n} no es lo que esperaba para {liga}, pero bueno'], otra:['Le echaré un ojo a {liga} de vez en cuando']},
    neu:{fav:['Ver a {n} en el cartel me alegró el día','{n} confirmado en {liga}'], hate:['{n} no es lo que esperaba para {liga}'], otra:['Seguiré {liga} de vez en cuando']} };
  for(const d in X) for(const c in X[d]) TWD[d][c]=(TWD[d][c]||[]).concat(X[d][c]);
  const Y={ es:{meh:['{n} tiene mucho que demostrar este año','Atentos a {n}, puede dar guerra'], top:['Cartel para enmarcar en {liga}'], low:['Le falta chispa al cartel de {liga}'], nuevo:['{n} llega a FMS. Que lo disfrute']},
            la:{meh:['{n} tiene mucho que demostrar este año','Atentos a {n}, puede dar pelea'], top:['Cartel para enmarcar en {liga}'], low:['Le falta chispa al cartel de {liga}'], nuevo:['{n} llega a FMS. Que lo disfrute']} };
  for(const d in Y) for(const c in Y[d]) TWG[d][c]=(TWG[d][c]||[]).concat(Y[d][c]);
})();

(function(){
  const X={ es:{miss:['¿Dónde está {f}? Sin {f} esto no es lo mismo','¿Por qué no habéis metido a {f}? No lo entiendo','Echo muchísimo de menos a {f} en {liga}','Un cartel de {liga} sin {f}… algo falla','{f} fuera de {liga}. Me niego'], missVs:['¿En serio está {n} y no {f}?','Meten a {n} y dejan fuera a {f}. No hay quien lo entienda','{n} dentro y {f} fuera. No lo entiendo, de verdad']},
    ar:{miss:['¿Dónde está {f}? Sin {f} no es lo mismo','¿Por qué no metieron a {f}? No lo entiendo','Lo extraño un montón a {f} en {liga}','Un cartel de {liga} sin {f}… algo anda mal'], missVs:['¿En serio está {n} y no {f}?','Meten a {n} y dejan afuera a {f}. Cualquiera','{n} adentro y {f} afuera. No lo entiendo, posta']},
    mx:{miss:['¿Dónde está {f}? Sin {f} no es lo mismo','¿Por qué no metieron a {f}? No le entiendo','Extraño un buen a {f} en {liga}','Un cartel de {liga} sin {f}… algo anda mal'], missVs:['¿Neta está {n} y no {f}?','Meten a {n} y dejan fuera a {f}. No manches','{n} adentro y {f} afuera. No le entiendo']},
    cl:{miss:['¿Dónde está {f}? Sin {f} no es lo mismo po','¿Por qué no metieron a {f}? No cacho'], missVs:['¿En serio está {n} y no {f}, weón?','{n} adentro y {f} afuera. No cacho']},
    pe:{miss:['¿Dónde está {f}? Sin {f} no es lo mismo, causa','¿Por qué no metieron a {f}? No entiendo'], missVs:['¿En serio está {n} y no {f}?','{n} adentro y {f} afuera. No entiendo, causa']},
    co:{miss:['¿Dónde está {f}? Sin {f} no es lo mismo, parce','¿Por qué no metieron a {f}? No entiendo'], missVs:['¿En serio está {n} y no {f}, parce?','{n} adentro y {f} afuera. No entiendo']},
    car:{miss:['¿Dónde está {f}? Sin {f} no es lo mismo, pana','¿Por qué no metieron a {f}?'], missVs:['¿En serio está {n} y no {f}?','{n} adentro y {f} afuera. No entiendo esa vaina']},
    neu:{miss:['¿Dónde está {f}? Sin {f} no es lo mismo','¿Por qué no incluyeron a {f}?'], missVs:['¿En serio está {n} y no {f}?','{n} dentro y {f} fuera. No lo entiendo']} };
  for(const d in X) for(const c in X[d]) TWD[d][c]=(TWD[d][c]||[]).concat(X[d][c]);
})();
var TW_NEWS = [
  {handle:'McNoticiasFree', name:'McNoticias', country:null, verified:false, img:'tw_mcn', special:'mcn'},
  {handle:'InfoFreestyle2', name:'Info Freestyle', country:null, verified:true, img:'tw_info', special:'info'},
];
var RQ_TRUE=['Navas','Alek','Segrelles','Ander2K','Fabiuki','Ortega','Coloso','Triple R'];   // los RQ de verdad
var RQ_CREW=[...RQ_TRUE,'Chuty','Mr. Ego','Arkano','Bnet','MP','HDR','Mowlihawk','Teorema','Zasko'];   // a todos estos los apoya
var GZ_CREW=['Dani VK','JM Serna','Dima'];   // el Elegido de Gazir
var PATRON_TX={
  quesadaLU:['Mucho éxito a {n} en {liga}. Orgullo 🔥','{n} dentro de {liga}. A por todas 🔥','Qué alegría ver a {n} en el cartel. Va a dar guerra 🔥','{n}, a romperla en {liga} 🔥','Vamos {n}, este año es el tuyo 🔥','Toda la fuerza para {n} esta temporada 🔥'],
  quesadaJ:['Vamos {n}, a por {o} 🔥','Fuerza {n}. Esta jornada es tuya 🔥','{n} contra {o}. Todo mi apoyo 🔥','A muerte con {n} 🔥','Confío en ti, {n}. A por la victoria 🔥'],
  gazirLU:['Orgulloso de ti, @{h}. A comerte {liga}','@{h} en {liga}. Lo que te has currado para llegar aquí. A por todas','Vamos @{h}. Este año es tuyo','@{h}, a demostrar lo que vales. Te quiero ver arriba'],
  gazirJ:['A por todas, @{h}. Contra {o} toca ganar','Vamos @{h}, hoy toca darlo todo','Confío en ti, @{h}. A por {o}','@{h}, sal a disfrutar y a ganar'],
  quesadaBoth:['Batalla de RQs 🔥','Batalla de RQs 🔥 {a} vs {b}, gane quien gane, gano yo','{a} vs {b}. Batalla de RQs 🔥🔥','Hoy hay batalla de RQs: {a} contra {b} 🔥'],
  gazirBoth:['Mis dos chavales, batallón del Elegido. @{a} vs @{b}','@{a} contra @{b}. Mis dos chavales cara a cara: batallón del Elegido asegurado','Batallón del Elegido: @{a} vs @{b}. Que gane el mejor, os quiero a los dos'],
  gazirCH:['¡Mi chaval! @{h} {cw} de {liga}. Orgullo máximo 🏆','Lo sabía. @{h} campeón de {liga}. Te lo mereces todo 🏆','Qué orgullo, @{h}. {cw} de {liga} 🏆'],
};
var TW_COLOR={'España':'#E67E22','Argentina':'#00B8D4','Chile':'#1A3FA0','Perú':'#E53935','México':'#2E7D32','Colombia':'#FFC107','Uruguay':'#8EC5F5','Bolivia':'#7CB342','Ecuador':'#F9A825','Paraguay':'#C62828','EEUU':'#7E57C2'};
function twColor(c){ if(!c) return '#ffffff'; if(TW_COLOR[c]) return TW_COLOR[c]; const car=LEAGUES.find(l=>l.key==='fms_caribe'); return car && car.countries.includes(c) ? '#00A8A2' : '#9a9aa6'; }
var FLAG_ISO={'España':'ES','Argentina':'AR','México':'MX','Chile':'CL','Perú':'PE','Colombia':'CO','Venezuela':'VE','Cuba':'CU','Puerto Rico':'PR','República Dominicana':'DO','Panamá':'PA','Costa Rica':'CR','Guatemala':'GT','Honduras':'HN','El Salvador':'SV','Nicaragua':'NI','EEUU':'US','Uruguay':'UY','Bolivia':'BO','Ecuador':'EC','Paraguay':'PY','Brasil':'BR','Francia':'FR','Italia':'IT','Portugal':'PT'};
function flagOf(c){ const iso=FLAG_ISO[c]; if(!iso) return '🌎'; return String.fromCodePoint(...[...iso].map(ch=>0x1F1E6+ch.charCodeAt(0)-65)); }
function leagueFlag(k){ if(k===INTL.key || isWS(k)) return '🌎'; if(k==='fms_caribe') return '🌴'; const d=ldef(k); return flagOf(d.countries[0]); }
function twHandle(name){ return nrm(name).replace(/[^a-z0-9_]/g,''); }
// emojis como imagen (se ven igual en PC y sin internet): banderas y fuego
function emoHtml(html){
  return html.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, m=>{ const iso=[...m].map(c=>String.fromCharCode(c.codePointAt(0)-0x1F1E6+65)).join(''); const im=EXTRA_IMG['emo_'+iso];
      return im ? `<img class="emo" src="${im}" alt="${iso}">` : `<span class="emo-code">${iso}</span>`; })
    .replace(/🆚/gu, ()=> EXTRA_IMG.emo_vs ? `<img class="emo" src="${EXTRA_IMG.emo_vs}" alt="vs">` : 'vs')
    .replace(/🏆/gu, ()=> EXTRA_IMG.emo_trophy ? `<img class="emo" src="${EXTRA_IMG.emo_trophy}" alt="trofeo">` : '🏆')
    .replace(/🔥/gu, ()=> EXTRA_IMG.emo_fire ? `<img class="emo" src="${EXTRA_IMG.emo_fire}" alt="fuego">` : '🔥');
}
function twAcc(t){ return {...t, img: t.img==='@quesada' ? (STREAMERS.quesada && STREAMERS.quesada.photo) : (t.img ? (EXTRA_IMG[t.img]||t.img) : null)}; }
var TW_GO={
  es:['Este año voy a por todas. Nos vemos en {liga} 🔥','Preparado para {liga}. Esta temporada no se me escapa','Vengo a ganarlo todo, tío. A muerte con esto','Qué ganas de volver a pisar el escenario. A darlo todo en {liga}'],
  ar:['Vamos con todo esta temporada, loco. {liga}, prepárense','Este año la rompo, ni lo duden','Re manija de arrancar {liga}. Vamos por todo','Se viene una temporada zarpada. A dejar todo en el escenario'],
  mx:['Este año va con todo, carnal. {liga}, nos vemos','Qué chido estar en {liga}. A darle con todo','Vamos a romperla esta temporada, no hay de otra','Bien emocionado por {liga}, ahí nos vemos, raza'],
  cl:['Este año voy con too, weón. Se viene {liga}','Bacán estar en {liga}. A darlo todo po','Se viene la temporada, vamos con todo, cachai'],
  pe:['Este año voy con todo, causa. Se viene {liga}','Chévere estar en {liga}. A romperla pe'],
  co:['Qué chimba estar en {liga}, parce. Vamos con toda','Este año va con toda, parcero. Nos vemos en {liga}'],
  car:['Brutal estar en {liga}. Vamos con todo, pana','Este año vengo con todo. Nos vemos en {liga}'],
  neu:['Listo para {liga}. Vamos con todo esta temporada','A darlo todo este año en {liga}','Agradecido de estar en {liga}. Vamos por el título'],
};
(function(){
  const G2={es:['Nueva temporada, nuevas ganas. A por {liga}','Toca demostrar por qué estoy aquí. Nos vemos en {liga}'],ar:['Nueva temporada, mismas ganas de siempre. Vamos {liga}','A demostrar por qué estoy acá. Nos vemos en {liga}'],mx:['Nueva temporada, las mismas ganas. Vamos {liga}','A demostrar por qué estoy aquí, raza. Nos vemos en {liga}'],cl:['Nueva temporada, las mismas ganas. Vamos {liga}','A demostrar por qué estoy acá po'],pe:['Nueva temporada, mismas ganas. Vamos {liga}','A demostrar por qué estoy acá, causa'],co:['Nueva temporada, las mismas ganas. Vamos {liga}','A demostrar por qué estoy acá, parce'],car:['Nueva temporada, las mismas ganas. Vamos {liga}','A demostrar por qué estoy aquí, pana'],neu:['Nueva temporada, nuevas metas. Vamos {liga}','A demostrar por qué estoy aquí']};
  for(const d in G2) TW_GO[d]=(TW_GO[d]||[]).concat(G2[d]);
})();
var TW_LUCK={   // 10 variantes: 0-5 compañeros de la liga anterior, 6-9 bienvenida desde el nuevo line up
  es:['Mucha suerte en {liga}, @{h}. Se te va a echar de menos en {prev}','A romperla en {liga}, hermano. Ha sido un placer compartir temporada contigo','{n} se va a {liga} y se lleva todo su nivel. Suerte, máquina','Suerte en la nueva etapa, @{h}. Allí también vas a dejar huella','Que te vaya muy bien en {liga}, crack. Nos vemos en el Internacional','Gran compañero en {prev}. Ahora a demostrarlo en {liga}. ¡Suerte!',
      'Bienvenido a {liga}, @{h}. Va a ser un placer compartir cartel contigo','Qué nivel suma {liga} con {n}. Bienvenido, hermano','¡Bienvenido, @{h}! Nos vemos en el escenario','Llega {n} a {liga}. Bienvenido, aunque en la tarima no habrá amistad'],
  la:['Mucha suerte en {liga}, @{h}. Te vamos a extrañar en {prev}','A romperla en {liga}, hermano. Fue un placer compartir temporada con vos','{n} se va a {liga} y se lleva todo su nivel. Suerte, crack','Suerte en la nueva etapa, @{h}. Allá también vas a dejar huella','Que te vaya muy bien en {liga}. Nos vemos en el Internacional','Gran compañero en {prev}. Ahora a demostrarlo en {liga}. ¡Suerte!',
      'Bienvenido a {liga}, @{h}. Va a ser un placer compartir cartel','Qué nivel suma {liga} con {n}. Bienvenido, hermano','¡Bienvenido, @{h}! Nos vemos en el escenario','Llega {n} a {liga}. Bienvenido, aunque en la tarima no hay amistad'],
};
function luPrevLeague(s, id, k){ const o=state.seasons[state.seasons.length-2]; if(!o) return null;
  if(isWS(k) || k===INTL.key) return null; const k2=(o.activeKeys||[]).find(x=>x!==k && !isWS(x) && o.leagues[x] && (o.leagues[x].competitors||[]).includes(id)); return k2? {k:k2, mates:o.leagues[k2].competitors.filter(x=>x!==id)} : null; }
function luSeasonsOut(id){   // temporadas seguidas fuera de cualquier FMS antes de la actual (null si nunca estuvo)
  const S=state.seasons; for(let i=S.length-2;i>=0;i--){ const o=S[i]; if((o.activeKeys||[]).some(k=>o.leagues[k] && (o.leagues[k].competitors||[]).includes(id))) return S.length-2-i; } return null; }
function luGenerate(s, k){
  const isI=k===INTL.key; const L=isI? s.intl : s.leagues[k]; const ids=isI? intlQualifiers(s).ids.slice() : L.competitors.slice(); const liga=ldef(k).name;
  const order=shuffle(ids).sort((a,b)=>fby(a).fama-fby(b).fama);   // de menos a más famoso: el bombazo al final
  const at=id=>order.indexOf(id); const END=order.length;
  const real=TWITTEROS.filter(t=>!t.special).map(twAcc);
  const accs=shuffle(real); const inLU={}; ids.forEach(id=>inLU[nrm(fname(id))]=id);
  const lc = (isI || isWS(k)) ? null : ldef(k).countries;
  const isLocal=a=> !lc || (a.country && lc.includes(a.country));
  const tw=[]; const add=(acc, text, sent, a, extra)=>{ tw.push(Object.assign({h:acc.handle, n:acc.name, c:acc.country||null, v:!!acc.verified, img:acc.img||null, text, sent, at:a, likes:Math.round(Math.pow(Math.random(),2)*4000)+rint(3,60), rts:rint(0,400), cm:rint(0,90)}, extra||{})); return tw[tw.length-1]; };
  const asComp=id=>{ const f=fby(id); return {handle:twHandle(f.name), name:f.name, country:f.country, verified:true, img:photoOf(f)}; };
  const fill=(t,o)=>t.replace(/\{(\w+)\}/g,(m,x)=>o[x]!=null?o[x]:m);
  const usedT=new Set(); const pk=list=>{ const f=list.filter(x=>!usedT.has(x)); const t=pick(f.length?f:list); usedT.add(t); return t; };
  const D=(a,cat)=>{ const d=TWD[twDia(a.country)]||TWD.neu; return pk(d[cat]||TWD.neu[cat]); };
  const G=(a,cat)=>pk(TWG[twDia(a&&a.country)==='es'?'es':'la'][cat]);
  const fans={}; real.forEach(a=>(a.fav||[]).forEach(n=>{ const id=inLU[nrm(n)]; if(id) fans[id]=(fans[id]||0)+1; }));
  const cap=id=>{ const n=fans[id]||0; return n>=10?5:(n>=7?4:(n>=4?3:(n>=2?2:1))); };
  const per={}; const used=new Set();
  const back=new Set(state.seasons.length>1 ? ids.filter(id=>{ const o=luSeasonsOut(id); return o!=null && o>2; }) : []);
  // 1) tuiteros: sobre todo su liga; en otras, si entran sus favoritos o los que no les gustan
  const personal=[], otras=[];
  accs.forEach(a=>{
    const fv=(a.fav||[]).map(n=>inLU[nrm(n)]).filter(Boolean), ht=(a.hate||[]).map(n=>inLU[nrm(n)]).filter(Boolean);
    const local=isLocal(a), neutral=!a.country; const opts=[];
    if(!fv.length && !ht.length){ if(!local && Math.random()<(neutral?0.07:0.05)) otras.push(a); return; }
    fv.forEach(id=>{ if(back.has(id)) opts.push({cat:'ret', id, sent:2, w:5}); else opts.push({cat: local||neutral ? 'fav' : 'favF', id, sent:1, w:1}); });
    ht.forEach(id=>{ const f=fby(id);
      if(local && lc && !lc.includes(f.country)){ const alt=(a.fav||[]).filter(n=>!inLU[nrm(n)] && state.freestylers.some(x=>nrm(x.name)===nrm(n))); if(alt.length){ opts.push({cat:'swap', id, alt:pick(alt), sent:-1, w:1.3}); return; } }
      opts.push({cat: local||neutral ? 'hate' : 'hateF', id, sent:-1, w:1}); });
    const p = opts.some(o=>o.cat==='ret') ? 1 : (local ? 1 : (neutral ? 0.6 : 0.45)); if(Math.random()>p) return;
    const ok=opts.filter(o=>(per[o.id]||0)<cap(o.id) || o.cat==='ret'); if(!ok.length) return;
    let r=Math.random()*ok.reduce((x,o)=>x+o.w,0), o=ok[0]; for(const c of ok){ r-=c.w; if(r<=0){ o=c; break; } }
    per[o.id]=(per[o.id]||0)+1; personal.push({a, o});
  });
  const rets=personal.filter(x=>x.o.cat==='ret').slice(0,4), rest=shuffle(personal.filter(x=>x.o.cat!=='ret')).sort((x,y)=>isLocal(y.a)-isLocal(x.a)).slice(0,12);
  [...rets, ...rest].forEach(({a,o})=>{ used.add(a.handle); add(a, fill(D(a,o.cat),{n:fname(o.id), liga, f:o.alt}), o.sent, at(o.id), {fid:o.id}); });
  const free=(pref)=>{ const pool=accs.filter(x=>!used.has(x.handle)); const loc=pool.filter(isLocal); const a=(pref!==false && loc.length && Math.random()<0.8 ? pick(loc) : pick(pool.length?pool:accs)); used.add(a.handle); return a; };
  // extranjeros sin favoritos en el cartel: a veces también opinan
  shuffle(otras).filter(a=>!used.has(a.handle)).slice(0,2).forEach(a=>{ used.add(a.handle); add(a, fill(D(a,'otra'),{liga}), 0, END); });
  // vuelve tras más de 2 temporadas fuera y nadie es fan: alegría y algo de indiferencia
  back.forEach(id=>{ if(tw.some(t=>t.fid===id)) return; { const a=free(); add(a, fill(D(a,'retN'),{n:fname(id),liga}), 1, at(id), {fid:id}); } if(Math.random()<0.6){ const a=free(); add(a, fill(D(a,'retL'),{n:fname(id),liga}), 0, at(id)); } });
  // ¿dónde está mi favorito? (favoritos de su país que no están en su liga nacional)
  if(lc){ let nm=0; const signedNow=new Set(s.activeKeys.flatMap(x=>(s.leagues[x]&&s.leagues[x].competitors)||[]));
    accs.filter(a=>isLocal(a) && !used.has(a.handle)).forEach(a=>{ if(nm>=3) return;
      const miss=(a.fav||[]).map(n=>state.freestylers.find(z=>nrm(z.name)===nrm(n))).filter(z=>z && lc.includes(z.country) && !inLU[nrm(z.name)] && !signedNow.has(z.id));
      if(!miss.length || Math.random()>0.45) return; const f=pick(miss); const ht=(a.hate||[]).map(n=>inLU[nrm(n)]).filter(Boolean);
      used.add(a.handle); nm++;
      if(ht.length && Math.random()<0.6){ const id=pick(ht); add(a, fill(D(a,'missVs'),{n:fname(id), f:f.name, liga}), -1, at(id)); }
      else add(a, fill(D(a,'miss'),{f:f.name, liga}), -1, END); }); }
  // Internacional: polémica con los locales que no gustan
  if(isI && s.intl.sede){ let ni=0; const sd=s.intl.sede;
    accs.filter(a=>!used.has(a.handle)).forEach(a=>{ if(ni>=3) return; const loc=(a.hate||[]).map(n=>inLU[nrm(n)]).filter(id=>id && fby(id).country===sd);
      if(!loc.length || Math.random()>0.7) return; const id=pick(loc); used.add(a.handle); ni++;
      add(a, fill(pk(TWI[twDia(a.country)==='es'?'es':'la'].luLocal),{n:fname(id), sede:sd}), -1, at(id), {fid:id}); }); }
  // 2) Rodrigo Quesada
  const sv=styleVariety(ids);
  { const Q=TWITTEROS.find(t=>t.special==='quesada');
    if(Q){ const q=twAcc(Q); const crew=ids.filter(id=>RQ_CREW.some(n=>nrm(n)===nrm(fname(id))));
      crew.forEach(id=>add(q, fill(pk(PATRON_TX.quesadaLU),{n:fname(id),liga}), 1, at(id), {fid:id}));
      if(sv.n>=6 && !sv.rep.length) add(q, fill(pick(['Esto es un cartel variado 🔥','Variedad de estilos en {liga}. Así sí 🔥','Hay de todo en este line up. Me gusta 🔥🔥']),{liga}), 1, END); } }
  // Gazir anima a los suyos
  { const gz=state.freestylers.find(f=>f.name==='Gazir'); if(gz){ const ga={handle:'gazir', name:'Gazir', country:gz.country, verified:true, img:photoOf(gz)};
      ids.filter(id=>GZ_CREW.some(n=>nrm(n)===nrm(fname(id)))).forEach(id=>add(ga, fill(pk(PATRON_TX.gazirLU),{h:twHandle(fname(id)), liga}), 1, at(id), {fid:id})); } }
  // 3) competidores: 2-3 tuits (bienvenidas a fichajes de otra liga o "voy a por todo")
  if(!isI){ let budget=rint(2,3);
    const moved=shuffle(ids.map(id=>({id, p:luPrevLeague(s,id,k)})).filter(x=>x.p));
    moved.slice(0,2).forEach(mv=>{ const f=fby(mv.id); const pk=mv.p.k, prev=ldef(pk).name; const acc=leagueAcc(pk); const es=twDia(acc.country)==='es';
      const o=state.seasons[state.seasons.length-2]; const champ=o && o.leagues[pk] && (o.leagues[pk].finalStandings||[])[0]===mv.id;
      add(acc, fill(pick(TW_OFFICIAL[(es?'es':'la')+(champ?'C':'')]),{liga, prev, n:f.name, h:twHandle(f.name)}), champ?1:0, at(mv.id)); });
    if(moved.length){ const mv=moved[0]; const f=fby(mv.id); const prev=ldef(mv.p.k).name;
      const mates=shuffle(mv.p.mates.filter(x=>fby(x) && !isRival(x,mv.id))).map(x=>({id:x, nw:false}));
      const now=shuffle(ids.filter(x=>x!==mv.id && !isRival(x,mv.id))).map(x=>({id:x, nw:true}));
      const senders=[]; while(senders.length<budget && (mates.length||now.length)){ const useNow = !mates.length || (now.length && !senders.some(x=>x.nw) && Math.random()<0.4); senders.push(useNow?now.shift():mates.shift()); }
      senders.forEach(x=>{ const vi = x.nw ? rint(6,9) : rint(0,5); const set=TW_LUCK[twDia(fby(x.id).country)==='es'?'es':'la']; add(asComp(x.id), fill(set[vi],{liga, prev, n:f.name, h:twHandle(f.name)}), 0, at(mv.id)); });
      budget=0; }
    shuffle(ids).slice(0,budget).forEach(id=>{ const f=fby(id); add(asComp(id), fill(pk(TW_GO[twDia(f.country)]||TW_GO.neu),{liga}), 0, at(id)); }); }
  // World Series: liga de superestrellas, se quejan si entra alguien con poca fama
  if(isWS(k)) shuffle(ids.filter(id=>fby(id).fama<76)).slice(0,2).forEach(id=>{ const a=free(false); add(a, fill(G(a,'wsLow'),{n:fname(id),liga}), -1, at(id), {fid:id}); });
  // 4) temas generales: los comenta gente de la liga
  if(sv.rep.length) sv.rep.forEach(st=>{ const a=free(); add(a, fill(G(a,'styleRep'),{c:sv.counts[st],st,liga}), -2, END); });
  else if(sv.n>=6){ const sts=shuffle(Object.keys(sv.counts)); const a=free(); add(a, fill(G(a,'styleOk'),{st1:sts[0],st2:sts[1],st3:sts[2],liga}), 1, END); }
  else if(sv.max>=3){ const st=Object.keys(sv.counts).find(x=>sv.counts[x]===sv.max); const a=free(); add(a, fill(G(a,'styleMid'),{st,liga}), 0, END); }
  const reps=ids.map(id=>({id, k:luStreak(s,k,id)+1})).filter(x=>x.k>=3).sort((a,b)=>b.k-a.k);
  reps.slice(0,3).forEach(x=>{ const a=free(); add(a, fill(G(a,'rep'),{n:fname(x.id),k:x.k,liga}), -1, at(x.id)); });
  const lastYear=ids.filter(id=>luStreak(s,k,id)>=1).length;
  if(lastYear>=6){ const a=free(); add(a, fill(G(a,'same'),{c:lastYear,liga}), -2, END); }
  const nuevos=state.seasons.length>1 ? ids.filter(id=>!luEverIn(s,id)) : [];
  shuffle(nuevos).slice(0,2).forEach(id=>{ const a=free(); add(a, fill(G(a,'nuevo'),{n:fname(id),liga}), 1, at(id)); });
  const af=avgFama(ids);
  { const big=order.slice().reverse().filter(id=>fby(id).fama>=86 && !tw.some(t=>t.fid===id)); if(big.length){ const id=big[0]; const a=free(); add(a, fill(G(a,'bomb'),{n:fname(id),liga}), 1, at(id), {fid:id}); } }
  const quiet=shuffle(order.filter(id=>!tw.some(t=>t.fid===id)));
  while(tw.length<12 && quiet.length){ const id=quiet.shift(); if(fby(id).fama>=80) continue; const a=free(); add(a, fill(G(a,'meh'),{n:fname(id),liga}), 0, at(id)); }
  if(af>=78){ const a=free(); add(a, fill(G(a,'top'),{liga}), 2, END); } else if(af<58){ const a=free(); add(a, fill(G(a,'low'),{liga}), -1, END); }
  // 5) cuenta de noticias con el cartel completo (McNoticias o Info Freestyle, nunca las dos)
  { const nw=TW_NEWS[Math.random()<0.5?0:1]; const acc={...nw, img:EXTRA_IMG[nw.img]||null}; const lf=leagueFlag(k); const dname=liga.toUpperCase();
    const local=id=> !isI && !isWS(k) && ldef(k).countries.includes(fby(id).country);
    const tag=nrm(liga.replace(/^FMS\s*/i,'')).replace(/[^a-z0-9]/g,'');
    let text;
    if(nw.special==='mcn') text=`🚨 ${dname} ${s.year} ${lf} 🚨\n\n${shuffle(ids).map(id=>`${flagOf(fby(id).country)} ${fname(id).toUpperCase()}`).join('\n')}\n\n#fms${tag}${isI?'':' #fmsinternacional'}`;
    else { const T2=x=>x.charAt(0).toUpperCase()+x.slice(1); text=`¡Temporada ${s.year} - ${liga} ${lf}!\n\n${shuffle(ids).map(id=>`- ${nrm(fname(id)).toUpperCase()}${local(id)?'':' '+flagOf(fby(id).country)}`).join('\n')}\n\n#FMS${T2(tag)} ${lf}`; }
    add(acc, text, 0, END+1, {news:true}); }
  tw.sort((a,b)=>a.at-b.at || Math.random()-0.5);
  // efecto: hype de la liga y de los mencionados
  const S=tw.reduce((a,t)=>a+t.sent,0); const delta=clamp(Math.round(S*1.5),-12,12);
  if(!isI) L.hype=clamp(L.hype+delta,5,100);
  tw.forEach(t=>{ if(t.fid) addHype(t.fid, t.sent>0?1.5:-1.5); });
  reps.forEach(x=>addHype(x.id,-1));
  L.lu={order, tweets:tw, delta, shown:false};
  addLog(s, s.day, `📣 Revelación del line up de ${liga}: ${delta>0?'la comunidad lo celebra':(delta<0?'la comunidad se queja':'opiniones divididas')} (${isI?(delta>=0?'+':'')+delta+'% de visitas':(delta>=0?'+':'')+delta+' de hype'}).`, delta>0?'good':(delta<0?'bad':''));
}
var TW_ICON={
  ver:'<svg class="tw-ver" viewBox="0 0 24 24" aria-label="Verificado"><path fill="#1d9bf0" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"/><path fill="#fff" d="M10.54 16.2 6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36z"/></svg>',
  cm:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M1.75 10c0-4.42 3.58-8 8-8h4.37c4.42 0 8.13 3.58 8.13 8 0 4.42-3.58 8-8 8H14l-5.5 3.5V18h-.88c-3.6 0-5.87-3.3-5.87-8zm8-6c-3.31 0-6 2.69-6 6 0 3.03 1.78 6 3.88 6h2.37v1.82L13.4 16h.85c3.31 0 6-2.69 6-6s-2.79-6-6.13-6z"/></svg>',
  rt:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4.5 3.88l4.43 4.14-1.36 1.46L5.5 7.55V16c0 1.1.9 2 2 2H13v2H7.5c-2.21 0-4-1.79-4-4V7.55L1.43 9.48.07 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.21 0 4 1.79 4 4v8.45l2.07-1.93 1.36 1.46-4.43 4.14-4.43-4.14 1.36-1.46 2.07 1.93V8c0-1.1-.9-2-2-2z"/></svg>',
  lk:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16.7 3.5c-1.8 0-3.5.9-4.7 2.4C10.8 4.4 9.1 3.5 7.3 3.5 4 3.5 1.75 6 1.75 9.2c0 5.5 7.7 10.4 10.25 11.8 2.55-1.4 10.25-6.3 10.25-11.8C22.25 6 20 3.5 16.7 3.5zm-4.7 15.2C9.3 17.1 3.75 13.2 3.75 9.2 3.75 7.1 5.2 5.5 7.3 5.5c1.5 0 2.9 1 3.6 2.4h2.2c.7-1.4 2.1-2.4 3.6-2.4 2.1 0 3.55 1.6 3.55 3.7 0 4-5.55 7.9-8.25 9.5z"/></svg>',
};
function twImgFor(t){ if(t.img) return t.img;
  const a=TWITTEROS.find(x=>x.handle===t.h); if(a) return twAcc(a).img; const n=TW_NEWS.find(x=>x.handle===t.h); if(n) return EXTRA_IMG[n.img]||null;
  if(LOGOS[t.h]) return LOGOS[t.h]; const f=state.freestylers.find(x=>twHandle(x.name)===t.h); return f ? photoOf(f) : null; }
function luTweetHtml(t){
  t.img=twImgFor(t);
  const av = t.img ? `<img src="${t.img}" alt="">` : esc((t.n||t.h)[0].toUpperCase());
  const hue=[...t.h].reduce((a,c)=>a+c.charCodeAt(0),0)%360;
  const txt=esc(t.text).replace(/(^|\s)(@[A-Za-z0-9_]+)/g,'$1<span class="tw-at">$2</span>').replace(/(^|\s)(#[A-Za-z0-9_]+)/g,'$1<span class="tw-at">$2</span>');
  const txtE=emoHtml(txt), nmE=emoHtml(esc(t.n));
  return `<div class="tw" style="--twc:${twColor(t.c)}"><div class="tw-av" style="background:hsl(${hue} 45% 38%)">${av}</div><div class="tw-body">
    <div class="tw-head"><b>${nmE}</b>${t.v?TW_ICON.ver:''}<span>@${esc(t.h)} · ${(t.min||(t.min=rint(1,59)))} min</span></div><div class="tw-txt">${txtE}</div>
    <div class="tw-foot"><span>${TW_ICON.cm} ${t.cm!=null?t.cm:rint(0,90)}</span><span>${TW_ICON.rt} ${t.rts}</span><span>${TW_ICON.lk} ${t.likes.toLocaleString('es-ES')}</span></div></div></div>`;
}

var LU_ANIM=null;
function openLineup(key){
  const s=cur(); const isI=key===INTL.key; const L=isI? s.intl : s.leagues[key]; if(!L || !L.lu) return; document.body.classList.add('noscroll'); const lu=L.lu; const replay=lu.shown; lu.shown=true; save();
  const def=ldef(key); const tok={}; LU_ANIM=tok;
  const cards=lu.order.map((id,i)=>{ const f=fby(id); return `<div class="lu-card" id="luc${i}"><div class="lu-ph" style="${avatarDivStyle(f)}">${avatarContent(f)}</div><div class="lu-nm">${fnameH(id)}</div><div class="lu-mt"><span>${esc(f.country)}</span>${styleTag(f)}</div></div>`; }).join('');
  openModal(`<h3 class="lu-title">${leagueHeadLogo(key)} Line up · ${esc(def.name)} ${s.year}</h3>
    <div class="lu-wrap"><div class="lu-grid ${lu.order.length>10?'c4':''}">${cards}</div>
      <div class="lu-x"><div class="lu-xhead"><span class="lu-xlogo">𝕏</span> Tendencias · <b>#${esc(def.short||def.name).replace(/\s+/g,'')}LineUp</b></div><div class="lu-feed" id="luFeed"></div></div></div>
    <div class="lu-res" id="luRes"></div>
    <div class="modal-actions"><button class="btn" id="luSkip" onclick="luSkip()">Revelar todo</button><button class="btn primary" onclick="LU_ANIM=null; closeModal(); render()">Seguir</button></div>`, 'lineup');
  themeEl(document.getElementById('modalRoot'), key);
  const feed=document.getElementById('luFeed');
  const showTw=i=>{ const t=lu.tweets[i]; if(!t || !feed) return; feed.insertAdjacentHTML('afterbegin', luTweetHtml(t)); };
  let ti=0; const step=(i)=>{ if(LU_ANIM!==tok) return;
    if(i<lu.order.length){ const c=document.getElementById('luc'+i); if(c) c.classList.add('on');
      let k=0; while(ti<lu.tweets.length && lu.tweets[ti].at<=i){ const idx=ti++; setTimeout(()=>{ if(LU_ANIM===tok) showTw(idx); }, 350+k*420); k++; }
      setTimeout(()=>step(i+1), 650+k*420); }
    else { let k=0; while(ti<lu.tweets.length){ const idx=ti++; setTimeout(()=>{ if(LU_ANIM===tok) showTw(idx); }, 300+k*450); k++; }
      setTimeout(()=>{ if(LU_ANIM===tok) luResult(lu, isI); }, 500+k*450); } };
  window.luSkip=()=>{ LU_ANIM=null; lu.order.forEach((id,i)=>{ const c=document.getElementById('luc'+i); if(c) c.classList.add('on'); });
    if(feed){ feed.innerHTML=''; lu.tweets.forEach((t,i)=>showTw(i)); } luResult(lu, isI); };
  if(replay) window.luSkip(); else setTimeout(()=>step(0), 400);
}
function luResult(lu, isI){
  const r=document.getElementById('luRes'); if(!r) return; const d=lu.delta;
  r.innerHTML=emoHtml(`<span class="lu-verdict ${d>0?'pos':(d<0?'neg':'')}">${d>=6?'🔥 La comunidad está encantada':(d>0?'👍 Buena acogida':(d===0?'🤷 Opiniones divididas':(d>-6?'👎 Hay quejas':'💢 La comunidad está indignada')))}</span> ${isI?'Visitas del Internacional':'Hype de la liga'} <b>${d>=0?'+':''}${d}${isI?'%':''}</b>`);
  const b=document.getElementById('luSkip'); if(b) b.disabled=true;
}

/* ---- tutorial tras la primera competición Under ---- */
function underTutQueue(key, winners){
  const c=state.company; if(!c) return; if(!c.tut) c.tut={}; if(c.tut.under) return;
  c.tut.under=true; state.ui.tutQ={t:'under', key, ids:winners.slice()};
}
function tutTick(){
  const q=state.ui && state.ui.tutQ; if(!q) return;
  setTimeout(()=>{ const q=state.ui.tutQ; if(!q) return;
    const mr=document.getElementById('modalRoot'), rs=document.getElementById('rbShow'), ce=document.getElementById('celeb');
    if((mr && mr.innerHTML) || (rs && rs.innerHTML) || (ce && ce.innerHTML) || (typeof SHOW!=='undefined' && SHOW)) return;
    state.ui.tutQ=null; showUnderTut(q); }, 250);
}
function showUnderTut(q){
  const s=cur(); const def=udef(q.key);
  const signed=new Set(s.activeKeys.flatMap(k=>s.leagues[k].competitors||[]));
  const people=q.ids.map(id=>`<span class="un-p">${miniAvatar(id,26)} ${fnameH(id)}${signed.has(id)?' <small>(ya en FMS)</small>':''}</span>`).join('');
  const one=q.ids.length===1;
  openModal(`<div class="tut"><div class="tut-icon">${ulogo(q.key)?`<img class="un-logo" style="height:54px" src="${ulogo(q.key)}" alt="">`:'🟢'}</div>
    <h3>Ha subido el hype ${one?'del campeón':'de los ganadores'} de ${esc(def.name)}</h3>
    <div class="un-people" style="justify-content:center;margin:10px 0;">${people}</div>
    <p>Las competiciones Under son el escaparate de la escena: quien gana gana hype y la gente empieza a pedirle.</p>
    <p>Prueba a hacer una <b>exhibición</b> con ${one?'él':'los ganadores'} si no ${one?'lo':'los'} tienes en FMS: si la comunidad responde bien, es señal de que el público ${one?'lo':'los'} quiere en la próxima temporada.</p></div>
    <div class="modal-actions"><button class="btn primary" onclick="closeModal()">Entendido</button></div>`);
}

