/* Sprites em pixel art. Cada letra é uma cor da PALETA; '.' é transparente.
   Os bichos olham para a direita; o jogo espelha quando andam para a esquerda.
   Para criar um bicho novo: adicione sprites "<especie>_<fase>" aqui. */

const PALETA = {
  m: '#c8925a', // pelo de filhote
  j: '#ad7642', // pelo de jovem
  b: '#8a5528', // pelo adulto
  d: '#3e2412', // contorno
  l: '#c99d66', // barriga
  e: '#120c08', // olho
  n: '#2b1a10', // focinho
  g: '#b3aa9c', // pelo grisalho
  f: '#4f8a3a', // folha
  v: '#2f5e2a', // folha escura
  t: '#6b4a2a', // tronco
  c: '#9fd3e6', // garrafa
  x: '#e6e6e6', // sacola
  r: '#c0392b', // vermelho
  w: '#ffffff',
  o: '#d9822b', // laranja (peito do sabiá, mancha do tigre-d'água)
  h: '#7f7052', // marrom-oliva (sabiá)
  q: '#a9aba3', // cinza (quero-quero)
  k: '#1c1c1c', // preto
  y: '#e2c44a', // amarelo
  s: '#4d6b2f', // casco
  u: '#7c9a43', // pele de tartaruga
  p: '#7f8c98', // cinza do boto
  i: '#cdd6de', // barriga do boto
  z: '#4b5660', // cinza escuro
  a: '#8a7458', // pelo do graxaim
  A: '#9cc9bf', // ovo de sabiá
  B: '#b8a87a', // ovo e filhote de quero-quero
  C: '#d36a5a', // pernas e bico rosados
  X: '#e8eef2'  // marcas claras
};

const SPRITES = {
  // filhote: pelo claro, cabeça grande e olho grande
  capivara_filhote: [
    '..........dd..',
    '.........dmmd.',
    '....dddddmmmmd',
    '...dmmmmmmeemd',
    '..dmmmmmmmeemn',
    '..dmmmmmmmmmmd',
    '..dlllllmmmmd.',
    '...dllllldd...',
    '...dmd..dmd...',
    '...ddd..ddd...'
  ],
  // jovem: pelo intermediário, corpo comprido e magro, pernas longas
  capivara_jovem: [
    '...............dd..',
    '..............djjd.',
    '....ddddddddddjjjjd',
    '...djjjjjjjjjjjjejd',
    '..djjjjjjjjjjjjjjjn',
    '..djjjjjjjjjjjjjjjd',
    '..dllllllllllljjdd.',
    '...dlllllllllddd...',
    '...djd.djd..djd.djd',
    '...djd.djd..djd.djd',
    '...ddd.ddd..ddd.ddd'
  ],
  // adulta: pelo escuro e encorpado, glândula escura no focinho
  capivara_adulto: [
    '....................dd..',
    '...................dbbd.',
    '....dddddddddddddddbnnbd',
    '...dbbbbbbbbbbbbbbbbbebd',
    '..dbbbbbbbbbbbbbbbbbbbbn',
    '..dbbbbbbbbbbbbbbbbbbbbd',
    '..dbbbbbbbbbbbbbbbbbbbd.',
    '..dbbbbbbbbbbbbbbbbbbd..',
    '..dllllllllllllllbbbdd..',
    '...dllllllllllllldddd...',
    '...dbbd.dbbd...dbbd.dbbd',
    '...dbbd.dbbd...dbbd.dbbd',
    '...dddd.dddd...dddd.dddd'
  ],
  // idosa: focinho e manchas grisalhas, corpo baixo e curvado
  capivara_idoso: [
    '........................',
    '....................dd..',
    '...................dggd.',
    '....dddddddddddddddgggbd',
    '...dbbbgbbbbbbbgbbbggebd',
    '..dbbbbbbbgbbbbbbbbggggn',
    '..dbbgbbbbbbbbbbgbbbbggd',
    '..dbbbbbbbbbbbbbbbbbbgd.',
    '..dbbbbbbbbbbbbbbbbbbd..',
    '..dllllllllllllllbbbdd..',
    '...dllllllllllllldddd...',
    '...dbbd.dbbd...dbbd.dbbd',
    '...dddd.dddd...dddd.dddd'
  ],

  /* ---------- sabiá-laranjeira ---------- */
  sabia_ovo: [
    '....AA....',
    '...AAAA...',
    '...AAAA...',
    '.ttAAAAtt.',
    'tttttttttt',
    '.tttttttt.'
  ],
  sabia_filhote: [
    '...hhh...',
    '..hhhhh..',
    '..hhheyy.',
    '..hhhhhh.',
    '.hhohohh.',
    '.hhohohh.',
    '..hhhhh..',
    '...y.y...',
    '..yy.yy..'
  ],
  sabia_jovem: [
    '.....hhh...',
    '....hhhhh..',
    '....hhhehyy',
    '...hhhhhhh.',
    '..hhhohoh..',
    '.hhhhohoh..',
    'hhh.hhhhh..',
    '....hhhh...',
    '.....y.y...'
  ],
  sabia_adulto: [
    '......hhh...',
    '.....hhhhh..',
    '.....hhhehyy',
    '....hhhhhhh.',
    '...hhhwqwhh.',
    '..hhhhooooh.',
    '.hhhhhooooh.',
    'hhhhhhoooo..',
    'hhh..hhhh...',
    '......y.y...'
  ],
  sabia_idoso: [
    '......ggg...',
    '.....gghhh..',
    '.....hghegyy',
    '....hhhhhhh.',
    '...hhhwqwhh.',
    '..hhhhoohoh.',
    '.hhhhhooooh.',
    'hhhhhhohoo..',
    'hhg..hhhh...',
    '......y.y...'
  ],

  /* ---------- quero-quero ---------- */
  queroquero_ovo: [
    '..BkB.BB..',
    '.BBBBBkBB.',
    '.BkBBBBBB.',
    'ffttttttff'
  ],
  queroquero_filhote: [
    '...BBB...',
    '..BkBBBk.',
    '..BBBBeC.',
    '..BkBBBB.',
    '.BBBBkBB.',
    '..BBBBB..',
    '...C.C...',
    '...C.C...',
    '..CC.CC..'
  ],
  queroquero_jovem: [
    '.......kk...',
    '......qqqq..',
    '......qqqeC.',
    '......qqqq..',
    '.....kkkk...',
    '...qqqkkww..',
    '.qqqqqqwww..',
    'qqq.qqqww...',
    '.....qqq....',
    '......C.C...',
    '......C.C...'
  ],
  queroquero_adulto: [
    '.....kkk.....',
    '......kkk....',
    '.......qqqq..',
    '......qqqqeCC',
    '.......qqqq..',
    '.......kkk...',
    '....qqqkkkk..',
    '..qqvvqqkww..',
    '.qqqqqqqwww..',
    'kkk.qqqqww...',
    '......qqq....',
    '.......C.C...',
    '......CC.CC..'
  ],
  queroquero_idoso: [
    '.....ggg.....',
    '......ggg....',
    '.......qqqq..',
    '......qqqqeCC',
    '.......qgqq..',
    '.......kgk...',
    '....qqqkgkk..',
    '..qqvgqqkww..',
    '.qgqqqqqwww..',
    'kkg.qqqqww...',
    '......qqq....',
    '.......C.C...',
    '......CC.CC..'
  ],

  /* ---------- graxaim-do-mato ---------- */
  graxaim_filhote: [
    '........k.k..',
    '.......kzkzk.',
    '.......zzezz.',
    '.......zzzzzk',
    '..zzzzzzzzz..',
    '.zzzzzzzzzz..',
    'zz.zzzzzzz...',
    '...kk...kk...',
    '...kk...kk...'
  ],
  graxaim_jovem: [
    '.............k.k..',
    '............kakak.',
    '............aaeaa.',
    '............aaaaak',
    '..zzzzzzzzzzaaaa..',
    '.zaaaaaaaaaaaaa...',
    'zz.aaalllllaaa....',
    'z...ak......ak....',
    'z...kk......kk....',
    '....kk......kk....',
    '...kk......kk.....'
  ],
  graxaim_adulto: [
    '...............k..k...',
    '..............kaakak..',
    '..............aaaeaaa.',
    '..............aaaaaaak',
    '..zzzzzzzzzzzaaaaaa...',
    '.zaaaaaaaaaaaaaaaa....',
    'zz.aaaallllllaaaa.....',
    'zz..akk.......akk.....',
    'zk..kk........kk......',
    'k...kk........kk......'
  ],
  graxaim_idoso: [
    '...............k..k...',
    '..............kaakak..',
    '..............agaegga.',
    '..............aggggggk',
    '..zzzgzzzzzgzaaaaaa...',
    '.zaaaaagaaaaaaagaa....',
    'zz.aaaallllllaaaa.....',
    'zz..akk.......akk.....',
    'zk..kk........kk......',
    'k...kk........kk......'
  ],

  /* ---------- tigre-d'água ---------- */
  tigre_ovo: [
    '..........',
    '...xx.xx..',
    '..xxxxxxx.',
    'llllllllll',
    'llltlllltl'
  ],
  tigre_filhote: [
    '..sssss....',
    '.sysysys.uu',
    'sssssssssue',
    '.yyyyyyy.u.',
    '.u.u..u.u..'
  ],
  tigre_jovem: [
    '...sssssss.....',
    '..ssyssyssy....',
    '.sssssysssss.uu',
    'ssyssssssyssueo',
    '.yyyyyyyyyyy.uy',
    '..uu.....uu....',
    '..u.......u....'
  ],
  tigre_adulto: [
    '.....sssssssss......',
    '...ssysssysssyss....',
    '..ssssyssssyssssy...',
    '.sssyssssyssssyss.ue',
    'sssssssssssssssssouu',
    '.yyyyyyyyyyyyyyy.uy.',
    '..uuu........uuu....',
    '..u.u........u.u....'
  ],
  tigre_idoso: [
    '.....ssfsssfs.......',
    '...ssgsfssgsssgs....',
    '..sfssgssssgsfssg...',
    '.sssgssfsgssssgss.ue',
    'sssssssssssssssssouu',
    '.gyyyyyggyyyyyyy.ug.',
    '..uuu........uuu....',
    '..u.u........u.u....'
  ],

  /* ---------- boto-de-Lahille ---------- */
  boto_filhote: [
    '.......p......',
    '.....ppppp....',
    'p..ppXpXpppep.',
    '.ppppXpXpppppp',
    'p..iiiiiiiii..',
    '......p.......'
  ],
  boto_jovem: [
    '.........zz........',
    '........zzz........',
    '.....zzzzzzzz......',
    'zz..ppppppppppppp..',
    '.zzpppppppppppppep.',
    'zz..pppiiiiiiiipppp',
    '.....iiiiiiiiii....',
    '.......pp..........'
  ],
  boto_adulto: [
    '...........zz...........',
    '..........zzz...........',
    '.......zzzzzzzzzz.......',
    'zz..pppppppppppppppppp..',
    '.zzpppppppppppppppppepp.',
    'zz..ppppiiiiiiiiiipppppz',
    '.....iiiiiiiiiiiiii.....',
    '........pp..............',
    '.........pp.............'
  ],
  boto_idoso: [
    '...........z.z..........',
    '..........zz.z..........',
    '.......zzzzzzzzzz.......',
    'zz..ppppXpppppXppppppp..',
    '.zzpppppppXppppppppgepp.',
    'zz..ppppiiiiiiiiiigppppz',
    '.....iiiiiiiiiiiiii.....',
    '........pp..............',
    '.........pp.............'
  ],

  pescador: [
    '.kk.',
    '.oo.',
    'ttt.',
    '.t.t',
    '.tt.',
    '.t.t'
  ],

  arvore: [
    '..vfv..',
    '.fffff.',
    'ffvffff',
    'fffffvf',
    '.fvfff.',
    '...t...',
    '...t...',
    '..ttt..'
  ],
  capim: ['f..f.', '.f.ff', 'fffff'],
  garrafa: ['xx', 'cc', 'cc', 'cc'],
  sacola: ['x..x', 'xxxx', 'xxxx'],
  zzz: ['wwww', '..w.', '.w..', 'wwww'],
  cruz: ['.r.', 'rrr', '.r.'],
  coracao: ['.r.r.', 'rrrrr', '.rrr.', '..r..']
};

function tamanhoSprite(nome) {
  const g = SPRITES[nome];
  if (!g) return { w: 0, h: 0 };
  return { w: Math.max(...g.map(r => r.length)), h: g.length };
}

function desenharSprite(ctx, nome, x, y, op = {}) {
  const g = SPRITES[nome];
  if (!g) return;
  const { w } = tamanhoSprite(nome);
  x = Math.round(x); y = Math.round(y);
  for (let j = 0; j < g.length; j++) {
    for (let i = 0; i < g[j].length; i++) {
      let ch = g[j][i];
      if (ch === '.') continue;
      if (op.piscar && ch === 'e') ch = 'd';
      ctx.fillStyle = PALETA[ch] || '#f0f';
      const px = op.espelhar ? x + (w - 1 - i) : x + i;
      ctx.fillRect(px, y + j, 1, 1);
    }
  }
}
