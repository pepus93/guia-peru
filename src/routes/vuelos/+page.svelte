<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { flightList, loading } from '$lib/stores/trip';
  import { PAGE_THEME } from '$lib/config/ui';
  import { applyPageTheme } from '$lib/utils/pageTheme';
  import { useScrollToCurrent } from '$lib/utils/scroll';
  import FlightCard   from '$lib/components/cards/FlightCard.svelte';
  import FlashHandler from '$lib/components/ui/FlashHandler.svelte';
  import FAB          from '$lib/components/ui/FAB.svelte';
  import PageTitle    from '$lib/components/ui/PageTitle.svelte';
  import { openModal } from '$lib/stores/ui';
  import { dmToLabel, dmToDow, todayDm } from '$lib/utils/dates';
  import { groupByKey } from '$lib/utils/group';

  const today = todayDm();

  $: grouped = groupByKey($flightList, f => f.dm);

  function dayLabel(dm: number, dow: string) {
    return `${dmToLabel(dm)} · ${dow}`;
  }

  let cleanup: () => void;
  onMount(() => { cleanup = applyPageTheme(PAGE_THEME.vuelos.accent, PAGE_THEME.vuelos.pattern); });
  onDestroy(() => cleanup?.());

  const stopScrollSub = useScrollToCurrent(loading);
</script>

<FlashHandler {loading} />
<FAB on:click={() => openModal('flight')} />
<PageTitle title="Vuelos" />

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else if $flightList.length === 0}
  <p class="empty-msg">No hay vuelos.</p>
{:else}
  {#each grouped as [dm, flights]}
    <div class="day-group">
      <div class="section-label">{dayLabel(dm, flights[0].dow)}</div>
      {#each flights as flight, i (flight.id)}
        <FlightCard {flight} past={flight.dm < today} hasLabel={i === 0} />
      {/each}
    </div>
  {/each}
{/if}
