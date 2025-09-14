import { getCwaData, updateCwaData } from '$lib/server/data_cwa'
import { validateKeyFromRequest } from '$lib/server/utils'
import { json } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'

const name = 'weather3'

export async function GET(event: RequestEvent): Promise<Response> {
    return getCwaData(event, name)
}

export async function POST({ platform, request }: RequestEvent): Promise<Response> {
    await validateKeyFromRequest(platform!, request)
    return json(await updateCwaData(platform!.env, name))
}
