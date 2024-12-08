import type { DataResult } from '$lib/status'
import { DateTime } from 'luxon'
import { Module } from './module'

export abstract class Data extends Module {
    abstract check(data: Date): DataResult
    abstract fetchData(date: Date): Promise<any>
    abstract getState(): string
    protected isUnavailable(date: Date): boolean {
        return DateTime.fromJSDate(date) < DateTime.now().plus({ days: -30 })
    }
}
