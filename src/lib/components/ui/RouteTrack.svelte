<script lang="ts">
  import type { IconName } from './Icon.svelte';
  import Icon from './Icon.svelte';

  export let icon: IconName;
  export let color: string;      // CSS color value, e.g. "var(--sky)"
  export let info: string = '';  // optional sub-label below the track (e.g. airline name)
  export let iconSize: number = 14;
  export let padding: string = '0 4px';
</script>

<div class="rt" style="--rt-color: {color}; padding: {padding}">
  <div class="rt-track">
    <div class="rt-dot"></div>
    <div class="rt-line"></div>
    <span class="rt-icon"><Icon name={icon} size={iconSize} /></span>
    <div class="rt-line"></div>
    <div class="rt-dot"></div>
  </div>
  {#if info}
    <span class="rt-info">{info}</span>
  {/if}
</div>

<style>
  .rt {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    min-width: 0;
  }

  .rt-track {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 3px;
    color: var(--rt-color);
  }

  .rt-dot {
    flex-shrink: 0;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--rt-color);
    opacity: .5;
  }

  .rt-line {
    flex: 1;
    height: 1.5px;
    background: repeating-linear-gradient(
      to right,
      color-mix(in srgb, var(--rt-color) 45%, transparent) 0px,
      color-mix(in srgb, var(--rt-color) 45%, transparent) 5px,
      transparent 5px,
      transparent 9px
    );
  }

  .rt-icon { flex-shrink: 0; }

  .rt-info {
    font-size: .72rem;
    color: var(--ink-soft);
    letter-spacing: .03em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
</style>
