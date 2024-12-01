import { addMessages, init, getLocaleFromQueryString } from 'svelte-i18n'

import { en } from './en'
import { tw } from './tw'
addMessages('en', en)
addMessages('tw', tw)

init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromQueryString('lang')
})
