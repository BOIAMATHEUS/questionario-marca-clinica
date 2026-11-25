/* Questionário de marca · lógica da página */
const KEY = 'vin-marca-v1';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let st = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })();
st.v ||= {}; st.r ||= {}; st.tab ||= {}; st.arqs ||= []; st.links ||= [{ u: '', c: '' }]; st.enviado ||= [];
let REFS = [];
const blobs = {};

const ICON = {
  amei: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.4 5c2.1 0 3.8 1.2 4.6 2.9h2C13.8 6.2 15.5 5 17.6 5 21 5 23 8.4 21.6 11.7 19.5 16.4 12 21 12 21z"/></svg>',
  talvez: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 13c2.5-3 5-3 8 0s5.5 3 8 0"/></svg>',
  nao: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  com: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
  seta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  volta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></svg>',
};

/* ---------- salvar ---------- */
let tSalvo;
function save() {
  st.alterado = true; st.t = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(st)); } catch {}
  const s = $('#salvo'); s.style.opacity = .4; clearTimeout(tSalvo); tSalvo = setTimeout(() => s.style.opacity = 1, 250);
  clearTimeout(save._p); save._p = setTimeout(marcaPassos, 400);
}
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 2600); }

/* ---------- arquivos (IndexedDB) ---------- */
const idb = (() => {
  let p; const db = () => p || (p = new Promise((res, rej) => { const r = indexedDB.open('vin-arqs', 1); r.onupgradeneeded = () => r.result.createObjectStore('f'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const op = async (mode, fn) => { const d = await db(); return new Promise((res, rej) => { const tx = d.transaction('f', mode); const rq = fn(tx.objectStore('f')); tx.oncomplete = () => res(rq && rq.result); tx.onerror = () => rej(tx.error); }); };
  return { put: (k, v) => op('readwrite', s => s.put(v, k)), get: k => op('readonly', s => s.get(k)), del: k => op('readwrite', s => s.delete(k)) };
})();
async function comprimir(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 900e3) return file;
  try {
    const bmp = await createImageBitmap(file); const k = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(bmp, 0, 0, c.width, c.height);
    const b = await new Promise(r => c.toBlob(r, 'image/jpeg', .85));
    return b && b.size < file.size ? new File([b], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file;
  } catch { return file; }
}
async function addArquivos(files, sec = 'upload') {
  for (const f0 of files) {
    if (st.arqs.length >= 20) { toast('Até 20 arquivos por aqui. O resto pode ir pelo WhatsApp.'); break; }
    if (!/^image\/|application\/pdf/.test(f0.type)) { toast('Envie imagens ou PDF.'); continue; }
    const f = await comprimir(f0);
    if (f.size > 9e6) { toast(`"${f0.name}" é grande demais. Mande pelo WhatsApp.`); continue; }
    const id = 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    try { await idb.put(id, f); } catch {}
    blobs[id] = f;
    st.arqs.push({ id, n: f.name, s: f.size, t: f.type, c: '', sec });
  }
  save(); rerender();
}

/* ---------- utilidades de campo ---------- */
const V = id => st.v[id];
const nomeAtual = () => (V('nome') || '').trim();
function campo(b, inner) {
  return `<div class="campo" id="f-${b.id}">${b.label ? `<label for="i-${b.id}">${esc(b.label)}${b.opc ? ' <span class="opc">Opcional</span>' : ''}</label>` : ''}${b.help ? `<p class="help">${esc(b.help)}</p>` : ''}${inner}${b.ex ? `<div class="ex"><b>Exemplo</b>${esc(b.ex)}</div>` : ''}</div>`;
}
function rate(key, labels = ['Amei', 'Talvez', 'Não']) {
  const v = st.r[key]?.v;
  return `<div class="rate">${['amei', 'talvez', 'nao'].map((x, i) => `<button type="button" data-rate="${esc(key)}" data-v="${x}" class="${v === x ? 'on' : ''}" aria-pressed="${v === x}">${ICON[x]}${labels[i]}</button>`).join('')}</div>`;
}
function coment(key) {
  const c = st.r[key]?.c || '';
  return `<div class="coment ${c ? 'tem' : ''}"><button type="button" data-cm="${esc(key)}">${ICON.com}${c ? 'Seu comentário' : 'Comentar'}</button>${c ? `<textarea data-cmt="${esc(key)}" placeholder="O que chamou atenção, o que mudaria...">${esc(c)}</textarea>` : ''}</div>`;
}
function slVal(b, v) {
  if (v == null) return 'Arraste para marcar';
  if (v <= 20) return `Bem mais ${b.esq.toLowerCase()}`;
  if (v < 42) return `Mais ${b.esq.toLowerCase()}`;
  if (v <= 58) return 'Equilíbrio entre os dois';
  if (v < 80) return `Mais ${b.dir.toLowerCase()}`;
  return `Bem mais ${b.dir.toLowerCase()}`;
}

/* ---------- blocos ---------- */
const R = {
  text: b => campo(b, `<input type="text" id="i-${b.id}" data-f="${b.id}" value="${esc(V(b.id))}" placeholder="Escreva aqui" autocomplete="off">`),
  textarea: b => campo(b, `<textarea id="i-${b.id}" data-f="${b.id}" placeholder="Escreva aqui">${esc(V(b.id))}</textarea>`),
  chips: b => {
    const sel = V(b.id) || [];
    return campo(b, `<div class="chips" data-chips="${b.id}" data-max="${b.max || 0}">${b.options.map(o => `<button type="button" class="chip ${sel.includes(o) ? 'on' : ''}" data-o="${esc(o)}" aria-pressed="${sel.includes(o)}">${esc(o)}</button>`).join('')}</div>${b.max > 1 ? `<p class="lim">Escolha até ${b.max}.</p>` : ''}${b.outro ? `<div class="outro"><input type="text" data-f="${b.id}__outro" value="${esc(V(b.id + '__outro'))}" placeholder="Outro? Escreva aqui"></div>` : ''}`);
  },
  slider: b => {
    const v = V(b.id);
    return campo(b, `<div class="sl ${v == null ? 'vazio' : ''}"><div class="sl-ends"><div><b>${esc(b.esq)}</b><small>${esc(b.esqD)}</small></div><div><b>${esc(b.dir)}</b><small>${esc(b.dirD)}</small></div></div><input type="range" min="0" max="100" step="1" value="${v ?? 50}" data-sl="${b.id}" style="--p:${v ?? 50}%" aria-label="${esc(b.esq)} ou ${esc(b.dir)}"><div class="sl-val">${slVal(b, v)}</div></div>`);
  },
  nome: () => {
    const s = V('nome_status');
    const ops = [['tem', 'Já tenho o nome'], ['opcoes', 'Tenho algumas opções'], ['nao', 'Ainda não tenho']];
    let extra = '';
    if (s === 'tem') extra = `<input type="text" id="i-nome" data-f="nome" value="${esc(V('nome'))}" placeholder="Nome da clínica" style="margin-top:14px">`;
    if (s === 'opcoes') extra = `<p class="help" style="margin-top:14px">Escreva as opções, uma por linha, e diga qual é a favorita.</p><textarea data-f="nome_opcoes" placeholder="Uma opção por linha">${esc(V('nome_opcoes'))}</textarea><input type="text" data-f="nome" value="${esc(V('nome'))}" placeholder="A favorita, por enquanto" style="margin-top:10px">`;
    if (s === 'nao') {
      const d = V('nome_dir') || [];
      extra = `<p class="help" style="margin-top:16px">O nome precisa estar definido antes do logo. Estes caminhos ajudam a pensar: marque os que agradam.</p><div class="tipos">${NOMES_DIRECOES.map(n => `<button type="button" class="tipo ${d.includes(n.id) ? 'on' : ''}" data-ndir="${n.id}"><div><b>${esc(n.nome)}</b><small>${esc(n.d)}</small><small style="margin-top:6px;color:var(--g2);font-style:italic">${esc(n.ex)}</small></div></button>`).join('')}</div><p class="help" style="margin-top:16px">Palavras, ideias ou sons que você gostaria no nome:</p><textarea data-f="nome_palavras" placeholder="Escreva aqui">${esc(V('nome_palavras'))}</textarea>`;
    }
    return `<div class="campo" id="f-nome"><span class="lbl">Qual é o nome da clínica?</span><div class="chips">${ops.map(([k, t]) => `<button type="button" class="chip ${s === k ? 'on' : ''}" data-nst="${k}">${t}</button>`).join('')}</div>${extra}<div class="ex"><b>Exemplo</b>Clareira · Psicologia Clínica</div></div>`;
  },
  tipos: () => {
    const sel = V('tipos') || [];
    const cats = Object.keys(CATS).filter(c => c !== 'ambiente' && c !== 'sistema');
    return `<div class="campo"><span class="lbl">Que tipo de logo você imagina?</span><p class="help">Marque até 3. Logo abaixo tem exemplos reais de cada tipo.</p><div class="tipos">${cats.map(c => { const f = REFS.find(r => r.cat === c); return `<button type="button" class="tipo ${sel.includes(c) ? 'on' : ''}" data-tipo="${c}"><span class="ti" style="${f ? `background-image:url('img/${esc(f.file)}')` : ''}"></span><div><b>${esc(CATS[c].t)}</b><small>${esc(CATS[c].d)}</small></div></button>`; }).join('')}</div></div>`;
  },
  galeria: b => {
    const cats = b.cats.filter(c => REFS.some(r => r.cat === c));
    if (!cats.length) return `<div class="vazia">As referências estão sendo carregadas.</div>`;
    const at = cats.includes(st.tab[b.id]) ? st.tab[b.id] : cats[0];
    const lista = REFS.filter(r => r.cat === at);
    const avaliadas = REFS.filter(r => b.cats.includes(r.cat) && st.r['ref:' + r.id]?.v).length;
    const total = REFS.filter(r => b.cats.includes(r.cat)).length;
    return `<div>${cats.length > 1 ? `<div class="tabs" data-gal="${b.id}">${cats.map(c => { const n = REFS.filter(r => r.cat === c).length; const a = REFS.filter(r => r.cat === c && st.r['ref:' + r.id]?.v).length; return `<button type="button" class="${c === at ? 'at' : ''}" data-tab="${c}">${esc(CATS[c].t)}<small>${a}/${n}</small></button>`; }).join('')}</div><p class="catd">${esc(CATS[at].d)}</p>` : ''}
      <div class="carwrap"><div class="grid car" data-car>${lista.map(card).join('')}</div><div class="carnav"><button type="button" class="seta" data-carmove="-1" aria-label="Anterior">${ICON.volta}</button><span class="carpos" data-carpos>1 de ${lista.length}</span><button type="button" class="seta" data-carmove="1" aria-label="Próxima">${ICON.seta}</button></div></div>
      <p class="resumo-rate">${avaliadas} de ${total} referências avaliadas${cats.length > 1 && cats.indexOf(at) < cats.length - 1 ? ` · <button type="button" data-tabnext="${b.id}" style="color:var(--g);font-weight:700">Próximo tipo: ${esc(CATS[cats[cats.indexOf(at) + 1]].t)} →</button>` : ''}</p></div>`;
  },
  simbolos: () => `<div class="simbs">${SIMBOLOS.map(s => { const v = st.r['simb:' + s.id]?.v; return `<div class="simb ${v || ''}" data-card="simb:${s.id}"><svg viewBox="0 0 48 48" aria-hidden="true">${s.svg}</svg><b>${esc(s.nome)}</b>${rate('simb:' + s.id, ['Sim', 'Talvez', 'Não'])}</div>`; }).join('')}</div>`,
  combo: () => {
    const sel = V('combo') || []; const S = id => SIMBOLOS.find(x => x.id === id);
    const g = (id, cor, tr = '') => `<g transform="${tr}" style="color:${cor}">${S(id).svg}</g>`;
    const cores = ['#161616', '#007D68', '#B9684B'];
    let prev = '<p class="help" style="margin:14px 0 0">Escolha 2 ou 3 símbolos acima para ver a combinação aqui.</p>';
    if (sel.length >= 2) {
      const n = sel.length;
      const lado = `<svg viewBox="0 0 ${48 * n} 48">${sel.map((id, i) => g(id, cores[i], `translate(${48 * i} 0)`)).join('')}</svg>`;
      const sobre = `<svg viewBox="0 0 48 48">${sel.map((id, i) => g(id, cores[i])).join('')}</svg>`;
      const selo = `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" style="color:#161616"/>${sel.map((id, i) => g(id, cores[i], 'translate(10.8 10.8) scale(.55)')).join('')}</svg>`;
      prev = `<div class="cprev">${[['Lado a lado', lado], ['Sobrepostos', sobre], ['Num selo', selo]].map(([t, v]) => `<div><div class="cv">${v}</div><small>${t}</small></div>`).join('')}</div><p class="help" style="margin-top:10px">É só um esboço para despertar ideias. No logo, os desenhos se fundem numa forma única.</p>`;
    }
    if (!st.comboAberto && !sel.length && !V('combo_c')) return `<div class="campo" id="f-combo"><span class="lbl">Quer experimentar juntar símbolos? <span class="opc">Opcional</span></span><p class="help">Se tiver curiosidade, dá para misturar dois ou três desenhos e ver uma ideia nova. Se não, é só seguir para as cores.</p><button type="button" class="add" data-comboabrir>Experimentar combinações</button></div>`;
    return `<div class="campo" id="f-combo"><span class="lbl">Experimente juntar símbolos <span class="opc">Opcional</span></span><p class="help">Toque em até 3. A ordem do toque define as cores.</p>
      <div class="chips cpick">${SIMBOLOS.map(x => { const k = sel.indexOf(x.id); return `<button type="button" class="chip ${k > -1 ? 'on' : ''}" data-comb="${x.id}"><svg viewBox="0 0 48 48" aria-hidden="true">${x.svg}</svg>${esc(x.nome)}</button>`; }).join('')}</div>
      ${prev}
      <p class="help" style="margin:18px 0 8px"><b style="color:var(--ink)">Ideias para começar</b> · toque para ver</p>
      <div class="cex">${COMBOS.map((c, i) => `<button type="button" data-cex="${i}"><span><svg viewBox="0 0 48 48">${c.s.map((id, j) => `<g style="color:${cores[j]}">${S(id).svg}</g>`).join('')}</svg></span><b>${c.s.map(id => S(id).nome).join(' + ')}</b><small>${esc(c.d)}</small></button>`).join('')}</div>
      <label for="i-combo_c" style="margin-top:18px">Como você imagina essa junção?</label>
      <textarea id="i-combo_c" data-f="combo_c" placeholder="Escreva aqui">${esc(V('combo_c'))}</textarea>
      <div class="ex"><b>Exemplo</b>Gosto da folha saindo de dentro dos elos: o vínculo fazendo a pessoa crescer. Mas sem cara de marca de produto natural.</div></div>`;
  },
  paletas: () => `<div class="pals">${PALETAS.map(p => { const v = st.r['pal:' + p.id]?.v; const c = p.cores.map(x => x[0]); const nm = nomeAtual() || 'Sua clínica';
    return `<article class="pal ${v || ''}" data-card="pal:${p.id}"><h3>${esc(p.nome)}</h3><p class="cl">${esc(p.clima)}</p>
      <div class="barra">${p.cores.map(x => `<span style="background:${x[0]};flex:${x[2]}"></span>`).join('')}</div>
      <div class="hexes">${p.cores.map(x => `<div><b>${esc(x[1])}</b>${x[0]}</div>`).join('')}</div>
      <div class="mocks">${mockup(c[0], c[1], c[3], c[4])}</div>
      <p class="por">${esc(p.por)}</p>${rate('pal:' + p.id)}${coment('pal:' + p.id)}</article>`; }).join('')}</div>`,
  fontes: () => {
    const nm = nomeAtual(); const desc = (V('descritor') || [])[0] || V('descritor__outro') || 'Clínica de Psicologia';
    return `<div class="nomebox"><label for="nomevivo">Nome</label><input id="nomevivo" type="text" data-f="nome" value="${esc(nm)}" placeholder="Digite o nome da clínica"></div>
    <div class="fnts">${FONTES.map(f => { const v = st.r['fnt:' + f.id]?.v; return `<article class="fnt ${v || ''}" data-card="fnt:${f.id}"><span class="tag">${esc(f.nome)}</span>
      <div class="spec"><div class="big" data-nomevivo style="font-family:${f.tit};font-weight:${f.tw};${f.var ? `font-variation-settings:${f.var}` : ''}">${esc(nm || 'Clareira')}</div><div class="desc" style="font-family:${f.txt}">${esc(desc)}</div>${f.mao ? `<div class="mao" style="font-family:${f.mao}">um lugar para respirar</div>` : ''}<p class="corpo" style="font-family:${f.txt}">Psicoterapia para adultos, casais e famílias, com escuta sem pressa.</p></div>
      <p class="meta">${esc(f.clima)}<br><b>${esc(f.pares)}</b></p>${rate('fnt:' + f.id)}${coment('fnt:' + f.id)}</article>`; }).join('')}</div>`;
  },
  estilos: b => { const s = V('estilo_fonte'); return campo(b, `<p class="help">A fonte da marca será desenhada do zero. Escolha o ponto de partida.</p><div class="estilos">${ESTILOS_FONTE.map(e => `<button type="button" class="est ${s === e.id ? 'on' : ''}" data-est="${e.id}"><span class="aa" style="font-family:${e.f};font-weight:${e.w};${e.v ? `font-variation-settings:${e.v};` : ''}${e.i ? 'font-style:italic' : ''}">Aa Rr 23</span><b>${esc(e.nome)}</b><small>${esc(e.d)}</small></button>`).join('')}</div>`); },
  upload: b => {
    const lista = st.arqs.filter(a => (a.sec || 'upload') === b.id);
    const lbl = b.label || 'Arquivos';
    const help = b.help || 'Fotos do espaço, se já tiver, prints de referência e rascunhos. Imagens ou PDF, até 20 arquivos. Escreva um comentário em cada um.';
    return `<div class="campo" id="f-${b.id}"><span class="lbl">${esc(lbl)}${b.opc ? ' <span class="opc">Opcional</span>' : ''}</span><p class="help">${esc(help)}</p>
    <label class="drop ${b.mini ? 'mini' : ''}" data-drop="${b.id}">${ICON.up}<b>Toque para escolher ${b.mini ? 'imagens' : 'arquivos'}</b><small>ou arraste para cá</small><input type="file" data-file="${b.id}" multiple accept="image/*,application/pdf"></label>
    <div class="arqs">${lista.map(a => `<div class="arq"><div class="th" data-th="${a.id}">${/pdf/.test(a.t) ? 'PDF' : ''}</div><div><div class="nm2">${esc(a.n)}</div><div class="sz">${(a.s / 1e6).toFixed(1).replace('.', ',')} MB</div><textarea data-arqc="${a.id}" placeholder="O que você gosta aqui?">${esc(a.c)}</textarea></div><button type="button" class="x" data-arqx="${a.id}" aria-label="Remover">×</button></div>`).join('')}</div>
    <div class="ex"><b>Exemplo de comentário</b>${esc(b.exc || 'Foto da sala que vou usar. Gosto da madeira clara e da luz natural, quero que a marca combine com ela.')}</div></div>`;
  },
  minhapaleta: b => {
    const cs = V('minha_paleta') || [];
    const prev = cs.length >= 2 ? `<div class="mpprev">${mockup(...papeis(cs))}</div>` : `<p class="help" style="margin-top:14px">Com 2 cores ou mais, ela aparece aplicada aqui.</p>`;
    const sug = ['#F4F0E6', '#7E9077', '#34423A', '#B9684B', '#3E6D8B', '#8B7EA8', '#E1B679', '#1F4C44', '#D99B6D', '#2A2623'];
    return campo(b, `<div class="mp">${cs.map((c, i) => `<div class="cor"><label style="background:${c}" aria-label="Trocar cor ${i + 1}"><input type="color" value="${c}" data-mpc="${i}"></label><small>${c.toUpperCase()}</small><button type="button" class="x" data-mpx="${i}" aria-label="Tirar cor">×</button></div>`).join('')}${cs.length < 6 ? `<button type="button" class="mais" data-mpadd aria-label="Adicionar cor">+</button>` : ''}</div>
      ${cs.length < 6 ? `<p class="help" style="margin:14px 0 0">Ou toque num tom para começar:</p><div class="sug-cores">${sug.map(c => `<button type="button" style="background:${c}" data-mpsug="${c}" aria-label="${c}"></button>`).join('')}</div>` : ''}
      ${prev}
      <label for="i-mp_c" style="margin-top:16px;font-size:15px">Por que essas cores?</label><textarea id="i-mp_c" data-f="mp_c" placeholder="Escreva aqui">${esc(V('mp_c'))}</textarea>`);
  },
  links: () => `<div class="campo"><span class="lbl">Links de referência</span><p class="help">Perfis do Instagram, projetos do Behance, pastas do Pinterest, sites. Diga o que gosta em cada um.</p>
    ${st.links.map((l, i) => `<div class="linkrow"><input type="url" data-lu="${i}" value="${esc(l.u)}" placeholder="Cole o link aqui" inputmode="url">${st.links.length > 1 ? `<button type="button" class="x" data-lx="${i}" aria-label="Remover">×</button>` : ''}<textarea data-lc="${i}" placeholder="O que você gosta aqui?">${esc(l.c)}</textarea></div>`).join('')}
    <button type="button" class="add" data-ladd>+ Adicionar outro link</button>
    <div class="ex"><b>Exemplo</b>instagram.com/estudio-exemplo · Gosto das cores terrosas e das fotos com luz natural.</div></div>`,
};
function lum(h) { const n = parseInt(h.slice(1), 16); const [r, g, b] = [n >> 16 & 255, n >> 8 & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; }
function papeis(cs) { const o = [...cs].sort((a, b) => lum(b) - lum(a)); const bg = o[0], ink = o[o.length - 1]; const meio = o.slice(1, -1); return [bg, meio[0] || ink, ink, meio[1] || meio[0] || ink]; }
function mockup(bg, main, ink, acc) {
  const nm = nomeAtual() || 'Sua clínica';
  return `<div class="mcard" style="background:${bg};color:${ink}"><div class="mk"><i style="background:${main}"></i><b data-nomevivo>${esc(nm)}</b></div><small style="color:${ink};opacity:.75">Psicologia<br>Presencial e online</small></div>
      <div class="mpost" style="background:${main};color:${bg}"><span class="bola" style="background:${acc};opacity:.85"></span><small>Psicologia</small><p>Cuidar da mente também é rotina.</p></div>`;
}
function card(r) {
  const k = 'ref:' + r.id; const v = st.r[k]?.v;
  return `<article class="ref ${v || ''}" data-card="${esc(k)}"><div class="im" data-zoom="img/${esc(r.file)}" data-cap="${esc(r.title)}${r.author ? ' · ' + esc(r.author) : ''}"><img loading="lazy" src="img/${esc(r.file)}" alt="${esc(r.title)}">${v === 'amei' ? '<span class="badge">Amei</span>' : ''}</div>
    <div class="bd"><p class="por">${esc(r.why)}</p><p class="cr">${esc(r.title)}${r.author ? ' · ' + esc(r.author) : ''}${r.url ? ` · <a href="${esc(r.url)}" target="_blank" rel="noopener">ver projeto</a>` : ''}</p>${rate(k)}${coment(k)}</div></article>`;
}

/* ---------- etapas ---------- */
function stepHTML(i) {
  const s = STEPS[i];
  if (s.id === 'inicio') return abertura();
  if (s.id === 'envio') return envio();
  let blocos = s.blocks.map(b => R[b.type](b)).join('');
  const largo = ['logo', 'cores', 'fontes', 'clima', 'simbolos', 'personalidade'].includes(s.id);
  if (s.id === 'personalidade') blocos = `<div class="pers">${blocos}</div>`;
  const total = STEPS.filter(x => x.blocks).length;
  return `<section class="etapa ${largo ? 'larga' : 'estreita'}"><p class="kick">Etapa ${+s.num} de ${total}<span class="min">· cerca de ${s.min} min</span></p><h2>${esc(s.titulo[0])}<em>${esc(s.titulo[1])}</em></h2>${s.lead ? `<p class="lead">${esc(s.lead)}</p>` : ''}<div class="blocos ${largo ? '' : 'numerar'}">${blocos}</div></section>`;
}
function abertura() {
  return `<section class="etapa estreita abre"><p class="kick">Questionário de marca · Vinicius · Clínica de psicologia</p><h1>Vamos construir<em>a marca da clínica</em></h1>
  <p class="lead">Vinicius, este é o primeiro passo da identidade visual da sua clínica. Aqui estão as perguntas que preciso responder antes de desenhar, junto com referências, cores e letras para você reagir.</p>
  <div class="como"><div><span>01</span><b>Responda com calma</b><p>Leva uns 35 minutos. Cada pergunta tem um exemplo de resposta para orientar.</p></div><div><span>02</span><b>Reaja às referências</b><p>Marque Amei, Talvez ou Não e comente o que quiser.</p></div><div><span>03</span><b>Mande o que já tem</b><p>Fotos do espaço, prints e links, tudo por aqui mesmo.</p></div><div><span>04</span><b>Pode parar e voltar</b><p>Tudo fica salvo neste aparelho. No fim, é só enviar.</p></div></div>
  <div class="sec">Como o projeto segue</div>
  <div class="linha">${['Questionário', 'Moodboard e paleta', 'Logo', 'Fonte própria', 'Manual de marca', 'Aplicações'].map((x, i) => `<span class="${i ? '' : 'at'}"><i>${i + 1}</i>${x}</span>`).join('')}</div>
  <p class="nota">O prazo de até 10 dias úteis começa a contar quando o questionário chega para mim. Qualquer dúvida no caminho, me chame no WhatsApp ${esc(CONFIG.whatsapp)}.</p>
  ${assin()}</section>`;
}
const assin = () => `<footer class="assin"><span><b>Matheus Saboia</b> · Designer, criativos e identidade · Rama</span><span>WhatsApp ${esc(CONFIG.whatsapp)}</span></footer>`;

/* contagem de respostas por etapa */
function cont(s) {
  if (!s.blocks) return null;
  let tot = 0, ok = 0;
  const has = id => { const v = V(id); return Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== ''; };
  for (const b of s.blocks) {
    if (['text', 'textarea', 'slider', 'estilos'].includes(b.type)) { tot++; if (has(b.id)) ok++; }
    else if (b.type === 'chips') { tot++; if (has(b.id) || has(b.id + '__outro')) ok++; }
    else if (b.type === 'nome') { tot++; if (has('nome') || has('nome_opcoes') || has('nome_dir') || has('nome_palavras')) ok++; }
    else if (b.type === 'tipos') { tot++; if (has('tipos')) ok++; }
    else if (b.type === 'galeria') { const l = REFS.filter(r => b.cats.includes(r.cat)); tot += l.length; ok += l.filter(r => st.r['ref:' + r.id]?.v).length; }
    else if (b.type === 'simbolos') { tot += SIMBOLOS.length; ok += SIMBOLOS.filter(x => st.r['simb:' + x.id]?.v).length; }
    else if (b.type === 'paletas') { tot += PALETAS.length; ok += PALETAS.filter(x => st.r['pal:' + x.id]?.v).length; }
    else if (b.type === 'fontes') { tot += FONTES.length; ok += FONTES.filter(x => st.r['fnt:' + x.id]?.v).length; }
    else if (b.type === 'combo') { if ((V('combo') || []).length >= 2 || has('combo_c')) { tot++; ok++; } }
    else if (b.type === 'upload') { const n = st.arqs.filter(a => (a.sec || 'upload') === b.id).length; if (!b.opc) tot++; if (n) { if (b.opc) tot++; ok++; } }
    else if (b.type === 'minhapaleta') { if ((V('minha_paleta') || []).length) { tot++; ok++; } }
    else if (b.type === 'links') { tot++; if (st.links.some(l => l.u.trim())) ok++; }
  }
  return { tot, ok };
}
function envio() {
  const linhas = STEPS.filter(s => s.blocks).map(s => { const c = cont(s); const i = STEPS.indexOf(s); const pouco = c.ok < Math.ceil(c.tot / 2);
    return `<div class="rv ${pouco ? 'falta' : ''}"><span>${s.num}</span><div><b>${esc(s.t)}</b><small>${c.ok} de ${c.tot} respondidas${pouco ? ' · vale completar' : ''}</small></div><button type="button" data-go="${i}">Ver</button></div>`; }).join('');
  const ja = st.enviado.length;
  return `<section class="etapa estreita"><p class="kick">Último passo</p><h2>Revisar<em>e enviar</em></h2><p class="lead">Confira o que ficou faltando. Nada é obrigatório, mas quanto mais completo, mais certeira fica a primeira proposta.</p>
  <div class="rev">${linhas}</div>
  ${ja ? `<div class="ok-env"><h3>Recebido, obrigado!</h3><p>Enviado em ${esc(st.enviado[ja - 1])}. Se mudar alguma resposta, é só enviar de novo aqui embaixo.</p><ol><li>Leio tudo e monto o resumo do que entendi.</li><li>Mando o moodboard com a direção visual e a paleta.</li><li>Com a direção aprovada, começo o logo.</li></ol></div>` : ''}
  <div class="envbox"><h3>${ja ? 'Enviar de novo' : 'Tudo pronto?'}</h3><p>As respostas, os comentários e os arquivos chegam direto para mim.</p>
    <input type="text" data-f="quem" value="${esc(V('quem'))}" placeholder="Seu nome">
    <input type="text" data-f="zap" value="${esc(V('zap'))}" placeholder="Seu WhatsApp" inputmode="tel">
    <button type="button" class="btn" id="enviar">${ja ? 'Enviar atualização' : 'Enviar questionário'} ${ICON.seta}</button>
    <p class="st" id="st"></p><button type="button" class="copiar" id="copiar">Copiar resumo em texto</button></div>
  ${assin()}</section>`;
}

/* ---------- navegação ---------- */
const idxFromHash = () => { const i = STEPS.findIndex(s => '#' + s.id === location.hash); return i < 0 ? 0 : i; };
let cur = location.hash ? idxFromHash() : Math.min(st.step || 0, STEPS.length - 1);
function passos() {
  const box = $('#passos');
  box.innerHTML = STEPS.map((s, i) => `<button type="button" data-go="${i}" class="${i === cur ? 'at' : ''}">${s.num ? `<span>${s.num}</span>` : ''}${esc(s.t)}</button>`).join('');
  $('#trilho').style.width = (cur / (STEPS.length - 1) * 100) + '%';
  marcaPassos();
  const a = $('.at', box); if (a) box.scrollLeft = a.offsetLeft - (box.clientWidth - a.offsetWidth) / 2;
}
/* só troca as marcas de "respondida", sem redesenhar nem rolar nada */
function marcaPassos() { $$('#passos button').forEach((b, i) => { const c = cont(STEPS[i]); b.classList.toggle('ok', !!(c && c.ok > 0)); }); }
function navBar() {
  const p = STEPS[cur + 1];
  setTimeout(() => semOrfas($('#nav')));
  $('#nav').innerHTML = cur === 0
    ? `<button type="button" class="btn prox" data-go="1">Começar ${ICON.seta}</button>`
    : `<button type="button" class="btn sec2" data-go="${cur - 1}" aria-label="Voltar">${ICON.volta}<span class="vt">Voltar</span></button>${p ? `<button type="button" class="btn prox" data-go="${cur + 1}">${p.id === 'envio' ? 'Revisar e enviar' : 'Próxima: ' + esc(p.t)} ${ICON.seta}</button>` : ''}`;
}
function go(i, top = true) {
  cur = Math.max(0, Math.min(STEPS.length - 1, i)); st.step = cur;
  try { localStorage.setItem(KEY, JSON.stringify(st)); } catch {}
  if (location.hash !== '#' + STEPS[cur].id) history.replaceState(null, '', '#' + STEPS[cur].id);
  if (['cores', 'fontes'].includes(STEPS[cur].id)) carregaFontes();
  $('#app').innerHTML = stepHTML(cur); pos(); navBar(); passos();
  if (top) window.scrollTo({ top: 0, behavior: 'instant' });
}
function rerender() { const y = scrollY; const cx = {}; $$('[data-car]').forEach((c, i) => cx[i] = c.scrollLeft); $('#app').innerHTML = stepHTML(cur); pos(); marcaPassos(); $$('[data-car]').forEach((c, i) => { if (cx[i]) c.scrollLeft = cx[i]; }); window.scrollTo({ top: y, behavior: 'instant' }); }
function pos() {
  semOrfas($('#app')); semOrfas($('#nav'));
  $$('[data-car]').forEach(c => { const atual = () => { const w = c.firstElementChild?.offsetWidth || 1; const i = Math.round(c.scrollLeft / (w + 12)); const el = c.parentElement.querySelector('[data-carpos]'); if (el) el.textContent = `${Math.min(i + 1, c.children.length)} de ${c.children.length}`; }; c.addEventListener('scroll', () => { cancelAnimationFrame(c._r); c._r = requestAnimationFrame(atual); }, { passive: true }); atual(); });
  $$('[data-th]').forEach(async el => { const id = el.dataset.th; let b = blobs[id]; if (!b) { try { b = await idb.get(id); if (b) blobs[id] = b; } catch {} } if (b && /^image/.test(b.type)) el.style.backgroundImage = `url(${URL.createObjectURL(b)})`; });
  $$('[data-drop]').forEach(d => { const sec = d.dataset.drop;
    ['dragenter', 'dragover'].forEach(e => d.addEventListener(e, ev => { ev.preventDefault(); d.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(e => d.addEventListener(e, ev => { ev.preventDefault(); d.classList.remove('over'); }));
    d.addEventListener('drop', ev => addArquivos([...ev.dataTransfer.files], sec));
    $('input[type=file]', d).addEventListener('change', ev => { addArquivos([...ev.target.files], sec); ev.target.value = ''; });
  });
}
/* evita palavra sozinha no fim da linha: prende palavras curtas à seguinte e as duas últimas de cada frase */
const CURTAS = /(^|[\s(])(a|o|e|é|à|ao|as|os|de|da|do|das|dos|em|no|na|nos|nas|um|uma|ou|se|que|com|por|para|sem|seu|sua|só|não|já|mais|tem|vai|cada)\s+(?=\S)/gi;
function semOrfas(root) {
  if (!root) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement.closest('textarea,input,script,style,svg,.chip,.tabs,.passos') ? 2 : 1 });
  const ns = []; while (w.nextNode()) ns.push(w.currentNode);
  for (const n of ns) {
    let t = n.nodeValue; if (!/\s\S+\s+\S/.test(t)) continue;
    t = t.replace(CURTAS, (m, a, b) => a + b + '\u00A0').replace(CURTAS, (m, a, b) => a + b + '\u00A0');
    t = t.replace(/\s+(\S{1,14}[.,:;!?…)]*\s*)$/, '\u00A0$1');
    if (t !== n.nodeValue) n.nodeValue = t;
  }
}
function carregaFontes() { const l = $('#fx'); if (l && !l.href) l.href = l.dataset.href; }

/* ---------- eventos ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('button,[data-zoom]'); if (!t) return;
  const d = t.dataset;
  if (d.go != null) return go(+d.go);
  if (d.rate) {
    const k = d.rate; const r = st.r[k] ||= {}; r.v = r.v === d.v ? null : d.v; save();
    const cardEl = t.closest('[data-card]');
    $$('button', t.parentElement).forEach(b => { const on = b.dataset.v === r.v; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    if (cardEl) { cardEl.classList.remove('amei', 'talvez', 'nao'); if (r.v) cardEl.classList.add(r.v); const im = $('.im', cardEl); if (im) { $('.badge', im)?.remove(); if (r.v === 'amei') im.insertAdjacentHTML('beforeend', '<span class="badge">Amei</span>'); } }
    if (r.v === 'amei' || r.v === 'nao') { const c = t.closest('.ref,.pal,.fnt'); const cm = c && $('.coment', c); if (cm && !$('textarea', cm) && r.v === 'nao') toast('Se quiser, comente o que não funciona.'); }
    return;
  }
  if (d.cm) { const box = t.parentElement; let ta = $('textarea', box); if (!ta) { box.insertAdjacentHTML('beforeend', `<textarea data-cmt="${esc(d.cm)}" placeholder="O que chamou atenção, o que mudaria..."></textarea>`); ta = $('textarea', box); } ta.focus(); return; }
  if (d.o != null) {
    const box = t.closest('[data-chips]'); const id = box.dataset.chips; const max = +box.dataset.max; let sel = V(id) || [];
    if (sel.includes(d.o)) sel = sel.filter(x => x !== d.o);
    else if (max === 1) sel = [d.o];
    else if (max && sel.length >= max) { toast(`Escolha até ${max}. Desmarque uma para trocar.`); return; }
    else sel = [...sel, d.o];
    st.v[id] = sel; save();
    $$('.chip', box).forEach(c => { const on = sel.includes(c.dataset.o); c.classList.toggle('on', on); c.setAttribute('aria-pressed', on); });
    return;
  }
  if (d.nst) { st.v.nome_status = d.nst; save(); rerender(); const i = $('#f-nome input,#f-nome textarea'); if (i && d.nst !== 'nao') i.focus({ preventScroll: true }); return; }
  if (d.ndir) { const a = V('nome_dir') || []; st.v.nome_dir = a.includes(d.ndir) ? a.filter(x => x !== d.ndir) : [...a, d.ndir]; save(); t.classList.toggle('on'); return; }
  if (d.tipo) { let a = V('tipos') || []; if (a.includes(d.tipo)) a = a.filter(x => x !== d.tipo); else if (a.length >= 3) { toast('Escolha até 3.'); return; } else a = [...a, d.tipo]; st.v.tipos = a; save(); t.classList.toggle('on'); return; }
  if (d.tab) { const g = t.closest('[data-gal]').dataset.gal; st.tab[g] = d.tab; save(); rerender(); $('.tabs')?.scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
  if (d.tabnext) { const b = STEPS[cur].blocks.find(x => x.id === d.tabnext); const cats = b.cats.filter(c => REFS.some(r => r.cat === c)); const at = cats.includes(st.tab[b.id]) ? st.tab[b.id] : cats[0]; st.tab[b.id] = cats[cats.indexOf(at) + 1]; save(); rerender(); const tb = $('.tabs'); if (tb) window.scrollTo({ top: tb.getBoundingClientRect().top + scrollY - 130, behavior: 'smooth' }); return; }
  if (d.mpadd != null || d.mpsug) { const cs = V('minha_paleta') || []; if (cs.length >= 6) return; cs.push(d.mpsug || '#7E9077'); st.v.minha_paleta = cs; save(); rerender(); if (d.mpadd != null) $$('[data-mpc]').pop()?.click(); return; }
  if (d.mpx != null) { const cs = V('minha_paleta') || []; cs.splice(+d.mpx, 1); st.v.minha_paleta = cs; save(); rerender(); return; }
  if (d.carmove) { const c = t.closest('.carwrap').querySelector('[data-car]'); const w = c.firstElementChild.offsetWidth + 12; c.scrollBy({ left: +d.carmove * w, behavior: 'smooth' }); return; }
  if (d.comboabrir != null) { st.comboAberto = true; save(); rerender(); return; }
  if (d.comb) { let a = V('combo') || []; if (a.includes(d.comb)) a = a.filter(x => x !== d.comb); else if (a.length >= 3) { toast('Até 3 símbolos por combinação.'); return; } else a = [...a, d.comb]; st.v.combo = a; save(); rerender(); return; }
  if (d.cex != null) { st.v.combo = [...COMBOS[+d.cex].s]; save(); rerender(); $('.cprev')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
  if (d.est) { st.v.estilo_fonte = st.v.estilo_fonte === d.est ? null : d.est; save(); $$('.est').forEach(x => x.classList.toggle('on', x.dataset.est === st.v.estilo_fonte)); return; }
  if (d.arqx) { st.arqs = st.arqs.filter(a => a.id !== d.arqx); idb.del(d.arqx).catch(() => {}); save(); rerender(); return; }
  if (d.ladd != null) { st.links.push({ u: '', c: '' }); save(); rerender(); $$('[data-lu]').pop()?.focus(); return; }
  if (d.lx != null) { st.links.splice(+d.lx, 1); save(); rerender(); return; }
  if (d.zoom) { const lb = document.createElement('div'); lb.className = 'lbox'; lb.innerHTML = `<img src="${esc(d.zoom)}" alt=""><p>${d.cap || ''}</p>`; lb.onclick = () => lb.remove(); document.body.appendChild(lb); return; }
  if (t.id === 'enviar') return enviar();
  if (t.id === 'copiar') { navigator.clipboard?.writeText(resumo()).then(() => toast('Resumo copiado.'), () => toast('Não deu para copiar neste aparelho.')); return; }
});
const DIGITA = 'input[type=text],input[type=url],input:not([type]),textarea';
let tFoco;
function garanteVisivel(el) {
  const vv = window.visualViewport; const alt = vv ? vv.height : innerHeight;
  const r = el.getBoundingClientRect(); const topo = 76;
  if (r.top < topo || r.bottom > alt - 20) window.scrollBy({ top: r.top - Math.max(topo, (alt - r.height) / 3), behavior: 'smooth' });
}
document.addEventListener('focusin', e => { if (!e.target.matches(DIGITA)) return; clearTimeout(tFoco); document.body.classList.add('digitando'); setTimeout(() => garanteVisivel(e.target), 350); });
document.addEventListener('focusout', e => { if (!e.target.matches(DIGITA)) return; tFoco = setTimeout(() => document.body.classList.remove('digitando'), 200); });
window.visualViewport?.addEventListener('resize', () => { const a = document.activeElement; if (a && a.matches && a.matches(DIGITA)) garanteVisivel(a); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('.lbox')?.remove(); });
document.addEventListener('input', e => {
  const t = e.target; const d = t.dataset;
  if (d.f) { st.v[d.f] = t.value; save(); if (d.f === 'nome') $$('[data-nomevivo]').forEach(x => x.textContent = t.value.trim() || (x.classList.contains('big') ? 'Clareira' : 'Sua clínica')); return; }
  if (d.sl) { const v = +t.value; st.v[d.sl] = v; t.style.setProperty('--p', v + '%'); const b = STEPS[cur].blocks.find(x => x.id === d.sl); const w = t.closest('.sl'); w.classList.remove('vazio'); $('.sl-val', w).textContent = slVal(b, v); save(); return; }
  if (d.mpc != null) { const cs = V('minha_paleta') || []; cs[+d.mpc] = t.value; st.v.minha_paleta = cs; save(); const box = t.closest('.cor'); box.querySelector('label').style.background = t.value; box.querySelector('small').textContent = t.value.toUpperCase(); return; }
  if (d.cmt) { const r = st.r[d.cmt] ||= {}; r.c = t.value; t.parentElement.classList.toggle('tem', !!t.value.trim()); save(); return; }
  if (d.arqc) { const a = st.arqs.find(x => x.id === d.arqc); if (a) { a.c = t.value; save(); } return; }
  if (d.lu != null) { st.links[+d.lu].u = t.value; save(); return; }
  if (d.lc != null) { st.links[+d.lc].c = t.value; save(); return; }
});
/* slider sem arrastar: um toque já marca */
document.addEventListener('change', e => { const d = e.target.dataset; if (d.mpc != null) { rerender(); return; } if (d.sl && V(d.sl) == null) { st.v[d.sl] = +e.target.value; save(); } });
window.addEventListener('hashchange', () => { const i = idxFromHash(); if (i !== cur) go(i); });

/* ---------- resumo e envio ---------- */
function fmt(v) { return Array.isArray(v) ? v.join(', ') : String(v ?? '').trim(); }
function resumo() {
  const L = [];
  const n = nomeAtual();
  L.push(`QUESTIONÁRIO DE MARCA · ${n || 'Clínica sem nome definido'}`, `Respondido por: ${V('quem') || '-'} · WhatsApp: ${V('zap') || '-'}`, '');
  const rated = (pref, lista, nome) => { const out = { amei: [], talvez: [], nao: [] }; lista.forEach(x => { const r = st.r[pref + x.id]; if (r?.v) out[r.v].push(nome(x) + (r.c ? ` (${r.c.trim()})` : '')); else if (r?.c) out.talvez.push(nome(x) + ` (só comentário: ${r.c.trim()})`); }); return out; };
  const put = (o, lab = ['Amei', 'Talvez', 'Não']) => ['amei', 'talvez', 'nao'].forEach((k, i) => o[k].length && L.push(`  ${lab[i]}: ${o[k].join('; ')}`));
  for (const s of STEPS.filter(s => s.blocks)) {
    L.push(`== ${s.num} ${s.t.toUpperCase()} ==`);
    for (const b of s.blocks) {
      if (b.type === 'nome') {
        const map = { tem: 'Já tem nome', opcoes: 'Tem opções', nao: 'Ainda não tem' };
        L.push(`- Nome: ${map[V('nome_status')] || '-'}${n ? ' · ' + n : ''}`);
        if (V('nome_opcoes')) L.push(`  Opções: ${fmt(V('nome_opcoes')).replace(/\n+/g, ' / ')}`);
        if ((V('nome_dir') || []).length) L.push(`  Caminhos de nome que agradam: ${V('nome_dir').map(id => NOMES_DIRECOES.find(x => x.id === id)?.nome).join(', ')}`);
        if (V('nome_palavras')) L.push(`  Palavras para o nome: ${fmt(V('nome_palavras'))}`);
      } else if (b.type === 'chips') {
        const v = [...(V(b.id) || []), V(b.id + '__outro')].filter(x => x && String(x).trim());
        if (v.length) L.push(`- ${b.label} ${v.join(', ')}`);
      } else if (b.type === 'slider') {
        const v = V(b.id); if (v != null) L.push(`- ${b.label ? b.label + ' ' : ''}${b.esq} ↔ ${b.dir}: ${v}/100 (${slVal(b, v)})`);
      } else if (b.type === 'text' || b.type === 'textarea') {
        const v = fmt(V(b.id)); if (v) L.push(`- ${b.label}\n  ${v.replace(/\n/g, '\n  ')}`);
      } else if (b.type === 'tipos') {
        if ((V('tipos') || []).length) L.push(`- Tipos de logo: ${V('tipos').map(c => CATS[c].t).join(', ')}`);
      } else if (b.type === 'galeria') {
        L.push(`- Referências (${b.cats.map(c => CATS[c].t).join(', ')}):`);
        put(rated('ref:', REFS.filter(r => b.cats.includes(r.cat)), r => `[${CATS[r.cat].t}] ${r.title}${r.author ? ' · ' + r.author : ''} <${r.url || r.file}>`));
      } else if (b.type === 'simbolos') {
        L.push('- Símbolos:'); put(rated('simb:', SIMBOLOS, x => x.nome), ['Sim', 'Talvez', 'Não']);
      } else if (b.type === 'combo') {
        if ((V('combo') || []).length) L.push(`- Combinação de símbolos: ${V('combo').map(id => SIMBOLOS.find(x => x.id === id).nome).join(' + ')}`);
        if (V('combo_c')) L.push(`  Como imaginam: ${fmt(V('combo_c'))}`);
      } else if (b.type === 'paletas') {
        L.push('- Paletas:'); put(rated('pal:', PALETAS, x => x.nome));
      } else if (b.type === 'fontes') {
        L.push('- Fontes:'); put(rated('fnt:', FONTES, x => `${x.nome} (${x.pares})`));
      } else if (b.type === 'estilos') {
        const e = ESTILOS_FONTE.find(x => x.id === V('estilo_fonte')); if (e) L.push(`- Estilo da fonte própria: ${e.nome}`);
      } else if (b.type === 'upload') {
        const ls = st.arqs.filter(a => (a.sec || 'upload') === b.id); if (ls.length) { L.push(`- ${b.label || 'Arquivos'} (${ls.length}):`); ls.forEach(a => L.push(`  ${a.n}${a.c ? ': ' + a.c.trim() : ''}`)); }
      } else if (b.type === 'minhapaleta') {
        const cs = V('minha_paleta') || []; if (cs.length) L.push(`- Paleta própria: ${cs.map(c => c.toUpperCase()).join(', ')}${V('mp_c') ? ' · ' + fmt(V('mp_c')) : ''}`);
      } else if (b.type === 'links') {
        const ls = st.links.filter(l => l.u.trim()); if (ls.length) { L.push('- Links:'); ls.forEach(l => L.push(`  ${l.u.trim()}${l.c ? ' · ' + l.c.trim() : ''}`)); }
      }
    }
    L.push('');
  }
  return L.join('\n');
}
function dadosForm(tipo) {
  const p = new URLSearchParams(); const e = CONFIG.entry;
  p.append(e.quando, new Date().toLocaleString('pt-BR')); p.append(e.tipo, tipo); p.append(e.nome, nomeAtual() || '(sem nome)');
  p.append(e.resumo, resumo().slice(0, 45000));
  p.append(e.json, JSON.stringify({ v: st.v, r: Object.fromEntries(Object.entries(st.r).filter(([, x]) => x && (x.v || x.c))), links: st.links, arqs: st.arqs.map(a => ({ n: a.n, c: a.c })) }).slice(0, 45000));
  p.append(e.arquivos, st.arqs.map(a => a.n).join(', '));
  return p;
}
async function enviar() {
  const bt = $('#enviar'); const s = $('#st'); bt.disabled = true; s.textContent = 'Enviando as respostas...';
  try {
    if (CONFIG.form) await fetch(CONFIG.form, { method: 'POST', mode: 'no-cors', body: dadosForm('final') });
    /* cópia por e-mail com os arquivos, em lotes */
    const lotes = [[]]; let tam = 0;
    for (const a of st.arqs) { let b = blobs[a.id]; if (!b) { try { b = await idb.get(a.id); } catch {} } if (!b) continue; if (tam + b.size > 6e6 || lotes.at(-1).length >= 5) { lotes.push([]); tam = 0; } lotes.at(-1).push([a, b]); tam += b.size; }
    for (let i = 0; i < lotes.length; i++) {
      s.textContent = lotes.length > 1 ? `Enviando arquivos (${i + 1} de ${lotes.length})...` : (st.arqs.length ? 'Enviando arquivos...' : 'Finalizando...');
      const fd = new FormData();
      fd.append('_subject', `Questionário de marca · ${nomeAtual() || 'Clínica'}${lotes.length > 1 ? ` · parte ${i + 1}/${lotes.length}` : ''}`);
      fd.append('_captcha', 'false'); fd.append('_template', 'box');
      fd.append('Clínica', nomeAtual() || '-'); fd.append('Quem respondeu', V('quem') || '-'); fd.append('WhatsApp', V('zap') || '-');
      fd.append('Resumo', i === 0 ? resumo() : '(continuação: só arquivos)');
      lotes[i].forEach(([a, b], j) => { fd.append('attachment' + (j ? j : ''), b, a.n); fd.append('Arquivo ' + (j + 1), a.n + (a.c ? ' · ' + a.c : '')); });
      if (CONFIG.arquivosPara) await fetch(CONFIG.arquivosPara, { method: 'POST', mode: 'no-cors', body: fd });
    }
    st.enviado.push(new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })); st.alterado = false; save();
    rerender(); toast('Enviado. Obrigado!');
  } catch (err) {
    bt.disabled = false; s.textContent = `Não consegui enviar agora. Tentem de novo ou toquem em "Copiar resumo" e mandem pelo WhatsApp ${CONFIG.whatsapp}.`;
  }
}
/* rascunho de segurança: se a pessoa sair no meio, o que já respondeu chega para mim */
let ultimoRasc = 0;
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'hidden' || !st.alterado || !CONFIG.form || Date.now() - ultimoRasc < 60e3) return;
  ultimoRasc = Date.now();
  try { navigator.sendBeacon(CONFIG.form, dadosForm('rascunho')); } catch {}
});

/* ---------- início ---------- */
fetch('refs.json').then(r => r.json()).then(j => { REFS = j.map(r => ({ ...r, id: r.file.replace(/^.*\//, '').replace(/\.\w+$/, '') })); go(cur, false); }).catch(() => go(cur, false));
go(cur, false);
