export const tw = {
    language: {
        en: 'English',
        tw: '正體中文'
    },
    title: '可重現抽獎',
    description:
        '一個保證公平、透明且無法預測的抽獎系統。使用公開資料和演算法生成結果，任何人都可以驗證',
    button: {
        run: '執行',
        openSettings: '開啟設定',
        close: '關閉',
        copyToClipboard: '複製到剪貼簿',
        copyShareLink: '複製分享連結'
    },
    settings: {
        select: '選擇',
        datetime: '日期與時間',
        timezone: '時區',
        itemList: '項目清單（每行一個）',
        selectionCount: '要抽出幾個',
        allowDuplicates: '允許重複',
        allowAdvancedConfig: '允許進階設定',
        sortOptions: '選擇排序選項',
        sortByName: '按UTF-8排序',
        customOrder: '自訂排序',
        customOrderDescription: '提供自訂排序的規則'
    },
    results: {
        fetch: {
            unexpectedError: '跟server拿取資料時發生意外錯誤。',
            keyNotFound: '無法取得天氣資料，因為資料庫中不存在。可能是查詢了未來的資料。',
            dataChanged: '相同時間的資料卻不一致。',
            invalidTimePer10Min:
                '時間必須是 *:00:00、*:10:00、*:20:00、*:30:00、*:40:00 或 *:50:00。',
            invalidTimePerHour: '時間必須是 *:00:00（整點）。',
            futureTime: '使用未來的時間。時間尚未到來，請耐心等待',
            unavailable: '指定的時間超過了 7 天前。資料庫中不提供超過 7 天前資料。'
        },
        result: '結果',
        step: '步驟',
        module: '模組',
        output: '輸出',
        implementation: '選擇的模組',
        internalState: '內部狀態',
        stepFourDisplay: '在步驟4中顯示',
        errorOccurred: '發生錯誤',
        bugReportPrompt: '如果您認為這是錯誤，請在 GITHUB 上提交問題。',
        copySuccess: '複製成功！',
        copyFailure: '複製失敗',
        listIsSmaller: '列表的長度較抽樣的數量還要小。'
    },
    data: {
        name: '資料取得模組',
        title: '資料取得',
        description: `此模組旨在於特定時間點從官方來源獲取可靠的公開資料`
    },
    data_weather3: {
        name: '台灣天氣（有人氣象站）',
        description: `## 台灣天氣資料（有人氣象站資料，O-A0003-001）

此模組從中央氣象署的有人氣象站於指定日期和時間獲取天氣資料。  

### 格式:

#### 1. 資料來源:
天氣資料來源於以下 API：  

- **O-A0003-001**：現在天氣觀測報告 - 有人氣象站資料

API 連結在這裡：[中央氣象署開放資料 API](https://opendata.cwa.gov.tw/dist/opendata-swagger.html)。

該資料每 10 分鐘更新一次

#### 2. 測站:
測站數量可能根據 API 有所不同，所有可用的有人氣象站的資料都會納入。  

輸出的 JSON 中，測站按 \`StationId\` 的字母順序排列。

#### 3. 資料欄位:
每個測站資料包含以下欄位：

\`\`\`json
{
    "ObsTime": "2024-12-03T13:30:00+08:00",
    "StationId": "12J990",
    "StationName": "口湖工作站",
    "Latitude": 23.589977,
    "Longitude": 120.180400,
    "Weather": "晴",
    "VisibilityDescription": "-99",
    "SunshineDuration": -99.0,
    "Precipitation": 0.0,
    "WindDirection": 320.0,
    "WindSpeed": 2.2,
    "AirTemperature": 24.6,
    "RelativeHumidity": 63.0,
    "AirPressure": -99.0,
    "UVIndex": -99.0,
    "Max10MinAverage.Occurred_at": "-99",
    "Max10MinAverage.WindDirection": -99.0,
    "Max10MinAverage.WindSpeed": -99.0,
    "GustInfo.Occurred_at": "-99",
    "GustInfo.WindDirection": -99.0,
    "GustInfo.PeakGustSpeed": -99.0,
    "DailyHigh.AirTemperature": 24.6,
    "DailyHigh.Occurred_at": "2024-12-03T13:26:00+08:00",
    "DailyLow.AirTemperature": 17.4,
    "DailyLow.Occurred_at": "2024-12-03T06:40:00+08:00"
}
\`\`\`

資料欄位的值按照[中央氣象署開放資料平臺資料標準說明文件](https://opendata.cwa.gov.tw/opendatadoc/Observation/O-A0001-001.pdf)規範所實作。

#### 4. 缺失資料處理:
如果 API 回傳的 JSON 中某一欄位缺失，會填上 \`null\`，以確保所有測站的結構和欄位順序一致。

#### 5. 輸出格式:
最終輸出的 JSON 為緊湊格式，無空格和換行
`
    },
    data_weather1: {
        name: '台灣天氣（自動氣象站）',
        description: `## 台灣天氣資料（自動氣象站資料，O-A0001-001）

此模組從中央氣象署的自動氣象站於指定日期和時間獲取天氣資料。  

### 格式:

#### 1. 資料來源:
天氣資料來源於以下 API：  

- **O-A0001-001**：自動氣象站資料 - 無人自動站氣象資料

API 連結在這裡：[中央氣象署開放資料 API](https://opendata.cwa.gov.tw/dist/opendata-swagger.html)。

該資料每 1 小時更新一次

#### 2. 測站:
測站數量可能根據 API 有所不同，所有可用的自動氣象站的資料都會納入。  

測站按 \`StationId\` 的字母順序排列。

#### 3. 資料欄位:
每個測站資料包含以下欄位：

\`\`\`json
{
    "ObsTime": "2024-12-03T19:00:00+08:00",
    "StationId": "C0A520",
    "StationName": "山佳",
    "Latitude": 23.589977,
    "Longitude": 120.180400,
    "Weather": "晴",
    "Precipitation": -99.0,
    "WindDirection": 59.0,
    "WindSpeed": 3.9,
    "AirTemperature": 20.8,
    "RelativeHumidity": 75.0,
    "AirPressure": 1011.9,
    "GustInfo.Occurred_at": "-99",
    "GustInfo.WindDirection": -99.0,
    "GustInfo.PeakGustSpeed": -99.0,
    "DailyHigh.AirTemperature": 25.6,
    "DailyHigh.Occurred_at": "2024-12-03T11:00:00+08:00",
    "DailyLow.AirTemperature": 20.8,
    "DailyLow.Occurred_at": "2024-12-03T19:00:00+08:00"
}
\`\`\`

資料欄位的值按照[中央氣象署開放資料平臺資料標準說明文件](https://opendata.cwa.gov.tw/opendatadoc/Observation/O-A0001-001.pdf)規範所實作。

#### 4. 缺失資料處理:
如果 API 回傳的 JSON 中某一欄位缺失，會填上 \`null\`，以確保所有測站的結構和欄位順序一致。

#### 5. 輸出格式:
最終輸出的 JSON 為緊湊格式，無空格和換行
`
    },
    data_rain2: {
        name: '台灣降雨量',
        description: `## 台灣降雨資料（自動雨量站資料，O-A0002-001）

此模組從中央氣象署的自動雨量站於指定日期和時間獲取天氣資料。  

### 格式:

#### 1. 資料來源:
降雨資料來源於以下 API：  

- **O-A0002-001**：自動雨量站資料 - 無人自動站雨量資料

API 連結在這裡：[中央氣象署開放資料 API](https://opendata.cwa.gov.tw/dist/opendata-swagger.html)。

該資料每 10 分鐘更新一次

#### 2. 測站:
測站數量可能根據 API 有所不同，所有可用的自動雨量站的資料都會納入。  

測站按 \`StationId\` 的字母順序排列。

#### 3. 資料欄位:
每個測站資料包含以下欄位：

\`\`\`json
{
    "ObsTime": "2024-11-14T15:52:00.000Z",
    "StationId": "12J990",
    "StationName": "口湖工作站",
    "Latitude": 23.589977,
    "Longitude": 120.180400,
    "Now": 0.0,
    "Past10min": 0.0,
    "Past1hr": 0.0,
    "Past3hr": 0.0,
    "Past6hr": 0.0,
    "Past12hr": 0.0,
    "Past24hr": 0.0,
    "Past2days": 0.0,
    "Past3days": 0.0
}
\`\`\`

資料欄位的值按照[中央氣象署開放資料平臺資料標準說明文件](https://opendata.cwa.gov.tw/opendatadoc/Observation/O-A0001-001.pdf)規範所實作。

#### 4. 缺失資料處理:
如果 API 回傳的 JSON 中某一欄位缺失，會填上 \`null\`，以確保所有測站的結構和欄位順序一致。

#### 5. 輸出格式:
最終輸出的 JSON 為緊湊格式，無空格和換行
`
    },
    hash: {
        name: '雜湊(Hash)模組',
        title: '對資料進行雜湊(Hash)處理',
        description: `此模組提供雜湊函數，將輸入的字串通過單向轉換轉換為固定長度的輸出。

雜湊函數的設計確保即使輸入數據發生極小的變化，輸出結果會大大不同，使得計算上幾乎無法操縱輸入以達到特定的輸出結果。
生成的雜湊值具有確定性（相同的輸入產生相同的輸出），適合用於隨機種子。
`
    },
    hash_sha256: {
        name: 'SHA-256',
        description: `## SHA-256

SHA-256 是一種密碼學雜湊演算法，將字串輸入轉換為 256 位元（32 bytes）的雜湊值。  
如需更多詳細資訊，請參見 [Wikipedia](https://en.wikipedia.org/wiki/SHA-2)。

### Python 範例

\`\`\`python
import hashlib
text = "test"
print(hashlib.sha256(text.encode()).hexdigest())
\`\`\``
    },
    hash_sha512: {
        name: 'SHA-512',
        description: `## SHA-512

SHA-512 是一種密碼學雜湊演算法，將字串輸入轉換為 512 位元（64 Bytes）的雜湊值。  
相較於 SHA-256，SHA-512 生成更長的雜湊值，提供更高的安全性，能更有效抵禦暴力破解攻擊，並且更加難以操縱輸入來改變結果。

如需更多詳細資訊，請參見 [Wikipedia](https://en.wikipedia.org/wiki/SHA-2)。

### Python 範例

\`\`\`python
import hashlib
text = "test"
print(hashlib.sha512(text.encode()).hexdigest())
\`\`\``
    },
    generator: {
        name: '偽亂數產生器 (PRNG) 模組',
        title: '初始化亂數產生器',
        description: `此模組提供生成亂數序列的工具。
偽亂數所生成的數字是有確定性的(deterministic)，也就是說，相同的輸入種子將始終產生相同的數列。
`
    },
    generator_pcg: {
        name: 'PCG',
        description: `## PCG (Permuted Congruential Generator)

PCG-32 是 PCG 家族的一部分，由 Melissa O'Neill 開發，採用線性同餘生成器 (LCG) 並結合獨特的排列方式來改善隨機性。

在此實作中，我們會從提供的種子中提取最後 128 位元：
- 前 64 位元用作 PCG 的 Seed(種子)。
- 後 64 位元用作 PCG 的 increment。

### 參考資料
- 網站：[PCG, A Family of Better Random Number Generators](https://www.pcg-random.org/)
- 論文：O'Neill, Melissa E. "PCG: A Family of Simple Fast Space-Efficient Statistically Good Algorithms for Random Number Generation"
- 原始 C 程式碼：[pcg_basic.c](https://github.com/imneme/pcg-c-basic/blob/master/pcg_basic.c)
- JavaScript 實作：[pcg-random](https://github.com/thomcc/pcg-random)

### Python 範例
\`\`\`python
def pcg(seed, incr):
    b64 = (1 << 64) - 1
    b31 = (1 << 32) - 1
    k = 6364136223846793005

    # 初始化 PCG
    incr = ((incr << 1) | 1) & b64
    state = (((incr + seed) * k) + incr) & b64
    print(f"{state=}, {incr=}")

    while True:
        # 生成數字 (next32)
        xorshifted = (((state >> 18) ^ state) >> 27) & b31
        rot = state >> 59
        yield ((xorshifted >> rot) | (xorshifted << (((1 << 32) - rot) & 31))) & b31
        state = ((state * k) + incr) & b64

# 將雜湊轉換為 state 和 incr
hash = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
b64 = (1 << 64) - 1
seed = (int("0x" + hash, 16) >> 64) & b64
incr = (int("0x" + hash, 16)) & b64
g = pcg(seed, incr)
print(next(g))
print(next(g))
\`\`\``
    },
    generator_mt19937: {
        name: 'MT19937',
        description: `## MT19937 (梅森旋轉演算法 19937)

MT19937，也稱為梅森旋轉演算法，是一種廣泛使用的偽隨機數生成器 (PRNG)，其週期長達 2^19937-1。由於其速度快且統計品質高，MT19937 常用於模擬、遊戲和其他需要高品質隨機數的應用中。

在此實作中，我們會從提供的種子中提取最後 32 位元來初始化 MT19937。

### 參考資料
- Wikipedia：[梅森旋轉演算法](https://en.wikipedia.org/wiki/Mersenne_Twister)

### Python 範例
使用 [https://github.com/tliston/mt19937](https://github.com/tliston/mt19937)

\`\`\`python
from mt19937 import mt19937

hash = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
seed = int("0x" + hash, 16) & ((1 << 32) - 1)
seed = seed if seed else 1  # 確保種子非零
r = mt19937(seed)
print(r.extract_number())
print(r.extract_number())
\`\`\``
    },
    random: {
        name: '同餘(Modulo)函數',
        title: '限制隨機值範圍',
        description: `將隨機生成器的隨機值限縮在在特定區間。`
    },
    random_openbsd: {
        name: 'OpenBSD',
        description: `## OpenBSD的拒絕採樣法 (rejection sampling)

此方法通過使用拒絕採樣 (rejection sampling) 消除同餘運算中的偏差，確保在指定區間內的值都有相同的機率

在同餘運算中，有可能選擇到某些值的機率較高。OpenBSD 方法通過丟棄可能引入誤差的值來避免這種情況，這種技術被稱為拒絕採樣。

### Python 等效程式碼
\`\`\`python
def openbsd(generator, max):
    skew = (1 << 32) % max  # 校正偏差的值
    while True:
        x = next(generator)
        if x >= skew:      # 當值無偏差時接受
            return x % max
\`\`\`

### 參考資料
* https://arxiv.org/abs/1805.10941
* GNU C++ 標準庫 (目前採用了與上述論文相同的方法)
`
    },
    random_divisionless: {
        name: "Lemire's 趨近無除法",
        description: `## Lemire 的趨近無除法(Divisionless)演算法

因為大量減少除法、同餘(Modulo)的計算，所以較快速。

### Python 等效程式碼
\`\`\`python
def divisionless(generator, max):
    b32 = (1 << 32) - 1

    x = next(generator)
    m = x * max
    l = m & b32

    if l < max:
        threshold = ((1 << 32) - max) % max
        while l < threshold:
            x = next(generator)
            m = x * max
            l = m & b32

    return m >> 32
\`\`\`

### 參考資料
* https://arxiv.org/abs/1805.10941
`
    },
    sample: {
        name: '取樣模組',
        title: '從列表中取樣',
        description: `此模組用於處理從列表中取樣的操作。
當與無偏的隨機模組搭配使用時，取樣演算法可以確保選取每筆資料的方法是無偏誤的(Unbiased)。`
    },
    sample_fisher_yates_shuffle: {
        name: 'Fisher-Yates 亂數洗牌法',
        description: `## 使用 Fisher-Yates 洗牌 並選取前 K 個

使用 Fisher–Yates（或 Knuth）洗牌演算法，隨機排列資料，並從洗牌後的列表中選取前 K 筆。此方法已證明分佈是公平的。

詳細見 [Wikipedia](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)。

### Python 範例
\`\`\`python
def fisher_yates_shuffle(random, arr, k):
    for i in range(len(arr) - 1, 0, -1):
        j = random(i)
        arr[i], arr[j] = arr[j], arr[i]
    return arr[:k]

# 使用範例
generator = pcg(0, 0)
random = lambda max: openbsd(generator, max)
print(fisher_yates_shuffle(random, [1, 2, 3, 4, 5], 3))
\`\`\``
    },
    sample_fisher_yates_sampling: {
        name: 'Fisher-Yates 取樣法',
        description: `## Fisher-Yates 取樣法

此演算法基於 Fisher-Yates 洗牌，但不對整個列表進行洗牌，只選取 \`k\`個項目。
其結果等同於從完全洗牌的列表中選取最後的 \`k\` 筆資料。

此方法與 Python 的 \`random.sample\` 實作類似，詳細內容可見 [Python 原始碼](https://github.com/python/cpython/blob/main/Lib/random.py)。

### Python 等效程式碼
\`\`\`python
def fisher_yates_sample(random, arr, k):
    result = []
    for i in range(len(arr), 1, -1):
        j = random(i)
        result.append(arr[j])
        if len(result) == k:
            return result
        arr[j] = arr[i-1]
    return result

# 使用範例
generator = pcg(0, 0)
random = lambda max: openbsd(generator, max)
print(fisher_yates_sample(random, [1, 2, 3, 4, 5], 3))
\`\`\``
    },
    sample_naive: {
        name: '簡單隨機選取（可重複）',
        description: `從陣列中隨機選取 \`k\` 筆，允許選取重複的項目（可重複取樣）。

### Python 範例
\`\`\`python
def naive_selection_with_replacement(random, arr, k):
    return [arr[random(len(arr))] for _ in range(k)]

# 使用範例
generator = pcg(0, 0)
random = lambda max: openbsd(generator, max)
print(naive_selection_with_replacement(random, [1, 2, 3, 4, 5], 3))
\`\`\``
    },
    intro: `# 可重現抽獎

這是一個抽獎程式，沒錯！  

但是，與一般常見的抽獎不同，  
這個抽獎可以被任何人驗證，  
而且完全無法預測。  


## 如何運作

我們不使用安全專用的隨機函數，而是採用公開的資料，經過 Hash (如 SHA256) 後產生隨機種子 (random seed)，  
再利用偽隨機函數 (pseudo-random function) 帶入隨機種子，生成隨機數字作為抽獎結果。

使用此抽獎程式時，只需要指定一個未來時間，
並決定要使用的 Hash、random 等演算法 (algorithm)。  
所有人都可以依據該參數重現出一樣的結果。


### 不可預測性

雖然我們採用的是公開資料，但只要資料中有不可預測性，  
就可以用於抽獎。 例如：股票價格、天氣等。

即使你能部分預測公開資料，但只要有些許誤差，  
經過 Hash 後的結果就會截然不同。  
即使你能部分操作公開資料，
但沒有人可以操控全台灣的天氣或所有股票價格。

建議使用此抽獎程式時，選擇越遠的未來時間，越能保證不可預測性。


### 透明性與公正性

我們採用公開資料（如股票價格、天氣資料），這些數字每個人都能取得。  
而且根據公開格式，可以準確生成我們 Hash 前的文字，進而重現整個過程。  

公開資料若有人試圖竄改，修改通常容易被發現，進而捨棄該結果。  

第二點是，不像其他網站，可能有人可以重複抽獎直到滿意結果， 
或者在隨機種子的產生留下後門。
因為我們已經說好特定時間的資料了，只要訂好資料時間，結果就不可能改變。


### 可重現性

加密專用的隨機函數的確很亂很安全，但這也讓我們無法重現整個流程。  

我們使用的是偽隨機函數，只要種子 (seed) 固定，
生成的隨機值也會固定，因此結果可完全重現。
雖然他是偽隨機，但是大部分的偽亂數都有論文背書不會有明顯的 bias 請不用擔心。

我們的網站透過公開資料、宣稱的演算法、實作方式再加上提供多語言交叉驗證，  
確保結果是正確的。


### 缺陷

雖然此方法看似完美，但仍有一些局限：  
- **天氣** 大概每 10 分鐘更新一次。  
- **股票** 遇到休市（如周末）將無法更新。  

這些限制目前無法完全解決，  
但一般抽獎頻率也不會這麼高，倒是不用太擔心
如果需要，我們的網站可以讓你選擇其他演算法，
即便使用相同公開資料，也能得出不同結果。


## 結論

這是一個可重現的抽獎網站，  
只需選擇未來時間和演算法並公開，  
每個人都能根據這些參數重現完全相同的結果，  
實現公平、公正、公開。
`,
    info: `
## 資訊

### Github
https://github.com/linnil1/reproducible_draw

### 作者
[linnil1](https://linnil1.tw)

### 聯繫我們
請在 Github 提出 Issue

如果您不熟悉 Github，可以透過 [Google 表單](https://docs.google.com/forms/d/e/1FAIpQLSepk3nqxEQ8QHw-FkF-uXVJm9aQOEk7Dl6Cp79WIhUsJTHTPQ/viewform?usp=sf_link)回報
`,
    privacy: `
## 隱私政策

### 1. 資訊收集

我們不會在本網站上收集個人資訊。但我們可能收集基本的分析數據（例如，網站訪問量）以改進我們的網站。

### 2. Cookie

我們的網站不使用 Cookie。

### 3. 第三方服務

我們的網站不依賴任何第三方服務。

### 4. 更新

我們可能會隨時更新這些政策。更新將發布在此頁面上。
`,
    tos: `
## 服務條款

### 1. 使用規範

您可以僅將本網站用於資訊用途。您同意不濫用本網站/API 或其內容。不建議以程式化方式抓取我們的 API 資料，我們建議您直接使用相關數據來源提供的原始 API。

### 2. 免責聲明

本網站按“現狀”提供，並不提供任何形式的保證。我們不保證網站資訊的準確性或完整性。

### 3. 資料來源

本網站的數據來自官方 API，包括但不限於：

- [臺灣中央氣象署開放資料 API](https://opendata.cwa.gov.tw/dist/opendata-swagger.html)

未來，我們可能會整合其他資料來源，以增強網站功能並提供更全面的數據。

### 4. 更新

我們可能會隨時更新這些服務條款。更新將發布在此頁面上。
`
}
