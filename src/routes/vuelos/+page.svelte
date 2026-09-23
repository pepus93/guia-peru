<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { flightList, loading } from '$lib/stores/trip';
  import FlightCard   from '$lib/components/cards/FlightCard.svelte';
  import FlashHandler from '$lib/components/ui/FlashHandler.svelte';
  import FAB          from '$lib/components/ui/FAB.svelte';
  import PageTitle    from '$lib/components/ui/PageTitle.svelte';
  import { openModal } from '$lib/stores/ui';
  import { dmToLabel, dmToDow, todayDm } from '$lib/utils/dates';
  import { afterNavigate } from '$app/navigation';
  import { scrollToCurrent } from '$lib/utils/scroll';
  import { groupByKey } from '$lib/utils/group';

  onMount(() => document.body.style.setProperty('--page-bg', 'color-mix(in srgb, #3a6ea5 8%, #f7f2ea)'));
  onDestroy(() => document.body.style.removeProperty('--page-bg'));

  const today = todayDm();

  $: grouped = groupByKey($flightList, f => f.dm);

  function dayLabel(dm: number, dow: string) {
    return `${dmToLabel(dm)} · ${dow}`;
  }

  let pendingScroll = false;
  $: if (!$loading && pendingScroll) { pendingScroll = false; scrollToCurrent(); }

  afterNavigate(({ to }) => {
    if (to?.url.searchParams.has('flash')) return; // FlashHandler lo gestiona
    if ($loading) { pendingScroll = true; } else { scrollToCurrent(); }
  });
</script>

<FlashHandler {loading} />
<FAB on:click={() => openModal('flight')} />
<PageTitle title="Vuelos" eyebrow="Perú 2026" accent="var(--sky)" />

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else if $flightList.length === 0}
  <p class="empty-msg">No hay vuelos.</p>
{:else}
  {#each grouped as [dm, flights]}
    <div class="day-group">
      <div class="section-label">{dayLabel(dm, flights[0].dow)}</div>
      {#each flights as flight (flight.id)}
        <FlightCard {flight} past={flight.dm < today} />
      {/each}
    </div>
  {/each}
{/if}
