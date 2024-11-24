<script lang="ts">
    import { _ } from 'svelte-i18n'
    import { onMount, tick } from 'svelte'
    import SveltyPicker from 'svelty-picker'
    import { Carta, Markdown } from 'carta-md'
    import { datas, hashs, generators, randoms, samples } from '$lib/algorithm'
    import type { Step } from '$lib/step'
    import ListImplement from '$lib/list_implement.svelte'
    import Block from '$lib/block.svelte'
    import Items from '$lib/items.svelte'
    import type { Modules } from '$lib/algorithm/modules'
    import type { Sample } from '$lib/algorithm/sample'

    const carta = new Carta({})

    let selectedDate: string = $state('')
    let selectedData: string = $state(datas.listName()[0])
    let selectedHash: string = $state(hashs.listName()[0])
    let selectedRandom: string = $state(randoms.listName()[0])
    let selectedGenerator: string = $state(generators.listName()[0])
    let selectedSample: string = $state(samples.listName()[0])
    let allowDuplicated: boolean = $state(false)
    let sortOption: string = $state('alphabet')
    let sortOptionText: string = $state('manual')
    let configurationToggle: boolean = $state(false)
    let samplesWithDupOption: Modules<Sample> = $derived(
        samples.clone((i) => i.allowDuplicated() == allowDuplicated)
    )
    let selectedItemNumber: number = $state(123)
    // let itemListStr: string = $state('1\n2\n3') // next line split
    let itemListStr: string = $state(
        '2\n3\n5\n7\n11\n13\n17\n19\n23\n29\n31\n37\n41\n43\n47\n53\n59\n61\n67\n71\n73\n79\n83\n89\n97\n101\n103\n107\n109\n113\n127\n131\n137\n139\n149\n151\n157\n163\n167\n173\n179\n181\n191\n193\n197\n199\n211\n223\n227\n229\n233\n239\n241\n251\n257\n263\n269\n271\n277\n281\n283\n293\n307\n311\n313\n317\n331\n337\n347\n349\n353\n359\n367\n373\n379\n383\n389\n397\n401\n409\n419\n421\n431\n433\n439\n443\n449\n457\n461\n463\n467\n479\n487\n491\n499\n503\n509\n521\n523\n541\n547\n557\n563\n569\n571\n577\n587\n593\n599\n601\n607\n613\n617\n619\n631\n641\n643\n647\n653\n659\n661\n673\n677\n683\n691\n701\n709\n719\n727\n733\n739\n743\n751\n757\n761\n769\n773\n787\n797\n809\n811\n821\n823\n827\n829\n839\n853\n857\n859\n863\n877\n881\n883\n887\n907\n911\n919\n929\n937\n941\n947\n953\n967\n971\n977\n983\n991\n997'
    )
    let items: string[] = $derived(
        itemListStr
            .split('\n')
            .map((item) => item.trim())
            .filter((i) => i)
    )
    let pipelineDetails: Step<any>[] = $state([])
    let timeZone = $state('UTC+0')
    let results: number[] = $state([])
    let resultsInfo: string = $state('null')

    onMount(() => {
        // const now = new Date()
        const now = new Date('2024-11-22T11:10:00')
        selectedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
        timeZone = 'GMT' + getTimeZoneOffsetStr()
    })

    $effect(() => {
        if (!samplesWithDupOption.listName().includes(selectedSample)) {
            selectedSample = samplesWithDupOption.list()[0].getName()
        }
    })

    function getTimeZoneOffsetStr() {
        const date = new Date()
        const offset = -date.getTimezoneOffset()
        const sign = offset >= 0 ? '+' : '-'
        const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0')
        const minutes = String(Math.abs(offset) % 60).padStart(2, '0')
        return `${sign}${hours}${minutes}`
    }

    async function submitPipeline() {
        try {
            const date = new Date(`${selectedDate}:00${getTimeZoneOffsetStr()}`)
            const dataModule = datas.get(selectedData)
            const hashModule = hashs.get(selectedHash)
            const generatorModule = generators.get(selectedGenerator)
            const randomModule = randoms.get(selectedRandom)
            const sampleModule = samples.get(selectedSample)
            // console.log(selectedDate, timeZone)
            // console.log(itemListStr)

            // Run the pipeline
            pipelineDetails = []
            resultsInfo = dataModule.check(date)
            if (resultsInfo !== 'Pass') {
                return
            }
            const data = await dataModule.fetch(date)
            pipelineDetails.push({
                step: 'Step1: ' + $_(datas.getI18nTitle()),
                modules: datas,
                module: dataModule,
                state: dataModule.getState(),
                output: data
            })

            // Step 2: Hashing
            const hashValue = hashModule.hashNum(data)
            pipelineDetails.push({
                step: 'Step2: ' + $_(hashs.getI18nTitle()),
                modules: hashs,
                module: hashModule,
                state: '',
                output: hashModule.getState()
            })

            // Step 3: Seed for Random

            const randomState = generatorModule.setSeed(hashValue)
            pipelineDetails.push({
                step: 'Step3: ' + $_(generators.getI18nTitle()),
                modules: generators,
                module: generatorModule,
                state: randomState,
                output: 'Shown in step4'
            })

            randomModule.setGenerator(generatorModule)
            pipelineDetails.push({
                step: 'Step3.1: ' + $_(randoms.getI18nTitle()),
                modules: randoms,
                module: randomModule,
                state: '',
                output: '(empty)'
            })

            // Step 4: Selection
            const resultList = sampleModule.sample(randomModule, items.length, selectedItemNumber)
            pipelineDetails.push({
                step: 'Step4: ' + $_(samples.getI18nTitle()),
                modules: samples,
                module: sampleModule,
                state: sampleModule.getState(),
                output: resultList.join(', ')
            })
            results = resultList
            pipelineDetails[3].output = randomModule.getState()
        } catch (e) {
            resultsInfo =
                'Encounter Error: ' +
                e.toString() +
                '\n Please open ISSUE on GITHUB if you think it is a BUG'
        }

        setTimeout(() => {
            window.scrollTo({
                top: window.innerHeight, // 100vh in pixels
                behavior: 'smooth'
            })
        }, 200)
    }

    function copyToClipboard(text: string): void {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                alert('Text copied to clipboard!')
            })
            .catch((err) => {
                console.error('Failed to copy text: ', err)
            })
    }
</script>

<!-- Main Part -->
<div class="flex h-screen items-center justify-center">
    <div
        class="container mx-auto flex max-h-screen flex-col justify-center space-y-4 overflow-hidden p-1 md:w-8/12"
    >
        <!-- Main.Summary -->
        <p class="mx-auto p-2 text-center text-2xl font-semibold">
            To ensure fairness, we use
            <span class="font-bold">{$_(datas.get(selectedData).getI18nName())}</span> data at
            <span class="font-bold">{selectedDate}({timeZone})</span> and apply
            <span class="font-bold">{$_(hashs.get(selectedHash).getI18nName())}</span> as a random
            seed. The random generator
            <span class="font-bold">{$_(generators.get(selectedGenerator).getI18nName())}</span>
            method and modulo method
            <span class="font-bold">{$_(randoms.get(selectedRandom).getI18nName())}</span> is used
            with the
            <span class="font-bold">{$_(samples.get(selectedSample).getI18nName())}</span> to select
            <span class="font-bold">{allowDuplicated ? 'duplicatable' : 'non-duplicated'}</span>
            <span class="font-bold">{selectedItemNumber}</span> items from the
            <span class="font-bold">{items.length}</span>-element list sorted by
            <span class="font-bold">
                {sortOption === 'alphabet'
                    ? 'alphabetical order'
                    : sortOptionText || 'manual method'}
            </span>
            shown below.
        </p>
        <div class="mx-2 overflow-scroll">
            <Items datas={items.map((item, i) => [i, item])} />
        </div>
        <!-- Main.Submit Button -->
        <div class="flex justify-center space-x-4">
            <button
                onclick={submitPipeline}
                class="w-5/12 rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600"
            >
                Run
            </button>
            <button
                onclick={() => {
                    configurationToggle = !configurationToggle
                }}
                class="w-5/12 rounded bg-gray-500 p-2 text-white transition hover:bg-gray-600"
            >
                Configure
            </button>
        </div>
    </div>
</div>

<div
    class={`fixed left-0 top-0 z-40 h-screen transform overflow-scroll bg-white shadow-lg transition-transform duration-300 ${configurationToggle ? 'translate-x-0' : '-translate-x-full'}`}
>
    <label class="m-4 block">
        Date & Time:
        <SveltyPicker
            autocommit={true}
            manualInput={true}
            inputClasses="w-full bg-white border border-gray-300 rounded-lg p-1 hover:border-blue-400 focus:outline-none focus:border-blue-500"
            mode="datetime"
            format="yyyy-mm-dd hh:ii"
            bind:value={selectedDate}
        />
        Time Zone: <span>{timeZone}</span>
    </label>
    <ListImplement bind:value={selectedData} modules={datas} />
    <ListImplement bind:value={selectedHash} modules={hashs} />
    <ListImplement bind:value={selectedGenerator} modules={generators} />
    <ListImplement bind:value={selectedRandom} modules={randoms} />
    <ListImplement bind:value={selectedSample} modules={samplesWithDupOption} />
    <label class="m-4 block">
        Items (newline-separated):
        <textarea
            bind:value={itemListStr}
            class="h-32 w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
        ></textarea>
    </label>

    <label class="m-4 block">
        Number of Items to Select:
        <input
            type="number"
            bind:value={selectedItemNumber}
            min="1"
            class="w-full rounded border p-1 focus:border-blue-500 focus:outline-none"
        />
    </label>

    <label class="m-4 block flex items-center">
        Allow Duplicated
        <input
            type="checkbox"
            bind:checked={allowDuplicated}
            class="ml-2 rounded border p-1 focus:border-blue-500 focus:outline-none"
        />
    </label>

    <label class="m-4 block">
        Sort Options:
        <select
            bind:value={sortOption}
            class="w-full rounded border bg-white p-1 hover:border-blue-400 focus:border-blue-500 focus:outline-none"
        >
            <option value="alphabet">Sort by Alphabet</option>
            <option value="manual">Sort Manually</option>
        </select>

        {#if sortOption === 'manual'}
            <label for="manualSortText" class="block text-sm font-medium text-gray-700">
                Enter your manual sorting explanation:
            </label>
            <textarea
                id="manualSortText"
                bind:value={sortOptionText}
                class="w-full rounded border bg-white p-1 hover:border-blue-400 focus:border-blue-500 focus:outline-none"
                placeholder="Explain your sorting method here..."
            ></textarea>
        {/if}
    </label>

    <div class="m-2">
        <button
            class="w-full rounded bg-gray-500 p-2 text-white transition hover:bg-gray-600"
            onclick={() => {
                configurationToggle = false
            }}
        >
            Close
        </button>
    </div>
</div>
{#if configurationToggle}
    <button
        class="fixed inset-0 z-30 bg-black bg-opacity-50"
        aria-label="close the configuration"
        onclick={() => {
            configurationToggle = false
        }}
    ></button>
{/if}

<!-- Second Page -->
{#if resultsInfo !== 'null'}
    <div class="container mx-auto flex w-full flex-col overflow-hidden md:w-8/12">
        <div
            class=" flex max-h-screen flex-col items-center justify-start space-y-4 overflow-hidden p-2"
        >
            <h3 class="my-4 text-2xl font-semibold text-gray-800">Result</h3>
            <div class="mx-2 max-h-full w-full flex-grow overflow-scroll">
                <!-- Main.Result -->
                {#if resultsInfo !== 'Pass'}
                    <div>{resultsInfo}</div>
                {/if}
                {#if results.length}
                    <Items datas={results.map((i) => [i, items[i]])} />
                {/if}
            </div>
            {#if results.length}
                <button
                    class="w-5/12 rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                    onclick={() => copyToClipboard(results.map((i) => items[i]).join('\n'))}
                >
                    Copy Result to clipboard
                </button>
            {/if}
        </div>

        <!-- Step by Step -->
        {#if pipelineDetails.length}
            {#each pipelineDetails as detail}
                <Block title={detail.step}>
                    <div class="mb-2">
                        <div class="ml-4 border-l-4 border-gray-300 bg-gray-50 p-2">
                            <article class="prose">
                                <Markdown {carta} value={$_(detail.modules.getI18nDescription())} />
                            </article>
                        </div>
                    </div>

                    <div class="mb-2">
                        <p class="font-medium text-gray-600">Chosen Module:</p>
                        <div class="ml-4 border-l-4 border-blue-300 bg-blue-50 p-2">
                            <article class="prose max-w-prose">
                                <Markdown {carta} value={$_(detail.module.getI18nDescription())} />
                            </article>
                        </div>
                    </div>

                    <div>
                        {#if detail.state}
                            <p class="font-medium text-gray-600">Inner State:</p>
                            <div class="relative">
                                <p
                                    class="ml-4 max-h-32 overflow-scroll break-words border-l-4 border-blue-500 bg-blue-50 p-2 text-sm text-blue-700"
                                >
                                    {@html detail.state.replace(/\n/g, '<br>')}
                                </p>
                                <button
                                    class="absolute right-2 top-2 rounded bg-blue-500 p-1 text-xs text-white hover:bg-blue-600"
                                    onclick={() => copyToClipboard(detail.state)}
                                >
                                    Copy
                                </button>
                            </div>
                        {/if}

                        <p class="font-medium text-gray-600">Output:</p>
                        <div class="relative">
                            <p
                                class="ml-4 max-h-32 overflow-scroll break-words border-l-4 border-blue-500 bg-blue-50 p-2 text-sm text-blue-700"
                            >
                                {@html detail.output.replace(/\n/g, '<br>')}
                            </p>
                            <button
                                class="absolute right-2 top-2 rounded bg-blue-500 p-1 text-xs text-white hover:bg-blue-600"
                                onclick={() => copyToClipboard(detail.output)}
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </Block>
            {/each}
        {/if}
    </div>
{/if}
