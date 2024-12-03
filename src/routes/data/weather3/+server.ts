import type { Data } from '$lib/server/data_to_kv.js'
import { addDataToKv } from '$lib/server/data_to_kv'
import { json } from '@sveltejs/kit'

export async function GET({ platform, url }) {
    const datetime = url.searchParams.get('datetime')
    const data: Data | null = await platform.env.data_draw.get(`weather3-${datetime}`, {
        type: 'json'
    })
    if (data == null) {
        return json({ status: 'results.fetch.keyNotFound' })
    }
    return json(data)
}

export async function POST({ platform, request }) {
    // In Svelte, cron trigger is much harder to achieve
    // So i use expose this method with key protection
    const { key } = await request.json()
    if (key !== platform.env.CWA_KEY) {
        return json({ status: 'error' })
    }
    // Becuase using cloudflare trigger is hard to debug for svelte
    const weatherRaw = await getWeather3Raw(platform.env.CWA_KEY) // Fetch raw weather data
    const obsTime = JSON.parse(weatherRaw).records.Station[0].ObsTime.DateTime
    const weatherData = {
        key: `weather3-${obsTime}`,
        query_time: [new Date().toISOString()],
        status: 'ok',
        data: weatherRaw
    }
    await addDataToKv(weatherData, platform.env.data_draw)
    return json({ status: 'ok' })
}

async function getWeather3Raw(key: string) {
    const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001'
    const params = new URLSearchParams({
        Authorization: key,
        format: 'JSON',
        WeatherElement:
            'Weather,VisibilityDescription,SunshineDuration,Now,WindDirection,WindSpeed,AirTemperature,RelativeHumidity,AirPressure,UVIndex,Max10MinAverage,GustInfo,DailyHigh,DailyLow',
        GeoInfo: 'Coordinates'
    })
    const response = await fetch(`${url}?${params.toString()}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.text()
}
