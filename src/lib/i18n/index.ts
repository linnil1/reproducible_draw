import { register, init, getLocaleFromNavigator } from 'svelte-i18n'

import { en } from './en'
register('en', async () => en)

init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator()
})
