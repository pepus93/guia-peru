<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let count: number;
  export let singular: string;
  export let plural: string;
  export let addLabel: string;

  const dispatch = createEventDispatcher<{ add: void }>();

  $: label = `${count} ${count !== 1 ? plural : singular}`;
</script>

<div class="list-toolbar">
  <span class="list-count">{label}</span>
  <button class="btn btn-primary add-btn" on:click={() => dispatch('add')}>
    {addLabel}
  </button>
</div>

<style>
  .list-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 2px 10px;
  }
  .list-count { font-size: .72rem; font-weight: 600; color: var(--ink-soft); }
  .add-btn { font-size: .78rem; padding: 7px 14px; }
</style>
