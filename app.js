/*
 * PRODUTIVOS 93 — HACKATHON CONTROL PANEL
 * ------------------------------------------------------------
 * Edit APPS to add/remove icons. Edit COPY for Urubu dialogue.
 * Edit ECONOMY for rewards, limits and escalation. App markup lives
 * in VIEWS, one function per app, so visual mocks are easy to replace.
 */

const ECONOMY = {
  startingPoints: 120,
  taskRewards: {low:20, normal:45, high:75},
  focusTickSeconds: 25,
  focusTickReward: 2,
  procrastinationPenalty: 12,
  gambleLossChance: .90,
  audioYoutubeId: "YmHZI03a_Yo"
};

const COPY = {
  idle: ["Você parou.", "O prazo continua andando.", "Estou só conferindo.", "Não confunda silêncio com ausência."],
  useful: ["Certo. Continue.", "Isso conta como trabalho.", "Sem aplausos. Só continue."],
  useless: ["Eu não abriria isso.", "Você sabe o que está fazendo.", "Interessante escolha perto do prazo."],
  theft: ["Vou guardar isso por um instante.", "Este atalho parecia perigoso.", "Inventário preventivo."],
  caught: ["O cursor vem comigo.", "Você perdeu os privilégios do mouse.", "Vou reposicionar sua atenção."],
  alarm: ["VOLTE PARA A CADEIRA.", "PRESENÇA NÃO DETECTADA.", "O SEMESTRE NÃO PAUSA."]
};

const APPS = [
  {id:"computer", label:"Meu Computador", kind:"system", icon:"computer"},
  {id:"tasks", label:"Tarefas", kind:"productive", icon:"tasks"},
  {id:"moodle", label:"Moodle", kind:"productive", icon:"moodle"},
  {id:"runcodes", label:"Run.codes", kind:"productive", icon:"code"},
  {id:"jupiter", label:"JúpiterWeb", kind:"productive", icon:"jupiter"},
  {id:"ecard", label:"E-card USP", kind:"productive", icon:"card"},
  {id:"folki", label:"Folki", kind:"productive", icon:"folki"},
  {id:"whatsapp", label:"WhatsApp", kind:"neutral", icon:"whatsapp"},
  {id:"instagram", label:"Instagram", kind:"procrastination", icon:"instagram"},
  {id:"clash", label:"Clash Royale", kind:"procrastination", icon:"clash"},
  {id:"procrastibet", label:"Procrastibet", kind:"procrastination", icon:"bet"},
  {id:"shop", label:"Loja do Urubu", kind:"system", icon:"shop"},
  {id:"customize", label:"Personalizar Urubu", kind:"system", icon:"urubu"},
  {id:"camera", label:"Fiscal de Presença", kind:"system", icon:"camera"},
  {id:"debug", label:"Ferramentas de teste", kind:"system", icon:"computer", desktop:false},
  {id:"trash", label:"Lixeira", kind:"system", icon:"trash"}
];

const DEFAULT_TASKS = [
  {id:"calc-3", text:"Entregar lista de Cálculo III", category:"Faculdade", priority:"high", due:"2026-09-21", done:false, createdAt:0},
  {id:"mac-ep", text:"Finalizar EP de MAC0321", category:"Código", priority:"high", due:"2026-09-20", done:false, createdAt:0},
  {id:"group", text:"Revisar slides do trabalho em grupo", category:"Grupo", priority:"normal", due:"2026-09-23", done:false, createdAt:0}
];

const SHOP_ITEMS = [
  {id:"grad", name:"Chapéu de formatura", price:90, icon:"🎓"},
  {id:"crown", name:"Coroa de monitor", price:180, icon:"👑"},
  {id:"cap", name:"Boné suspeito", price:130, icon:"🧢"},
  {id:"glasses", name:"Óculos de autoridade", price:160, icon:"😎"},
  {id:"pinkTie", name:"Gravata magenta", price:70, icon:"👔"},
  {id:"ascii", name:"Star Wars ASCII", price:500, icon:"★"}
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
  customization: {accessory:"", tie:"green", glasses:false},
  stolenApps: [],
  iconPositions: {},
  taskFilter: "all",
  debugUnlimited: false,
  soundOn: false
};
const state = {...defaults,...(stored||{})};
state.daily={...defaults.daily,...(stored?.daily||{})};
state.customization={...defaults.customization,...(stored?.customization||{})};
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
  presence: {badFrames:0,alarm:false,lastAlarm:0,lastPixels:null,stillFrames:0}
};

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const esc = v => String(v).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const pick = list => list[Math.floor(Math.random()*list.length)];
const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
const persist = () => localStorage.setItem("produtivos93.state.v2", JSON.stringify(state));
const taskKey = text => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();

function iconSvg(type){
  const frame = body => `<svg viewBox="0 0 42 42" aria-hidden="true"><path fill="#111" d="M4 4h34v31H4z"/><path fill="#ddd" d="M6 6h30v25H6z"/>${body}</svg>`;
  const map = {
    computer: frame('<path fill="#061b45" d="M9 9h24v17H9z"/><path fill="#fff" d="M13 12h14v2H13z"/><path fill="#777" d="M15 33h12v4H15z"/>'),
    tasks: frame('<path fill="#fff" d="M10 8h22v21H10z"/><path stroke="#111" stroke-width="2" d="m13 14 3 3 5-6m-8 12 3 3 5-6m2-5h6m-6 9h6"/>'),
    moodle: frame('<path fill="#f58220" d="M8 15h26v14H8z"/><path fill="#111" d="m7 13 14-7 14 7-14 7z"/><text x="16" y="28" font-size="13" font-weight="bold">M</text>'),
    code: frame('<path fill="#0d1b32" d="M7 8h28v21H7z"/><path stroke="#58d2e8" stroke-width="2" fill="none" d="m17 13-6 6 6 6m8-12 6 6-6 6"/>'),
    jupiter: frame('<circle fill="#d8b733" cx="21" cy="19" r="12"/><path stroke="#176f6d" stroke-width="3" fill="none" d="M8 20h26M21 7v24"/>'),
    card: frame('<path fill="#0f6c9b" d="M7 10h28v20H7z"/><circle fill="#ddd" cx="14" cy="19" r="5"/><path fill="#fff" d="M22 15h10v2H22zm0 5h8v2h-8z"/>'),
    folki: frame('<path fill="#222" d="M8 8h26v24H8z"/><text x="13" y="27" fill="#b6ff00" font-size="20" font-weight="bold">F</text>'),
    whatsapp: frame('<circle fill="#18a66b" cx="21" cy="20" r="14"/><path fill="#fff" d="M13 12c-5 7 3 17 11 16l6 3-2-6c5-9-7-18-15-13z"/><path fill="#18a66b" d="M16 14c2 7 6 9 12 10l2-4-5-2-2 2c-2-1-4-3-5-5l2-2z"/>'),
    instagram: frame('<rect x="9" y="8" width="24" height="24" rx="6" fill="#d52b89"/><circle cx="21" cy="20" r="6" fill="none" stroke="#fff" stroke-width="3"/><circle cx="29" cy="13" r="2" fill="#fff"/>'),
    youtube: frame('<path fill="#d60000" d="M7 11h28v20H7z"/><path fill="#fff" d="m18 15 10 6-10 6z"/>'),
    tiktok: frame('<path fill="#111" d="M8 7h27v27H8z"/><path stroke="#fff" stroke-width="4" fill="none" d="M24 10v15c0 8-12 8-12 1 0-5 5-7 9-4m3-12c2 5 5 6 8 6"/>'),
    x: frame('<path fill="#000" d="M7 7h28v27H7z"/><path stroke="#fff" stroke-width="3" d="M13 12l16 17m0-17L13 29"/>'),
    clash: frame('<path fill="#3464a3" d="M8 8h26v25H8z"/><path fill="#ffd64a" d="m21 9 10 6-3 14H14l-3-14z"/><path fill="#111" d="M17 18h8v11h-8z"/>'),
    bet: frame('<path fill="#143424" d="M7 7h28v27H7z"/><text x="11" y="29" fill="#ffd43b" font-size="24" font-weight="bold">7</text>'),
    shop: frame('<path fill="#ededed" d="M8 13h26v19H8z"/><path fill="#e81779" d="M6 8h30v8H6z"/><path stroke="#111" stroke-width="2" d="M16 8V6h10v2M14 21h14"/>'),
    urubu: frame('<circle fill="#111" cx="21" cy="20" r="13"/><path fill="#ddd" d="M10 17h17l8 5-9 4H10z"/><circle cx="18" cy="15" r="3" fill="#fff"/>'),
    camera: frame('<path fill="#222" d="M6 12h30v20H6z"/><circle fill="#888" cx="21" cy="22" r="8"/><circle fill="#b6ff00" cx="21" cy="22" r="3"/>'),
    trash: frame('<path fill="#ddd" stroke="#111" stroke-width="2" d="M12 12h18l-2 23H14z"/><path stroke="#111" stroke-width="2" d="M10 10h22M17 7h8M18 16v14m6-14v14"/>')
  };
  return map[type] || frame("");
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
}

const canAfford = amount => state.debugUnlimited || state.points >= amount;
function spendPoints(amount,reason){if(!canAfford(amount))return false;addPoints(-amount,reason);return true}

function toast(title,message){
  const node=document.createElement("div");
  node.className="toast";
  node.innerHTML=`<strong>${esc(title)}</strong><small>${esc(message)}</small>`;
  $("#toastLayer").append(node);
  setTimeout(()=>node.remove(),4200);
}

function renderDesktop(){
  $("#desktopIcons").innerHTML=APPS.filter(app=>app.desktop!==false).map(app=>{
    const pos=state.iconPositions[app.id];
    return `<button class="desktop-icon ${pos?"repositioned":""} ${state.stolenApps.includes(app.id)?"stolen":""}" data-app="${app.id}" ${pos?`style="left:${pos.x}px;top:${pos.y}px"`:""} aria-label="${esc(app.label)}">
      <span class="icon-art">${iconSvg(app.icon)}</span><span class="icon-label">${esc(app.label)}</span>
    </button>`}).join("");
  $$(".desktop-icon").forEach(icon=>{
    icon.addEventListener("click",e=>{e.stopPropagation();selectIcon(icon)});
    icon.addEventListener("dblclick",()=>openApp(icon.dataset.app));
    icon.addEventListener("keydown",e=>{if(e.key==="Enter")openApp(icon.dataset.app)});
  });
}

function selectIcon(icon){
  $$(".desktop-icon.selected").forEach(x=>x.classList.remove("selected"));
  icon?.classList.add("selected");
  runtime.selectedIcon=icon?.dataset.app||null;
}

function renderStartMenu(){
  const useful=APPS.filter(a=>a.kind==="productive");
  $("#startMenu").innerHTML=`<div class="start-rail">ProdutivOS&nbsp;93</div><div class="start-items">
    ${useful.map(a=>`<button class="start-item" data-start="${a.id}"><span class="mini-icon">${iconSvg(a.icon)}</span>${esc(a.label)}</button>`).join("")}
    <div class="start-separator"></div>
    <button class="start-item" data-start="shop"><span class="mini-icon">${iconSvg("shop")}</span>Loja do Urubu</button>
    <button class="start-item" data-start="customize"><span class="mini-icon">${iconSvg("urubu")}</span>Personalizar...</button>
    <button class="start-item" data-start="debug"><span class="mini-icon">⚙</span>Ferramentas de teste</button>
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
  if(app.kind==="productive") buddySay(pick(COPY.useful));
  if(app.kind==="procrastination"){
    state.infractions++;
    state.chaos=Math.min(5,1+Math.floor(state.infractions/2));
    addPoints(-ECONOMY.procrastinationPenalty,`Tempo aberto em ${app.label}.`);
    buddySay(pick(COPY.useless));
    setTimeout(()=>catchCursor(),750);
  }
  createWindow(app,VIEWS[id]());
  if(app.kind==="procrastination") setTimeout(()=>buddyBlockWindow(id),2400);
}

function createWindow(app,html){
  const id=app.id;
  const count=runtime.windows.size;
  const win=document.createElement("article");
  win.className="os-window active";
  win.dataset.window=id;
  win.style.left=`${clamp(110+count*28,10,innerWidth-380)}px`;
  win.style.top=`${clamp(55+count*24,5,innerHeight-270)}px`;
  win.style.zIndex=++runtime.z;
  win.innerHTML=`<header class="window-titlebar"><span class="title-icon">${iconSvg(app.icon)}</span><strong>${esc(app.label)}</strong><span class="window-controls"><button data-min aria-label="Minimizar">_</button><button data-max aria-label="Maximizar">□</button><button data-close aria-label="Fechar">×</button></span></header><nav class="window-menubar"><button>Arquivo</button><button>Editar</button><button>Exibir</button><button>Ajuda</button></nav><div class="window-content">${html}</div><i class="resize-grip"></i>`;
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
  if(id==="camera")stopCamera();
}

function renderTaskButtons(){
  $("#taskButtons").innerHTML=[...runtime.windows.entries()].map(([id,{app,win}])=>`<button class="task-button ${win.classList.contains("active")&&!win.classList.contains("minimized")?"active":""}" data-taskwin="${id}">${esc(app.label)}</button>`).join("");
  $$('[data-taskwin]').forEach(btn=>btn.onclick=()=>{
    const item=runtime.windows.get(btn.dataset.taskwin);
    if(item.win.classList.contains("active")&&!item.win.classList.contains("minimized")){item.win.classList.add("minimized");renderTaskButtons()}else focusWindow(btn.dataset.taskwin)
  });
}

const VIEWS = {
  computer:()=>`<div class="tasks-app"><div class="classic-toolbar"><button class="classic-btn">Voltar</button><button class="classic-btn">Acima</button><input class="classic-input" value="C:\\ProdutivOS\\Aluno" aria-label="Endereço"></div><div class="tasks-list">${APPS.slice(1,8).map(a=>`<div class="task-row"><span class="icon-art">${iconSvg(a.icon)}</span><b>${esc(a.label)}</b><span class="task-state">Aplicativo</span><span></span></div>`).join("")}</div><div class="statusline">7 objeto(s) · 3 prazos atrasados</div></div>`,
  tasks:tasksView,
  moodle:moodleView,
  runcodes:runcodesView,
  jupiter:jupiterView,
  ecard:()=>`<div class="ecard-app"><article class="ecard"><div class="ecard-photo">👤</div><div><h2>e-Card USP</h2><p><b>ALUNO</b><br>PRODUTIVO DA SILVA</p><p>Nº USP: 0000000-3</p><p>Validade: até terminar o TCC</p></div></article></div>`,
  folki:folkiView,
  whatsapp:whatsappView,
  instagram:instagramView,
  clash:clashView,
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

function whatsappView(){
  return `<div class="wa-app"><aside class="wa-sidebar"><div class="wa-profile"><span class="avatar">🙂</span><b>Conversas</b></div><input class="wa-search" placeholder="Pesquisar ou iniciar nova conversa"><button class="wa-contact active"><span class="avatar">👩🏻</span><span><b>Bia ❤️</b><small>oi, você vai estar livre hoje?</small></span><time>10:42</time></button><button class="wa-contact"><span class="avatar">👥</span><span><b>Grupo do trabalho</b><small>Pedro: alguém fez a conclusão?</small></span><time>09:11</time></button><button class="wa-contact"><span class="avatar">👨‍🏫</span><span><b>Monitor Cálculo</b><small>Não haverá prorrogação.</small></span><time>ontem</time></button></aside><section class="wa-main"><header class="wa-chat-header"><span class="avatar">👩🏻</span><span><b>Bia ❤️</b><small style="display:block">online</small></span></header><div class="wa-thread" id="waThread"><div class="wa-bubble them">oii<time>10:41</time></div><div class="wa-bubble them">minha aula acabou mais cedo<time>10:41</time></div><div class="wa-bubble them">você vai estar livre hoje? queria te ver<time>10:42</time></div></div><form class="wa-compose" id="waForm"><span>☺</span><span>📎</span><input id="waInput" placeholder="Digite uma mensagem" autocomplete="off"><button aria-label="Enviar">➤</button></form></section></div>`;
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

function instagramView(){
  const posts=[
    ["@atlética_politécnica","TREINO CANCELADO = STORY OBRIGATÓRIO","12.493","grade perfeita que não existe"],
    ["@calouro.em.crise","POV: você abriu o PDF e ele tinha 83 páginas","8.021","salvei para nunca mais ver"],
    ["@studygram_usp","minha rotina realista de 04:17 até 04:29","31.004","link do planner na bio"],
    ["@bandejao_reviews","mistura não identificada: nota 9","5.771","proteína é uma construção social"]
  ];
  return `<div class="instagram-app"><header class="ig-top"><b>Instagram</b><nav><button data-ig-tab="home" class="active">⌂</button><button data-ig-tab="explore">⌕</button><button data-ig-tab="reels">▣</button><button data-ig-action="dm">✉</button></nav></header><div class="ig-shell"><aside class="ig-side"><b>Para você</b><button data-ig-tab="home">⌂ Página inicial</button><button data-ig-tab="explore">⌕ Explorar</button><button data-ig-tab="reels">▣ Reels</button><button data-ig-action="profile">◎ Perfil</button><small id="igTime">tempo desperdiçado: 0s</small></aside><main class="ig-feed" id="igFeed"><section class="ig-stories">${["bia","rep_12","monitor","crush?","prazo"].map((x,i)=>`<button data-story="${i}"><span>${i===4?"⏰":"🙂"}</span><small>${x}</small></button>`).join("")}</section><div id="igPosts">${posts.map((p,i)=>igPost(p,i)).join("")}</div><button class="ig-more" id="igMore">Carregar mais publicações</button></main><aside class="ig-suggestions"><b>produtivo_da_silva</b><small>Produtivo da Silva</small><h4>Sugestões para você</h4>${["calouro2026","festa_quinta","resumos_gratis"].map(x=>`<p><b>${x}</b><button data-follow>Seguir</button></p>`).join("")}</aside></div></div>`;
}

function igPost(p,i){return `<article class="ig-post" data-post="${i}"><header><span class="ig-avatar">${i%2?"😵":"📚"}</span><b>${p[0]}</b><button>•••</button></header><button class="ig-media media-${i}" data-like="${i}"><span>${p[1]}</span><small>toque duas vezes para curtir</small></button><div class="ig-actions"><button data-like="${i}">♡</button><button data-comment="${i}">○</button><button data-share="${i}">⌁</button><button class="save" data-save="${i}">▱</button></div><p><b>${p[2]} curtidas</b><br><b>${p[0]}</b> ${p[3]}</p><div class="ig-comments" id="igComments${i}"></div><form data-comment-form="${i}"><input placeholder="Adicione um comentário..."><button>Publicar</button></form></article>`}

function clashView(){
  return `<div class="clash-app"><div class="phone-game"><div class="arena-tower top">🏰</div><div class="arena-tower bottom">🏯</div><button class="arena-card" id="clashPlay">JOGAR CARTA · 4 ELIXIR</button></div></div>`;
}

function betView(){
  return `<div class="bet-app"><header class="bet-header">PROCRASTIBET <small style="float:right">AO VIVO ●</small></header><div class="odds-row"><b>EP entregue antes de 23:59</b><button class="odd" data-odd="1.08">SIM 1.08</button><button class="odd" data-odd="7.50">NÃO 7.50</button><button class="odd" data-odd="99">ADIADO</button></div><div class="odds-row"><b>Professor responde o e-mail</b><button class="odd" data-odd="4.20">HOJE</button><button class="odd" data-odd="1.40">NUNCA</button><button class="odd" data-odd="12">2027</button></div><section class="bet-slip"><b>Bilhete de aposta</b><p id="selectedOdd">Selecione uma odd</p><label>Aposta <input id="betAmount" class="classic-input" type="number" min="10" step="10" value="50"></label> <button id="placeBet" class="classic-btn">Confirmar aposta</button><p id="betResult"></p></section></div>`;
}

function shopView(){
  return `<div class="shop-app"><h2>Loja do Urubu</h2><p>Saldo: <b>${state.points} créditos</b></p><div class="shop-grid">${SHOP_ITEMS.map(i=>`<article class="shop-card ${state.inventory.includes(i.id)?"locked":""}"><div style="font-size:30px">${i.icon}</div><b>${esc(i.name)}</b><p><span class="price">${i.price} ₱</span></p><button class="classic-btn" data-buy="${i.id}" ${state.inventory.includes(i.id)?"disabled":""}>${state.inventory.includes(i.id)?"Comprado":"Comprar"}</button></article>`).join("")}</div></div>`;
}

function customizeView(){
  const owned=SHOP_ITEMS.filter(i=>state.inventory.includes(i.id)&&i.id!=="ascii"&&i.id!=="pinkTie");
  return `<div class="customize-app"><h2>Personalizar Urubu</h2><div class="customizer-preview"><img src="assets/urubu.png" alt="Prévia do Urubu" style="${state.customization.tie==="pink"?"filter:hue-rotate(285deg) saturate(1.8)":""}"></div><div class="customizer-options"><button class="classic-btn" data-equip="">Sem acessório</button>${owned.map(i=>`<button class="classic-btn" data-equip="${i.id}">${i.icon} ${esc(i.name)}</button>`).join("")}${state.inventory.includes("pinkTie")?'<button class="classic-btn" id="tieToggle">Alternar gravata</button>':""}</div><p>Itens adicionais ficam disponíveis na Loja do Urubu.</p></div>`;
}

function cameraView(){
  return `<div class="presence-app"><h2>Fiscal de Presença</h2><p>A câmera é opcional e processada somente neste navegador. O fiscal reage a ausência, rosto muito baixo, muito lateral ou distante.</p><div class="presence-controls"><button class="classic-btn" id="cameraToggle">${runtime.cameraStream?"Desativar câmera":"Ativar câmera"}</button><b id="cameraState">${runtime.cameraStream?"ATIVA · ANALISANDO":"DESLIGADA"}</b></div><div class="presence-stage"><video id="cameraVideo" class="camera-preview" autoplay muted playsinline></video><div class="presence-frame"></div><strong id="presenceVerdict">AGUARDANDO CÂMERA</strong></div><canvas id="presenceCanvas" width="64" height="48" hidden></canvas><div class="presence-meter"><span id="presenceMeter"></span></div><small id="presenceDetails">O alarme continuará enquanto a condição irregular persistir.</small></div>`;
}

function debugView(){
  return `<div class="debug-app"><h2>Console de testes</h2><div class="debug-balance"><span>Créditos</span><b>${state.debugUnlimited?"∞":state.points}</b><label><input id="debugUnlimited" type="checkbox" ${state.debugUnlimited?"checked":""}> dinheiro infinito</label></div><div class="debug-grid"><button class="classic-btn" data-debug="100">+100 ₱</button><button class="classic-btn" data-debug="1000">+1.000 ₱</button><button class="classic-btn" data-debug="cursor">Testar roubo do cursor</button><button class="classic-btn" data-debug="icon">Roubar Instagram</button><button class="classic-btn" data-debug="block">Bloquear Instagram</button><button class="classic-btn" data-debug="scream">Testar alarme</button></div><p>Atalho global: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd>. No modo infinito, compras, mensagens e apostas não diminuem o saldo.</p></div>`;
}

function runDialog(){
  return `<div class="folki-app"><p>Digite o nome de um aplicativo, pasta, documento ou recurso.</p><div style="display:flex;gap:8px"><input id="runInput" class="classic-input" style="flex:1" placeholder="Há poucos lugares para onde fugir"><button id="runOpen" class="classic-btn">OK</button><button class="classic-btn" data-close-run>Cancelar</button></div></div>`;
}

function wireApp(id,win){
  if(id==="tasks")wireTasks(win);
  if(id==="whatsapp")$("#waForm",win).onsubmit=e=>{e.preventDefault();replyWhatsapp(win)};
  if(id==="runcodes")$("#runCode",win).onclick=()=>{$("#runResult",win).textContent="Aceito · 3/3 casos · 0.083s";awardFocusBonus(12,"Submissão aceita em Run.codes.")};
  if(id==="folki")$$('[data-folki]',win).forEach(b=>b.onclick=()=>{$("#folkiResult",win).textContent={calendar:"Janela encontrada: quinta, 18:00–18:12.",group:"Você: introdução e conclusão. Pedro: visualizado.",summary:"Restam 64 páginas. O resumo é: comece.",room:"Sala B-16. Não confundir com o bloco B."}[b.dataset.folki]});
  if(id==="instagram")wireInstagram(win);
  if(id==="clash")$("#clashPlay",win).onclick=()=>{buddySay("Carta confiscada.");$("#clashPlay",win).textContent="CONTROLES BLOQUEADOS PELO URUBU";buddyBlockWindow(id)};
  if(id==="procrastibet")wireBet(win);
  if(id==="shop")$$('[data-buy]',win).forEach(b=>b.onclick=()=>buyItem(b.dataset.buy));
  if(id==="customize")wireCustomizer(win);
  if(id==="camera")$("#cameraToggle",win).onclick=()=>toggleCamera(win);
  if(id==="debug")wireDebug(win);
  if(id==="run"){$("#runOpen",win).onclick=()=>{const value=$("#runInput",win).value.toLowerCase();const app=APPS.find(a=>a.label.toLowerCase().includes(value)||a.id===value);if(app){closeWindow("run");openApp(app.id)}else toast("ProdutivOS","O sistema não encontrou este aplicativo.")};$("[data-close-run]",win).onclick=()=>closeWindow("run")}
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

function replyWhatsapp(win){
  const input=$("#waInput",win);const text=input.value.trim();if(!text)return;
  if(!canAfford(160)){
    buddyScream("Era falso. Você não tem namorada.");
    toast("Mensagem interceptada","Créditos insuficientes para responder.");
    return;
  }
  spendPoints(160,"Mensagem enviada.");
  $("#waThread",win).insertAdjacentHTML("beforeend",`<div class="wa-bubble me">${esc(text)}<time>agora ✓✓</time></div>`);
  input.value="";
  setTimeout(()=>$("#waThread",win).insertAdjacentHTML("beforeend",'<div class="wa-bubble them">Esta conta não está mais disponível.<time>agora</time></div>'),800);
}

function wireBet(win){
  let odd=null;
  $$('[data-odd]',win).forEach(b=>b.onclick=()=>{odd=Number(b.dataset.odd);$("#selectedOdd",win).textContent=`Odd selecionada: ${odd.toFixed(2)}`});
  $("#placeBet",win).onclick=()=>{
    const amount=Math.max(10,Math.floor(Number($("#betAmount",win).value)||0));
    if(!odd){$("#betResult",win).textContent="Selecione uma odd.";return}
    if(!canAfford(amount)){$("#betResult",win).textContent="Saldo insuficiente.";return}
    if(Math.random()<ECONOMY.gambleLossChance){spendPoints(amount,"Bilhete encerrado sem retorno.");$("#betResult",win).textContent="PERDEU · A casa agradece.";buddySay("Estatística básica.")}
    else{addPoints(Math.floor(amount*odd),"Bilhete premiado.");$("#betResult",win).textContent="GANHOU · evento estatisticamente suspeito."}
  };
}

function buyItem(id){
  const item=SHOP_ITEMS.find(i=>i.id===id);if(!item||state.inventory.includes(id))return;
  if(!canAfford(item.price)){toast("Saldo insuficiente","Volte quando o trabalho estiver feito.");return}
  spendPoints(item.price,`Comprado: ${item.name}`);state.inventory.push(id);persist();
  if(id==="ascii")window.open("https://asciimation.co.nz/","_blank","noopener");
  refreshWindow("shop");
}

function wireInstagram(win){
  const started=Date.now();
  const time=setInterval(()=>{if(!runtime.windows.has("instagram")){clearInterval(time);return}const s=Math.floor((Date.now()-started)/1000);$("#igTime",win).textContent=`tempo desperdiçado: ${s}s`;if(s>0&&s%15===0){addPoints(-8,"Rolagem prolongada no Instagram.");buddySay("O feed não termina. Seu prazo termina.")}},1000);
  $$('[data-like]',win).forEach(b=>b.onclick=()=>{const post=b.closest(".ig-post");post.classList.toggle("liked");b.textContent=post.classList.contains("liked")?"♥":"♡";if(post.classList.contains("liked"))addPoints(-2,"Curtida impulsiva.")});
  $$('[data-save]',win).forEach(b=>b.onclick=()=>{b.classList.toggle("active");toast("Instagram",b.classList.contains("active")?"Salvo para nunca mais abrir.":"Removido dos salvos.")});
  $$('[data-follow]',win).forEach(b=>b.onclick=()=>{b.textContent=b.textContent==="Seguir"?"Seguindo":"Seguir";if(b.textContent==="Seguindo")addPoints(-3,"Nova distração seguida.")});
  $$('[data-story]',win).forEach(b=>b.onclick=()=>{b.classList.add("seen");toast("Stories",`Story ${Number(b.dataset.story)+1}/47. O Urubu está contando.`);if(Number(b.dataset.story)===4)buddyBlockWindow("instagram")});
  $$('[data-comment-form]',win).forEach(f=>f.onsubmit=e=>{e.preventDefault();const input=$("input",f),v=input.value.trim();if(!v)return;$("#igComments"+f.dataset.commentForm,win).insertAdjacentHTML("beforeend",`<p><b>produtivo_da_silva</b> ${esc(v)}</p>`);input.value="";addPoints(-4,"Comentário publicado durante o prazo.")});
  $$('[data-ig-tab]',win).forEach(b=>b.onclick=()=>{$$('[data-ig-tab]',win).forEach(x=>x.classList.toggle("active",x.dataset.igTab===b.dataset.igTab));$("#igPosts",win).className=`ig-${b.dataset.igTab}`;if(b.dataset.igTab==="reels")setTimeout(()=>buddyBlockWindow("instagram"),500)});
  $("#igMore",win).onclick=()=>{$("#igPosts",win).insertAdjacentHTML("beforeend",igPost(["@algoritmo_sem_fim","VOCÊ PEDIU MAIS. ELE ENTREGOU MAIS.","2","não existe última publicação"],Date.now()));addPoints(-5,"Você pediu mais feed.");buddySay("Eu vi esse clique.")};
}

function wireDebug(win){
  $("#debugUnlimited",win).onchange=e=>{state.debugUnlimited=e.target.checked;updateHUD();refreshWindow("debug")};
  $$('[data-debug]',win).forEach(b=>b.onclick=()=>{const v=b.dataset.debug;if(/^\d+$/.test(v)){addPoints(Number(v),"Crédito de teste.");refreshWindow("debug")}else if(v==="cursor")catchCursor(true);else if(v==="icon")stealIcon("instagram",true);else if(v==="block"){if(!runtime.windows.has("instagram"))openApp("instagram");setTimeout(()=>buddyBlockWindow("instagram",true),250)}else buddyScream("TESTE DO ALARME DE PRESENÇA.")});
}

function wireCustomizer(win){
  $$('[data-equip]',win).forEach(b=>b.onclick=()=>{const id=b.dataset.equip;state.customization.accessory=id;state.customization.glasses=id==="glasses";applyCustomization();persist();refreshWindow("customize")});
  $("#tieToggle",win)?.addEventListener("click",()=>{state.customization.tie=state.customization.tie==="pink"?"green":"pink";applyCustomization();persist();refreshWindow("customize")});
}

function applyCustomization(){
  const item=SHOP_ITEMS.find(i=>i.id===state.customization.accessory);
  $("#urubuAccessory").textContent=item&&!state.customization.glasses?item.icon:"";
  $("#urubu").classList.toggle("glasses",state.customization.glasses);
  $("#urubuImage").style.filter=state.customization.tie==="pink"?"hue-rotate(285deg) saturate(1.8)":"";
}

function awardFocusBonus(amount,reason){
  state.daily.focusCredits+=amount;addPoints(amount,reason);
}

function buddySay(text,duration=3400){
  const bubble=$("#urubuBubble");bubble.textContent=text;bubble.classList.add("show");
  clearTimeout(runtime.bubbleTimer);runtime.bubbleTimer=setTimeout(()=>bubble.classList.remove("show"),duration);
}

function setBuddyPose(pose){
  const img=$("#urubuImage"),buddy=$("#urubu");
  buddy.classList.remove("idle","scream","reaching","grabbing","stealing","peck","blocking");
  const files={idle:"urubu.png",reach:"urubu-steal.png",grab:"urubu-grab-v2.png",scream:"urubu-scream.png",steal:"urubu-steal.png",block:"urubu-block.png"};
  img.src=`assets/${files[pose]||files.idle}`;
  buddy.classList.add(pose==="grab"?"grabbing":pose==="reach"?"reaching":pose==="steal"?"stealing":pose==="block"?"blocking":pose);
}

function moveBuddy(x,y){
  const buddy=$("#urubu");buddy.style.right="auto";buddy.style.bottom="auto";buddy.style.left=`${clamp(x,0,innerWidth-buddy.offsetWidth)}px`;buddy.style.top=`${clamp(y,0,innerHeight-buddy.offsetHeight-38)}px`;
}

function catchCursor(force=false){
  if((runtime.buddyBusy&&!force)||runtime.virtualCursor.active)return;runtime.buddyBusy=true;
  const ghost=$("#cursorGhost"),desk=$("#desktop"),start={...runtime.pointer};
  setBuddyPose("reach");buddySay(pick(COPY.caught)+" Esc devolve.",5200);moveBuddy(start.x-190,start.y-105);
  setTimeout(()=>{setBuddyPose("grab");desk.classList.add("cursor-caught");ghost.style.transition="none";ghost.style.left=`${start.x}px`;ghost.style.top=`${start.y}px`},420);
  setTimeout(()=>{
    const x=45+Math.random()*(innerWidth-130),y=55+Math.random()*(innerHeight-150);
    runtime.virtualCursor={active:true,x,y,lastX:null,lastY:null,synthetic:false};
    ghost.style.transition="left .9s cubic-bezier(.12,.78,.18,1), top .9s cubic-bezier(.12,.78,.18,1)";ghost.style.left=`${x}px`;ghost.style.top=`${y}px`;moveBuddy(x-250,y-105);
  },720);
  setTimeout(()=>{setBuddyPose("idle");runtime.buddyBusy=false;ghost.style.transition="none"},1750);
}

function releaseCursor(){
  if(!runtime.virtualCursor.active)return;runtime.virtualCursor.active=false;runtime.virtualCursor.lastX=null;runtime.virtualCursor.lastY=null;$("#desktop").classList.remove("cursor-caught");buddySay("Mouse devolvido. Por enquanto.");
}

function stealIcon(appId,force=false){
  if((runtime.buddyBusy&&!force)||Date.now()<runtime.theftCooldown)return;
  const app=APPS.find(a=>a.id===appId&&a.kind==="procrastination"&&!state.stolenApps.includes(a.id));if(!app)return;
  const icon=$(`[data-app="${app.id}"]`);if(!icon)return;
  runtime.buddyBusy=true;runtime.theftCooldown=Date.now()+10000;setBuddyPose("reach");buddySay(pick(COPY.theft));const r=icon.getBoundingClientRect();moveBuddy(r.left-80,r.top-45);
  setTimeout(()=>setBuddyPose("steal"),380);
  setTimeout(()=>{icon.classList.add("stolen");state.stolenApps.push(app.id);persist();moveBuddy(innerWidth-190,innerHeight-280)},750);
  setTimeout(()=>{const area=$("#desktopIcons").getBoundingClientRect();state.iconPositions[app.id]={x:Math.round(100+Math.random()*Math.max(100,area.width-430)),y:Math.round(20+Math.random()*Math.max(80,area.height-120))};state.stolenApps=state.stolenApps.filter(x=>x!==app.id);persist();renderDesktop();setBuddyPose("idle");runtime.buddyBusy=false;buddySay("Devolvi. Encontre.")},5200);
}

function buddyScream(text){
  if(runtime.buddyBusy)return;runtime.buddyBusy=true;setBuddyPose("scream");buddySay(text||pick(COPY.alarm),4300);moveBuddy(innerWidth/2-120,innerHeight/2-180);setTimeout(()=>{setBuddyPose("idle");runtime.buddyBusy=false},3200);
}

function buddyBlockWindow(id){
  const item=runtime.windows.get(id);if(!item||runtime.buddyBusy)return;
  runtime.buddyBusy=true;const r=item.win.getBoundingClientRect(),buddy=$("#urubu");setBuddyPose("block");buddy.style.setProperty("--block-scale",".65");moveBuddy(r.left+r.width/2-230,r.top+r.height/2-175);buddySay("FECHA. A. JANELA.",4600);
  requestAnimationFrame(()=>requestAnimationFrame(()=>buddy.style.setProperty("--block-scale",String(Math.min(2.05,1.15+state.chaos*.16)))));
  setTimeout(()=>{buddy.style.setProperty("--block-scale",".65");setTimeout(()=>{buddy.style.removeProperty("--block-scale");setBuddyPose("idle");runtime.buddyBusy=false},450)},3800);
}

function roamBuddy(){
  if(runtime.buddyBusy||document.hidden)return;
  const edges=[[innerWidth-220,innerHeight-300],[innerWidth*.62,innerHeight-285],[innerWidth*.28,innerHeight-275]];const [x,y]=pick(edges);moveBuddy(x,y);
  if(Math.random()<.3){$("#urubu").classList.add("peck");setTimeout(()=>$("#urubu").classList.remove("peck"),1000)}
}

async function toggleCamera(win){
  if(runtime.cameraStream){stopCamera();refreshWindow("camera");return}
  try{
    runtime.cameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false});
    const video=$("#cameraVideo",win);video.srcObject=runtime.cameraStream;await video.play();$("#cameraState",win).textContent="ATIVA · PROCESSAMENTO LOCAL";$("#cameraToggle",win).textContent="Desativar câmera";
    runtime.presence={badFrames:0,alarm:false,lastAlarm:0,lastPixels:null,stillFrames:0};runtime.cameraTimer=setInterval(()=>inspectPresence(win,video),1200);
  }catch{toast("Câmera indisponível","Permissão não concedida. O Urubu trabalhará por suspeita.")}
}

async function inspectPresence(win,video){
  if(!runtime.cameraStream||video.readyState<2)return;let bad=false,reason="ROSTO CENTRALIZADO",confidence=100;
  if("FaceDetector" in window){try{const faces=await new FaceDetector({fastMode:true,maxDetectedFaces:1}).detect(video);if(!faces.length){bad=true;reason="ROSTO FORA DO ENQUADRAMENTO";confidence=0}else{const face=faces[0],b=face.boundingBox,w=video.videoWidth,h=video.videoHeight,cx=(b.x+b.width/2)/w,cy=(b.y+b.height/2)/h,area=(b.width*b.height)/(w*h),eyes=(face.landmarks||[]).filter(l=>/eye/i.test(l.type)),nose=(face.landmarks||[]).find(l=>/nose/i.test(l.type));const eyeY=eyes.length?eyes.reduce((n,l)=>n+l.locations[0].y,0)/eyes.length:null,tilt=eyeY&&nose?(nose.locations[0].y-eyeY)/b.height:.22;if(cy>.60||tilt>.34){bad=true;reason="OLHAR MUITO BAIXO";confidence=25}else if(cx<.24||cx>.76){bad=true;reason="ROSTO MUITO LATERAL";confidence=38}else if(area<.035){bad=true;reason="VOCÊ ESTÁ LONGE DEMAIS";confidence=25}}}catch{({bad,reason,confidence}=presenceFallback(win,video))}}
  else({bad,reason,confidence}=presenceFallback(win,video));
  runtime.presence.badFrames=bad?runtime.presence.badFrames+1:0;const verdict=$("#presenceVerdict",win),meter=$("#presenceMeter",win);if(verdict){verdict.textContent=reason;verdict.classList.toggle("bad",bad);meter.style.width=`${confidence}%`}
  if(runtime.presence.badFrames>=2){runtime.presence.alarm=true;if(Date.now()-runtime.presence.lastAlarm>4500){runtime.presence.lastAlarm=Date.now();presenceAlarm(reason)}}else if(!bad&&runtime.presence.alarm){runtime.presence.alarm=false;buddySay("Presença restaurada. Não teste minha paciência.");if(!runtime.buddyBusy)setBuddyPose("idle")}
}

function presenceFallback(win,video){
  const canvas=$("#presenceCanvas",win),ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.drawImage(video,0,0,64,48);const pixels=ctx.getImageData(0,0,64,48).data;let light=0,diff=0,count=0,skin=0,sx=0,sy=0;for(let i=0;i<pixels.length;i+=4){const r=pixels[i],g=pixels[i+1],b=pixels[i+2],p=i/4,x=p%64,y=Math.floor(p/64);light+=(r+g+b)/3;if(runtime.presence.lastPixels)diff+=Math.abs(r-runtime.presence.lastPixels[i]);count++;if(r>55&&g>30&&b>18&&r>g*1.04&&r>b*1.08&&Math.max(r,g,b)-Math.min(r,g,b)>12){skin++;sx+=x;sy+=y}}runtime.presence.stillFrames=light/count<18||runtime.presence.lastPixels&&diff/count<.8?runtime.presence.stillFrames+1:0;runtime.presence.lastPixels=pixels;const coverage=skin/count,cx=skin?sx/skin/64:.5,cy=skin?sy/skin/48:1;if(runtime.presence.stillFrames>=5||coverage<.018)return{bad:true,reason:"ROSTO FORA DO ENQUADRAMENTO",confidence:8};if(cy>.64)return{bad:true,reason:"CABEÇA BAIXA DETECTADA",confidence:28};if(cx<.24||cx>.76)return{bad:true,reason:"VOCÊ SAIU DO CENTRO",confidence:35};return{bad:false,reason:"PRESENÇA PROVÁVEL · MODO LOCAL",confidence:Math.min(88,55+coverage*180)}
}
function presenceAlarm(reason){state.chaos=Math.min(5,state.chaos+1);updateHUD();buddyScream(`${reason}. VOLTE AGORA.`);try{const ac=new AudioContext(),o=ac.createOscillator(),g=ac.createGain();o.type="square";o.frequency.value=780;g.gain.value=.08;o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+.45)}catch{}}
function stopCamera(){clearInterval(runtime.cameraTimer);runtime.cameraTimer=null;runtime.cameraStream?.getTracks().forEach(t=>t.stop());runtime.cameraStream=null;runtime.presence.alarm=false}

function toggleSound(){
  state.soundOn=!state.soundOn;$("#soundBtn").textContent=state.soundOn?"🔊":"🔇";$("#soundBtn").setAttribute("aria-pressed",state.soundOn);
  $("#youtubeAudio").innerHTML=state.soundOn?`<iframe width="1" height="1" allow="autoplay" src="https://www.youtube.com/embed/${ECONOMY.audioYoutubeId}?autoplay=1&loop=1&playlist=${ECONOMY.audioYoutubeId}&controls=0"></iframe>`:"";persist();
}

function shutdownHell(){
  const overlay=$("#shutdownOverlay");overlay.hidden=false;let step=0;
  const screens=[
    ()=>`<section class="shutdown-dialog"><div class="shutdown-title">Desligar o ProdutivOS</div><div class="shutdown-body"><p>Deseja realmente encerrar a sessão?</p><label><input type="radio" checked> Desligar o computador</label><br><label><input type="radio"> Reiniciar o computador</label><div class="shutdown-actions"><button class="classic-btn" data-next>OK</button><button class="classic-btn" data-cancel>Cancelar</button></div></div></section>`,
    ()=>`<section class="shutdown-dialog"><div class="shutdown-title">Verificação de trabalho salvo</div><div class="shutdown-body"><p>Marque para confirmar:</p><label><input id="savedCheck" type="checkbox"> Salvei tudo e não estou fugindo de um prazo.</label><div class="shutdown-actions"><button class="classic-btn" data-next>Avançar</button></div></div></section>`,
    ()=>`<section class="shutdown-dialog"><div class="shutdown-title">Mine o código de encerramento</div><div class="shutdown-body"><p>Encontre o bloco de diamante.</p><div class="miner">${Array.from({length:16},(_,i)=>`<button data-mine="${i}" class="${i===11?"diamond":""}" aria-label="Bloco ${i+1}"></button>`).join("")}</div><p id="mineStatus">Código não encontrado.</p></div></section>`,
    ()=>`<section class="shutdown-dialog"><div class="shutdown-title">ProdutivOS</div><div class="shutdown-body"><p>Agora você pode fechar esta aba com segurança.</p><p><b>O Urubu continuará decepcionado.</b></p><div class="shutdown-actions"><button class="classic-btn" data-cancel>Voltar</button></div></div></section>`
  ];
  const render=()=>{overlay.innerHTML=screens[step]();overlay.querySelector('[data-cancel]')?.addEventListener("click",()=>overlay.hidden=true);overlay.querySelector('[data-next]')?.addEventListener("click",()=>{if(step===1&&!$("#savedCheck").checked){toast("Confirmação necessária","A caixa existe por um motivo.");return}step++;render()});$$('[data-mine]',overlay).forEach(b=>b.onclick=()=>{if(b.classList.contains("diamond")){b.classList.add("dug");$("#mineStatus").textContent="Diamante encontrado.";setTimeout(()=>{step++;render()},500)}else b.classList.add("dug")})};render();
}

function showContextMenu(x,y){
  const menu=$("#contextMenu");menu.innerHTML='<button id="ctxArrange">Organizar ícones</button><button id="ctxRefresh">Atualizar</button><hr><button id="ctxFocus">Modo foco do Urubu</button><button id="ctxDisplay">Propriedades...</button>';menu.hidden=false;menu.style.left=`${Math.min(x,innerWidth-200)}px`;menu.style.top=`${Math.min(y,innerHeight-180)}px`;
  $("#ctxArrange").onclick=()=>{renderDesktop();menu.hidden=true};$("#ctxRefresh").onclick=()=>{renderDesktop();menu.hidden=true};$("#ctxFocus").onclick=()=>{catchCursor();menu.hidden=true};$("#ctxDisplay").onclick=()=>{openApp("customize");menu.hidden=true};
}

function trackProcrastinationProximity(x,y){
  let best=null,bestDistance=Infinity;
  $$('.desktop-icon:not(.stolen)').forEach(icon=>{const app=APPS.find(a=>a.id===icon.dataset.app);if(app?.kind!=="procrastination")return;const r=icon.getBoundingClientRect(),dx=Math.max(r.left-x,0,x-r.right),dy=Math.max(r.top-y,0,y-r.bottom),d=Math.hypot(dx,dy);if(d<bestDistance){bestDistance=d;best=app.id}});
  const target=bestDistance<=62?best:null;if(target===runtime.hoverTarget)return;clearTimeout(runtime.theftTimer);runtime.hoverTarget=target;if(target)runtime.theftTimer=setTimeout(()=>{if(runtime.hoverTarget===target)stealIcon(target)},850);
}

function moveVirtualCursor(e){
  const v=runtime.virtualCursor;if(!v.active){runtime.pointer={x:e.clientX,y:e.clientY};trackProcrastinationProximity(e.clientX,e.clientY);return}
  if(v.lastX===null){v.lastX=e.clientX;v.lastY=e.clientY;return}v.x=clamp(v.x+e.clientX-v.lastX,1,innerWidth-4);v.y=clamp(v.y+e.clientY-v.lastY,1,innerHeight-42);v.lastX=e.clientX;v.lastY=e.clientY;const ghost=$("#cursorGhost");ghost.style.left=`${v.x}px`;ghost.style.top=`${v.y}px`;trackProcrastinationProximity(v.x,v.y);
}

function routeVirtualClick(e){
  const v=runtime.virtualCursor;if(!v.active||v.synthetic)return;e.preventDefault();e.stopImmediatePropagation();const target=document.elementFromPoint(v.x,v.y);if(!target||target===$("#cursorGhost"))return;v.synthetic=true;target.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true,clientX:v.x,clientY:v.y,view:window}));setTimeout(()=>v.synthetic=false,0);
}

function registerWebMCP(){
  const context=document.modelContext;if(!context?.registerTool)return;const life=new AbortController();const register=t=>Promise.resolve(context.registerTool(t,{signal:life.signal})).catch(()=>{});
  register({name:"read_productivity_state",title:"Read productivity state",description:"Read credits, chaos, open apps and task totals.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>({points:state.points,chaos:state.chaos,openApps:[...runtime.windows.keys()],tasks:{total:state.tasks.length,done:state.tasks.filter(t=>t.done).length,rewardsToday:state.daily.taskRewards}})});
  register({name:"open_produtivos_app",title:"Open ProdutivOS app",description:"Open an app using its stable desktop id.",inputSchema:{type:"object",properties:{appId:{type:"string",enum:APPS.map(a=>a.id)}},required:["appId"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(!APPS.some(a=>a.id===input?.appId))throw new Error("Invalid appId");openApp(input.appId);return{opened:input.appId}}});
  register({name:"add_productivity_task",title:"Add productivity task",description:"Add a task to the checklist. Duplicate completions never earn credits twice.",inputSchema:{type:"object",properties:{text:{type:"string",minLength:1,maxLength:80}},required:["text"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:input=>{const text=String(input?.text||"").trim();if(!text||text.length>80)throw new Error("Text must contain 1 to 80 characters");const task={id:`t-${Date.now()}`,text,done:false,rewarded:false,createdAt:Date.now()};state.tasks.push(task);persist();if(runtime.windows.has("tasks"))refreshWindow("tasks");return{id:task.id,text}}});
}

function init(){
  renderDesktop();renderStartMenu();updateHUD();applyCustomization();setBuddyPose("idle");
  $("#startBtn").onclick=e=>{e.stopPropagation();toggleStart()};
  $("#soundBtn").onclick=toggleSound;$("#creditsBtn").onclick=()=>openApp("shop");$("#chaosBtn").onclick=()=>catchCursor();
  $("#urubuImage").onclick=()=>openApp("customize");$("#urubuBubble").onclick=()=>buddySay(pick(COPY.idle));
  $("#desktop").addEventListener("click",e=>{runtime.lastActivity=Date.now();if(!e.target.closest(".desktop-icon")&&!e.target.closest(".start-menu")&&!e.target.closest(".start-button")){selectIcon(null);toggleStart(false);$("#contextMenu").hidden=true}});
  $("#desktop").addEventListener("contextmenu",e=>{if(e.target.closest(".os-window")||e.target.closest(".taskbar"))return;e.preventDefault();showContextMenu(e.clientX,e.clientY)});
  document.addEventListener("pointermove",e=>{moveVirtualCursor(e);runtime.lastActivity=Date.now()});
  document.addEventListener("click",routeVirtualClick,true);
  document.addEventListener("keydown",e=>{runtime.lastActivity=Date.now();if(e.key==="Escape")releaseCursor();if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==="d"){e.preventDefault();openApp("debug")}});
  setInterval(()=>$("#clock").textContent=new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),1000);
  setInterval(()=>{const productive=[...runtime.windows.values()].some(({app,win})=>app.kind==="productive"&&!win.classList.contains("minimized"));if(productive&&!document.hidden)awardFocusBonus(ECONOMY.focusTickReward,"Tempo em aplicativo produtivo.")},ECONOMY.focusTickSeconds*1000);
  setInterval(roamBuddy,14000);
  setInterval(()=>{if(Date.now()-runtime.lastActivity>65000){buddyScream();runtime.lastActivity=Date.now()}},5000);
  registerWebMCP();
}

init();
