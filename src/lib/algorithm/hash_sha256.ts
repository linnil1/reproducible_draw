import sha256 from 'crypto-js/sha256'
import utf8 from 'crypto-js/enc-utf8'
import { Hash } from './hash'

export class SHA256 extends Hash {
    private hashStr: string = ''

    getName(): string {
        return 'hash_sha256'
    }

    hash(input: string): string {
        const encoded = utf8.parse(input)
        const hash = sha256(encoded)
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
