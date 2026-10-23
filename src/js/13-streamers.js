/* =========================================================================
   STREAMERS: Force y Rodrigo Quesada opinan de tu jornada al día siguiente
========================================================================= */
const STREAMERS = {
  force:  {name:'Force', photo:"{{asset:streamers/force.jpg}}", pGood:0.7},
  quesada:{name:'Rodrigo Quesada', photo:"{{asset:streamers/quesada.jpg}}", pGood:0.4},
};
STREAMERS.gavyria={name:'Gavyria', pGood:0.6, photo:null}; STREAMERS.yagami={name:'Yagami', pGood:0.5, photo:null};
function streamerPhoto(S){ return S.photo || (typeof FACES!=='undefined' && FACES[S.name]) || null; }
if(typeof EXTRA_IMG!=='undefined'){ LOGOS[WS.key]=EXTRA_IMG.ws; STREAMERS.yagami.photo=EXTRA_IMG.yagami; }
const STREAM_CHANCE = 1;   // siempre habla alguien; solo cambia quién


