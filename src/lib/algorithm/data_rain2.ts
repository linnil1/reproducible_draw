import { Status, type DataResult } from '$lib/status'
import { CwaData } from './data_cwa'

export class Rain2 extends CwaData {
    getName(): string {
        return 'data_rain2'
    }
    getPath(): string {
        return '/data/rain2'
    }
    getKeys(): string[] {
        return [...this.getMetaKeys(), ...this.getRainKeys()]
    }

    check(date: Date): DataResult {
        const formatResult = this.check10Min(date)
        if (formatResult.status !== Status.SUCCESS) return formatResult
        return super.check(date)
    }

    fieldFormatter(key: string, value: any): string {
        const float6Keys = ['Latitude', 'Longitude']
        const float1Keys = [
            'Now',
            'Past10min',
            'Past1hr',
            'Past3hr',
            'Past6hr',
            'Past12hr',
            'Past24hr',
            'Past2days',
            'Past3days'
        ]
        if (float6Keys.includes(key)) {
            return this.valueToString(value, 6)
        } else if (float1Keys.includes(key)) {
            return this.valueToString(value, 1)
        }
        return this.valueToString(value, -1)
    }

    private getRainKeys(): string[] {
        return [
            'Now',
            'Past10min',
            'Past1hr',
            'Past3hr',
            'Past6hr',
            'Past12hr',
            'Past24hr',
            'Past2days',
            'Past3days'
        ]
    }

    parse(data: Record<string, any>): Record<string, any> {
        const coords = data.GeoInfo.Coordinates.filter((coord) => coord.CoordinateName === 'WGS84')
        if (!coords.length) {
            throw new Error('WGS84 coordinates not found')
        }
        return {
            // Metadata
            ObsTime: data.ObsTime.DateTime,
            StationId: data.StationId,
            StationName: data.StationName,
            Latitude: coords[0].StationLatitude,
            Longitude: coords[0].StationLongitude,
            // Rain
            Now: data.RainfallElement.Now.Precipitation,
            Past10min: data.RainfallElement.Past10Min.Precipitation,
            Past1hr: data.RainfallElement.Past1hr.Precipitation,
            Past3hr: data.RainfallElement.Past3hr.Precipitation,
            Past6hr: data.RainfallElement.Past6Hr.Precipitation,
            Past12hr: data.RainfallElement.Past12hr.Precipitation,
            Past24hr: data.RainfallElement.Past24hr.Precipitation,
            Past2days: data.RainfallElement.Past2days.Precipitation,
            Past3days: data.RainfallElement.Past3days.Precipitation
        }
    }
}
