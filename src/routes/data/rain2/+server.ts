import { createCwaEndpoint } from '$lib/server/data_cwa'
import type { RequestEvent } from '@sveltejs/kit'

const rain2 = createCwaEndpoint('rain2')

export async function GET(event: RequestEvent): Promise<Response> {
    return rain2['GET'](event)
}

export async function POST(event: RequestEvent): Promise<Response> {
    return rain2['POST'](event)
}
