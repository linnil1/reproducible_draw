import { createCwaEndpoint } from '$lib/server/data_cwa'

const weather1 = createCwaEndpoint('weather1')

export async function GET({ platform, url }) {
    return weather1['GET']({ platform, url })
}

export async function POST({ platform, request }) {
    return weather1['POST']({ platform, request })
}
