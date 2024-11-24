import type { Module } from './module'

export class Modules<T extends Module> {
    private implementations: T[] = []
    private name: string

    constructor(name: string) {
        this.name = name
    }

    getName(): string {
        return this.name
    }

    getI18nName(): string {
        return this.getName() + '.name'
    }

    getI18nTitle(): string {
        return this.getName() + '.title'
    }

    getI18nDescription(): string {
        return this.getName() + '.description'
    }

    register(module: T): void {
        this.implementations.push(module)
    }

    get(name: string): T {
        return this.implementations.filter((impl) => impl.getName() === name)[0]
    }

    list(): T[] {
        return this.implementations
    }

    listName(): string[] {
        return this.implementations.map((impl) => impl.getName())
    }

    clone(filterFunc): Modules<T> {
        const clone = new Modules<T>(this.name)
        clone.implementations = this.implementations.filter(filterFunc)
        return clone
    }
}
