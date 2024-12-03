// CWA specific lib
import type { Data } from '$lib/server/data_to_kv.js'
import { addDataToKv } from '$lib/server/data_to_kv'
import { json } from '@sveltejs/kit'

export function createCwaEndpoint(name: string, method: string, elements) {
    return {
        GET: async function GET({ platform, url }) {
            const datetime = url.searchParams.get('datetime')
            const key = `${name}-${datetime}`
            const data: Data | null = await platform.env.data_draw.get(key, {
                type: 'json'
            })
            if (data == null) {
                return json({ status: 'results.fetch.keyNotFound' })
            }
            return json(data)
        },
        POST: async function POST({ platform, request }) {
            // In Svelte, cron trigger is much harder to achieve
            // So i use expose this method with key protection
            const { key } = await request.json()
            if (key !== platform.env.CWA_KEY) {
                return json({ status: 'error' })
            }
            // Becuase using cloudflare trigger is hard to debug for svelte
            const weatherRaw = await getCwaRawData(platform.env.CWA_KEY, method, elements) // Fetch raw weather data
            const obsTime = JSON.parse(weatherRaw).records.Station[0].ObsTime.DateTime
            const weatherData = {
                key: `${name}-${obsTime}`,
                query_time: [new Date().toISOString()],
                status: 'ok',
                data: weatherRaw
            }
            const modifiedData = await addDataToKv(weatherData, platform.env.data_draw)
            modifiedData.data = ''
            return json(modifiedData)
        }
    }
}

async function getCwaRawData(key: string, method: string, elements) {
    const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/' + method
    const params = new URLSearchParams({
        Authorization: key,
        format: 'JSON',
        ...elements,
        GeoInfo: 'Coordinates'
    })
    const response = await fetch(`${url}?${params.toString()}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.text()
}
