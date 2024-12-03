import { createCwaEndpoint } from '$lib/server/data_cwa'

const rain2 = createCwaEndpoint('rain2')

export async function GET({ platform, url }) {
    return rain2['GET']({ platform, url })
}

export async function POST({ platform, request }) {
    return rain2['POST']({ platform, request })
}
