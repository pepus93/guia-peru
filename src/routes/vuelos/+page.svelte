<script lang="ts">
  import { flightList, loading } from '$lib/stores/trip';
  import FlightCard    from '$lib/components/cards/FlightCard.svelte';
  import FlashHandler  from '$lib/components/ui/FlashHandler.svelte';
  import PastToggle    from '$lib/components/ui/PastToggle.svelte';
  import FAB           from '$lib/components/ui/FAB.svelte';
  import PageTitle     from '$lib/components/ui/PageTitle.svelte';
  import { openModal } from '$lib/stores/ui';
  import { dmToLabel, dmToDow, todayDm } from '$lib/utils/dates';

  let pastOpen = false;
  const today  = todayDm();

  $: upcoming = $flightList.filter(f => f.dm >= today);
  $: past     = $flightList.filter(f => f.dm <  today);

  function groupByDm(flights: typeof $flightList) {
    const map = new Map<number, typeof $flightList>();
    for (const f of flights) {
      if (!map.has(f.dm)) map.set(f.dm, []);
      map.get(f.dm)!.push(f);
    }
    return [...map.entries()];
  }

  $: groupedUpcoming = groupByDm(upcoming);
  $: groupedPast     = groupByDm(past);

  function dayLabel(dm: number, dow: string) {
    return `${dmToLabel(dm)} · ${dow}`;
  }
</script>

<FlashHandler {loading} />
<FAB on:click={() => openModal('flight')} />
<PageTitle title="Vuelos" eyebrow="Perú 2026" accent="var(--sky)" />

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else if $flightList.length === 0}
  <p class="empty-msg">No hay vuelos.</p>
{:else}
  {#each groupedUpcoming as [dm, flights]}
    <div class="day-group">
      <div class="section-label">{dayLabel(dm, flights[0].dow)}</div>
      {#each flights as flight (flight.id)}
        <FlightCard {flight} />
      {/each}
    </div>
  {/each}

  {#if past.length > 0}
    <PastToggle count={past.length} label="Vuelos pasados" bind:open={pastOpen} />
    {#if pastOpen}
      {#each groupedPast as [dm, flights]}
        <div class="day-group">
          <div class="section-label">{dayLabel(dm, flights[0].dow)}</div>
          {#each flights as flight (flight.id)}
            <FlightCard {flight} past={true} />
          {/each}
        </div>
      {/each}
    {/if}
  {/if}
{/if}
