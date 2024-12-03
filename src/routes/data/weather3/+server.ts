import { createCwaEndpoint } from '$lib/server/data_cwa.js'

const weather3 = createCwaEndpoint('weather3')

export async function GET({ platform, url }) {
    return weather3['GET']({ platform, url })
}

export async function POST({ platform, request }) {
    return weather3['POST']({ platform, request })
}
