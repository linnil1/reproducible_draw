# Reproducible Draw

## Init

```bash
yarn
npx wrangler kv namespace create data_draw
npx wrangler kv key put --binding data_draw weather1 --path example_weather1.json --local
npx wrangler kv key put --binding data_draw weather3 --path example_weather3.json --local
npx wrangler kv key put --binding data_draw rain     --path example_rain.json     --local
# Add these in your .dev.vars
# CWA_KEY = "xxx"
```

## Developing

```bash
yarn run dev
```

## Building

```bash
yarn run build
```
