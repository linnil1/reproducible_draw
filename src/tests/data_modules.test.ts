import { describe, it, expect, beforeEach, vi } from 'vitest'
import { updateCwaData } from '../lib/server/data_cwa'
import { fetchAndSaveStock, type StockData } from '../lib/server/data_stock'
import { Weather1 } from '../lib/algorithm/data_weather1'
import { Weather3 } from '../lib/algorithm/data_weather3'
import { Rain2 } from '../lib/algorithm/data_rain2'
import { Stock } from '../lib/algorithm/data_stock'
import type { SavedData } from '$lib/server/utils'

// Mock KV namespace for storage testing
class MockKVNamespace {
    private store = new Map<string, string>()

    async get(key: string, options?: { type?: 'json' | 'text' }): Promise<any> {
        const value = this.store.get(key)
        if (!value) return null

        if (options?.type === 'json') {
            return JSON.parse(value)
        }
        return value
    }

    async getWithMetadata(key: string, options?: any): Promise<any> {
        const value = this.store.get(key)
        if (!value) return { value: null, metadata: null }

        return {
            value: options?.type === 'json' ? JSON.parse(value) : value,
            metadata: null
        }
    }

    async put(
        key: string,
        value: string,
        options?: { expirationTtl?: number; metadata?: any }
    ): Promise<void> {
        this.store.set(key, value)
    }

    async delete(key: string): Promise<void> {
        this.store.delete(key)
    }

    async list(): Promise<{ keys: Array<{ name: string }> }> {
        return {
            keys: Array.from(this.store.keys()).map((name) => ({ name }))
        }
    }

    // Helper method for testing
    clear() {
        this.store.clear()
    }
}

// Helper functions for validation
function validateFloatField(value: any, fieldName: string, min?: number, max?: number): void {
    expect(typeof value).toBe('string')
    expect(value).not.toBeNull()
    expect(isNaN(parseFloat(value))).toBe(false)

    const numValue = parseFloat(value)
    if (min !== undefined && max !== undefined) {
        expect(numValue === -99 || (numValue >= min && numValue <= max)).toBe(true)
    }
}

function validateDateField(value: any, fieldName: string): void {
    expect(typeof value).toBe('string')
    expect(value).not.toBeNull()

    if (value !== '-99') {
        expect(new Date(value)).toBeInstanceOf(Date)
        expect(isNaN(new Date(value).getTime())).toBe(false)
    }
}

function validateStringField(value: any, fieldName: string): void {
    expect(typeof value).toBe('string')
    expect(value).not.toBeNull()
    expect(value.length).toBeGreaterThan(0)
}

// Helper function for CWA data modules to fetch real data and test with mocked fetchData
const CWA_KEY = ""

// Helper function to mock fetchData endpoint call
async function mockFetchDataCall(savedData: any, dataModule: any, testDate: Date): Promise<string> {
    // Save original fetch
    const originalFetch = globalThis.fetch

    // Mock the fetch call for the data module endpoint only
    const mockFetch = vi.fn()
    globalThis.fetch = mockFetch

    // Mock the response from /data/{module} endpoint
    mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(savedData)
    })

    // Use fetchData method with mocked endpoint
    const fetchedData = await dataModule.fetchData(testDate)

    // Restore original fetch
    globalThis.fetch = originalFetch

    return fetchedData
}

async function getAndCheckSaveData(updateResult: SavedData, mockKV: MockKVNamespace): Promise<any> {
    expect(updateResult.status).toBe('ok')
    const savedData = await mockKV.get(updateResult.key, { type: 'json' })
    expect(savedData).toBeDefined()
    expect(savedData.status).toBe('ok')
    return savedData
}

async function testCwaDataModule(
    mockKV: MockKVNamespace,
    dataModuleName: string,
    DataModuleClass: any,
    stringFields: string[],
    dateFields: string[],
    floatFields: string[]
) {
    // Skip test if CWA_KEY is empty
    if (!CWA_KEY) {
        console.log(`Skipping ${dataModuleName} test: CWA_KEY is empty`)
        return null
    }

    // Step 1: Mock environment for updateCwaData with real CWA_KEY
    const mockEnv = {
        CWA_KEY: CWA_KEY,
        data_draw: mockKV
    }

    // Step 2: Call updateCwaData to fetch real data from CWA API and save to KV
    const updateResult = await updateCwaData(mockEnv as any, dataModuleName)

    // Verify updateCwaData worked correctly
    expect(updateResult.key).toMatch(
        new RegExp(`^${dataModuleName}-\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\+\\d{2}:\\d{2}$`)
    )
    const savedData = await getAndCheckSaveData(updateResult, mockKV)
    expect(savedData.data).toBeDefined()
    expect(savedData.data).not.toBeNull()
    expect(savedData.data.length).toBeGreaterThan(1000)

    // Step 4: Create data module and test fetchData with mocked fetch
    const dataModule = new DataModuleClass()

    // Step 5: Use helper to mock fetchData endpoint call
    const testDate = new Date(updateResult.key.replace(`${dataModuleName}-`, ''))
    const fetchedData = await mockFetchDataCall(savedData, dataModule, testDate)

    // Step 6: Parse the fetched data
    const parsedStations = JSON.parse(fetchedData)
    expect(parsedStations).toBeInstanceOf(Array)
    expect(parsedStations.length).toBeGreaterThan(0)

    // Step 7: Check the first station data to verify all fields are parsed correctly
    const station = parsedStations[0]

    // Validate string fields
    stringFields.forEach((field) => {
        validateStringField(station[field], field)
    })

    // Validate date fields
    dateFields.forEach((field) => {
        validateDateField(station[field], field)
    })

    // Validate float fields with appropriate ranges
    floatFields.forEach((field) => {
        validateFloatField(station[field], field)
    })

    console.log(`Successfully parsed ${parsedStations.length} ${dataModuleName} stations`)
    console.log(`Sample station data:`, station)

    return { updateResult, savedData, parsedStations, station }
}

describe('Data Module End-to-End Tests', () => {
    let mockKV: MockKVNamespace

    beforeEach(() => {
        mockKV = new MockKVNamespace()
        mockKV.clear()
        vi.restoreAllMocks()
    })

    describe('Weather1 Data Module E2E', () => {
        it('should complete full data flow: updateCwaData -> KV storage -> fetchData -> field validation', async () => {
            // Define field categories for Weather1
            const stringFields = ['StationId', 'StationName']
            const dateFields = [
                'ObsTime',
                'GustInfo.Occurred_at',
                'DailyHigh.Occurred_at',
                'DailyLow.Occurred_at'
            ]
            const floatFields = [
                'Latitude',
                'Longitude',
                'Precipitation',
                'WindDirection',
                'WindSpeed',
                'AirTemperature',
                'RelativeHumidity',
                'AirPressure',
                'GustInfo.WindDirection',
                'GustInfo.PeakGustSpeed',
                'DailyHigh.AirTemperature',
                'DailyLow.AirTemperature'
            ]

            const result = await testCwaDataModule(
                mockKV,
                'weather1',
                Weather1,
                stringFields,
                dateFields,
                floatFields
            )

            if (result) {
                const { station } = result
                // Additional Weather1-specific validations with ranges
                validateFloatField(station.Latitude, 'Latitude', -90, 90)
                validateFloatField(station.Longitude, 'Longitude', -180, 180)
                validateFloatField(station.Precipitation, 'Precipitation', 0, 1000)
                validateFloatField(station.WindDirection, 'WindDirection', 0, 360)
                validateFloatField(station.WindSpeed, 'WindSpeed', -99, 100)
                validateFloatField(station.AirTemperature, 'AirTemperature', -10, 50)
                validateFloatField(station.RelativeHumidity, 'RelativeHumidity', 0, 100)
            }
        }, 30000) // 30 second timeout for real API calls
    })

    describe('Weather3 Data Module E2E', () => {
        it('should complete full data flow: updateCwaData -> KV storage -> fetchData -> field validation', async () => {
            // Define field categories for Weather3
            const stringFields = ['StationId', 'StationName', 'Weather', 'VisibilityDescription']
            const dateFields = [
                'ObsTime',
                'Max10MinAverage.Occurred_at',
                'GustInfo.Occurred_at',
                'DailyHigh.Occurred_at',
                'DailyLow.Occurred_at'
            ]
            const floatFields = [
                'Latitude',
                'Longitude',
                'SunshineDuration',
                'Precipitation',
                'WindDirection',
                'WindSpeed',
                'AirTemperature',
                'RelativeHumidity',
                'AirPressure',
                'UVIndex',
                'Max10MinAverage.WindDirection',
                'Max10MinAverage.WindSpeed',
                'GustInfo.WindDirection',
                'GustInfo.PeakGustSpeed',
                'DailyHigh.AirTemperature',
                'DailyLow.AirTemperature'
            ]

            const result = await testCwaDataModule(
                mockKV,
                'weather3',
                Weather3,
                stringFields,
                dateFields,
                floatFields
            )

            if (result) {
                const { station, parsedStations } = result
                // Additional Weather3-specific validations with ranges
                validateFloatField(station.Latitude, 'Latitude', -90, 90)
                validateFloatField(station.Longitude, 'Longitude', -180, 180)
                validateFloatField(station.Precipitation, 'Precipitation', 0, 1000)
                validateFloatField(station.WindDirection, 'WindDirection', 0, 360)
                validateFloatField(station.WindSpeed, 'WindSpeed', -99, 100)
                validateFloatField(station.AirTemperature, 'AirTemperature', -10, 50)
                validateFloatField(station.RelativeHumidity, 'RelativeHumidity', 0, 100)
                validateFloatField(station.UVIndex, 'UVIndex', 0, 15)

                console.log(`Successfully parsed ${parsedStations.length} Weather3 stations`)
            }
        }, 30000)
    })

    describe('Rain2 Data Module E2E', () => {
        it('should complete full data flow: updateCwaData -> KV storage -> fetchData -> field validation', async () => {
            // Define field categories for Rain2
            const stringFields = ['StationId', 'StationName']
            const dateFields = ['ObsTime']
            const floatFields = [
                'Latitude',
                'Longitude',
                'Now',
                'Past10min',
                'Past1hr',
                'Past3hr',
                'Past6hr',
                'Past12hr',
                'Past24hr',
                'Past2days',
                'Past3days'
            ]

            const result = await testCwaDataModule(
                mockKV,
                'rain2',
                Rain2,
                stringFields,
                dateFields,
                floatFields
            )

            if (result) {
                const { station, parsedStations } = result
                // Additional Rain2-specific validations with ranges (all precipitation should be >= 0)
                validateFloatField(station.Latitude, 'Latitude', -90, 90)
                validateFloatField(station.Longitude, 'Longitude', -180, 180)
                validateFloatField(station.Now, 'Now', 0, 1000)
                validateFloatField(station.Past10min, 'Past10min', 0, 1000)
                validateFloatField(station.Past1hr, 'Past1hr', 0, 1000)
                validateFloatField(station.Past3hr, 'Past3hr', 0, 1000)
                validateFloatField(station.Past6hr, 'Past6hr', 0, 1000)
                validateFloatField(station.Past12hr, 'Past12hr', 0, 1000)
                validateFloatField(station.Past24hr, 'Past24hr', 0, 1000)
                validateFloatField(station.Past2days, 'Past2days', 0, 1000)
                validateFloatField(station.Past3days, 'Past3days', 0, 1000)

                console.log(`Successfully parsed ${parsedStations.length} Rain2 stations`)
            }
        }, 30000)
    })

    describe('Stock Data Module E2E', () => {
        it('should complete full data flow: fetchAndSaveStock -> KV storage -> fetchData -> field validation', async () => {
            // Step 1: Call fetchAndSaveStock with September 13th date to fetch real stock data and save to KV
            const fetchDate = new Date('2025-09-15T18:00:00+08:00') // Use September 13th (Friday) for testing
            const saveResult = await fetchAndSaveStock(mockKV as any, 'stock', fetchDate)
            expect(saveResult).not.toBeNull()
            expect(saveResult!.key).toMatch(/^stock-\d{8}$/)
            const savedData = (await getAndCheckSaveData(saveResult!, mockKV)) as StockData

            expect(savedData.IndexValue_5s).toBeDefined()
            expect(savedData.IndexValue_5s).not.toBeNull()
            expect(savedData.IndexValue_5s.length).toBeGreaterThan(1000)
            expect(savedData.TradeVolume_5s).toBeDefined()
            expect(savedData.TradeVolume_5s).not.toBeNull()
            expect(savedData.TradeVolume_5s.length).toBeGreaterThan(1000)

            // Step 3: Create Stock module and test fetchData with mocked fetch
            const stockModule = new Stock()

            // Step 4: Use helper to mock fetchData endpoint call
            // Stock key format is "stock-YYYYMMDD", so we need to parse it differently
            // Stock module also expects a time during trading hours (09:00:00 - 13:30:00)
            const testDate = new Date('2025-09-15T10:00:00+08:00') // Use same date as fetch
            const fetchedData = await mockFetchDataCall(savedData, stockModule, testDate)

            // Step 5: Parse the fetched data (Stock returns JSON string)
            const parsedData = JSON.parse(fetchedData)
            expect(parsedData).toBeDefined()

            // Step 6: Validate Stock data fields comprehensively
            const timeFields = ['時間']
            const indexFields = [
                '發行量加權股價指數',
                '未含金融保險股指數',
                '未含電子股指數',
                '未含金融電子股指數',
                '水泥類指數',
                '食品類指數',
                '塑膠類指數',
                '紡織纖維類指數',
                '電機機械類指數',
                '電器電纜類指數',
                '化學生技醫療類指數',
                '化學類指數',
                '生技醫療類指數',
                '玻璃陶瓷類指數',
                '造紙類指數',
                '鋼鐵類指數',
                '橡膠類指數',
                '汽車類指數',
                '電子類指數',
                '半導體類指數',
                '電腦及週邊設備類指數',
                '光電類指數',
                '通信網路類指數',
                '電子零組件類指數',
                '電子通路類指數',
                '資訊服務類指數',
                '其他電子類指數',
                '建材營造類指數',
                '航運類指數',
                '觀光餐旅類指數',
                '金融保險類指數',
                '貿易百貨類指數',
                '油電燃氣類指數',
                '綠能環保類指數',
                '數位雲端類指數',
                '運動休閒類指數',
                '居家生活類指數',
                '其他類指數'
            ]
            const tradeFields = [
                '累積委託買進筆數',
                '累積委託買進數量',
                '累積委託賣出筆數',
                '累積委託賣出數量',
                '累積成交筆數',
                '累積成交數量',
                '累積成交金額'
            ]

            // Validate time fields (should be in HH:mm:ss format)
            timeFields.forEach((field) => {
                expect(typeof parsedData[field]).toBe('string')
                expect(parsedData[field]).not.toBeNull()
                expect(parsedData[field]).toMatch(/^\d{2}:\d{2}:\d{2}$/)
            })

            // Validate index fields (should be strings that can be parsed as positive numbers)
            indexFields.forEach((field) => {
                validateFloatField(parsedData[field], field, 0, 100000) // Stock indices should be positive
            })

            // Validate trade volume fields (should be strings that can be parsed as non-negative numbers)
            tradeFields.forEach((field) => {
                validateFloatField(parsedData[field], field, 0, Number.MAX_SAFE_INTEGER) // Trade volumes should be non-negative
            })

            console.log(`Successfully validated Stock data structure:`, parsedData)
        }, 30000)
    })
})
