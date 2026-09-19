<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let filters: Array<{ key: string; label: string }>;
  export let active: string;

  const dispatch = createEventDispatcher<{ change: string }>();
</script>

<div class="filters">
  {#each filters as f}
    <button class="chip" class:active={active === f.key} on:click={() => dispatch('change', f.key)}>
      {f.label}
    </button>
  {/each}
</div>
