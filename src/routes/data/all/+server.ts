import { fetchAndSaveStock } from '$lib/server/data_stock'
import { updateCwaData } from '$lib/server/data_cwa'
import { validateKeyFromRequest } from '$lib/server/utils'
import { json } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'

export async function POST({ platform, request }: RequestEvent): Promise<Response> {
    await validateKeyFromRequest(platform!, request)

    // Fetch and save all CWA and stock data at once
    const results: Record<string, any> = {}
    try {
        results.weather1 = await updateCwaData(platform!.env, 'weather1')
    } catch (error) {
        results.weather1 = { error: (error as Error).message }
    }
    try {
        results.weather3 = await updateCwaData(platform!.env, 'weather3')
    } catch (error) {
        results.weather3 = { error: (error as Error).message }
    }
    try {
        results.rain2 = await updateCwaData(platform!.env, 'rain2')
    } catch (error) {
        results.rain2 = { error: (error as Error).message }
    }
    try {
        results.stock = await fetchAndSaveStock(platform!.env.data_draw, 'stock')
    } catch (error) {
        results.stock = { error: (error as Error).message }
    }
    return json(results)
}
