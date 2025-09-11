<script lang="ts">
    import { goto, replaceState } from '$app/navigation'
    import { page } from '$app/state'
    import Icon from '@iconify/svelte'
    import { locale, locales, _, isLoading } from 'svelte-i18n'
    import '../app.css'
    import '$lib/i18n'
    let { children } = $props()

    let languageToggler: boolean = $state(false)

    function changeLanguage(lang: string) {
        $locale = lang
        page.url.searchParams.set('lang', $locale)
        replaceState(page.url, page.state)
        languageToggler = false
    }

    const title = $derived($_('title'))
    const description = $derived($_('description'))
    const url = 'https://draw.linnil1.me'
</script>

{#if $isLoading}
    Wait for loading
{:else}
    <!-- -->
    <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
        <!-- Language Dropdown -->
        <div class="relative">
            <button
                class="rounded bg-gray-800 px-4 py-2 text-white shadow-md transition hover:bg-gray-700"
                onclick={() => (languageToggler = !languageToggler)}
            >
                <Icon icon="material-symbols:language" style="text-gray-700" />
            </button>
            {#if languageToggler}
                <ul
                    class="absolute bottom-full right-0 mb-2 w-40 overflow-hidden rounded border border-gray-200 bg-white shadow-lg"
                >
                    {#each $locales as locale}
                        <li class="px-4 py-2 hover:bg-gray-100">
                            <button class="h-full w-full" onclick={() => changeLanguage(locale)}>
                                {$_('language.' + locale)}
                            </button>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>

        <!-- Redirect Button -->
        <div>
            {#if page.url.pathname == '/'}
                <button
                    onclick={() => {
                        goto(`/info?${page.url.searchParams}`)
                    }}
                    class="rounded bg-blue-500 px-4 py-2 text-white shadow-md transition hover:bg-blue-600"
                >
                    <Icon icon="material-symbols:info-outline" style="text-gray-700" />
                </button>
            {:else}
                <button
                    onclick={() => goto(`/?${page.url.searchParams}`)}
                    class="rounded bg-blue-500 px-4 py-2 text-white shadow-md transition hover:bg-blue-600"
                >
                    <Icon icon="material-symbols:home" style="text-gray-700" />
                </button>
            {/if}
        </div>
    </div>
    <div style={'font-family: ' + ($locale == 'tw' ? '"Noto Sans TC"' : 'inherit')}>
        {@render children()}
    </div>
{/if}

<svelte:head>
    <!-- Meta Tags -->
    <title>{title}</title>
    <meta name="author" content="linnil1" />
    <meta name="description" content={description} />
    <meta
        name="keywords"
        content="Reproducible Draw, Fair Lottery, Transparent Algorithm, Public Data, Pseudo-Random Function, Hashing Algorithm, Fairness"
    />

    <!-- Open Graph Tags -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={url + '/favicon.jpg'} />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={url + '/favicon.jpg'} />
</svelte:head>
