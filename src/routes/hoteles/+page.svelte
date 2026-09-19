<script lang="ts">
  import { stayList, loading } from '$lib/stores/trip';
  import HotelCard from '$lib/components/cards/HotelCard.svelte';
  import FilterChips from '$lib/components/ui/FilterChips.svelte';
  import ListToolbar from '$lib/components/ui/ListToolbar.svelte';
  import { openModal } from '$lib/stores/ui';
  import { scrollAndFlash } from '$lib/utils/flash';
  import { todayDm } from '$lib/utils/dates';
  import { afterNavigate } from '$app/navigation';
  import { tick } from 'svelte';

  const FILTERS = [
    { key: 'all',      label: 'Todos' },
    { key: 'lima',     label: '🏙 Lima' },
    { key: 'arequipa', label: '🌋 Arequipa' },
    { key: 'cusco',    label: '🏔 Cusco' },
    { key: 'selva',    label: '🌿 Amazonia' },
  ];

  let filter   = 'all';
  let pastOpen = false;
  const today  = todayDm();

  $: filtered  = filter === 'all' ? $stayList : $stayList.filter(h => h.city === filter);
  $: upcoming  = filtered.filter(h => h.endDm >= today);
  $: past      = filtered.filter(h => h.endDm <  today);

  let pendingFlash: string | null = null;
  let pendingDone  = false;

  afterNavigate(({ to }) => {
    const id = to?.url.searchParams.get('flash') ?? null;
    pendingFlash = id;
    pendingDone  = false;
  });

  $: if (pendingFlash && !pendingDone && !$loading) {
    pendingDone = true;
    const id = pendingFlash;
    tick().then(() => scrollAndFlash(id));
  }
</script>

<FilterChips filters={FILTERS} active={filter} on:change={(e) => (filter = e.detail)} />
<ListToolbar count={filtered.length} singular="alojamiento" plural="alojamientos" addLabel="+ Añadir alojamiento" on:add={() => openModal('hotel')} />

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else if filtered.length === 0}
  <p class="empty-msg">No hay alojamientos en este filtro.</p>
{:else}
  {#each upcoming as hotel (hotel.id)}
    <HotelCard {hotel} />
  {/each}

  {#if past.length > 0}
    <button class="past-toggle" on:click={() => (pastOpen = !pastOpen)}>
      <span>Alojamientos pasados ({past.length})</span>
      <span class="past-chev" class:open={pastOpen}>›</span>
    </button>

    {#if pastOpen}
      {#each past as hotel (hotel.id)}
        <HotelCard {hotel} past={true} />
      {/each}
    {/if}
  {/if}
{/if}

<style>
  .empty-msg { text-align: center; color: var(--ink-soft); padding: 40px 0; font-size: .85rem; }
  .past-toggle {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 10px 4px; background: none; border: none;
    border-top: 1px solid var(--line); margin-top: 4px;
    font-family: inherit; font-size: .72rem; font-weight: 700;
    color: var(--ink-soft); letter-spacing: .06em; text-transform: uppercase; cursor: pointer;
  }
  .past-chev { font-size: 1rem; transition: transform .2s; display: inline-block; }
  .past-chev.open { transform: rotate(90deg); }
</style>
