import type { DataResult } from '$lib/status'
import { Module } from './module'

export abstract class Data extends Module {
    abstract check(data: Date): DataResult
    abstract fetchData(date: Date): Promise<any>
    abstract getState(): string
}
