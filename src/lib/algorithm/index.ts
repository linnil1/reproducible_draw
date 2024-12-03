import { Modules } from './modules'

import type { Data } from './data'
import { Weather3 } from './data_weather3'
import { Rain2 } from './data_rain2'
import { Weather1 } from './data_weather1'

import type { Hash } from './hash'
import { SHA256 } from './hash_sha256'
import { SHA512 } from './hash_sha512'

import type { Generator } from './generator'
import { PCG } from './generator_pcg'
import { Mt19937 } from './generator_mt19937'

import type { Random } from './random'
import { OpenBsdRejection } from './random_openbsd'
import { Divisionless } from './random_divisionless'

import type { Sample } from './sample'
import { FisherYatesShuffle } from './sample_fisher_yates_shuffle'
import { FisherYatesSampling } from './sample_fisher_yates'
import { ReservoirSampling } from './sample_reservoir'
import { NaiveChoice } from './sample_naive'

// Note: First one is default
const datas = new Modules<Data>('data')
datas.register(new Weather3())
datas.register(new Rain2())
datas.register(new Weather1())

const hashs = new Modules<Hash>('hash')
hashs.register(new SHA256())
hashs.register(new SHA512())
const generators = new Modules<Generator>('generator')
generators.register(new PCG())
generators.register(new Mt19937())

const randoms = new Modules<Random>('random')
randoms.register(new OpenBsdRejection())
randoms.register(new Divisionless())
const samples = new Modules<Sample>('sample')
samples.register(new FisherYatesSampling())
samples.register(new FisherYatesShuffle())
// samples.register(new ReservoirSampling())
samples.register(new NaiveChoice())
export { datas, samples, generators, randoms, hashs }
