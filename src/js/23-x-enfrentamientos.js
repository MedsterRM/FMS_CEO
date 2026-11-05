/* =========================================================================
   ENFRENTAMIENTOS OFICIALES: el día después del límite de cruces, X reacciona
========================================================================= */
var PV_ADJ={fms_espana:'liga española',fms_argentina:'liga argentina',fms_mexico:'liga mexicana',fms_chile:'liga chilena',fms_peru:'liga peruana',fms_colombia:'liga colombiana',fms_caribe:'liga del Caribe'};
var TWP_BASE={
  both:['{a} vs {b}. Esta jornada la veo dos veces 🔥','{a} contra {b}: batallón asegurado','No me importa quién gane: {a} vs {b} es puro arte','Dos de mis favoritos frente a frente. {a} vs {b}, qué maravilla','{a} vs {b} es la batalla que llevaba tiempo esperando','Si {a} y {b} están inspirados, esto va a ser historia','Gane quien gane, con {a} vs {b} ganamos todos','Me pido primera fila para el {a} vs {b}'],
  hateBoth:['{a} vs {b}… esa batalla me la salto','Ni {a} ni {b}. Ese cruce no lo veo','{a} contra {b}: momento perfecto para ir por algo de comer','Con {a} vs {b} paso, la verdad','{a} vs {b} no me dice nada, siguiente','De toda la jornada, {a} vs {b} es la que menos me apetece'],
  vs:['Ojalá {a} se lleve el {a} vs {b}','Todo mi apoyo a {a} contra {b}','Tengo fe en {a} contra {b}, a ver si lo saca','{a} tiene que ganarle a {b} sí o sí','Que {a} haga su batalla y {b} no tiene nada que hacer','Voy con {a} contra {b}, sin dudarlo'],
  fav:['Ganas de ver a {a} contra {b}','Con {a} en el cruce, ya tengo batalla favorita de la jornada','{a} vs {b}: aquí estaré','Confío en que {a} brille contra {b}','{a} contra {b}, la batalla que más me llama','A {a} le veo ganando a {b}, pero va a costar','Por {a} me veo la jornada entera','Que llegue ya el {a} vs {b}'],
  rep:['¿{a} vs {b} OTRA VEZ? {k} temporadas seguidas viendo lo mismo','{a} contra {b} de nuevo… Ya me sé esta batalla de memoria','Otra edición más de {a} vs {b}. Un poco de variedad, por favor','{k} años seguidos con {a} vs {b}. Ya está bien','¿No hay otros cruces? {a} vs {b} por {k}ª temporada seguida','{a} vs {b} parte {k}. Ya cansa un poco'],
  rival:['{a} vs {b}. Aquí hay pique del bueno 🔥','Se viene {a} contra {b}, y ya sabemos cómo terminan estos dos','{a} vs {b}: esto va a ser personal','Cuando se cruzan {a} y {b} siempre pasa algo','Hay cuentas pendientes entre {a} y {b}','{a} contra {b}. El morbo está servido'],
  ex:['Buena exhibición la de {a} vs {b}','Tengo muchas ganas de la exhibición {a} vs {b}','{a} vs {b} de exhibición. Puede ser la mejor de la jornada','Exhibición {a} vs {b}: sin puntos en juego pero con mucho que demostrar','La exhibición {a} vs {b} tiene muy buena pinta'],
  gen:['{a} vs {b} puede dar mucho que hablar','Curioso el cruce {a} vs {b}','Para mí, {a} vs {b} es la batalla de la jornada','Ni idea de quién gana el {a} vs {b}','{a} vs {b} me parece la más igualada','Ojo al {a} vs {b}, que puede haber sorpresa','{a} contra {b}: estilos muy distintos, puede salir algo bueno'],
};
var TWP_DIA={
  es:{ both:['Tío, {a} vs {b}. Me lo veo en bucle','{a} contra {b}, qué pasada de cruce','Esta jornada la organización se ha lucido: {a} vs {b}','Pedazo de cruce {a} vs {b}, me flipa'],
       hateBoth:['{a} vs {b}… paso, me voy a hacer la cena','Ese cruce no me mola nada, {a} vs {b}'],
       vs:['A muerte con {a} contra {b}','Venga {a}, que a {b} se le puede ganar'],
       fav:['Qué ganas de ver a {a} contra {b}, tío','{a} contra {b}, me apunto ya','Me mola mucho el {a} vs {b}','{a} va a por {b}, menuda jornada'],
       rep:['Cambiad los cruces, que {a} vs {b} ya lo hemos visto {k} años seguidos','Otra vez {a} vs {b}… ¿no hay más gente o qué?'],
       rival:['Preparad las palomitas: {a} vs {b}','{a} vs {b}, se va a liar parda'],
       ex:['Qué buena pinta tiene la exhibición {a} vs {b}, me mola'],
       gen:['{a} vs {b}, a ver qué sale de ahí, tío','Me da que el {a} vs {b} va a estar muy reñido'] },
  ar:{ both:['{a} vs {b}, loco. La veo mil veces','Qué cruce, {a} contra {b}. Re manija','Se lucieron con este cruce: {a} vs {b}','{a} vs {b}, posta que es la final anticipada'],
       hateBoth:['{a} vs {b}… ni en pedo la miro','Ese cruce no me copa nada, {a} vs {b}'],
       vs:['Con {a} a muerte contra {b}, eh','Dale {a}, que a {b} le podés ganar'],
       fav:['Re manija del {a} vs {b}','{a} contra {b}, ya la agendé','Me copa mucho el {a} vs {b}','{a} va por {b}, qué fecha se viene'],
       rep:['Cambien los cruces, que {a} vs {b} ya lo vimos {k} años seguidos','Otra vez {a} vs {b}… ¿no hay más pibes o qué?'],
       rival:['Preparen el mate: {a} vs {b}','{a} vs {b}, se va a pudrir todo'],
       ex:['Qué linda pinta tiene la exhibición {a} vs {b}'],
       gen:['{a} vs {b}, a ver qué onda','Me parece que el {a} vs {b} va a estar re parejo'] },
  mx:{ both:['{a} vs {b}, no manches. La veo mil veces','Qué cruce tan chido, {a} contra {b}','Se rifaron con este cruce: {a} vs {b}','{a} vs {b}, neta que es la batalla del año'],
       hateBoth:['{a} vs {b}… ni de chiste la veo','Ese cruce no me late nada, {a} vs {b}'],
       vs:['Con {a} hasta la muerte contra {b}, carnal','Échale ganas {a}, que a {b} sí se le gana'],
       fav:['Bien emocionado por el {a} vs {b}','{a} contra {b}, ya me la apunté','Me late mucho el {a} vs {b}','{a} va contra {b}, qué jornada se viene, raza'],
       rep:['Cambien los cruces, que {a} vs {b} ya lo vimos {k} años seguidos','Otra vez {a} vs {b}… ¿no hay más gente o qué, wey?'],
       rival:['Prepárense las palomitas: {a} vs {b}','{a} vs {b}, se va a poner bien cañón'],
       ex:['Qué chida se ve la exhibición {a} vs {b}'],
       gen:['{a} vs {b}, a ver qué sale','Se me hace que el {a} vs {b} va a estar bien parejo'] },
  cl:{ both:['{a} vs {b}, weón. La veo mil veces','Qué cruce más bacán, {a} contra {b}','Se pasaron con este cruce: {a} vs {b}','{a} vs {b} po, la raja'],
       hateBoth:['{a} vs {b}… ni cagando la veo','Ese cruce no me tinca na, {a} vs {b}'],
       vs:['Con {a} a muerte contra {b} po','Vamos {a}, que a {b} se le puede ganar'],
       fav:['Terrible de emocionado por el {a} vs {b}','{a} contra {b}, ya me la anoté','Me tinca harto el {a} vs {b}','{a} contra {b}, qué fecha se viene, cachai'],
       rep:['Cambien los cruces po, {a} vs {b} ya lo vimos {k} años seguidos','Otra vez {a} vs {b}… ¿no hay más gente o qué?'],
       rival:['Preparen la once: {a} vs {b}','{a} vs {b}, se va a armar la grande'],
       ex:['Bacán se ve la exhibición {a} vs {b}'],
       gen:['{a} vs {b}, a ver qué sale po','Me tinca que el {a} vs {b} va a estar parejo'] },
  pe:{ both:['{a} vs {b}, causa. La veo mil veces','Qué cruce más chévere, {a} contra {b}','Se pasaron con este cruce: {a} vs {b}','Asu, {a} vs {b}. Batallón'],
       hateBoth:['{a} vs {b}… esa ni la veo, causa','Ese cruce no me provoca nada, {a} vs {b}'],
       vs:['Con {a} a muerte contra {b} pe','Vamos {a}, que a {b} se le gana'],
       fav:['Full emocionado por el {a} vs {b}','{a} contra {b}, ya me la apunté','Me gusta harto el {a} vs {b}','{a} contra {b}, qué fecha se viene pe'],
       rep:['Cambien los cruces, causa, {a} vs {b} ya lo vimos {k} años seguidos','Otra vez {a} vs {b}… ¿no hay más gente o qué?'],
       rival:['Alisten la canchita: {a} vs {b}','{a} vs {b}, se va a armar la gorda'],
       ex:['Chévere se ve la exhibición {a} vs {b}'],
       gen:['{a} vs {b}, a ver qué sale pe','Creo que el {a} vs {b} va a estar parejo'] },
  co:{ both:['{a} vs {b}, parce. La veo mil veces','Qué cruce tan chimba, {a} contra {b}','Se lucieron con este cruce: {a} vs {b}','Uff, {a} vs {b}. Batallón, parcero'],
       hateBoth:['{a} vs {b}… esa ni la veo, parce','Ese cruce no me llama nada, {a} vs {b}'],
       vs:['Con {a} hasta el final contra {b}, parce','Vamos {a}, que a {b} sí se le gana'],
       fav:['Muy emocionado por el {a} vs {b}','{a} contra {b}, ya la tengo apuntada','Me gusta mucho el {a} vs {b}, bacano','{a} contra {b}, qué jornada se viene, parce'],
       rep:['Cambien los cruces, parce, {a} vs {b} ya lo vimos {k} años seguidos','Otra vez {a} vs {b}… ¿no hay más gente o qué?'],
       rival:['Alisten las crispetas: {a} vs {b}','{a} vs {b}, se va a prender eso'],
       ex:['Bacana se ve la exhibición {a} vs {b}'],
       gen:['{a} vs {b}, a ver qué sale','Me da que el {a} vs {b} va a estar parejo'] },
  car:{ both:['{a} vs {b}, pana. La veo mil veces','Qué cruce tan brutal, {a} contra {b}','Se lucieron con este cruce: {a} vs {b}','{a} vs {b}. Qué nota de batalla'],
        hateBoth:['{a} vs {b}… esa vaina no la veo','Ese cruce no me llama nada, {a} vs {b}'],
        vs:['Con {a} hasta el final contra {b}, pana','Dale {a}, que a {b} se le gana'],
        fav:['Demasiado emocionado por el {a} vs {b}','{a} contra {b}, ya la tengo anotada','Me gusta mucho el {a} vs {b}, chévere','{a} contra {b}, qué jornada se viene'],
        rep:['Cambien los cruces, pana, {a} vs {b} ya lo vimos {k} años seguidos','Otra vez {a} vs {b}… ¿no hay más gente o qué?'],
        rival:['Busquen las cotufas: {a} vs {b}','{a} vs {b}, se va a prender esa vaina'],
        ex:['Brutal se ve la exhibición {a} vs {b}'],
        gen:['{a} vs {b}, a ver qué sale','Me parece que el {a} vs {b} va a estar parejo'] },
  neu:{ both:['{a} vs {b}. La veré varias veces','Excelente cruce, {a} contra {b}'], hateBoth:['{a} vs {b}… esa batalla no la veré'], vs:['Todo el apoyo para {a} frente a {b}'],
        fav:['Muchas ganas del {a} vs {b}','{a} contra {b}, ya lo tengo anotado'], rep:['Deberían cambiar los cruces: {a} vs {b} ya van {k} años seguidos'], rival:['{a} vs {b}, se viene algo grande'], ex:['Interesante la exhibición {a} vs {b}'], gen:['{a} vs {b}, veremos qué sale'] },
};
var TWP_COMP={
  es:['Nos vemos en la tarima, @{h}. Que gane el mejor','Preparado para el {a} vs {b}. Va a ser bonito','Respeto máximo a @{h}, pero esta jornada es mía','Llevo semanas preparando esta. Nos vemos, @{h}','Contra @{h} siempre hay que dar el 200%. Allí estaré'],
  ar:['Nos vemos en la tarima, @{h}. Que gane el mejor','Listo para el {a} vs {b}. Va a estar buenísimo','Respeto total a @{h}, pero esta fecha es mía','Vengo preparando esta hace semanas. Nos vemos, @{h}','Con @{h} siempre hay que dejar todo. Ahí voy a estar'],
  mx:['Nos vemos en la tarima, @{h}. Que gane el mejor','Listo para el {a} vs {b}. Va a estar chido','Todo el respeto para @{h}, pero esta jornada es mía','Llevo semanas preparando esta. Nos vemos, @{h}','Contra @{h} hay que dejarlo todo, carnal'],
  cl:['Nos vemos en la tarima, @{h}. Que gane el mejor','Listo pal {a} vs {b}. Va a estar bueno po','Respeto total a @{h}, pero esta fecha es mía','Contra @{h} hay que dejarlo todo, cachai'],
  pe:['Nos vemos en la tarima, @{h}. Que gane el mejor','Listo para el {a} vs {b}. Va a estar chévere','Respeto total a @{h}, pero esta fecha es mía','Contra @{h} hay que dejarlo todo, causa'],
  co:['Nos vemos en la tarima, @{h}. Que gane el mejor','Listo para el {a} vs {b}. Va a estar bacano','Respeto total a @{h}, pero esta fecha es mía','Contra @{h} hay que dejarlo todo, parce'],
  car:['Nos vemos en la tarima, @{h}. Que gane el mejor','Listo para el {a} vs {b}. Va a estar brutal','Respeto total a @{h}, pero esta fecha es mía','Contra @{h} hay que dejarlo todo, pana'],
  neu:['Nos vemos en la tarima, @{h}. Que gane el mejor','Listo para el {a} vs {b}','Respeto total a @{h}, pero esta jornada es mía'],
};

(function(){   // más variaciones para los cruces de jornada
  const B={ both:['Hoy no se sale de casa: {a} vs {b}','{a} vs {b}. Que alguien me sujete','Esto no es una batalla, es un regalo: {a} vs {b}','{a} vs {b} lo veo en directo y luego otra vez en YouTube'],
    hateBoth:['{a} vs {b}, la única que me salto de la jornada','Me apetecía cualquier cruce menos {a} vs {b}','{a} contra {b}… no es para mí'],
    vs:['{a} tiene que poner a {b} en su sitio','Si {a} está fino, {b} lo va a pasar mal','Hoy gana {a}, no hay más'],
    fav:['{a} vs {b}, esa no me la pierdo','Batalla clave para {a} contra {b}','{a} llega en su mejor momento para medirse a {b}','Mi apuesta de la jornada: {a} ante {b}'],
    rep:['Ya hemos visto {a} vs {b} hasta en sueños','{a} vs {b} otra vez… ¿no se cansan de hacer el mismo cruce?','Por {k}ª temporada seguida, {a} vs {b}. Sin comentarios'],
    rival:['{a} vs {b}: aquí nadie quiere perder','Se van a decir de todo, {a} vs {b}','{a} y {b} otra vez cara a cara. Va a arder'],
    ex:['La exhibición {a} vs {b} puede robarle protagonismo a la jornada','Gran acierto la exhibición {a} vs {b}'],
    gen:['El {a} vs {b} tiene pinta de réplica','{a} vs {b}: batalla trampa','Ojo que {b} le puede dar la sorpresa a {a}','{a} vs {b} me genera mucha curiosidad'] };
  for(const c in B) TWP_BASE[c]=TWP_BASE[c].concat(B[c]);
})();

(function(){   // exhibiciones y extraplayers
  const B={ exBoth:['Exhibición {a} vs {b}. Mis dos favoritos, aunque sea sin puntos, me vale','{a} y {b} de exhibición. Ojalá algún día en liga','Ni que fuera la final: {a} vs {b} de exhibición 🔥'],
    exFav:['Por fin veo a {a}, aunque sea en exhibición','{a} de exhibición contra {b}. Que lo fichen ya','Ver a {a} en exhibición me sabe a poco, lo quiero en liga','{a} en la exhibición. Esto es lo que vengo a ver'],
    exHate:['La exhibición {a} vs {b} me la salto','No entiendo por qué traen a {a} de exhibición','Exhibición con {a}… pasable'],
    ex:['La exhibición {a} vs {b} me parece de lo mejor de la jornada','Buena idea traer a {a} y {b} de exhibición','Exhibición {a} vs {b}: a ver si alguno se gana un sitio en la liga','Que la exhibición {a} vs {b} sirva para ver quién merece estar en FMS','Me interesa más la exhibición {a} vs {b} que media jornada'],
    epYes:['{x} de extraplayer se lo merece de sobra','Bien elegido {x} como extraplayer. Tiene nivel de World Series','{x} en la World Series aunque sea de extraplayer. Merecidísimo','Qué gusto ver a {x} de extraplayer contra {a}'],
    epNo:['¿{x} de extraplayer? No se merece una World Series','{x} contra {a} en la World Series… no lo veo a ese nivel','Con todo el respeto, {x} no es extraplayer de World Series'],
    epAlt:['Esperaba a {f} de extraplayer y no a {x}','¿{x}? Tendría que haber ido {f} de extraplayer','Para extraplayer, {f}. No {x}','Teniendo a {f} disponible eligen a {x} de extraplayer… en fin'] };
  for(const c in B) TWP_BASE[c]=(TWP_BASE[c]||[]).concat(B[c]);
  const D={ es:{exFav:['Tío, {a} de exhibición. Que lo metan ya en liga'], epAlt:['Dónde está {f}, tío. {x} de extraplayer no me mola']},
    ar:{exFav:['{a} de exhibición, loco. Métanlo en la liga ya'], epAlt:['¿Y {f}? {x} de extraplayer no me cierra']},
    mx:{exFav:['{a} de exhibición, no manches. Métanlo a la liga ya'], epAlt:['¿Y {f}, carnal? {x} de extraplayer no me late']},
    cl:{exFav:['{a} de exhibición po. Métanlo a la liga altiro'], epAlt:['¿Y {f}? {x} de extraplayer no me tinca']},
    pe:{exFav:['{a} de exhibición, causa. Métanlo a la liga ya'], epAlt:['¿Y {f}? {x} de extraplayer no me convence, causa']},
    co:{exFav:['{a} de exhibición, parce. Métanlo a la liga ya'], epAlt:['¿Y {f}, parce? {x} de extraplayer no me convence']},
    car:{exFav:['{a} de exhibición, pana. Métanlo en la liga ya'], epAlt:['¿Y {f}, pana? {x} de extraplayer no me convence']} };
  for(const d in D) for(const c in D[d]){ if(!TWP_DIA[d]) TWP_DIA[d]={}; TWP_DIA[d][c]=(TWP_DIA[d][c]||[]).concat(D[d][c]); }
})();
function pairStreak(a,b){ const k=pairKey(a,b); let n=1; for(let i=state.seasons.length-2;i>=0;i--){ if(seasonPairs(state.seasons[i]).has(k)) n++; else break; } return n; }

var TWT={
  es:{ title:['{a} vs {b}: aquí se decide el título','Final adelantada en {liga}: {a} contra {b}','{a} vs {b}, el que gane se pone a tiro del título','Los de arriba cara a cara: {a} vs {b}','{a} contra {b}. Batalla por el campeonato','Esto huele a final: {a} vs {b}','Si {a} gana a {b}, tiene medio título en el bolsillo','{a} vs {b} vale una liga, no os lo perdáis'],
       titleLast:['{a} vs {b} en la última jornada. Esto es una final','Todo se decide en el {a} vs {b}','Última jornada y {a} contra {b} por el título. Ni guionizado','{a} vs {b}: el que gane, campeón. Así de simple'],
       decided:['{n} ya es campeón matemáticamente. Lo que queda de {liga} sobra','Se acabó la emoción: {n} ya tiene el título','Quedan jornadas y ya sabemos quién gana {liga}. Qué aburrimiento','¿Para qué ver lo que queda si {n} ya es campeón?','{liga} decidida antes de tiempo. Las últimas jornadas no tienen chicha','{n} se ha paseado. Ya no hay pelea por el título'] },
  la:{ title:['{a} vs {b}: acá se define el título','Final adelantada en {liga}: {a} contra {b}','{a} vs {b}, el que gane queda a tiro del título','Los de arriba cara a cara: {a} vs {b}','{a} contra {b}. Batalla por el campeonato','Esto tiene olor a final: {a} vs {b}','Si {a} le gana a {b}, tiene medio título en el bolsillo','{a} vs {b} vale una liga, no se la pierdan'],
       titleLast:['{a} vs {b} en la última fecha. Esto es una final','Todo se define en el {a} vs {b}','Última fecha y {a} contra {b} por el título. Ni guionado','{a} vs {b}: el que gane, campeón. Así de simple'],
       decided:['{n} ya es campeón matemáticamente. Lo que queda de {liga} sobra','Se acabó la emoción: {n} ya tiene el título','Quedan fechas y ya sabemos quién gana {liga}. Qué aburrido','¿Para qué ver lo que queda si {n} ya es campeón?','{liga} definida antes de tiempo. Las últimas fechas no tienen gracia','{n} se paseó. Ya no hay pelea por el título'] },
};
var TWR_FOR={
  es:['Los {g} no valoran a {n}. Una vergüenza cómo le están puntuando','En {pais} no saben lo que tienen con {n}','{n} merece más respeto en {liga}. Los {g} no le valoran','Que vuelva {n} a casa, que allí no le valoran','Los jueces de {liga} no entienden a {n}. Los {g} se lo están perdiendo'],
  la:['Los {g} no valoran a {n}. Una vergüenza cómo lo están puntuando','En {pais} no saben lo que tienen con {n}','{n} merece más respeto en {liga}. Los {g} no lo valoran','Que vuelva {n} a casa, que allá no lo valoran','Los jueces de {liga} no entienden a {n}. Los {g} se lo están perdiendo'],
};


var TWDS={
  es:{ rel:['{a} vs {b}: batalla por no descender','El que pierda el {a} vs {b} se complica muchísimo la permanencia','{a} contra {b}, aquí se juegan la categoría','Batalla de vida o muerte en la parte baja: {a} vs {b}','{a} vs {b} huele a descenso para el que pierda'],
       relFav:['Ojalá gane {f} a {o}, no le quiero ver descender','Vamos {f}, que tienes que salvarte. A por {o}','{f} no puede bajar. Por favor, que gane a {o}','Sufriendo por {f}. Contra {o} toca ganar sí o sí','Si {f} desciende me da algo. Fuerza contra {o}'],
       relAnti:['Que gane {f}. Prefiero que se salve antes que {o}','Hoy voy con {f}, sin dudarlo','Vamos {f}, que el que tiene que bajar es {o}','Apoyo total a {f} en esta. Ojalá se salve'] },
  la:{ rel:['{a} vs {b}: batalla por no descender','El que pierda el {a} vs {b} se complica muchísimo la permanencia','{a} contra {b}, acá se juegan la categoría','Batalla de vida o muerte en la parte baja: {a} vs {b}','{a} vs {b} tiene olor a descenso para el que pierda'],
       relFav:['Ojalá le gane {f} a {o}, no lo quiero ver descender','Vamos {f}, que te tenés que salvar. A ganarle a {o}','{f} no puede bajar. Por favor, que le gane a {o}','Sufriendo por {f}. Contra {o} hay que ganar sí o sí','Si {f} desciende me muero. Fuerza contra {o}'],
       relAnti:['Que gane {f}. Prefiero que se salve antes que {o}','Hoy voy con {f}, sin dudarlo','Vamos {f}, que el que tiene que bajar es {o}','Apoyo total a {f} en esta. Ojalá se salve'] },
};

var TWI={
  es:{ luLocal:['{n} en una Inter en {sede}… finjamos que no sabemos quién va a ganar','Espero que el público no sea localista con {n}…','{n} jugando en casa. Ya me imagino las réplicas que le van a regalar','Inter en {sede} con {n}. A ver cuánto pesa el público esta vez','Ojalá los jueces no se dejen llevar por el público con {n}','{n} de local en la Inter. Preparad los pañuelos para los rivales'],
       champLocalHate:['Siendo local lo hace cualquiera…','{n} campeón en casa. Qué sorpresa, oye','Con el público a favor así cualquiera gana una Inter','Que gane {n} fuera de {sede} y hablamos','Inter en {sede}, campeón de {sede}. Nada más que añadir'],
       fan:['¡{n} CAMPEÓN DEL MUNDO! 🏆🔥','{n} es el mejor del mundo. Lo sabía','Lloro: {n} campeón de la Inter 🏆','Qué orgullo, {n}. Campeón internacional'], neu:['Enhorabuena a {n}, campeón de la FMS Internacional','Gran Inter de {n}. Merecido','{n} campeón del mundo. Chapó'], hateSoft:['No era mi favorito, pero enhorabuena a {n}','Me habría gustado otro campeón, pero bien jugado, {n}'] },
  la:{ luLocal:['{n} en una Inter en {sede}… hagamos de cuenta que no sabemos quién va a ganar','Ojalá el público no sea localista con {n}…','{n} jugando de local. Ya me imagino las réplicas que le van a regalar','Inter en {sede} con {n}. A ver cuánto pesa el público esta vez','Ojalá los jueces no se dejen llevar por el público con {n}','{n} de local en la Inter. Pobres rivales'],
       champLocalHate:['Siendo local lo hace cualquiera…','{n} campeón de local. Qué sorpresa, eh','Con el público a favor así cualquiera gana una Inter','Que gane {n} fuera de {sede} y hablamos','Inter en {sede}, campeón de {sede}. Nada más que agregar'],
       fan:['¡{n} CAMPEÓN DEL MUNDO! 🏆🔥','{n} es el mejor del mundo. Lo sabía','Lloro: {n} campeón de la Inter 🏆','Qué orgullo, {n}. Campeón internacional'], neu:['Felicitaciones a {n}, campeón de la FMS Internacional','Gran Inter de {n}. Merecido','{n} campeón del mundo. Respeto'], hateSoft:['No era mi favorito, pero felicitaciones a {n}','Me hubiera gustado otro campeón, pero bien jugado, {n}'] },
};
function icGenerate(s){
  const I=s.intl; const id=I.champion; if(!id || !I.bracket) return; const f=fby(id); const fem=isWoman(id); const sd=I.sede||''; const local=f.country===sd;
  let n=0; state.seasons.forEach(o=>{ if(o.intl && o.intl.champion===id) n++; }); const cw=champWord(n, fem);
  const real=TWITTEROS.filter(t=>!t.special).map(twAcc); const accs=shuffle(real);
  const usedT=new Set(); const pk=list=>{ const f2=list.filter(x=>!usedT.has(x)); const t=pick(f2.length?f2:list); usedT.add(t); return t; };
  const fill=(t,o)=>t.replace(/\{(\w+)\}/g,(m,x)=>o[x]!=null?o[x]:m); const T=a=>TWI[twDia(a&&a.country)==='es'?'es':'la'];
  const o={n:fname(id), sede:sd, cw};
  const tw=[]; const add=(acc, text, sent)=>tw.push({h:acc.handle, n:acc.name, c:acc.country||null, v:!!acc.verified, img:null, text, sent, at:0, likes:Math.round(Math.pow(Math.random(),2)*8000)+rint(20,150), rts:rint(10,900), cm:rint(10,200)});
  const like=a=>(a.fav||[]).some(x=>nrm(x)===nrm(f.name)), dis=a=>(a.hate||[]).some(x=>nrm(x)===nrm(f.name)); const used=new Set();
  add(leagueAcc(INTL.key), fill(pick(['🏆 {n}, campeón de la FMS Internacional {y}','Tenemos campeón del mundo: {n} 🏆','{n} se corona en {sede}. ¡Campeón de la FMS Internacional {y}! 🏆']),{...o, y:s.year}), 1);
  accs.filter(like).slice(0,4).forEach(a=>{ used.add(a.handle); add(a, fill(pk(T(a).fan),o), 1); });
  accs.filter(a=>dis(a)).slice(0, local?3:1).forEach(a=>{ used.add(a.handle); add(a, fill(pk(local ? T(a).champLocalHate : T(a).hateSoft),o), local?-1:0); });
  accs.filter(a=>!used.has(a.handle) && !dis(a)).slice(0,rint(2,3)).forEach(a=>{ used.add(a.handle); add(a, fill(pk(T(a).neu),o), 1); });
  const fin=I.bracket.rounds[I.bracket.rounds.length-1][0]; const opp=fin ? (fin.a===id?fin.b:fin.a) : I.runnerUp;
  if(opp && !isRival(opp,id)){ const of=fby(opp); add({handle:twHandle(of.name), name:of.name, country:of.country, verified:true, img:null}, fill(pick(TWC_COMP[twDia(of.country)==='es'?'es':'la']),{h:twHandle(f.name)}), 1); }
  const sf=flagOf(sd), cf=flagOf(f.country); const nw=TW_NEWS[Math.random()<0.5?0:1]; const acc={...nw, img:null}; let text;
  if(nw.special==='mcn') text=`${cf} ${f.name.toUpperCase()} - ${cw.toUpperCase()} FMS INTERNACIONAL ${s.year} 🌎\n\n${f.name} vence a ${fname(opp)} en la final y gana la FMS Internacional ${s.year} en ${sd} ${sf}!!!${n>1?` (${n}º título)`:''}`;
  else text=`¡${fem?'La CAMPEONA':'El CAMPEÓN'} de la FMS INTERNACIONAL 🌎! 🏆\n\n${nrm(f.name).toUpperCase()} ${cf} se convirtió en ${fem?'la':'el'} ${cw} de la FMS Internacional ${s.year} tras vencer a ${fname(opp)} en la final disputada en ${sd} ${sf}. 🔥\n\n#FMSInternacional 🏆`;
  add(acc, text, 0);
  I.champTw={id, cw, titles:n, streak:0, tweets:tw, shown:false};
}
function openIntlChamp(){ openChamp(INTL.key); }
function pvGenerate(s, k, j){
  const L=s.leagues[k]; const liga=ldef(k).name; const round=L.rounds[j]||[];
  const items=[];
  [L.exhib&&L.exhib[j], L.fexhib&&L.fexhib[j]].forEach(x=>{ if(x && x.a && x.b) items.push({a:x.a, b:x.b, ex:true}); });
  round.slice().sort((x,y)=>(hypeOf(x.a)+hypeOf(x.b||x.a))-(hypeOf(y.a)+hypeOf(y.b||y.a))).forEach(m=>{ if(m.a && m.b) items.push({a:m.a, b:m.b, ep:!!m.ep}); });
  const real=TWITTEROS.filter(t=>!t.special).map(twAcc); const accs=shuffle(real);
  const lc = isWS(k) ? null : ldef(k).countries; const isLocal=a=> !lc || (a.country && lc.includes(a.country));
  const usedT=new Set(); const pk=list=>{ const f=list.filter(x=>!usedT.has(x)); const t=pick(f.length?f:list); usedT.add(t); return t; };
  const fill=(t,o)=>t.replace(/\{(\w+)\}/g,(m,x)=>o[x]!=null?o[x]:m);
  const P=(a,cat)=>{ const d=twDia(a&&a.country); let list=((TWP_DIA[d]||{})[cat]||[]).concat(d==='es'?TWP_BASE[cat]:TWP_BASE[cat].map(t=>t.replace('Aquí hay','Acá hay')));
    if(d!=='es') list=list.filter(t=>!/¡Preparad|Cambiad|aquí estaré/.test(t)); return pk(list); };
  const tw=[]; const add=(acc, text, sent, at)=>{ tw.push({h:acc.handle, n:acc.name, c:acc.country||null, v:!!acc.verified, img:acc.img||null, text, sent, at, likes:Math.round(Math.pow(Math.random(),2)*3000)+rint(3,60), rts:rint(0,300), cm:rint(0,70)}); };
  const used=new Set(); const free=()=>{ const pool=accs.filter(x=>!used.has(x.handle)); const loc=pool.filter(isLocal); const a=(loc.length && Math.random()<0.8 ? pick(loc) : pick(pool.length?pool:accs)); used.add(a.handle); return a; };
  const like=(a,id)=>(a.fav||[]).some(n=>nrm(n)===nrm(fname(id))), dis=(a,id)=>(a.hate||[]).some(n=>nrm(n)===nrm(fname(id)));
  items.forEach((it,i)=>{ const A=fname(it.a), B=fname(it.b); let nb=0; const lovers=new Set();
    accs.forEach(a=>{ if(nb>=3) return; const la=like(a,it.a), lb=like(a,it.b), da=dis(a,it.a), db=dis(a,it.b); if(!(la||lb||da||db)) return;
      const p=isLocal(a)?0.7:(a.country?0.2:0.35); if(Math.random()>p) return;
      let cat, sent, o={a:A,b:B};
      if(la&&lb){ cat='both'; sent=1; lovers.add(a.handle); }
      else if(da&&db){ cat='hateBoth'; sent=-1; }
      else if((la&&db)||(lb&&da)){ cat='vs'; sent=0; if(lb){ o={a:B,b:A}; } }
      else if(la||lb){ cat='fav'; sent=1; if(lb) o={a:B,b:A}; }
      else return;
      used.add(a.handle); add(a, fill(P(a,cat),o), sent, i); nb++; });
    const st=it.ex? 0 : pairStreak(it.a,it.b);
    if(st>=3){ const a=accs.find(x=>!used.has(x.handle) && isLocal(x) && !lovers.has(x.handle) && !(like(x,it.a)&&like(x,it.b))) || free(); used.add(a.handle); add(a, fill(P(a,'rep'),{a:A,b:B,k:st}), -1, i); }
    if(isRival(it.a,it.b)){ const a=free(); add(a, fill(P(a,'rival'),{a:A,b:B}), 1, i); }
    else if(it.ex){ const fx=accs.filter(a=>!used.has(a.handle) && (like(a,it.a)||like(a,it.b)||dis(a,it.a)||dis(a,it.b)));
      if(fx.length && Math.random()<0.8){ const a=fx[0]; used.add(a.handle); const la=like(a,it.a), lb=like(a,it.b);
        if(la&&lb) add(a, fill(P(a,'exBoth'),{a:A,b:B}), 1, i); else if(la||lb) add(a, fill(P(a,'exFav'),la?{a:A,b:B}:{a:B,b:A}), 1, i); else add(a, fill(P(a,'exHate'),dis(a,it.a)?{a:A,b:B}:{a:B,b:A}), -1, i); }
      const a=free(); add(a, fill(P(a,'ex'),{a:A,b:B}), 1, i); }
    if(it.ep && isWS(k)){ const x=it.b, X=fname(x); const inWS=new Set(L.competitors);
      const fan=accs.find(a=>!used.has(a.handle) && like(a,x)), hater=accs.find(a=>!used.has(a.handle) && dis(a,x));
      if(fan){ used.add(fan.handle); add(fan, fill(P(fan,'epYes'),{a:A,x:X}), 1, i); }
      if(hater){ used.add(hater.handle); add(hater, fill(P(hater,'epNo'),{a:A,x:X}), -1, i); }
      const alt=shuffle(accs.filter(a=>!used.has(a.handle) && !like(a,x))).map(a=>({a, f:(a.fav||[]).map(n=>state.freestylers.find(z=>nrm(z.name)===nrm(n))).find(z=>z && z.id!==x && !inWS.has(z.id) && z.fama>=75)})).find(o=>o.f);
      if(alt && Math.random()<0.7){ used.add(alt.a.handle); add(alt.a, fill(P(alt.a,'epAlt'),{a:A,x:X,f:alt.f.name}), -1, i); }
      if(!fan && !hater && !alt){ const a=free(); add(a, fill(P(a, fby(x).fama>=80?'epYes':'epNo'),{a:A,x:X}), fby(x).fama>=80?1:-1, i); } }
    else if(!nb && Math.random()<0.35){ const a=free(); add(a, fill(P(a,'gen'),{a:A,b:B}), 0, i); }
  });
  // padrinos: Quesada y Gazir, como mucho un tuit cada uno por jornada
  { const Q=TWITTEROS.find(t=>t.special==='quesada'); const q=Q&&twAcc(Q); const gz=state.freestylers.find(f=>f.name==='Gazir');
    const inC=(list,id)=>list.some(n=>nrm(n)===nrm(fname(id)));
    const one=(list, exclude, bothList)=>{ const ix=items.map((it,i)=>({it,i})).filter(x=>!x.it.ex && x.it.a!==exclude && x.it.b!==exclude); const bl=bothList||list;
      const both=shuffle(ix.filter(x=>inC(bl,x.it.a)&&inC(bl,x.it.b))); if(both.length) return {...both[0], both:true};
      const single=shuffle(ix.filter(x=>inC(list,x.it.a)||inC(list,x.it.b))); return single.length ? {...single[0], both:false} : null; };
    if(q){ const x=one(RQ_CREW, null, RQ_TRUE); if(x){ if(x.both) add(q, fill(pk(PATRON_TX.quesadaBoth),{a:fname(x.it.a), b:fname(x.it.b)}), 1, x.i);
        else { const me=inC(RQ_CREW,x.it.a)?x.it.a:x.it.b, o=me===x.it.a?x.it.b:x.it.a; add(q, fill(pk(PATRON_TX.quesadaJ),{n:fname(me), o:fname(o)}), 1, x.i); } } }
    if(gz){ const x=one(GZ_CREW, gz.id); if(x && Math.random()<(x.both?0.85:0.45)){ const ga={handle:'gazir', name:'Gazir', country:gz.country, verified:true, img:photoOf(gz)};
        if(x.both) add(ga, fill(pk(PATRON_TX.gazirBoth),{a:twHandle(fname(x.it.a)), b:twHandle(fname(x.it.b))}), 1, x.i);
        else { const me=inC(GZ_CREW,x.it.a)?x.it.a:x.it.b, o=me===x.it.a?x.it.b:x.it.a; add(ga, fill(pk(PATRON_TX.gazirJ),{h:twHandle(fname(me)), o:fname(o)}), 1, x.i); } } } }
  // batalla por el descenso (liga nacional, desde la J4): del 7º al 10º
  if(!isWS(k) && j>=3){ const st=computeStandings(L); const low=new Set(st.slice(6,10).map(r=>r.id));
    items.forEach((it,i)=>{ if(it.ex || !low.has(it.a) || !low.has(it.b)) return; let n=0;
      accs.filter(a=>!used.has(a.handle)).forEach(a=>{ if(n>=2) return; const la=like(a,it.a), lb=like(a,it.b), da=dis(a,it.a), db=dis(a,it.b);
        let cat=null, o=null; if(la!==lb){ cat='relFav'; o = la ? {f:fname(it.a), o:fname(it.b)} : {f:fname(it.b), o:fname(it.a)}; }
        else if(!la && !lb && da!==db){ cat='relAnti'; o = da ? {f:fname(it.b), o:fname(it.a)} : {f:fname(it.a), o:fname(it.b)}; }
        if(!cat || (!isLocal(a) && Math.random()<0.6)) return; used.add(a.handle); n++; add(a, fill(pk(TWDS[twDia(a.country)==='es'?'es':'la'][cat]), o), cat==='relFav'?1:0, i); });
      if(Math.random()<0.7){ const a=free(); add(a, fill(pk(TWDS[twDia(a.country)==='es'?'es':'la'].rel),{a:fname(it.a), b:fname(it.b)}), 0, i); } }); }
  // a partir de la J4 (J3 en World Series): los fans de los que van de 6º para abajo piden que dejen de robarles
  if(j >= (isWS(k)?2:3)){ const st=computeStandings(L); const low=st.slice(5).map((r,i)=>({id:r.id, pos:i+6})).filter(x=>accs.some(a=>like(a,x.id)));
    shuffle(low).slice(0,2).forEach(x=>{ const fans=accs.filter(a=>like(a,x.id) && !used.has(a.handle)).sort((p,q)=>(q.country===fby(x.id).country)-(p.country===fby(x.id).country)); fans.slice(0,rint(1,2)).forEach(a=>{ used.add(a.handle); const d=twDia(a.country);
      const f=fby(x.id); const foreign = lc && !lc.includes(f.country) && a.country===f.country && CH_COUNTRY[k];
      const txt = foreign ? pk(TWR_FOR[d==='es'?'es':'la']) : pk((TWR_DIA[d]||[]).concat(TWR[d==='es'?'es':'la']));
      add(a, fill(txt,{n:fname(x.id), pos:x.pos, g:foreign?CH_COUNTRY[k][1]:'', pais:(ldef(k).countries||[''])[0], liga}), -1, Math.max(0,items.findIndex(it=>it.a===x.id||it.b===x.id))); }); }); }
  // pelea por el título (top 3 entre sí desde la J3) y campeón ya decidido al final
  { const st=computeStandings(L); const left=nJ(k)-j; const decided = j>0 && st.length>1 && (st[0].pts-st[1].pts) > 3*left;
    if(decided && j >= nJ(k)-2){ for(let q=0;q<rint(1,2);q++){ const a=free(); add(a, fill(pk(TWT[twDia(a.country)==='es'?'es':'la'].decided),{n:fname(st[0].id), liga}), -1, items.length); } }
    else if(j>=2){ const top=new Set(st.slice(0,3).map(r=>r.id)); const last=j===nJ(k)-1;
      items.forEach((it,i)=>{ if(it.ex || !top.has(it.a) || !top.has(it.b)) return; for(let q=0;q<rint(1,2);q++){ const a=free(); add(a, fill(pk(TWT[twDia(a.country)==='es'?'es':'la'][last?'titleLast':'title']),{a:fname(it.a), b:fname(it.b), liga}), 1, i); } }); } }
  // uno o dos competidores calientan su batalla (nunca entre rivales con mala sangre)
  shuffle(items.filter(it=>!it.ex && !isRival(it.a,it.b))).slice(0,rint(1,2)).forEach(it=>{ const me=Math.random()<0.5?it.a:it.b, other=me===it.a?it.b:it.a; const f=fby(me);
    add({handle:twHandle(f.name), name:f.name, country:f.country, verified:true, img:photoOf(f)}, fill(pick(TWP_COMP[twDia(f.country)]||TWP_COMP.neu),{a:fname(me), b:fname(other), h:twHandle(fname(other))}), 0, items.findIndex(x=>x===it)); });
  // resumen oficial: Info Freestyle o McNoticias (50/50)
  { const jn=j+1, last=jn===nJ(k), lf=leagueFlag(k); const nat=id=> !isWS(k) && lc.includes(fby(id).country); const order=items.filter(x=>!x.ex).concat(items.filter(x=>x.ex));
    const nw=TW_NEWS[Math.random()<0.5?0:1]; const acc={...nw, img:EXTRA_IMG[nw.img]||null}; let text;
    if(nw.special==='info'){ const adj=isWS(k)?'FMS World Series':(PV_ADJ[k]||liga);
      const intro = jn===1 ? `Arranca la ${adj}: estos son los primeros enfrentamientos de la temporada. 🎤` : (last ? (()=>{ const st=computeStandings(L); return st.length>1 && st[0].pts-st[1].pts>3 ? `Llega la última jornada de la ${adj}, con ${fname(st[0].id)} ya proclamado campeón. 🏆` : `Hoy viviremos la última jornada de la ${adj}, donde conoceremos al campeón del torneo. 🏆`; })() : pick([`Nueva jornada de la ${adj}. Estos son los enfrentamientos:`,`La ${adj} sigue: así quedan los cruces de la jornada ${jn}.`,`Vuelve la ${adj} con una nueva jornada.`]));
      const nm=id=>nrm(fname(id)).toUpperCase()+(nat(id)?'':' '+flagOf(fby(id).country));
      text=`¡Oficial! - Jornada ${jn} de ${liga} ${lf}\n\n${intro}\n\n${order.map(x=>`- ${nm(x.a)} vs ${nm(x.b)}${x.ex?'(Exhibición)':(x.ep?' (Extraplayer)':'')}`).join('\n')}`; }
    else text=`${liga.toUpperCase()} - JORNADA ${jn} ${lf}\n\n${order.map(x=>`${flagOf(fby(x.a).country)} ${fname(x.a)} 🆚 ${fname(x.b)} ${flagOf(fby(x.b).country)}`).join('\n')}`;
    add(acc, text, 0, items.length+1); }
  tw.sort((a,b)=>a.at-b.at || Math.random()-0.5);
  const S=tw.reduce((a,t)=>a+t.sent,0); const delta=clamp(Math.round(S*0.8),-6,6);
  L.hype=clamp(L.hype+delta,5,100);
  if(!L.pv) L.pv={}; L.pv[j]={items, tweets:tw, delta, shown:false};
  addLog(s, s.day, `📣 Oficiales los cruces de la J${j+1} de ${liga}: ${delta>0?'la comunidad está con ganas':(delta<0?'hay quejas en redes':'opiniones divididas')} (${delta>=0?'+':''}${delta} de hype).`, delta>0?'good':(delta<0?'bad':''));
}
var PV_ANIM=null;
function openPairs(key, j){
  const s=cur(); const L=s.leagues[key]; if(j==null) j=L.played; const pv=L.pv&&L.pv[j]; if(!pv) return; document.body.classList.add('noscroll');
  const replay=pv.shown; pv.shown=true; save(); const def=ldef(key); const tok={}; PV_ANIM=tok;
  const cards=pv.items.map((it,i)=>`<div class="pv-card" id="pvc${i}">${it.ex?'<span class="pv-tag">Exhibición</span>':''}${it.ep?'<span class="pv-tag ep">Extraplayer</span>':''}
      <div class="pv-side">${fmFace(it.a)}<b>${fnameH(it.a)}</b></div><span class="pv-vs">VS</span><div class="pv-side r"><b>${fnameH(it.b)}</b>${fmFace(it.b)}</div></div>`).join('');
  openModal(`<h3 class="lu-title">${leagueHeadLogo(key)} Enfrentamientos · ${esc(def.name)} J${j+1}</h3>
    <div class="lu-wrap"><div class="pv-list">${cards}</div>
      <div class="lu-x"><div class="lu-xhead"><span class="lu-xlogo">𝕏</span> Tendencias · <b>#${esc(def.short||def.name).replace(/\s+/g,'')}J${j+1}</b></div><div class="lu-feed" id="luFeed"></div></div></div>
    <div class="lu-res" id="luRes"></div>
    <div class="modal-actions"><button class="btn" id="luSkip" onclick="pvSkip()">Revelar todo</button><button class="btn primary" onclick="PV_ANIM=null; closeModal(); render()">Seguir</button></div>`, 'lineup');
  themeEl(document.getElementById('modalRoot'), key);
  const feed=document.getElementById('luFeed'); const showTw=i=>{ const t=pv.tweets[i]; if(t && feed) feed.insertAdjacentHTML('afterbegin', luTweetHtml(t)); };
  const res=()=>{ const r=document.getElementById('luRes'); if(!r) return; const d=pv.delta;
    r.innerHTML=emoHtml(`<span class="lu-verdict ${d>0?'pos':(d<0?'neg':'')}">${d>=4?'🔥 Hay ganas de jornada':(d>0?'👍 Buenos cruces':(d===0?'🤷 Opiniones divididas':'👎 Quejas en redes'))}</span> Hype de la liga <b>${d>=0?'+':''}${d}</b>`); const b=document.getElementById('luSkip'); if(b) b.disabled=true; };
  let ti=0; const step=i=>{ if(PV_ANIM!==tok) return;
    if(i<pv.items.length){ const c=document.getElementById('pvc'+i); if(c) c.classList.add('on');
      let n=0; while(ti<pv.tweets.length && pv.tweets[ti].at<=i){ const idx=ti++; setTimeout(()=>{ if(PV_ANIM===tok) showTw(idx); }, 350+n*420); n++; }
      setTimeout(()=>step(i+1), 750+n*420); }
    else { let n=0; while(ti<pv.tweets.length){ const idx=ti++; setTimeout(()=>{ if(PV_ANIM===tok) showTw(idx); }, 300+n*450); n++; } setTimeout(()=>{ if(PV_ANIM===tok) res(); }, 500+n*450); } };
  window.pvSkip=()=>{ PV_ANIM=null; pv.items.forEach((x,i)=>{ const c=document.getElementById('pvc'+i); if(c) c.classList.add('on'); }); if(feed){ feed.innerHTML=''; pv.tweets.forEach((t,i)=>showTw(i)); } res(); };
  if(replay) window.pvSkip(); else setTimeout(()=>step(0), 400);
}

