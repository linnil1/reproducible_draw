<script lang="ts">
    import { locale, _ } from 'svelte-i18n'
    import { Carta, Markdown } from 'carta-md'
    const carta = new Carta({})
</script>

<div class="container mx-auto md:w-8/12">
    <article class="prose m-4">
        {#key $locale}
            <Markdown {carta} value={$_('intro')} />
        {/key}
    </article>
</div>
