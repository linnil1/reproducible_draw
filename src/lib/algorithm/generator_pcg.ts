import { Generator } from './generator'
import PcgRandom from 'pcg-random'

export class PCG extends Generator {
    private rng: PcgRandom

    getName(): string {
        return 'generator_pcg'
    }

    getState(): string {
        return JSON.stringify(this.rng.getState())
    }

    setSeed(seed: bigint): string {
        const shift64 = BigInt(64)
        const b64 = (BigInt(1) << shift64) - BigInt(1)
        const seed1 = (seed >> shift64) & b64
        const incr = seed & b64
        this.rng = new PcgRandom(seed1, incr)
        return JSON.stringify({
            seed: seed1.toString(),
            inc: incr.toString(),
            init_state: this.rng.getState()
        })
    }

    random(): number {
        if (this.rng === undefined) {
            throw new Error('Seed not set')
        }
        return this.rng.next32()
    }
}
