<script lang="ts">
  import { activityList, tripDays, loading } from '$lib/stores/trip';
  import ActivityCard from '$lib/components/cards/ActivityCard.svelte';
  import FilterChips from '$lib/components/ui/FilterChips.svelte';
  import ListToolbar from '$lib/components/ui/ListToolbar.svelte';
  import { openModal } from '$lib/stores/ui';
  import { ACTIVITY_TYPES } from '$lib/models/types';
  import { dmToLabel } from '$lib/utils/dates';

  const TYPE_FILTERS = [
    { key: 'all', label: 'Todos' },
    ...Object.entries(ACTIVITY_TYPES).map(([k, v]) => ({ key: k, label: `${v.icon} ${v.label}` })),
  ];

  let filter = 'all';

  $: filtered = filter === 'all'
    ? $activityList
    : $activityList.filter(a => a.type === filter);

  $: byDay = filtered.reduce<Record<number, typeof filtered>>((acc, a) => {
    (acc[a.dayDm] ??= []).push(a);
    return acc;
  }, {});

  $: dayKeys = Object.keys(byDay).map(Number).sort((a, b) => a - b);

  function dayTitle(dm: number) {
    const day = $tripDays.find(d => d.d === dm);
    return day ? `${dmToLabel(dm)} · ${day.title}` : dmToLabel(dm);
  }
</script>

<FilterChips filters={TYPE_FILTERS} active={filter} on:change={(e) => (filter = e.detail)} />
<ListToolbar count={filtered.length} singular="plan" plural="planes" addLabel="+ Añadir plan" on:add={() => openModal('activity')} />

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else if dayKeys.length === 0}
  <p class="empty-msg">Aún no hay planes añadidos.</p>
{:else}
  {#each dayKeys as dm}
    <div class="day-group">
      <div class="section-label">{dayTitle(dm)}</div>
      {#each byDay[dm] as act (act.id)}
        <ActivityCard activity={act} />
      {/each}
    </div>
  {/each}
{/if}

<style>
  .day-group { margin-bottom: 4px; }
  .empty-msg { text-align: center; color: var(--ink-soft); padding: 40px 0; font-size: .85rem; }
</style>
