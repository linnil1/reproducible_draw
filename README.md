# Reproducible Draw

## Init

```bash
npm install
npx wrangler kv namespace create data_draw
npx wrangler kv key put --binding data_draw weather1 --path example_weather1.json --local
npx wrangler kv key put --binding data_draw weather3 --path example_weather3.json --local
npx wrangler kv key put --binding data_draw rain2    --path example_rain2.json    --local
npx wrangler kv key put --binding data_draw stock    --path example_stock.json    --local
# Add these in your .dev.vars
# CWA_KEY = "xxx"
npx wrangler secret put CWA_KEY
```

## Developing

```bash
npm run dev
```

## Building

```bash
npm run deploy
```

or (Svelte did not support cron trigger)

```bash
npm run build
cat src/lib/server/cron.js >> .svelte-kit/cloudflare/_worker.js
npx wrangler deploy
```
