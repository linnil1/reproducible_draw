import { createCwaEndpoint } from '$lib/server/data_cwa'
import type { RequestEvent } from '@sveltejs/kit'

const weather3 = createCwaEndpoint('weather3')

export async function GET(event: RequestEvent): Promise<Response> {
    return weather3['GET'](event)
}

export async function POST(event: RequestEvent): Promise<Response> {
    return weather3['POST'](event)
}
