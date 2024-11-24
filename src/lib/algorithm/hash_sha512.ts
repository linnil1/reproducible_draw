import { Hash } from './hash'
import sha512 from 'crypto-js/sha512'
import utf8 from 'crypto-js/enc-utf8'

export class SHA512 extends Hash {
    private hashStr: string = ''
    getName(): string {
        return 'hash_sha512'
    }

    hash(input: string): string {
        const encoded = utf8.parse(input)
        const hash = sha512(encoded)
        this.hashStr = hash.toString()
        return hash.toString()
    }

    hashNum(input: string): BigInt {
        const hashStr = this.hash(input)
        const hashValue = BigInt('0x' + hashStr)
        return hashValue
    }

    getState(): string {
        return this.hashStr
    }
}
