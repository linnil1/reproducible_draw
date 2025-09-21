import { fetchAndSaveStock, parseDate, type StockData } from '$lib/server/data_stock'
import { validateKeyFromRequest } from '$lib/server/utils'
import { json } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'

const name = 'stock'

export async function GET({ platform, url }: RequestEvent): Promise<Response> {
    const datetime: string | null = url.searchParams.get('datetime')
    const key = `${name}-${datetime}`
    const data: StockData | null = await platform!.env.data_draw.get(key, {
        type: 'json'
    })
    if (data == null) {
        return json({ status: 'results.fetch.keyNotFound' })
    }
    return json(data)
}

export async function POST({ platform, request, url }: RequestEvent): Promise<Response> {
    await validateKeyFromRequest(platform!, request)

    const datetimeStr = url.searchParams.get('datetime')
    const fetchDate = datetimeStr ? parseDate(datetimeStr) : null
    if (fetchDate == null) {
        return json(await fetchAndSaveStock(platform!.env.data_draw, name))
    } else {
        return json(await fetchAndSaveStock(platform!.env.data_draw, name, fetchDate))
    }
}
