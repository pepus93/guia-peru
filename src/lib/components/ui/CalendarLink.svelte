<script lang="ts">
  import { dayByDm } from '$lib/stores/trip';
  import Icon from '$lib/components/ui/Icon.svelte';

  export let dm: number;

  $: dayId = $dayByDm[dm];
</script>

{#if dayId}
  <a class="cal-link" href="/dias?flash={dayId}" aria-label="Ver en días">
    <Icon name="calendar" size={20} />
  </a>
{/if}

<style>
  .cal-link {
    position: absolute;
    bottom: 4px;
    right: 6px;
    padding: 10px;
    color: var(--ink-soft);
    opacity: .45;
    transition: opacity .15s;
    line-height: 0;
    text-decoration: none;
    touch-action: manipulation;
  }
  .cal-link:hover { opacity: .9; }
</style>
