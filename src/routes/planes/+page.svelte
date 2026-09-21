<script lang="ts">
  import { activityList, tripDays, loading } from '$lib/stores/trip';
  import ActivityCard  from '$lib/components/cards/ActivityCard.svelte';
  import FlashHandler  from '$lib/components/ui/FlashHandler.svelte';
  import PastToggle    from '$lib/components/ui/PastToggle.svelte';
  import FAB           from '$lib/components/ui/FAB.svelte';
  import PageTitle     from '$lib/components/ui/PageTitle.svelte';
  import { openModal } from '$lib/stores/ui';
  import { dmToLabel, dmToDow, todayDm } from '$lib/utils/dates';

  const today = todayDm();

  $: upcoming = $activityList.filter(a => (a.endDayDm ?? a.dayDm) >= today);
  $: past     = $activityList.filter(a => (a.endDayDm ?? a.dayDm) <  today);

  function groupByDm(list: typeof $activityList) {
    const map = new Map<number, typeof $activityList>();
    for (const a of list) {
      if (!map.has(a.dayDm)) map.set(a.dayDm, []);
      map.get(a.dayDm)!.push(a);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }

  $: groupedUpcoming = groupByDm(upcoming);
  $: groupedPast     = groupByDm(past);

  function sectionLabel(dm: number) {
    const day = $tripDays.find(d => d.d === dm);
    const dow = day?.dow ?? dmToDow(dm);
    return day ? `${dmToLabel(dm)} · ${dow} · ${day.title}` : dmToLabel(dm);
  }

  let pastOpen = false;
</script>

<FlashHandler {loading} />
<FAB on:click={() => openModal('activity')} />
<PageTitle title="Planes" accent="var(--lila)" />

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else if $activityList.length === 0}
  <p class="empty-msg">Aún no hay planes.</p>
{:else}
  {#each groupedUpcoming as [dm, activities]}
    <div class="day-group">
      <div class="section-label">{sectionLabel(dm)}</div>
      {#each activities as activity (activity.id)}
        <ActivityCard {activity} />
      {/each}
    </div>
  {/each}

  {#if past.length > 0}
    <PastToggle count={past.length} label="Planes pasados" bind:open={pastOpen} />
    {#if pastOpen}
      {#each groupedPast as [dm, activities]}
        <div class="day-group">
          <div class="section-label">{sectionLabel(dm)}</div>
          {#each activities as activity (activity.id)}
            <ActivityCard {activity} past={true} />
          {/each}
        </div>
      {/each}
    {/if}
  {/if}
{/if}
