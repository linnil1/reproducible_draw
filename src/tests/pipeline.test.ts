import { describe, it, expect, vi, beforeEach } from 'vitest'
import { datas, hashs, generators, randoms, samples } from '$lib/algorithm'
import { Status } from '$lib/status'

describe('Page Pipeline with mocked fetchData', () => {
    let mockFetchData: ReturnType<typeof vi.fn>

    beforeEach(() => {
        vi.clearAllMocks()

        // Mock fetchData for all data modules
        mockFetchData = vi.fn()
        datas.list().forEach((dataModule) => {
            vi.spyOn(dataModule, 'fetchData').mockImplementation(mockFetchData)
        })
    })

    // Helper function to create test dates
    const createTestDate = (daysOffset: number, hour: number, minute: number = 0) => {
        const date = new Date()
        date.setDate(date.getDate() + daysOffset)
        date.setHours(hour, minute, 0, 0)
        return date
    }

    // Test configurations with expected results
    const testDate1 = createTestDate(-5, 12, 0) // 5 days ago, 12:00:00 (10-min aligned)
    const testDate2 = createTestDate(-3, 14, 0) // 3 days ago, 14:00:00 (hour aligned)

    const testConfigs = [
        {
            name: 'Basic Weather3 configuration',
            config: {
                selectedDate: testDate1.toISOString().replace('Z', '+08:00'),
                selectedData: 'data_weather3',
                selectedHash: 'hash_sha256',
                selectedGenerator: 'generator_pcg',
                selectedRandom: 'random_openbsd',
                selectedSample: 'sample_fisher_yates_sampling',
                selectedItemNumber: 3,
                items: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'],
                allowDuplicated: false
            },
            mockData: JSON.stringify([
                {
                    StationId: 'TEST123',
                    ObsTime: "2025-09-21T12:00:00+08:00",
                    AirTemperature: 25.0
                }
            ]),
            expectedResult: [3, 0, 1] // Actual result from test run
        },
        {
            name: 'Weather1 with hour alignment',
            config: {
                selectedDate: testDate2.toISOString().replace('Z', '+08:00'),
                selectedData: 'data_weather1',
                selectedHash: 'hash_sha256',
                selectedGenerator: 'generator_mt19937',
                selectedRandom: 'random_divisionless',
                selectedSample: 'sample_fisher_yates_shuffle',
                selectedItemNumber: 2,
                items: ['One', 'Two', 'Three', 'Four'],
                allowDuplicated: false
            },
            mockData: JSON.stringify([
                {
                    StationId: 'WEATHER1',
                    ObsTime: "2025-09-21T12:00:00+08:00",
                    AirTemperature: 22.5
                }
            ]),
            expectedResult: [1, 0] // Actual result from test run
        }
    ]

    testConfigs.forEach(({ name, config, mockData, expectedResult }) => {
        it(`should process ${name} correctly`, async () => {
            // Setup mock
            mockFetchData.mockResolvedValue(mockData)

            // Get modules
            const date = new Date(config.selectedDate)
            const dataModule = datas.get(config.selectedData)
            const hashModule = hashs.get(config.selectedHash)
            const generatorModule = generators.get(config.selectedGenerator)
            const randomModule = randoms.get(config.selectedRandom)
            const sampleModule = samples.get(config.selectedSample)

            // Verify data is valid
            const validation = dataModule.check(date)
            expect(validation.status).toBe(Status.SUCCESS)

            // Execute pipeline
            const data = await dataModule.fetchData(date)
            expect(mockFetchData).toHaveBeenCalledWith(date)
            expect(data).toBe(mockData)

            const hashValue = hashModule.hashNum(data)
            expect(typeof hashValue).toBe('bigint')

            const randomState = generatorModule.setSeed(hashValue)
            expect(randomState).toBeDefined()

            randomModule.setGenerator(generatorModule)

            const resultList = sampleModule.sample(
                randomModule,
                config.items.length,
                config.selectedItemNumber
            )

            // Verify results structure
            expect(resultList).toHaveLength(config.selectedItemNumber)
            expect(Array.isArray(resultList)).toBe(true)

            // Verify expected results if provided
            if (expectedResult) {
                expect(resultList).toEqual(expectedResult)
            }

            // Verify no duplicates if not allowed
            if (!config.allowDuplicated) {
                const uniqueResults = [...new Set(resultList)]
                expect(uniqueResults).toHaveLength(resultList.length)
            }

            // Verify indices are valid
            resultList.forEach((index) => {
                expect(index).toBeGreaterThanOrEqual(0)
                expect(index).toBeLessThan(config.items.length)
                expect(Number.isInteger(index)).toBe(true)
            })
        })
    })

    it('should handle data validation failures', async () => {
        const dataModule = datas.list()[0]

        // Test with future date (should return PENDING status)
        const futureDate = createTestDate(10, 0, 0)
        const validation = dataModule.check(futureDate)

        // Should handle validation appropriately (PENDING for future dates)
        expect(validation.status).toBe(Status.PENDING)

        // Test with very old date (should return FAIL status)
        const veryOldDate = new Date('2020-01-01T12:00:00+08:00')
        const oldValidation = dataModule.check(veryOldDate)
        expect(oldValidation.status).toBe(Status.FAIL)
    })

    it('should produce consistent results with same configuration', async () => {
        const mockData = JSON.stringify({ consistent: 'data', value: 42 })
        mockFetchData.mockResolvedValue(mockData)

        const config = {
            date: createTestDate(-2, 16, 0), // 2 days ago, hour-aligned
            dataName: datas.listName()[0],
            hashName: hashs.listName()[0],
            generatorName: generators.listName()[0],
            randomName: randoms.listName()[0],
            sampleName: samples.listName()[0],
            itemCount: 5,
            selectCount: 2
        }

        // Run pipeline twice with same config
        const results = []
        for (let i = 0; i < 2; i++) {
            const dataModule = datas.get(config.dataName)
            const hashModule = hashs.get(config.hashName)
            const generatorModule = generators.get(config.generatorName)
            const randomModule = randoms.get(config.randomName)
            const sampleModule = samples.get(config.sampleName)

            const data = await dataModule.fetchData(config.date)
            const hashValue = hashModule.hashNum(data)
            generatorModule.setSeed(hashValue)
            randomModule.setGenerator(generatorModule)
            const result = sampleModule.sample(randomModule, config.itemCount, config.selectCount)

            results.push(result)
        }

        // Results should be identical for same configuration
        expect(results[0]).toEqual(results[1])
    })
})
