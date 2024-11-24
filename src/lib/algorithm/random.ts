import { Module } from './module'
import type { Generator } from './generator'

export abstract class Random extends Module {
    abstract setGenerator(generator: Generator): void
    abstract random(max: number): number
    abstract getState(): string
}
