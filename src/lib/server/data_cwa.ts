// CWA specific lib
import { json } from '@sveltejs/kit'
import type { KVNamespace } from '@cloudflare/workers-types'

type Data = {
    key: string
    query_time: string[] // list of isoformat (str)
    status: string
    data: string // JSON but in string format
}

const SavedTTL = 86400 * 32

async function addDataToKv(weatherData: Data, kv: KVNamespace): Promise<Data> {
    let prevData: Data | null = await kv.get(weatherData.key, { type: 'json' })
    if (prevData === null) {
        await kv.put(weatherData.key, JSON.stringify(weatherData), {
            expirationTtl: SavedTTL
        })
        return weatherData
    }

    if (prevData.data !== weatherData.data) {
        prevData.status = 'results.fetch.dataChanged'
    }
    prevData.query_time.push(weatherData.query_time[0])
    await kv.put(weatherData.key, JSON.stringify(prevData), {
        expirationTtl: SavedTTL
    })
    return prevData
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

async function callCwaAndPushKv(
    key: string,
    kv: KVNamespace,
    name: string,
    method: string,
    elements
): Promise<Data> {
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
        const modifiedData = await addDataToKv(weatherData, kv)
        modifiedData.data = ''
        console.log(JSON.stringify(modifiedData))
        return modifiedData
    } catch (e) {
        console.log(e.toString())
        return {
            key: `${name}-`,
            query_time: [new Date().toISOString()],
            status: 'error',
            data: e.toString()
        }
    }
}

async function updateCwaData(env, name: string): Promise<Data> {
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
            return json(await updateCwaData(platform.env, name))
        }
    }
}
