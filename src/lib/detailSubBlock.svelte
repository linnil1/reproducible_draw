<script lang="ts">
    import Icon from '@iconify/svelte'
    import { Carta, Markdown } from 'carta-md'
    const carta = new Carta()
    let { title, type, value = '', children } = $props()

    let bgColor = $derived.by(() => {
        if (type === 'modules') return 'bg-blue-50 '
        else if (type === 'module') return 'bg-green-100 '
        else if (type === 'state') return 'bg-gray-100'
        else if (type === 'output') return 'bg-yellow-100'
        else return 'bg-gray-50 '
    })
    let borderColor = $derived.by(() => {
        if (type === 'modules') return 'border-blue-300 '
        else if (type === 'module') return 'border-green-300 '
        else if (type === 'state') return 'border-gray-300'
        else if (type === 'output') return 'border-yellow-300'
        else return 'bg-gray-300 '
    })
</script>

<div class="mb-2">
    <p class="font-medium text-gray-600">{title}:</p>
    <div class={`ml-4 border-l-4 p-2 ${borderColor} ${bgColor}`}>
        {#if value}
            <article class="markdown-m prose">
                <Markdown {carta} {value} />
            </article>
        {/if}
        {@render children?.()}
    </div>
</div>

<style>
    .markdown-m {
        margin-top: -2rem;
        margin-bottom: -1rem;
    }
</style>
