<script lang="ts">
  import { flightList, loading } from '$lib/stores/trip';
  import FlightCard from '$lib/components/cards/FlightCard.svelte';
  import FilterChips from '$lib/components/ui/FilterChips.svelte';
  import ListToolbar from '$lib/components/ui/ListToolbar.svelte';
  import { openModal } from '$lib/stores/ui';
  import { dmToLabel, todayDm } from '$lib/utils/dates';
  import { scrollAndFlash } from '$lib/utils/flash';
  import { afterNavigate } from '$app/navigation';
  import { tick } from 'svelte';

  const FILTERS = [
    { key: 'all',  label: 'Todos' },
    { key: 'intl', label: '🌍 Internacionales' },
    { key: 'dom',  label: '🇵🇪 Internos' },
  ];

  let filter   = 'all';
  let pastOpen = false;

  const today = todayDm();

  $: filtered = $flightList.filter(f => {
    if (filter === 'intl') return f.intl;
    if (filter === 'dom')  return !f.intl;
    return true;
  });

  $: upcoming = filtered.filter(f => f.dm >= today);
  $: past     = filtered.filter(f => f.dm <  today);

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
<ListToolbar count={filtered.length} singular="vuelo" plural="vuelos" addLabel="+ Añadir vuelo" on:add={() => openModal('flight')} />

{#if $loading}
  <p class="empty-msg">Cargando…</p>
{:else if filtered.length === 0}
  <p class="empty-msg">No hay vuelos en este filtro.</p>
{:else}
  {#each upcoming as flight (flight.id)}
    <div class="flight-group">
      <p class="flight-date">{dmToLabel(flight.dm)} · {flight.dow}</p>
      <FlightCard {flight} />
    </div>
  {/each}

  {#if past.length > 0}
    <button class="past-toggle" on:click={() => (pastOpen = !pastOpen)}>
      <span>Vuelos pasados ({past.length})</span>
      <span class="past-chev" class:open={pastOpen}>›</span>
    </button>

    {#if pastOpen}
      {#each past as flight (flight.id)}
        <div class="flight-group">
          <p class="flight-date">{dmToLabel(flight.dm)} · {flight.dow}</p>
          <FlightCard {flight} past={true} />
        </div>
      {/each}
    {/if}
  {/if}
{/if}

<style>
  .flight-group { margin-bottom: 14px; }
  .flight-date {
    font-size: .68rem; font-weight: 700; letter-spacing: .08em;
    text-transform: uppercase; color: var(--ink-soft);
    margin-bottom: 4px; padding: 0 2px;
  }
  .empty-msg { text-align: center; color: var(--ink-soft); padding: 40px 0; font-size: .85rem; }

  .past-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 4px;
    background: none;
    border: none;
    border-top: 1px solid var(--line);
    margin-top: 4px;
    font-family: inherit;
    font-size: .72rem;
    font-weight: 700;
    color: var(--ink-soft);
    letter-spacing: .06em;
    text-transform: uppercase;
    cursor: pointer;
  }
  .past-chev {
    font-size: 1rem;
    transition: transform .2s;
    display: inline-block;
  }
  .past-chev.open { transform: rotate(90deg); }
</style>
