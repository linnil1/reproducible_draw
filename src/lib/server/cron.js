// In svelte, it is hard to use Cloudflare Trigger
// https://github.com/sveltejs/kit/issues/4841
entry_default.scheduled = async (event, env, ctx) => {
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
    }
}

async function fetch10Min(env) {
    await updateCwaData(env, 'weather3')
    await updateCwaData(env, 'rain2')
}

async function fetch1Hour(env) {
    await updateCwaData(env, 'weather1')
}
