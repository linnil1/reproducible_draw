import { Module } from './module'

export abstract class Generator extends Module {
    abstract random(): number
    abstract setSeed(newSeed: BigInt): string
    abstract getState(): string
}
