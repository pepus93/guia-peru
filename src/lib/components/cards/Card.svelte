<script lang="ts">
  import CalendarLink from '$lib/components/ui/CalendarLink.svelte';

  export let id: string;
  export let flashing   = false;
  export let past       = false;
  export let cssClass   = '';
  export let flashColor = 'rgba(198,90,52,.5)';
  export let dayDm: number | undefined = undefined;
</script>

<div
  {id}
  class="card {cssClass}"
  class:flash={flashing}
  class:is-past={past}
  class:has-cal={dayDm !== undefined}
  style="--flash-color:{flashColor}"
>
  <slot />
  {#if dayDm !== undefined}
    <CalendarLink dm={dayDm} />
  {/if}
</div>
