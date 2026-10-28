# Mapas históricos

Os arquivos `*.json` desta pasta são versões modificadas do
[historical-basemaps](https://github.com/aourednik/historical-basemaps), de André Ourednik,
distribuído sob a licença **GPL-3.0**. Estes arquivos derivados seguem a mesma licença:
o texto completo está em [`LICENSE`](LICENSE).

- Arquivos originais: `geojson/world_<ano>.geojson` (anos bc400, 1200, 1530, 1650, 1783, 1815, 1880, 1938, 1960 e 2010).
- Modificação: só os campos `NAME`, `SUBJECTO` e `PARTOF` foram mantidos, e a geometria foi simplificada com:

```
npx mapshaper@0.6.102 world_<ano>.geojson -filter-fields NAME,SUBJECTO,PARTOF -simplify 6% keep-shapes -clean -o precision=0.01 site/mapas/<ano>.json
```

Este aviso trata só dos mapas desta pasta. A licença do resto do repositório ainda não foi definida.
