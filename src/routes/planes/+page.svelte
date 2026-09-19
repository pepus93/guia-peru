<script lang="ts">
  import { activityList, tripDays, loading } from '$lib/stores/trip';
  import ActivityCard  from '$lib/components/cards/ActivityCard.svelte';
  import FlashHandler  from '$lib/components/ui/FlashHandler.svelte';
  import FAB           from '$lib/components/ui/FAB.svelte';
  import { openModal } from '$lib/stores/ui';
  import { dmToLabel } from '$lib/utils/dates';

  $: byDay = $activityList.reduce<Record<number, typeof $activityList>>((acc, a) => {
    (acc[a.dayDm] ??= []).push(a);
    return acc;
  }, {});

  $: dayKeys = Object.keys(byDay).map(Number).sort((a, b) => a - b);

  function dayTitle(dm: number) {
    const day = $tripDays.find(d => d.d === dm);
    return day ? `${dmToLabel(dm)} · ${day.title}` : dmToLabel(dm);
  }
</script>

<FlashHandler {loading} />

<FAB on:click={() => openModal('activity')} />

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else if dayKeys.length === 0}
  <p class="empty-msg">Aún no hay planes.</p>
{:else}
  {#each dayKeys as dm}
    <div class="day-group">
      <div class="section-label">{dayTitle(dm)}</div>
      {#each byDay[dm] as activity (activity.id)}
        <ActivityCard {activity} />
      {/each}
    </div>
  {/each}
{/if}

