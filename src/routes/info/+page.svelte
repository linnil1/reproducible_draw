<script lang="ts">
    import { _ } from 'svelte-i18n'
    import { Carta, Markdown } from 'carta-md'
    const carta = new Carta({})
</script>

<article class="prose m-4 md:w-8/12">
    <Markdown {carta} value={$_('intro')} />
</article>
