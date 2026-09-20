<script lang="ts">
  import Icon, { type IconName } from '$lib/components/ui/Icon.svelte';
  const asIcon = (s: string): IconName => s as unknown as IconName;
  export let icon: string;
  export let type: string;
  export let name: string;
  export let place: string = '';
  export let placeUrl: string = '';
</script>

<div class="ch">
  <span class="ch-icon"><Icon name={asIcon(icon)} size={18} /></span>
  <div class="ch-body">
    <span class="ch-type">{type}</span>
    <span class="ch-name">{name}</span>
    {#if place}
      {#if placeUrl}
        <a class="ch-place ch-place-link" href={placeUrl} target="_blank" rel="noreferrer">{place}</a>
      {:else}
        <span class="ch-place">{place}</span>
      {/if}
    {/if}
    <slot name="pills" />
  </div>
  <slot name="menu" />
</div>

<style>
  .ch { display: flex; gap: 9px; align-items: flex-start; }
  .ch-icon { display: flex; align-items: center; justify-content: center; margin-top: 1px; flex-shrink: 0; }
  .ch-body { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
  .ch-type  { font-size: .62rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-soft); }
  .ch-name  { font-size: .82rem; font-weight: 700; color: var(--ink); line-height: 1.2; }
  .ch-place { font-size: .68rem; color: var(--ink-soft); margin-top: 2px; }
  .ch-place-link { text-decoration: none; color: var(--sky); }
</style>
