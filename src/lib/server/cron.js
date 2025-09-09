// In svelte, it is hard to use Cloudflare Trigger
// https://github.com/sveltejs/kit/issues/4841
worker_default.scheduled = async (event, env, ctx) => {
    ctx.waitUntil(cron(event, env))
}

// Cron logic
async function cron(event, env) {
    switch (event.cron) {
        case '*/3 * * * *':
            await fetch10Min(env)
            break
        case '*/20 * * * *':
            await fetch1Hour(env)
            break
        case '*/10 6 * * *': // 14:00 in Taiwan
            await fetchStock(env)
            break
    }
}

async function fetch10Min(env) {
    await updateCwaData(env, 'weather3')
    await updateCwaData(env, 'rain2')
}

async function fetch1Hour(env) {
    await updateCwaData(env, 'weather1')
}

async function fetchStock(env) {
    await fetchAndSaveStock(env.data_draw, 'stock')
}
