import { Generator } from './generator'
import MT19937 from '@stdlib/random-base-mt19937'

export class Mt19937 extends Generator {
    private rng: MT19937

    getName(): string {
        return 'generator_mt19937'
    }

    getState(): string {
        return JSON.stringify(this.rng.state)
    }

    setSeed(seed: bigint): string {
        let seed1 = Number(seed & ((1n << 32n) - 1n))
        if (seed1 == 0) seed1 = 1
        this.rng = MT19937.factory({ seed: seed1 })
        return JSON.stringify({
            seed: seed1,
            state: this.rng.state
        })
    }

    random(): number {
        if (this.rng === undefined) {
            throw new Error('Seed not set')
        }
        return this.rng()
    }
}
