import type { KVNamespace } from '@cloudflare/workers-types'
import { saveToKv } from './utils'

export interface StockData {
    IndexValue_5s: string
    TradeVolume_5s: string
    FetchTime: string
}

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

export async function fetchAndSaveStock(kv: KVNamespace, name: string): Promise<StockData | null> {
    const now = new Date()
    const time = formatDate(now)
    const key = `${name}-${time}`
    try {
        // Fetch both datasets in parallel
        const [indexRaw, volumeRaw] = await Promise.all([
            fetchIndexValue(time),
            fetchTradeVolume(time)
        ])

        const data: StockData = {
            IndexValue_5s: indexRaw,
            TradeVolume_5s: volumeRaw,
            FetchTime: now.toISOString()
        }
        await saveToKv(kv, key, data)
        console.log(`Saved ${key}`)
        return data
    } catch (error) {
        console.error(`Fail ${key}: ${(error as Error).message}`)
        return null
    }
}
