<script lang="ts">
  import Icon from './Icon.svelte';

  export let href: string = '';
  export let label: string = '';
  export let color: string = 'var(--jade)';
  export let textColor: string = '';
</script>

<div class="addr-row">
  {#if href}
    <a
      class="addr-map-btn"
      style="--addr-map-color: {color}"
      {href}
      target="_blank"
      rel="noreferrer"
      aria-label="Ver en mapa"
    >
      <Icon name="map-pin" size={15} />
    </a>
  {:else}
    <span class="addr-map-ic" style="color: {color}">
      <Icon name="map-pin" size={15} />
    </span>
  {/if}
  <span class="addr-text" style={textColor ? `color: ${textColor}` : ''}>
    <slot>{label}</slot>
  </span>
</div>
