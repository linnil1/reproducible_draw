import { KVNamespace } from '@cloudflare/workers-types'
declare global {
    namespace App {
        interface Platform {
            env: {
                data_draw: KVNamespace
                CWA_KEY: string
            }
        }
    }
}
export {}
