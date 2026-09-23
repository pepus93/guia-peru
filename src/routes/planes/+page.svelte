<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { activityList, tripDays, loading } from '$lib/stores/trip';
  import ActivityCard  from '$lib/components/cards/ActivityCard.svelte';
  import FlashHandler  from '$lib/components/ui/FlashHandler.svelte';
  import FAB           from '$lib/components/ui/FAB.svelte';
  import PageTitle     from '$lib/components/ui/PageTitle.svelte';
  import { openModal } from '$lib/stores/ui';
  import { dmToLabel, dmToDow, todayDm } from '$lib/utils/dates';
  import { afterNavigate } from '$app/navigation';
  import { scrollToCurrent } from '$lib/utils/scroll';
  import { groupByKey } from '$lib/utils/group';

  onMount(() => {
    document.body.style.setProperty('--page-bg', 'color-mix(in srgb, var(--lila) 8%, var(--paper))');
    document.body.style.setProperty('--tab-accent', 'var(--lila)');
    document.body.style.backgroundImage = 'url("/patterns/planes.svg")';
    document.body.style.backgroundRepeat = 'repeat';
  });
  onDestroy(() => {
    document.body.style.removeProperty('--page-bg');
    document.body.style.removeProperty('--tab-accent');
    document.body.style.backgroundImage = '';
    document.body.style.backgroundRepeat = '';
  });

  const today = todayDm();

  $: grouped = groupByKey($activityList, a => a.dayDm);

  function sectionLabel(dm: number) {
    const day = $tripDays.find(d => d.d === dm);
    const dow = day?.dow ?? dmToDow(dm);
    return day ? `${dmToLabel(dm)} · ${dow} · ${day.title}` : dmToLabel(dm);
  }

  let pendingScroll = false;
  $: if (!$loading && pendingScroll) { pendingScroll = false; scrollToCurrent(); }

  afterNavigate(({ to }) => {
    if (to?.url.searchParams.has('flash')) return;
    if ($loading) { pendingScroll = true; } else { scrollToCurrent(); }
  });
</script>

<FlashHandler {loading} />
<FAB on:click={() => openModal('activity')} />
<PageTitle title="Planes" eyebrow="Perú 2026" accent="var(--lila)" />

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
