<script lang="ts">
  import { TRIP_LABEL } from '$lib/config';
  export let title: string;
  export let eyebrow: string = TRIP_LABEL;
  export let accent: string = 'var(--tab-accent, var(--terra))';
</script>

<div class="page-title">
  {#if eyebrow}<span class="pt-eyebrow" style="color:{accent}">{eyebrow}</span>{/if}
  <h1 class="pt-heading font-serif">{title}</h1>
  <div class="pt-rule" style="background:{accent}"></div>
</div>

<style>
  .page-title {
    padding: 22px 16px 16px;
  }

  .pt-eyebrow {
    display: block;
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .pt-heading {
    font-size: 2rem;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
    margin: 0;
  }

  .pt-rule {
    width: 28px;
    height: 3px;
    border-radius: 2px;
    margin-top: 8px;
    opacity: .7;
  }
</style>
