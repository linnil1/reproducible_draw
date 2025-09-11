// CWA specific lib
import { json } from '@sveltejs/kit'
import type { KVNamespace } from '@cloudflare/workers-types'
import type { RequestEvent } from '@sveltejs/kit'
import { checkAndSaveToKv, saveToKv, type SavedData } from './utils'

interface CwaData extends SavedData {
    data: string // JSON but in string format
}

function isCwsDataSame(a: CwaData, b: CwaData): boolean {
    return a.data == b.data
}

async function getCwaRawData(key: string, method: string, elements: Record<string, string>) {
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

async function callCwaAndPushKv(
    key: string,
    kv: KVNamespace,
    name: string,
    method: string,
    elements: Record<string, string>
): Promise<CwaData> {
    try {
        console.log(new Date(), name, method)
        const weatherRaw = await getCwaRawData(key, method, elements) // Fetch raw weather data
        const obsTime = JSON.parse(weatherRaw).records.Station[0].ObsTime.DateTime
        const weatherData = {
            key: `${name}-${obsTime}`,
            query_time: [new Date().toISOString()],
            status: 'ok',
            data: weatherRaw
        }
        const dataNew = await checkAndSaveToKv(kv, weatherData, isCwsDataSame)
        dataNew.data = ''
        console.log(JSON.stringify(dataNew))
        return dataNew
    } catch (e) {
        const errorMessage = e instanceof Error ? e.toString() : String(e)
        console.log(errorMessage)
        return {
            key: `${name}-`,
            query_time: [new Date().toISOString()],
            status: 'error',
            data: errorMessage
        }
    }
}

async function updateCwaData(env: App.Platform['env'], name: string): Promise<CwaData> {
    if (name == 'weather3')
        return await callCwaAndPushKv(env.CWA_KEY, env.data_draw, 'weather3', 'O-A0003-001', {
            WeatherElement:
                'Weather,VisibilityDescription,SunshineDuration,Now,WindDirection,WindSpeed,AirTemperature,RelativeHumidity,AirPressure,UVIndex,Max10MinAverage,GustInfo,DailyHigh,DailyLow'
        })
    else if (name == 'rain2')
        return await callCwaAndPushKv(env.CWA_KEY, env.data_draw, 'rain2', 'O-A0002-001', {
            RainfallElement:
                'Now,Past10Min,Past1hr,Past3hr,Past6hr,Past12hr,Past24hr,Past2days,Past3days'
        })
    else if (name == 'weather1')
        // 'Weather,Now,WindDirection,WindSpeed,AirTemperature,RelativeHumidity,AirPressure,GustInfo,DailyHigh,DailyLow'
        // Weather is changed even ObsTime is fixed
        return await callCwaAndPushKv(env.CWA_KEY, env.data_draw, 'weather1', 'O-A0001-001', {
            WeatherElement:
                'Now,WindDirection,WindSpeed,AirTemperature,RelativeHumidity,AirPressure,GustInfo,DailyHigh,DailyLow'
        })
    return {
        key: `${name}-`,
        query_time: [new Date().toISOString()],
        status: 'results.errorNotFoundName',
        data: ''
    }
}

export function createCwaEndpoint(name: string) {
    return {
        GET: async function GET({ platform, url }: RequestEvent): Promise<Response> {
            const datetime = url.searchParams.get('datetime')
            const key = `${name}-${datetime}`
            const data: CwaData | null = await platform!.env.data_draw.get(key, {
                type: 'json'
            })
            if (data == null) {
                return json({ status: 'results.fetch.keyNotFound' })
            }
            return json(data)
        },
        POST: async function POST({ platform, request }: RequestEvent): Promise<Response> {
            // In Svelte, cron trigger is much harder to achieve
            // So i use expose this method with key protection
            const { key } = await request.json()
            if (key !== platform!.env.CWA_KEY) {
                return json({ status: 'error' })
            }
            return json(await updateCwaData(platform!.env, name))
        }
    }
}
