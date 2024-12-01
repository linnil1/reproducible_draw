import type { Random } from './random'
import { Sample } from './sample'

export class ReservoirSampling extends Sample {
    private steps: string = ''

    getName(): string {
        return 'sample_reservoir'
    }

    allowDuplicated(): boolean {
        return false
    }

    sample(random: Random, n: number, k: number): number[] {
        if (n < k) {
            throw new Error('list length is less than k.')
        }
        const reservoir = Array.from({ length: k }, (_, i) => i)
        this.steps = ''

        for (let i = k; i < n; i++) {
            const j = random.random(i + 1)
            this.steps += `${i - k + 1}. random=${j}\n`
            if (j < k) {
                this.steps += `  Replacing reservoir[${j}] with ${i}\n`
                reservoir[j] = i
            }
        }
        return reservoir
    }

    getState(): string {
        return this.steps
    }
}
