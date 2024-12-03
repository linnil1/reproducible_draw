import { createCwaEndpoint } from '$lib/server/data_cwa.js'

const weather3 = createCwaEndpoint('weather3', 'O-A0003-001', {
    WeatherElement:
        'Weather,VisibilityDescription,SunshineDuration,Now,WindDirection,WindSpeed,AirTemperature,RelativeHumidity,AirPressure,UVIndex,Max10MinAverage,GustInfo,DailyHigh,DailyLow'
})
export async function GET({ platform, url }) {
    return weather3['GET']({ platform, url })
}

export async function POST({ platform, request }) {
    return weather3['POST']({ platform, request })
}
