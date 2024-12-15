<script lang="ts">
    import Icon from '@iconify/svelte'
    let { title, children, type = 'normal' } = $props()
    let isExpanded = $state(false)
    function toggleExpand() {
        isExpanded = !isExpanded
    }
    let bgColor = $derived.by(() => {
        if (type === 'normal') return 'bg-gray-50 '
        else if (type === 'warning') return 'bg-yellow-100 '
        else if (type === 'step') return 'bg-white'
        else return 'bg-gray-50 '
    })
</script>

<div class={'container m-4 mx-auto flex flex-col justify-center rounded-lg shadow-lg ' + bgColor}>
    <div class="m-6 flex items-center space-x-2">
        <button
            onclick={toggleExpand}
            class="flex w-full items-center justify-between space-x-1 text-sm font-medium text-gray-800"
        >
            <h3 class="text-2xl">{title}</h3>
            <Icon icon={isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-up'} class="h-8 w-8" />
        </button>
    </div>

    {#if isExpanded}
        <div class="m-8 mt-0 space-y-4">
            {@render children()}
        </div>
    {/if}
</div>
