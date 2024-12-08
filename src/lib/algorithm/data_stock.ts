import { Status, type DataResult } from '$lib/status'
import { addDays, format, isSameDay, isWeekend } from 'date-fns'
import { TZDate } from '@date-fns/tz'
import { Data } from './data'

export class Stock extends Data {
    private data: any

    getName(): string {
        return 'data_stock'
    }

    check(date: Date): DataResult {
        const now = new TZDate(new Date(), 'Asia/Taipei')
        const taiwanDate = new TZDate(date, 'Asia/Taipei')
        const taiwanDateStr = parseInt(format(taiwanDate, 'HHmm'))
        const nowStr = parseInt(format(taiwanDate, 'HHmm'))

        // Check if it's a weekday (Monday to Friday)
        if (isWeekend(taiwanDate)) {
            return {
                status: Status.FAIL,
                text: 'results.fetch.outOfTradingTime'
            }
        }
        if (taiwanDateStr < 900 || taiwanDateStr > 1330) {
            return {
                status: Status.FAIL,
                text: 'results.fetch.outOfTradingTime'
            }
        }
        if (taiwanDate.getSeconds() % 5 != 0) {
            return {
                status: Status.FAIL,
                text: 'results.fetch.invalidTimePer5s'
            }
        }

        if (date < addDays(now, -7)) {
            return {
                status: Status.FAIL,
                text: 'results.fetch.unavailable'
            }
        }

        if (date > now) {
            return {
                status: Status.PENDING,
                text: 'results.fetch.futureTime'
            }
        }

        // Check if the date is today
        if (isSameDay(taiwanDate, now) && nowStr < 1400) {
            // 14:00
            return {
                status: Status.PENDING,
                text: 'results.fetch.keyNotFoundWithSpecificSyncTime'
            }
        }

        // If all checks pass
        return {
            status: Status.SUCCESS,
            text: ''
        }
    }

    async fetchData(date: Date): Promise<string> {
        const taiwanDate = new TZDate(date, 'Asia/Taipei')
        const params = new URLSearchParams({
            datetime: format(taiwanDate, 'yyyyMMdd')
        })
        const response = await fetch(`/data/stock?${params.toString()}`)
        const responseData = await response.json()
        this.data = responseData
        if (responseData.status != 'ok') {
            throw new Error(responseData.status)
        }
        const time = format(taiwanDate, 'HH:mm:ss')

        const dataIndexValue = JSON.parse(this.data.IndexValue_5s)
        // {"stat":"OK","date":"20241206","title":"113年12月06日 每5秒指數統計","fields":["時間","發行量加權股價指數","未含金融保險股指數","未含電子股指數","未含金融電子股指數","水泥類指數","食品類指數","塑膠類指數","紡織纖維類指數","電機機械類指數","電器電纜類指數","化學生技醫療類指數","化學類指數","生技醫療類指數","玻璃陶瓷類指數","造紙類指數","鋼鐵類指數","橡膠類指數","汽車類指數","電子類指數","半導體類指數","電腦及週邊設備類指數","光電類指數","通信網路類指數","電子零組件類指數","電子通路類指數","資訊服務類指數","其他電子類指數","建材營造類指數","航運類指數","觀光餐旅類指數","金融保險類指數","貿易百貨類指數","油電燃氣類指數","綠能環保類指數","數位雲端類指數","運動休閒類指數","居家生活類指數","其他類指數"],"data":[["09:00:00","23,267.94","20,311.07","19,730.89","14,862.39","159.02","2,261.29","125.38","617.28","389.33","93.65","136.71","169.98","74.44","53.74","301.58","126.22","285.16","382.31","1,281.16","651.72","281.24","39.96","165.78","236.58","252.69","220.74","181.74","558.68","204.60","119.20","2,139.89","294.43","58.64","113.64","64.46","100.62","120.50","334.19"],["09:00:05","23,278.68","20,321.51","19,737.78","14,870.30","159.02","2,266.96","125.40","619.53","389.29","93.68","136.72","170.04","74.44","53.75","301.69","126.26","285.16","382.50","1,281.81","651.66","281.72","40.01","165.82","236.67","252.74","220.09","182.53","559.25","204.61","119.22","2,139.94","294.50","58.64","113.64","64.46","100.71","120.50","334.25"]],"total":3241}
        const dataTradeVolume = JSON.parse(this.data.TradeVolume_5s)
        // {"stat":"OK","date":"20241206","title":"113年12月06日每5秒委託成交統計","fields":["時間","累積委託買進筆數","累積委託買進數量","累積委託賣出筆數","累積委託賣出數量","累積成交筆數","累積成交數量","累積成交金額"],"data":[["09:00:00","375,030","4,942,341","396,403","1,800,088","0","0","0"],["09:00:05","381,181","4,844,448","401,420","1,826,261","13,986","47,405","7,156"]]}
        const rowIndexValue = dataIndexValue.data.filter((item: any) => item[0] === time)
        const rowTradeVolume = dataTradeVolume.data.filter((item: any) => item[0] === time)
        // must be one row
        if (rowIndexValue.length !== 1 || rowTradeVolume.length !== 1) {
            throw new Error('results.fetch.keyNotFoundAtSpecificTime')
        }

        // Exclude time from TradeVolume
        const mergedFields = [...dataIndexValue.fields, ...dataTradeVolume.fields.slice(1)]
        const mergedData = [...rowIndexValue[0], ...rowTradeVolume[0].slice(1)]
        const mergedObject: Record<string, string> = {}
        mergedFields.forEach((field, index) => {
            mergedObject[field] = mergedData[index]
        })
        return JSON.stringify(mergedObject)
    }

    getState(): string {
        return `Original Data (Fetched at ${this.data.FetchTime}):\n${this.data.IndexValue_5s}\n${this.data.TradeVolume_5s}`
    }
}
