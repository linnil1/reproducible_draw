import { Random } from './random'
import type { Generator } from './generator'

export class OpenBsdRejection extends Random {
    private generator: Generator = null
    private history: string = ''

    getName(): string {
        return 'random_openbsd'
    }

    setGenerator(generator: Generator): void {
        this.generator = generator
        this.history = ''
    }

    random(max: number): number {
        if (this.generator == null) {
            throw new Error('Generator not set')
        }
        const skew = Number((1n << BigInt(32)) % BigInt(max))
        while (true) {
            const x = this.generator.random()
            if (x >= skew) {
                const r = x % max
                this.history = this.history + `Pick ${x} MOD ${max} = ${r}\n`
                return r
            } else {
                this.history = this.history + `Pick ${x} MOD ${max} (skipped)\n`
            }
        }
    }

    getState(): string {
        return this.history
    }
}
