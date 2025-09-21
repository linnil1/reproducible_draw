# Reproducible Draw

## Init

### CWA_KEY

CWA_KEY is your Taiwan Central Weather Administration key (used to access weather data and protect the API).

### Setup

```bash
npm install
npx wrangler kv namespace create data_draw
# add to .dev.vars: CWA_KEY="xxx"
npx wrangler secret put CWA_KEY
```

### Data Init

1. Load example data (local):

```bash
npx wrangler kv key put --binding data_draw weather1 --path example_weather1.json --local
npx wrangler kv key put --binding data_draw weather3 --path example_weather3.json --local
npx wrangler kv key put --binding data_draw rain2    --path example_rain2.json    --local
npx wrangler kv key put --binding data_draw stock    --path example_stock.json    --local
```

2. Fetch/update via API (requires CWA key):

```bash
curl -X POST -i localhost:5173/data/all \
    -d '{"key":"YOUR_CWA_KEY"}' \
    -H "Content-Type: application/json"
```

Note: without a CWA key only the public stock data will update.

## Developing

```bash
npm run dev
```

For testing:

add `VITE_TEST_CWA_KEY="xxx"` to `.env`, then run
```bash
npm run test
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
