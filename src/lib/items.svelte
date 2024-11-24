<script lang="ts">
    import { tick } from 'svelte'
    let { datas } = $props()
    let margin = $state(1)
    let container = $state()
    let itemWidth = $state(8)
    let textSize = $state(1)
    let prevSize = $state(0)

    $effect(async () => {
        // Make the items responible by data size
        if (prevSize != datas.length) {
            prevSize = datas.length
            margin = 1
            itemWidth = 8
            textSize = 1
        } else {
            return
        }

        while (true) {
            await tick()
            // const wantedHeight = document.querySelector("#items").parentElement.clientHeight
            // const realHeight = document.querySelector("#items").parentElement.scrollHeight
            const wantedHeight = container.parentElement.clientHeight
            const realHeight = container.parentElement.scrollHeight
            console.log(realHeight, wantedHeight)
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
    })
</script>

<div
    bind:this={container}
    class="flex flex-wrap"
    style="
            row-gap: {margin * 0.8}rem;
        "
>
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
                class="absolute bottom-1 right-1 text-gray-500"
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
