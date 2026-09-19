<script lang="ts">
  import { tick } from 'svelte';
  import { tripDays, loading } from '$lib/stores/trip';
  import DayCard from '$lib/components/cards/DayCard.svelte';
  import { todayDm } from '$lib/utils/dates';

  let scrolled = false;

  $: if (!$loading && !scrolled) {
    scrolled = true;
    tick().then(() => {
      const el = document.getElementById(`day-${todayDm()}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
</script>

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else}
  {#each $tripDays as day (day.id)}
    <DayCard {day} />
  {/each}
{/if}

