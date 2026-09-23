<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { stayList, loading } from '$lib/stores/trip';
  import { CITY_LABELS } from '$lib/models/types';
  import HotelCard    from '$lib/components/cards/HotelCard.svelte';
  import FlashHandler from '$lib/components/ui/FlashHandler.svelte';
  import FAB          from '$lib/components/ui/FAB.svelte';
  import PageTitle    from '$lib/components/ui/PageTitle.svelte';
  import { openModal } from '$lib/stores/ui';
  import { todayDm } from '$lib/utils/dates';
  import { afterNavigate } from '$app/navigation';
  import { scrollToCurrent } from '$lib/utils/scroll';

  onMount(() => {
    document.body.style.setProperty('--page-bg', 'color-mix(in srgb, var(--jade) 8%, var(--paper))');
    document.body.style.setProperty('--tab-accent', 'var(--jade)');
    document.body.style.backgroundImage = 'url("/patterns/hotels.svg")';
    document.body.style.backgroundRepeat = 'repeat';
  });
  onDestroy(() => {
    document.body.style.removeProperty('--page-bg');
    document.body.style.removeProperty('--tab-accent');
    document.body.style.backgroundImage = '';
    document.body.style.backgroundRepeat = '';
  });

  const today = todayDm();

  function hotelLabel(h: typeof $stayList[0]) {
    return `${h.dates} · ${CITY_LABELS[h.city] ?? h.city}`;
  }

  let pendingScroll = false;
  $: if (!$loading && pendingScroll) { pendingScroll = false; scrollToCurrent(); }

  afterNavigate(({ to }) => {
    if (to?.url.searchParams.has('flash')) return;
    if ($loading) { pendingScroll = true; } else { scrollToCurrent(); }
  });
</script>

<FlashHandler {loading} />
<FAB on:click={() => openModal('hotel')} />
<PageTitle title="Hoteles" eyebrow="Perú 2026" accent="var(--jade)" />

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
