import type { KVNamespace } from '@cloudflare/workers-types'

const SavedTTL = 86400 * 32

export type SavedData = {
    key: string
    query_time: string[] // list of isoformat (str)
    status: string
}

export async function saveToKv(kv: KVNamespace, data: SavedData) {
    await kv.put(data.key, JSON.stringify(data), {
        expirationTtl: SavedTTL
    })
}

export async function checkAndSaveToKv<T extends SavedData>(
    kv: KVNamespace,
    data: T,
    isDataSame: (prevData: T, newData: T) => boolean
): Promise<T> {
    const prevData: T | null = await kv.get(data.key, { type: 'json' })
    if (prevData === null) {
        // New data, do nothing
    } else if (!isDataSame(prevData, data)) {
        // Different from previous, change status
        data.query_time = prevData.query_time.concat(data.query_time)
        data.status = 'results.fetch.dataChanged'
    } else {
        // Same as previous
        data.query_time = prevData.query_time.concat(data.query_time)
    }
    await saveToKv(kv, data)
    return data
}
