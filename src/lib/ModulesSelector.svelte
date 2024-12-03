<script lang="ts">
    import { _ } from 'svelte-i18n'
    let { value = $bindable(), modules } = $props()
</script>

<label class="m-4 block">
    {$_('settings.select')}
    {$_(modules.getI18nName())}:
    <select
        bind:value
        class="w-full rounded border bg-white p-1 hover:border-blue-400 focus:border-blue-500 focus:outline-none"
    >
        {#each modules.list() as module}
            <option value={module.getName()}>{$_(module.getI18nName())}</option>
        {/each}
    </select>
</label>
