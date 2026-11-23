# Registro das partidas numa Planilha Google

O jogo envia uma linha por partida terminada, ou abandonada no meio, para uma planilha sua. A configuração leva uns 5 minutos e é feita uma vez só.

## 1. Criar a planilha e o script

1. Entre em https://sheets.google.com e crie uma planilha em branco. Dê o nome **TamagoTchÊ – partidas**.
2. No menu, clique em **Extensões → Apps Script**.
3. Apague o código que aparece e cole todo o conteúdo do arquivo `apps-script.gs` desta pasta.
4. Clique no disquete (**Salvar**).

## 2. Publicar como aplicativo da web

1. Clique em **Implantar → Nova implantação**.
2. Na engrenagem ao lado de "Selecionar tipo", escolha **App da Web**.
3. Preencha assim:
   - Descrição: `TamagoTchÊ`
   - Executar como: **Eu** (seu e-mail)
   - Quem pode acessar: **Qualquer pessoa**
4. Clique em **Implantar** e autorize o acesso com sua conta Google. Se aparecer "O Google não verificou este app", clique em **Avançado → Acessar (não seguro)**. Esse aviso aparece porque o script é seu e não passou por revisão do Google, o que é normal.
5. Copie o **URL do app da Web**. Ele termina em `/exec`.

Para testar, abra esse endereço no navegador. Deve aparecer "TamagoTchÊ: registro de partidas ativo."

## 3. Ligar no jogo

Em `js/config.js`, cole o endereço no campo `planilha`:

```js
planilha: 'https://script.google.com/macros/s/AKfy.../exec'
```

## Segurança

- O script só tem permissão para mexer nesta planilha (a linha `@OnlyCurrentDoc` no topo garante isso). Na hora de autorizar, o Google deve pedir acesso apenas a "planilhas em que este app está instalado".
- Quem tem o endereço `/exec` consegue **adicionar** linhas, mas não consegue **ler** a planilha, nem acessar seu Drive, e-mail ou conta.
- Se alguém encher a planilha de linhas falsas, crie uma nova implantação (o endereço muda), troque o endereço em `js/config.js` e apague a implantação antiga.

## Colunas da aba "sessoes"

| Coluna | O que é |
|---|---|
| recebido_em | data e hora em que a linha chegou |
| versao | versão do jogo |
| id_jogador | número sorteado e guardado só no navegador; repete quando a mesma pessoa joga de novo no mesmo aparelho |
| id_partida | número sorteado para cada partida |
| especie | capivara, sabia, queroquero, graxaim, tigre ou boto |
| motivo | `inicio` (partida começou), `legado` (viveu a vida toda), `resgate` (adoeceu), `abandono` (saiu da página no meio) ou `teste` (enviada pelo modo diagnóstico) |
| fase_final | fase em que a partida terminou |
| tempo_jogo_s / tempo_real_s | segundos de jogo e segundos reais com o jogo aberto |
| bicho / ambiente / gente | pontuação final dos três pilares (0 a 100) |
| cartas / cartas_total / cartas_lidas | cartas de saber liberadas, possíveis e lidas |
| escolhas_boas / escolhas_ruins | escolhas cuidadosas e descuidadas nos acontecimentos |
| escolhas | cada acontecimento e a escolha feita, por exemplo `carrapato:boa enchente:ruim` |
| pausas_feitas / pausas_oferecidas | pausas ativas |
| vel_max | maior velocidade usada (1, 2 ou 4) |
| fotos | fotos geradas na partida |
| dispositivo | `toque` (celular ou tablet) ou `mouse` (computador) |
| largura_tela, idioma | dados técnicos do navegador |

Cada partida gera uma linha `inicio` quando começa e outra quando termina ou quando a pessoa sai da página. Todas têm o mesmo `id_partida`. Na análise, fique só com a última linha de cada `id_partida` e descarte as linhas `teste`.

## Testar se está funcionando

Abra `https://marciadosangeles.github.io/tamagotche/?diagnostico`. Aparece uma janela com o estado do registro e o botão **Enviar linha de teste para a planilha**. Em alguns segundos, uma linha com motivo `teste` deve surgir na aba "sessoes".

## Se mudar o script depois

Em **Implantar → Gerenciar implantações**, edite a implantação existente e escolha **Nova versão**. Assim o endereço `/exec` continua o mesmo.
