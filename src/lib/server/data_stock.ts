import type { KVNamespace } from '@cloudflare/workers-types'

export interface RawData {
    IndexValue_5s: string
    TradeVolume_5s: string
    FetchTime: string
}
const SavedTTL = 86400 * 32

// Date to YYYYMMDD
export function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2) // Months are zero-based
    const day = `0${date.getDate()}`.slice(-2)
    return `${year}${month}${day}`
}

async function fetchTradeVolume(time: string): Promise<string> {
    const url = 'https://www.twse.com.tw/pcversion/zh/exchangeReport/MI_5MINS'
    const body = `response=json&date=${time}`

    const response = await fetch(url, {
        method: 'POST',
        body: body
    })

    if (!response.ok) {
        throw new Error(`Error fetching MI_5MINS: ${response.status} ${response.statusText}`)
    }
    return response.text()
}

async function fetchIndexValue(time: string): Promise<string> {
    const timestamp = Date.now() // To prevent caching
    const url = `https://www.twse.com.tw/pcversion/zh/exchangeReport/MI_5MINS_INDEX?response=json&date=${time}&_=${timestamp}`

    const response = await fetch(url, {
        method: 'GET'
    })

    if (!response.ok) {
        throw new Error(`Error fetching MI_5MINS_INDEX: ${response.status} ${response.statusText}`)
    }

    return response.text()
}

export async function fetchAndSaveStock(kv: KVNamespace, name: string): Promise<RawData> {
    try {
        // Fetch both datasets in parallel
        const now = new Date('2024-12-06 12:00:00')
        const time = formatDate(now)
        const [indexRaw, volumeRaw] = await Promise.all([
            fetchIndexValue(time),
            fetchTradeVolume(time)
        ])

        const rawData: RawData = {
            IndexValue_5s: indexRaw,
            TradeVolume_5s: volumeRaw,
            FetchTime: now.toISOString()
        }

        await kv.put(`${name}-${time}`, JSON.stringify(rawData), {
            expirationTtl: SavedTTL
        })
        return rawData
    } catch (error) {
        console.error(`Error in fetchAndSaveData: ${(error as Error).message}`)
        return null
    }
}
