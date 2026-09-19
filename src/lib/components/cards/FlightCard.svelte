<script lang="ts">
  import type { Flight, BoardingPass } from '$lib/models/types';
  import { FlightModel } from '$lib/models/FlightModel';
  import { openModal, openBpModal } from '$lib/stores/ui';
  import { deleteFlight } from '$lib/stores/trip';
  import { getBpImage } from '$lib/utils/bpStorage';
  import CardMenu from './CardMenu.svelte';
  import { flashId } from '$lib/stores/ui';

  export let flight: Flight;
  export let compact = false;
  export let past    = false;

  $: model    = new FlightModel(flight);
  $: flashing = $flashId === flight.id;

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
  $: if (flight.id) loadImages();

  function loadImages() {
    bpImages = {
      pepe:  getBpImage(flight.id, 'pepe'),
      sunta: getBpImage(flight.id, 'sunta'),
    };
  }

  // Full-screen image viewer
  let viewerSrc: string | null = null;
</script>

<div id={flight.id} class="card flight-card" class:is-intl={model.isInternational} class:flash={flashing} class:is-past={past}>
  <div class="flight-badge">{model.typeLabel}</div>

  <div class="flight-row">
    <div class="flight-city">
      <span class="iata">{flight.from}</span>
      <span class="city-name">{flight.fromCity}</span>
      <span class="time font-serif">{flight.dep}</span>
    </div>
    <div class="flight-arrow">
      <span class="airline">{flight.airline}</span>
      <span class="arrow">──✈──▶</span>
      <span class="code">{flight.code ?? ''}</span>
    </div>
    <div class="flight-city right">
      <span class="iata">{flight.to}</span>
      <span class="city-name">{flight.toCity}</span>
      <span class="time font-serif">{flight.arr}</span>
    </div>

    {#if !compact}
      <CardMenu onEdit={edit} onDelete={remove} />
    {/if}
  </div>

  {#if model.infoBadges.length}
    <div class="pill-line badges-row">
      {#each model.infoBadges as b}<span class="pill {b.cls}">{b.label}</span>{/each}
    </div>
  {/if}

  {#if flight.transport}
    <div class="flight-transport">
      <span class="transport-how">🚖 {flight.transport.how}</span>
      <span class="transport-early">⏰ {model.earlyLabel}</span>
    </div>
  {:else}
    <div class="transport-early early-solo">⏰ {model.earlyLabel}</div>
  {/if}

  {#if !compact}
    <!-- Boarding passes section -->
    <div class="card-section bp-section">
      <div class="card-section-title">🎫 Tarjetas de embarque</div>
      {#each TRAVELERS as t}
        {@const bp = getBp(t.id)}
        {@const img = bpImages[t.id]}
        <div class="bp-row">
          <div class="bp-who">{t.label}</div>
          {#if bp}
            <div class="bp-data">
              {#if bp.locator}<span class="bp-loc">{bp.locator}</span>{/if}
              {#if bp.terminal}<span class="bp-field">T{bp.terminal}</span>{/if}
              {#if bp.gate}<span class="bp-field">Puerta <strong>{bp.gate}</strong></span>{/if}
              {#if bp.boardingTime}<span class="bp-field">🕐 {bp.boardingTime}</span>{/if}
              {#if bp.seat}<span class="bp-seat">{bp.seat}</span>{/if}
            </div>
            <div class="bp-actions">
              {#if img}
                <button class="bp-img-btn" on:click={() => (viewerSrc = img)} title="Ver QR">🖼</button>
              {/if}
              <button class="bp-edit-btn" on:click={() => openBpModal(flight, t.id, bp)}>Editar</button>
            </div>
          {:else}
            <button class="bp-add-btn" on:click={() => openBpModal(flight, t.id)}>+ Añadir</button>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Full-screen image viewer -->
{#if viewerSrc}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="viewer-backdrop" on:click={() => (viewerSrc = null)}>
    <img src={viewerSrc} alt="Tarjeta de embarque" class="viewer-img" />
    <button class="viewer-close" on:click={() => (viewerSrc = null)}>✕</button>
  </div>
{/if}

<style>
  .flight-card {
    --flash-color: var(--sky);
  }
  .flight-card.is-past { filter: grayscale(.75); opacity: .55; }

  .flight-badge { font-size: .6rem; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--sky); margin-bottom: 10px; }
  .is-intl .flight-badge { color: var(--terra); }

  .flight-row { display: flex; align-items: center; gap: 8px; }

  .flight-city { display: flex; flex-direction: column; gap: 1px; flex: 1; }
  .flight-city.right { align-items: flex-end; }

  .iata { font-size: 1.15rem; font-weight: 700; color: var(--ink); line-height: 1; }
  .city-name { font-size: .65rem; color: var(--ink-soft); }
  .time { font-size: .9rem; font-weight: 600; color: var(--sky); }

  .flight-arrow { display: flex; flex-direction: column; align-items: center; gap: 1px; flex: 0 0 auto; }
  .airline { font-size: .62rem; color: var(--ink-soft); }
  .arrow { color: var(--sky); font-size: .75rem; }
  .code { font-size: .62rem; font-weight: 700; color: var(--ink-soft); letter-spacing: .04em; }

  .badges-row { margin-top: 8px; }
  .flight-transport { margin-top: 6px; display: flex; flex-direction: column; gap: 2px; }
  .transport-how  { font-size: .72rem; color: var(--ink-soft); }
  .transport-early { font-size: .7rem; font-weight: 700; color: var(--terra); }
  .early-solo { margin-top: 6px; }

  /* ── Boarding passes ─────────────────────────────────────── */
  .bp-section { margin-top: 12px; padding-top: 10px; }
  .bp-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 1px solid var(--line);
  }
  .bp-row:last-child { border-bottom: none; }

  .bp-who {
    font-size: .78rem;
    font-weight: 700;
    color: var(--ink);
    min-width: 42px;
  }
  .bp-data {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    align-items: center;
    flex: 1;
  }
  .bp-loc {
    font-size: .72rem;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: .05em;
    background: var(--paper-2);
    border: 1px solid var(--line);
    border-radius: 5px;
    padding: 1px 6px;
  }
  .bp-field {
    font-size: .72rem;
    color: var(--ink-soft);
  }
  .bp-seat {
    font-size: .78rem;
    font-weight: 700;
    color: var(--sky);
    background: rgba(58,110,165,.1);
    border-radius: 5px;
    padding: 1px 7px;
  }
  .bp-actions {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-shrink: 0;
  }
  .bp-img-btn {
    font-size: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    line-height: 1;
  }
  .bp-edit-btn {
    font-size: .72rem;
    font-weight: 600;
    color: var(--ink-soft);
    background: var(--paper-2);
    border: 1px solid var(--line);
    border-radius: 6px;
    padding: 3px 9px;
    cursor: pointer;
  }
  .bp-add-btn {
    font-size: .72rem;
    font-weight: 600;
    color: var(--clay);
    background: none;
    border: 1px dashed var(--clay);
    border-radius: 6px;
    padding: 3px 10px;
    cursor: pointer;
    margin-left: auto;
  }

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
    max-width: 100%;
    max-height: 100dvh;
    object-fit: contain;
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
