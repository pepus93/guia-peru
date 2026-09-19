<script lang="ts">
  import { tripDays, loading } from '$lib/stores/trip';
  import DayCard from '$lib/components/cards/DayCard.svelte';
  import FilterChips from '$lib/components/ui/FilterChips.svelte';

  const CITIES = [
    { key: 'all',      label: 'Todos' },
    { key: 'lima',     label: '🏙 Lima' },
    { key: 'arequipa', label: '🌋 Arequipa' },
    { key: 'cusco',    label: '🏔 Cusco' },
    { key: 'selva',    label: '🌿 Amazonia' },
  ];

  let filter = 'all';

  $: filtered = filter === 'all'
    ? $tripDays
    : $tripDays.filter(d => d.city === filter);
</script>

<FilterChips filters={CITIES} active={filter} on:change={(e) => (filter = e.detail)} />

{#if $loading}
  <p class="loading-msg">Cargando…</p>
{:else}
  {#each filtered as day (day.id)}
    <DayCard {day} />
  {/each}
{/if}

<style>
  .loading-msg { text-align: center; color: var(--ink-soft); padding: 40px 0; font-size: .85rem; }
</style>
