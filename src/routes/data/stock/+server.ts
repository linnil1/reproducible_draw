import { fetchAndSaveStock, type StockData } from '$lib/server/data_stock'
import { json } from '@sveltejs/kit'
const name = 'stock'

export async function GET({ platform, url }) {
    const datetime: string = url.searchParams.get('datetime')
    const key = `${name}-${datetime}`
    const data: StockData | null = await platform.env.data_draw.get(key, {
        type: 'json'
    })
    if (data == null) {
        return json({ status: 'results.fetch.keyNotFound' })
    }
    return json({
        status: 'ok',
        ...data
    })
}

export async function POST({ platform, request }) {
    // protection
    const { key } = await request.json()
    if (key !== platform.env.CWA_KEY) {
        return json({ status: 'error' })
    }
    return json(await fetchAndSaveStock(platform.env.data_draw, name))
}
