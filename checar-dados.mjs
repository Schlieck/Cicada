// Confere a consistência de site/dados.json. Uso: node checar-dados.mjs
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const dir = new URL('./site/', import.meta.url);
const D = JSON.parse(readFileSync(new URL('dados.json', dir), 'utf8'));
const ids = new Set(D.obras.map(o => o.id));
const REG = ['Américas', 'Europa', 'África', 'Oriente Médio', 'Ásia', 'Global'];

assert.equal(ids.size, D.obras.length, 'id de obra repetido');
for (const o of D.obras) {
  assert.ok(D.tradicoes[o.g], `tradição desconhecida em ${o.id}`);
  assert.ok([1, 2, 3].includes(o.r), `peso inválido em ${o.id}`);
}
for (const [s, t, k] of D.ligacoes) assert.ok(ids.has(s) && ids.has(t) && 'dc'.includes(k), `ligação inválida ${s} → ${t}`);

const naTrilha = D.etapas.flatMap(e => e.ids);
for (const id of naTrilha) assert.ok(ids.has(id), `etapa cita obra inexistente: ${id}`);
assert.equal(new Set(naTrilha).size, naTrilha.length, 'obra repetida na trilha');
assert.deepEqual(D.obras.filter(o => !naTrilha.includes(o.id)).map(o => o.id), [], 'obra fora da trilha');
for (const e of D.etapas) assert.ok(!e.tip || e.tip.includes(':'), `etapa "${e.t}": tip sem ":"`);

// ids que index.html usa direto; se faltarem, a página inteira quebra
const html = readFileSync(new URL('index.html', dir), 'utf8');
const start = html.match(/const start=\[([^\]]*)\]/)?.[1], perInicial = html.match(/curPer='([^']+)'/)?.[1];
assert.ok(start && perInicial, 'index.html mudou: atualize a busca de "const start" e "curPer" em checar-dados.mjs');
for (const id of start.match(/[^'",\s]+/g)) assert.ok(ids.has(id), `index.html ("Para começar") cita obra inexistente: ${id}`);
assert.ok(D.periodos.some(p => p.id === perInicial), `index.html: período inicial "${perInicial}" inexistente`);

for (const p of D.periodos) {
  const arq = new URL(`mapas/${p.mapa}.json`, dir);
  assert.ok(existsSync(arq), `mapa ausente: ${p.mapa}`);
  const nomes = new Set(JSON.parse(readFileSync(arq, 'utf8')).features.map(f => f.properties.NAME));
  for (const [nome, m] of Object.entries(p.excecoes)) {
    assert.ok(nomes.has(nome), `${p.id}: "${nome}" não existe no mapa ${p.mapa}`);
    assert.ok(D.modelos[m], `${p.id}: modelo desconhecido ${m}`);
  }
  for (const m of Object.values(p.modelo)) assert.ok(D.modelos[m], `${p.id}: modelo desconhecido ${m}`);
  for (const e of p.ev) {
    assert.ok(D.tipos[e.t] && REG.includes(e.r), `${p.id}: tipo ou região inválidos em "${e.n}"`);
    assert.ok(Math.abs(e.c[0]) <= 180 && Math.abs(e.c[1]) <= 90, `${p.id}: coordenada inválida em "${e.n}"`);
    for (const id of e.o) assert.ok(ids.has(id), `${p.id}: "${e.n}" cita obra inexistente ${id}`);
  }
}
console.log(`ok: ${D.obras.length} obras, ${D.ligacoes.length} ligações, ${D.periodos.length} períodos, ${D.periodos.reduce((n, p) => n + p.ev.length, 0)} eventos`);
