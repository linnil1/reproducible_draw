import type { Random } from './random'
import { Sample } from './sample'

export class KnuthSampling extends Sample {
    private steps: string = ''

    getName(): string {
        return 'sample_knuth_sampling'
    }

    allowDuplicated(): boolean {
        return false
    }

    sample(random: Random, n: number, k: number): number[] {
        if (n < k) {
            throw new Error('list length is less than k.')
        }
        const result = Array.from({ length: n }, (_, i) => i)
        const arr = []
        this.steps = ''

        // Perform shuffle
        for (let i = result.length; i >= 0 && arr.length !== k; i--) {
            const j = random.random(i)
            arr.push(result[j])
            this.steps += `${arr.length}. random=${j},value=${result[j]}\n`
            result[j] = result[i - 1] // swap
        }
        return arr
    }

    getState(): string {
        return this.steps
    }
}
