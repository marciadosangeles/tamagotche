/**
 * @OnlyCurrentDoc
 * A linha acima limita o script a ESTA planilha: ele não consegue abrir
 * nenhum outro arquivo do seu Google Drive, nem e-mail, nem a conta.
 *
 * TamagoTchÊ: recebe o resumo de cada partida e grava uma linha na aba "sessoes".
 * Como instalar: veja planilha/LEIA-ME.md.
 */
const CAMPOS = [
  'versao', 'id_jogador', 'id_partida', 'especie', 'motivo', 'fase_final',
  'tempo_jogo_s', 'tempo_real_s', 'bicho', 'ambiente', 'gente',
  'cartas', 'cartas_total', 'cartas_lidas',
  'escolhas_boas', 'escolhas_ruins', 'escolhas',
  'pausas_feitas', 'pausas_oferecidas', 'vel_max', 'fotos',
  'dispositivo', 'largura_tela', 'idioma'
];

function doPost(e) {
  const trava = LockService.getScriptLock();
  trava.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.app !== 'tamagotche') return resposta('ignorado');
    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    const aba = planilha.getSheetByName('sessoes') || planilha.insertSheet('sessoes');
    if (aba.getLastRow() === 0) {
      aba.appendRow(['recebido_em'].concat(CAMPOS));
      aba.setFrozenRows(1);
    }
    aba.appendRow([new Date()].concat(CAMPOS.map(c => limpar(d[c]))));
    return resposta('ok');
  } catch (err) {
    return resposta('erro');
  } finally {
    trava.releaseLock();
  }
}

// Abrir o endereço no navegador mostra se o registro está no ar.
function doGet() {
  return resposta('TamagoTchÊ: registro de partidas ativo.');
}

// Aceita só números e textos curtos. Impede que um texto vire fórmula na planilha.
function limpar(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'number' && isFinite(v)) return v;
  let t = String(v).slice(0, 500);
  if (/^[=+\-@]/.test(t)) t = "'" + t;
  return t;
}

function resposta(texto) {
  return ContentService.createTextOutput(texto);
}
