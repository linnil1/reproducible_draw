<script lang="ts">
    import { goto, replaceState } from '$app/navigation'
    import { page } from '$app/stores'
    import Icon from '@iconify/svelte'
    import { locale, locales, _, isLoading } from 'svelte-i18n'
    import '../app.css'
    import '$lib/i18n'
    let { children } = $props()

    let languageToggler: boolean = $state(false)

    function changeLanguage(lang: string) {
        $locale = lang
        $page.url.searchParams.set('lang', $locale)
        replaceState($page.url, $page.state)
        languageToggler = false
    }
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
            {#if $page.url.pathname == '/'}
                <button
                    onclick={() => {
                        goto(`/info?${$page.url.searchParams}`)
                    }}
                    class="rounded bg-blue-500 px-4 py-2 text-white shadow-md transition hover:bg-blue-600"
                >
                    <Icon icon="material-symbols:info-outline" style="text-gray-700" />
                </button>
            {:else}
                <button
                    onclick={() => goto(`/?${$page.url.searchParams}`)}
                    class="rounded bg-blue-500 px-4 py-2 text-white shadow-md transition hover:bg-blue-600"
                >
                    <Icon icon="material-symbols:home" style="text-gray-700" />
                </button>
            {/if}
        </div>
    </div>
    {@render children()}
{/if}
