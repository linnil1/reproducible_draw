import { createCwaEndpoint } from '$lib/server/data_cwa'

const weather1 = createCwaEndpoint('weather1', 'O-A0001-001', {
    WeatherElement:
        'Weather,Now,WindDirection,WindSpeed,AirTemperature,RelativeHumidity,AirPressure,GustInfo,DailyHigh,DailyLow'
})

export async function GET({ platform, url }) {
    return weather1['GET']({ platform, url })
}

export async function POST({ platform, request }) {
    return weather1['POST']({ platform, request })
}
