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
        const targetOffset = 8 * 60 // +08:00
        const localOffset = date.getTimezoneOffset()
        const offsetDifference = targetOffset + localOffset
        const adjustedDate = new Date(date.getTime() + offsetDifference * 60 * 1000)

        // Format the adjusted date components
        const year = adjustedDate.getFullYear()
        const month = String(adjustedDate.getMonth() + 1).padStart(2, '0')
        const day = String(adjustedDate.getDate()).padStart(2, '0')
        const hours = String(adjustedDate.getHours()).padStart(2, '0')
        const minutes = String(adjustedDate.getMinutes()).padStart(2, '0')
        const seconds = String(adjustedDate.getSeconds()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+08:00`
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

    private isInKMins(date: Date, k: number): Boolean {
        return date < new Date() && date > new Date(new Date().getTime() - k * 60 * 1000)
    }

    async fetchData(date: Date): Promise<string> {
        const params = new URLSearchParams({
            datetime: this.toDbKey(date)
        })
        const response = await fetch(`${this.getPath()}?${params.toString()}`)
        if (!response.ok) {
            throw new Error('results.fetch.unexpectedError')
        }
        const metaRaw = await response.json()
        if (metaRaw.status == 'results.fetch.keyNotFound' && this.isInKMins(date, 20)) {
            throw new Error('results.fetch.keyNotFound1')
        }
        if (metaRaw.status != 'ok') {
            throw new Error(metaRaw.status)
        }
        this.data = metaRaw
        return this.toJson(JSON.parse(metaRaw.data).records.Station.map(this.parse))
    }
}
