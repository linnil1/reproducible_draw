import { describe, expect, it, beforeEach } from 'vitest'

// Import all algorithm components (excluding data modules)
import { SHA256 } from '../lib/algorithm/hash_sha256'
import { SHA512 } from '../lib/algorithm/hash_sha512'
import { PCG } from '../lib/algorithm/generator_pcg'
import { Mt19937 } from '../lib/algorithm/generator_mt19937'
import { OpenBsdRejection } from '../lib/algorithm/random_openbsd'
import { Divisionless } from '../lib/algorithm/random_divisionless'
import { FisherYatesSampling } from '../lib/algorithm/sample_fisher_yates'
import { FisherYatesShuffle } from '../lib/algorithm/sample_fisher_yates_shuffle'
import { NaiveChoice } from '../lib/algorithm/sample_naive'

describe('Hash Modules', () => {
    describe('SHA256', () => {
        const sha256 = new SHA256()

        it('should hash simple string to expected values', () => {
            const hash1 = sha256.hashNum('hello world')
            const hash2 = sha256.hashNum('test data')

            expect(hash1).toBe(
                83814198383102558219731078260892729932246618004265700685467928187377105751529n
            )
            expect(hash2).toBe(
                BigInt(
                    '65781484137626617858498469461881099527941845049885596958633852473177578616313'
                )
            )

            // Same input should produce same hash
            expect(sha256.hashNum('hello world')).toBe(hash1)
        })

        it('should handle JSON data correctly', () => {
            const jsonData = JSON.stringify({ temperature: 25.5, humidity: 60 })
            const hash = sha256.hashNum(jsonData)

            expect(hash).toBe(
                BigInt(
                    '77415733160175566812736380752540366519093950300299179291378820379652143006814'
                )
            )
        })
    })

    describe('SHA512', () => {
        const sha512 = new SHA512()

        it('should produce expected hash values', () => {
            const hash1 = sha512.hashNum('same input data')
            const hash2 = sha512.hashNum('')

            expect(hash1).toBe(
                BigInt(
                    '118849396886976196630281228891911475465623968010720743948862686005526520578933572657161446403872598489371606673909110808805675010246914795097743557127983'
                )
            )
            expect(hash2).toBe(
                10868450558671247443152026947160338505683745266658651051718065983487878962987857602829315249215796444208488632888003673539585986066311769564391053988452926n
            )
        })

        it('should handle special characters', () => {
            const hash = sha512.hashNum('!@#$%^&*()')

            expect(hash).toBe(
                1024505386553649752434126552677376838669047891326133809935969506594211115206956132868917552410202635563030129445620112810113171390502397400472279374116372n
            )
        })
    })
})

describe('Generator Modules', () => {
    describe('PCG', () => {
        const pcg = new PCG()

        it('should generate first 10 random values for specific seed', () => {
            pcg.setSeed(BigInt(12345))
            const values = []
            for (let i = 0; i < 10; i++) {
                values.push(pcg.random())
            }

            expect(values).toEqual([
                152592823, 3911184027, 4120629189, 2342290299, 882295785, 2764501287, 4002125597,
                1080920200, 2179341614, 3539849407
            ])
        })

        it('should produce consistent results with same seed', () => {
            pcg.setSeed(BigInt(42))
            const values1 = []
            for (let i = 0; i < 5; i++) {
                values1.push(pcg.random())
            }

            pcg.setSeed(BigInt(42))
            const values2 = []
            for (let i = 0; i < 5; i++) {
                values2.push(pcg.random())
            }

            expect(values1).toEqual(values2)
        })
    })

    describe('Mt19937', () => {
        const mt19937 = new Mt19937()

        it('should generate first 10 random values for specific seed', () => {
            mt19937.setSeed(BigInt(54321))
            const values = []
            for (let i = 0; i < 10; i++) {
                values.push(mt19937.random())
            }

            expect(values).toEqual([
                3915467345, 2189234826, 2679307290, 787501152, 3400771556, 3473638550, 1845911630,
                4027756818, 2332222920, 127158527
            ])
        })

        it('should produce consistent results with same seed', () => {
            mt19937.setSeed(BigInt(1))
            const values1 = []
            for (let i = 0; i < 5; i++) {
                values1.push(mt19937.random())
            }

            mt19937.setSeed(BigInt(1))
            const values2 = []
            for (let i = 0; i < 5; i++) {
                values2.push(mt19937.random())
            }

            expect(values1).toEqual(values2)
        })
    })
})

describe('Random Modules', () => {
    // Create a const generator that always returns 97 for consistent testing
    const constGenerator = {
        random: () => 97,
        setSeed: () => '',
        getState: () => '',
        getName: () => 'const-generator',
        getI18nName: () => 'const-generator.name',
        getI18nDescription: () => 'const-generator.description'
    }

    describe('OpenBsdRejection', () => {
        const openBsd = new OpenBsdRejection()

        beforeEach(() => {
            openBsd.setGenerator(constGenerator)
        })

        it('should generate consistent random numbers with const generator', () => {
            const random1 = openBsd.random(10)
            const random2 = openBsd.random(5)
            const random3 = openBsd.random(100)

            // With const generator returning 97, we can predict the output
            expect(random1).toBe(7) // 97 % 10
            expect(random2).toBe(2) // 97 % 5
            expect(random3).toBe(97) // 97 % 100
        })

        it('should handle edge cases correctly', () => {
            const random1 = openBsd.random(1) // Should always return 0
            const random2 = openBsd.random(2) // 97 % 2 = 1

            expect(random1).toBe(0)
            expect(random2).toBe(1)
        })
    })

    describe('Divisionless', () => {
        const divisionless = new Divisionless()

        beforeEach(() => {
            divisionless.setGenerator(constGenerator)
        })

        it('should generate consistent random numbers with const generator', () => {
            const random1 = divisionless.random(3)
            const random2 = divisionless.random(7)
            const random3 = divisionless.random(50)

            // With const generator returning 97, all results are 0
            expect(random1).toBe(0)
            expect(random2).toBe(0)
            expect(random3).toBe(0)
        })

        it('should validate bounds', () => {
            const random = divisionless.random(100)

            expect(random).toBeGreaterThanOrEqual(0)
            expect(random).toBeLessThan(100)
            expect(Number.isInteger(random)).toBe(true)
        })
    })
})

describe('Sample Modules', () => {
    describe('FisherYatesSampling', () => {
        const sampling = new FisherYatesSampling()
        const openBsd = new OpenBsdRejection()
        const pcg = new PCG()

        it('should produce expected sample results', () => {
            pcg.setSeed(BigInt(11111))
            openBsd.setGenerator(pcg)

            const result1 = sampling.sample(openBsd, 5, 3)
            expect(result1).toEqual([3, 1, 4])

            const result2 = sampling.sample(openBsd, 5, 1)
            expect(result2).toEqual([1])
        })

        it('should handle sampling all items', () => {
            pcg.setSeed(BigInt(11111))
            openBsd.setGenerator(pcg)
            // Skip previous results to get to this test case
            sampling.sample(openBsd, 5, 3)
            sampling.sample(openBsd, 5, 1)

            const result = sampling.sample(openBsd, 3, 3)
            expect(result).toEqual([0, 1, 2])
            expect([...new Set(result)]).toHaveLength(3) // No duplicates
        })
    })

    describe('FisherYatesShuffle', () => {
        const shuffle = new FisherYatesShuffle()
        const divisionless = new Divisionless()
        const mt19937 = new Mt19937()

        it('should produce expected shuffle results', () => {
            mt19937.setSeed(BigInt(22222))
            divisionless.setGenerator(mt19937)

            const result = shuffle.sample(divisionless, 6, 4)
            expect(result).toEqual([3, 4, 5, 1])
            expect([...new Set(result)]).toHaveLength(4) // No duplicates
        })

        it('should produce different results with different seeds', () => {
            mt19937.setSeed(BigInt(100))
            divisionless.setGenerator(mt19937)
            const result1 = shuffle.sample(divisionless, 5, 3)

            mt19937.setSeed(BigInt(200))
            divisionless.setGenerator(mt19937)
            const result2 = shuffle.sample(divisionless, 5, 3)

            expect(result1).toEqual([1, 3, 0])
            expect(result2).toEqual([3, 2, 0])
            expect(result1).not.toEqual(result2)
        })
    })

    describe('NaiveChoice', () => {
        const naive = new NaiveChoice()
        const openBsd = new OpenBsdRejection()
        const pcg = new PCG()

        it('should allow duplicates and produce expected results', () => {
            expect(naive.allowDuplicated()).toBe(true)

            pcg.setSeed(BigInt(33333))
            openBsd.setGenerator(pcg)

            const result1 = naive.sample(openBsd, 3, 5) // More selections than items
            expect(result1).toEqual([1, 1, 2, 1, 0])
            expect(result1).toHaveLength(5)
        })

        it('should handle simple selection', () => {
            pcg.setSeed(BigInt(33333))
            openBsd.setGenerator(pcg)
            // Skip previous result
            naive.sample(openBsd, 3, 5)

            const result = naive.sample(openBsd, 4, 2)
            expect(result).toEqual([3, 1])
            expect(result).toHaveLength(2)
        })
    })
})
