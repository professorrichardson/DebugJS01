const etapas = [
  {t:"HTML → DOM", d:"O navegador cria o DOM a partir do HTML. O painel mostra o estado atual na memória.", dom:[1,2,3,4,5,6,7]},
  {t:"CSS define os estados visuais", d:"A classe .lampada representa apagada; .lampada.ligada representa acesa.", c:[1,2]},
  {t:"querySelector(): apenas um", d:"querySelector('.lampada') encontra somente a primeira correspondência.", dom:[2], a:"one"},
  {t:"querySelectorAll(): todos", d:"querySelectorAll('.lampada') encontra os três elementos.", dom:[2,3,4], j:[1,2], a:"all"},
  {t:"forEach(): percorre a coleção", d:"Observe a variável lampada apontando para cada elemento: 1 → 2 → 3.", j:[5,10], a:"loop"},
  {t:"addEventListener(): registra a função", d:"O forEach registra um evento de click em cada lâmpada.", j:[5,6,9,10], a:"events"},
  {t:"Clique: veja o DOM mudar", d:"Clique nas lâmpadas e acompanhe classList.toggle() e textContent++.", j:[6,7,8], a:"events"},
  {t:"position: fixed: escolha um canto", d:"Clique em top + left, top + right, bottom + left ou bottom + right. O ? e o CSS mudam juntos.", dom:[7], c:[3,4,5,6,7], a:"fixed"}
];

let atual=0, eventos=false, cliques=0, timer=null, execTimers=[];
let execucaoManual=null, passoExecucao=-1;
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const lamps=$$(".lampada");
const contador=$("#contador");
const ajuda=$("#ajuda");

function clearTimers(){
  if(timer) clearInterval(timer);
  timer=null;
  execTimers.forEach(clearTimeout);
  execTimers=[];
}
function log(msg){ $("#console").innerHTML="<b>&gt;</b> "+msg; }
function flash(el){
  if(!el) return;
  el.classList.remove("dom-change");
  void el.offsetWidth;
  el.classList.add("dom-change");
}
function linhas(tipo,arr=[]){
  arr.forEach(n=>{
    const x=$(`[data-${tipo}="${n}"]`);
    if(x) x.classList.add("hot");
  });
}
function limpar(){
  clearTimers();
  $$("pre span").forEach(x=>x.classList.remove("hot"));
  lamps.forEach(x=>x.classList.remove("encontrada","loop"));
  ajuda.classList.remove("ajuda-hot");
  $(".pagina").classList.remove("modo-posicao");
  $$(".canto-alvo").forEach(x=>x.classList.remove("canto-ativo"));
}
function moverAjuda(vertical,horizontal){
  ajuda.classList.remove("pos-inf-dir","pos-top-left","pos-top-right","pos-bottom-left","pos-bottom-right");
  ajuda.classList.add(`pos-${vertical}-${horizontal}`);

  $("#cssVertical").textContent=`  ${vertical}: 20px;`;
  $("#cssHorizontal").textContent=`  ${horizontal}: 20px;`;
  flash($("#cssVertical")); flash($("#cssHorizontal"));
  $$("pre span").forEach(x=>x.classList.remove("hot"));
  linhas("css",[4,5,6]);

  $$(".canto-alvo").forEach(b=>{
    b.classList.toggle("canto-ativo",b.dataset.v===vertical && b.dataset.h===horizontal);
  });
  log(`CSS mudou → ${vertical}: 20px; ${horizontal}: 20px;`);
}
function acao(a){
  if(a==="one"){
    lamps[0].classList.add("encontrada");
    log('querySelector(".lampada") → somente a lâmpada 1.');
  }
  if(a==="all"){
    lamps.forEach(x=>x.classList.add("encontrada"));
    log('querySelectorAll(".lampada") → 3 elementos.');
  }
  if(a==="loop"){
    let i=0;
    lamps[0].classList.add("loop");
    $("#varLampada").textContent="1";
    log("forEach → lampada aponta para o elemento 1.");
    timer=setInterval(()=>{
      lamps.forEach(x=>x.classList.remove("loop"));
      i++;
      if(i>=3){
        clearInterval(timer); timer=null;
        $("#varLampada").textContent="—";
        log("forEach terminou.");
        return;
      }
      lamps[i].classList.add("loop");
      $("#varLampada").textContent=i+1;
      log(`forEach → lampada aponta para o elemento ${i+1}.`);
    },700);
  }
  if(a==="events"){
    eventos=true;
    lamps.forEach(x=>x.classList.add("evento"));
    log("Eventos registrados. Clique em uma lâmpada.");
  }
  if(a==="fixed"){
    $(".pagina").classList.add("modo-posicao");
    ajuda.classList.add("ajuda-hot");
    moverAjuda("bottom","right");
    log("Etapa final: clique diretamente em um dos quatro cantos.");
  }
}
function mostrar(){
  limpar();
  execucaoManual=null;
  passoExecucao=-1;
  atualizarControlesPasso();
  const e=etapas[atual];
  $("#etapaNumeroTopo").textContent=atual+1;
  $("#etapaTitulo").textContent=e.t;
  $("#etapaTextoTopo").textContent=e.d;
  $("#status").textContent=`Etapa ${atual+1}/${etapas.length}`;
  linhas("dom",e.dom); linhas("css",e.c); linhas("js",e.j);
  acao(e.a);
  $("#anterior").disabled=atual===0;
  $("#proximo").disabled=atual===7;
}
function atualizarControlesPasso(){
  const tem = !!execucaoManual;
  $("#passoAnterior").disabled = !tem || passoExecucao <= 0;
  $("#proximoPasso").disabled = !tem || passoExecucao >= 6;
  $("#passoStatus").textContent = tem
    ? `Passo ${passoExecucao + 1}/7`
    : "Aguardando clique";
}

function aplicarPasso(indice){
  if(!execucaoManual) return;
  const {lamp,i,estavaLigada,antes}=execucaoManual;

  // Recria o estado inicial da execução para permitir avançar e voltar.
  lamp.classList.toggle("ligada", estavaLigada);
  cliques=antes;
  contador.textContent=antes;
  $("#domContador").textContent=antes;
  $("#classe"+i).textContent=estavaLigada ? "lampada ligada" : "lampada";
  $("#varLampada").textContent=i+1;
  $("#varClasse").textContent=estavaLigada ? "lampada ligada" : "lampada";
  $("#varAntes").textContent=antes;
  $("#varDepois").textContent=antes;
  $$("pre span").forEach(x=>x.classList.remove("hot"));

  // Reaplica todos os efeitos até o passo selecionado.
  if(indice>=0){
    log(`1/7 — CLICK: você clicou na lâmpada ${i+1}.`);
  }
  if(indice>=1){
    linhas("js",[6]);
    log('2/7 — EVENTO: addEventListener percebeu o "click".');
  }
  if(indice>=2){
    linhas("js",[6]);
    log(`3/7 — FUNÇÃO: o callback recebeu lampada = elemento ${i+1}.`);
  }
  if(indice>=3){
    lamp.classList.toggle("ligada");
    const classe=lamp.classList.contains("ligada") ? "lampada ligada" : "lampada";
    $("#classe"+i).textContent=classe;
    $("#varClasse").textContent=classe;
    flash($("#classe"+i));
    linhas("js",[7]); linhas("dom",[2+i]);
    log(lamp.classList.contains("ligada")
      ? '4/7 — DOM: toggle ADICIONOU a classe "ligada".'
      : '4/7 — DOM: toggle REMOVEU a classe "ligada".');
  }
  if(indice>=4){
    const ligada=lamp.classList.contains("ligada");
    $("#cssAtivo").classList.toggle("acesa",ligada);
    $("#cssAtivo").innerHTML=ligada
      ? `CSS ativo na lâmpada ${i+1}: <strong>.lampada.ligada</strong>`
      : `CSS ativo na lâmpada ${i+1}: <strong>.lampada</strong>`;
    linhas("css",[ligada?2:1]);
    log(ligada
      ? "5/7 — CSS: .lampada.ligada é aplicada → lâmpada acesa."
      : "5/7 — CSS: volta para .lampada → lâmpada apagada.");
  }
  if(indice>=5){
    $("#varDepois").textContent=antes+1;
    linhas("js",[8]);
    log(`6/7 — ++: ${antes} + 1 = ${antes+1}. O novo valor foi calculado.`);
  }
  if(indice>=6){
    cliques=antes+1;
    contador.textContent=cliques;
    $("#domContador").textContent=cliques;
    flash($("#domContador"));
    linhas("dom",[6]); linhas("js",[8]);
    log(`7/7 — DOM: textContent agora vale ${cliques}. A página foi atualizada.`);
  }

  passoExecucao=indice;
  atualizarControlesPasso();
}

function executarClique(lamp,i){
  if(!eventos){
    log("Avance até addEventListener antes de testar.");
    return;
  }

  // Na etapa de clique, não executa tudo automaticamente:
  // prepara a demonstração e mostra somente o primeiro passo.
  const estavaLigada=lamp.classList.contains("ligada");
  const antes=cliques;
  execucaoManual={lamp,i,estavaLigada,antes};
  lamps.forEach(x=>x.classList.remove("encontrada"));
  lamp.classList.add("encontrada");
  aplicarPasso(0);
}

$("#proximoPasso").addEventListener("click",()=>{
  if(execucaoManual && passoExecucao<6) aplicarPasso(passoExecucao+1);
});
$("#passoAnterior").addEventListener("click",()=>{
  if(execucaoManual && passoExecucao>0) aplicarPasso(passoExecucao-1);
});

lamps.forEach((l,i)=>l.addEventListener("click",()=>executarClique(l,i)));

$$(".canto-alvo").forEach(botao=>{
  botao.addEventListener("click",e=>{
    e.preventDefault();
    e.stopPropagation();
    if(atual!==7){
      log("Os cantos ficam ativos somente na etapa 8.");
      return;
    }
    moverAjuda(botao.dataset.v,botao.dataset.h);
  });
});

$("#proximo").addEventListener("click",()=>{ if(atual<7){atual++;mostrar();} });
$("#anterior").addEventListener("click",()=>{ if(atual>0){atual--;mostrar();} });
$("#reiniciar").addEventListener("click",()=>{
  execucaoManual=null; passoExecucao=-1; atualizarControlesPasso();
  atual=0; eventos=false; cliques=0;
  contador.textContent="0"; $("#domContador").textContent="0";
  $("#varLampada").textContent="—"; $("#varClasse").textContent="—";
  $("#varAntes").textContent="0"; $("#varDepois").textContent="0";
  lamps.forEach((x,i)=>{
    x.classList.remove("ligada","evento","encontrada","loop");
    $("#classe"+i).textContent="lampada";
  });
  $("#cssVertical").textContent="  bottom: 20px;";
  $("#cssHorizontal").textContent="  right: 20px;";
  $("#cssAtivo").className="css-ativo";
  $("#cssAtivo").innerHTML='CSS ativo: <strong>.lampada</strong>';
  ajuda.className="pos-bottom-right";
  mostrar();
});

mostrar();
