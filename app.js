/* ========================================================================
 * PRODUTIVOS 93 — PAINEL EDITÁVEL DO HACKATHON
 * ========================================================================
 * 1. ECONOMY: valores, punições e chances.
 * 2. COPY: todas as falas espontâneas e reativas do Urubu.
 * 3. APPS: ícones da área de trabalho e classificação dos aplicativos.
 * 4. SHOP_ITEMS: produtos, preço, descrição e efeito da loja.
 * 5. VIEWS: HTML interno de cada aplicativo.
 * 6. wireApp / wire*: interações de cada aplicativo.
 * Busque por "EDITAR AQUI" para encontrar os pontos de customização.
 * ====================================================================== */

const ECONOMY = {
  startingPoints: 120,
  taskRewards: {low:20, normal:45, high:75},
  focusTickSeconds: 25,
  focusTickReward: 2,
  procrastinationPenalty: 12,
  gambleLossChance: .90,
  audioYoutubeId: "YmHZI03a_Yo"
};
const INACTIVITY = {warningMs:45000, alarmMs:70000, repeatMs:30000};

const COPY = {
  idle: ["Você parou.", "O prazo continua andando.", "Estou só conferindo.", "Não confunda silêncio com ausência."],
  useful: ["Certo. Continue.", "Isso conta como trabalho.", "Sem aplausos. Só continue."],
  useless: ["Eu não abriria isso.", "Você sabe o que está fazendo.", "Interessante escolha perto do prazo."],
  theft: ["Vou guardar isso por um instante.", "Este atalho parecia perigoso.", "Inventário preventivo."],
  caught: ["O cursor vem comigo.", "Você perdeu os privilégios do mouse.", "Vou reposicionar sua atenção."],
  alarm: ["VOLTE PARA A CADEIRA.", "PRESENÇA NÃO DETECTADA.", "O SEMESTRE NÃO PAUSA."],
  spontaneous: ["Você abriu o Moodle ou só pensou nisso?", "Uma aba produtiva seria uma surpresa agradável.", "Seu prazo pediu para eu mandar lembranças.", "Eu contei três suspiros e zero parágrafos.", "O cursor está livre demais para alguém com trabalho atrasado.", "O grupo já perguntou se você terminou sua parte.", "Esse silêncio tem cheiro de procrastinação.", "Não precisa me agradecer. Precisa entregar.", "Eu vi você procurando outra aba.", "O bandejão fecha. O prazo também."]
};

// EDITAR AQUI: falas disparadas ao abrir cada aplicativo.
const APP_DIALOGUES = {
  computer:["Procurando produtividade no disco C:?", "Se achar a pasta das férias, não abra."],
  tasks:["Uma lista honesta. Agora falta a parte de fazer.", "Marcar não é fazer. Eu verifico."],
  moodle:["O Moodle carregou. Seu prazo também.", "Tem atividade nova. Claro que tem."],
  runcodes:["Compila primeiro, comemora depois.", "Se der TLE, eu culpo sua procrastinação."],
  jupiter:["O JúpiterWeb lembra de todas as suas escolhas.", "Grade horária: o Tetris que não diverte."],
  ecard:["Documento válido até o próximo colapso acadêmico.", "A foto poderia estar pior. Poderia."],
  folki:["Uma ferramenta útil. Estou desconfiado.", "Use rápido antes que vire outra distração."],
  whatsapp:["Mensagem nova raramente significa prazo novo. Raramente.", "Se o grupo escreveu 'gente?', é tarde demais."],
  instagram:["Você abriu o poço sem fundo.", "Eu começo a cobrar por rolagem em três, dois..."],
  pong:["A mesa parece justa. Eu não sou.", "Boa sorte contra uma ave sem ética esportiva."],
  procrastibet:["A casa sempre vence. Eu sou a casa.", "Aposte só o que você gostaria de perder."],
  shop:["Produtividade virou moeda. Capitalismo acadêmico.", "Cinco minutos de paz custam caro por um motivo."],
  customize:["Acessório nenhum esconde suas pendências.", "Finalmente uma tarefa realmente essencial."],
  camera:["Olhe para a câmera. E para o conteúdo, de vez em quando.", "Fiscalização local. Julgamento global."],
  browser:["A internet inteira e você escolheu urubUSP.com.", "Navegue com responsabilidade. Ou eu navego por você."],
  trash:["Aqui jaz a motivação da semana passada.", "A lixeira tem mais versões finais que seu trabalho."],
  debug:["Poder ilimitado e responsabilidade nenhuma."]
};

// Arquivos são servidos diretamente desta pasta. Para acrescentar figurinhas,
// coloque o arquivo em assets/stickers/ e adicione seu nome nesta lista.
const STICKER_FILES = ["urubu-ok.png","urubu-grito.png","urubu-corre.png","urubu-rouba.png"];
const CUSTOM_ICON_APPS = ["whatsapp","instagram","pong","procrastibet","browser"];

// EDITAR AQUI: efeitos remotos livres. São carregados apenas quando o som está ligado.
// Atribuições e licenças: assets/sounds/SOURCES.md
const SFX = {
  click:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Computer_mouse_single_click.ogg",
  context:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Computer_mouse_right_click.ogg",
  message:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Doorbell-old-tring.ogg",
  alert:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Sputnik_beep.ogg",
  gamble:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Drum_Roll_Intro.ogg",
  reward:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Sound_Effects_-_Applause_after_a_concert.ogg",
  disaster:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Houston_problem.ogg",
  explosion:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Explosion_10.ogg",
  scream:"https://commons.wikimedia.org/wiki/Special:Redirect/file/En-us-scream.ogg",
  airhorn:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Luftr%C3%BCssel.ogg"
};

const APPS = [
  {id:"computer", label:"Meu Computador", kind:"system", icon:"computer"},
  {id:"tasks", label:"Tarefas", kind:"productive", icon:"tasks"},
  {id:"moodle", label:"Moodle", kind:"productive", icon:"moodle"},
  {id:"runcodes", label:"Run.codes", kind:"productive", icon:"code"},
  {id:"jupiter", label:"JúpiterWeb", kind:"productive", icon:"jupiter"},
  {id:"ecard", label:"E-card USP", kind:"productive", icon:"card"},
  {id:"folki", label:"Folki", kind:"productive", icon:"folki"},
  {id:"browser", label:"Urubu Explorer", kind:"neutral", icon:"browser"},
  {id:"whatsapp", label:"WhatsApp", kind:"neutral", icon:"whatsapp"},
  {id:"instagram", label:"Instagram", kind:"procrastination", icon:"instagram"},
  {id:"pong", label:"Pong do Urubu", kind:"procrastination", icon:"pong"},
  {id:"procrastibet", label:"Procrastibet", kind:"procrastination", icon:"bet"},
  {id:"shop", label:"Loja do Urubu", kind:"system", icon:"shop"},
  {id:"customize", label:"Personalizar Urubu", kind:"system", icon:"urubu"},
  {id:"camera", label:"Fiscal de Presença", kind:"system", icon:"camera"},
  {id:"debug", label:"Ferramentas de teste", kind:"system", icon:"computer", desktop:false},
  {id:"trash", label:"Lixeira", kind:"system", icon:"trash"}
];

// EDITAR AQUI: estes são arquivos raster reais, não desenhos CSS/SVG.
// Para usar JPG, JPEG, WebP ou GIF, troque o arquivo e altere somente o caminho abaixo.
const DESKTOP_ICON_FILES = {
  computer:"computer.png", tasks:"tasks.png", moodle:"moodle.png", runcodes:"runcodes.png",
  jupiter:"jupiter.png", ecard:"ecard.png", folki:"folki.png", browser:"browser.png",
  whatsapp:"whatsapp.png", instagram:"instagram.png", pong:"pong.png", procrastibet:"procrastibet.png",
  shop:"shop.png", customize:"customize.png", camera:"camera.png", trash:"trash.png", debug:"debug.png"
};

const DEFAULT_TASKS = [
  {id:"calc-3", text:"Entregar lista de Cálculo III", category:"Faculdade", priority:"high", due:"2026-09-21", done:false, createdAt:0},
  {id:"mac-ep", text:"Finalizar EP de MAC0321", category:"Código", priority:"high", due:"2026-09-20", done:false, createdAt:0},
  {id:"group", text:"Revisar slides do trabalho em grupo", category:"Grupo", priority:"normal", due:"2026-09-23", done:false, createdAt:0}
];

// EDITAR AQUI: catálogo. "consumable" permite comprar novamente.
const SHOP_ITEMS = [
  {id:"grad", name:"Chapéu de formatura", price:90, icon:"🎓", description:"Acessório puramente acadêmico.", type:"accessory"},
  {id:"cap", name:"Boné suspeito", price:130, icon:"🧢", description:"Não aumenta a produtividade, mas combina.", type:"accessory"},
  {id:"pinkTie", name:"Gravata magenta", price:70, icon:"👔", description:"Troca a gravata verde por magenta.", type:"style"},
  {id:"quiet5", name:"5 minutos sem o Urubu", price:160, icon:"🔕", description:"Suspende falas, roubos, alarmes e bloqueios por 5 minutos.", type:"consumable"},
  {id:"cursorShield", name:"Seguro de cursor", price:95, icon:"🖱️", description:"Cancela os próximos 2 roubos de cursor.", type:"consumable"},
  {id:"iconTape", name:"Fita dupla face", price:120, icon:"📌", description:"Impede o roubo de atalhos por 10 minutos.", type:"consumable"}
];

const today = () => new Date().toISOString().slice(0,10);
const stored = JSON.parse(localStorage.getItem("produtivos93.state.v2") || "null");
const defaults = {
  points: ECONOMY.startingPoints,
  chaos: 1,
  infractions: 0,
  tasks: DEFAULT_TASKS,
  rewardedTaskKeys: [],
  daily: {date:today(), taskRewards:0, focusCredits:0},
  inventory: [],
  customization: {accessory:"", tie:"green"},
  customIcons: {},
  stolenApps: [],
  iconPositions: {},
  taskFilter: "all",
  debugUnlimited: false,
  quietUntil: 0,
  iconLockUntil: 0,
  cursorShield: 0,
  soundOn: false
};
const state = {...defaults,...(stored||{})};
state.daily={...defaults.daily,...(stored?.daily||{})};
state.customization={...defaults.customization,...(stored?.customization||{})};
state.customIcons={...defaults.customIcons,...(stored?.customIcons||{})};
state.tasks=(state.tasks||DEFAULT_TASKS).map(t=>({...t,category:t.category||"Geral",priority:t.priority||"normal",due:t.due||""}));

if (state.daily.date !== today()) state.daily = {date:today(), taskRewards:0, focusCredits:0};

const runtime = {
  z: 30,
  windows: new Map(),
  selectedIcon: null,
  pointer: {x:innerWidth*.7, y:innerHeight*.5},
  buddyBusy: false,
  bubbleTimer: null,
  cameraStream: null,
  cameraTimer: null,
  lastActivity: Date.now(),
  theftTimer: null,
  theftCooldown: 0,
  virtualCursor: {active:false,x:innerWidth*.7,y:innerHeight*.5,lastX:null,lastY:null,synthetic:false},
  physicalPointer: {x:innerWidth*.7,y:innerHeight*.5},
  cursorResetTimer: null,
  buddyTravelTimer: null,
  presence: {badFrames:0,alarm:false,lastAlarm:0,lastPixels:null,stillFrames:0},
  inactivityStage: 0,
  iconDraggedUntil: 0
};
runtime.whatsappTimer=null;
runtime.sfxLast={};

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const esc = v => String(v).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const pick = list => list[Math.floor(Math.random()*list.length)];
const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
const persist = () => localStorage.setItem("produtivos93.state.v2", JSON.stringify(state));
const taskKey = text => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();

function appIconMarkup(app){
  const custom=state.customIcons?.[app.id];
  if(custom)return `<img class="custom-app-icon" src="${custom}" alt="">`;
  const filename=DESKTOP_ICON_FILES[app.id]||"computer.png";
  return `<span class="file-icon"><img class="custom-app-icon disk-icon" src="assets/desktop-icons/${filename}" alt=""></span>`;
}

function playTone(frequency=440,duration=.09,type="square",volume=.035){
  if(!state.soundOn)return;try{const ac=new AudioContext(),o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=frequency;g.gain.value=volume;o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+duration);o.onended=()=>ac.close()}catch{}
}

function playSfx(name,maxMs=2200){
  if(!state.soundOn||!SFX[name])return;const now=Date.now();if(now-(runtime.sfxLast[name]||0)<250)return;runtime.sfxLast[name]=now;const audio=new Audio(SFX[name]);audio.volume=name==="alert"?.28:.36;audio.play().catch(()=>playTone(name==="alert"?760:420,.12));setTimeout(()=>{audio.pause();audio.src=""},maxMs);
}

// Vine-boom original não é redistribuído: este impacto grave é sintetizado localmente.
function playImpact(){
  if(!state.soundOn)return;
  try{const ac=new AudioContext(),master=ac.createGain(),osc=ac.createOscillator(),filter=ac.createBiquadFilter(),buffer=ac.createBuffer(1,ac.sampleRate*.32,ac.sampleRate),noise=ac.createBufferSource();
    master.gain.setValueAtTime(.24,ac.currentTime);master.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.48);osc.type="sine";osc.frequency.setValueAtTime(125,ac.currentTime);osc.frequency.exponentialRampToValueAtTime(38,ac.currentTime+.42);filter.type="lowpass";filter.frequency.value=310;
    const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);noise.buffer=buffer;osc.connect(master);noise.connect(filter).connect(master);master.connect(ac.destination);osc.start();noise.start();osc.stop(ac.currentTime+.5);noise.stop(ac.currentTime+.33);setTimeout(()=>ac.close(),650)}catch{}
}

function updateHUD(){
  $("#pointsTop").value = state.debugUnlimited ? "∞" : state.points;
  $("#chaosBtn").textContent = `U${state.chaos}`;
  persist();
}

function addPoints(amount, reason){
  if(state.debugUnlimited&&amount<0){toast("∞ créditos",reason);return}
  state.points = Math.max(0, state.points + amount);
  updateHUD();
  toast(amount >= 0 ? `+${amount} créditos` : `${amount} créditos`, reason);
  if(Math.abs(amount)>=10)playSfx(amount>0?"reward":"alert",amount>0?1500:700);
}

const canAfford = amount => state.debugUnlimited || state.points >= amount;
function spendPoints(amount,reason){if(!canAfford(amount))return false;addPoints(-amount,reason);return true}
const urubuPaused = () => Date.now() < Number(state.quietUntil||0);
const formatRemaining = until => `${Math.max(1,Math.ceil((until-Date.now())/60000))} min`;

function toast(title,message){
  const node=document.createElement("div");
  node.className="toast";
  node.innerHTML=`<strong>${esc(title)}</strong><small>${esc(message)}</small>`;
  $("#toastLayer").append(node);
  setTimeout(()=>node.remove(),4200);
}

function renderDesktop(){
  $("#desktopIcons").innerHTML=APPS.filter(app=>app.desktop!==false).map(app=>{
    return `<button class="desktop-icon repositioned ${state.stolenApps.includes(app.id)?"stolen":""}" data-app="${app.id}" aria-label="${esc(app.label)}">
      <span class="icon-art">${appIconMarkup(app)}</span><span class="icon-label">${esc(app.label)}</span>
    </button>`}).join("");
  normalizeDesktopLayout();
  $$(".desktop-icon").forEach(icon=>{
    icon.addEventListener("click",e=>{e.stopPropagation();selectIcon(icon)});
    icon.addEventListener("dblclick",()=>{if(Date.now()>runtime.iconDraggedUntil)openApp(icon.dataset.app)});
    icon.addEventListener("keydown",e=>{if(e.key==="Enter")openApp(icon.dataset.app)});
    makeIconDraggable(icon);
  });
}

// Converte posições antigas/livres para uma grade única. Assim nenhum atalho
// sobrepõe outro, mas a posição escolhida pelo usuário continua sendo respeitada.
function normalizeDesktopLayout(){
  const area=$("#desktopIcons").getBoundingClientRect(),cellW=93,cellH=86;
  const rows=Math.max(3,Math.floor(area.height/cellH)),usableWidth=Math.max(82,area.width-250),cols=Math.max(1,Math.floor(usableWidth/cellW));
  const allSlots=[];for(let c=0;c<cols;c++)for(let r=0;r<rows;r++)allSlots.push({x:c*cellW,y:r*cellH});
  const occupied=new Set();
  APPS.filter(app=>app.desktop!==false).forEach((app,index)=>{
    const preferred=state.iconPositions[app.id]||{x:Math.floor(index/rows)*cellW,y:(index%rows)*cellH};
    const slot=allSlots.filter(s=>!occupied.has(`${s.x},${s.y}`)).sort((a,b)=>Math.hypot(a.x-preferred.x,a.y-preferred.y)-Math.hypot(b.x-preferred.x,b.y-preferred.y))[0]||{x:0,y:0};
    occupied.add(`${slot.x},${slot.y}`);state.iconPositions[app.id]=slot;
    const icon=$(`[data-app="${app.id}"]`);if(icon){icon.style.left=`${slot.x}px`;icon.style.top=`${slot.y}px`}
  });
  persist();
}

function makeIconDraggable(icon){
  let drag=null;
  icon.addEventListener("pointerdown",e=>{if(e.button!==0)return;clearTimeout(runtime.theftTimer);runtime.hoverTarget=null;runtime.iconDragActive=true;const r=icon.getBoundingClientRect(),area=$("#desktopIcons").getBoundingClientRect();drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,left:r.left-area.left,top:r.top-area.top,moved:false};icon.setPointerCapture(e.pointerId)});
  icon.addEventListener("pointermove",e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;if(!drag.moved&&Math.hypot(dx,dy)<6)return;drag.moved=true;icon.classList.add("repositioned","dragging");const slot=findDesktopSlot(icon.dataset.app,drag.left+dx,drag.top+dy);icon.style.left=`${slot.x}px`;icon.style.top=`${slot.y}px`});
  icon.addEventListener("pointerup",()=>{if(!drag)return;if(drag.moved){state.iconPositions[icon.dataset.app]={x:Math.round(parseFloat(icon.style.left)),y:Math.round(parseFloat(icon.style.top))};runtime.iconDraggedUntil=Date.now()+450;persist()}icon.classList.remove("dragging");runtime.iconDragActive=false;drag=null});
}

// EDITAR AQUI: a grade impede sobreposição e mantém atalhos em posições de desktop.
function findDesktopSlot(appId,targetX,targetY){
  const area=$("#desktopIcons").getBoundingClientRect(),cellW=93,cellH=86,rows=Math.max(3,Math.floor(area.height/cellH)),usableWidth=Math.max(82,area.width-250),cols=Math.max(1,Math.floor(usableWidth/cellW));
  const desktopApps=APPS.filter(a=>a.desktop!==false),occupied=new Set();
  desktopApps.forEach((app,index)=>{if(app.id===appId||state.stolenApps.includes(app.id))return;const saved=state.iconPositions[app.id],x=saved?Math.round(saved.x/cellW)*cellW:Math.floor(index/rows)*cellW,y=saved?Math.round(saved.y/cellH)*cellH:(index%rows)*cellH;occupied.add(`${x},${y}`)});
  const slots=[];for(let c=0;c<cols;c++)for(let r=0;r<rows;r++){const x=c*cellW,y=r*cellH;if(!occupied.has(`${x},${y}`))slots.push({x,y,d:Math.hypot(x-targetX,y-targetY)})}
  return slots.sort((a,b)=>a.d-b.d)[0]||{x:0,y:0};
}

function selectIcon(icon){
  $$(".desktop-icon.selected").forEach(x=>x.classList.remove("selected"));
  icon?.classList.add("selected");
  runtime.selectedIcon=icon?.dataset.app||null;
}

function renderStartMenu(){
  const useful=APPS.filter(a=>a.kind==="productive");
  $("#startMenu").innerHTML=`<div class="start-rail">ProdutivOS&nbsp;93</div><div class="start-items">
    ${useful.map(a=>`<button class="start-item" data-start="${a.id}"><span class="mini-icon">${appIconMarkup(a)}</span>${esc(a.label)}</button>`).join("")}
    <div class="start-separator"></div>
    <button class="start-item" data-start="shop"><span class="mini-icon">${appIconMarkup(APPS.find(a=>a.id==="shop"))}</span>Loja do Urubu</button>
    <button class="start-item" data-start="customize"><span class="mini-icon">${appIconMarkup(APPS.find(a=>a.id==="customize"))}</span>Personalizar...</button>
    <button class="start-item" data-start="debug"><span class="mini-icon">${appIconMarkup(APPS.find(a=>a.id==="debug"))}</span>Ferramentas de teste</button>
    <div class="start-separator"></div>
    <button class="start-item" id="runMenu"><span class="mini-icon">▣</span>Executar...</button>
    <button class="start-item" id="shutdownMenu"><span class="mini-icon">⏻</span>Desligar...</button>
  </div>`;
  $$('[data-start]').forEach(b=>b.onclick=()=>{toggleStart(false);openApp(b.dataset.start)});
  $("#runMenu").onclick=()=>{toggleStart(false);createWindow({id:"run",label:"Executar",icon:"computer",kind:"system"},runDialog())};
  $("#shutdownMenu").onclick=()=>{toggleStart(false);shutdownHell()};
}

function toggleStart(force){
  const menu=$("#startMenu");
  const show=typeof force==="boolean"?force:menu.hidden;
  menu.hidden=!show;
  $("#startBtn").classList.toggle("open",show);
  $("#startBtn").setAttribute("aria-expanded",show);
}

function openApp(id){
  const app=APPS.find(a=>a.id===id);
  if(!app)return;
  if(runtime.windows.has(id)){focusWindow(id);return}
  playTone(app.kind==="procrastination"?185:520,.08,app.kind==="procrastination"?"sawtooth":"square");
  buddySay(pick(APP_DIALOGUES[id]||COPY.idle));
  if(app.kind==="procrastination"){
    state.infractions++;
    state.chaos=Math.min(5,1+Math.floor(state.infractions/2));
    addPoints(-ECONOMY.procrastinationPenalty,`Tempo aberto em ${app.label}.`);
    setTimeout(()=>catchCursor(),750);
  }
  createWindow(app,VIEWS[id]());
  setTimeout(()=>{if(runtime.windows.has(id)&&APP_DIALOGUES[id])buddySay(pick(APP_DIALOGUES[id]),4300)},6500);
  if(app.kind==="procrastination") setTimeout(()=>buddyBlockWindow(id),2400);
}

function createWindow(app,html){
  const id=app.id;
  const count=runtime.windows.size;
  const win=document.createElement("article");
  win.className="os-window active";
  if(id==="camera")win.classList.add("presence-window","pinned");
  win.dataset.window=id;
  win.style.left=`${clamp(110+count*28,10,innerWidth-380)}px`;
  win.style.top=`${clamp(55+count*24,5,innerHeight-270)}px`;
  if(id==="camera"){win.style.left="auto";win.style.right="10px";win.style.top="10px"}
  win.style.zIndex=++runtime.z;
  win.innerHTML=`<header class="window-titlebar"><span class="title-icon">${appIconMarkup(app)}</span><strong>${esc(app.label)}</strong><span class="window-controls"><button data-min aria-label="Minimizar">_</button><button data-max aria-label="Maximizar">□</button><button data-close aria-label="Fechar">×</button></span></header><nav class="window-menubar"><button>Arquivo</button><button>Editar</button><button>Exibir</button><button>Ajuda</button></nav><div class="window-content">${html}</div><i class="resize-grip"></i>`;
  $("#windowLayer").append(win);
  runtime.windows.set(id,{app,win});
  bindWindow(win,id);
  renderTaskButtons();
  focusWindow(id);
  wireApp(id,win);
}

function bindWindow(win,id){
  win.addEventListener("pointerdown",()=>focusWindow(id));
  $("[data-close]",win).onclick=e=>{e.stopPropagation();closeWindow(id)};
  $("[data-min]",win).onclick=e=>{e.stopPropagation();win.classList.add("minimized");renderTaskButtons()};
  $("[data-max]",win).onclick=e=>{e.stopPropagation();win.classList.toggle("maximized")};
  if(id==="camera")return;
  const bar=$(".window-titlebar",win);let drag=null;
  bar.addEventListener("pointerdown",e=>{if(e.target.closest("button")||win.classList.contains("maximized"))return;const r=win.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,left:r.left,top:r.top};bar.setPointerCapture(e.pointerId)});
  bar.addEventListener("pointermove",e=>{if(!drag)return;win.style.left=`${clamp(drag.left+e.clientX-drag.x,0,innerWidth-120)}px`;win.style.top=`${clamp(drag.top+e.clientY-drag.y,0,innerHeight-70)}px`});
  bar.addEventListener("pointerup",()=>drag=null);
}

function focusWindow(id){
  runtime.windows.forEach(({win})=>win.classList.remove("active"));
  const item=runtime.windows.get(id);if(!item)return;
  item.win.classList.remove("minimized");item.win.classList.add("active");item.win.style.zIndex=++runtime.z;
  renderTaskButtons();
}

function closeWindow(id){
  const item=runtime.windows.get(id);if(!item)return;
  item.win.remove();runtime.windows.delete(id);renderTaskButtons();
  playTone(260,.06,"square",.025);
  if(id==="camera")stopCamera();
  if(id==="whatsapp"){clearInterval(runtime.whatsappTimer);runtime.whatsappTimer=null}
}

function renderTaskButtons(){
  $("#taskButtons").innerHTML=[...runtime.windows.entries()].map(([id,{app,win}])=>`<button class="task-button ${win.classList.contains("active")&&!win.classList.contains("minimized")?"active":""}" data-taskwin="${id}">${esc(app.label)}</button>`).join("");
  $$('[data-taskwin]').forEach(btn=>btn.onclick=()=>{
    const item=runtime.windows.get(btn.dataset.taskwin);
    if(item.win.classList.contains("active")&&!item.win.classList.contains("minimized")){item.win.classList.add("minimized");renderTaskButtons()}else focusWindow(btn.dataset.taskwin)
  });
}

const VIEWS = {
  computer:()=>`<div class="tasks-app"><div class="classic-toolbar"><button class="classic-btn">Voltar</button><button class="classic-btn">Acima</button><input class="classic-input" value="C:\\ProdutivOS\\Aluno" aria-label="Endereço"></div><div class="tasks-list">${APPS.slice(1,9).map(a=>`<div class="task-row"><span class="icon-art">${appIconMarkup(a)}</span><b>${esc(a.label)}</b><span class="task-state">Aplicativo</span><span></span></div>`).join("")}</div><div class="statusline">8 objeto(s) · 3 prazos atrasados</div></div>`,
  tasks:tasksView,
  moodle:moodleView,
  runcodes:runcodesView,
  jupiter:jupiterView,
  ecard:()=>`<div class="ecard-app"><article class="ecard"><header class="ecard-brand"><span class="ecard-usp">usp</span><span>Universidade de São Paulo<br><b>e-Card</b></span><i>ALUNO</i></header><div class="ecard-body"><img class="ecard-photo" src="assets/ecard-profile.png" alt="Foto do estudante"><div class="ecard-data"><h2>PRODUTIVO DA SILVA</h2><p><b>Nº USP</b><br>0000000-3</p><p><b>Unidade</b><br>Escola Politécnica</p><p><b>Vínculo</b><br>Graduação · ativo</p></div><div class="ecard-qr" aria-label="Código visual do cartão"><span></span></div></div><footer><span>Válido enquanto houver prazo</span><b>PRODUTIV<u>OS</u></b></footer></article><aside class="ecard-info"><b>Carteirinha digital</b><span>Apresente a tela com brilho no máximo e autoestima no mínimo.</span><button class="classic-btn" data-ecard-flip>Ver verso</button></aside></div>`,
  folki:folkiView,
  browser:browserView,
  whatsapp:whatsappView,
  instagram:instagramView,
  pong:pongView,
  procrastibet:betView,
  shop:shopView,
  customize:customizeView,
  camera:cameraView,
  debug:debugView,
  trash:()=>`<div class="tasks-app"><h2 class="pane-title">Lixeira</h2><div class="tasks-list"><div class="task-row"><span>📄</span><span>motivacao_final_v7.txt</span><span class="task-state">0 KB</span><span></span></div><div class="task-row"><span>📄</span><span>ferias_2026.zip</span><span class="task-state">corrompido</span><span></span></div></div></div>`
};

function tasksView(){
  const visible=state.tasks.filter(t=>state.taskFilter==="all"||(state.taskFilter==="done"?t.done:!t.done));
  const done=state.tasks.filter(t=>t.done).length,total=state.tasks.length,progress=total?Math.round(done/total*100):0;
  return `<div class="tasks-app task-planner"><div class="task-summary"><div><b>${done}/${total}</b><small>concluídas</small></div><div class="task-progress"><span style="width:${progress}%"></span></div><strong>${progress}%</strong><span>Sem limite diário · cada tarefa única paga uma vez</span></div><form class="task-form" id="taskForm"><input id="taskInput" class="classic-input" maxlength="80" placeholder="O que precisa ser feito?" required><select id="taskCategory" class="classic-input"><option>Faculdade</option><option>Código</option><option>Leitura</option><option>Grupo</option><option>Geral</option></select><select id="taskPriority" class="classic-input"><option value="low">Baixa · 20 ₱</option><option value="normal" selected>Normal · 45 ₱</option><option value="high">Alta · 75 ₱</option></select><input id="taskDue" class="classic-input" type="date"><button class="classic-btn">Adicionar</button></form><nav class="task-filters">${[["all","Todas"],["open","Pendentes"],["done","Concluídas"]].map(([v,l])=>`<button class="classic-btn ${state.taskFilter===v?"active":""}" data-task-filter="${v}">${l}</button>`).join("")}</nav><div class="tasks-list">${visible.map(t=>`<div class="task-row task-detailed ${t.done?"done":""}" data-priority="${t.priority}"><input type="checkbox" data-check-task="${esc(t.id)}" ${t.done?"checked":""} aria-label="Concluir ${esc(t.text)}"><span class="task-main"><b class="task-text">${esc(t.text)}</b><small>${esc(t.category)}${t.due?` · prazo ${new Date(t.due+"T12:00:00").toLocaleDateString("pt-BR")}`:" · sem prazo"}</small></span><span class="priority priority-${t.priority}">${t.priority==="high"?"ALTA":t.priority==="low"?"BAIXA":"NORMAL"}</span><span class="task-state">${t.rewarded?'<b class="task-reward">paga</b>':`+${ECONOMY.taskRewards[t.priority]} ₱`}</span><button data-delete-task="${esc(t.id)}" aria-label="Excluir">×</button></div>`).join("")||'<p class="task-empty">Nenhuma tarefa nesta visualização.</p>'}</div><div class="statusline">A identidade normalizada da tarefa impede crédito repetido ao desmarcar, renomear com pontuação ou recriar.</div></div>`;
}

// EDITAR AQUI: contatos, históricos e mensagens periódicas do WhatsApp.
const WA_CHATS = {
  murilove:{name:"Murilove ❤️",avatar:"🧑🏻",status:"online",preview:"você vai estar livre hoje?",messages:[["them","oii"],["them","minha aula acabou mais cedo"],["them","você vai estar livre hoje? queria te ver"]],incoming:["sumiu?","vai responder ou está estudando mesmo?","achei uma figurinha com a sua cara"]},
  grupo:{name:"Grupo do trabalho",avatar:"👥",status:"5 participantes",preview:"Pedro: alguém fez a conclusão?",messages:[["them","Pedro: alguém fez a conclusão?"],["them","Ana: eu fiz a capa"],["them","Pedro: isso não é a conclusão"]],incoming:["Pedro: gente?","Ana: subi a versão FINAL_agora_v3","Pedro enviou uma figurinha"]},
  monitor:{name:"Monitor Cálculo",avatar:"👨‍🏫",status:"visto por último ontem",preview:"Não haverá prorrogação.",messages:[["them","A lista fecha às 23:59."],["them","Não haverá prorrogação."]],incoming:["Confira o sinal na questão 4.","A monitoria começa em dez minutos.","Não, ainda não haverá prorrogação."]}
};

function whatsappView(){
  return `<div class="wa-app" data-chat="murilove"><aside class="wa-sidebar"><div class="wa-profile"><span class="avatar">🙂</span><b>Conversas</b></div><input class="wa-search" placeholder="Pesquisar conversas">${Object.entries(WA_CHATS).map(([id,c],i)=>`<button class="wa-contact ${i===0?"active":""}" data-wa-chat="${id}"><span class="avatar">${c.avatar}</span><span><b>${esc(c.name)}</b><small data-wa-preview="${id}">${esc(c.preview)}</small></span><time>${i?"ontem":"agora"}</time><i data-wa-unread="${id}"></i></button>`).join("")}</aside><section class="wa-main"><header class="wa-chat-header"><span class="avatar" id="waAvatar"></span><span><b id="waName"></b><small id="waStatus"></small></span></header><div class="wa-thread" id="waThread"></div><div class="wa-stickers" id="waStickers" hidden>${STICKER_FILES.map(file=>`<button type="button" data-sticker="${file}" title="Enviar ${file}"><img src="assets/stickers/${file}" alt="Figurinha ${file.replace(/\.[^.]+$/,'')}"></button>`).join("")}</div><form class="wa-compose" id="waForm"><button type="button" id="waStickerToggle" aria-label="Abrir figurinhas">☺</button><span>📎</span><input id="waInput" placeholder="Digite uma mensagem" autocomplete="off"><button aria-label="Enviar">➤</button></form></section></div>`;
}

function moodleView(){
  return `<div class="moodle-app"><header class="moodle-nav"><span class="moodle-mark">moodle</span><a>Início</a><a>Painel</a><a>Meus cursos</a><span class="moodle-user">Produtivo da Silva ▾</span></header><div class="moodle-body"><aside class="moodle-side"><div>☰ Navegação</div><div class="active">Painel</div><div>Calendário</div><div>Arquivos privados</div><div>Meus cursos</div></aside><main class="moodle-content"><h2>Visão geral dos cursos</h2><div class="moodle-filters"><select class="classic-input"><option>Em andamento</option></select><input class="classic-input" placeholder="Buscar cursos"></div><div class="course-grid"><article class="course-card"><div class="course-art"></div><div><b>MAC0321 — Laboratório de Programação</b><p>EP 7 vence hoje, 23:59</p><div class="progress"><span style="width:62%"></span></div></div></article><article class="course-card"><div class="course-art"></div><div><b>MAT2453 — Cálculo Diferencial</b><p>Lista 12 · 47 questões</p><div class="progress"><span style="width:28%"></span></div></div></article><article class="course-card"><div class="course-art"></div><div><b>FLC0114 — Cultura Brasileira</b><p>Leitura obrigatória</p><div class="progress"><span style="width:81%"></span></div></div></article></div></main></div></div>`;
}

function jupiterView(){
  return `<div class="jupiter-app"><header class="jupiter-head"><span class="usp-mark">USP</span><span class="jupiter-name"><b>JúpiterWeb</b><br>Sistema de Graduação</span><span class="jupiter-login">Produtivo da Silva | Sair</span></header><div class="jupiter-body"><aside class="jupiter-nav"><h4>Acesso Restrito</h4><a>Dados pessoais</a><a>Histórico escolar</a><a>Grade horária</a><a>Matrícula</a><a>Requerimentos</a><h4>Acesso Público</h4><a>Disciplinas</a><a>Calendário escolar</a></aside><main class="jupiter-content"><h2>Grade Horária — 2º semestre de 2026</h2><table class="jupiter-table"><thead><tr><th>Sigla</th><th>Disciplina</th><th>Turma</th><th>Horário</th></tr></thead><tbody><tr><td>MAC0321</td><td>Laboratório de Programação</td><td>2026201</td><td>2ª 14:00–17:40</td></tr><tr><td>MAT2453</td><td>Cálculo Diferencial e Integral III</td><td>2026112</td><td>3ª/5ª 07:30–09:10</td></tr><tr><td>FLC0114</td><td>Cultura Brasileira</td><td>2026104</td><td>6ª 10:00–11:40</td></tr></tbody></table><p><b>Atenção:</b> os dados exibidos são apenas para conferência.</p></main></div></div>`;
}

function runcodesView(){
  return `<div class="run-app"><aside class="run-side"><div class="run-brand">run.codes</div><div class="problem-item active"><b>A. Urubu Sort</b><small style="display:block">100 pontos</small></div><div class="problem-item"><b>B. Fila do Bandejão</b><small style="display:block">150 pontos</small></div><div class="problem-item"><b>C. Prazo Mínimo</b><small style="display:block">200 pontos</small></div></aside><main class="run-main"><div class="run-tabs"><span class="run-tab">main.js</span></div><pre class="run-editor" contenteditable="true" spellcheck="false">function urubuSort(prazos) {\n  // menor prazo primeiro\n  return prazos.sort((a, b) =&gt; a.tempo - b.tempo);\n}\n\nconsole.log(urubuSort(entrada));</pre><footer class="run-bottom"><span id="runResult">Nenhuma submissão executada.</span><button class="run-button" id="runCode">Executar e enviar</button></footer></main></div>`;
}

function folkiView(){
  return `<div class="folki-app"><h2>Folki</h2><p>Ferramentas rápidas para sobreviver à semana.</p><div class="utility-grid"><button class="utility-card" data-folki="calendar"><b>Organizar calendário</b><p>Encontra um horário que ainda não está comprometido.</p></button><button class="utility-card" data-folki="group"><b>Dividir trabalho</b><p>Distribui tarefas e registra responsáveis.</p></button><button class="utility-card" data-folki="summary"><b>Resumir leituras</b><p>Mostra o que falta ler, sem fingir que leu.</p></button><button class="utility-card" data-folki="room"><b>Encontrar sala</b><p>Evita atravessar o campus no prédio errado.</p></button></div><p id="folkiResult"></p></div>`;
}

function browserView(){
  return `<div class="web-browser"><nav class="browser-bar"><button data-browser-home aria-label="Recarregar">↻</button><form id="browserForm"><input id="browserAddress" value="https://urubusp.com" aria-label="Endereço" readonly><button type="button" id="browserExternal">Abrir fora</button></form></nav><div class="browser-embed"><iframe id="urubuspFrame" src="https://urubusp.com" title="Site real urubUSP.com" loading="eager" referrerpolicy="no-referrer" allow="clipboard-read; clipboard-write" sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe><aside class="embed-note"><b>Site real incorporado</b><span>Se esta área ficar vazia ou exibir um bloqueio, o servidor do urubUSP recusou ser aberto dentro de outro site.</span></aside></div></div>`;
}

function instagramView(){
  const posts=[
    ["@atlética_politécnica","TREINO CANCELADO = STORY OBRIGATÓRIO","12.493","grade perfeita que não existe"],
    ["@calouro.em.crise","POV: você abriu o PDF e ele tinha 83 páginas","8.021","salvei para nunca mais ver"],
    ["@studygram_usp","minha rotina realista de 04:17 até 04:29","31.004","link do planner na bio"],
    ["@bandejao_reviews","mistura não identificada: nota 9","5.771","proteína é uma construção social"]
  ];
  return `<div class="instagram-app"><header class="ig-top"><b>Instagram</b><nav><button data-ig-tab="home" class="active">⌂</button><button data-ig-tab="explore">⌕</button><button data-ig-tab="reels">▣</button><button data-ig-action="dm">✉</button></nav></header><div class="ig-shell"><aside class="ig-side"><b>Para você</b><button data-ig-tab="home">⌂ Página inicial</button><button data-ig-tab="explore">⌕ Explorar</button><button data-ig-tab="reels">▣ Reels</button><button data-ig-action="profile">◎ Perfil</button><small id="igTime">tempo desperdiçado: 0s</small></aside><main class="ig-feed" id="igFeed"><section class="ig-stories">${["murilove","rep_12","monitor","crush?","prazo"].map((x,i)=>`<button data-story="${i}"><span>${i===4?"⏰":"🙂"}</span><small>${x}</small></button>`).join("")}</section><div id="igPosts">${posts.map((p,i)=>igPost(p,i)).join("")}</div><button class="ig-more" id="igMore">Carregar mais publicações</button></main><aside class="ig-suggestions"><b>produtivo_da_silva</b><small>Produtivo da Silva</small><h4>Sugestões para você</h4>${["calouro2026","festa_quinta","resumos_gratis"].map(x=>`<p><b>${x}</b><button data-follow>Seguir</button></p>`).join("")}</aside></div></div>`;
}

function igPost(p,i){return `<article class="ig-post" data-post="${i}"><header><span class="ig-avatar">${i%2?"😵":"📚"}</span><b>${p[0]}</b><button>•••</button></header><button class="ig-media media-${i}" data-like="${i}"><span>${p[1]}</span><small>toque duas vezes para curtir</small></button><div class="ig-actions"><button data-like="${i}">♡</button><button data-comment="${i}">○</button><button data-share="${i}">⌁</button><button class="save" data-save="${i}">▱</button></div><p><b>${p[2]} curtidas</b><br><b>${p[0]}</b> ${p[3]}</p><div class="ig-comments" id="igComments${i}"></div><form data-comment-form="${i}"><input placeholder="Adicione um comentário..."><button>Publicar</button></form></article>`}

// EDITAR AQUI: estrutura visual do Pong; a física e as sabotagens ficam em wirePong().
function pongView(){
  return `<div class="pong-app"><header><b>PONG.EXE</b><span>VOCÊ <strong id="pongPlayer">0</strong> : <strong id="pongBot">0</strong> URUBU</span></header><div class="pong-stage"><canvas id="pongCanvas" width="640" height="360" aria-label="Jogo Pong contra o Urubu"></canvas></div><footer><button class="classic-btn" id="pongStart">JOGAR</button></footer></div>`;
}

// EDITAR AQUI: conteúdo da máquina; probabilidades e prêmios ficam em wireBet().
function betView(){
  return `<div class="bet-app"><header class="bet-header">PROCRASTIBET</header><div class="bet-balance">SALDO <b>${state.debugUnlimited?"∞":state.points} ₱</b></div><div class="casino-stage casino-simple"><section class="slot-machine"><div class="slot-lights"></div><div class="slot-reels"><div class="slot-reel">7</div><div class="slot-reel">☠</div><div class="slot-reel">EP</div></div><div class="bet-prize" id="betResult">PRÊMIO —</div><label>APOSTA <input id="betAmount" type="number" min="10" step="10" value="50"></label><button id="placeBet" class="spin-button">GIRAR</button></section></div></div>`;
}

function shopView(){
  const quiet=urubuPaused()?`Silêncio ativo: ${formatRemaining(state.quietUntil)}`:"Urubu em serviço";
  return `<div class="shop-app shop-expanded"><header class="shop-head"><div><h2>Loja do Urubu</h2><p>Troque produtividade por paz temporária e adereços questionáveis.</p></div><div class="shop-wallet"><span>SALDO</span><b>${state.debugUnlimited?"∞":state.points} ₱</b><small>${quiet}</small></div></header><div class="shop-grid">${SHOP_ITEMS.map(i=>{const owned=i.type!=="consumable"&&state.inventory.includes(i.id);return `<article class="shop-card ${owned?"locked":""}"><div class="shop-icon">${i.icon}</div><div><b>${esc(i.name)}</b><p>${esc(i.description)}</p></div><span class="price">${i.price} ₱</span><button class="classic-btn" data-buy="${i.id}" ${owned?"disabled":""}>${owned?"Adquirido":i.type==="consumable"?"Usar agora":"Comprar"}</button></article>`}).join("")}</div><footer class="shop-status">Seguro de cursor: ${state.cursorShield||0} uso(s) · Proteção de atalhos: ${Date.now()<state.iconLockUntil?formatRemaining(state.iconLockUntil):"inativa"}</footer></div>`;
}

function customizeView(){
  const owned=SHOP_ITEMS.filter(i=>state.inventory.includes(i.id)&&i.type==="accessory");
  return `<div class="customize-app"><h2>Personalizar Urubu</h2><div class="customizer-preview"><img src="assets/urubu.png" alt="Prévia do Urubu" style="${state.customization.tie==="pink"?"filter:hue-rotate(285deg) saturate(1.8)":""}"></div><div class="customizer-options"><button class="classic-btn" data-equip="">Sem acessório</button>${owned.map(i=>`<button class="classic-btn" data-equip="${i.id}">${i.icon} ${esc(i.name)}</button>`).join("")}${state.inventory.includes("pinkTie")?'<button class="classic-btn" id="tieToggle">Alternar gravata</button>':""}</div><section class="icon-uploader"><h3>Ícones enviados por você</h3><p>Escolha um dos aplicativos liberados e envie PNG, JPG, WebP ou GIF. A imagem é reduzida e guardada somente neste navegador.</p><div><select id="customIconApp" class="classic-input">${CUSTOM_ICON_APPS.map(id=>{const a=APPS.find(x=>x.id===id);return `<option value="${id}">${esc(a.label)}</option>`}).join("")}</select><label class="classic-btn icon-upload-label">Escolher imagem<input id="customIconFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden></label><button class="classic-btn" id="customIconReset">Restaurar</button></div><small id="customIconStatus">${Object.keys(state.customIcons||{}).length} ícone(s) personalizado(s).</small></section></div>`;
}

function cameraView(){
  return `<div class="presence-app"><h2>Fiscal de Presença</h2><p>A câmera é opcional e processada somente neste navegador. O fiscal combina detector facial nativo com análise local de enquadramento.</p><div class="presence-controls"><button class="classic-btn" id="cameraToggle">${runtime.cameraStream?"Desativar câmera":"Ativar câmera"}</button><b id="cameraState">${runtime.cameraStream?"ATIVA · ANALISANDO":"DESLIGADA"}</b></div><div class="presence-stage"><video id="cameraVideo" class="camera-preview" autoplay muted playsinline></video><div class="presence-frame"></div><strong id="presenceVerdict">AGUARDANDO CÂMERA</strong></div><canvas id="presenceCanvas" width="96" height="72" hidden></canvas><div class="presence-meter"><span id="presenceMeter"></span></div><small id="presenceDetails">A condição precisa persistir por várias leituras antes do alarme.</small></div>`;
}

function debugView(){
  return `<div class="debug-app"><h2>Console de testes</h2><div class="debug-balance"><span>Créditos</span><b>${state.debugUnlimited?"∞":state.points}</b><label><input id="debugUnlimited" type="checkbox" ${state.debugUnlimited?"checked":""}> dinheiro infinito</label></div><div class="debug-grid"><button class="classic-btn" data-debug="100">+100 ₱</button><button class="classic-btn" data-debug="1000">+1.000 ₱</button><button class="classic-btn" data-debug="cursor">Testar roubo do cursor</button><button class="classic-btn" data-debug="icon">Roubar Instagram</button><button class="classic-btn" data-debug="block">Bloquear Instagram</button><button class="classic-btn" data-debug="scream">Testar alarme</button></div><p>Atalho global: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd>. No modo infinito, compras, mensagens e apostas não diminuem o saldo.</p></div>`;
}

function runDialog(){
  return `<div class="folki-app"><p>Digite o nome de um aplicativo, pasta, documento ou recurso.</p><div style="display:flex;gap:8px"><input id="runInput" class="classic-input" style="flex:1" placeholder="Há poucos lugares para onde fugir"><button id="runOpen" class="classic-btn">OK</button><button class="classic-btn" data-close-run>Cancelar</button></div></div>`;
}

function wireApp(id,win){
  if(id==="tasks")wireTasks(win);
  if(id==="whatsapp")wireWhatsapp(win);
  if(id==="browser")wireBrowser(win);
  if(id==="ecard")wireEcard(win);
  if(id==="runcodes")$("#runCode",win).onclick=()=>{$("#runResult",win).textContent="Aceito · 3/3 casos · 0.083s";awardFocusBonus(12,"Submissão aceita em Run.codes.")};
  if(id==="folki")$$('[data-folki]',win).forEach(b=>b.onclick=()=>{$("#folkiResult",win).textContent={calendar:"Janela encontrada: quinta, 18:00–18:12.",group:"Você: introdução e conclusão. Pedro: visualizado.",summary:"Restam 64 páginas. O resumo é: comece.",room:"Sala B-16. Não confundir com o bloco B."}[b.dataset.folki]});
  if(id==="instagram")wireInstagram(win);
  if(id==="pong")wirePong(win);
  if(id==="procrastibet")wireBet(win);
  if(id==="shop")$$('[data-buy]',win).forEach(b=>b.onclick=()=>buyItem(b.dataset.buy));
  if(id==="customize")wireCustomizer(win);
  if(id==="camera")$("#cameraToggle",win).onclick=()=>toggleCamera(win);
  if(id==="debug")wireDebug(win);
  if(id==="run"){$("#runOpen",win).onclick=()=>{const value=$("#runInput",win).value.toLowerCase();const app=APPS.find(a=>a.label.toLowerCase().includes(value)||a.id===value);if(app){closeWindow("run");openApp(app.id)}else toast("ProdutivOS","O sistema não encontrou este aplicativo.")};$("[data-close-run]",win).onclick=()=>closeWindow("run")}
}

function wireEcard(win){
  const card=$(".ecard",win),button=$("[data-ecard-flip]",win);let back=false;
  button.onclick=()=>{back=!back;card.classList.toggle("show-back",back);button.textContent=back?"Ver frente":"Ver verso";
    if(back)card.innerHTML=`<header class="ecard-brand"><span class="ecard-usp">usp</span><span>Universidade de São Paulo<br><b>e-Card</b></span><i>VERSO</i></header><div class="ecard-back"><div class="ecard-stripe"></div><p>Este cartão é pessoal e intransferível.</p><div class="ecard-barcode" aria-label="Código de barras"></div><b>0000000 003 2026</b><small>Em caso de perda, procure o Urubu. Ele provavelmente pegou.</small></div><footer><span>Central de serviços digitais</span><b>PRODUTIV<u>OS</u></b></footer>`;
    else refreshWindow("ecard");
  };
}

function wireTasks(win){
  $("#taskForm",win).onsubmit=e=>{e.preventDefault();const text=$("#taskInput",win).value.trim();if(!text)return;state.tasks.push({id:`t-${Date.now()}`,text,category:$("#taskCategory",win).value,priority:$("#taskPriority",win).value,due:$("#taskDue",win).value,done:false,rewarded:false,createdAt:Date.now()});persist();refreshWindow("tasks")};
  $$('[data-task-filter]',win).forEach(b=>b.onclick=()=>{state.taskFilter=b.dataset.taskFilter;persist();refreshWindow("tasks")});
  $$('[data-check-task]',win).forEach(box=>box.onchange=()=>toggleTask(box.dataset.checkTask,box.checked));
  $$('[data-delete-task]',win).forEach(btn=>btn.onclick=()=>{state.tasks=state.tasks.filter(t=>String(t.id)!==btn.dataset.deleteTask);persist();refreshWindow("tasks")});
}

function toggleTask(id,done){
  const task=state.tasks.find(t=>String(t.id)===String(id));if(!task)return;
  task.done=done;
  if(done&&!task.rewarded){
    const key=taskKey(task.text);
    if(state.rewardedTaskKeys.includes(key)){task.rewarded=true;toast("Sem novos créditos","Essa tarefa já foi recompensada antes.")}
    else{task.rewarded=true;state.rewardedTaskKeys.push(key);state.daily.taskRewards++;addPoints(ECONOMY.taskRewards[task.priority]||ECONOMY.taskRewards.normal,"Primeira conclusão registrada.")}
  }
  persist();refreshWindow("tasks");
}

function refreshWindow(id){
  const item=runtime.windows.get(id);if(!item)return;
  $(".window-content",item.win).innerHTML=VIEWS[id]();wireApp(id,item.win);
}

function wireWhatsapp(win){
  const app=$(".wa-app",win),threads={};Object.entries(WA_CHATS).forEach(([id,c])=>threads[id]=c.messages.map(m=>[...m]));
  const renderThread=()=>{const id=app.dataset.chat,c=WA_CHATS[id];$("#waAvatar",win).textContent=c.avatar;$("#waName",win).textContent=c.name;$("#waStatus",win).textContent=c.status;$("#waThread",win).innerHTML=threads[id].map(m=>m[0]==="sticker"?`<div class="wa-bubble ${m[2]||"them"} sticker"><img src="assets/stickers/${m[1]}" alt="Figurinha"><time>agora</time></div>`:`<div class="wa-bubble ${m[0]}">${esc(m[1])}<time>agora${m[0]==="me"?" ✓✓":""}</time></div>`).join("");$("#waThread",win).scrollTop=$("#waThread",win).scrollHeight;$$('[data-wa-chat]',win).forEach(b=>b.classList.toggle("active",b.dataset.waChat===id));$(`[data-wa-unread="${id}"]`,win).textContent=""};
  const select=id=>{app.dataset.chat=id;renderThread()};
  $$('[data-wa-chat]',win).forEach(b=>b.onclick=()=>select(b.dataset.waChat));
  $(".wa-search",win).oninput=e=>$$('[data-wa-chat]',win).forEach(b=>b.hidden=!b.textContent.toLowerCase().includes(e.target.value.toLowerCase()));
  $("#waStickerToggle",win).onclick=()=>$("#waStickers",win).hidden=!$("#waStickers",win).hidden;
  $$('[data-sticker]',win).forEach(b=>b.onclick=()=>{const id=app.dataset.chat;threads[id].push(["sticker",b.dataset.sticker,"me"]);$("#waStickers",win).hidden=true;renderThread();setTimeout(()=>incomingWhatsapp(win,threads,id),900)});
  $("#waForm",win).onsubmit=e=>{e.preventDefault();const input=$("#waInput",win),text=input.value.trim();if(!text)return;const id=app.dataset.chat;if(id==="murilove"&&!canAfford(160)){buddyScream("Era falso. Você não tem namorada.");toast("Mensagem interceptada","Créditos insuficientes para responder.");return}if(id==="murilove")spendPoints(160,"Mensagem enviada.");threads[id].push(["me",text]);input.value="";renderThread();setTimeout(()=>incomingWhatsapp(win,threads,id),900)};
  clearInterval(runtime.whatsappTimer);runtime.whatsappTimer=setInterval(()=>{if(!runtime.windows.has("whatsapp"))return;const ids=Object.keys(WA_CHATS),id=pick(ids);incomingWhatsapp(win,threads,id)},13000);
  renderThread();
}

function incomingWhatsapp(win,threads,id){
  if(!runtime.windows.has("whatsapp"))return;const c=WA_CHATS[id],message=pick(c.incoming);threads[id].push(["them",message]);playSfx("message",1600);$(`[data-wa-preview="${id}"]`,win).textContent=message;if($(".wa-app",win).dataset.chat===id){const thread=$("#waThread",win);thread.insertAdjacentHTML("beforeend",`<div class="wa-bubble them">${esc(message)}<time>agora</time></div>`);thread.scrollTop=thread.scrollHeight}else $(`[data-wa-unread="${id}"]`,win).textContent="1";buddySay(id==="grupo"?"O grupo mandou mensagem. A palavra 'gente' foi detectada.":id==="monitor"?"O monitor escreveu. Isso costuma ser importante.":"Murilove está digitando. Suspeito.")
}

function wireBrowser(win){
  const frame=$("#urubuspFrame",win),desk=$("#desktop"),ghost=$("#cursorGhost");
  $("[data-browser-home]",win).onclick=()=>{frame.src="about:blank";setTimeout(()=>frame.src="https://urubusp.com",60)};$("#browserExternal",win).onclick=()=>window.open("https://urubusp.com","_blank","noopener");
  // Um iframe de outro domínio não compartilha eventos de ponteiro. Ocultamos o
  // cursor virtual ao entrar e o ressincronizamos ao sair para nunca mostrar dois.
  frame.addEventListener("mouseenter",()=>{if(!runtime.virtualCursor.active)desk.classList.add("cursor-over-frame")});
  frame.addEventListener("mouseleave",e=>{desk.classList.remove("cursor-over-frame");runtime.physicalPointer={x:e.clientX,y:e.clientY};runtime.pointer={...runtime.physicalPointer};ghost.style.left=`${e.clientX}px`;ghost.style.top=`${e.clientY}px`});
}

function wireBet(win){
  let spinning=false;
  $("#placeBet",win).onclick=()=>{
    if(spinning)return;
    const amount=Math.max(10,Math.floor(Number($("#betAmount",win).value)||0));
    if(!canAfford(amount)){$("#betResult",win).textContent="Saldo insuficiente.";return}
    spinning=true;playSfx("gamble",1800);$("#placeBet",win).disabled=true;$$('.slot-reel',win).forEach((r,i)=>{r.classList.add("spinning");r.style.setProperty("--spin-delay",`${i*.08}s`)});
    // EDITAR AQUI: 90% x0, 6% x0,5, 3% x2, 0,8% x5 e 0,2% x10.
    setTimeout(()=>{const roll=Math.random();
      const mult=roll<.90?0:roll<.96?.5:roll<.99?2:roll<.998?5:10;
      const symbols=mult?['7','₱','7']:['☠','EP','0'];$$('.slot-reel',win).forEach((r,i)=>{r.classList.remove("spinning");r.textContent=symbols[i]});
      if(mult===0){playSfx("scream",1000);playImpact();spendPoints(amount,"A roleta do prazo ficou em x0.");$("#betResult",win).textContent="PRÊMIO 0 ₱";buddySay("A roleta decidiu que seu prêmio é experiência.")}else if(mult<1){playSfx("explosion",900);spendPoints(Math.ceil(amount/2),"A roleta devolveu apenas metade.");$("#betResult",win).textContent=`PRÊMIO ${Math.floor(amount/2)} ₱`}else{playSfx("airhorn",1200);const prize=Math.floor(amount*mult);addPoints(prize,"Multiplicador improvável da Procrastibet.");$("#betResult",win).textContent=`PRÊMIO ${prize} ₱`}
      $("#placeBet",win).disabled=false;spinning=false;updateHUD();
    },1450);
  };
}

function buyItem(id){
  const item=SHOP_ITEMS.find(i=>i.id===id);if(!item||(item.type!=="consumable"&&state.inventory.includes(id)))return;
  if(!canAfford(item.price)){toast("Saldo insuficiente","Volte quando o trabalho estiver feito.");return}
  spendPoints(item.price,`Comprado: ${item.name}`);
  if(item.type!=="consumable")state.inventory.push(id);
  if(id==="quiet5"){state.quietUntil=Math.max(Date.now(),state.quietUntil||0)+300000;releaseCursor();$("#urubuBubble").classList.remove("show");toast("Urubu silenciado","Cinco minutos de paz começaram agora.")}
  if(id==="cursorShield"){state.cursorShield=(state.cursorShield||0)+2;toast("Seguro ativo","Os próximos dois roubos de cursor serão cancelados.")}
  if(id==="iconTape"){state.iconLockUntil=Math.max(Date.now(),state.iconLockUntil||0)+600000;toast("Atalhos fixados","Nenhum ícone será roubado por dez minutos.")}
  persist();
  refreshWindow("shop");
}

function wirePong(win){
  // EDITAR AQUI: velocidades, frequência das trapaças e tipos de sabotagem do Urubu.
  const canvas=$("#pongCanvas",win),ctx=canvas.getContext("2d"),game={running:false,player:145,bot:145,ball:{x:320,y:180,vx:4.2,vy:2.3,r:7},p:0,b:0,lastSabotage:0,botBoost:0,drift:0};
  const reset=dir=>{game.ball={x:320,y:180,vx:dir*4.4,vy:(Math.random()-.5)*5,r:7}};
  const movePlayer=y=>game.player=clamp(y-45,0,270);
  canvas.addEventListener("pointermove",e=>{const r=canvas.getBoundingClientRect();movePlayer((e.clientY-r.top)*360/r.height)});
  win.addEventListener("keydown",e=>{if(e.key==="ArrowUp")game.player-=22;if(e.key==="ArrowDown")game.player+=22;game.player=clamp(game.player,0,270)});win.tabIndex=0;
  $("#pongStart",win).onclick=()=>{game.running=!game.running;$("#pongStart",win).textContent=game.running?"PAUSAR":"JOGAR";win.focus()};
  function sabotage(now){if(urubuPaused()||now-game.lastSabotage<6000)return;game.lastSabotage=now;const trick=pick(["curve","boost","drift"]);if(trick==="curve")game.ball.vy+=game.ball.y<180?.85:-.85;if(trick==="boost")game.botBoost=1800;if(trick==="drift")game.drift=pick([-10,10]);setTimeout(()=>{game.botBoost=0;game.drift=0},1800)}
  function frame(now){if(!runtime.windows.has("pong"))return;if(game.running){sabotage(now);game.bot+=clamp(game.ball.y-(game.bot+45),-(game.botBoost?5.2:3.8),game.botBoost?5.2:3.8);game.bot=clamp(game.bot,0,270);game.player=clamp(game.player+game.drift*.015,0,270);game.ball.x+=game.ball.vx;game.ball.y+=game.ball.vy;if(game.ball.y<game.ball.r||game.ball.y>360-game.ball.r)game.ball.vy*=-1;const hit=(x,paddle)=>game.ball.y>paddle&&game.ball.y<paddle+90&&(game.ball.vx<0?game.ball.x-game.ball.r<x+14:game.ball.x+game.ball.r>x);if(game.ball.x<31&&hit(18,game.player)){game.ball.vx=Math.abs(game.ball.vx)*1.025;game.ball.vy+=(game.ball.y-game.player-45)/17}if(game.ball.x>609&&hit(608,game.bot)){game.ball.vx=-Math.abs(game.ball.vx)*1.025;game.ball.vy+=(game.ball.y-game.bot-45)/17}if(game.ball.x<0){game.b++;$("#pongBot",win).textContent=game.b;reset(1)}if(game.ball.x>640){game.p++;$("#pongPlayer",win).textContent=game.p;reset(-1)}}
    ctx.fillStyle="#050505";ctx.fillRect(0,0,640,360);ctx.strokeStyle="#444";ctx.setLineDash([9,9]);ctx.beginPath();ctx.moveTo(320,0);ctx.lineTo(320,360);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#b6ff00";ctx.fillRect(18,game.player,14,90);ctx.fillStyle="#ddd";ctx.fillRect(608,game.bot,14,90);ctx.beginPath();ctx.arc(game.ball.x,game.ball.y,game.ball.r,0,Math.PI*2);ctx.fillStyle=game.ball.r>8?"#ff2d7a":"#fff";ctx.fill();ctx.font="12px monospace";ctx.fillStyle="#777";ctx.fillText("PRODUTIVIDADE NÃO ENCONTRADA",218,18);requestAnimationFrame(frame)}requestAnimationFrame(frame);
}

function wireInstagram(win){
  const started=Date.now();
  const time=setInterval(()=>{if(!runtime.windows.has("instagram")){clearInterval(time);return}const s=Math.floor((Date.now()-started)/1000);$("#igTime",win).textContent=`tempo desperdiçado: ${s}s`;if(s>0&&s%15===0){addPoints(-8,"Rolagem prolongada no Instagram.");buddySay("O feed não termina. Seu prazo termina.")}},1000);
  $$('[data-like]',win).forEach(b=>b.onclick=()=>{const post=b.closest(".ig-post");post.classList.toggle("liked");b.textContent=post.classList.contains("liked")?"♥":"♡";if(post.classList.contains("liked"))addPoints(-2,"Curtida impulsiva.")});
  $$('[data-save]',win).forEach(b=>b.onclick=()=>{b.classList.toggle("active");toast("Instagram",b.classList.contains("active")?"Salvo para nunca mais abrir.":"Removido dos salvos.")});
  $$('[data-follow]',win).forEach(b=>b.onclick=()=>{b.textContent=b.textContent==="Seguir"?"Seguindo":"Seguir";if(b.textContent==="Seguindo")addPoints(-3,"Nova distração seguida.")});
  $$('[data-story]',win).forEach(b=>b.onclick=()=>{b.classList.add("seen");toast("Instagram","Story visualizado.");if(Number(b.dataset.story)===4)buddyBlockWindow("instagram")});
  $$('[data-comment-form]',win).forEach(f=>f.onsubmit=e=>{e.preventDefault();const input=$("input",f),v=input.value.trim();if(!v)return;$("#igComments"+f.dataset.commentForm,win).insertAdjacentHTML("beforeend",`<p><b>produtivo_da_silva</b> ${esc(v)}</p>`);input.value="";addPoints(-4,"Comentário publicado durante o prazo.")});
  $$('[data-ig-tab]',win).forEach(b=>b.onclick=()=>{$$('[data-ig-tab]',win).forEach(x=>x.classList.toggle("active",x.dataset.igTab===b.dataset.igTab));$("#igPosts",win).className=`ig-${b.dataset.igTab}`;if(b.dataset.igTab==="reels")setTimeout(()=>buddyBlockWindow("instagram"),500)});
  $("#igMore",win).onclick=()=>{$("#igPosts",win).insertAdjacentHTML("beforeend",igPost(["@algoritmo_sem_fim","VOCÊ PEDIU MAIS. ELE ENTREGOU MAIS.","2","não existe última publicação"],Date.now()));addPoints(-5,"Você pediu mais feed.");buddySay("Eu vi esse clique.")};
}

function wireDebug(win){
  $("#debugUnlimited",win).onchange=e=>{state.debugUnlimited=e.target.checked;updateHUD();refreshWindow("debug")};
  $$('[data-debug]',win).forEach(b=>b.onclick=e=>{const v=b.dataset.debug;if(/^\d+$/.test(v)){addPoints(Number(v),"Crédito de teste.");refreshWindow("debug")}else if(v==="cursor"){runtime.pointer={x:e.clientX,y:e.clientY};catchCursor(true)}else if(v==="icon")stealIcon("instagram",true);else if(v==="block"){if(!runtime.windows.has("instagram"))openApp("instagram");setTimeout(()=>buddyBlockWindow("instagram",true),250)}else buddyScream("TESTE DO ALARME DE PRESENÇA.")});
}

function wireCustomizer(win){
  $$('[data-equip]',win).forEach(b=>b.onclick=()=>{state.customization.accessory=b.dataset.equip;applyCustomization();persist();refreshWindow("customize")});
  $("#tieToggle",win)?.addEventListener("click",()=>{state.customization.tie=state.customization.tie==="pink"?"green":"pink";applyCustomization();persist();refreshWindow("customize")});
  $("#customIconFile",win).onchange=e=>{const file=e.target.files?.[0],id=$("#customIconApp",win).value;if(!file)return;const reader=new FileReader();reader.onload=()=>{const image=new Image();image.onload=()=>{const canvas=document.createElement("canvas");canvas.width=64;canvas.height=64;const ctx=canvas.getContext("2d");ctx.clearRect(0,0,64,64);const scale=Math.min(64/image.width,64/image.height),w=image.width*scale,h=image.height*scale;ctx.drawImage(image,(64-w)/2,(64-h)/2,w,h);state.customIcons[id]=canvas.toDataURL("image/png");persist();renderDesktop();renderStartMenu();$("#customIconStatus",win).textContent=`Ícone de ${APPS.find(a=>a.id===id).label} atualizado.`};image.src=reader.result};reader.readAsDataURL(file)};
  $("#customIconReset",win).onclick=()=>{const id=$("#customIconApp",win).value;delete state.customIcons[id];persist();renderDesktop();renderStartMenu();$("#customIconStatus",win).textContent="Ícone original restaurado."};
}

function applyCustomization(){
  const item=SHOP_ITEMS.find(i=>i.id===state.customization.accessory);
  $("#urubuAccessory").textContent=item?.type==="accessory"?item.icon:"";
  $("#urubu").classList.remove("glasses"); // limpa estado legado de versões anteriores
  $("#urubuImage").style.filter=state.customization.tie==="pink"?"hue-rotate(285deg) saturate(1.8)":"";
}

function awardFocusBonus(amount,reason){
  state.daily.focusCredits+=amount;addPoints(amount,reason);
}

function buddySay(text,duration=3400,force=false){
  if(urubuPaused()&&!force)return;
  const bubble=$("#urubuBubble");bubble.textContent=text;bubble.classList.add("show");
  clearTimeout(runtime.bubbleTimer);runtime.bubbleTimer=setTimeout(()=>bubble.classList.remove("show"),duration);
}

function setBuddyPose(pose){
  const img=$("#urubuImage"),buddy=$("#urubu");
  buddy.classList.remove("idle","scream","reaching","grabbing","stealing","peck","blocking","animating");
  const files={idle:"urubu.png",reach:"urubu-steal.png",grab:"urubu-grab-clean-v3.png",scream:"urubu-scream.png",steal:"urubu-steal.png",block:"urubu-block-clean-v2.png"};
  img.src=`assets/${files[pose]||files.idle}`;
  buddy.classList.add(pose==="grab"?"grabbing":pose==="reach"?"reaching":pose==="steal"?"stealing":pose==="block"?"blocking":pose);
  buddy.classList.toggle("animating",pose!=="idle");
}

function moveBuddy(x,y){
  const buddy=$("#urubu"),r=buddy.getBoundingClientRect(),nx=clamp(x,0,innerWidth-buddy.offsetWidth),ny=clamp(y,0,innerHeight-buddy.offsetHeight-38),distance=Math.hypot(nx-r.left,ny-r.top),duration=clamp(420+distance*.85,480,1250);
  clearTimeout(runtime.buddyTravelTimer);buddy.style.setProperty("--travel-ms",`${duration}ms`);buddy.classList.add("travelling");buddy.style.right="auto";buddy.style.bottom="auto";buddy.style.left=`${nx}px`;buddy.style.top=`${ny}px`;runtime.buddyTravelTimer=setTimeout(()=>buddy.classList.remove("travelling"),duration+80);
}

function catchCursor(force=false){
  if(force&&runtime.virtualCursor.active)releaseCursor(true);
  if(urubuPaused()&&!force)return;
  if((state.cursorShield||0)>0&&!force){state.cursorShield--;persist();toast("Seguro de cursor","Roubo cancelado. Restam "+state.cursorShield+" uso(s).");return}
  if((runtime.buddyBusy&&!force)||runtime.virtualCursor.active)return;if(force)runtime.buddyBusy=false;runtime.buddyBusy=true;
  const ghost=$("#cursorGhost"),desk=$("#desktop"),start={...runtime.physicalPointer};runtime.pointer={...start};clearTimeout(runtime.cursorResetTimer);desk.classList.remove("cursor-over-frame");playSfx("explosion",1300);playImpact();
  desk.classList.remove("cursor-caught");void ghost.offsetWidth;setBuddyPose("reach");buddySay(pick(COPY.caught)+" Eu devolvo quando terminar.",4200);moveBuddy(start.x-315,start.y-105);
  setTimeout(()=>{setBuddyPose("grab");ghost.style.transition="none";ghost.style.left=`${start.x}px`;ghost.style.top=`${start.y}px`;desk.classList.add("cursor-caught")},420);
  setTimeout(()=>{
    const x=45+Math.random()*(innerWidth-130),y=55+Math.random()*(innerHeight-150);
    runtime.virtualCursor={active:true,x,y,lastX:null,lastY:null,synthetic:false};
    ghost.style.transition="left .9s cubic-bezier(.12,.78,.18,1), top .9s cubic-bezier(.12,.78,.18,1)";ghost.style.left=`${x}px`;ghost.style.top=`${y}px`;moveBuddy(x-250,y-105);
  },720);
  setTimeout(()=>{setBuddyPose("idle");runtime.buddyBusy=false;ghost.style.transition="none"},1750);
  // O roubo é sempre temporário. Isso evita que o ponteiro físico e o virtual
  // acumulem deslocamentos diferentes durante interações longas ou em iframes.
  runtime.cursorResetTimer=setTimeout(()=>releaseCursor(true),2450);
}

function releaseCursor(silent=false){
  if(!runtime.virtualCursor.active&&!$("#desktop").classList.contains("cursor-caught"))return;clearTimeout(runtime.cursorResetTimer);runtime.cursorResetTimer=null;const actual={...runtime.physicalPointer},ghost=$("#cursorGhost");runtime.virtualCursor={active:false,x:actual.x,y:actual.y,lastX:null,lastY:null,synthetic:false};runtime.pointer={...actual};ghost.style.transition="none";ghost.style.left=`${actual.x}px`;ghost.style.top=`${actual.y}px`;$("#desktop").classList.remove("cursor-caught");requestAnimationFrame(()=>{const latest={...runtime.physicalPointer};runtime.pointer={...latest};ghost.style.left=`${latest.x}px`;ghost.style.top=`${latest.y}px`});playTone(620,.08,"square");if(!silent)buddySay("Mouse devolvido e sincronizado. Por enquanto.");
}

function stealIcon(appId,force=false){
  if(urubuPaused()||Date.now()<state.iconLockUntil||(runtime.buddyBusy&&!force)||Date.now()<runtime.theftCooldown)return;
  const app=APPS.find(a=>a.id===appId&&a.kind==="procrastination"&&!state.stolenApps.includes(a.id));if(!app)return;
  const icon=$(`[data-app="${app.id}"]`);if(!icon)return;
  runtime.buddyBusy=true;runtime.theftCooldown=Date.now()+10000;playSfx("airhorn",1000);setBuddyPose("reach");buddySay(pick(COPY.theft));const r=icon.getBoundingClientRect();moveBuddy(r.left-80,r.top-45);
  setTimeout(()=>setBuddyPose("steal"),380);
  setTimeout(()=>{icon.classList.add("stolen");state.stolenApps.push(app.id);persist();moveBuddy(innerWidth-190,innerHeight-280)},750);
  setTimeout(()=>{const area=$("#desktopIcons").getBoundingClientRect(),slot=findDesktopSlot(app.id,Math.random()*Math.max(90,area.width-260),Math.random()*Math.max(80,area.height-90));state.iconPositions[app.id]=slot;state.stolenApps=state.stolenApps.filter(x=>x!==app.id);persist();renderDesktop();setBuddyPose("idle");runtime.buddyBusy=false;buddySay("Devolvi. Encontre.")},5200);
}

function buddyScream(text){
  if(urubuPaused()||runtime.buddyBusy)return;runtime.buddyBusy=true;playSfx("scream",1100);playImpact();setBuddyPose("scream");buddySay(text||pick(COPY.alarm),4300);moveBuddy(innerWidth/2-120,innerHeight/2-180);setTimeout(()=>{setBuddyPose("idle");runtime.buddyBusy=false},3200);
}

function buddyBlockWindow(id,force=false){
  const item=runtime.windows.get(id);if(!item||(urubuPaused()&&!force)||(runtime.buddyBusy&&!force))return;
  runtime.buddyBusy=true;playSfx("explosion",1200);playImpact();const r=item.win.getBoundingClientRect(),buddy=$("#urubu"),bubble=$("#urubuBubble");bubble.classList.remove("show");clearTimeout(runtime.bubbleTimer);setBuddyPose("block");buddy.style.setProperty("--block-scale",".62");moveBuddy(r.left+r.width/2-285,r.top+r.height/2-205);
  requestAnimationFrame(()=>requestAnimationFrame(()=>buddy.style.setProperty("--block-scale",String(Math.min(1.75,1.02+state.chaos*.14)))));
  setTimeout(()=>{buddy.style.setProperty("--block-scale",".65");setTimeout(()=>{buddy.style.removeProperty("--block-scale");setBuddyPose("idle");runtime.buddyBusy=false},450)},3800);
}

function roamBuddy(){
  if(urubuPaused()||runtime.buddyBusy||document.hidden)return;
  const edges=[[innerWidth-220,innerHeight-300],[innerWidth*.62,innerHeight-285],[innerWidth*.28,innerHeight-275]];const [x,y]=pick(edges);moveBuddy(x,y);
  if(Math.random()<.3){$("#urubu").classList.add("peck");setTimeout(()=>$("#urubu").classList.remove("peck"),1000)}
}

async function toggleCamera(win){
  if(runtime.cameraStream){stopCamera();refreshWindow("camera");return}
  try{
    runtime.cameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false});
    const video=$("#cameraVideo",win);video.srcObject=runtime.cameraStream;await video.play();$("#cameraState",win).textContent="ATIVA · PROCESSAMENTO LOCAL";$("#cameraToggle",win).textContent="Desativar câmera";
    runtime.presence={badFrames:0,goodFrames:0,alarm:false,lastAlarm:0,lastPixels:null,stillFrames:0,detector:"FaceDetector" in window?new FaceDetector({fastMode:false,maxDetectedFaces:1}):null};runtime.cameraTimer=setInterval(()=>inspectPresence(win,video),900);
  }catch{toast("Câmera indisponível","Permissão não concedida. O Urubu trabalhará por suspeita.")}
}

async function inspectPresence(win,video){
  if(!runtime.cameraStream||video.readyState<2)return;let bad=false,reason="ROSTO CENTRALIZADO",confidence=100;
  if(runtime.presence.detector){try{const faces=await runtime.presence.detector.detect(video);if(!faces.length){bad=true;reason="ROSTO FORA DO ENQUADRAMENTO";confidence=0}else{const b=faces[0].boundingBox,w=video.videoWidth,h=video.videoHeight,cx=(b.x+b.width/2)/w,cy=(b.y+b.height/2)/h,area=(b.width*b.height)/(w*h);if(cy>.61||b.y/h>.34){bad=true;reason="ROSTO MUITO BAIXO";confidence=28}else if(cx<.25||cx>.75){bad=true;reason="ROSTO FORA DO CENTRO";confidence=36}else if(area<.028){bad=true;reason="VOCÊ ESTÁ LONGE DEMAIS";confidence=25}else{confidence=Math.min(100,58+area*260)}}}catch{runtime.presence.detector=null;({bad,reason,confidence}=presenceFallback(win,video))}}
  else({bad,reason,confidence}=presenceFallback(win,video));
  runtime.presence.badFrames=bad?runtime.presence.badFrames+1:Math.max(0,runtime.presence.badFrames-2);runtime.presence.goodFrames=bad?0:(runtime.presence.goodFrames||0)+1;const verdict=$("#presenceVerdict",win),meter=$("#presenceMeter",win);if(verdict){verdict.textContent=reason;verdict.classList.toggle("bad",bad);meter.style.width=`${confidence}%`}
  if(runtime.presence.badFrames>=3){runtime.presence.alarm=true;if(Date.now()-runtime.presence.lastAlarm>4500){runtime.presence.lastAlarm=Date.now();presenceAlarm(reason)}}else if(runtime.presence.goodFrames>=2&&runtime.presence.alarm){runtime.presence.alarm=false;buddySay("Presença restaurada. Não teste minha paciência.");if(!runtime.buddyBusy)setBuddyPose("idle")}
}

function presenceFallback(win,video){
  const canvas=$("#presenceCanvas",win),ctx=canvas.getContext("2d",{willReadFrequently:true}),w=canvas.width,h=canvas.height;ctx.drawImage(video,0,0,w,h);const pixels=ctx.getImageData(0,0,w,h).data;let light=0,light2=0,diff=0,edges=0,count=0,skin=0,sx=0,sy=0,minX=w,maxX=0,minY=h,maxY=0;
  for(let i=0;i<pixels.length;i+=4){const r=pixels[i],g=pixels[i+1],b=pixels[i+2],p=i/4,x=p%w,y=Math.floor(p/w),lum=.299*r+.587*g+.114*b,cb=128-.169*r-.331*g+.5*b,cr=128+.5*r-.419*g-.081*b;light+=lum;light2+=lum*lum;if(runtime.presence.lastPixels)diff+=Math.abs(r-runtime.presence.lastPixels[i])+Math.abs(g-runtime.presence.lastPixels[i+1])+Math.abs(b-runtime.presence.lastPixels[i+2]);if(x>0)edges+=Math.abs(lum-(.299*pixels[i-4]+.587*pixels[i-3]+.114*pixels[i-2]));count++;const isSkin=lum>24&&cb>72&&cb<142&&cr>125&&cr<184&&r>g*.82&&r>b*.88;if(isSkin){skin++;sx+=x;sy+=y;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)}}
  const avg=light/count,variance=Math.sqrt(Math.max(0,light2/count-avg*avg)),motion=runtime.presence.lastPixels?diff/(count*3):20,texture=edges/count;runtime.presence.lastPixels=new Uint8ClampedArray(pixels);runtime.presence.stillFrames=avg<14||motion<.35?runtime.presence.stillFrames+1:0;const coverage=skin/count,cx=skin?sx/skin/w:.5,cy=skin?sy/skin/h:1,boxW=skin?(maxX-minX)/w:0,boxH=skin?(maxY-minY)/h:0,faceLike=coverage>.014&&boxW>.12&&boxH>.12&&variance>12&&texture>3;
  if(runtime.presence.stillFrames>=6||(!faceLike&&motion<2.2))return{bad:true,reason:"ROSTO FORA DO ENQUADRAMENTO",confidence:6};if(!faceLike)return{bad:true,reason:"PROCURANDO ROSTO...",confidence:18};if(cy>.63||minY/h>.36)return{bad:true,reason:"CABEÇA BAIXA DETECTADA",confidence:30};if(cx<.25||cx>.75)return{bad:true,reason:"VOCÊ SAIU DO CENTRO",confidence:35};return{bad:false,reason:"ROSTO CENTRALIZADO · ANÁLISE LOCAL",confidence:Math.min(92,48+coverage*240+Math.min(18,motion))}
}
function presenceAlarm(reason){if(urubuPaused())return;state.chaos=Math.min(5,state.chaos+1);updateHUD();buddyScream(`${reason}. VOLTE AGORA.`);try{const ac=new AudioContext(),o=ac.createOscillator(),g=ac.createGain();o.type="square";o.frequency.value=780;g.gain.value=.08;o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+.45)}catch{}}
function stopCamera(){clearInterval(runtime.cameraTimer);runtime.cameraTimer=null;runtime.cameraStream?.getTracks().forEach(t=>t.stop());runtime.cameraStream=null;runtime.presence.alarm=false}

function toggleSound(){
  state.soundOn=!state.soundOn;$("#soundBtn").textContent=state.soundOn?"🔊":"🔇";$("#soundBtn").setAttribute("aria-pressed",state.soundOn);
  $("#youtubeAudio").innerHTML=state.soundOn?`<iframe width="1" height="1" allow="autoplay" src="https://www.youtube.com/embed/${ECONOMY.audioYoutubeId}?autoplay=1&loop=1&playlist=${ECONOMY.audioYoutubeId}&controls=0"></iframe>`:"";persist();
  if(state.soundOn){playTone(520,.08);setTimeout(()=>playTone(760,.08),90)}
}

function shutdownHell(){
  const overlay=$("#shutdownOverlay");overlay.hidden=false;let step=0;playSfx("disaster",2400);
  const screens=[
    ()=>`<section class="shutdown-dialog"><div class="shutdown-title">Desligar o ProdutivOS</div><div class="shutdown-body"><p>O que você deseja que o computador faça?</p><label class="shutdown-option"><input type="radio" name="shutdownMode" value="poweroff" checked> <span><b>Desligar o computador</b><small>Encerra a sessão acadêmica.</small></span></label><label class="shutdown-option"><input type="radio" name="shutdownMode" value="restart"> <span><b>Reiniciar o computador</b><small>Volta para o mesmo prazo em alguns segundos.</small></span></label><div class="shutdown-actions"><button class="classic-btn" data-next>OK</button><button class="classic-btn" data-cancel>Cancelar</button></div></div></section>`,
    ()=>`<section class="shutdown-dialog"><div class="shutdown-title">Verificação de trabalho salvo</div><div class="shutdown-body"><p>Marque para confirmar:</p><label><input id="savedCheck" type="checkbox"> Salvei tudo e não estou fugindo de um prazo.</label><div class="shutdown-actions"><button class="classic-btn" data-next>Avançar</button></div></div></section>`,
    ()=>`<section class="shutdown-dialog"><div class="shutdown-title">Verificação de diamante</div><div class="shutdown-body shutdown-diamond-step"><p>O diamante foi encontrado. Esta imagem comprova que você minerou o suficiente por hoje.</p><img class="shutdown-diamond" src="assets/diamond.svg" alt="Diamante pixelado"><small>Imagem local — nenhuma mineração adicional necessária.</small><div class="shutdown-actions"><button class="classic-btn" data-next>Continuar</button></div></div></section>`,
    ()=>`<section class="shutdown-dialog"><div class="shutdown-title">ProdutivOS</div><div class="shutdown-body"><p>Agora você pode fechar esta aba com segurança.</p><p><b>O Urubu continuará decepcionado.</b></p><div class="shutdown-actions"><button class="classic-btn" data-cancel>Voltar</button></div></div></section>`
  ];
  const render=()=>{overlay.innerHTML=screens[step]();overlay.querySelector('[data-cancel]')?.addEventListener("click",()=>overlay.hidden=true);overlay.querySelector('[data-next]')?.addEventListener("click",()=>{if(step===1&&!$("#savedCheck").checked){toast("Confirmação necessária","A caixa existe por um motivo.");return}step++;render()})};render();
}

function showContextMenu(x,y){
  const menu=$("#contextMenu");menu.innerHTML='<button id="ctxArrange">Organizar ícones</button><button id="ctxRefresh">Atualizar</button><hr><button id="ctxFocus">Modo foco do Urubu</button><button id="ctxDisplay">Propriedades...</button>';menu.hidden=false;menu.style.left=`${Math.min(x,innerWidth-200)}px`;menu.style.top=`${Math.min(y,innerHeight-180)}px`;
  $("#ctxArrange").onclick=()=>{renderDesktop();menu.hidden=true};$("#ctxRefresh").onclick=()=>{renderDesktop();menu.hidden=true};$("#ctxFocus").onclick=()=>{catchCursor();menu.hidden=true};$("#ctxDisplay").onclick=()=>{openApp("customize");menu.hidden=true};
}

function trackProcrastinationProximity(x,y){
  if(runtime.iconDragActive)return;
  let best=null,bestDistance=Infinity;
  $$('.desktop-icon:not(.stolen)').forEach(icon=>{const app=APPS.find(a=>a.id===icon.dataset.app);if(app?.kind!=="procrastination")return;const r=icon.getBoundingClientRect(),dx=Math.max(r.left-x,0,x-r.right),dy=Math.max(r.top-y,0,y-r.bottom),d=Math.hypot(dx,dy);if(d<bestDistance){bestDistance=d;best=app.id}});
  const target=bestDistance<=62?best:null;if(target===runtime.hoverTarget)return;clearTimeout(runtime.theftTimer);runtime.hoverTarget=target;if(target)runtime.theftTimer=setTimeout(()=>{if(runtime.hoverTarget===target)stealIcon(target)},850);
}

function moveVirtualCursor(e){
  const v=runtime.virtualCursor,ghost=$("#cursorGhost");runtime.physicalPointer={x:e.clientX,y:e.clientY};if(!v.active){runtime.pointer={...runtime.physicalPointer};ghost.style.left=`${e.clientX}px`;ghost.style.top=`${e.clientY}px`;trackProcrastinationProximity(e.clientX,e.clientY);return}
  if(v.lastX===null){v.lastX=e.clientX;v.lastY=e.clientY;return}v.x=clamp(v.x+e.clientX-v.lastX,1,innerWidth-4);v.y=clamp(v.y+e.clientY-v.lastY,1,innerHeight-42);v.lastX=e.clientX;v.lastY=e.clientY;ghost.style.left=`${v.x}px`;ghost.style.top=`${v.y}px`;trackProcrastinationProximity(v.x,v.y);
}

function routeVirtualClick(e){
  const v=runtime.virtualCursor;if(!v.active||v.synthetic||e.target.closest(".debug-app"))return;e.preventDefault();e.stopImmediatePropagation();const target=document.elementFromPoint(v.x,v.y);if(!target||target===$("#cursorGhost"))return;v.synthetic=true;target.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true,clientX:v.x,clientY:v.y,view:window}));setTimeout(()=>v.synthetic=false,0);
}

function noteActivity(){runtime.lastActivity=Date.now();runtime.inactivityStage=0}
function checkInactivity(){
  if(urubuPaused()||document.hidden)return;const idle=Date.now()-runtime.lastActivity;
  if(idle>=INACTIVITY.alarmMs&&(runtime.inactivityStage<2||Date.now()-(runtime.lastInactiveAlarm||0)>=INACTIVITY.repeatMs)){runtime.inactivityStage=2;runtime.lastInactiveAlarm=Date.now();buddyScream("INATIVIDADE DETECTADA. MEXA-SE OU ESTUDE.");toast("Fiscal de inatividade",`${Math.floor(idle/1000)} segundos sem atividade.`)}
  else if(idle>=INACTIVITY.warningMs&&runtime.inactivityStage===0){runtime.inactivityStage=1;buddySay("Quarenta e cinco segundos parado. Isso é contemplação ou abandono?",7000)}
}

function registerWebMCP(){
  const context=document.modelContext;if(!context?.registerTool)return;const life=new AbortController();const register=t=>Promise.resolve(context.registerTool(t,{signal:life.signal})).catch(()=>{});
  register({name:"read_productivity_state",title:"Read productivity state",description:"Read credits, chaos, open apps and task totals.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>({points:state.points,chaos:state.chaos,openApps:[...runtime.windows.keys()],tasks:{total:state.tasks.length,done:state.tasks.filter(t=>t.done).length,rewardsToday:state.daily.taskRewards}})});
  register({name:"open_produtivos_app",title:"Open ProdutivOS app",description:"Open an app using its stable desktop id.",inputSchema:{type:"object",properties:{appId:{type:"string",enum:APPS.map(a=>a.id)}},required:["appId"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(!APPS.some(a=>a.id===input?.appId))throw new Error("Invalid appId");openApp(input.appId);return{opened:input.appId}}});
  register({name:"add_productivity_task",title:"Add productivity task",description:"Add a task to the checklist. Duplicate completions never earn credits twice.",inputSchema:{type:"object",properties:{text:{type:"string",minLength:1,maxLength:80}},required:["text"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:input=>{const text=String(input?.text||"").trim();if(!text||text.length>80)throw new Error("Text must contain 1 to 80 characters");const task={id:`t-${Date.now()}`,text,done:false,rewarded:false,createdAt:Date.now()};state.tasks.push(task);persist();if(runtime.windows.has("tasks"))refreshWindow("tasks");return{id:task.id,text}}});
}

function init(){
  renderDesktop();renderStartMenu();updateHUD();applyCustomization();setBuddyPose("idle");
  const ghost=$("#cursorGhost");ghost.style.left=`${runtime.pointer.x}px`;ghost.style.top=`${runtime.pointer.y}px`;
  $("#startBtn").onclick=e=>{e.stopPropagation();toggleStart()};
  $("#soundBtn").onclick=toggleSound;$("#creditsBtn").onclick=()=>openApp("shop");$("#chaosBtn").onclick=()=>catchCursor();
  $("#urubuImage").onclick=()=>openApp("customize");$("#urubuBubble").onclick=()=>buddySay(pick(COPY.idle));
  $("#desktop").addEventListener("click",e=>{noteActivity();if(!e.target.closest(".desktop-icon")&&!e.target.closest(".start-menu")&&!e.target.closest(".start-button")){selectIcon(null);toggleStart(false);$("#contextMenu").hidden=true}});
  $("#desktop").addEventListener("contextmenu",e=>{if(e.target.closest(".os-window")||e.target.closest(".taskbar"))return;e.preventDefault();showContextMenu(e.clientX,e.clientY)});
  document.addEventListener("pointermove",e=>{moveVirtualCursor(e);noteActivity()});
  document.addEventListener("pointerdown",e=>{if(e.button===2)playSfx("context",500);else if(e.target.closest("button,.desktop-icon,input,select"))playSfx("click",450)},true);
  document.addEventListener("click",routeVirtualClick,true);
  document.addEventListener("keydown",e=>{noteActivity();if(e.key==="Escape")releaseCursor();if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==="d"){e.preventDefault();openApp("debug")}});
  setInterval(()=>$("#clock").textContent=new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),1000);
  setInterval(()=>{const productive=[...runtime.windows.values()].some(({app,win})=>app.kind==="productive"&&!win.classList.contains("minimized"));if(productive&&!document.hidden)awardFocusBonus(ECONOMY.focusTickReward,"Tempo em aplicativo produtivo.")},ECONOMY.focusTickSeconds*1000);
  setInterval(roamBuddy,14000);
  setInterval(checkInactivity,3000);
  setInterval(()=>{if(!urubuPaused()&&!runtime.buddyBusy&&!document.hidden&&Math.random()<.7)buddySay(pick(COPY.spontaneous),5200)},19000);
  registerWebMCP();
}

init();
