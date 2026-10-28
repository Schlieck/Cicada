# Atlas do Pensamento Político

Site de estudos de teoria política com três abas que se ligam entre si:

- **Constelação** (`#constelacao`): grafo de 106 obras, no estilo Connected Papers. O tamanho do nó é o peso da obra; a cor é a tradição; a seta indica se uma obra continua ou critica outra. Tem os modos "Afinidade" e "Linha do tempo", filtros por tradição, a opção "Só economia" e uma busca.
- **Atlas** (`#atlas`): mapa-múndi histórico, plano ou em globo, com 10 períodos. Cada período usa as fronteiras da época e mostra eventos marcados por tipo. Uma camada opcional pinta as regiões pelo modelo econômico, e há um filtro por tradição.
- **Trilha** (`#trilha`): trilha de leitura em 11 etapas, no estilo roadmap.sh, mais uma seção de ferramentas. Cada obra abre um painel com "marcar como lida". O progresso fica só no navegador de quem lê (`localStorage`, chave `atlas-politico-lidas`).

Uma obra mostra os eventos do atlas em que aparece, um evento lista as obras ligadas a ele, e a trilha abre a obra na constelação.

## Rodar localmente

O site é estático e não tem build. Como `index.html` carrega `dados.json` e os mapas com `fetch`, ele precisa de um servidor HTTP; abrir o arquivo direto do disco não funciona.

```bash
npx -y http-server@14.1.1 site -p 5174 -c-1
```

Depois abra http://localhost:5174. Qualquer servidor estático serve, por exemplo `python -m http.server -d site 5174`.

As bibliotecas vêm por CDN: d3 7.8.5 e maplibre-gl 5.20.2 (cdnjs), e as fontes Bodoni Moda, Public Sans e IBM Plex Mono (Google Fonts).

## Estrutura

```
site/index.html      página única: HTML, CSS e JS
site/dados.json      todos os dados
site/mapas/*.json    10 GeoJSON simplificados (GPL-3.0, veja site/mapas/LEIA-ME.md)
checar-dados.mjs     validador dos dados
docs/pesquisa.html   relatório da pesquisa original (78 obras, anterior aos eixos de nacionalismo, fascismo, ecologismo e populismo)
```

As cores ficam em variáveis CSS no `:root` de `index.html`, com versão para modo escuro: `--g-*` são as tradições, `--t-*` os tipos de evento e `--m-*` os modelos econômicos.

## Editar os dados

Tudo o que aparece no site está em `site/dados.json`. Depois de qualquer mudança, rode:

```bash
node checar-dados.mjs
```

A saída esperada é `ok: 106 obras, 140 ligações, 10 períodos, 75 eventos` (com os números atualizados). Se algo estiver errado, o script para e diz o quê.

Formato:

- `inicio`: `{obras: [ids], periodo}` — as obras de "Para começar" na constelação e o período que o atlas abre.
- `tradicoes`: as 12 tradições (`est`, `lib`, `con`, `nac`, `fas`, `soc`, `eco`, `fem`, `sul`, `bra`, `pop`, `dem`). A ordem importa: é a ordem dos grupos em círculo no grafo e das faixas na linha do tempo. Uma tradição nova precisa de uma cor `--g-<id>` nos dois temas de `index.html`.
- `pesos`: 3 = Fundadora, 2 = Importante, 1 = Aprofundamento. É uma nota editorial.
- `tipos`: tipos de evento (`rev`, `ind`, `reg`, `ins`, `eco`, `gue`), cada um com uma cor `--t-<id>`.
- `modelos`: os 12 modelos econômicos, cada um com uma cor `--m-<id>`.
- `obras`: `{id, t, a, ano, g, r, e, n}` — título, autor, ano (negativo é a.C.), tradição, peso, `e: 1` se for de economia, e uma nota curta. O campo do ano se chama `ano`, e não `y`, porque o d3 escreve `x` e `y` nos nós.
- `ligacoes`: `[origem, destino, 'd' | 'c']`, onde `d` é "continua" e `c` é "critica".
- `etapas`: `{s, t, d, tip?, ref?, ids}`. Cada obra aparece em exatamente uma etapa. O `tip` precisa ter `:`, porque o texto antes dos dois-pontos vira o título em negrito.
- `periodos`: `{id, l, r, mapa, eco, modelo, excecoes, ev}`.
  - `modelo` dá o modelo econômico por região: Américas, Europa, África, Oriente Médio, Ásia ou Global.
  - `excecoes` dá o modelo por país, usando o `NAME` do GeoJSON.
  - `ev` são os eventos: `{a, n, r, t, o: [ids de obras], c: [lon, lat]}`.

Cuidados:

- Os textos entram no HTML sem escape. Não use `<` em nenhum texto nem aspas duplas `"` em títulos; use aspas tipográficas “ ”. O validador barra os dois.
- A região de cada país no mapa é estimada por caixas retangulares (`regiao()` em `index.html`). É uma aproximação; para precisão, o caminho é pôr a região nos dados.
- Os ids de evento são gerados pela posição (`<período>-<índice>`). Nada os salva hoje, mas inserir um evento muda os ids dos seguintes.
- Algumas ligações do grafo são escolhas editoriais e não consenso, por exemplo Fichte → *A Doutrina do Fascismo* e Brundtland → Krenak. Elas indicam uma linha de leitura, não uma influência comprovada.

## Fontes

Confirmadas:

- [Open Syllabus Galaxy](https://galaxy.opensyllabus.org/)
- Ementas de Yale (PLSC 114) e MIT (17.03)
- Weffort (org.), *Os Clássicos da Política*
- Stanford Encyclopedia of Philosophy, verbetes *Liberalism* e *Socialism*
- Andrew Heywood, *Political Ideologies*, 7ª ed., 2021 (capítulos de fascismo, ecologismo e populismo)
- Five Books, recomendações de Jonathan Wolff
- Ementas da Unicamp (HZ555), USP, UFRRJ (IH1515) e UECE
- [historical-basemaps](https://github.com/aourednik/historical-basemaps)
- Wikidata (Q10931)
- HSE Revolutions Dataset
- [OpenAlex](https://openalex.org/)

Ainda por conferir: o Atlas da FGV (falta a URL), Hobsbawm, o *Dicionário de Política* de Bobbio, marxists.org, OLL (Online Library of Liberty) e Domínio Público.

## Créditos dos mapas

As fronteiras vêm do [historical-basemaps](https://github.com/aourednik/historical-basemaps), de André Ourednik, sob licença GPL-3.0. Os arquivos em `site/mapas/` são versões simplificadas e seguem a mesma licença; a fonte, o comando de simplificação e o texto da licença estão em [`site/mapas/LEIA-ME.md`](site/mapas/LEIA-ME.md) e [`site/mapas/LICENSE`](site/mapas/LICENSE).

A licença do resto do repositório ainda não foi definida.

## Publicação

O site está preparado para a Vercel sem configuração: Framework Preset **Other**, Root Directory **`site`**, sem comando de build. Cada push em `main` publica de novo.
