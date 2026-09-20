<script lang="ts">
  import { slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import CalendarLink from '$lib/components/ui/CalendarLink.svelte';

  export let id: string;
  export let flashing    = false;
  export let past        = false;
  export let cssClass    = '';
  export let flashColor  = 'rgba(198,90,52,.5)';
  export let dayDm: number | undefined = undefined;
  export let collapsible = false;
  export let expanded    = false;
</script>

<div
  {id}
  class="card {cssClass}"
  class:flash={flashing}
  class:is-past={past}
  class:has-cal={dayDm !== undefined}
  style="--flash-color:{flashColor}"
>
  {#if collapsible}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div class="card-summary" on:click={() => (expanded = !expanded)}>
      <slot />
    </div>
    {#if expanded}
      <div transition:slide={{ duration: 240, easing: cubicOut }}>
        <slot name="detail" />
      </div>
    {/if}
  {:else}
    <slot />
    <slot name="detail" />
  {/if}

  {#if dayDm !== undefined}
    <CalendarLink dm={dayDm} />
  {/if}
</div>

<style>
  .card-summary {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
</style>
