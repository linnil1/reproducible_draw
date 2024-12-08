export const en = {
    language: {
        en: 'English',
        tw: '正體中文'
    },
    title: 'Reproducible Draw',
    description:
        'A draw system that ensures fairness, transparency, and unpredictability. Using public data and algorithms to generate results that anyone can verify.',
    button: {
        run: 'Run',
        openSettings: 'Open Settings',
        close: 'Close',
        copyToClipboard: 'Copy to Clipboard',
        copyShareLink: 'Copy Sharable Link'
    },
    settings: {
        select: 'Select',
        datetime: 'Date and Time',
        timezone: 'Time Zone',
        itemList: 'Item List (one item per line)',
        selectionCount: 'Number of Items to Select',
        allowDuplicates: 'Allow Duplicate Items',
        allowAdvancedConfig: 'Enable Advanced Setting',
        sortOptions: 'Choose Sorting Option',
        sortByName: 'Sort Alphabetically',
        customOrder: 'Custom Order',
        customOrderDescription: 'Provide details for your custom sorting order'
    },
    results: {
        fetch: {
            unexpectedError: 'An unexpected error occurred while fetching data.',
            keyNotFound:
                'Failed to fetch data because it is not in the database. This might be due to querying future data.',
            dataChanged: 'The data is inconsistent with the same key.',
            invalidTimePer5s: 'The time must be at *:*:*0 or *:*:*5 (available per 5s).',
            invalidTimePerHour: 'The time must be at *:00:00 (available per hour).',
            invalidTimePer10Min:
                'The time must be at *:00:00, *:10:00, *:20:00, *:30:00, *:40:00, or *:50:00.',
            futureTime: 'The specified time is in the future.',
            unavailable:
                'The specified time is more than 30 days ago. Data for dates older than 30 days is not available in our database.',
            outOfTradingTime:
                'The query time is outside trading hours. Trading hours are on weekdays from 09:00 to 13:30.',
            keyNotFoundWithShortSyncTime:
                'Failed to fetch data because it is not yet in the database. Our database is syncing with the data source, and the data will be available shortly.',
            keyNotFoundWithSpecificSyncTime:
                'Failed to fetch data because the original source has not been updated yet. Our service will sync the data at 14:00. Please try again later.'
        },
        result: 'Result',
        step: 'Step',
        module: 'Module',
        implementation: 'Implementation',
        output: 'Output',
        internalState: 'Internal State',
        stepFourDisplay: 'Shown in Step 4',
        errorOccurred: 'An Error Occurred',
        bugReportPrompt: 'Think this is a bug? Report it on GITHUB.',
        copySuccess: 'Copied successfully!',
        copyFailure: 'Copy failed. Please try again.',
        listIsSmaller: 'List length is less than the number to select.'
    },
    data: {
        name: 'Data Retrieval Module',
        title: 'Retrieve Data',
        description: `This module is designed to fetch reliable public data from official sources at specified points in time`
    },
    data_weather3: {
        name: 'Taiwan Weather (Manned Station)',
        description: `## Taiwan Weather Data (Manned Weather Station Data, O-A0003-001)

This module retrieves up-to-date weather data from Taiwan at specific dates and times.  


### Formats:

#### 1. Data Sources:
Weather data is sourced using the following API:  
- **O-A0003-001**: 現在天氣觀測報告 - 有人氣象站資料

You can explore the APIs directly on the CWA Open Data Platform: [Central Weather Administration Open Data API](https://opendata.cwa.gov.tw/dist/opendata-swagger.html).

The weather data is only available per 10 minutes.

#### 2. Stations:
The module retrieves data from all available manned stations. The station list may change depending on the API but we will include all current stations.  

The output JSON lists stations in alphabetical order by \`StationId\`.

#### 3. Data Fields for Each Station:
Each station entry includes the following fields:

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

All values adhere to the [CWA Data Standards Documentation](https://opendata.cwa.gov.tw/opendatadoc/Observation/O-A0001-001.pdf).

#### 4. Handling Missing Data:
If a field is missing in the API response, it will be replaced with \`null\` to maintain a consistent structure and field order across all stations.

#### 5. Output Format:
The final JSON output is compact, without spaces or newlines
`
    },
    data_weather1: {
        name: 'Taiwan Weather (Automated Station)',
        description: `## Taiwan Weather Data (Automated Weather Station Data, O-A0001-001)

This module provides weather data for Taiwan collected from **automated weather stations** at a given date and time.  


### Formats:

#### 1. Data Sources:
Weather data is sourced using the following API:  

- **O-A0001-001**: 自動氣象站資料 - 無人自動站氣象資料

You can explore the APIs directly on the CWA Open Data Platform: [Central Weather Administration Open Data API](https://opendata.cwa.gov.tw/dist/opendata-swagger.html).

The weather data is only available per hour.

#### 2. Stations:
The number of stations may vary depending on the API, but all available automated stations will be included.  

Stations are listed in alphabetical order by \`StationId\`.

#### 3. Data Fields for Each Station:
Each station entry includes the following fields:

\`\`\`json
{
    "ObsTime": "2024-12-03T19:00:00+08:00",
    "StationId": "C0A520",
    "StationName": "山佳",
    "Latitude": 23.589977,
    "Longitude": 120.180400,
    "Weather": "晴",  # currently removed it
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

Values follow the standards outlined in the [CWA Data Standards Documentation](https://opendata.cwa.gov.tw/opendatadoc/Observation/O-A0001-001.pdf).

#### 4. Handling Missing Data:
If a field is missing in the API response, it will be replaced with \`null\` to maintain a consistent structure and field order across all stations.

#### 5. Output Format:
The final JSON output is compact, without spaces or newlines
`
    },
    data_rain2: {
        name: 'Taiwan Rainfall',
        description: `## Taiwan Rain Data (Automated Rainfall Station Data, O-A0002-001)

This module fetches rainfall data for Taiwan at specified times, sourced from **automated rainfall stations**.  


### Formats:

#### 1. Data Sources:
Rainfall data is sourced using the following API:  

- **O-A0002-001**: 自動雨量站資料 - 無人自動站雨量資料

You can explore the APIs directly on the CWA Open Data Platform: [Central Weather Administration Open Data API](https://opendata.cwa.gov.tw/dist/opendata-swagger.html).

The rain data is only available per 10 minutes.

#### 2. Stations:
The number of stations may vary based on the API but will include all currently available automated rainfall stations.  

Stations are listed in alphabetical order by \`StationId\`.

#### 3. Data Fields for Each Station:
Each station entry includes the following fields:

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

Data fields follow the [CWA Data Standards Documentation](https://opendata.cwa.gov.tw/opendatadoc/Observation/O-A0001-001.pdf).

#### 4. Handling Missing Data:
If a field is missing from one of the APIs, it will be filled with \`null\` to maintain consistent structure and field order across stations.

#### 5. Output Format:
The final JSON output is compact, without spaces or newlines
`
    },
    data_stock: {
        name: 'Taiwan Stock Data',
        description: `## Taiwan Stock Data

This module retrieves real-time stock data from Taiwan's stock exchange, including index values and trading volumes.  

### Data Sources:
Stock data is sourced from the following websites:
- [Taiwan Stock Exchange (Index Values, updated every 5 seconds)](https://www.twse.com.tw/zh/indices/taiex/mi-5min-indices.html)
- [Taiwan Stock Exchange (Trade Volumes, updated every 5 seconds)](https://www.twse.com.tw/pcversion/zh/page/trading/exchange/MI_5MINS.html)

Both data sources are updated at 5-second intervals.  
However, these updates are not real-time. The Taiwan Stock Exchange typically updates the data at around 13:40, and our system synchronizes the data at 14:00.

### Data Fields:
This module combines two types of stock data in the following order:
1. **Index Value Fields**: Retains the original field order from the source.
2. **Trade Volume Fields**: Retains the original field order but excludes the time field (to avoid duplication).

### Formats:
The final JSON output includes all fields in the specified order. An example entry is as follows:

\`\`\`json
{
    "時間": "12:00:00",
    "發行量加權股價指數": "23,250.92",
    "未含金融保險股指數": "20,296.21",
    "未含電子股指數": "19,746.79",
    "未含金融電子股指數": "14,887.14",
    "水泥類指數": "158.88",
    "食品類指數": "2,260.18",
    "塑膠類指數": "125.17",
    "紡織纖維類指數": "618.61",
    "電機機械類指數": "388.66",
    "電器電纜類指數": "94.53",
    "化學生技醫療類指數": "136.08",
    "化學類指數": "170.71",
    "生技醫療類指數": "73.70",
    "玻璃陶瓷類指數": "52.61",
    "造紙類指數": "302.38",
    "鋼鐵類指數": "126.68",
    "橡膠類指數": "287.00",
    "汽車類指數": "381.52",
    "電子類指數": "1,279.40",
    "半導體類指數": "649.49",
    "電腦及週邊設備類指數": "283.16",
    "光電類指數": "40.03",
    "通信網路類指數": "166.47",
    "電子零組件類指數": "236.91",
    "電子通路類指數": "254.51",
    "資訊服務類指數": "226.52",
    "其他電子類指數": "181.06",
    "建材營造類指數": "570.16",
    "航運類指數": "205.64",
    "觀光類指數": "119.62",
    "金融保險類指數": "2,138.33",
    "貿易百貨類指數": "295.28",
    "油電燃氣類指數": "58.76",
    "其他類指數": "333.72",
    "累積委託買進筆數": "9,855,272",
    "累積委託買進數量": "37,826,010",
    "累積委託賣出筆數": "11,579,746",
    "累積委託賣出數量": "26,862,295",
    "累積成交筆數": "1,250,078",
    "累積成交數量": "4,806,413",
    "累積成交金額": "254,777"
}
\`\`\`

### Handling Missing Data:
If data is missing, the system will return an error message.

### Output Format:
The final JSON output is compact, with no extra spaces or newlines, to ensure efficient storage and fast processing.`
    },
    hash: {
        name: 'Hashing Module',
        title: 'Hash the data',
        description: `This module provides hash functions to convert input strings into fixed-length outputs through a one-way transformation.

Hash functions are designed to ensure that even a small change in the input data produces a vastly different result, making it computationally infeasible to manipulate the input to achieve a specific desired output.
The resulting hash value is deterministic (consistent for the same input) and suitable for use as a random seed.
`
    },
    hash_sha256: {
        name: 'SHA-256',
        description: `## SHA-256

Applies the SHA-256 cryptographic hash algorithm to a string input, producing a 256-bit (32-byte) hash value. 
For more details, see [Wikipedia](https://en.wikipedia.org/wiki/SHA-2).

### Python Example

\`\`\`python
import hashlib
text = "test"
print(hashlib.sha256(text.encode()).hexdigest())
\`\`\``
    },
    hash_sha512: {
        name: 'SHA-512',
        description: `## SHA-512

Applies the SHA-512 cryptographic hash algorithm to a string input, producing a 512-bit (64-byte) hash value. 
Compared to SHA-256, SHA-512 generates a longer hash, providing a higher level of security against brute-force attacks and making it even more resistant to manipulation.

For more details, see [Wikipedia](https://en.wikipedia.org/wiki/SHA-2).

### Python Example

\`\`\`python
import hashlib
text = "test"
print(hashlib.sha512(text.encode()).hexdigest())
\`\`\``
    },
    generator: {
        name: 'Pseudorandom Number Generator (PRNG) Module',
        title: 'Initialize Random Generator',
        description: `This module provides tools for generating random number sequences. 
The generated numbers are deterministic, meaning the same input seed will always produce the same sequence.
`
    },
    generator_pcg: {
        name: 'PCG',
        description: `## PCG (Permuted Congruential Generator)

PCG is a part of the PCG family, known for efficiently generating high-quality pseudorandom numbers. Developed by Melissa O'Neill, PCG-32 uses a linear congruential generator (LCG) with unique permutations to improve randomness.

For this implementation, we extract the last 128 bits of the provided seed:
- The first 64 bits are used as PCG's seed.
- The last 64 bits are used as PCG's increment (incr).

### References
- Website: [PCG, A Family of Better Random Number Generators](https://www.pcg-random.org/)
- Paper: O'Neill, Melissa E. "PCG: A Family of Simple Fast Space-Efficient Statistically Good Algorithms for Random Number Generation"
- Original C code: [pcg_basic.c](https://github.com/imneme/pcg-c-basic/blob/master/pcg_basic.c)
- JavaScript implementation: [pcg-random](https://github.com/thomcc/pcg-random)

### Python Example
Use [https://github.com/georgeflanagin/pcg32](https://github.com/georgeflanagin/pcg32)

\`\`\`python
def pcg(seed, incr):
    b64 = (1 << 64) - 1
    b31 = (1 << 32) - 1
    k = 6364136223846793005

    # Initialize PCG
    incr = ((incr << 1) | 1) & b64
    state = (((incr + seed) * k) + incr) & b64
    print(f"{state=}, {incr=}")

    while True:
        # Generate number (next32)
        xorshifted = (((state >> 18) ^ state) >> 27) & b31
        rot = state >> 59
        yield ((xorshifted >> rot) | (xorshifted << (((1 << 32) - rot) & 31))) & b31
        state = ((state * k) + incr) & b64

# Convert hash to seed and increment
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
        description: `## MT19937 (Mersenne Twister 19937)

MT19937, also known as the Mersenne Twister, is a widely used pseudorandom number generator (PRNG) with a long period of 2^19937-1. Known for its speed and statistical quality, MT19937 is commonly used in simulations, games, and other applications requiring high-quality random numbers.

For this implementation, we extract the last 32 bits of the provided seed to initialize MT19937.

### References
- Wikipedia: [Mersenne Twister](https://en.wikipedia.org/wiki/Mersenne_Twister)

### Equivalent Code (Python)
Use [https://github.com/tliston/mt19937](https://github.com/tliston/mt19937)

\`\`\`python
from mt19937 import mt19937

hash = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
seed = int("0x" + hash, 16) & ((1 << 32) - 1)
seed = seed if seed else 1  # Ensure non-zero seed
r = mt19937(seed)
print(r.extract_number())
\`\`\``
    },
    random: {
        name: 'Modulo Function',
        title: 'Bound Random Value',
        description: `Generates random values within a specific interval, the random values are from the chosen random generator.`
    },
    random_openbsd: {
        name: 'OpenBSD',
        description: `## OpenBSD Rejection Sampling Method

This method removes modulo bias by using a rejection sampling technique, which ensures a fair distribution of values within a specified interval.

In typical modulo operations, the bias occurs when some values are more likely than others. The OpenBSD method avoids this by discarding values that would introduce bias, a technique known as rejection sampling.

### Equivalent Code(Python)
\`\`\`python
def openbsd(generator, max):
    skew = (1 << 32) % max  # Skew value to correct bias
    while True:
        x = next(generator)
        if x >= skew:      # Accept value if it's not biased
            return x % max
\`\`\`

### References
* https://arxiv.org/abs/1805.10941
* GNU C++ Standard Library (Currently, they used the same approch with above paper)`
    },
    random_divisionless: {
        name: "Lemire's Nearly-Divisionless",
        description: `## Lemire's Nearly Divisionless Algorithm

Fast and Efficient algorithm that reduce modulo operations

### Equivalent Code(Python)
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

### References
* https://arxiv.org/abs/1805.10941`
    },
    sample: {
        name: 'Sampling Module',
        title: 'Select Elements from an Array',
        description: `This module provides operations for selecting elements from arrays. 
When used with an unbiased random module, the sampling algorithm ensures a fair and unbiased selection of elements.`
    },
    sample_fisher_yates_sampling: {
        name: 'Fisher-Yates Sampling',
        description: `## Fisher-Yates Sampling Technique

This technique is a variation of the Fisher-Yates (or Knuth) shuffle algorithm. Instead of shuffling the entire array, it efficiently selects only \`k\` items. The result is equivalent to taking the last \`k\` items (in reverse order) from a fully Fisher-Yates shuffled array. This makes the algorithm more efficient while maintaining an equal probability of selecting each item.

This approach is similar to Python's \`random.sample\` implementation, which can be seen in [Python's source code](https://github.com/python/cpython/blob/main/Lib/random.py).

* Reference: [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).

### Python Example
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

# Example usage
generator = pcg(0, 0)  # Initialize a random number generator
random = lambda max: openbsd(generator, max)
print(fisher_yates_sample(random, [1, 2, 3, 4, 5], 3))
\`\`\``
    },
    sample_reservoir: {
        name: 'Reservoir Sampling',
        description: `## Reservoir Sampling

Reservoir sampling is an efficient algorithm for randomly selecting \`k\` items from a potentially large or unknown-sized data stream. It ensures that every item has an equal probability of being selected, regardless of the total number of elements.

### Python Example
\`\`\`python
def reservoir_sample(random, arr, k):
    reservoir = stream[:k]  # Start with the first k elements
    for i in range(k, len(arr)):
        j = random(i + 1)  # Randomly pick an index
        if j < k:  # Replace an element in the reservoir with probability k/(i+1)
            reservoir[j] = stream[i]
    return reservoir

# Example usage
import random
print(reservoir_sample(random.randint, [1, 2, 3, 4, 5, 6, 7, 8], 3))
\`\`\``
    },
    sample_fisher_yates_shuffle: {
        name: 'First-K-of-Fisher-Yates-Shuffle',
        description: `## Top-K of Knuth Shuffle

Implements the Knuth (or Fisher–Yates) shuffle algorithm for generating a random permutation of an array.
And get the first k elements from the shuffled array. This method is efficient and ensures a fair distribution of elements.

Detailed explanation [here](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).

### Python Example
\`\`\`python
def knuth_shuffle(random, arr, k):
    for i in range(len(arr) - 1, 0, -1):
        j = random(i)
        arr[i], arr[j] = arr[j], arr[i]
    return arr[:k]

# example usage
generator = pcg(0, 0)
random = lambda max: openbsd(generator, max)
print(knuth_shuffle(random, [1, 2, 3, 4, 5], 3))
\`\`\`
`
    },
    sample_naive: {
        name: 'Naive Random Selection with Replacement',
        description: `Selects k random elements from an array with the possibility of repeated samples (replacement). This method is simple and effective for cases where duplicate samples are acceptable.

### Python Example
\`\`\`python
def naive_selection_with_replacement(random, arr, k):
    return [arr[random(len(arr))] for _ in range(k)]

# example usage
generator = pcg(0, 0)
random = lambda max: openbsd(generator, max)
print(naive_selection_with_replacement(random, [1, 2, 3, 4, 5], 3))
\`\`\``
    },
    intro_title: `Introduction`,
    intro: `# Reproducible draw

This is a draw program -- but with a twist!  

Unlike traditional lotteries, this one is both **verifiable by anyone** and **completely unpredictable**.  


## How It Works

Instead of using standard secure random functions, this system relies on **public data**. The data is processed through a hashing algorithm (like SHA256) to generate a **random seed**. This seed is then used with a pseudo-random function to produce a random number, which determines the result.

To use this program, you simply choose a future date and specify the algorithms (like which hash function or random function to use).  
Once these parameters are set, anyone can reproduce the same result based on those inputs.


### Unpredictability

Although we use public data, the key is unpredictability in that data—such as stock prices, weather reports, etc.

Even if someone can partially predict the data, a tiny error will drastically change the hash output.  
And while someone might try to manipulate certain public data, it's impossible to control things like nationwide weather or all stock prices.  

For greater unpredictability, it's recommended to pick a date further in the future.


### Transparency and Fairness

Public data sources like weather or stock prices are accessible to everyone. Using these, anyone can reconstruct the exact input data and verify the process.  

If the public data is tampered with, such changes are usually easy to detect and the result can simply be disregarded.  

Additionally, unlike some other draw systems, this method eliminates risks such as repeated attempts to get a favorable result or hidden backdoors in random seed generation. Once the data source and time are set, the result cannot be altered.


### Reproducibility

Unlike cryptographic random functions (which are secure but not reproducible), this system uses pseudo-random functions.  
As long as the seed remains the same, the generated random number will also remain consistent.  

While pseudo-random numbers aren't truly random, most algorithms are rigorously tested and free from noticeable biases.  

Our platform relies on public data, specified algorithms, and cross-language validation to ensure accuracy and reproducibility.


### Limitations

Though this system works well, it has some constraints:  
- **Weather data** updates every 10 minutes, so it may not be instantaneous.  
- **Stock prices** don't update on non-trading days (e.g., weekends).  

These are minor issues for most use cases, as draw events typically don't need frequent updates.  
To address such scenarios, you can choose alternative algorithms on our platform to generate different results, even using the same public data.


## Conclusion

This system provides a **reproducible draw** that ensures fairness and transparency.  
By selecting a future date and publicly sharing the algorithms and parameters, anyone can verify and reproduce the exact same result.  

This makes the process fair, unbiased, and open for all.
`,
    info: `
## Info

### Website
https://draw.linnil1.me

### Github Repo
https://github.com/linnil1/reproducible_draw

### Author
[linnil1](https://linnil1.tw)
 
### Contact As
Please issue in Github

If not familiar with Github, you can use [Google Sheet](https://docs.google.com/forms/d/e/1FAIpQLSfqUmfd2H0TJ_TUL_9EcOiX8eSCNNH9eblphLITvoOJPs3LOQ/viewform?usp=sf_link) to report.
`,
    privacy: `
## Privacy Policy

### 1. Information Collection

We do not collect personal information on this website. We may collect basic analytics data (e.g., website visits) to improve our website.

### 2. Cookies

Our website does not use cookies.

### 3. Third-party

Our website does not rely on any third-party services.

### 4. Changes

We may update these policies at any time. Updates will be posted on this page.
`,
    tos: `
## Terms of Service

### 1. Usage

You may use this website for informational purposes only. You agree not to misuse the website/API or its content. Programmatic fetching of our API endpoint is discouraged; instead, we encourage you to use the original API provided by the respective data sources.

### 2. Disclaimer

This website is provided "as is" without warranties of any kind. We do not guarantee the accuracy or completeness of the information on this site.

### 3. Source

The data on our website is sourced from official APIs, including but not limited to:

- [Taiwan Central Weather Administration Open Data API](https://opendata.cwa.gov.tw/dist/opendata-swagger.html)
- [Taiwan Stock Exchange (Index Values)](https://www.twse.com.tw/zh/indices/taiex/mi-5min-indices.html)
- [Taiwan Stock Exchange (Trade Volumes)](https://www.twse.com.tw/pcversion/zh/page/trading/exchange/MI_5MINS.html)

We may integrate additional sources in the future to enhance our website’s functionality and provide more comprehensive data.

### 4. Changes

We may update these Terms of Service at any time. Updates will be posted on this page.
`
}
