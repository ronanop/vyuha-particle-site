# Vyuha logo particle bake

The Meshy `.glb` UV/texture atlas does **not** produce a clean silhouette.
Bake from the crisp brand mark PNG instead:

- `scripts/vyuha-raw/logo-ref-flat.png`

```bash
npm run bake:vyuha
```

Writes `src/lib/particles/vyuhaLogoData/{high,medium,low}.json`.
