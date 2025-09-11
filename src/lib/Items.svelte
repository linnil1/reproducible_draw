<script lang="ts">
    import { onMount, tick, untrack } from 'svelte'
    let { datas } = $props()
    let container = $state()
    let margin = $state(1)
    let itemWidth = $state(8)
    let textSize = $state(1)
    let needResize = $state(false)

    const resize = async () => {
        // console.log('Resize')
        // Make the items responible by data size
        margin = 1
        itemWidth = 8
        textSize = 1

        while (true) {
            await tick()
            // const wantedHeight = document.querySelector("#items").parentElement.clientHeight
            // const realHeight = document.querySelector("#items").parentElement.scrollHeight
            const wantedHeight = container.parentElement.clientHeight
            const realHeight = container.parentElement.scrollHeight
            // console.log(realHeight, wantedHeight)
            if (realHeight <= wantedHeight) {
                break
            }
            if (margin > 0.1) {
                margin -= 0.1
                continue
            }
            if (itemWidth > 4) {
                itemWidth -= 1
                continue
            }
            if (textSize > 0.1) {
                textSize -= 0.1
                continue
            }
            break
        }
    }

    $effect(async () => {
        if (needResize) {
            needResize = false
            await resize()
        }
    })

    // consider debounce, use user event to avoid infinite tracking
    let resizeTimeout = $state()
    let prevSize = $state(0)
    $effect(() => {
        // if length changed
        if (datas.length > 0 && prevSize !== datas.length) {
            prevSize = datas.length
            const resizeEvent = new Event('resize')
            setTimeout(() => window.dispatchEvent(resizeEvent), 200)
        }
    })
    onMount(() => {
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(() => {
                needResize = true
            }, 1000)
        })
    })
</script>

<div class="min-h-64">
    <div bind:this={container} class="flex flex-wrap" style="row-gap: {margin * 0.8}rem;">
        {#each datas as data}
            <div
                class="relative flex-shrink-0 overflow-hidden border bg-white"
                style="
                    width: {itemWidth}rem;
                    font-size: {textSize}rem;
                    margin-left: {margin}rem;
                    margin-right: {margin}rem;
                    padding: {textSize * 0.4}rem;
                "
            >
                {data[1]}
                <span
                    class="absolute right-1 bottom-1 text-gray-500"
                    style="
                        font-size: {textSize * 0.8}rem;
                        user-select: none;
                    "
                >
                    #{data[0] + 1}
                </span>
            </div>
        {/each}
    </div>
</div>
