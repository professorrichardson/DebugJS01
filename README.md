# DOM Visual Debugger v12

Modo de explicação passo a passo adicionado.

Na etapa 7:
1. o professor clica em uma lâmpada;
2. o simulador PARA no primeiro passo: CLICK;
3. o botão `Próximo passo →` do footer é habilitado;
4. cada clique avança apenas uma operação;
5. `← Passo` permite voltar e rever a operação.

Sequência manual:
1. CLICK
2. EVENTO (`addEventListener`)
3. FUNÇÃO/callback
4. DOM (`classList.toggle`)
5. CSS reage à classe
6. incremento `++`
7. DOM (`textContent`) recebe o novo valor

O footer continua fixo e mostra console, controles da explicação e variáveis.
As demais etapas, incluindo os quatro cantos de `position: fixed`, foram preservadas.
