# Tamagotchê · Bichos do Sul · Saúde Única

Jogo no estilo tamagotchi com a fauna do Rio Grande do Sul. Você cuida de um bicho do nascimento à velhice, e a saúde dele depende do ambiente e das pessoas ao redor. É a abordagem de **Saúde Única**: a saúde humana, animal e ambiental é uma só.

Versão 0.2: seis bichos jogáveis, cada um com seu habitat, sua comida, seus acontecimentos e um visual diferente para cada fase da vida.

## Como jogar

- Cada vida dura cerca de **12 minutos**: filhote, jovem, adulta e idosa.
- Os botões são **Comer**, **Cuidar**, **Ambiente**, **Saber** e **Foto**.
- O botão **1x / 2x / 4x**, no topo da tela, acelera o tempo do jogo. As pausas ativas continuam no tempo real.
- **Foto**: abre a câmera do aparelho para uma selfie com o bicho e gera um cartão (1080×1350, formato de post) com o nome Tamagotchê, a fase do bicho, os três medidores e as faixas de grafismos. Dá para compartilhar direto (no celular) ou baixar. Sem câmera, o jogo gera o cartão com a cena do banhado. A imagem é montada no próprio aparelho e não é enviada para nenhum servidor. A câmera só funciona com o jogo aberto por https (o GitHub Pages já é https).
- Três medidores mostram a Saúde Única: **Bicho**, **Ambiente** e **Gente**.
- **Acontecimentos** (enchente, carrapato, cachorro solto, morcego caído...) pedem uma decisão e liberam **cartas de saber**.
- Três **pausas ativas** por sessão pedem um pequeno movimento ou exercício mental.
- O tempo para quando a aba fica escondida ou uma janela está aberta.
- Ao terminar, o jogo sugere uma pausa de 5 minutos antes de jogar de novo.

Para testes, abra com `?rapido` no endereço (ex.: `index.html?rapido`): o tempo corre 25 vezes mais rápido.

## Como as mecânicas ligam os três pilares

| Mecânica | Bicho | Ambiente | Gente |
|---|---|---|---|
| Comida natural x comida humana | saúde e saciedade | | conhecimento |
| Plantas aquáticas só com água limpa | alimento | qualidade da água | |
| Recolher lixo | | menos lixo | menos risco de ratos e doenças |
| Plantar mata ciliar | | mata e, com o tempo, água | |
| Denunciar esgoto | | água | saúde |
| Ambiente ruim (< 45) | perde saúde | | perde saúde |
| Bicho doente (< 35) | | | perde saúde (zoonoses) |
| Veterinária de fauna | saúde | | |
| Pausas ativas | humor | | saúde |

## Os bichos

| Bicho | Habitat na cena | Fases | Temas de Saúde Única |
|---|---|---|---|
| Capivara | banhado | filhote, jovem, adulta, idosa | comida humana, carrapatos e febre maculosa, leptospirose, cães soltos, atropelamento, raiva |
| Sabiá-laranjeira | mata | ovo, filhote, jovem, adulto, idoso | gaiola e tráfico, vidraças, gatos soltos, gripe aviária, agrotóxicos |
| Quero-quero | campo | ovo, filhote, jovem, adulto, idoso | ninho no chão e roçadas, rasantes de defesa, cães, agrotóxicos, gripe aviária |
| Graxaim-do-mato | mata | filhote, jovem, adulto, idoso | galinheiro x veneno, cinomose e raiva dos cães, atropelamento, lixo e ração |
| Tigre-d'água | banhado | ovo, filhote, jovem, adulta, idosa | comércio proibido e Salmonella, tartarugas exóticas, desova na estrada |
| Boto-de-Lahille | estuário, com pescador na margem | filhote, jovem, adulto, idoso | redes de emalhe, pesca cooperativa, encalhes, turismo, esgoto |

**Como cada fase muda no visual**

- **Ovo** (aves e tartaruga): ninho na cena, o bicho não anda nem come. O botão Cuidar vira "proteger o ninho".
- **Filhote:** menor, cores mais claras ou penugem, olhos grandes. O sabiá tem o peito pintado, o quero-quero é bege pintadinho, o graxaim tem pelo escuro, o tigre-d'água é verde vivo e o boto tem as marcas claras das dobras fetais.
- **Jovem:** tamanho intermediário. O laranja do sabiá aparece, o penacho do quero-quero é curto e o casco do tigre-d'água ganha listras.
- **Adulto:** cores completas. A capivara tem a glândula no focinho, o quero-quero o penacho e o peito preto, o sabiá o peito laranja.
- **Idoso:** tons grisalhos, algas no casco da tartaruga e entalhes e cicatrizes na nadadeira do boto.

Em cada fase aparecem outros bichos do grupo: mãe ou pai com o filhote, filhotes com o adulto, um jovem com o idoso. A exceção é o tigre-d'água filhote, que já nasce sozinho, porque a mãe não cuida dos ovos.

## Publicar no GitHub Pages

1. Crie o repositório `tamagotche` em https://github.com/marciadosangeles.
2. Envie os arquivos desta pasta (`index.html`, `css/`, `js/`, `README.md`).
3. Em **Settings → Pages**, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`.
4. Em alguns minutos o jogo fica em `https://marciadosangeles.github.io/tamagotche/`.

Não precisa de servidor nem de instalação: é HTML, CSS e JavaScript puro.

## Estrutura

```
index.html      aparelho, tela e botões
css/style.css   visual do aparelho e da tela
js/sprites.js   pixel art (cada letra é uma cor da paleta)
js/data.js      espécies, cartas de saber, acontecimentos e pausas ativas
js/game.js      regras, tempo, telas e desenho da cena
```

### Adicionar um bicho

1. Em `js/sprites.js`, crie `<id>_filhote`, `<id>_jovem`, `<id>_adulto` e `<id>_idoso` (e `<id>_ovo`, se a espécie tiver essa fase).
2. Em `js/data.js`, adicione a espécie em `ESPECIES`: gênero das frases (`g`), habitat (`banhado`, `campo`, `mata` ou `estuario`), fases, comidas, cuidado especial (`banho`), companhia e acontecimentos.
3. Crie acontecimentos e cartas próprios da espécie em `EVENTOS` e `CARTAS`.

## Outras especificações

Cada sessão terminada fica salva no navegador (`localStorage`, chave `tamagotche.hist.v1`) com data, pontuação dos três pilares, cartas liberadas, escolhas cuidadosas x descuidadas e pausas feitas x oferecidas. Nada sai do dispositivo. Para ver no navegador: console → `JSON.parse(localStorage.getItem('tamagotche.hist.v1'))`. O registro inclui a velocidade máxima usada (`velMax`)..

## Arte e cultura indígena

A moldura tem três faixas, uma para cada povo originário do RS:

- **Kaingang (topo):** marcas compridas e abertas (rá téi, ligadas à metade Kamé) e redondas e fechadas (rá ror, ligadas à metade Kairu).
- **Charrua (meio):** linhas paralelas, lembrando a pintura corporal em linhas descrita em registros históricos, e a boleadeira. A arte gráfica Charrua é pouco documentada, então esta faixa é a mais provisória: precisa ser construída com a comunidade Charrua de Porto Alegre (aldeia Polidoro, etnia reconhecida em 2007).
- **Mbyá Guarani (base):** o losango (*ypara korá*, a casa) e o zigue-zague do movimento da cobra (*ypara ixy*), grafismos da cestaria de taquara.

Esses grafismos são expressões culturais com significados próprios, e o uso sem reconhecimento já foi apontado como apropriação cultural. Por isso:

- o jogo usa padrões geométricos *inspirados*, sem reproduzir peças específicas, e explica cada faixa em "Sobre o jogo" e na carta "Povos originários do RS";
- recomenda-se **validar a arte com as comunidades Kaingang, Mbyá Guarani e Charrua** antes de publicar, idealmente com artistas indígenas desenhando as faixas e recebendo crédito.

## Nome

"Tamagotchi" é marca registrada da Bandai. Para um trabalho acadêmico sem fins comerciais o risco é baixo, mas vale conferir com a orientação se o nome "Tamagotchê" pode ficar na versão pública.

## Fontes do conteúdo

- Capivaras, cavalos e gambás no ciclo da febre maculosa; prevenção e retirada do carrapato com pinça: Ministério da Saúde, materiais municipais de vigilância.
- Forma grave da febre maculosa sem registro no RS; riquétsias de quadro mais leve na Mata Atlântica do Sul: PUCRS (2023); Diário do Nordeste, com dados do Ministério da Saúde.
- Eliminação de capivaras não é medida de controle: protocolo de vigilância de Jundiaí (SP), 2026.
- Boto-de-Lahille: Fruet et al. (2021), *Frontiers in Marine Science*; FURG/ECOMEGA; reclassificação para "em perigo" pela IUCN em 2025.
- Grafismos Kaingang: Silva (2001); Manual Kaingang da EPA/SMED Porto Alegre; Santos e Cescon (2025), *Temporalidades*.
- Grafismos Mbyá Guarani: Alexandrina da Silva, TCC da Licenciatura Intercultural Indígena (UFSC).
- Gripe aviária no RS e orientação para aves mortas: Governo do Estado do RS (2025).
- Proibição do comércio de tartarugas de água doce e risco de hibridização do tigre-d'água: Portaria SEMA nº 46/2015.
- Ninhos de quero-quero e comportamento de defesa: SMAMS/Prefeitura de Porto Alegre.
- Charrua: UFRGS, "A saga dos índios Charrua"; artigo na revista RELACult sobre a aldeia Polidoro.

## Próximos passos

- Validação da arte com as comunidades Kaingang, Mbyá Guarani e Charrua.
- Revisão das ilustrações e dos textos de cada espécie por biólogos.
- Revisão técnica do conteúdo de saúde por profissionais da área.
- Questionário curto antes e depois do jogo para medir aprendizagem.
