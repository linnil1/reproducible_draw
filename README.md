# Reproducible Draw

## Init

```bash
yarn
npx wrangler kv namespace create data_draw
npx wrangler kv key put --binding data_draw weather1 --path example_weather1.json --local
npx wrangler kv key put --binding data_draw weather3 --path example_weather3.json --local
npx wrangler kv key put --binding data_draw rain     --path example_rain.json     --local
npx wrangler kv key put --binding data_draw stock    --path example_stock.json    --local
# Add these in your .dev.vars
# CWA_KEY = "xxx"
npx wrangler secret put CWA_KEY
```

## Developing

```bash
yarn run dev
```

## Building

```bash
yarn deploy
```

or (Svelte did not support cron trigger)

```bash
yarn build
cat src/lib/server/cron.js >> .cloudflare/worker.js
npx wrangler deploy
```
