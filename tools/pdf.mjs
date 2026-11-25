/* Gera o PDF de cada envio em respostas/<data>/ que ainda não tem PDF.
   Roda no GitHub Actions (ver .github/workflows/pdf.yml) e também no PC: node tools/pdf.mjs */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'data.js'), 'utf8') + '\n;Object.assign(this,{PALETAS,FONTES,ESTILOS_FONTE,SIMBOLOS,COMBOS,PALAVRAS,NOMES_DIRECOES,STEPS,CATS});', ctx);
const { PALETAS, FONTES, ESTILOS_FONTE, SIMBOLOS, COMBOS, NOMES_DIRECOES, STEPS, CATS } = ctx;
const REFS = JSON.parse(fs.readFileSync(path.join(RAIZ, 'refs.json'), 'utf8')).map(r => ({ ...r, id: r.file.replace(/^.*\//, '').replace(/\.\w+$/, '') }));

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const br = s => esc(s).replace(/\n/g, '<br>');
const ROT = { amei: 'Amei', talvez: 'Talvez', nao: 'Não' };

function chrome() {
  const c = [process.env.CHROME, 'google-chrome', 'google-chrome-stable', 'chromium', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].filter(Boolean);
  for (const x of c) { try { execFileSync(x, ['--version'], { stdio: 'ignore' }); return x; } catch {} if (fs.existsSync(x)) return x; }
  throw new Error('Chrome não encontrado');
}

function html(d, pastaRel) {
  const V = id => d.v?.[id];
  const R = k => d.r?.[k];
  const raiz = '../'.repeat(pastaRel.split('/').length);
  const nome = (V('nome') || '').trim();
  const has = v => Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== '';
  const val = id => { const v = V(id); const o = V(id + '__outro'); const a = Array.isArray(v) ? [...v] : (has(v) ? [v] : []); if (has(o)) a.push(o); return a; };
  const data = new Date(d.enviadoEm || Date.now()).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Sao_Paulo' });
  const sv = (id, cor = '#161616') => { const s = SIMBOLOS.find(x => x.id === id); return s ? `<g style="color:${cor}">${s.svg}</g>` : ''; };
  const badge = v => v ? `<span class="b ${v}">${ROT[v]}</span>` : '';
  const com = c => c && c.trim() ? `<p class="com">“${br(c.trim())}”</p>` : '';

  const qa = (label, corpo) => `<div class="qa"><p class="q">${esc(label)}</p><div class="a">${corpo}</div></div>`;
  const chips = a => `<div class="chips">${a.map(x => `<span>${esc(x)}</span>`).join('')}</div>`;
  const semResp = [];

  const bloco = b => {
    switch (b.type) {
      case 'text': case 'textarea': return has(V(b.id)) ? qa(b.label, `<p>${br(V(b.id))}</p>`) : (semResp.push(b.label), '');
      case 'chips': { const a = val(b.id); return a.length ? qa(b.label, chips(a)) : (semResp.push(b.label), ''); }
      case 'slider': {
        const v = V(b.id); if (v == null) { if (b.label) semResp.push(b.label); else semResp.push(`${b.esq} ou ${b.dir}`); return ''; }
        return `<div class="sl">${b.label ? `<p class="q">${esc(b.label)}</p>` : ''}<div class="slr"><span class="${v < 45 ? 'forte' : ''}">${esc(b.esq)}</span><div class="trk"><i style="left:${v}%"></i></div><span class="${v > 55 ? 'forte' : ''}">${esc(b.dir)}</span></div></div>`;
      }
      case 'nome': {
        const st = { tem: 'Já tem o nome', opcoes: 'Tem algumas opções', nao: 'Ainda não tem nome' }[V('nome_status')] || 'Não respondeu';
        let c = `<p><b>${esc(st)}</b>${nome ? `: ${esc(nome)}` : ''}</p>`;
        if (has(V('nome_opcoes'))) c += `<p>Opções: ${br(V('nome_opcoes'))}</p>`;
        if (has(V('nome_dir'))) c += `<p>Caminhos de nome que agradam:</p>${chips(V('nome_dir').map(id => NOMES_DIRECOES.find(x => x.id === id)?.nome || id))}`;
        if (has(V('nome_palavras'))) c += `<p>Palavras para o nome: ${br(V('nome_palavras'))}</p>`;
        return qa('Nome da clínica', c);
      }
      case 'tipos': return has(V('tipos')) ? qa('Tipos de logo que imagina', chips(V('tipos').map(c => CATS[c]?.t || c))) : '';
      case 'galeria': {
        const lista = REFS.filter(r => b.cats.includes(r.cat)).map(r => ({ r, x: R('ref:' + r.id) })).filter(o => o.x?.v || o.x?.c);
        if (!lista.length) return `<p class="vazio">Nenhuma referência avaliada.</p>`;
        const grupo = (v, cls) => { const g = lista.filter(o => (o.x.v || 'talvez') === v); if (!g.length) return ''; return `<h4>${ROT[v]} <small>${g.length}</small></h4><div class="refs ${cls}">${g.map(({ r, x }) => `<figure><img src="${raiz}img/${esc(r.file)}"><figcaption><b>${esc(CATS[r.cat]?.t || '')}</b> · ${esc(r.title)}${com(x.c)}</figcaption></figure>`).join('')}</div>`; };
        return grupo('amei', 'g3') + grupo('talvez', 'g4') + grupo('nao', 'g5');
      }
      case 'simbolos': {
        const col = v => { const g = SIMBOLOS.filter(s => R('simb:' + s.id)?.v === v); return `<div class="sc"><h4>${v === 'amei' ? 'Sim' : ROT[v]}</h4>${g.length ? g.map(s => `<p><svg viewBox="0 0 48 48">${s.svg}</svg>${esc(s.nome)}</p>`).join('') : '<p class="vazio">nenhum</p>'}</div>`; };
        return `<div class="simbs">${col('amei')}${col('talvez')}${col('nao')}</div>`;
      }
      case 'combo': {
        const c = V('combo') || []; if (c.length < 2 && !has(V('combo_c'))) return '';
        const cores = ['#161616', '#007D68', '#B9684B'];
        return qa('Combinação de símbolos', `${c.length ? `<div class="combo"><svg viewBox="0 0 48 48">${c.map((id, i) => sv(id, cores[i])).join('')}</svg><p>${c.map(id => esc(SIMBOLOS.find(x => x.id === id)?.nome)).join(' + ')}</p></div>` : ''}${has(V('combo_c')) ? `<p>${br(V('combo_c'))}</p>` : ''}`);
      }
      case 'paletas': {
        const l = PALETAS.map(p => ({ p, x: R('pal:' + p.id) })).filter(o => o.x?.v || o.x?.c).sort((a, b) => ['amei', 'talvez', 'nao'].indexOf(a.x.v) - ['amei', 'talvez', 'nao'].indexOf(b.x.v));
        if (!l.length) return `<p class="vazio">Nenhuma paleta avaliada.</p>`;
        return `<div class="pals">${l.map(({ p, x }) => `<div class="pal ${x.v || ''}"><div class="bar">${p.cores.map(c => `<span style="background:${c[0]};flex:${c[2]}"></span>`).join('')}</div><p><b>${esc(p.nome)}</b> ${badge(x.v)}</p><p class="hex">${p.cores.map(c => `${esc(c[1])} ${c[0]}`).join(' · ')}</p>${com(x.c)}</div>`).join('')}</div>`;
      }
      case 'minhapaleta': {
        const cs = V('minha_paleta') || []; if (!cs.length) return '';
        return qa('Paleta que ele montou', `<div class="mp">${cs.map(c => `<div><span style="background:${c}"></span><small>${c.toUpperCase()}</small></div>`).join('')}</div>${has(V('mp_c')) ? `<p>${br(V('mp_c'))}</p>` : ''}`);
      }
      case 'fontes': {
        const l = FONTES.map(f => ({ f, x: R('fnt:' + f.id) })).filter(o => o.x?.v || o.x?.c).sort((a, b) => ['amei', 'talvez', 'nao'].indexOf(a.x.v) - ['amei', 'talvez', 'nao'].indexOf(b.x.v));
        if (!l.length) return `<p class="vazio">Nenhuma fonte avaliada.</p>`;
        return `<div class="fnts">${l.map(({ f, x }) => `<div class="fnt ${x.v || ''}"><p class="nm" style="font-family:${f.tit};font-weight:${f.tw};${f.var ? `font-variation-settings:${f.var}` : ''}">${esc(nome || 'Clareira')}</p><p><b>${esc(f.nome)}</b> ${badge(x.v)}<br><small>${esc(f.pares)}</small></p>${com(x.c)}</div>`).join('')}</div>`;
      }
      case 'estilos': { const e = ESTILOS_FONTE.find(x => x.id === V('estilo_fonte')); return e ? qa(b.label, `<p class="aa" style="font-family:${e.f};font-weight:${e.w};${e.v ? `font-variation-settings:${e.v};` : ''}${e.i ? 'font-style:italic' : ''}">Aa Rr 23</p><p><b>${esc(e.nome)}</b> · ${esc(e.d)}</p>`) : ''; }
      case 'upload': {
        const l = (d.arqs || []).filter(a => (a.sec || 'upload') === b.id); if (!l.length) return '';
        return qa(b.label || 'Arquivos enviados', `<div class="ups">${l.map(a => `<figure>${a.caminho && /^image/.test(a.t || '') ? `<img src="${raiz}${esc(a.caminho)}">` : `<div class="doc">${esc((a.t || '').includes('pdf') ? 'PDF' : 'Arquivo')}</div>`}<figcaption><b>${esc(a.n)}</b>${com(a.c)}</figcaption></figure>`).join('')}</div>`);
      }
      case 'links': { const l = d.links || []; return l.length ? qa('Links de referência', l.map(x => `<p><a href="${esc(x.u)}">${esc(x.u)}</a>${x.c ? `<br><span class="mut">${br(x.c)}</span>` : ''}</p>`).join('')) : ''; }
      default: return '';
    }
  };

  const secoes = STEPS.filter(s => s.blocks).map(s => {
    semResp.length = 0;
    let corpo = s.blocks.map(bloco).join('');
    if (s.id === 'personalidade') corpo = `<div class="pers">${corpo}</div>`;
    const faltou = semResp.length ? `<p class="falta">Sem resposta: ${semResp.map(esc).join(' · ')}</p>` : '';
    return `<section><div class="sh"><span>${esc(s.num)}</span><h2>${esc(s.titulo[0])} ${esc(s.titulo[1])}</h2></div>${corpo || '<p class="vazio">Etapa sem respostas.</p>'}${faltou}</section>`;
  }).join('');

  const amei = PALETAS.filter(p => R('pal:' + p.id)?.v === 'amei').map(p => p.nome);
  const fAmei = FONTES.filter(f => R('fnt:' + f.id)?.v === 'amei').map(f => f.nome);
  const destaque = [
    ['Abordagens', val('abordagens')], ['Público', val('publicos')], ['Palavras da marca', val('palavras')],
    ['Tipos de logo', (V('tipos') || []).map(c => CATS[c]?.t || c)], ['Paletas que amou', amei], ['Fontes que amou', fAmei],
  ].filter(([, a]) => a.length);

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Questionário de marca</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;600;700&family=Fraunces:opsz,wght,SOFT@9..144,300..600,0..100&family=Cormorant+Garamond:wght@500&family=Quicksand:wght@600&family=Outfit:wght@500&family=Bricolage+Grotesque:wght@600&family=Instrument+Serif:ital@0;1&family=Gloock&display=swap" rel="stylesheet">
<style>
@page{size:A4;margin:16mm 15mm 16mm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Montserrat,Arial,sans-serif;color:#1d1b19;font-size:10pt;line-height:1.55;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.capa{height:262mm;display:flex;flex-direction:column;page-break-after:always}
.marca{display:flex;align-items:center;gap:4mm;padding-bottom:5mm;border-bottom:1.4px solid #007D68}
.marca img{height:8mm}.marca i{width:1px;height:8mm;background:#e3dccd}.marca b{font-size:11pt}.marca small{display:block;font-size:6.5pt;letter-spacing:.18em;color:#6b655c;text-transform:uppercase}
.kick{margin-top:40mm;font-size:8pt;font-weight:700;letter-spacing:.28em;color:#007D68;text-transform:uppercase}
h1{font-family:'Bebas Neue',Impact,sans-serif;font-weight:400;font-size:64pt;line-height:.9;margin:4mm 0 6mm}
h1 em{font-style:normal;color:#007D68;display:block}
.meta{color:#5f5a50;font-size:10.5pt}
.dest{margin-top:14mm;display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.dest>div{border:1px solid #ebe4d6;border-radius:3mm;padding:4mm 5mm}
.dest p{font-size:7pt;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#8a8273;margin-bottom:2mm}
.capa footer{margin-top:auto;font-size:8.5pt;color:#8a8273;border-top:1px solid #ebe4d6;padding-top:4mm;display:flex;justify-content:space-between}
section{margin-bottom:9mm}
.sh{display:flex;align-items:baseline;gap:4mm;border-bottom:1.4px solid #1d1b19;padding-bottom:2.5mm;margin-bottom:5mm;break-after:avoid}
.sh span{font-family:'Bebas Neue';font-size:22pt;color:#007D68;line-height:1}
h2{font-family:'Bebas Neue';font-weight:400;font-size:22pt;line-height:1;letter-spacing:.01em}
h4{font-size:8pt;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#007D68;margin:5mm 0 3mm}
h4 small{color:#8a8273;font-weight:600}
.qa{margin-bottom:5mm;break-inside:avoid}
.q{font-weight:700;font-size:10pt;margin-bottom:1.2mm}
.a p{margin-bottom:1.5mm}
.chips{display:flex;flex-wrap:wrap;gap:1.6mm;margin:1mm 0 1.5mm}
.chips span{border:1px solid #cfe2da;background:#f2f8f5;color:#0b5a4b;border-radius:99px;padding:.8mm 3mm;font-size:8.5pt;font-weight:600}
.pers{display:grid;grid-template-columns:1fr 1fr;gap:3mm 8mm}
.sl{margin-bottom:3mm;break-inside:avoid}
.slr{display:grid;grid-template-columns:24mm 1fr 24mm;align-items:center;gap:3mm;font-size:8.5pt;color:#6b655c}
.slr span:last-child{text-align:right}.slr .forte{color:#1d1b19;font-weight:700}
.trk{position:relative;height:1.6mm;background:#ebe4d6;border-radius:9px}
.trk i{position:absolute;top:50%;width:4mm;height:4mm;margin:-2mm 0 0 -2mm;border-radius:50%;background:#007D68;border:.8mm solid #fff;box-shadow:0 0 0 .3mm #007D68}
.refs{display:grid;gap:3mm}.g3{grid-template-columns:repeat(3,1fr)}.g4{grid-template-columns:repeat(4,1fr)}.g5{grid-template-columns:repeat(5,1fr)}
.refs figure,.ups figure{break-inside:avoid}
.refs img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:2mm;border:1px solid #ebe4d6}
.g5 img{opacity:.55;filter:grayscale(.6)}
figcaption{font-size:7.5pt;color:#5f5a50;margin-top:1.2mm;line-height:1.4}
figcaption b{color:#1d1b19}
.com{font-style:italic;color:#0b5a4b;margin-top:1mm;font-size:8.5pt}
.b{display:inline-block;font-size:7pt;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:99px;padding:.4mm 2.4mm;vertical-align:middle;margin-left:1mm}
.b.amei{background:#007D68;color:#fff}.b.talvez{background:#f3e3bf;color:#5d4718}.b.nao{background:#2a2623;color:#fff}
.simbs{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm}
.sc p{display:flex;align-items:center;gap:2mm;font-size:9pt;margin-bottom:1.5mm}
.sc svg,.combo svg{width:7mm;height:7mm;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:none}
.combo{display:flex;align-items:center;gap:4mm;margin-bottom:2mm}.combo svg{width:18mm;height:18mm}
.pals{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.pal{border:1px solid #ebe4d6;border-radius:3mm;padding:3mm;break-inside:avoid}
.pal.amei{border-color:#007D68;border-width:1.4px}
.bar{display:flex;height:11mm;border-radius:2mm;overflow:hidden;margin-bottom:2mm}
.hex{font-size:7pt;color:#8a8273;margin-top:1mm}
.mp{display:flex;gap:3mm;margin-bottom:2mm}.mp div{text-align:center}.mp span{display:block;width:16mm;height:16mm;border-radius:2.5mm;border:1px solid rgba(0,0,0,.1)}.mp small{font-size:7pt;color:#6b655c}
.fnts{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.fnt{border:1px solid #ebe4d6;border-radius:3mm;padding:4mm;break-inside:avoid}.fnt.amei{border-color:#007D68;border-width:1.4px}
.fnt .nm{font-size:24pt;line-height:1.05;margin-bottom:2mm}
.aa{font-size:26pt;line-height:1.1}
.ups{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}
.ups img{width:100%;max-height:60mm;object-fit:contain;border-radius:2mm;border:1px solid #ebe4d6;background:#faf7f1}
.doc{height:30mm;display:flex;align-items:center;justify-content:center;border:1px dashed #cdbd9e;border-radius:2mm;font-weight:700;color:#8a8273}
a{color:#007D68;word-break:break-all}.mut{color:#6b655c}
.vazio{color:#a49d90;font-style:italic;font-size:9pt}
.falta{margin-top:3mm;font-size:8pt;color:#a07a2c;background:#fbf4e4;border-radius:2mm;padding:2mm 3mm}
</style></head><body>
<div class="capa">
  <div class="marca"><img src="${raiz}img/rama.svg"><i></i><div><b>Matheus Saboia</b><small>Design &amp; criativos</small></div></div>
  <p class="kick">Questionário de marca · Clínica de psicologia</p>
  <h1>${esc(nome || 'Clínica do Vinicius')}<em>respostas</em></h1>
  <p class="meta">Respondido por ${esc(d.quem || 'Vinicius')}${d.zap ? ` · ${esc(d.zap)}` : ''}<br>Enviado em ${esc(data)}</p>
  ${destaque.length ? `<div class="dest">${destaque.map(([t, a]) => `<div><p>${esc(t)}</p>${chips(a)}</div>`).join('')}</div>` : ''}
  <footer><span>Rama · Matheus Saboia</span><span>Identidade visual completa</span></footer>
</div>
${secoes}
</body></html>`;
}

/* procura envios sem PDF */
const base = path.join(RAIZ, 'respostas');
const feitos = [];
if (fs.existsSync(base)) {
  for (const p of fs.readdirSync(base)) {
    if (p.startsWith('_')) continue;
    const dir = path.join(base, p); const arq = path.join(dir, 'respostas.json');
    if (!fs.existsSync(arq) || fs.readdirSync(dir).some(f => f.endsWith('.pdf'))) continue;
    const d = JSON.parse(fs.readFileSync(arq, 'utf8'));
    const tmp = path.join(dir, '_pdf.html');
    fs.writeFileSync(tmp, html(d, `respostas/${p}`));
    const nomeArq = `Questionario - ${(d.v?.nome || 'Vinicius').trim().replace(/[\\/:*?"<>|]+/g, '').slice(0, 60) || 'Vinicius'} - ${p.slice(0, 10)}.pdf`;
    const saida = path.join(dir, nomeArq);
    execFileSync(chrome(), ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer', '--run-all-compositor-stages-before-draw', '--virtual-time-budget=15000', `--print-to-pdf=${saida}`, pathToFileURL(tmp).href], { stdio: 'ignore', timeout: 120000 });
    fs.unlinkSync(tmp);
    feitos.push(`respostas/${p}/${nomeArq}`);
    console.log('PDF:', feitos.at(-1));
  }
}
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `pdfs=${feitos.join('|')}\n`);
if (!feitos.length) console.log('Nenhum envio novo sem PDF.');
