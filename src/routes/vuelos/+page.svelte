<script lang="ts">
  import { flightList, loading } from '$lib/stores/trip';
  import FlightCard    from '$lib/components/cards/FlightCard.svelte';
  import FlashHandler  from '$lib/components/ui/FlashHandler.svelte';
  import PastToggle    from '$lib/components/ui/PastToggle.svelte';
  import FAB           from '$lib/components/ui/FAB.svelte';
  import { openModal } from '$lib/stores/ui';
  import { dmToLabel, dmToDow, todayDm } from '$lib/utils/dates';

  let pastOpen = false;
  const today  = todayDm();

  $: upcoming = $flightList.filter(f => f.dm >= today);
  $: past     = $flightList.filter(f => f.dm <  today);

  function flightLabel(dm: number, dow: string) {
    return `${dmToLabel(dm)} · ${dow}`;
  }
</script>

<FlashHandler {loading} />
<FAB on:click={() => openModal('flight')} />

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else if $flightList.length === 0}
  <p class="empty-msg">No hay vuelos.</p>
{:else}
  {#each upcoming as flight (flight.id)}
    <div class="day-group">
      <div class="section-label">{flightLabel(flight.dm, flight.dow)}</div>
      <FlightCard {flight} />
    </div>
  {/each}

  {#if past.length > 0}
    <PastToggle count={past.length} label="Vuelos pasados" bind:open={pastOpen} />
    {#if pastOpen}
      {#each past as flight (flight.id)}
        <div class="day-group">
          <div class="section-label">{flightLabel(flight.dm, flight.dow)}</div>
          <FlightCard {flight} past={true} />
        </div>
      {/each}
    {/if}
  {/if}
{/if}
