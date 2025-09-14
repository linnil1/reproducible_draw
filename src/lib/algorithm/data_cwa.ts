import { Status, type DataResult } from '$lib/status'
import { Data } from './data'
import { DateTime } from 'luxon'

export abstract class CwaData extends Data {
    private data: any

    abstract getPath(): string
    abstract getKeys(): string[]
    abstract fieldFormatter(key: string, value: any): string
    abstract parse(data: Record<string, any>): Record<string, any>

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
        // Check FAIL conditions first
        if (this.isUnavailable(date)) {
            return {
                status: Status.FAIL,
                text: 'results.fetch.unavailable'
            }
        }

        // Check PENDING conditions at the end
        if (this.isFuture(date)) {
            return {
                status: Status.PENDING,
                text: 'results.fetch.futureTime'
            }
        }

        return {
            status: Status.SUCCESS,
            text: ''
        }
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
            // 2024-12-08T01:00:00+08:00
            datetime: DateTime.fromJSDate(date)
                .setZone('Asia/Taipei')
                .toFormat("yyyy-MM-dd'T'HH:mm:ssZZ")
        })
        const response = await fetch(`${this.getPath()}?${params.toString()}`)
        if (!response.ok) {
            throw new Error('results.fetch.unexpectedError')
        }
        const metaRaw = await response.json()
        if (metaRaw.status == 'results.fetch.keyNotFound' && this.isInKMins(date, 20)) {
            throw new Error('results.fetch.keyNotFoundWithShortSyncTime')
        }
        if (metaRaw.status != 'ok') {
            throw new Error(metaRaw.status)
        }
        this.data = metaRaw
        return this.toJson(JSON.parse(metaRaw.data).records.Station.map(this.parse))
    }
}
