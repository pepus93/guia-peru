<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { activityList, tripDays, loading } from '$lib/stores/trip';
  import { PAGE_THEME } from '$lib/config/ui';
  import { applyPageTheme } from '$lib/utils/pageTheme';
  import { useScrollToCurrent } from '$lib/utils/scroll';
  import ActivityCard  from '$lib/components/cards/ActivityCard.svelte';
  import FlashHandler  from '$lib/components/ui/FlashHandler.svelte';
  import FAB           from '$lib/components/ui/FAB.svelte';
  import PageTitle     from '$lib/components/ui/PageTitle.svelte';
  import { openModal } from '$lib/stores/ui';
  import { dmToLabel, dmToDow, todayDm } from '$lib/utils/dates';
  import { groupByKey } from '$lib/utils/group';

  const today = todayDm();

  $: grouped = groupByKey($activityList, a => a.dayDm);

  function sectionLabel(dm: number) {
    const day = $tripDays.find(d => d.d === dm);
    const dow = day?.dow ?? dmToDow(dm);
    return day ? `${dmToLabel(dm)} · ${dow} · ${day.title}` : dmToLabel(dm);
  }

  let cleanup: () => void;
  onMount(() => { cleanup = applyPageTheme(PAGE_THEME.planes.accent, PAGE_THEME.planes.pattern); });
  onDestroy(() => cleanup?.());

  const stopScrollSub = useScrollToCurrent(loading);
</script>

<FlashHandler {loading} />
<FAB on:click={() => openModal('activity')} />
<PageTitle title="Planes" />

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else if $activityList.length === 0}
  <p class="empty-msg">Aún no hay planes.</p>
{:else}
  {#each grouped as [dm, activities]}
    <div class="day-group">
      <div class="section-label">{sectionLabel(dm)}</div>
      {#each activities as activity, i (activity.id)}
        <ActivityCard {activity} past={(activity.endDayDm ?? activity.dayDm) < today} hasLabel={i === 0} />
      {/each}
    </div>
  {/each}
{/if}
