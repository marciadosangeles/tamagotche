/* Registro de acessos (GoatCounter) e de partidas (Planilha Google).
   Nada é enviado quando:
   - o campo correspondente em config.js está vazio;
   - o jogo roda no próprio computador (arquivo local ou localhost);
   - o endereço tem ?rapido ou ?teste (para não misturar testes com dados reais);
   - a pessoa escolheu "Não enviar meus dados" em "Sobre o jogo".
   Não há nome, e-mail, foto nem localização exata. O identificador do aparelho
   é um número sorteado, guardado só no navegador. */
window.REGISTRO = (function () {
  'use strict';

  const C = window.TAMAGOTCHE_CONFIG || {};
  const VERSAO = '0.3';
  const K_RECUSA = 'tamagotche.semDados';
  const K_ID = 'tamagotche.idJogador';

  const ler = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const gravar = (k, v) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { /* sem armazenamento */ } };
  const sorteio = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

  const params = new URLSearchParams(location.search);
  const local = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\]|)$/.test(location.hostname);
  const teste = params.has('rapido') || params.has('teste');
  let recusou = ler(K_RECUSA) === '1';

  const configurado = () => !!(C.goatcounter || C.planilha);
  const ativo = () => configurado() && !recusou && !local && !teste;

  let idJogador = ler(K_ID);
  if (!idJogador) { idJogador = sorteio(); gravar(K_ID, idJogador); }

  /* ---------- GoatCounter: visitas e eventos ---------- */
  const fila = [];
  let gcPronto = false;
  function carregarGoatCounter() {
    if (!C.goatcounter || !ativo() || document.getElementById('gc-script')) return;
    const s = document.createElement('script');
    s.id = 'gc-script';
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = `https://${C.goatcounter}.goatcounter.com/count`;
    s.onload = () => { gcPronto = true; fila.splice(0).forEach(enviarEvento); };
    document.head.appendChild(s);
  }
  function enviarEvento(nome) {
    try { window.goatcounter.count({ path: nome, title: nome, event: true }); } catch (e) { /* ignora */ }
  }
  function evento(nome) {
    if (!C.goatcounter || !ativo()) return;
    if (gcPronto && window.goatcounter && window.goatcounter.count) enviarEvento(nome);
    else fila.push(nome);
  }

  /* ---------- Planilha: uma linha por partida ---------- */
  function sessao(dados, forcar) {
    if (!C.planilha || (!ativo() && !forcar)) return false;
    const corpo = JSON.stringify(Object.assign({
      app: 'tamagotche', versao: VERSAO, id_jogador: idJogador,
      dispositivo: matchMedia('(pointer: coarse)').matches ? 'toque' : 'mouse',
      largura_tela: window.innerWidth, idioma: navigator.language || ''
    }, dados));
    // text/plain evita a checagem prévia (CORS) que o Apps Script não responde
    const blob = new Blob([corpo], { type: 'text/plain;charset=utf-8' });
    let foi = false;
    try { foi = navigator.sendBeacon && navigator.sendBeacon(C.planilha, blob); } catch (e) { foi = false; }
    if (!foi) {
      fetch(C.planilha, { method: 'POST', mode: 'no-cors', keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: corpo }).catch(() => {});
    }
    return true;
  }

  // Estado do registro, para o modo ?diagnostico
  function estado() {
    return {
      goatcounter: C.goatcounter || '(vazio)',
      planilha: C.planilha ? 'configurada' : '(vazia)',
      recusou, local, teste, ativo: ativo(),
      gcCarregado: !!(window.goatcounter && window.goatcounter.count)
    };
  }

  /* ---------- contador público no rodapé ---------- */
  function mostrarContador(el) {
    if (!el || !C.goatcounter) return;
    fetch(`https://${C.goatcounter}.goatcounter.com/counter/TOTAL.json`)
      .then(r => r.ok ? r.json() : null)
      .then(j => {
        if (!j || !j.count) return;
        el.textContent = `${j.count} visitas`;
        el.hidden = false;
      })
      .catch(() => {});
  }

  function recusar(sim) {
    recusou = !!sim;
    gravar(K_RECUSA, sim ? '1' : null);
    if (!sim) carregarGoatCounter();
  }

  carregarGoatCounter();

  return {
    evento, sessao, mostrarContador, recusar, configurado, estado,
    novaPartida: sorteio,
    get recusou() { return recusou; },
    get ativo() { return ativo(); }
  };
})();
