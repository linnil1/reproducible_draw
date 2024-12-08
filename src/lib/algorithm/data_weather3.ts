import { Status, type DataResult } from '$lib/status'
import { CwaData } from './data_cwa'

export class Weather3 extends CwaData {
    getName(): string {
        return 'data_weather3'
    }
    getPath(): string {
        return '/data/weather3'
    }
    getKeys(): string[] {
        return [...this.getMetaKeys(), ...this.getWeatherKeys()]
    }

    check(date: Date): DataResult {
        const result = super.check(date)
        if (result.status != Status.SUCCESS) return result
        return this.check10Min(date)
    }

    private getWeatherKeys(): string[] {
        return [
            'Weather',
            'VisibilityDescription',
            'SunshineDuration',
            'Precipitation',
            'WindDirection',
            'WindSpeed',
            'AirTemperature',
            'RelativeHumidity',
            'AirPressure',
            'UVIndex',
            'Max10MinAverage.Occurred_at',
            'Max10MinAverage.WindDirection',
            'Max10MinAverage.WindSpeed',
            'GustInfo.Occurred_at',
            'GustInfo.WindDirection',
            'GustInfo.PeakGustSpeed',
            'DailyHigh.AirTemperature',
            'DailyHigh.Occurred_at',
            'DailyLow.AirTemperature',
            'DailyLow.Occurred_at'
        ]
    }

    fieldFormatter(key: string, value: any): string {
        const float6Keys = ['Latitude', 'Longitude']
        const float1Keys = [
            'SunshineDuration',
            'Precipitation',
            'WindDirection',
            'WindSpeed',
            'AirTemperature',
            'RelativeHumidity',
            'AirPressure',
            'UVIndex',
            'Max10MinAverage.WindDirection',
            'Max10MinAverage.WindSpeed',
            'GustInfo.WindDirection',
            'GustInfo.PeakGustSpeed',
            'DailyHigh.AirTemperature',
            'DailyLow.AirTemperature'
        ]
        if (float6Keys.includes(key)) {
            return this.valueToString(value, 6)
        } else if (float1Keys.includes(key)) {
            return this.valueToString(value, 1)
        }
        return this.valueToString(value, -1)
    }

    parse(data: Record<string, any>): Record<string, any> {
        const coords = data.GeoInfo.Coordinates.filter((coord) => coord.CoordinateName === 'WGS84')
        if (!coords.length) {
            throw new Error('WGS84 coordinates not found')
        }
        const element = data.WeatherElement
        return {
            // Metadata
            StationId: data.StationId,
            StationName: data.StationName,
            ObsTime: data.ObsTime.DateTime,
            Latitude: coords[0].StationLatitude,
            Longitude: coords[0].StationLongitude,
            // Weather
            Weather: element.Weather,
            VisibilityDescription: element.VisibilityDescription,
            SunshineDuration: element.SunshineDuration,
            Precipitation: element.Now.Precipitation,
            WindDirection: element.WindDirection,
            WindSpeed: element.WindSpeed,
            AirTemperature: element.AirTemperature,
            RelativeHumidity: element.RelativeHumidity,
            AirPressure: element.AirPressure,
            UVIndex: element.UVIndex,
            'Max10MinAverage.Occurred_at': element.Max10MinAverage.Occurred_at.DateTime,
            'Max10MinAverage.WindDirection': element.Max10MinAverage.Occurred_at.WindDirection,
            'Max10MinAverage.WindSpeed': element.Max10MinAverage.WindSpeed,
            'GustInfo.Occurred_at': element.GustInfo.Occurred_at.DateTime,
            'GustInfo.WindDirection': element.GustInfo.Occurred_at.WindDirection,
            'GustInfo.PeakGustSpeed': element.GustInfo.PeakGustSpeed,
            'DailyHigh.AirTemperature':
                element.DailyExtreme.DailyHigh.TemperatureInfo.AirTemperature,
            'DailyHigh.Occurred_at':
                element.DailyExtreme.DailyHigh.TemperatureInfo.Occurred_at.DateTime,
            'DailyLow.AirTemperature': element.DailyExtreme.DailyLow.TemperatureInfo.AirTemperature,
            'DailyLow.Occurred_at':
                element.DailyExtreme.DailyLow.TemperatureInfo.Occurred_at.DateTime
        }
    }
}
