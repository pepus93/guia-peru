<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { stayList, loading } from '$lib/stores/trip';
  import { CITY_LABELS, PAGE_THEME } from '$lib/config/ui';
  import { applyPageTheme } from '$lib/utils/pageTheme';
  import { useScrollToCurrent } from '$lib/utils/scroll';
  import HotelCard    from '$lib/components/cards/HotelCard.svelte';
  import FlashHandler from '$lib/components/ui/FlashHandler.svelte';
  import FAB          from '$lib/components/ui/FAB.svelte';
  import PageTitle    from '$lib/components/ui/PageTitle.svelte';
  import { openModal } from '$lib/stores/ui';
  import { todayDm } from '$lib/utils/dates';

  const today = todayDm();

  function hotelLabel(h: typeof $stayList[0]) {
    return `${h.dates} · ${CITY_LABELS[h.city] ?? h.city}`;
  }

  let cleanup: () => void;
  onMount(() => { cleanup = applyPageTheme(PAGE_THEME.hoteles.accent, PAGE_THEME.hoteles.pattern); });
  onDestroy(() => cleanup?.());

  const stopScrollSub = useScrollToCurrent(loading);
</script>

<FlashHandler {loading} />
<FAB on:click={() => openModal('hotel')} />
<PageTitle title="Hoteles" />

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else if $stayList.length === 0}
  <p class="empty-msg">No hay alojamientos.</p>
{:else}
  {#each $stayList as hotel (hotel.id)}
    <div class="day-group">
      <div class="section-label">{hotelLabel(hotel)}</div>
      <HotelCard {hotel} past={hotel.endDm < today} hasLabel={true} />
    </div>
  {/each}
{/if}
