(function () {
  'use strict';

  const VIDA = 720;                 // duração da sessão em segundos (12 min)
  const PAUSAS_EM = [200, 420, 620];// momentos das pausas ativas
  const PAUSA_ENTRE_JOGOS = 5 * 60 * 1000;
  const K_SAVE = 'tamagotche.save.v1';
  const K_HIST = 'tamagotche.hist.v1';
  const W = 96, H = 72;             // resolução da cena em pixels
  // ?rapido no endereço acelera o tempo (para testes e demonstrações)
  const VEL_TESTE = new URLSearchParams(location.search).has('rapido') ? 25 : 0;
  const VELOCIDADES = [1, 2, 4];   // botão de velocidade no topo da tela
  let vel = 1, acum = 0;

  const guarda = {
    ler(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } },
    apagar(k) { try { localStorage.removeItem(k); } catch (e) { /* sem armazenamento */ } }
  };

  const $ = s => document.querySelector(s);
  const viewEl = $('#view');
  const modalEl = $('#modal');
  const B = { comer: $('#b-comer'), cuidar: $('#b-cuidar'), ambiente: $('#b-ambiente'), saber: $('#b-saber'), foto: $('#b-foto') };

  let S = null;          // estado da partida
  let tela = 'inicio';   // inicio | jogo | fim
  let modal = null;      // janela aberta (pausa o tempo)
  let ctx = null;
  let msgAte = 0;
  const anim = { x: 50, dir: 1, coracaoAte: 0 };

  const lim = v => Math.max(0, Math.min(100, v));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const esp = () => ESPECIES[S.especie];
  const fase = () => {
    const fs = esp().fases; let acc = 0;
    for (let i = 0; i < fs.length; i++) { acc += fs[i].dur; if (S.t < acc) return Object.assign({ idx: i }, fs[i]); }
    return Object.assign({ idx: fs.length - 1 }, fs[fs.length - 1]);
  };
  const G = () => (S && esp().g) || 'a';            // gênero das frases
  const pron = () => G() === 'a' ? 'ela' : 'ele';
  const um = () => G() === 'a' ? 'uma' : 'um';
  const iBicho = () => (S.sac + S.ene + S.sau + S.hum) / 4;
  const iAmb = () => (S.agua + S.mata + (100 - S.lixo)) / 3;
  const iGente = () => (S.gsau + S.saber) / 2;

  function aplicar(ef) {
    if (!ef) return;
    for (const k in ef) if (k in S) S[k] = lim(S[k] + ef[k]);
  }

  /* ---------------- partida ---------------- */
  function novoJogo(especie) {
    S = {
      especie, t: 0,
      sac: 75, ene: 80, sau: 90, hum: 75,
      agua: 65, mata: 40, lixo: 35,
      gsau: 85, saber: 15,
      dormindo: false, proxEvento: 40, eventosFeitos: [],
      cartas: ['saude_unica', 'povos'], velMax: 1, lidas: [], cd: {}, faseIdx: 0,
      boas: 0, ruins: 0, pausasFeitas: 0, pausasOferecidas: 0, inicio: Date.now()
    };
    anim.x = 50; anim.dir = 1; vel = 1; acum = 0;
    tela = 'jogo'; modal = null;
    renderTela();
    mensagem(esp().nascimento, 7000);
  }

  function tick() {
    S.t += 1;
    const f = fase();
    const r = f.ritmo;
    if (S.dormindo) {
      S.ene = lim(S.ene + 2.5); S.sac = lim(S.sac - 0.2 * r);
      if (S.ene >= 100) { S.dormindo = false; mensagem(`Acordou descansad${G()}!`); }
    } else {
      S.sac = lim(S.sac - 0.4 * r);
      S.ene = lim(S.ene - 0.25 * r);
      S.hum = lim(S.hum - 0.22 * r);
      if (S.ene <= 3) { S.dormindo = true; mensagem(`Exaust${G()}, adormeceu sozinh${G()}. Lembre de deixar descansar!`, 6000); }
    }
    // ambiente: lixo acumula; a água acompanha a mata ciliar e piora com lixo
    S.lixo = lim(S.lixo + 0.06);
    S.agua = lim(S.agua + (S.mata - S.agua) * 0.004 - (S.lixo > 50 ? 0.08 : 0));

    // Saúde Única: o bicho sente o ambiente; as pessoas sentem os dois
    const amb = iAmb();
    let d = 0;
    if (S.sac < 25) d -= 0.5;
    if (S.ene < 15) d -= 0.3;
    if (amb < 45) d -= 0.35;
    if (S.hum < 20) d -= 0.15;
    if (d === 0 && S.sac > 50 && amb > 55) d = 0.15;
    if (f.id === 'idoso' && d < 0) d *= 1.3;
    S.sau = lim(S.sau + d);
    S.gsau = lim(S.gsau + (amb < 45 ? -0.15 : 0.04) + (S.sau < 35 ? -0.1 : 0));

    if (f.idx !== S.faseIdx) {
      S.faseIdx = f.idx;
      anim.coracaoAte = performance.now() + 2500;
      mensagem(f.msg, 7000);
    }

    if (S.sau <= 0) return fim('resgate');
    if (S.t >= VIDA) return fim('legado');

    if (PAUSAS_EM.includes(S.t)) abrirPausa();
    else if (S.t >= S.proxEvento) abrirEvento();

    if (S.t % 5 === 0) guarda.gravar(K_SAVE, S);
    atualizarHud();
  }

  function fim(motivo) {
    S.fim = motivo;
    const reg = { data: new Date().toISOString(), especie: S.especie, motivo, t: S.t,
      bicho: Math.round(iBicho()), ambiente: Math.round(iAmb()), gente: Math.round(iGente()),
      cartas: S.cartas.length, velMax: S.velMax || 1, boas: S.boas, ruins: S.ruins,
      pausasFeitas: S.pausasFeitas, pausasOferecidas: S.pausasOferecidas };
    const hist = guarda.ler(K_HIST) || [];
    hist.push(reg); guarda.gravar(K_HIST, hist.slice(-50));
    guarda.apagar(K_SAVE);
    guarda.gravar('tamagotche.ultimoFim', Date.now());
    tela = 'fim'; modal = null;
    renderTela();
  }

  /* ---------------- mensagens e HUD ---------------- */
  function mensagem(txt, ms = 5000) {
    msgAte = Date.now() + ms;
    const el = $('#msg'); if (el) el.textContent = txt;
  }
  function dicaPadrao() {
    if (S.dormindo) return 'Dormindo... zzz';
    if (S.sau < 35) return 'Não estou bem... preciso de cuidado.';
    if (S.sac < 30) return 'Estou com fome!';
    if (S.ene < 20) return `Estou cansad${G()}...`;
    if (iAmb() < 45) return 'O ambiente precisa de cuidado!';
    if (S.hum < 30) return 'Quero explorar!';
    return 'Tudo tranquilo por aqui.';
  }
  function atualizarHud() {
    if (tela !== 'jogo') return;
    const f = fase();
    const resta = Math.max(0, VIDA - S.t);
    $('#fase').textContent = `${esp().nome} ${f.nome.toLowerCase()}`;
    $('#relogio').textContent = `${Math.floor(resta / 60)}:${String(resta % 60).padStart(2, '0')}`;
    [['bicho', iBicho()], ['amb', iAmb()], ['gente', iGente()]].forEach(([k, v]) => {
      const m = $('#m-' + k);
      m.querySelector('i').style.width = v + '%';
      m.querySelector('b').textContent = Math.round(v);
      m.classList.toggle('low', v < 35);
    });
    if (Date.now() > msgAte) $('#msg').textContent = dicaPadrao();
  }

  /* ---------------- telas ---------------- */
  function renderTela() {
    ctx = null;
    const jogando = tela === 'jogo';
    Object.values(B).forEach(b => { b.disabled = !jogando; });
    B.foto.disabled = !(jogando || tela === 'fim');
    if (tela === 'inicio') return renderInicio();
    if (tela === 'fim') return renderFim();

    viewEl.innerHTML = `
      <div class="hud"><span class="fase" id="fase"></span><span><button class="vel" id="vel" title="Velocidade do tempo">${vel}x</button> ⏳ <span id="relogio"></span></span></div>
      <canvas class="cena" id="cena" width="${W}" height="${H}" aria-label="Cena do habitat"></canvas>
      <div class="msg" id="msg" aria-live="polite"></div>
      <div class="meters">
        <div class="meter" id="m-bicho"><span>Bicho</span><div class="bar bicho"><i></i></div><b></b></div>
        <div class="meter" id="m-amb"><span>Ambiente</span><div class="bar amb"><i></i></div><b></b></div>
        <div class="meter" id="m-gente"><span>Gente</span><div class="bar gente"><i></i></div><b></b></div>
      </div>`;
    ctx = $('#cena').getContext('2d');
    $('#vel').onclick = () => {
      vel = VELOCIDADES[(VELOCIDADES.indexOf(vel) + 1) % VELOCIDADES.length];
      S.velMax = Math.max(S.velMax || 1, vel);
      $('#vel').textContent = vel + 'x';
      mensagem(vel === 1 ? 'Tempo normal.' : `Tempo ${vel}x mais rápido. As pausas ativas continuam no tempo real.`);
    };
    atualizarHud();
    renderModal();
  }

  function renderInicio() {
    const salvo = guarda.ler(K_SAVE);
    const cards = Object.entries(ESPECIES).map(([id, e]) => `
      <button class="sp ${e.disponivel ? '' : 'off'}" data-esp="${id}">
        ${e.disponivel ? `<canvas width="24" height="14" data-thumb="${id}"></canvas>` : '<span class="q">?</span>'}
        <span>${esc(e.nome)}</span>
        <small>${e.disponivel ? esc(e.cientifico) : 'em breve'}</small>
      </button>`).join('');
    viewEl.innerHTML = `
      <div class="pad">
        ${salvo ? `<button class="acao" id="continuar">Continuar com ${ESPECIES[salvo.especie].g === 'o' ? 'o' : 'a'} ${esc(ESPECIES[salvo.especie].nome.toLowerCase())}</button>` : ''}
        <h2>Escolha seu bicho</h2>
        <div class="grid">${cards}</div>
        <p class="dica">Cada vida dura cerca de 12 minutos. Cuide do bicho, do ambiente e das pessoas: isso é Saúde Única.</p>
      </div>`;
    viewEl.querySelectorAll('canvas[data-thumb]').forEach(c => {
      const nm = c.dataset.thumb + '_adulto', t = tamanhoSprite(nm);
      desenharSprite(c.getContext('2d'), nm, Math.floor((24 - t.w) / 2), Math.floor((14 - t.h) / 2));
    });
    viewEl.querySelectorAll('.sp').forEach(b => b.onclick = () => escolher(b.dataset.esp));
    const cont = $('#continuar');
    if (cont) cont.onclick = () => { S = salvo; tela = 'jogo'; anim.x = 50; renderTela(); mensagem('Que bom ver você de novo!'); };
    renderModal();
  }

  function escolher(id) {
    const e = ESPECIES[id];
    if (!e.disponivel) {
      return abrir({ tipo: 'aviso', titulo: e.nome, texto: `O ${e.nome} (${e.cientifico}) chega na próxima versão do jogo.` });
    }
    const ultimo = guarda.ler('tamagotche.ultimoFim');
    if (ultimo && Date.now() - ultimo < PAUSA_ENTRE_JOGOS) {
      return abrir({ tipo: 'escolha', titulo: 'Que tal uma pausa?', texto: 'Você acabou de terminar uma vida. Uma pausa de 5 minutos longe da tela faz bem para os olhos e para o corpo.',
        itens: [{ label: 'Ok, vou fazer uma pausa', fn: fechar }, { label: 'Jogar mesmo assim', fn: () => { fechar(); novoJogo(id); } }] });
    }
    novoJogo(id);
  }

  function renderFim() {
    const b = Math.round(iBicho()), a = Math.round(iAmb()), g = Math.round(iGente());
    const resgate = S.fim === 'resgate';
    const fracos = [['Bicho', b, 'alimentação natural e descanso'], ['Ambiente', a, 'lixo, água e mata ciliar'], ['Gente', g, 'prevenção e informação']].sort((x, y) => x[1] - y[1]);
    let titulo, texto;
    if (resgate) {
      titulo = 'Resgate';
      texto = `${G() === 'a' ? 'A' : 'O'} ${esp().nome.toLowerCase()} adoeceu e foi levad${G()} para reabilitação por uma equipe especializada. O ponto mais frágil foi ${fracos[0][0]}: preste atenção em ${fracos[0][2]}.`;
    } else if (fracos[0][1] >= 60) {
      titulo = 'Uma vida plena';
      texto = 'Viveu bem, teve filhotes e deixou um ambiente saudável para a próxima geração. Bicho, ambiente e gente juntos: isso é Saúde Única!';
    } else {
      titulo = 'Fim de uma vida';
      texto = `Viveu até a velhice e deixou filhotes. Da próxima vez, cuide mais de ${fracos[0][0]}: ${fracos[0][2]}.`;
    }
    const total = totalCartas();
    viewEl.innerHTML = `
      <div class="pad">
        <h2>${titulo}</h2>
        <p>${esc(texto)}</p>
        <ul class="scores">
          <li><span>Bicho</span><b>${b}</b></li>
          <li><span>Ambiente</span><b>${a}</b></li>
          <li><span>Gente</span><b>${g}</b></li>
          <li><span>Cartas de saber</span><b>${S.cartas.length}/${total}</b></li>
          <li><span>Escolhas cuidadosas</span><b>${S.boas}/${S.boas + S.ruins}</b></li>
          <li><span>Pausas ativas feitas</span><b>${S.pausasFeitas}/${S.pausasOferecidas}</b></li>
        </ul>
        <p class="dica">Hora de descansar os olhos. Que tal ir lá fora procurar um bicho de verdade? Sempre observando de longe!</p>
        <button class="acao" id="foto-fim">Foto de lembrança</button>
        <button class="acao sec" id="inicio">Voltar ao início</button>
      </div>`;
    $('#foto-fim').onclick = () => abrirFoto();
    $('#inicio').onclick = () => { tela = 'inicio'; S = null; renderTela(); };
    renderModal();
  }

  /* ---------------- janelas ---------------- */
  function abrir(m) { modal = m; renderModal(); }
  function fechar() { pararCamera(); modal = null; renderModal(); if (tela === 'jogo') atualizarHud(); }

  function renderModal() {
    if (!modal) { modalEl.hidden = true; modalEl.innerHTML = ''; return; }
    modalEl.hidden = false;
    const m = modal;
    let html = '';
    if (m.tag) html += `<span class="tag">${esc(m.tag)}</span>`;
    if (m.titulo) html += `<h3>${esc(m.titulo)}</h3>`;
    if (m.texto) html += `<p class="${m.classe || ''}">${esc(m.texto)}</p>`;

    if (m.tipo === 'escolha' || m.tipo === 'evento') {
      html += m.itens.map((it, i) => `<button class="op" data-i="${i}" ${it.off ? 'disabled' : ''}>${esc(it.label)}${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</button>`).join('');
      if (m.tipo === 'escolha' && m.voltar !== false) html += '<button class="acao sec" data-x>Voltar</button>';
    } else if (m.tipo === 'foto') {
      html += htmlFoto(m);
    } else if (m.tipo === 'pausa') {
      const resta = Math.max(0, Math.ceil((m.ate - Date.now()) / 1000));
      html += `<div class="contagem" id="contagem">${resta || '✓'}</div>
        <div><button class="acao" id="fiz" ${resta ? 'disabled' : ''}>Fiz!</button><button class="acao sec" data-x>Agora não</button></div>`;
    } else {
      html += `<div><button class="acao" data-x>${esc(m.ok || 'Entendi')}</button></div>`;
    }
    modalEl.innerHTML = html;
    modalEl.querySelectorAll('.op').forEach(b => b.onclick = () => m.itens[+b.dataset.i].fn());
    modalEl.querySelectorAll('[data-x]').forEach(b => b.onclick = () => { const cb = m.aoFechar; fechar(); if (cb) cb(); });
    const fiz = $('#fiz');
    if (fiz) fiz.onclick = () => {
      S.pausasFeitas++; aplicar({ hum: 10, gsau: 5 }); liberarCarta('pausa');
      fechar(); anim.coracaoAte = performance.now() + 2000;
      mensagem('Pausa feita! Corpo e mente agradecem.');
    };
    if (m.tipo === 'foto') ligarFoto(m);
    const primeiro = modalEl.querySelector('button:not([disabled])');
    if (primeiro) primeiro.focus({ preventScroll: true });
  }

  // cartas que esta espécie pode liberar
  function totalCartas() {
    const ids = new Set(['saude_unica', 'povos', 'pausa']);
    esp().eventos.forEach(e => EVENTOS[e] && EVENTOS[e].card && ids.add(EVENTOS[e].card));
    esp().comidas.forEach(c => c.card && ids.add(c.card));
    return ids.size;
  }

  function liberarCarta(id) {
    if (!id || S.cartas.includes(id)) return false;
    S.cartas.push(id); return true;
  }

  function feedback(boa, texto, carta, extra) {
    if (boa) { S.boas++; anim.coracaoAte = performance.now() + 2000; } else S.ruins++;
    const nova = liberarCarta(carta);
    abrir({
      tipo: 'aviso', tag: boa ? 'Boa escolha' : 'Opa...', classe: boa ? 'fb-boa' : 'fb-ruim',
      titulo: '', texto: texto + (extra ? ' ' + extra : '') + (nova ? `\n\nNova carta de saber: “${CARTAS[carta].titulo}”.` : ''),
      ok: nova ? 'Ler a carta' : 'Entendi',
      aoFechar: nova ? () => abrirCarta(carta) : null
    });
  }

  function abrirEvento() {
    const lista = esp().eventos.filter(id => !S.eventosFeitos.includes(id) && EVENTOS[id].fase <= fase().idx);
    S.proxEvento = S.t + 55 + Math.floor(Math.random() * 30);
    if (!lista.length) return;
    const id = lista[Math.floor(Math.random() * lista.length)];
    const ev = EVENTOS[id];
    S.eventosFeitos.push(id);
    aplicar(ev.ef);
    abrir({
      tipo: 'evento', tag: 'Acontecimento', titulo: ev.titulo, texto: ev.texto,
      itens: ev.opcoes.map(o => ({ label: o.txt, fn: () => {
        aplicar(o.ef);
        if (!o.boa) aplicar({ saber: 3 });
        feedback(o.boa, o.fb, ev.card);
      } }))
    });
  }

  function abrirPausa() {
    S.pausasOferecidas++;
    const p = PAUSAS[(S.pausasOferecidas * 3 + Math.floor(Math.random() * 3)) % PAUSAS.length];
    abrir({ tipo: 'pausa', tag: 'Pausa ativa · ' + p.tipo, titulo: 'Hora de se mexer!', texto: p.texto, ate: Date.now() + p.seg * 1000 });
  }

  function abrirCarta(id) {
    const c = CARTAS[id];
    if (!S.lidas.includes(id)) { S.lidas.push(id); aplicar({ saber: 4 }); }
    abrir({ tipo: 'aviso', tag: 'Carta de saber · ' + c.pilar, titulo: c.titulo, texto: c.texto });
  }

  /* ---------------- ações ---------------- */
  const podeAgir = () => tela === 'jogo' && S && !modal;
  const espera = id => Math.max(0, (S.cd[id] || 0) - S.t);
  const recarga = (id, s) => { S.cd[id] = S.t + s; };
  const dormindoAviso = () => { mensagem('Shhh... está dormindo. Espere acordar.'); return true; };

  const ehOvo = () => fase().id === 'ovo';
  B.comer.onclick = () => {
    if (!podeAgir()) return;
    if (ehOvo()) return mensagem('Ovo não come! Use "Cuidar" para proteger o ninho.', 5000);
    if (S.dormindo) return dormindoAviso();
    abrir({ tipo: 'escolha', titulo: 'O que oferecer?', itens: esp().comidas.map(c => ({
      label: c.nome,
      fn: () => {
        fechar();
        const falta = Object.entries(c.precisa || {}).some(([k, v]) => v >= 0 ? S[k] < v : S[k] > -v);
        if (falta) return mensagem(c.falta, 6000);
        if (S.sac > 90) { aplicar({ hum: -2 }); return mensagem(`Está satisfeit${G()}! Comer demais também faz mal.`); }
        aplicar(c.ef);
        if (c.boa) { anim.coracaoAte = performance.now() + 1500; mensagem(c.fb); }
        else { S.ruins++; const nova = liberarCarta(c.card); mensagem(c.fb + (nova ? ' Nova carta de saber!' : ''), 7000); }
        atualizarHud();
      }
    })) });
  };

  B.cuidar.onclick = () => {
    if (!podeAgir()) return;
    if (S.dormindo) return dormindoAviso();
    const vet = espera('vet');
    const vetItem = { label: 'Chamar a veterinária de fauna', sub: vet ? `Disponível em ${vet}s` : 'Só profissionais tratam bichos silvestres', off: vet > 0, fn: () => {
      fechar();
      if (S.sau >= 60) return mensagem(`Está tudo bem com ${pron()}. A veterinária volta quando for preciso.`);
      recarga('vet', 90); aplicar({ sau: 25 }); mensagem('A veterinária examinou e tratou. Ótima decisão!', 6000);
    } };
    if (ehOvo()) {
      const o = esp().ovo, w = espera('ninho');
      return abrir({ tipo: 'escolha', titulo: 'Cuidar do ninho', itens: [
        { label: o.label, sub: w ? `Disponível em ${w}s` : o.sub, off: w > 0, fn: () => {
          fechar(); recarga('ninho', 15); aplicar({ hum: 15, ene: 10, sau: 3 });
          anim.coracaoAte = performance.now() + 1500; mensagem(o.ok);
        } },
        vetItem
      ] });
    }
    const bn = esp().banho;
    abrir({ tipo: 'escolha', titulo: 'Cuidar', itens: [
      { label: 'Descansar', sub: 'Recupera energia', fn: () => { fechar(); S.dormindo = true; mensagem('Boa noite... zzz'); } },
      { label: 'Explorar', sub: 'Mais humor, menos energia', fn: () => {
        fechar(); aplicar({ hum: 20, ene: -15, sac: -5 });
        const lixo = Math.random() < 0.4;
        mensagem(lixo ? 'Encontrou um lugar novo... e um pouco de lixo pelo caminho.' : 'Que passeio bom!');
        if (lixo) aplicar({ lixo: 5 });
      } },
      { label: bn.label, sub: bn.sub, fn: () => {
        fechar();
        if (bn.agua && S.agua < 40) { aplicar({ sau: -10 }); mensagem(bn.ruim, 6000); }
        else { aplicar({ hum: 10, sau: 5 }); mensagem(bn.ok); anim.coracaoAte = performance.now() + 1500; }
      } },
      vetItem
    ] });
  };

  B.ambiente.onclick = () => {
    if (!podeAgir()) return;
    const it = (id, label, sub, s, ef, txt) => {
      const w = espera(id);
      return { label, sub: w ? `Disponível em ${w}s` : sub, off: w > 0, fn: () => {
        fechar(); recarga(id, s); aplicar(ef); mensagem(txt); atualizarHud();
      } };
    };
    abrir({ tipo: 'escolha', titulo: 'Cuidar do ambiente', itens: [
      it('lixo', 'Recolher lixo', 'Menos lixo, menos ratos e doenças', 10, { lixo: -25, gsau: 2 }, 'Lixo recolhido e separado!'),
      it('mata', 'Plantar mudas nativas', 'Mata ciliar protege a água', 40, { mata: 12 }, 'Mudas plantadas na margem. Elas vão crescer!'),
      it('esgoto', 'Denunciar esgoto irregular', 'Água limpa para bichos e gente', 60, { agua: 15, gsau: 3 }, 'Denúncia feita. O esgoto foi ligado à rede.')
    ] });
  };

  B.saber.onclick = () => {
    if (!podeAgir()) return;
    abrir({ tipo: 'escolha', titulo: `Cartas de saber (${S.cartas.length}/${totalCartas()})`,
      texto: 'Novas cartas aparecem com os acontecimentos.',
      itens: S.cartas.map(id => ({ label: CARTAS[id].titulo, sub: CARTAS[id].pilar + (S.lidas.includes(id) ? '' : ' · nova!'), fn: () => abrirCarta(id) })) });
  };

  $('#b-sobre').onclick = () => abrir({ tipo: 'aviso', titulo: 'Sobre o jogo', ok: 'Fechar',
    texto: 'O Tamagotchê é um jogo de cuidado com a fauna do Rio Grande do Sul baseado na abordagem de Saúde Única: a saúde das pessoas, dos animais e do ambiente é uma só.\n\nAs sessões são curtas e têm pausas ativas de propósito.\n\nAs faixas da moldura homenageiam três povos originários do RS:\n• Kaingang (topo): marcas compridas e redondas, rá téi e rá ror.\n• Charrua (meio): linhas paralelas da pintura corporal descrita em registros históricos e a boleadeira. A arte Charrua é pouco documentada; esta faixa precisa ser construída com a comunidade Charrua.\n• Mbyá Guarani (base): o zigue-zague do movimento da cobra e o losango da casa, da cestaria de taquara (ypara).\nEsses grafismos pertencem a esses povos. O uso aqui é uma homenagem que deve ser validada com as comunidades.' });

  /* ---------------- foto com o bicho ----------------
     A câmera só abre quando a pessoa pede. A imagem é montada no próprio
     aparelho e só sai dele se a pessoa escolher compartilhar ou baixar. */
  let fluxo = null;
  function pararCamera() {
    if (fluxo) { fluxo.getTracks().forEach(t => t.stop()); fluxo = null; }
  }

  function abrirFoto() {
    if (!S) return;
    abrir({ tipo: 'foto', etapa: 'intro', tag: 'Tamagotchê', titulo: 'Foto com o bicho', texto: TEXTO_FOTO });
  }
  const TEXTO_FOTO = 'Tire uma selfie com seu bicho e compartilhe sua experiência. A foto fica só no seu aparelho, a menos que você escolha compartilhar.\nCrianças: peçam ajuda a um adulto antes de postar.';
  B.foto.onclick = () => {
    if (!S || modal || !(tela === 'jogo' || tela === 'fim')) return;
    abrirFoto();
  };

  function htmlFoto(m) {
    let h = m.erro ? `<p class="fb-ruim">${esc(m.erro)}</p>` : '';
    if (m.etapa === 'intro') {
      h += `<div><button class="acao" id="abrir-cam">Abrir câmera</button>
        <button class="acao sec" id="sem-cam">Cartão sem foto</button>
        <button class="acao sec" data-x>Voltar</button></div>`;
    } else if (m.etapa === 'camera') {
      h += `<div class="cam"><video id="video" playsinline autoplay muted></video><canvas id="cam-bicho"></canvas></div>
        <div><button class="acao" id="clicar">Tirar foto</button><button class="acao sec" data-x>Voltar</button></div>`;
    } else if (m.etapa === 'pronta') {
      h += `<img class="foto-pronta" src="${m.url}" alt="Cartão do Tamagotchê com o bicho">
        <div>${podeCompartilhar(m) ? '<button class="acao" id="compart">Compartilhar</button>' : ''}
        <button class="acao ${podeCompartilhar(m) ? 'sec' : ''}" id="baixar">Baixar</button>
        <button class="acao sec" id="outra">Outra</button>
        <button class="acao sec" data-x>Fechar</button></div>`;
    }
    return h;
  }

  function ligarFoto(m) {
    const on = (id, fn) => { const el = $('#' + id); if (el) el.onclick = fn; };
    on('abrir-cam', async () => {
      m.erro = '';
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        m.erro = 'Este navegador não permite usar a câmera aqui. Faça o cartão sem foto ou abra o jogo pelo endereço https.';
        return renderModal();
      }
      try {
        fluxo = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
        if (modal !== m) return pararCamera();
        m.etapa = 'camera'; m.texto = 'Enquadre seu rosto. O bicho entra no canto da foto.'; renderModal();
      } catch (e) {
        m.erro = 'Não foi possível abrir a câmera (permissão negada ou câmera indisponível). Você pode fazer o cartão sem foto.';
        renderModal();
      }
    });
    on('sem-cam', () => gerarCartao(m, null));
    on('clicar', () => gerarCartao(m, $('#video')));
    on('outra', () => { m.etapa = 'intro'; m.erro = ''; m.texto = TEXTO_FOTO; renderModal(); });
    on('baixar', () => baixar(m));
    on('compart', async () => {
      try { await navigator.share({ files: [m.arquivo], title: 'Tamagotchê', text: textoPost() }); }
      catch (e) { if (e && e.name !== 'AbortError') baixar(m); }
    });
    if (m.etapa === 'camera') {
      const v = $('#video'); v.srcObject = fluxo; v.play().catch(() => {});
      const nome = spriteAtual(), { w, h } = tamanhoSprite(nome);
      const c = $('#cam-bicho'); c.width = w; c.height = h;
      desenharSprite(c.getContext('2d'), nome, 0, 0, { espelhar: true });
    }
  }

  const podeCompartilhar = m => !!(m.arquivo && navigator.canShare && navigator.canShare({ files: [m.arquivo] }));
  const spriteAtual = () => `${S.especie}_${fase().id}`;
  function textoPost() {
    const nome = esp().nome.toLowerCase();
    const link = /^https?:/.test(location.protocol) ? ' ' + location.origin + location.pathname : '';
    return `Cuidei de ${um()} ${nome} no Tamagotchê, um jogo de Saúde Única com bichos do Rio Grande do Sul! #Tamagotchê #SaúdeÚnica${link}`;
  }
  function baixar(m) {
    const a = document.createElement('a');
    a.href = m.url; a.download = 'tamagotche.jpg';
    document.body.appendChild(a); a.click(); a.remove();
  }

  // desenha uma imagem "cobrindo" o retângulo, como object-fit: cover
  function cobrir(g, img, iw, ih, x, y, w, h, espelhar) {
    const r = Math.max(w / iw, h / ih), sw = w / r, sh = h / r;
    g.save();
    if (espelhar) { g.translate(x + w, y); g.scale(-1, 1); x = 0; y = 0; }
    g.drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, x, y, w, h);
    g.restore();
  }

  function gerarCartao(m, video) {
    const C = document.createElement('canvas'); C.width = 1080; C.height = 1350;
    const g = C.getContext('2d'); g.imageSmoothingEnabled = false;
    g.fillStyle = '#e9d6a6'; g.fillRect(0, 0, 1080, 1350);
    faixa(g, 'kaingang', 0, 0, 1080, 56);
    g.fillStyle = '#2b211c'; g.textAlign = 'center';
    g.font = 'bold 64px "Press Start 2P", monospace';
    if (g.measureText('Tamagotchê').width > 980) g.font = 'bold 48px "Press Start 2P", monospace';
    g.fillText('Tamagotchê', 540, 140);
    g.fillStyle = '#8a3220'; g.font = '40px VT323, monospace';
    g.fillText('Bichos do Sul · Saúde Única', 540, 182);

    const px = 60, py = 205, pw = 960, ph = 860;
    g.fillStyle = '#2b211c'; g.fillRect(px - 12, py - 12, pw + 24, ph + 24);
    const comFoto = video && video.videoWidth;
    if (comFoto) {
      cobrir(g, video, video.videoWidth, video.videoHeight, px, py, pw, ph, true);
      // bicho grande no canto, sobre um montinho de capim
      const nome = spriteAtual(), { w, h } = tamanhoSprite(nome);
      const esc2 = Math.floor(Math.min(320 / w, 220 / h));
      const bx = px + pw - w * esc2 - 30, by = py + ph - h * esc2 - 24;
      g.fillStyle = 'rgba(79,138,58,.92)';
      g.beginPath(); g.ellipse(bx + w * esc2 / 2, py + ph - 20, w * esc2 / 2 + 30, 34, 0, 0, Math.PI * 2); g.fill();
      g.save(); g.translate(bx, by); g.scale(esc2, esc2); desenharSprite(g, nome, 0, 0, { espelhar: true }); g.restore();
    } else {
      const off = document.createElement('canvas'); off.width = W; off.height = H;
      desenhar(performance.now(), off.getContext('2d'), false);
      cobrir(g, off, W, H, px, py, pw, ph, false);
    }

    const f = fase();
    const nome = esp().nome.toLowerCase();
    const frase = S.fim ? `Cuidei de ${um()} ${nome} do nascimento à velhice!` : `Estou cuidando de ${um()} ${nome} ${f.nome.toLowerCase()}!`;
    g.fillStyle = '#2b211c';
    textoCabe(g, frase, 540, 1132, 52, 980);
    textoCabe(g, `Bicho ${Math.round(iBicho())} · Ambiente ${Math.round(iAmb())} · Gente ${Math.round(iGente())}`, 540, 1180, 42, 980);
    g.fillStyle = '#5d7f3a'; textoCabe(g, '#Tamagotchê  #SaúdeÚnica', 540, 1226, 42, 980);
    faixa(g, 'charrua', 0, 1250, 1080, 46);
    faixa(g, 'guarani', 0, 1296, 1080, 54);

    pararCamera();
    C.toBlob(blob => {
      if (!blob) { m.erro = 'Não consegui gerar a imagem.'; return renderModal(); }
      if (m.url) URL.revokeObjectURL(m.url);
      m.arquivo = new File([blob], 'tamagotche.jpg', { type: 'image/jpeg' });
      m.url = URL.createObjectURL(blob);
      m.etapa = 'pronta'; m.erro = ''; m.texto = 'Pronto! Compartilhe ou baixe para postar.';
      renderModal();
    }, 'image/jpeg', 0.9);
  }

  function textoCabe(g, txt, x, y, px, max) {
    do { g.font = `${px}px VT323, monospace`; px -= 2; } while (g.measureText(txt).width > max && px > 16);
    g.fillText(txt, x, y);
  }

  /* Faixas de grafismos desenhadas no cartão (as mesmas da moldura). */
  function faixa(g, tipo, x, y, w, h) {
    g.save();
    g.beginPath(); g.rect(x, y, w, h); g.clip();
    const tq = '#e9d6a6', jp = '#2b211c', ur = '#b5452b';
    g.lineJoin = 'round';
    if (tipo === 'kaingang') {
      g.fillStyle = tq; g.fillRect(x, y, w, h);
      g.fillStyle = ur; g.fillRect(x, y, w, h * .1); g.fillRect(x, y + h * .9, w, h * .1);
      const t = h * 2.6;
      for (let tx = x; tx < x + w; tx += t) {
        g.strokeStyle = jp; g.lineWidth = h * .12; g.beginPath();
        g.moveTo(tx, y + h * .72);
        for (let i = 1; i <= 4; i++) g.lineTo(tx + t * .15 * i, y + (i % 2 ? h * .28 : h * .72));
        g.stroke();
        g.beginPath(); g.arc(tx + t * .8, y + h / 2, h * .2, 0, Math.PI * 2); g.stroke();
      }
    } else if (tipo === 'guarani') {
      g.fillStyle = tq; g.fillRect(x, y, w, h);
      const t = h * 1.6;
      for (let tx = x; tx < x + w; tx += t) {
        g.fillStyle = jp; losango(g, tx + t / 2, y + h / 2, t * .42, h * .42);
        g.fillStyle = ur; losango(g, tx + t / 2, y + h / 2, t * .2, h * .2);
        g.strokeStyle = jp; g.lineWidth = h * .07; g.beginPath();
        g.moveTo(tx, y + h * .12); g.lineTo(tx + t * .25, y + h * .02); g.lineTo(tx + t * .5, y + h * .12);
        g.lineTo(tx + t * .75, y + h * .02); g.lineTo(tx + t, y + h * .12); g.stroke();
      }
    } else if (tipo === 'charrua') {
      g.fillStyle = '#b07a45'; g.fillRect(x, y, w, h);
      g.fillStyle = jp;
      [.12, .3, .7, .88].forEach(p => g.fillRect(x, y + h * p - h * .04, w, h * .08));
      const t = h * 3;
      for (let tx = x + t / 2; tx < x + w; tx += t) {
        const pts = [[-.7, -.05], [.7, -.05], [0, .12]];
        g.strokeStyle = jp; g.lineWidth = h * .05;
        pts.forEach(([a, b]) => { g.beginPath(); g.moveTo(tx, y + h / 2); g.lineTo(tx + a * h, y + h / 2 + b * h); g.stroke(); });
        pts.forEach(([a, b]) => { g.fillStyle = '#f1e7d2'; g.beginPath(); g.arc(tx + a * h, y + h / 2 + b * h, h * .13, 0, Math.PI * 2); g.fill(); g.stroke(); });
      }
    }
    g.restore();
  }
  function losango(g, cx, cy, rx, ry) {
    g.beginPath(); g.moveTo(cx, cy - ry); g.lineTo(cx + rx, cy); g.lineTo(cx, cy + ry); g.lineTo(cx - rx, cy); g.closePath(); g.fill();
  }

  /* ---------------- cena ----------------
     Cada habitat tem seu cenário. A cor da água, o número de árvores
     e o lixo mostram o estado do ambiente. */
  const ARVORES = [4, 16, 28, 42, 56, 70, 84];
  const CAPINS = [[44, 61], [66, 63], [86, 60], [36, 67], [58, 66], [76, 68]];
  const LIXOS = [[40, 63], [60, 68], [79, 62], [50, 66], [88, 69], [30, 68], [70, 66], [8, 68]];
  const LIXOS_AGUA = [[30, 47], [60, 63], [80, 51], [44, 69], [12, 58], [70, 43], [20, 67], [90, 65]];
  const HABITAT = {
    banhado: { lago: [18, 16], minX: 38, arvoresDiv: 14 },
    campo: { lago: [12, 10], minX: 26, arvoresDiv: 22 },
    mata: { lago: [10, 8], minX: 24, arvoresDiv: 12 }
  };

  function misturar(c1, c2, t) {
    const a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
    const ch = s => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t);
    return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
  }
  function circulo(ctx, cx, cy, r) {
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r) ctx.fillRect(cx + x, cy + y, 1, 1);
  }

  function ceu(ctx, noite) {
    ctx.fillStyle = noite ? '#2b3352' : '#cfe6e4';
    ctx.fillRect(0, 0, W, 42);
    ctx.fillStyle = noite ? '#ece6c8' : '#f2c14e';
    circulo(ctx, 84, 9, 5);
    if (noite) { ctx.fillStyle = '#2b3352'; circulo(ctx, 86, 8, 4); }
  }

  function cenarioTerra(ctx, hab, noite) {
    const H0 = HABITAT[hab];
    ctx.fillStyle = noite ? '#3d5a3a' : (hab === 'campo' ? '#9cbf68' : '#86ad5c');
    const alt = hab === 'campo' ? 4 : 2;
    for (let x = 0; x < W; x++) ctx.fillRect(x, 36 + Math.round(alt * Math.sin(x / (hab === 'campo' ? 11 : 7))), 1, 8);
    const amb = iAmb();
    ctx.fillStyle = noite ? '#4a6a3a' : misturar('#a9a45e', hab === 'campo' ? '#a3c463' : '#93b85e', Math.min(1, amb / 60));
    ctx.fillRect(0, 42, W, H - 42);
    const n = Math.round(S.mata / H0.arvoresDiv);
    if (hab === 'campo') {
      // capões de mato nas pontas do campo
      [2, 86, 10, 78].slice(0, n).forEach(x => desenharSprite(ctx, 'arvore', x, 34));
    } else {
      ARVORES.slice(0, n).forEach(x => desenharSprite(ctx, 'arvore', x, 34));
      if (hab === 'mata') [22, 50, 76].slice(0, Math.max(0, n - 5)).forEach(x => desenharSprite(ctx, 'arvore', x, 38));
    }
    const [cx, rx] = H0.lago, ry = Math.round(rx * 0.47);
    ctx.fillStyle = misturar('#6f7d48', '#4f9dc9', S.agua / 100);
    for (let y = -ry; y <= ry; y++) {
      const hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y / (ry + 0.5)) ** 2)));
      ctx.fillRect(cx - hw, 57 + y, hw * 2, 1);
    }
    CAPINS.forEach(([x, y]) => desenharSprite(ctx, 'capim', x, y - 3));
    if (hab === 'campo') [[30, 58], [52, 70], [92, 66]].forEach(([x, y]) => desenharSprite(ctx, 'capim', x, y - 3));
    LIXOS.slice(0, Math.round(S.lixo / 12)).forEach(([x, y], i) => desenharSprite(ctx, i % 2 ? 'sacola' : 'garrafa', x, y - 4));
    if (S.lixo > 60) desenharSprite(ctx, 'garrafa', cx - 4, 54);
  }

  function cenarioEstuario(ctx, noite, ts) {
    // margem ao fundo com mata e areia
    ctx.fillStyle = noite ? '#3d5a3a' : '#86ad5c';
    ctx.fillRect(0, 34, W, 4);
    ARVORES.slice(0, Math.round(S.mata / 14)).forEach(x => desenharSprite(ctx, 'arvore', x, 27));
    ctx.fillStyle = noite ? '#8a8060' : '#e3d3a0';
    ctx.fillRect(0, 37, W, 3);
    desenharSprite(ctx, 'pescador', 6, 31);
    // água: a cor mostra a qualidade
    const agua = misturar('#6f7d48', '#3f86b8', S.agua / 100);
    ctx.fillStyle = noite ? '#22344a' : agua;
    ctx.fillRect(0, 40, W, H - 40);
    ctx.fillStyle = noite ? '#3a5470' : misturar('#8a9a64', '#8cc3e3', S.agua / 100);
    const off = Math.floor(ts / 400) % 8;
    for (let y = 44; y < H; y += 6) for (let x = (y + off) % 8; x < W; x += 12) ctx.fillRect(x, y, 3, 1);
    LIXOS_AGUA.slice(0, Math.round(S.lixo / 12)).forEach(([x, y], i) => desenharSprite(ctx, i % 2 ? 'sacola' : 'garrafa', x, y - 4));
  }

  function desenhar(ts, ctx, mover = true) {
    const noite = S.dormindo;
    const hab = esp().habitat || 'banhado';
    const agua = hab === 'estuario';
    ceu(ctx, noite);
    if (agua) cenarioEstuario(ctx, noite, ts); else cenarioTerra(ctx, hab, noite);

    // bicho
    const f = fase();
    const nome = `${S.especie}_${f.id}`;
    const { w, h } = tamanhoSprite(nome);
    const ovo = f.id === 'ovo';
    const minX = agua ? 4 : HABITAT[hab].minX;
    if (ovo) anim.x = 58;
    else if (mover && !S.dormindo && !modal) {
      anim.x += anim.dir * 0.12 * Math.min(vel, 2) * (f.id === 'idoso' ? 0.6 : 1);
      if (anim.x > W - w - 2) anim.dir = -1;
      if (anim.x < minX) anim.dir = 1;
    }
    anim.x = Math.max(minX - 2, Math.min(W - w - 1, anim.x));
    // companhia do grupo, um pouco mais ao fundo
    ((esp().companhia || {})[f.id] || []).forEach(([sp, cx0], i) => {
      const t = tamanhoSprite(sp);
      const parado = S.dormindo || sp.endsWith('_ovo');
      const balanço = parado ? 0 : Math.round(Math.sin(ts / 900 + i * 2) * 2);
      const base = agua ? 50 + Math.round(Math.sin(ts / 700 + i) * 1) : 57;
      desenharSprite(ctx, sp, cx0 + balanço, base - t.h, { espelhar: i % 2 === 1, piscar: S.dormindo || (ts + i * 900) % 4100 < 160 });
    });
    let y;
    if (agua) y = 63 - h + Math.round(Math.sin(ts / 500) * 1.5);
    else {
      const pulo = !ovo && !S.dormindo && !modal && Math.floor(ts / 300) % 2 ? 1 : 0;
      y = 68 - h - pulo;
    }
    desenharSprite(ctx, nome, anim.x, y, { espelhar: anim.dir < 0, piscar: S.dormindo || ts % 3500 < 160 });
    const cx = anim.x + (anim.dir < 0 ? 2 : w - 6);
    if (S.dormindo) desenharSprite(ctx, 'zzz', cx, y - 6 - (Math.floor(ts / 500) % 3));
    else if (S.sau < 35) desenharSprite(ctx, 'cruz', cx, y - 5);
    else if (ts < anim.coracaoAte) desenharSprite(ctx, 'coracao', cx, y - 6);
  }

  function laco(ts) {
    if (tela === 'jogo' && ctx && S) desenhar(ts, ctx);
    if (modal && modal.tipo === 'pausa') {
      const el = $('#contagem'), fiz = $('#fiz');
      if (el) {
        const resta = Math.max(0, Math.ceil((modal.ate - Date.now()) / 1000));
        el.textContent = resta || '✓';
        if (!resta && fiz && fiz.disabled) fiz.disabled = false;
      }
    }
    requestAnimationFrame(laco);
  }

  // O tempo só corre com o jogo visível e sem janela aberta.
  setInterval(() => {
    if (tela !== 'jogo' || !S || modal || S.fim || document.hidden) return;
    acum += 0.25 * (VEL_TESTE || vel);
    while (acum >= 1 && !modal && !S.fim && tela === 'jogo') { acum -= 1; tick(); }
  }, 250);

  renderTela();
  requestAnimationFrame(laco);
})();
