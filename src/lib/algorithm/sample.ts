import { Module } from './module'

export abstract class Sample extends Module {
    abstract allowDuplicated(): boolean
    abstract sample(Random: any, n: number, k: number): number[]
    abstract getState(): string
}
