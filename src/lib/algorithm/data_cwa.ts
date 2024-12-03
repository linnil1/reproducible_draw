import { Status, type DataResult } from '$lib/status'
import { Data } from './data'

export abstract class CwaData extends Data {
    private data: any

    abstract getPath(): string
    abstract getKeys(): string[]
    abstract fieldFormatter(key: string, value: any): string
    abstract parse()

    protected check10Min(date: Date): DataResult {
        const minutes = date.getMinutes()
        const seconds = date.getSeconds()
        if (seconds !== 0 || minutes % 10 !== 0) {
            return {
                status: Status.FAIL,
                text: 'results.fetch.invalidTimePer10Min'
            }
        }
        return {
            status: Status.SUCCESS,
            text: ''
        }
    }

    protected checkHour(date: Date): DataResult {
        const minutes = date.getMinutes()
        const seconds = date.getSeconds()
        if (seconds !== 0 || minutes !== 0) {
            return {
                status: Status.FAIL,
                text: 'results.fetch.invalidTimePerHour'
            }
        }
        return {
            status: Status.SUCCESS,
            text: ''
        }
    }

    check(date: Date): DataResult {
        const now = new Date()
        if (date > now)
            return {
                status: Status.PENDING,
                text: 'results.fetch.futureTime'
            }
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(now.getDate() - 7)
        if (date < sevenDaysAgo) {
            return {
                status: Status.FAIL,
                text: 'results.fetch.unavailable'
            }
        }
        return {
            status: Status.SUCCESS,
            text: ''
        }
    }

    private toDbKey(date: Date): string {
        // Get the date and time components
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        // Get the timezone offset in minutes and convert it to hours and minutes
        const timezoneOffset = -date.getTimezoneOffset()
        const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0')
        const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0')
        const offsetSign = timezoneOffset >= 0 ? '+' : '-'
        // Combine components into the desired format
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`
    }

    getMetaKeys(): string[] {
        return ['ObsTime', 'StationId', 'StationName', 'Latitude', 'Longitude']
    }

    getState(): string {
        return `Original Data (Fetched at ${this.data.query_time}):\n${this.data.data}\n`
    }

    protected valueToString(value: any, precision: number): string {
        if (precision < 0) {
            return '"' + value.toString() + '"'
        }
        if (value == undefined) {
            return 'null'
        } else if (value == null) {
            return 'null'
        } else if (typeof value !== 'number') {
            return '"' + value.toString() + '"'
        }
        try {
            return parseFloat(value).toFixed(precision)
        } catch (e) {
            console.log('Fail to turn JSON into string: ' + e)
        }
        return '"' + value.toString() + '"'
    }

    private toJson(objList) {
        objList = Object.values(objList).sort((a, b) => (a.StationId > b.StationId ? 1 : -1))
        const formattedObjects = objList.map((obj) => {
            const formattedKeys = this.getKeys().map((key, index) => {
                return `"${key}":${this.fieldFormatter(key, obj[key])}`
            })
            return `{${formattedKeys.join(',')}}`
        })
        return `[${formattedObjects.join(',')}]`
    }

    async fetch(date: Date): Promise<string> {
        const params = new URLSearchParams({
            datetime: this.toDbKey(date)
        })
        const response = await fetch(`${this.getPath()}?${params.toString()}`)
        if (!response.ok) {
            throw new Error('results.fetch.unexpectedError')
        }
        const metaRaw = await response.json()
        if (metaRaw.status != 'ok') {
            throw new Error(metaRaw.status)
        }
        this.data = metaRaw
        return this.toJson(JSON.parse(metaRaw.data).records.Station.map(this.parse))
    }
}
