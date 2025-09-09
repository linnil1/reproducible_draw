<script lang="ts">
    import { locale, _ } from 'svelte-i18n'
    import { Carta, Markdown } from 'carta-md'
    import { anchor } from '@cartamd/plugin-anchor'
    import '@cartamd/plugin-anchor/default.css'
    import 'carta-md/default.css';
    const carta = new Carta({
        extensions: [anchor()]
    })
</script>

<div class="container mx-auto md:w-8/12">
    <img class="m-8 w-64 rounded-2xl" src="/favicon.jpg" alt="icon" />
    <article class="prose m-4">
        {#key $locale}
            <Markdown {carta} value={$_('intro')} />
            <Markdown {carta} value={$_('info')} />
            <Markdown {carta} value={$_('privacy')} />
            <Markdown {carta} value={$_('tos')} />
        {/key}
    </article>
</div>
