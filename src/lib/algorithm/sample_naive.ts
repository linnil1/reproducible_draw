import type { Random } from './random'
import { Sample } from './sample'

export class NaiveChoice extends Sample {
    getName(): string {
        return 'sample_naive'
    }
    allowDuplicated(): boolean {
        return true
    }

    sample(random: Random, n: number, k: number): number[] {
        const result: number[] = []
        for (let i = 0; i < k; i++) {
            result.push(random.random(n))
        }
        return result
    }

    getState(): string {
        return ''
    }
}
