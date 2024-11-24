import { Module } from './module'

export abstract class Data extends Module {
    abstract check(data: Date): string
    abstract fetch(date: Date): Promise<any>
    abstract getState(): string
}
