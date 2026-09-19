<script lang="ts">
  import { stayList, loading } from '$lib/stores/trip';
  import HotelCard    from '$lib/components/cards/HotelCard.svelte';
  import FlashHandler from '$lib/components/ui/FlashHandler.svelte';
  import PastToggle   from '$lib/components/ui/PastToggle.svelte';
  import FAB          from '$lib/components/ui/FAB.svelte';
  import { openModal } from '$lib/stores/ui';
  import { todayDm } from '$lib/utils/dates';

  const CITY_LABEL: Record<string, string> = {
    lima:     'Lima',
    arequipa: 'Arequipa',
    cusco:    'Cusco',
    selva:    'Amazonia',
  };

  let pastOpen = false;
  const today  = todayDm();

  $: upcoming = $stayList.filter(h => h.endDm >= today);
  $: past     = $stayList.filter(h => h.endDm <  today);

  function hotelLabel(h: typeof $stayList[0]) {
    return `${h.dates} · ${CITY_LABEL[h.city] ?? h.city}`;
  }
</script>

<FlashHandler {loading} />
<FAB on:click={() => openModal('hotel')} />

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else if $stayList.length === 0}
  <p class="empty-msg">No hay alojamientos.</p>
{:else}
  {#each upcoming as hotel (hotel.id)}
    <div class="day-group">
      <div class="section-label">{hotelLabel(hotel)}</div>
      <HotelCard {hotel} />
    </div>
  {/each}

  {#if past.length > 0}
    <PastToggle count={past.length} label="Alojamientos pasados" bind:open={pastOpen} />
    {#if pastOpen}
      {#each past as hotel (hotel.id)}
        <div class="day-group">
          <div class="section-label">{hotelLabel(hotel)}</div>
          <HotelCard {hotel} past={true} />
        </div>
      {/each}
    {/if}
  {/if}
{/if}
