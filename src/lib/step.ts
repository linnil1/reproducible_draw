import type { Module } from './algorithm/module'
import type { Modules } from './algorithm/modules'

export interface Step<T extends Module> {
    step: string
    modules: Modules<T>
    module: Module
    state: string
    output: string
}
