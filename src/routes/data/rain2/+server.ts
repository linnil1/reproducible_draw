import { createCwaEndpoint } from '$lib/server/data_cwa'

const rain2 = createCwaEndpoint('rain2', 'O-A0002-001', {
    RainfallElement: 'Now,Past10Min,Past1hr,Past3hr,Past6hr,Past12hr,Past24hr,Past2days,Past3days'
})

export async function GET({ platform, url }) {
    return rain2['GET']({ platform, url })
}

export async function POST({ platform, request }) {
    return rain2['POST']({ platform, request })
}
