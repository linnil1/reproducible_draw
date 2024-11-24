import { Module } from './module'

export abstract class Hash extends Module {
    abstract hash(input: string): string
    abstract hashNum(input: string): BigInt
    abstract getState(): string
}
