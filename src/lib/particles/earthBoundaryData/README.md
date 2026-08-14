# Earth boundary bake

Offline particle assets for formation `earth-india`.

## Sources
- **World (+ neighbor alignment):** Natural Earth 10m Admin-0 Countries, **India POV**
  (`ne_10m_admin_0_countries_ind.geojson`)
- **India outline:** DataMeet `india-composite.geojson` — Survey of India–style official
  land area including disputed territories (J&K / Aksai Chin / northeast claim extent)

Sri Lanka remains a separate country ring from Natural Earth (not merged into India).

## Regenerate
```bash
# Download sources into scripts/earth-raw/ (see scripts/bake-earth.cjs header), then:
npm run bake:earth
```

## Layers (aLayer)
| id | meaning |
|----|---------|
| 0 | base globe shell |
| 1 | world country borders |
| 2 | Sri Lanka |
| 3 | India (cyan highlight) |
