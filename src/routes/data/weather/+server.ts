import { json } from '@sveltejs/kit'

const data = [
    {
        Weather: '\u591a\u96f2',
        Precipitation: 0.0,
        WindDirection: 20.0,
        WindSpeed: 4.8,
        AirTemperature: 22.3,
        RelativeHumidity: 79,
        AirPressure: -99.0,
        GustInfo: 9.4,
        DailyHigh: 22.4,
        DailyLow: 22.3,
        StationId: 'CAN120',
        StationName: '\u897f\u6ff1N304K',
        ObsTime: '2024-11-06T00:20:00+08:00',
        lat: 23.10344,
        lon: 120.08669,
        VisibilityDescription: '>30',
        SunshineDuration: -99.0,
        UVIndex: -99.0
    }
]

export async function GET({ platform, url }) {
    // debug1
    // return json(data)
    // debug2
    const datetime = url.searchParams.get('datetime')
    const resp = await fetch('http://localhost:5001/weather')
    return json(await resp.json())
    // prod
    // const data = await platform.env.data_trashcar.get('data', { type: 'json', cacheTtl: 86400 })
    // const lat = parseFloat(url.searchParams.get('lat'))
    // const lng = parseFloat(url.searchParams.get('lng'))
    // const new_data = data.filter((car) => isInTile(car, lat, lng))
    // return json(new_data)
}
