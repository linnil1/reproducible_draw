import { _ } from 'svelte-i18n'

export function getTimeZoneOffsetStr() {
    const date = new Date()
    const offset = -date.getTimezoneOffset()
    const sign = offset >= 0 ? '+' : '-'
    const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0')
    const minutes = String(Math.abs(offset) % 60).padStart(2, '0')
    return `${sign}${hours}${minutes}`
}

export function copyToClipboard(text: string): void {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            alert($_('results.copySuccess'))
        })
        .catch((err) => {
            console.error($_('results.copyFailure'), err)
        })
}

export function splitByFirstSemicolon(input: string) {
    const index = input.indexOf(';')
    if (index === -1) {
        return [input, '']
    }
    return [input.slice(0, index), input.slice(index + 1)]
}

export function dateToStr(now: Date): string {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
}
