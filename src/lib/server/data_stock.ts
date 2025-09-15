import type { KVNamespace } from '@cloudflare/workers-types'
import { checkAndSaveToKv, type SavedData } from './utils'

export interface StockData extends SavedData {
    IndexValue_5s: string
    TradeVolume_5s: string
}

function isStockDataSame(a: StockData, b: StockData): boolean {
    return a.IndexValue_5s == b.IndexValue_5s && a.TradeVolume_5s == b.TradeVolume_5s
}

// Date to YYYYMMDD
export function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2) // Months are zero-based
    const day = `0${date.getDate()}`.slice(-2)
    return `${year}${month}${day}`
}

async function fetchTradeVolume(time: string): Promise<string> {
    const timestamp = Date.now() // To prevent caching
    const url = 'https://www.twse.com.tw/rwd/zh/afterTrading/MI_5MINS'
    const body = `response=json&date=${time}&_=${timestamp}`

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
    const url = `https://www.twse.com.tw/rwd/zh/TAIEX/MI_5MINS_INDEX?response=json&date=${time}&_=${timestamp}`
    console.log(url)

    const response = await fetch(url, {
        method: 'GET'
    })

    if (!response.ok) {
        throw new Error(`Error fetching MI_5MINS_INDEX: ${response.status} ${response.statusText}`)
    }

    return response.text()
}

export async function fetchAndSaveStock(
    kv: KVNamespace,
    name: string,
    fetchDate?: Date
): Promise<StockData | null> {
    const now = fetchDate || new Date()
    const time = formatDate(now)
    const key = `${name}-${time}`
    try {
        // Fetch both datasets in parallel
        const [indexRaw, volumeRaw] = await Promise.all([
            fetchIndexValue(time),
            fetchTradeVolume(time)
        ])

        const data: StockData = {
            key: key,
            query_time: [now.toISOString()],
            status: 'ok',
            IndexValue_5s: indexRaw,
            TradeVolume_5s: volumeRaw
        }
        const dataNew = await checkAndSaveToKv(kv, data, isStockDataSame)
        console.log(`Saved ${key}`)
        return dataNew
    } catch (error) {
        console.error(`Fail ${key}: ${(error as Error).message}`)
        return null
    }
}
