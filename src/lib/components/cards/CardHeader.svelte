<script lang="ts">
  import Icon, { asIcon } from '$lib/components/ui/Icon.svelte';
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
      <div class="ch-addr">
        {#if placeUrl}
          <a class="ch-map-btn" href={placeUrl} target="_blank" rel="noreferrer" aria-label="Ver en mapa">
            <Icon name="map-pin" size={13} />
          </a>
        {:else}
          <span class="ch-map-ic"><Icon name="map-pin" size={13} /></span>
        {/if}
        <span class="ch-place-text">{place}</span>
      </div>
    {/if}
    <slot name="pills" />
  </div>
  <slot name="menu" />
</div>

<style>
  .ch { display: flex; gap: 9px; align-items: flex-start; }
  .ch-icon { display: flex; align-items: center; justify-content: center; margin-top: 1px; flex-shrink: 0; }
  .ch-body { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
  .ch-type  { font-size: .72rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-soft); }
  .ch-name  { font-size: .82rem; font-weight: 700; color: var(--ink); line-height: 1.2; }
  .ch-addr {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
  }
  .ch-map-btn {
    display: flex; align-items: center; justify-content: center;
    width: 24px; height: 24px;
    background: rgba(63,125,100,.12);
    border-radius: 6px;
    color: var(--jade);
    text-decoration: none;
    flex-shrink: 0;
    transition: background .15s;
  }
  .ch-map-btn:active { background: rgba(63,125,100,.28); }
  .ch-map-ic {
    display: flex;
    color: var(--ink-soft);
    opacity: .45;
    flex-shrink: 0;
  }
  .ch-place-text {
    font-size: .72rem;
    color: var(--ink-soft);
    line-height: 1.3;
  }
</style>
