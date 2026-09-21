<script lang="ts">
  import type { Flight, BoardingPass } from '$lib/models/types';
  import { FlightModel } from '$lib/models/FlightModel';
  import { openModal, openBpModal } from '$lib/stores/ui';
  import { deleteFlight } from '$lib/stores/trip';
  import { getBpImage } from '$lib/utils/bpStorage';
  import Card       from './Card.svelte';
  import Icon       from '$lib/components/ui/Icon.svelte';
  import RouteTrack from '$lib/components/ui/RouteTrack.svelte';
  import { flashId } from '$lib/stores/ui';

  export let flight: Flight;
  export let compact = false;
  export let past    = false;

  $: model    = new FlightModel(flight);
  $: flashing = $flashId === flight.id;

  let expanded = false;
  $: if ($flashId === flight.id) expanded = true;

  function edit() { openModal('flight', flight); }
  async function remove() { await deleteFlight(flight.id); }

  // Boarding passes
  const TRAVELERS: Array<{ id: 'pepe' | 'sunta'; label: string }> = [
    { id: 'pepe',  label: 'Pepe' },
    { id: 'sunta', label: 'Sunta' },
  ];

  function getBp(tid: 'pepe' | 'sunta'): BoardingPass | undefined {
    return flight.boardingPasses?.find(p => p.travelerId === tid);
  }

  let bpImages: Record<string, string | null> = { pepe: null, sunta: null };
  $: { flight.boardingPasses; bpImages = { pepe: getBpImage(flight.id, 'pepe'), sunta: getBpImage(flight.id, 'sunta') }; }

  // Full-screen image viewer
  let viewerSrc: string | null = null;
</script>

<Card id={flight.id} {flashing} {past} flashColor="var(--sky)" cssClass="flight-card{model.isInternational ? ' is-intl' : ''}" dayDm={flight.dm} collapsible={!compact} bind:expanded onEdit={!compact ? edit : undefined} onDelete={!compact ? remove : undefined}>

  <!-- Resumen siempre visible -->
  <div class="card-badge" style="color: {model.isInternational ? 'var(--terra)' : 'var(--sky)'}">{model.typeLabel}</div>

  <div class="flight-row">
    <div class="flight-city">
      <span class="iata">{flight.from}</span>
      <span class="city-name">{flight.fromCity}</span>
      <span class="time font-serif">{flight.dep}</span>
    </div>

    <RouteTrack
      icon="plane"
      color="var(--sky)"
      info="{flight.airline}{flight.code ? ` · ${flight.code}` : ''}"
      iconSize={15}
      padding="0 6px"
    />

    <div class="flight-city right">
      <span class="iata">{flight.to}</span>
      <span class="city-name">{flight.toCity}</span>
      <span class="time font-serif">{flight.arr}</span>
    </div>
  </div>

  {#if model.infoBadges.length}
    <div class="pill-line badges-row">
      {#each model.infoBadges as b}<span class="pill {b.cls}">{b.label}</span>{/each}
    </div>
  {/if}

  <!-- Aviso crítico: llegar con tiempo -->
  <span class="transport-early"><Icon name="clock" size={13} /> {model.earlyLabel}</span>

  <!-- Detalle expandible -->
  <svelte:fragment slot="detail">
    <!-- Cómo llegar -->
    {#if flight.transport}
      <div class="card-section">
        <div class="card-section-title">
          <Icon name="car" size={14} />
          Cómo llegar al aeropuerto
        </div>
        <span class="transport-how">{flight.transport.how}</span>
      </div>
    {/if}

    <!-- Tarjetas de embarque -->
    <div class="card-section bp-section">
      <div class="card-section-title">
        <Icon name="ticket" size={14} />
        Tarjetas de embarque
      </div>
      {#each TRAVELERS as t}
        {@const bp = getBp(t.id)}
        {@const img = bpImages[t.id]}
        <div class="bp-row">
          <div class="bp-who">{t.label}</div>
          {#if img}
            <div class="bp-actions">
              <button class="bp-thumb-btn" on:click={() => (viewerSrc = img)} title="Ver QR">
                <img src={img} alt="Boarding pass" class="bp-thumb" />
              </button>
              <button class="bp-edit-btn" on:click={() => openBpModal(flight, t.id, bp)}>Editar</button>
            </div>
          {:else}
            <button class="bp-add-btn" on:click={() => openBpModal(flight, t.id)} aria-label="Añadir tarjeta de embarque">
              <Icon name="plus" size={16} />
            </button>
          {/if}
        </div>
      {/each}
    </div>
  </svelte:fragment>
</Card>

<!-- Full-screen image viewer -->
{#if viewerSrc}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="viewer-backdrop" on:click={() => (viewerSrc = null)}>
    <img src={viewerSrc} alt="Tarjeta de embarque" class="viewer-img" />
    <button class="viewer-close" on:click={() => (viewerSrc = null)}>
      <Icon name="x" size={16} />
    </button>
  </div>
{/if}

<style>
  .flight-row { display: flex; align-items: center; gap: 8px; }

  .flight-city { display: flex; flex-direction: column; gap: 1px; flex: 1; }
  .flight-city.right { align-items: flex-end; }

  .iata { font-size: 1.15rem; font-weight: 700; color: var(--ink); line-height: 1; }
  .city-name { font-size: .74rem; color: var(--ink-soft); }
  .time { font-size: .9rem; font-weight: 600; color: var(--sky); }

  .transport-how { font-size: .84rem; color: var(--ink-soft); margin-top: 4px; display: block; }
  .transport-early {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: .78rem;
    font-weight: 700;
    color: #b52a2a;
    background: rgba(181,42,42,.1);
    border-radius: 7px;
    padding: 5px 9px;
    margin-top: 4px;
    width: fit-content;
  }

  /* ── Boarding passes ─────────────────────────────────────── */
  .bp-section { margin-top: 12px; padding-top: 10px; padding-bottom: 14px; }
  .bp-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 1px solid var(--line);
  }
  .bp-row:last-child { border-bottom: none; }

  .bp-who {
    font-size: .86rem;
    font-weight: 700;
    color: var(--ink);
    min-width: 42px;
  }
  .bp-actions {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-shrink: 0;
  }
  .bp-thumb-btn {
    background: none;
    border: 1px solid var(--line);
    border-radius: 5px;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    width: 38px; height: 38px;
    flex-shrink: 0;
  }
  .bp-thumb {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }
  .bp-edit-btn {
    font-size: .8rem;
    font-weight: 600;
    color: var(--ink-soft);
    background: var(--paper-2);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 3px 9px;
    cursor: pointer;
  }
  .bp-add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(58,110,165,.12);
    color: var(--sky);
    border: none;
    cursor: pointer;
    margin-left: auto;
    flex-shrink: 0;
    transition: background .15s;
    -webkit-tap-highlight-color: transparent;
  }
  .bp-add-btn:active { background: rgba(58,110,165,.28); }
  @media (hover: hover) { .bp-add-btn:hover { background: rgba(58,110,165,.22); } }

  /* ── Full-screen viewer ──────────────────────────────────── */
  .viewer-backdrop {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(0,0,0,.92);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .viewer-img {
    width: 100%;
    height: 100dvh;
    object-fit: contain;
    touch-action: pinch-zoom;
  }
  .viewer-close {
    position: absolute;
    top: 16px; right: 16px;
    background: rgba(255,255,255,.15);
    border: none;
    color: #fff;
    font-size: 1.1rem;
    width: 36px; height: 36px;
    border-radius: 50%;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
</style>
