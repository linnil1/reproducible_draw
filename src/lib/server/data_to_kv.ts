import type { KVNamespace } from '@cloudflare/workers-types'

export type Data = {
    key: string
    query_time: string[] // list of isoformat (str)
    status: string
    data: string // JSON but in string format
}

export async function addDataToKv(weatherData: Data, kv: KVNamespace): Promise<void> {
    const prevData: Data | null = await kv.get(weatherData.key, { type: 'json' })
    if (prevData === null) {
        console.log(`Add Data:
    key: ${weatherData.key}
    query_time: ${weatherData.query_time}`)
        await kv.put(weatherData.key, JSON.stringify(weatherData), {
            expirationTtl: 86400 * 32
        })
        return
    }
    if (prevData.data !== weatherData.data) {
        prevData.status = 'results.fetch.dataChanged'
    }
    prevData.query_time.push(weatherData.query_time[0])
    await kv.put(weatherData.key, JSON.stringify(prevData), {
        expirationTtl: 86400 * 32
    })
    console.log(`Modify Data:
    key: ${weatherData.key}
    status: ${prevData.status}
    query_time: ${weatherData.query_time}`)
}
