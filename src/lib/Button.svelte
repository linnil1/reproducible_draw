<script lang="ts">
    import Icon from '@iconify/svelte'
    let { onclick, icon, text, classes = '' } = $props()
</script>

<button
    {onclick}
    class={'flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-md transition-transform duration-200 hover:border-gray-400 hover:shadow-lg focus:outline-none focus:ring focus:ring-indigo-300 ' +
        classes}
>
    <Icon {icon} />
    {text}
</button>
