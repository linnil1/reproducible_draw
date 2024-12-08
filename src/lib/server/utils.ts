import type { KVNamespace } from '@cloudflare/workers-types'

const SavedTTL = 86400 * 32

export async function saveToKv(kv: KVNamespace, key: string, data) {
    await kv.put(key, JSON.stringify(data), {
        expirationTtl: SavedTTL
    })
}
