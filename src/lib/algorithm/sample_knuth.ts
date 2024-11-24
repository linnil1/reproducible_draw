import type { Random } from './random'
import { Sample } from './sample'

export class Knuth extends Sample {
    private steps: string = ''

    getName(): string {
        return 'sample_knuth'
    }

    allowDuplicated(): boolean {
        return false
    }

    sample(random: Random, n: number, k: number): number[] {
        if (n < k) {
            throw new Error('list length is less than k.')
        }
        const result = Array.from({ length: n }, (_, i) => i)
        this.steps = ''

        // Perform shuffle
        for (let i = result.length; i >= 1; i--) {
            const j = random.random(i)
            this.steps = this.steps + `random=${j}, Swap index ${i - 1} and ${j}\n`
            const tmp = result[j]
            result[j] = result[i - 1]
            result[i - 1] = tmp
        }
        this.steps += `Final array ${result}\n`
        return result.slice(0, k)
    }

    getState(): string {
        return this.steps
    }
}
