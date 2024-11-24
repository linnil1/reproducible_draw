import { Modules } from './modules'

import type { Data } from './data'
import { Weather } from './data_weather'
import { Rain } from './data_rain'

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
import { Knuth } from './sample_knuth'
import { KnuthSampling } from './sample_knuth_sampling'
import { NaiveChoice } from './sample_naive'

const datas = new Modules<Data>('data')
datas.register(new Weather())
datas.register(new Rain())

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
samples.register(new Knuth())
samples.register(new KnuthSampling())
samples.register(new NaiveChoice())
export { datas, samples, generators, randoms, hashs }