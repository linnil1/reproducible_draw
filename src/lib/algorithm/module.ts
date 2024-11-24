export abstract class Module {
    abstract getName(): string
    getI18nName(): string {
        return this.getName() + '.name'
    }
    getI18nDescription(): string {
        return this.getName() + '.description'
    }
    abstract getState(): string
}
