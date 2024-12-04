<script lang="ts">
    import { Carta, Markdown } from 'carta-md'
    const carta = new Carta()

    import { replaceState } from '$app/navigation'
    import { _, locale } from 'svelte-i18n'
    import { page } from '$app/stores'
    import { onMount, tick } from 'svelte'
    import SveltyPicker from 'svelty-picker'
    import { datas, hashs, generators, randoms, samples } from '$lib/algorithm'
    import type { Step } from '$lib/step'
    import ModulesSelector from '$lib/ModulesSelector.svelte'
    import Block from '$lib/DetailBlock.svelte'
    import BlockSub from '$lib/DetailSubBlock.svelte'
    import Items from '$lib/Items.svelte'
    import type { Modules } from '$lib/algorithm/modules'
    import type { Sample } from '$lib/algorithm/sample'
    import { Module } from '$lib/algorithm/module'
    import { Status, type DataResult } from '$lib/status'
    import {
        copyToClipboard,
        dateToStr,
        getTimeZoneOffsetStr,
        splitByFirstSemicolon
    } from '$lib/utils'

    // user selected state
    let timeZone = $state('UTC+0')
    let selectedDate: string = $state('')
    let selectedData: string = $state(datas.listName()[0])
    let selectedHash: string = $state(hashs.listName()[0])
    let selectedRandom: string = $state(randoms.listName()[0])
    let selectedGenerator: string = $state(generators.listName()[0])
    let selectedSample: string = $state(samples.listName()[0])
    let allowDuplicated: boolean = $state(false)
    let selectedSortOption: string = $state('alphabet')
    let selectedSortOptionText: string = $state('manual')
    let selectedItemNumber: number = $state(123)
    let allowAdvancedConfig: boolean = $state(false)

    // state
    let itemListStr: string = $state('1\n2\n3')
    // let itemListStr: string = $state( '2\n3\n5\n7\n11\n13\n17\n19\n23\n29\n31\n37\n41\n43\n47\n53\n59\n61\n67\n71\n73\n79\n83\n89\n97\n101\n103\n107\n109\n113\n127\n131\n137\n139\n149\n151\n157\n163\n167\n173\n179\n181\n191\n193\n197\n199\n211\n223\n227\n229\n233\n239\n241\n251\n257\n263\n269\n271\n277\n281\n283\n293\n307\n311\n313\n317\n331\n337\n347\n349\n353\n359\n367\n373\n379\n383\n389\n397\n401\n409\n419\n421\n431\n433\n439\n443\n449\n457\n461\n463\n467\n479\n487\n491\n499\n503\n509\n521\n523\n541\n547\n557\n563\n569\n571\n577\n587\n593\n599\n601\n607\n613\n617\n619\n631\n641\n643\n647\n653\n659\n661\n673\n677\n683\n691\n701\n709\n719\n727\n733\n739\n743\n751\n757\n761\n769\n773\n787\n797\n809\n811\n821\n823\n827\n829\n839\n853\n857\n859\n863\n877\n881\n883\n887\n907\n911\n919\n929\n937\n941\n947\n953\n967\n971\n977\n983\n991\n997')
    let autoRun = $state(false)
    let showConfiguration: boolean = $state(false)
    let samplesWithDupOption: Modules<Sample> = $derived(
        samples.clone((i) => i.allowDuplicated() == allowDuplicated)
    )
    let items: string[] = $derived.by(() => {
        let newItems = itemListStr
            .split('\n')
            .map((item) => item.trim())
            .filter((i) => i)
        if (selectedSortOption === 'alphabet') {
            return newItems.sort((a, b) => a.localeCompare(b))
        }
        return newItems
    })

    let pipelineDetails: Step<Module>[] = $state([])
    let resultItems: number[] = $state([])
    let resultsInfo: DataResult = $state({
        status: Status.NULL,
        text: ''
    })

    function setParam() {
        $page.url.searchParams.set('date', selectedDate)
        $page.url.searchParams.set('data', selectedData)
        $page.url.searchParams.set('hash', selectedHash)
        $page.url.searchParams.set('generator', selectedGenerator)
        $page.url.searchParams.set('random', selectedRandom)
        $page.url.searchParams.set('sample', selectedSample)
        $page.url.searchParams.set('allowDuplicated', allowDuplicated.toString())
        $page.url.searchParams.set('sortOption', selectedSortOption)
        $page.url.searchParams.set('sortOptionText', selectedSortOptionText)
        $page.url.searchParams.set('itemNumber', selectedItemNumber.toString())
        $page.url.searchParams.set('itemList', items.join('\n'))
        $page.url.searchParams.set('allowAdvancedConfig', allowAdvancedConfig.toString())
        // $page.url.searchParams.set('autoRun', 'true')
        replaceState($page.url, $page.state)
    }

    function loadParam() {
        const params = $page.url.searchParams
        if (params.get('date')) selectedDate = params.get('date')
        itemListStr = params.get('items') || '1\n2\n3'
        selectedData = params.get('data') || datas.listName()[0]
        selectedGenerator = params.get('generator') || generators.listName()[0]
        selectedRandom = params.get('random') || randoms.listName()[0]
        selectedSample = params.get('sample') || samples.listName()[0]
        selectedSortOptionText = params.get('sortOptionText') || 'manual'
        selectedSortOption = params.get('sortOption') || 'alphabet'
        try {
            selectedItemNumber = parseInt(params.get('itemNumber'), 10) || 1
        } catch (e) {
            selectedItemNumber = 1
        }
        // We watch duplicatable option, make it last one to load
        allowDuplicated = params.get('allowDuplicated') === 'true'
        // The last is allowAdvancedConfig
        // It may set advanced setting to default
        allowAdvancedConfig = params.get('allowAdvancedConfig') === 'true'
        autoRun = params.get('autoRun') === 'true'
    }

    onMount(() => {
        const now = new Date()
        now.setSeconds(0)
        now.setMinutes(Math.floor(now.getMinutes() / 10) * 10)
        selectedDate = dateToStr(now)
        timeZone = 'GMT' + getTimeZoneOffsetStr()
        loadParam()
        if (autoRun) {
            submitPipeline()
        }
    })

    $effect(() => {
        if (!samplesWithDupOption.listName().includes(selectedSample)) {
            selectedSample = samplesWithDupOption.list()[0].getName()
        }
    })

    $effect(() => {
        if (allowAdvancedConfig == false) {
            selectedHash = hashs.listName()[0]
            selectedRandom = randoms.listName()[0]
            selectedGenerator = generators.listName()[0]
            selectedSample = samples.listName()[0]
        }
    })

    async function submitPipeline() {
        try {
            // Make sure all the var is set
            await tick()
            const date = new Date(`${selectedDate}${getTimeZoneOffsetStr()}`)
            const dataModule = datas.get(selectedData)
            const hashModule = hashs.get(selectedHash)
            const generatorModule = generators.get(selectedGenerator)
            const randomModule = randoms.get(selectedRandom)
            const sampleModule = samples.get(selectedSample)
            setParam()

            // Run the pipeline
            resultItems = []
            pipelineDetails = []
            resultsInfo = dataModule.check(date)
            if (resultsInfo.status !== Status.SUCCESS) {
                return
            }
            const data = await dataModule.fetchData(date)
            pipelineDetails.push({
                step: $_('results.step') + '1: ' + $_(datas.getI18nTitle()),
                modules: datas,
                module: dataModule,
                state: dataModule.getState(),
                output: data
            })

            // Step 2: Hashing
            const hashValue = hashModule.hashNum(data)
            pipelineDetails.push({
                step: $_('results.step') + '2: ' + $_(hashs.getI18nTitle()),
                modules: hashs,
                module: hashModule,
                state: '',
                output: hashModule.getState()
            })

            // Step 3: Seed for Random

            const randomState = generatorModule.setSeed(hashValue)
            pipelineDetails.push({
                step: $_('results.step') + '3: ' + $_(generators.getI18nTitle()),
                modules: generators,
                module: generatorModule,
                state: randomState,
                output: $_('results.stepFourDisplay')
            })

            randomModule.setGenerator(generatorModule)
            pipelineDetails.push({
                step: $_('results.step') + '3.1: ' + $_(randoms.getI18nTitle()),
                modules: randoms,
                module: randomModule,
                state: '',
                output: ''
            })

            // Step 4: Selection
            const resultList = sampleModule.sample(randomModule, items.length, selectedItemNumber)
            pipelineDetails.push({
                step: $_('results.step') + '4: ' + $_(samples.getI18nTitle()),
                modules: samples,
                module: sampleModule,
                state: sampleModule.getState(),
                output: resultList.join(', ')
            })
            resultItems = resultList
            pipelineDetails[3].output = randomModule.getState()
        } catch (e) {
            resultsInfo = {
                status: Status.FAIL,
                text: 'results.errorOccurred;' + e.message
            }
            pipelineDetails = [] // When error occur, it's weird to show pipeline details
        }

        setTimeout(() => {
            window.scrollTo({
                top: window.innerHeight, // 100vh in pixels
                behavior: 'smooth'
            })
        }, 200)
    }
</script>

<!-- Main Part -->
<div class="flex h-screen items-center justify-center">
    <div
        class="container mx-auto flex max-h-screen flex-col justify-center space-y-4 overflow-hidden p-1 md:w-8/12"
    >
        <!-- Main.Summary -->
        <p class="mx-auto p-2 text-center text-2xl">
            {#if $locale == 'tw'}
                公平起見，我們使用
                <span class="font-bold">{selectedDate}({timeZone})</span> 的
                <span class="font-bold">{$_(datas.get(selectedData).getI18nName())}</span>
                資料作為亂數的基礎。
                {#if allowAdvancedConfig}
                    該資料會經過雜湊函數
                    <span class="font-bold">{$_(hashs.get(selectedHash).getI18nName())}</span>
                    做成亂數的種子(seed)。接著偽亂數函數
                    <span class="font-bold"
                        >{$_(generators.get(selectedGenerator).getI18nName())}</span
                    >
                    跟同餘方法
                    <span class="font-bold">{$_(randoms.get(selectedRandom).getI18nName())}</span>
                    會在隨機抽樣方法
                    <span class="font-bold">{$_(samples.get(selectedSample).getI18nName())}</span> 的使用下
                {/if}
                從總共
                <span class="font-bold">{items.length}</span> 個中按照
                <span class="font-bold">
                    {selectedSortOption === 'alphabet'
                        ? 'UTF-8 順序'
                        : selectedSortOptionText || '未定義的自訂排序'}
                </span>
                的列表中挑選
                <span class="font-bold">{allowDuplicated ? '可重複' : '不重複'}</span> 的
                <span class="font-bold">{selectedItemNumber}</span> 個。 列表如下
            {:else}
                <!--english-->
                To ensure fairness,
                <span class="font-bold">{$_(datas.get(selectedData).getI18nName())}</span> data at
                <span class="font-bold">{selectedDate}({timeZone})</span> is used as the basis for
                randomness.

                {#if allowAdvancedConfig}
                    The data is processed through the hash function
                    <span class="font-bold">{$_(hashs.get(selectedHash).getI18nName())}</span> to
                    create a random seed. The random generator
                    <span class="font-bold"
                        >{$_(generators.get(selectedGenerator).getI18nName())}</span
                    >
                    method and modulo method
                    <span class="font-bold">{$_(randoms.get(selectedRandom).getI18nName())}</span>
                    are used with the
                    <span class="font-bold">{$_(samples.get(selectedSample).getI18nName())}</span>.
                {/if}

                It selects
                <span class="font-bold">{allowDuplicated ? 'duplicatable' : 'non-duplicated'}</span>
                <span class="font-bold">{selectedItemNumber}</span> items from the
                <span class="font-bold">{items.length}</span>-element list sorted by
                <span class="font-bold">
                    {selectedSortOption === 'alphabet'
                        ? 'alphabetical order'
                        : selectedSortOptionText || 'manual method'}
                </span>.
            {/if}
        </p>
        <div class="mx-2 overflow-scroll">
            <Items datas={items.map((item, i) => [i, item])} />
        </div>
        <!-- Main.Submit Button -->
        <div class="flex justify-center space-x-4">
            <button
                onclick={() => {
                    showConfiguration = !showConfiguration
                }}
                class="w-5/12 rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600"
            >
                {$_('button.openSettings')}
            </button>
            <button
                onclick={submitPipeline}
                class="w-5/12 rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600"
            >
                {$_('button.run')}
            </button>
        </div>
    </div>
</div>

<!-- Configuration Page -->
<div
    class={`fixed left-0 top-0 z-40 h-screen transform overflow-scroll bg-white shadow-lg transition-transform duration-300 ${showConfiguration ? 'translate-x-0' : '-translate-x-full'}`}
>
    <label class="m-4 block">
        {$_('settings.datetime')}:
        <SveltyPicker
            autocommit={true}
            manualInput={true}
            inputClasses="w-full bg-white border border-gray-300 rounded-lg p-1 hover:border-blue-400 focus:outline-none focus:border-blue-500"
            mode="datetime"
            format="yyyy-mm-dd hh:ii:ss"
            bind:value={selectedDate}
        />
        {$_('settings.timezone')}: <span>{timeZone}</span>
    </label>
    <ModulesSelector bind:value={selectedData} modules={datas} />

    <label class="m-4 block flex items-center">
        <input
            type="checkbox"
            bind:checked={allowAdvancedConfig}
            class="mr-2 rounded border p-1 focus:border-blue-500 focus:outline-none"
        />
        <div>{$_('settings.allowAdvancedConfig')}</div>
    </label>

    {#if allowAdvancedConfig}
        <ModulesSelector bind:value={selectedHash} modules={hashs} />
        <ModulesSelector bind:value={selectedGenerator} modules={generators} />
        <ModulesSelector bind:value={selectedRandom} modules={randoms} />
        <ModulesSelector bind:value={selectedSample} modules={samplesWithDupOption} />
    {/if}
    <label class="m-4 block">
        {$_('settings.itemList')}:
        <textarea
            bind:value={itemListStr}
            class="h-32 w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
        ></textarea>
    </label>

    <label class="m-4 block">
        {$_('settings.selectionCount')}:
        <input
            type="number"
            bind:value={selectedItemNumber}
            min="1"
            class="w-full rounded border p-1 focus:border-blue-500 focus:outline-none"
        />
    </label>

    <label class="m-4 block flex items-center">
        <input
            type="checkbox"
            bind:checked={allowDuplicated}
            class="mr-2 rounded border p-1 focus:border-blue-500 focus:outline-none"
        />
        <div>{$_('settings.allowDuplicates')}</div>
    </label>

    <label class="m-4 block">
        {$_('settings.sortOptions')}
        <select
            bind:value={selectedSortOption}
            class="w-full rounded border bg-white p-1 hover:border-blue-400 focus:border-blue-500 focus:outline-none"
        >
            <option value="alphabet">{$_('settings.sortByName')}</option>
            <option value="manual">{$_('settings.customOrder')}</option>
        </select>

        {#if selectedSortOption === 'manual'}
            <label for="manualSortText" class="block text-sm font-medium text-gray-700">
                {$_('settings.customOrderDescription')}
            </label>
            <textarea
                id="manualSortText"
                bind:value={selectedSortOptionText}
                class="w-full rounded border bg-white p-1 hover:border-blue-400 focus:border-blue-500 focus:outline-none"
                placeholder="Explain your sorting method here..."
            ></textarea>
        {/if}
    </label>

    <div class="m-2">
        <button
            class="w-full rounded bg-gray-500 p-2 text-white transition hover:bg-gray-600"
            onclick={() => {
                showConfiguration = false
            }}
        >
            {$_('button.close')}
        </button>
    </div>
</div>
<!-- Click other part will close the configuration -->
{#if showConfiguration}
    <button
        class="fixed inset-0 z-30 bg-black bg-opacity-50"
        aria-label="close the configuration"
        onclick={() => {
            showConfiguration = false
        }}
    ></button>
{/if}

<!-- Second Page: Result -->
{#if resultsInfo.status !== Status.NULL}
    <div class="container mx-auto mb-32 flex w-full flex-col overflow-hidden md:w-8/12">
        <div
            class=" flex max-h-screen flex-col items-center justify-start space-y-4 overflow-hidden p-2"
        >
            <h3 class="my-4 text-4xl font-semibold text-gray-800">{$_('results.result')}</h3>
            <div class="mx-2 max-h-full w-full flex-grow overflow-scroll">
                <!-- Main.Result -->
                {#if resultsInfo.status !== Status.SUCCESS}
                    <div class="my-8 rounded-lg border-l-4 bg-gray-100 p-4">
                        {#if resultsInfo.status === Status.FAIL}
                            <p class="font-semibold text-red-600">
                                {$_(splitByFirstSemicolon(resultsInfo.text)[0])}
                            </p>
                            <p class="font-semibold text-red-600">
                                {$_(splitByFirstSemicolon(resultsInfo.text)[1])}
                            </p>
                        {:else if resultsInfo.status === Status.PENDING}
                            <p class="font-semibold text-yellow-600">{$_(resultsInfo.text)}</p>
                        {:else if resultsInfo.status === Status.WARNING}
                            <p class="font-semibold text-orange-600">{$_(resultsInfo.text)}</p>
                        {/if}
                    </div>
                {/if}
                {#if resultItems.length}
                    <Items datas={resultItems.map((i) => [i, items[i]])} />
                {/if}
            </div>
            <div class="flex w-full justify-center space-x-4">
                <button
                    class="w-5/12 rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                    onclick={() => copyToClipboard($page.url.toString())}
                >
                    {$_('button.copyShareLink')}
                </button>
                {#if resultItems.length}
                    <button
                        class="w-5/12 rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                        onclick={() => copyToClipboard(resultItems.map((i) => items[i]).join('\n'))}
                    >
                        {$_('button.copyToClipboard')}
                    </button>
                {/if}
            </div>
        </div>

        <!-- Step by Step -->
        {#if pipelineDetails.length}
            <div class="h-16"></div>
            {#each pipelineDetails as detail}
                <Block title={detail.step}>
                    <BlockSub
                        type="modules"
                        title={$_('results.module')}
                        value={'## ' +
                            $_(detail.modules.getI18nName()) +
                            '\n' +
                            $_(detail.modules.getI18nDescription())}
                    />

                    <BlockSub
                        type="module"
                        title={$_('results.implementation')}
                        value={$_(detail.module.getI18nDescription())}
                    />

                    {#if detail.state}
                        <BlockSub type="state" title={$_('results.internalState')}>
                            <div class="relative">
                                <p
                                    class="max-h-32 overflow-scroll break-words text-sm text-blue-700"
                                >
                                    {@html detail.state.replace(/\n/g, '<br>')}
                                </p>
                                <button
                                    class="absolute right-2 top-2 rounded bg-blue-500 p-1 text-xs text-white hover:bg-blue-600"
                                    onclick={() => copyToClipboard(detail.state)}
                                >
                                    {$_('button.copyToClipboard')}
                                </button>
                            </div>
                        </BlockSub>
                    {/if}

                    <BlockSub type="output" title={$_('results.output')}>
                        <div class="relative">
                            <p class="max-h-32 overflow-scroll break-words text-sm text-blue-700">
                                {@html detail.output.replace(/\n/g, '<br>')}
                            </p>
                            <button
                                class="absolute right-2 top-2 rounded bg-blue-500 p-1 text-xs text-white hover:bg-blue-600"
                                onclick={() => copyToClipboard(detail.output)}
                            >
                                {$_('button.copyToClipboard')}
                            </button>
                        </div>
                    </BlockSub>
                </Block>
            {/each}
        {/if}
    </div>
{/if}
