export const en = {
    data: {
        name: 'Data Retrieval Module',
        title: 'Retrieve Data',
        description: `A module designed for fetching data at specific points in time. 
The data can be accessed and verified for accuracy. 
It is suitable for applications where data reproducibility and validation are required.`
    },
    data_weather: {
        name: 'Taiwan Weather',
        description: `## Taiwan Weather Data

This module retrieves comprehensive weather data for Taiwan at a specified date and time.

### Formats:

#### 1. Data Sources:
The weather data is fetched from Taiwan's Central Weather Bureau (CWB) using the following APIs: 
- **O-A0003-001**: Weather data

You can explore these APIs directly on the CWB Open Data Platform: [Central Weather Bureau Open Data API](https://opendata.cwa.gov.tw/dist/opendata-swagger.html).

#### 2. Stations:
The number of stations may changed because of api, but all the station will be included

The output JSON lists all available stations in alphabetical order by \`StationId\`.

#### 3. Data Fields for Each Station:
Each station entry includes the following fields:

\`\`\`
{
    "ObsTime": "2024-11-14T15:52:00.000Z",
    "StationId": "12J990",
    "StationName": "口湖工作站",
    "lat": 23.589977,
    "lon": 120.1804,
    "Weather": "陰",
    "Precipitation": 0,
    "WindDirection": 20,
    "WindSpeed": 4,
    "AirTemperature": 24,
    "RelativeHumidity": 82,
    "AirPressure": -99,
    "GustInfo": 8.9,
    "DailyHigh": 27.7,
    "DailyLow": 22.1,
    "VisibilityDescription": "-99",
    "SunshineDuration": -99,
    "UVIndex": -99,
}
\`\`\`

Values are defined according to the [CWB Data Standards Documentation](https://opendata.cwa.gov.tw/opendatadoc/Observation/O-A0001-001.pdf).

#### 4. Handling Missing Data:
If a field is missing from one of the APIs, it will be filled with \`null\` to maintain consistent structure and field order across stations.

#### 5. Output Format:
The final JSON output is compact, without spaces or newlines, for efficient storage and transfer.`
    },

    data_rain: {
        name: 'Taiwan Rain',
        description: `## Taiwan Rain Data

This module retrieves comprehensive rain data for Taiwan at a specified date and time.

### Formats:

#### 1. Data Sources:
The weather data is fetched from Taiwan's Central Weather Bureau (CWB) using the following APIs: 
- **O-A0002-001**: Rain Data

You can explore these APIs directly on the CWB Open Data Platform: [Central Weather Bureau Open Data API](https://opendata.cwa.gov.tw/dist/opendata-swagger.html).

#### 2. Stations:
The number of stations may changed because of api, but all the station will be included

The output JSON lists all available stations in alphabetical order by \`StationId\`.

#### 3. Data Fields for Each Station:
Each station entry includes the following fields:

\`\`\`
{
    "ObsTime": "2024-11-14T15:52:00.000Z",
    "StationId": "12J990",
    "StationName": "口湖工作站",
    "lat": 23.589977,
    "lon": 120.1804,
    "Now": 0,
    "Past10min": 0,
    "Past1hr": 0,
    "Past3hr": 0,
    "Past6hr": 0,
    "Past12hr": 0,
    "Past24hr": 0,
    "Past2days": 0,
    "Past3days": 0
}
\`\`\`

Values are defined according to the [CWB Data Standards Documentation](https://opendata.cwa.gov.tw/opendatadoc/Observation/O-A0001-001.pdf).

#### 4. Handling Missing Data:
If a field is missing from one of the APIs, it will be filled with \`null\` to maintain consistent structure and field order across stations.

#### 5. Output Format:
The final JSON output is compact, without spaces or newlines, for efficient storage and transfer.`
    },
    hash: {
        name: 'Hashing Module',
        title: 'Hash the data',
        description: `This module provides cryptographic functions to convert input strings into unpredictable hash outputs. 
It ensures that even a small change in input data produces a vastly different result, 
making it difficult to manipulate the data to achieve a specific output. 
The resulting hash is suitable as a random seed for subsequent steps.`
    },
    hash_sha256: {
        name: 'SHA-256',
        description: `## SHA-256

Applies the SHA-256 cryptographic hash algorithm to a string input, producing a 256-bit (32-byte) hash value. 
This ensures a one-way transformation commonly used for secure data verification and digital signatures. 
See [Wikipedia](https://en.wikipedia.org/wiki/SHA-256).

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
It offers greater security compared to SHA-256, making it suitable for applications that require stronger cryptographic assurance. 
See [Wikipedia](https://en.wikipedia.org/wiki/SHA-2).

### Python Example

\`\`\`python
import hashlib

def sha512_hash(text):
    return hashlib.sha512(text.encode()).hexdigest()

print(sha512_hash('test'))
\`\`\``
    },
    generator: {
        name: 'Pseudorandom Number Generator (PRNG) Module',
        title: 'Initialize random generator',
        description: `This module provides tools for generating sequences of pseudorandom numbers. 
It includes various algorithms that produce statistically random results using an initial seed value to ensure reproducibility.`
    },
    generator_pcg: {
        name: 'PCG',
        description: `## PCG (Permuted Congruential Generator)

PCG is part of the PCG family, known for producing high-quality pseudorandom numbers efficiently. Developed by Melissa O'Neill, PCG-32 uses a linear congruential generator (LCG) with unique permutations for improved randomness.

More information can be found
* website: "PCG, A Family of Better Random Number Generators", https://www.pcg-random.org/
* paper: O'Neill, Melissa E. "PCG: A Family of Simple Fast Space-Efficient Statistically Good Algorithms for Random Number Generation"

### Python Example
\`\`\`python
# hash to seed
hash = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
b64 = (1 << 64) - 1
seed = (int("0x" + hash, 16) >> 64) & b64
incr = (int("0x" + hash, 16)      ) & b64

# init PCG
k = 6364136223846793005
incr = ((incr << 1) | 1) & b64
state = (((incr + seed) * k) + incr) & b64
print(f"{state=}, {incr=}")

# next32
b31 = (1 << 32) - 1
xorshifted = (((state >> 18) ^ state) >> 27) & b31
rot = state >> 59
print("next", ((xorshifted >> rot) | (xorshifted << (((2 ** 32) - rot) & 31))) & b31)
state = ((state * k) + incr) & b64
\`\`\``
    },
    generator_mt19937: {
        name: 'MT19937',
        description: `## MT19937 (Mersenne Twister 19937)

The MT19937, also known as the Mersenne Twister, is a widely used pseudorandom number generator (PRNG) with a long period of 2^19937-1. Known for its speed and statistical quality, MT19937 is often used in simulations, games, and other applications requiring high-quality random numbers.

### Equivalent Code(Python)
Use https://github.com/tliston/mt19937
\`\`\`python
from mt19937 import mt19937
hash = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
seed = int("0x" + hash, 16) & ((1<<32)-1)
seed = seed if seed else 1
r = mt19937(seed)
print(r.extract_number())
\`\`\`

Reference
* https://en.wikipedia.org/wiki/Mersenne_Twister`
    },
    random: {
        name: 'Random Modulo Function',
        title: 'Bound Random Value',
        description: `Generates random values within a specific interval, using a chosen random generator.`
    },
    random_openbsd: {
        name: 'OpenBSD',
        description: `## OpenBSD Unbiased Modulo Method

This method removes modulo bias by using a rejection sampling technique, which ensures a fair distribution of values within a specified interval.

### Algorithm Explanation
In typical modulo operations, the bias occurs when some values are more likely than others. The OpenBSD method avoids this by discarding values that would introduce bias, a technique known as rejection sampling.

### Equivalent Code(Python)
\`\`\`python
def openbsd(generator, m):
    skew = (1 << 32) % m  # Skew value to correct bias
    while True:
        x = generator.random()
        if x >= skew:      # Accept value if it's not biased
            return x % m
\`\`\`

### References
* https://arxiv.org/abs/1805.10941
* GNU C++ Standard Library (currently, they used the same approch with above paper)`
    },
    random_divisionless: {
        name: 'Divisionless',
        description: `## Lemire's Nearly Divisionless Algorithm

Fast and Efficient algorithm that reduce modulo operations

### Equivalent Code(Python)
\`\`\`python
def divisionless(max):
    b32 = (1<<32) - 1

    x = generator.random()
    m = x * max
    l = m & b32

    if l < max:
        threshold = ((1<<32) - max) % max
        while l < threshold:
            x = generator.random()
            m = x * max
            l = m & b32

    return m >> 32
\`\`\`

### References
* https://arxiv.org/abs/1805.10941`
    },
    sample: {
        name: 'Sampling Module',
        title: 'Select elements from array',
        description: `This module handles operations for selecting elements from arrays. 
When paired with an unbiased random module, the selection algorithm ensures an unbiased method of choosing elements.`
    },
    sample_knuth: {
        name: 'First-K-of-Knuth-Shuffle',
        description: `## Top-K of Knuth Shuffle

Implements the Knuth (or Fisher–Yates) shuffle algorithm for generating a random permutation of an array.
And get the first k elements from the shuffled array. This method is efficient and ensures a fair distribution of elements.

Detailed explanation [here](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).

### Python Example
\`\`\`python
def knuth_shuffle(arr, k):
    for i in range(len(arr) - 1, 0, -1):
        j = randint(0, i)
        arr[i], arr[j] = arr[j], arr[i]
    return arr[:k]

print(knuth_shuffle([1, 2, 3, 4, 5]))
\`\`\``
    },
    sample_knuth_sampling: {
        name: 'Knuth-Sampling',
        description: `## Knuth Sampling

This algorithm is based on the Knuth Shuffle, but instead of shuffling the entire array, it selects only \`k\` items. The result is equivalent to taking the last \`k\` items from a fully shuffled array, making it efficient for sampling without needing to shuffle the whole list.

This approach is similar to Python's \`random.sample\` implementation, which can be seen in [Python's source code](https://github.com/python/cpython/blob/main/Lib/random.py).

### Equivalent Code(Python)
\`\`\`python
def knuth_sample(arr, k):
    result = []
    for i in range(len(arr), 1, -1):
        j = randint(0, i)
        result.append(arr[j])
        if len(result) == k:
            return result
        arr[j] = arr[i-1]
    return result

# Sample usage
print(knuth_sample([1, 2, 3, 4, 5], 3))
\`\`\``
    },
    sample_naive: {
        name: 'Naive Random Selection with Replacement',
        description: `Selects k random elements from an array with the possibility of repeated samples (replacement). This method is simple and effective for cases where duplicate samples are acceptable.

### Python Example
\`\`\`python
import random

def naive_selection_with_replacement(array, k):
    return [random.choice(array) for _ in range(k)]

print(naive_selection_with_replacement([1, 2, 3, 4, 5], 3))
\`\`\``
    },
    intro_title: `Introduction`,
    intro: `# Reproducible Draw

Is this just another lucky draw website?  
Yes, but here, **EVERYONE can validate the results**.

### Transparency

Most traditional cryptographic randomness methods aim to generate unpredictable values that no person or machine can easily reproduce or guess. However, our approach leverages unpredictability based on observable, publicly verifiable data—such as weather conditions or stock market values. 

### Reproducibility and Fairness

By clearly specifying the **data source, timing, and algorithm** used for each draw, we ensure that anyone can independently reproduce and verify the results. This transparency guarantees that the outcome is fair, consistently reproducible, and verifiable by anyone interested.

## How It Works

Our approach replaces hidden cryptographic randomness with observable real-world data as the seed source (e.g., weather or stock market data). This data is hashed using methods like SHA-256 to produce a seed for the random generator. Even if someone could anticipate the data source, slight discrepancies—such as a small fluctuation in temperature or stock price—would drastically alter the resulting seed, ensuring unpredictability.

## Why This Approach?

1. **Transparency**: By using public data, our randomness process is open for everyone to check. Unlike hidden systems where seeds or algorithms can be kept secret or changed, our approach makes it nearly impossible for anyone to tamper with the outcome. Changing data like weather conditions or stock prices to influence the result is very difficult and easy to spot.

2. **Avoiding Cheating**: Some cryptographic systems can be manipulated by testing seeds repeatedly until a desired outcome is achieved or by using hidden methods or backdoors. By contrast, using real-world data makes the system resistant to manipulation. There is no easy way to alter weather or stock data to control the outcome.

3. **Reproducibility**: We openly share all algorithmic details and implementation specifications, including Python code alongside JavaScript outputs, so users can verify results independently. By disclosing the data source, timing, and algorithm, anyone can retrace the steps, apply the exact data and algorithm, and confirm the outcome.

## Constraints and Flexibility

Real-world data often has limited availability:
   - **Weather data** updates every 10 minutes.
   - **Stock data** is typically available every second, but can be delayed over weekends and holidays.

To accommodate these constraints, we offer various random generators and algorithms that, even when using the same data source, can produce completely different results.

## Conclusion

Our system combines reproducibility and transparency in a way that’s verifiable by anyone. By basing randomness on publicly available data, we achieve an unprecedented level of fairness and accountability. This method empowers users to validate each draw’s outcome, knowing that the results were generated with integrity and without the possibility of tampering.
`
}
