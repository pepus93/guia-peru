<script lang="ts">
  import { dayByDm } from '$lib/stores/trip';

  export let dm: number;

  $: dayId = $dayByDm[dm];
</script>

{#if dayId}
  <a class="cal-link" href="/dias?flash={dayId}" aria-label="Ver en días">
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="1.5" y="2.5" width="13" height="12" rx="2"/>
      <line x1="1.5" y1="6.5" x2="14.5" y2="6.5"/>
      <line x1="5"   y1="1"   x2="5"   y2="4.5"/>
      <line x1="11"  y1="1"   x2="11"  y2="4.5"/>
    </svg>
  </a>
{/if}

<style>
  .cal-link {
    position: absolute;
    bottom: 10px;
    right: 12px;
    color: var(--ink-soft);
    opacity: .45;
    transition: opacity .15s;
    line-height: 0;
    text-decoration: none;
    touch-action: manipulation;
  }
  .cal-link:hover { opacity: .9; }
</style>
