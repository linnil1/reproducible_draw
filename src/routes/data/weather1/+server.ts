import { createCwaEndpoint } from '$lib/server/data_cwa'
import type { RequestEvent } from '@sveltejs/kit'

const weather1 = createCwaEndpoint('weather1')

export async function GET(event: RequestEvent): Promise<Response> {
    return weather1['GET'](event)
}

export async function POST(event: RequestEvent): Promise<Response> {
    return weather1['POST'](event)
}
