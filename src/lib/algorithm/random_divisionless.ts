import { Random } from './random'
import type { Generator } from './generator'

export class Divisionless extends Random {
    private generator: Generator = null
    private history: string = ''

    getName(): string {
        return 'random_divisionless'
    }

    setGenerator(generator: Generator): void {
        this.generator = generator
        this.history = ''
    }

    random(max: number): number {
        if (this.generator == null) {
            throw new Error('Generator not set')
        }
        const b32 = (1n << 32n) - 1n
        const bmax = BigInt(max)

        let x = this.generator.random()
        let m = BigInt(x) * bmax
        let l = m & b32
        this.history = this.history + `x=${x}, max=${max}, m=${m}, l=${l}`

        if (l < max) {
            let t = ((1n << 32n) - bmax) % bmax
            while (l < t) {
                x = this.generator.random()
                m = BigInt(x) * bmax
                l = m & b32
                this.history = this.history + `(Skipped)\nx=${x}, max=${max}, m=${m}, l=${l}`
            }
        }
        this.history += '\n'
        return Number(m >> 32n)
    }

    getState(): string {
        return this.history
    }
}
