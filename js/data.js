/* Conteúdo do jogo: espécies, cartas de saber, eventos e pausas ativas.
   Efeitos (ef) usam as chaves:
   Bicho:    sac (saciedade), ene (energia), sau (saúde), hum (humor)
   Ambiente: agua, mata, lixo (lixo alto é ruim)
   Gente:    gsau (saúde das pessoas), saber */

/* Cada espécie:
   g: 'a' ou 'o' (gênero das frases), habitat: banhado | campo | mata | estuario
   fases: a primeira pode ser 'ovo' (o bicho não anda nem come; você cuida do ninho)
   companhia: outros bichos que aparecem na cena em cada fase [sprite, x] */
const ESPECIES = {
  capivara: {
    nome: 'Capivara', cientifico: 'Hydrochoerus hydrochaeris', disponivel: true, g: 'a', habitat: 'banhado',
    nascimento: 'Nasceu uma capivarinha no banhado! Cuide dela, do banhado e das pessoas ao redor.',
    fases: [
      { id: 'filhote', nome: 'Filhote', dur: 150, ritmo: 1.25,
        msg: 'Filhotes de capivara já beliscam capim poucos dias depois de nascer.' },
      { id: 'jovem', nome: 'Jovem', dur: 180, ritmo: 1.0,
        msg: 'Cresceu! Agora é jovem e explora o banhado com o grupo.' },
      { id: 'adulto', nome: 'Adulta', dur: 230, ritmo: 0.9,
        msg: 'Virou adulta! Capivaras vivem em grupos, sempre perto da água.' },
      { id: 'idoso', nome: 'Idosa', dur: 160, ritmo: 1.1,
        msg: 'Ficou idosa. Precisa de mais descanso e de um banhado tranquilo.' }
    ],
    comidas: [
      { nome: 'Capim nativo', ef: { sac: 30, hum: 5 }, boa: true,
        fb: 'Nhac! Capim é o principal alimento da capivara.' },
      { nome: 'Plantas aquáticas', ef: { sac: 25, sau: 5 }, boa: true, precisa: { agua: 35 },
        falta: 'A água está tão poluída que as plantas aquáticas sumiram. Cuide do ambiente!',
        fb: 'Delícia! Plantas aquáticas só crescem em água limpa.' },
      { nome: 'Pão ou salgadinho', ef: { sac: 10, sau: -15, hum: 5 }, boa: false, card: 'capi_dieta',
        fb: 'Comida de gente faz mal à capivara e a acostuma a chegar perto das pessoas.' }
    ],
    banho: { label: 'Banho no banhado', sub: 'Capivaras se refrescam e se protegem na água', agua: true,
      ok: 'Que banho bom!', ruim: 'A água está poluída e irritou a pele dela. Cuide da água!' },
    companhia: {
      filhote: [['capivara_adulto', 58]],
      jovem: [['capivara_adulto', 66]],
      adulto: [['capivara_filhote', 46], ['capivara_filhote', 72]],
      idoso: [['capivara_jovem', 58]]
    },
    eventos: ['pao', 'carrapato', 'eliminar', 'enchente', 'cachorro', 'estrada', 'lixo', 'estiagem', 'morcego', 'filhote_ferido']
  },

  sabia: {
    nome: 'Sabiá-laranjeira', cientifico: 'Turdus rufiventris', disponivel: true, g: 'o', habitat: 'mata',
    nascimento: 'Há um ovo azul-esverdeado num ninho de barro e raízes. Proteja o ninho!',
    fases: [
      { id: 'ovo', nome: 'Ovo', dur: 60, ritmo: 0.35,
        msg: 'Os pais se revezam para chocar. Em cerca de duas semanas o filhote nasce.' },
      { id: 'filhote', nome: 'Filhote', dur: 120, ritmo: 1.25,
        msg: 'Nasceu! O filhote de peito pintadinho pede comida aos pais o tempo todo.' },
      { id: 'jovem', nome: 'Jovem', dur: 170, ritmo: 1.0,
        msg: 'Já voa! O peito ainda tem pintas, mas o laranja está aparecendo.' },
      { id: 'adulto', nome: 'Adulto', dur: 220, ritmo: 0.9,
        msg: 'Adulto! O canto do sabiá anuncia a primavera e ele espalha sementes de frutas nativas.' },
      { id: 'idoso', nome: 'Idoso', dur: 150, ritmo: 1.1,
        msg: 'Ficou idoso. Ainda canta, mas precisa de abrigo e comida por perto.' }
    ],
    ovo: { label: 'Vigiar o ninho', sub: 'Manter gatos, cães e curiosos longe', ok: 'Ninho tranquilo. Os pais podem chocar em paz.' },
    comidas: [
      { nome: 'Frutos nativos', ef: { sac: 30, hum: 5 }, boa: true, precisa: { mata: 25 },
        falta: 'Quase não há árvores frutíferas por aqui. Plante mudas nativas!',
        fb: 'Pitanga e aroeira! Ao comer frutos, o sabiá espalha sementes e ajuda a mata a crescer.' },
      { nome: 'Minhocas e insetos', ef: { sac: 25, sau: 5 }, boa: true,
        fb: 'Solo vivo, cheio de minhocas: comida boa para o sabiá.' },
      { nome: 'Pão ou arroz', ef: { sac: 10, sau: -15, hum: 5 }, boa: false, card: 'aves_alimento',
        fb: 'Pão e arroz não têm o que a ave precisa e podem fazer mal.' }
    ],
    banho: { label: 'Banho na poça', sub: 'Aves limpam as penas na água rasa', agua: true,
      ok: 'Splash! Penas limpas.', ruim: 'A água da poça está suja. Penas sujas isolam mal o frio.' },
    companhia: {
      ovo: [['sabia_adulto', 62]],
      filhote: [['sabia_adulto', 64]],
      jovem: [['sabia_adulto', 70]],
      adulto: [['sabia_jovem', 52]],
      idoso: [['sabia_jovem', 60]]
    },
    eventos: ['gaiola', 'vidraca', 'gato', 'ave_morta', 'agrotoxico', 'lixo', 'estiagem', 'filhote_ferido']
  },

  queroquero: {
    nome: 'Quero-quero', cientifico: 'Vanellus chilensis', disponivel: true, g: 'o', habitat: 'campo',
    nascimento: 'No meio do campo, direto no chão, há um ninho com ovos pintados. Quase invisível!',
    fases: [
      { id: 'ovo', nome: 'Ovo', dur: 60, ritmo: 0.35,
        msg: 'Os ovos pintados se confundem com o chão. É a camuflagem que os protege.' },
      { id: 'filhote', nome: 'Filhote', dur: 120, ritmo: 1.25,
        msg: 'Nasceu! Logo depois de sair do ovo o filhote já anda e procura insetos.' },
      { id: 'jovem', nome: 'Jovem', dur: 170, ritmo: 1.0,
        msg: 'Jovem! O penacho ainda é curto e as cores vão escurecer.' },
      { id: 'adulto', nome: 'Adulto', dur: 220, ritmo: 0.9,
        msg: 'Adulto, com penacho e peito preto: o sentinela dos campos.' },
      { id: 'idoso', nome: 'Idoso', dur: 150, ritmo: 1.1,
        msg: 'Ficou idoso. Continua vigiando o campo, só que com mais calma.' }
    ],
    ovo: { label: 'Cercar o ninho', sub: 'Sinalizar para ninguém pisar', ok: 'Ninho sinalizado. Pessoas e cães passam longe.' },
    comidas: [
      { nome: 'Insetos do campo', ef: { sac: 30, hum: 5 }, boa: true,
        fb: 'O quero-quero come muitos insetos e ajuda a controlar pragas.' },
      { nome: 'Minhocas', ef: { sac: 25, sau: 5 }, boa: true, precisa: { lixo: -70 },
        falta: 'O solo está cheio de lixo e as minhocas sumiram. Limpe o campo!',
        fb: 'Minhocas no solo vivo. Delícia!' },
      { nome: 'Restos de lanche', ef: { sac: 10, sau: -15, hum: 5 }, boa: false, card: 'aves_alimento',
        fb: 'Restos de comida fazem mal às aves e atraem ratos e pombos.' }
    ],
    banho: { label: 'Banho na sanga', sub: 'Água rasa para beber e se refrescar', agua: true,
      ok: 'Que refresco!', ruim: 'A água da sanga está suja. Bebê-la faz mal.' },
    companhia: {
      ovo: [['queroquero_adulto', 64]],
      filhote: [['queroquero_adulto', 66]],
      jovem: [['queroquero_adulto', 72]],
      adulto: [['queroquero_ovo', 54]],
      idoso: [['queroquero_jovem', 62]]
    },
    eventos: ['rocada', 'rasante', 'cachorro', 'agrotoxico', 'ave_morta', 'lixo', 'estiagem', 'filhote_ferido']
  },

  graxaim: {
    nome: 'Graxaim-do-mato', cientifico: 'Cerdocyon thous', disponivel: true, g: 'o', habitat: 'mata',
    nascimento: 'Numa toca na beira da mata nasceu um graxainzinho de pelo escuro!',
    fases: [
      { id: 'filhote', nome: 'Filhote', dur: 150, ritmo: 1.25,
        msg: 'Filhotes de graxaim nascem com pelo escuro e ficam na toca com os pais.' },
      { id: 'jovem', nome: 'Jovem', dur: 180, ritmo: 1.0,
        msg: 'Jovem! O pelo clareou e ele aprende a caçar e a achar frutos.' },
      { id: 'adulto', nome: 'Adulto', dur: 230, ritmo: 0.9,
        msg: 'Adulto! O graxaim forma casal e é mais ativo ao entardecer e à noite.' },
      { id: 'idoso', nome: 'Idoso', dur: 160, ritmo: 1.1,
        msg: 'Ficou idoso, com o focinho grisalho. Precisa de uma toca segura.' }
    ],
    comidas: [
      { nome: 'Frutos nativos', ef: { sac: 25, hum: 5 }, boa: true, precisa: { mata: 25 },
        falta: 'Sem mata, faltam frutos. Plante mudas nativas!',
        fb: 'O graxaim come muitos frutos e espalha sementes pela mata.' },
      { nome: 'Insetos e roedores', ef: { sac: 30, sau: 5 }, boa: true,
        fb: 'Caçando roedores, o graxaim ajuda a controlar ratos.' },
      { nome: 'Ração ou lixo', ef: { sac: 15, sau: -15, hum: 5 }, boa: false, card: 'graxaim_comida',
        fb: 'Comer ração ou lixo aproxima o graxaim das casas e dos cães, e aí ele pode pegar doenças.' }
    ],
    banho: { label: 'Explorar à noite', sub: 'O graxaim é ativo ao anoitecer', agua: false,
      ok: 'Que passeio noturno bom!' },
    companhia: {
      filhote: [['graxaim_adulto', 60]],
      jovem: [['graxaim_adulto', 66]],
      adulto: [['graxaim_filhote', 46], ['graxaim_filhote', 70]],
      idoso: [['graxaim_jovem', 58]]
    },
    eventos: ['galinheiro', 'cinomose', 'estrada', 'morcego', 'cachorro', 'lixo', 'estiagem', 'filhote_ferido']
  },

  tigre: {
    nome: "Tigre-d'água", cientifico: 'Trachemys dorbigni', disponivel: true, g: 'a', habitat: 'banhado',
    nascimento: "Na areia da margem há ovos enterrados de tigre-d'água. O calor do sol vai chocá-los.",
    fases: [
      { id: 'ovo', nome: 'Ovo', dur: 60, ritmo: 0.35,
        msg: 'A mãe enterra os ovos e vai embora. A temperatura da areia decide se nascem machos ou fêmeas!' },
      { id: 'filhote', nome: 'Filhote', dur: 150, ritmo: 1.2,
        msg: 'Nasceu! Filhotes de tigre-d’água são verde vivo e já se viram sozinhos.' },
      { id: 'jovem', nome: 'Jovem', dur: 170, ritmo: 1.0,
        msg: 'Cresceu! O casco ganha as listras amarelas típicas da espécie.' },
      { id: 'adulto', nome: 'Adulta', dur: 200, ritmo: 0.85,
        msg: 'Adulta! Toma sol nas pedras e troncos para aquecer o corpo.' },
      { id: 'idoso', nome: 'Idosa', dur: 140, ritmo: 1.0,
        msg: 'Ficou idosa. O casco escureceu e até tem algas. Tartarugas podem viver décadas!' }
    ],
    ovo: { label: 'Proteger a areia', sub: 'Não pisar nem cavar onde há ovos', ok: 'Ninho protegido. O sol faz o resto.' },
    comidas: [
      { nome: 'Plantas aquáticas', ef: { sac: 25, sau: 5 }, boa: true, precisa: { agua: 35 },
        falta: 'A água está tão poluída que as plantas aquáticas sumiram.',
        fb: 'Plantas aquáticas: comida e esconderijo na água limpa.' },
      { nome: 'Peixinhos e insetos', ef: { sac: 30, hum: 5 }, boa: true, precisa: { agua: 25 },
        falta: 'Água suja, peixinhos sumidos. Cuide da água!',
        fb: 'Nhac! O tigre-d’água come de tudo um pouco.' },
      { nome: 'Pão ou carne crua', ef: { sac: 10, sau: -15 }, boa: false, card: 'tartaruga_pet',
        fb: 'Pão e carne crua fazem mal e sujam a água.' }
    ],
    banho: { label: 'Tomar sol no tronco', sub: 'Tartarugas se aquecem ao sol', agua: false,
      ok: 'Sol quentinho! Assim ela aquece o corpo e fortalece o casco.' },
    companhia: {
      ovo: [],
      filhote: [],
      jovem: [['tigre_adulto', 66]],
      adulto: [['tigre_adulto', 64]],
      idoso: [['tigre_jovem', 60]]
    },
    eventos: ['pet', 'soltura', 'desova', 'lixo', 'estiagem', 'enchente', 'estrada']
  },

  boto: {
    nome: 'Boto-de-Lahille', cientifico: 'Tursiops gephyreus', disponivel: true, g: 'o', habitat: 'estuario',
    nascimento: 'Nasceu um botinho no estuário! Ele vai ficar anos ao lado da mãe.',
    fases: [
      { id: 'filhote', nome: 'Filhote', dur: 150, ritmo: 1.2,
        msg: 'Filhotes nascem com marcas claras no corpo, das dobras de quando estavam na barriga da mãe.' },
      { id: 'jovem', nome: 'Jovem', dur: 180, ritmo: 1.0,
        msg: 'Jovem! Aprende com a mãe e o grupo a caçar tainhas.' },
      { id: 'adulto', nome: 'Adulto', dur: 230, ritmo: 0.9,
        msg: 'Adulto! Botos-de-Lahille são grandes e robustos e vivem perto da costa.' },
      { id: 'idoso', nome: 'Idoso', dur: 160, ritmo: 1.1,
        msg: 'Ficou idoso. As marcas na nadadeira contam sua história e ajudam os cientistas a reconhecê-lo.' }
    ],
    comidas: [
      { nome: 'Cardume de tainhas', ef: { sac: 30, hum: 5 }, boa: true, precisa: { agua: 30 },
        falta: 'A água está poluída e os peixes sumiram. Cuide do estuário!',
        fb: 'Tainha! O peixe preferido do boto e também dos pescadores.' },
      { nome: 'Corvinas', ef: { sac: 25, sau: 5 }, boa: true,
        fb: 'Uma corvina caçada em grupo. Botos cooperam entre si.' },
      { nome: 'Peixe dado por turistas', ef: { sac: 10, sau: -12, hum: 5 }, boa: false, card: 'boto_turismo',
        fb: 'Alimentar botos muda o comportamento deles e os aproxima de barcos e hélices.' }
    ],
    banho: { label: 'Brincar nas ondas', sub: 'Saltos e surfe na arrebentação', agua: true,
      ok: 'Que salto!', ruim: 'A água está turva e poluída. Até brincar fica difícil.' },
    companhia: {
      filhote: [['boto_adulto', 56]],
      jovem: [['boto_adulto', 62]],
      adulto: [['boto_filhote', 50]],
      idoso: [['boto_jovem', 56]]
    },
    eventos: ['rede', 'pesca_coop', 'encalhe', 'turista', 'esgoto', 'lixo', 'enchente']
  }
};

const CARTAS = {
  povos: {
    titulo: 'Povos originários do RS', pilar: 'Gente',
    texto: 'Kaingang, Mbyá Guarani e Charrua são povos originários do Rio Grande do Sul e vivem aqui até hoje. Os Charrua, por muito tempo dados como extintos, tiveram a etnia reconhecida em 2007 e têm aldeia em Porto Alegre. As faixas da moldura do Tamagotchê homenageiam a arte desses povos.'
  },
  saude_unica: {
    titulo: 'O que é Saúde Única?', pilar: 'Saúde Única',
    texto: 'A saúde das pessoas, dos animais e do ambiente está ligada. Quando um adoece, os outros sentem. Por isso o jogo tem três medidores: Bicho, Ambiente e Gente. Cuidar de um é cuidar de todos.'
  },
  capi_dieta: {
    titulo: 'Não alimente bichos silvestres', pilar: 'Bicho',
    texto: 'Capivaras comem capins e plantas aquáticas. Pão, salgadinho e restos de comida causam doenças e fazem o bicho perder o medo de gente, o que aumenta acidentes e conflitos.'
  },
  capi_carrapato: {
    titulo: 'Carrapatos e febre maculosa', pilar: 'Gente',
    texto: 'Capivaras, cavalos e gambás podem carregar carrapatos que transmitem riquétsias, bactérias da febre maculosa. No RS não há registro da forma grave da doença; aqui circulam riquétsias que causam quadros mais leves. Depois de trilhas: use roupas claras, examine o corpo e retire o carrapato com pinça, sem apertar nem queimar. Teve febre nos 14 dias seguintes? Procure atendimento e conte sobre a picada.'
  },
  capi_nao_matar: {
    titulo: 'Matar capivaras não resolve', pilar: 'Bicho',
    texto: 'Eliminar capivaras não é forma de controlar a febre maculosa. O manejo é feito por equipes técnicas de saúde e meio ambiente. A proteção que funciona é a prevenção pessoal contra carrapatos.'
  },
  lepto: {
    titulo: 'Enchente e leptospirose', pilar: 'Gente',
    texto: 'A leptospirose é causada por uma bactéria eliminada na urina de animais, principalmente ratos. Na enchente ela se espalha na água e na lama. Evite contato com a água da cheia e use botas e luvas na limpeza. Lixo acumulado atrai ratos.'
  },
  mata_ciliar: {
    titulo: 'Mata ciliar', pilar: 'Ambiente',
    texto: 'É a vegetação das margens de rios e banhados. Ela segura o solo, filtra a água, dá sombra, abrigo e alimento. Sem ela a água fica turva, quente e escassa na estiagem.'
  },
  caes: {
    titulo: 'Cães soltos e fauna', pilar: 'Bicho',
    texto: 'Cães soltos perseguem e ferem bichos silvestres e podem passar doenças a eles, como a cinomose para graxains. Cão vacinado, castrado e na guia protege a fauna e a família.'
  },
  atropelamento: {
    titulo: 'Bichos na estrada', pilar: 'Ambiente',
    texto: 'Atropelamentos estão entre as maiores causas de morte da fauna. Placas, redutores de velocidade e passagens de fauna salvam bichos e motoristas. Viu placa de fauna? Diminua a velocidade.'
  },
  raiva: {
    titulo: 'Morcego caído? Não toque!', pilar: 'Gente',
    texto: 'Morcegos e outros mamíferos podem transmitir raiva. Um morcego caído ou ativo de dia pode estar doente. Não toque, afaste pets e crianças e avise o serviço de saúde ou de zoonoses. Vacine cães e gatos todo ano.'
  },
  lixo_plastico: {
    titulo: 'Plástico na água', pilar: 'Ambiente',
    texto: 'O plástico se quebra em pedacinhos, os microplásticos, que entram na água, nos peixes e nos bichos e chegam até nós pela comida. Lixo no lugar certo é saúde para todos.'
  },
  resgate: {
    titulo: 'Achou um bicho ferido?', pilar: 'Bicho',
    texto: 'Não leve para casa nem dê comida ou remédio. Observe de longe e avise a Patrulha Ambiental da Brigada Militar ou o órgão ambiental do seu município. Bicho silvestre precisa de cuidado especializado.'
  },
  pausa: {
    titulo: 'Por que pausas?', pilar: 'Gente',
    texto: 'Ficar muito tempo parado diante da tela cansa os olhos e o corpo. Este jogo é curto de propósito e pede pequenas pausas. Cuidar de si também é Saúde Única.'
  }
};

/* fase: fase mínima (0 filhote, 1 jovem, 2 adulto, 3 idoso) */
const EVENTOS = {
  pao: {
    fase: 0, titulo: 'Visitantes no parque', card: 'capi_dieta',
    texto: 'Uma família chega ao banhado e quer jogar pão para a capivarinha. O que você faz?',
    opcoes: [
      { txt: 'Deixo, ela parece gostar', boa: false, ef: { sau: -12, hum: 5 },
        fb: 'Ela comeu, mas pão faz mal e a acostuma a se aproximar de pessoas.' },
      { txt: 'Explico que bicho silvestre não come comida de gente', boa: true, ef: { saber: 8 },
        fb: 'Boa! A família entendeu e foi observar de longe.' }
    ]
  },
  carrapato: {
    fase: 1, titulo: 'Carrapato!', card: 'capi_carrapato',
    texto: 'Depois de caminhar pelo banhado, você encontra um carrapato preso na perna.',
    opcoes: [
      { txt: 'Arranco e esmago com os dedos', boa: false, ef: { gsau: -12 },
        fb: 'Esmagar pode liberar bactérias. O certo é usar pinça, com firmeza e sem apertar.' },
      { txt: 'Queimo com um fósforo', boa: false, ef: { gsau: -12 },
        fb: 'O calor faz o carrapato soltar líquidos contaminados. Use pinça.' },
      { txt: 'Retiro com pinça e fico atenta a febre por 14 dias', boa: true, ef: { gsau: 5, saber: 8 },
        fb: 'Isso mesmo! E da próxima vez, roupas claras ajudam a ver os carrapatos.' }
    ]
  },
  eliminar: {
    fase: 1, titulo: 'Conversa na vizinhança', card: 'capi_nao_matar',
    texto: 'Um vizinho diz que as capivaras trazem doença e que é melhor acabar com todas.',
    opcoes: [
      { txt: 'Concordo, sem capivara não tem problema', boa: false, ef: { hum: -20, sau: -10 },
        fb: 'Eliminar capivaras não controla doenças e desequilibra o banhado.' },
      { txt: 'Explico que o manejo é técnico e que a prevenção funciona', boa: true, ef: { saber: 10, hum: 5 },
        fb: 'Ótimo! Informação também é cuidado com a saúde de todos.' }
    ]
  },
  enchente: {
    fase: 0, titulo: 'Chuva forte!', card: 'lepto', ef: { lixo: 15, agua: -10 },
    texto: 'Choveu muito e os rios transbordaram. Os bichos buscaram lugares mais altos e a rua da vila alagou.',
    opcoes: [
      { txt: 'Ando na água da enchente para ajudar', boa: false, ef: { gsau: -18 },
        fb: 'A água da enchente pode ter a bactéria da leptospirose. Evite contato.' },
      { txt: 'Espero a água baixar e limpo com botas e luvas', boa: true, ef: { gsau: 5, lixo: -10, saber: 8 },
        fb: 'Isso! Proteção na limpeza e lixo recolhido para não atrair ratos.' }
    ]
  },
  cachorro: {
    fase: 0, titulo: 'Cachorro solto', card: 'caes',
    texto: 'O cachorro do vizinho escapou e está correndo atrás do seu bicho.',
    opcoes: [
      { txt: 'Deixo, é só brincadeira', boa: false, ef: { sau: -15, hum: -20 },
        fb: 'Para o bicho silvestre não é brincadeira: ele se fere e se estressa.' },
      { txt: 'Chamo o vizinho e falo sobre guia e vacinação', boa: true, ef: { hum: 5, saber: 8 },
        fb: 'Isso protege a fauna e o próprio cachorro.' }
    ]
  },
  estrada: {
    fase: 2, titulo: 'Estrada nova', card: 'atropelamento',
    texto: 'Abriram uma estrada no meio do caminho que seu bicho usa todos os dias.',
    opcoes: [
      { txt: 'Não tem o que fazer', boa: false, ef: { sau: -15, hum: -10 },
        fb: 'Por pouco ela não foi atropelada. Tem como fazer algo, sim!' },
      { txt: 'Peço placas, redutores e passagem de fauna', boa: true, ef: { mata: 5, saber: 10 },
        fb: 'A prefeitura instalou placas. Bichos e motoristas mais seguros.' }
    ]
  },
  lixo: {
    fase: 0, titulo: 'Fim de semana no banhado', card: 'lixo_plastico', ef: { lixo: 20 },
    texto: 'Depois do fim de semana ficou lixo espalhado: garrafas, sacolas e embalagens.',
    opcoes: [
      { txt: 'A chuva leva embora', boa: false, ef: { agua: -15 },
        fb: 'A chuva leva o lixo para a água, e ele chega aos peixes e a nós.' },
      { txt: 'Organizo um mutirão de limpeza', boa: true, ef: { lixo: -30, gsau: 3, saber: 8 },
        fb: 'Margem limpa! E o mutirão ainda juntou a vizinhança.' }
    ]
  },
  estiagem: {
    fase: 1, titulo: 'Estiagem', card: 'mata_ciliar', ef: { agua: -15 },
    texto: 'Faz semanas que não chove e a água está baixando.',
    opcoes: [
      { txt: 'Bombeio água do banhado para a horta', boa: false, ef: { agua: -15, hum: -10 },
        fb: 'Sobrou menos água para os bichos e para todo mundo.' },
      { txt: 'Economizo água e planto mudas na margem', boa: true, ef: { mata: 10, saber: 8 },
        fb: 'A mata ciliar ajuda o banhado a segurar água.' }
    ]
  },
  morcego: {
    fase: 2, titulo: 'Morcego no chão', card: 'raiva',
    texto: 'De manhã, uma criança encontra um morcego caído no pátio.',
    opcoes: [
      { txt: 'Pego com a mão e solto no mato', boa: false, ef: { gsau: -20 },
        fb: 'Nunca toque em morcego caído: ele pode transmitir raiva.' },
      { txt: 'Afasto todos e aviso o serviço de saúde', boa: true, ef: { gsau: 5, saber: 10 },
        fb: 'Perfeito. E vacinar cães e gatos contra raiva completa a proteção.' }
    ]
  },
  filhote_ferido: {
    fase: 2, titulo: 'Bicho machucado', card: 'resgate',
    texto: 'Você encontra um filhote de bicho silvestre machucado no chão.',
    opcoes: [
      { txt: 'Levo para casa e cuido', boa: false, ef: { hum: -10, saber: 2 },
        fb: 'Com boa intenção, mas bicho silvestre precisa de cuidado especializado.' },
      { txt: 'Observo de longe e chamo a Patrulha Ambiental', boa: true, ef: { saber: 10 },
        fb: 'O filhote foi levado para reabilitação e depois devolvido à natureza.' }
    ]
  }
};

/* Aparecem em momentos fixos da sessão. O botão "Fiz!" libera após a contagem. */
const PAUSAS = [
  { tipo: 'Corpo', texto: 'Fique em pé e se espreguice como uma capivara acordando: braços para cima!', seg: 12 },
  { tipo: 'Olhos', texto: 'Olhe pela janela ou para longe. Consegue ver ou ouvir algum pássaro?', seg: 20 },
  { tipo: 'Respiração', texto: 'Respire como o boto antes do mergulho: inspire contando 4, segure 4, solte em 4. Três vezes.', seg: 20 },
  { tipo: 'Mente', texto: 'Desafio: diga em voz alta 3 bichos que vivem no Rio Grande do Sul.', seg: 10 },
  { tipo: 'Corpo', texto: 'Imite o quero-quero: fique num pé só por 10 segundos. Depois troque de pé!', seg: 20 },
  { tipo: 'Corpo', texto: 'Gire os ombros 5 vezes para frente e 5 para trás.', seg: 12 },
  { tipo: 'Mente', texto: 'Feche os olhos e conte 5 sons diferentes que você está ouvindo agora.', seg: 15 },
  { tipo: 'Água', texto: 'Beba um copo d’água. Água limpa é saúde para gente e para os bichos!', seg: 10 }
];

/* ---------- cartas e acontecimentos das outras espécies ---------- */
Object.assign(CARTAS, {
  aves_alimento: {
    titulo: 'O que as aves comem', pilar: 'Bicho',
    texto: 'Cada ave tem sua dieta: frutos, sementes, insetos, minhocas. Pão, arroz e restos de lanche não nutrem, podem fazer mal e atraem ratos e pombos. Quer ajudar as aves? Plante árvores nativas com frutos.'
  },
  aves_gaiola: {
    titulo: 'Lugar de ave é livre', pilar: 'Bicho',
    texto: 'Capturar, manter em gaiola ou vender aves silvestres sem autorização é crime ambiental (Lei 9.605/1998). O tráfico tira as aves da natureza, causa sofrimento e pode espalhar doenças.'
  },
  vidracas: {
    titulo: 'Vidraças e aves', pilar: 'Ambiente',
    texto: 'As aves não enxergam o vidro e batem nele achando que é céu ou mata. Adesivos, fitas ou cortinas do lado de fora quebram o reflexo e salvam muitas vidas.'
  },
  gatos: {
    titulo: 'Gato em casa, ave livre', pilar: 'Bicho',
    texto: 'Gatos soltos caçam aves, lagartos e pequenos mamíferos mesmo bem alimentados. Gato castrado, vacinado e dentro de casa, ou com tela, vive mais e protege a fauna.'
  },
  gripe_aviaria: {
    titulo: 'Ave morta? Não toque', pilar: 'Gente',
    texto: 'A gripe aviária já foi confirmada no RS em aves silvestres e numa granja comercial. Ao achar aves mortas ou doentes (dificuldade para respirar, pescoço torto, falta de coordenação), não toque e avise a Secretaria da Agricultura (Seapi) ou a Inspetoria de Defesa Agropecuária mais próxima.'
  },
  agrotoxico: {
    titulo: 'Menos veneno, mais vida', pilar: 'Ambiente',
    texto: 'Agrotóxicos matam insetos que aves e outros bichos comem, contaminam a água e fazem mal às pessoas. Pássaros, joaninhas e outros predadores naturais ajudam a controlar pragas de graça.'
  },
  ninho_chao: {
    titulo: 'Ninho no chão', pilar: 'Bicho',
    texto: 'O quero-quero faz ninho direto no chão do campo, em gramados e até em canteiros da cidade. Os ovos camuflados são fáceis de pisar. Viu um ninho? Afaste-se e avise para cercarem ou sinalizarem o local. Mexer em ninhos é crime ambiental.'
  },
  quero_defesa: {
    titulo: 'O sentinela dos campos', pilar: 'Gente',
    texto: 'O quero-quero dá rasantes e grita para proteger o ninho; ele tem um esporão nas asas. Não é maldade, é cuidado com os filhotes. Afaste-se, principalmente com cães, e ele se acalma.'
  },
  graxaim_comida: {
    titulo: 'Graxaim e lixo', pilar: 'Bicho',
    texto: 'Ração deixada no pátio e lixo aberto atraem graxains para perto de casas, cães e estradas. Lá eles se ferem, são atropelados ou pegam doenças dos cães. Tampe o lixo e recolha a ração dos pets à noite.'
  },
  galinheiro: {
    titulo: 'Galinheiro fechado', pilar: 'Gente',
    texto: 'Às vezes o graxaim come galinhas soltas. A solução é fechar o galinheiro à noite. Envenenar ou matar o graxaim é crime e prejudica o controle natural de ratos e insetos.'
  },
  tartaruga_pet: {
    titulo: 'Tartaruga não é brinquedo', pilar: 'Gente',
    texto: 'Desde 2015 o comércio de tartarugas de água doce é proibido no RS. Tartarugas, mesmo saudáveis, podem carregar a bactéria Salmonella, que causa diarreia em pessoas, principalmente crianças. Lave as mãos se tocar em répteis.'
  },
  exoticas: {
    titulo: 'Espécies exóticas', pilar: 'Ambiente',
    texto: 'Tartarugas exóticas soltas na natureza competem com o tigre-d’água nativo e podem cruzar com ele, gerando híbridos. Espécies exóticas estão entre as maiores causas de perda de biodiversidade. Nunca solte um pet na natureza.'
  },
  desova: {
    titulo: 'Tartaruga na estrada', pilar: 'Bicho',
    texto: 'Na época de desova, as fêmeas atravessam estradas atrás de areia para enterrar os ovos. Se for seguro, ajude-a a atravessar na direção em que ela estava indo. Não leve para a água nem para casa.'
  },
  emalhe: {
    titulo: 'Redes de emalhe', pilar: 'Bicho',
    texto: 'Botos se enroscam em redes de emalhe e morrem afogados. É a principal ameaça ao boto-de-Lahille no sul do Brasil. Respeitar as áreas de exclusão de pesca e recolher redes abandonadas salva botos.'
  },
  pesca_cooperativa: {
    titulo: 'Pesca com os botos', pilar: 'Gente',
    texto: 'Em Tramandaí (RS) e Laguna (SC), botos-de-Lahille cercam cardumes de tainha e dão um sinal; os pescadores jogam a tarrafa nessa hora. É uma tradição de gerações. Botos saudáveis garantem a pesca e o sustento das famílias.'
  },
  encalhe: {
    titulo: 'Animal marinho encalhado', pilar: 'Bicho',
    texto: 'Não empurre de volta ao mar nem puxe pela cauda ou nadadeiras. Mantenha distância, afaste pessoas e cães e avise a rede de encalhes da região (no litoral norte do RS, o CECLIMAR/UFRGS) ou a Patrulha Ambiental.'
  },
  boto_turismo: {
    titulo: 'Boto não se alimenta', pilar: 'Bicho',
    texto: 'Dar peixe a botos muda o comportamento deles: perdem o medo de barcos e hélices e deixam de caçar com o grupo. Observe de longe, desligue o motor perto deles e nunca ofereça comida.'
  },
  esgoto: {
    titulo: 'Esgoto e saúde', pilar: 'Gente',
    texto: 'Esgoto sem tratamento leva bactérias e vírus para rios, lagoas e mar. Contamina peixes, banhistas e botos. Saneamento básico é saúde para gente, bicho e ambiente ao mesmo tempo.'
  }
});

Object.assign(EVENTOS, {
  gaiola: {
    fase: 1, titulo: 'Vizinho com gaiola', card: 'aves_gaiola',
    texto: 'Um vizinho quer pegar o sabiá para ter o canto dele em casa, numa gaiola.',
    opcoes: [
      { txt: 'Deixo, ele vai cuidar bem', boa: false, ef: { hum: -25, sau: -10 },
        fb: 'Preso, o sabiá fica estressado e para de espalhar sementes na mata.' },
      { txt: 'Explico que é crime e que livre ele canta para todos', boa: true, ef: { saber: 10 },
        fb: 'O vizinho desistiu e plantou uma pitangueira para ouvir o sabiá de perto.' }
    ]
  },
  vidraca: {
    fase: 1, titulo: 'Batida no vidro', card: 'vidracas',
    texto: 'O sabiá bateu na vidraça da escola achando que era céu. Ficou tonto, mas está bem.',
    opcoes: [
      { txt: 'Foi azar, não tem o que fazer', boa: false, ef: { sau: -12 },
        fb: 'Ele bateu de novo no dia seguinte. Dá para evitar!' },
      { txt: 'Colamos adesivos no lado de fora do vidro', boa: true, ef: { saber: 8 },
        fb: 'Os adesivos quebraram o reflexo. Nenhuma batida desde então.' }
    ]
  },
  gato: {
    fase: 0, titulo: 'Gato à espreita', card: 'gatos',
    texto: 'O gato da vizinha está rondando a árvore do ninho.',
    opcoes: [
      { txt: 'Gato é assim mesmo', boa: false, ef: { sau: -15, hum: -15 },
        fb: 'O gato assustou os pais e quase alcançou o ninho.' },
      { txt: 'Converso sobre manter o gato em casa e com tela', boa: true, ef: { hum: 5, saber: 8 },
        fb: 'O gato agora fica em casa. Ele vive mais e as aves também.' }
    ]
  },
  ave_morta: {
    fase: 1, titulo: 'Aves mortas', card: 'gripe_aviaria',
    texto: 'Você encontra três aves mortas perto do açude, sem sinal de machucado.',
    opcoes: [
      { txt: 'Junto com a mão e jogo no lixo', boa: false, ef: { gsau: -18 },
        fb: 'Nunca toque em aves mortas: podem ter gripe aviária ou outras doenças.' },
      { txt: 'Não toco, afasto os pets e aviso a Seapi', boa: true, ef: { gsau: 5, saber: 10 },
        fb: 'Os técnicos recolheram as aves para análise. Vigilância é saúde de todos.' }
    ]
  },
  agrotoxico: {
    fase: 1, titulo: 'Veneno no jardim', card: 'agrotoxico',
    texto: 'Um morador quer passar veneno para acabar com os insetos do jardim.',
    opcoes: [
      { txt: 'Boa ideia, inseto é praga', boa: false, ef: { sau: -12, agua: -10, gsau: -5 },
        fb: 'O veneno matou a comida das aves e escorreu para a água.' },
      { txt: 'Sugiro deixar as aves controlarem os insetos', boa: true, ef: { mata: 5, saber: 8 },
        fb: 'Sem veneno, o jardim encheu de passarinhos e as pragas diminuíram.' }
    ]
  },
  rocada: {
    fase: 0, titulo: 'Máquina no campo', card: 'ninho_chao',
    texto: 'Uma roçadeira vai cortar a grama do campo onde fica o ninho.',
    opcoes: [
      { txt: 'Deixo, é só grama', boa: false, ef: { sau: -18, hum: -15 },
        fb: 'Por pouco a máquina não passou por cima do ninho.' },
      { txt: 'Peço para sinalizarem o ninho e desviarem', boa: true, ef: { saber: 10 },
        fb: 'Cercaram o ninho com fita. A roçada continuou em volta.' }
    ]
  },
  rasante: {
    fase: 2, titulo: 'Rasante!', card: 'quero_defesa',
    texto: 'Um menino passa com o cachorro perto do ninho e o quero-quero dá rasantes gritando.',
    opcoes: [
      { txt: 'Jogo uma pedra para espantar a ave', boa: false, ef: { sau: -15, hum: -15 },
        fb: 'A ave só estava protegendo os filhotes. Machucar aves silvestres é crime.' },
      { txt: 'Peço para eles se afastarem do ninho', boa: true, ef: { hum: 5, saber: 8 },
        fb: 'Com distância, o quero-quero se acalmou na hora.' }
    ]
  },
  galinheiro: {
    fase: 1, titulo: 'Galinha sumida', card: 'galinheiro',
    texto: 'Um sitiante diz que o graxaim pegou uma galinha e quer pôr veneno na mata.',
    opcoes: [
      { txt: 'Concordo, é ele ou as galinhas', boa: false, ef: { sau: -20, gsau: -5 },
        fb: 'O veneno mata graxains, aves, cães e contamina o solo e a água.' },
      { txt: 'Sugiro fechar o galinheiro à noite', boa: true, ef: { saber: 10 },
        fb: 'Galinheiro fechado, nenhuma perda. E o graxaim segue caçando ratos.' }
    ]
  },
  cinomose: {
    fase: 1, titulo: 'Cães sem vacina', card: 'caes',
    texto: 'Os cães do sítio vizinho não são vacinados e um deles está doente.',
    opcoes: [
      { txt: 'Bicho do mato se vira', boa: false, ef: { sau: -20 },
        fb: 'Cinomose e raiva passam dos cães para os graxains e vice-versa.' },
      { txt: 'Ajudo a levar os cães para vacinar', boa: true, ef: { gsau: 5, saber: 10 },
        fb: 'Cães vacinados protegem a família, os vizinhos e a fauna.' }
    ]
  },
  pet: {
    fase: 1, titulo: 'Na feira', card: 'tartaruga_pet',
    texto: 'Numa feira, alguém vende filhotes de tartaruga em potinhos.',
    opcoes: [
      { txt: 'Compro um para criar em casa', boa: false, ef: { gsau: -10, hum: -10 },
        fb: 'O comércio é proibido no RS e tartarugas podem passar Salmonella.' },
      { txt: 'Não compro e aviso a fiscalização ambiental', boa: true, ef: { saber: 10 },
        fb: 'A fiscalização recolheu os animais. Menos tráfico, mais tartarugas livres.' }
    ]
  },
  soltura: {
    fase: 2, titulo: 'Tartaruga de presente', card: 'exoticas',
    texto: 'Um vizinho cansou da tartaruga exótica que comprou anos atrás e quer soltá-la no banhado.',
    opcoes: [
      { txt: 'Ótimo, ela vai ficar livre', boa: false, ef: { sau: -10, mata: -5 },
        fb: 'A exótica disputa comida e sol com o tigre-d’água nativo.' },
      { txt: 'Oriento a procurar o órgão ambiental para destinação', boa: true, ef: { saber: 10 },
        fb: 'A tartaruga foi para um local adequado. O banhado segue só com nativas.' }
    ]
  },
  desova: {
    fase: 2, titulo: 'Tartaruga na estrada', card: 'desova',
    texto: 'Uma fêmea de tigre-d’água está atravessando a estrada para desovar.',
    opcoes: [
      { txt: 'Levo ela de volta para o banhado', boa: false, ef: { hum: -15 },
        fb: 'Ela vai tentar atravessar de novo: estava indo desovar do outro lado.' },
      { txt: 'Com segurança, ajudo na direção em que ela ia', boa: true, ef: { saber: 10 },
        fb: 'Ela chegou à areia e enterrou seus ovos.' }
    ]
  },
  rede: {
    fase: 1, titulo: 'Rede abandonada', card: 'emalhe',
    texto: 'Há uma rede de emalhe esquecida perto do canal, onde os botos passam.',
    opcoes: [
      { txt: 'Não é problema meu', boa: false, ef: { sau: -20, hum: -10 },
        fb: 'Um boto ficou preso e foi solto por pouco. Redes matam botos todos os anos.' },
      { txt: 'Aviso a fiscalização e ajudo a recolher', boa: true, ef: { lixo: -10, saber: 10 },
        fb: 'Rede retirada. O canal ficou seguro para os botos.' }
    ]
  },
  pesca_coop: {
    fase: 2, titulo: 'O sinal do boto', card: 'pesca_cooperativa',
    texto: 'Na barra, os pescadores esperam o boto cercar as tainhas e dar o sinal.',
    opcoes: [
      { txt: 'Passo com a lancha bem no meio', boa: false, ef: { hum: -15, sac: -10 },
        fb: 'O barulho espantou o cardume e o boto. Ninguém pescou.' },
      { txt: 'Observo de longe, em silêncio', boa: true, ef: { sac: 10, hum: 10, saber: 8 },
        fb: 'O boto deu o sinal, a tarrafa voou, e todos comeram tainha.' }
    ]
  },
  encalhe: {
    fase: 1, titulo: 'Encalhe na praia', card: 'encalhe',
    texto: 'Um boto do grupo encalhou na areia. Banhistas querem empurrá-lo de volta.',
    opcoes: [
      { txt: 'Ajudo a puxar pela cauda', boa: false, ef: { hum: -15, gsau: -5 },
        fb: 'Puxar pela cauda machuca. E um boto encalhado pode estar doente.' },
      { txt: 'Afasto as pessoas e chamo a rede de encalhes', boa: true, ef: { saber: 10 },
        fb: 'A equipe chegou, avaliou o boto e cuidou dele.' }
    ]
  },
  turista: {
    fase: 0, titulo: 'Passeio de barco', card: 'boto_turismo',
    texto: 'Um barco de turistas acelera em direção aos botos e alguém quer jogar peixe.',
    opcoes: [
      { txt: 'Que legal, quero ver de perto!', boa: false, ef: { hum: -15, sau: -8 },
        fb: 'Barcos rápidos estressam e podem ferir os botos com a hélice.' },
      { txt: 'Peço para desligar o motor e não alimentar', boa: true, ef: { hum: 5, saber: 8 },
        fb: 'Com o motor desligado, os botos passaram tranquilos ao lado do barco.' }
    ]
  },
  esgoto: {
    fase: 1, titulo: 'Água escura', card: 'esgoto', ef: { agua: -15 },
    texto: 'Um cano despeja esgoto sem tratamento direto no estuário.',
    opcoes: [
      { txt: 'Sempre foi assim', boa: false, ef: { agua: -10, gsau: -10 },
        fb: 'Banhistas e pescadores adoeceram e os peixes diminuíram.' },
      { txt: 'Denuncio e cobro saneamento', boa: true, ef: { agua: 15, gsau: 5, saber: 10 },
        fb: 'O esgoto foi ligado à estação de tratamento. A água clareou.' }
    ]
  }
});
