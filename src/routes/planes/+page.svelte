<script lang="ts">
  import { activityList, excursionList, tripDays, loading } from '$lib/stores/trip';
  import ActivityCard  from '$lib/components/cards/ActivityCard.svelte';
  import ExcursionCard from '$lib/components/cards/ExcursionCard.svelte';
  import FlashHandler  from '$lib/components/ui/FlashHandler.svelte';
  import FAB           from '$lib/components/ui/FAB.svelte';
  import { openModal } from '$lib/stores/ui';
  import { dmToLabel } from '$lib/utils/dates';
  import type { Activity, Excursion } from '$lib/models/types';

  type PlanItem =
    | { kind: 'activity';  item: Activity }
    | { kind: 'excursion'; item: Excursion };

  $: allPlans = [
    ...$activityList.map(a  => ({ kind: 'activity',  item: a } as PlanItem)),
    ...$excursionList.map(e => ({ kind: 'excursion', item: e } as PlanItem)),
  ];

  $: byDay = allPlans.reduce<Record<number, PlanItem[]>>((acc, p) => {
    (acc[p.item.dayDm] ??= []).push(p);
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
      {#each byDay[dm] as plan (plan.item.id)}
        {#if plan.kind === 'activity'}
          <ActivityCard activity={plan.item} />
        {:else}
          <ExcursionCard excursion={plan.item} />
        {/if}
      {/each}
    </div>
  {/each}
{/if}

