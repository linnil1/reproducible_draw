import { _ } from 'svelte-i18n'

export function splitByFirstSemicolon(input: string) {
    const index = input.indexOf(';')
    if (index === -1) {
        return [input, '']
    }
    return [input.slice(0, index), input.slice(index + 1)]
}

export function convertMinutesToTimeZone(offsetMinutes: number): string {
    const sign = offsetMinutes >= 0 ? '+' : '-' // Determine the sign
    const totalMinutes = Math.abs(offsetMinutes)
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0') // Get hours
    const minutes = String(totalMinutes % 60).padStart(2, '0') // Get minutes
    return `${sign}${hours}:${minutes}`
}
