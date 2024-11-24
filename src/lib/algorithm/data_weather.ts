import { CwaData } from './data_cwa'

export class Weather extends CwaData {
    getName(): string {
        return 'data_weather'
    }
    getPath(): string {
        return '/data/weather'
    }
    getKeys(): string[] {
        return [...this.getMetaKeys(), ...this.getWeatherKeys()]
    }

    private getWeatherKeys(): string[] {
        return [
            'Weather',
            'Precipitation',
            'WindDirection',
            'WindSpeed',
            'AirTemperature',
            'RelativeHumidity',
            'AirPressure',
            'GustInfo',
            'DailyHigh',
            'DailyLow',
            'VisibilityDescription',
            'SunshineDuration',
            'UVIndex'
        ]
    }

    fieldFormatter(key: string, value: any): string {
        const float6Keys = ['lat', 'lon']
        const float1Keys = [
            'Precipitation',
            'WindDirection',
            'WindSpeed',
            'AirTemperature',
            'RelativeHumidity',
            'AirPressure',
            'GustInfo',
            'DailyHigh',
            'DailyLow',
            'Precipitation'
        ]
        if (float6Keys.includes(key)) {
            return this.valueToString(value, 6)
        } else if (float1Keys.includes(key)) {
            return this.valueToString(value, 1)
        }
        return this.valueToString(value, -1)
    }

    parse(data) {
        const coords = data.GeoInfo.Coordinates.filter((coord) => coord.CoordinateName === 'WGS84')
        if (!coords.length) {
            throw new Error('WGS84 coordinates not found')
        }
        return {
            // Metadata
            StationId: data.StationId,
            StationName: data.StationName,
            ObsTime: data.ObsTime.DateTime,
            lat: coords[0].StationLatitude,
            lon: coords[0].StationLongitude,
            // Weather
            Weather: data.WeatherElement.Weather,
            Precipitation: data.WeatherElement.Now.Precipitation,
            WindDirection: data.WeatherElement.WindDirection,
            WindSpeed: data.WeatherElement.WindSpeed,
            AirTemperature: data.WeatherElement.AirTemperature,
            RelativeHumidity: data.WeatherElement.RelativeHumidity,
            AirPressure: data.WeatherElement.AirPressure,
            GustInfo: data.WeatherElement.GustInfo.PeakGustSpeed,
            DailyHigh: data.WeatherElement.DailyExtreme.DailyHigh.TemperatureInfo.AirTemperature,
            DailyLow: data.WeatherElement.DailyExtreme.DailyLow.TemperatureInfo.AirTemperature,
            // Weather1
            VisibilityDescription: data.WeatherElement.VisibilityDescription,
            SunshineDuration: data.WeatherElement.SunshineDuration,
            UVIndex: data.WeatherElement.UVIndex
        }
    }
}
