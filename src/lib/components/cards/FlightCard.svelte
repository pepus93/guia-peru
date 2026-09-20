<script lang="ts">
  import type { Flight, BoardingPass } from '$lib/models/types';
  import { FlightModel } from '$lib/models/FlightModel';
  import { openModal, openBpModal } from '$lib/stores/ui';
  import { deleteFlight } from '$lib/stores/trip';
  import { getBpImage } from '$lib/utils/bpStorage';
  import CardMenu from './CardMenu.svelte';
  import Card     from './Card.svelte';
  import { flashId } from '$lib/stores/ui';
  import { inTrip, todayFlightIds } from '$lib/stores/today';

  export let flight: Flight;
  export let compact = false;
  export let past    = false;

  $: model    = new FlightModel(flight);
  $: flashing = $flashId === flight.id;
  $: isToday  = $inTrip && $todayFlightIds.has(flight.id);

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

<Card id={flight.id} {flashing} {past} {isToday} flashColor="var(--sky)" cssClass="flight-card{model.isInternational ? ' is-intl' : ''}" dayDm={flight.dm}>
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
          {#if img}
            <div class="bp-actions">
              <button class="bp-thumb-btn" on:click={() => (viewerSrc = img)} title="Ver QR">
                <img src={img} alt="Boarding pass" class="bp-thumb" />
              </button>
              <button class="bp-edit-btn" on:click={() => openBpModal(flight, t.id, bp)}>Editar</button>
            </div>
          {:else}
            <button class="bp-add-btn" on:click={() => openBpModal(flight, t.id)}>+ Añadir foto</button>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</Card>

<!-- Full-screen image viewer -->
{#if viewerSrc}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="viewer-backdrop" on:click={() => (viewerSrc = null)}>
    <img src={viewerSrc} alt="Tarjeta de embarque" class="viewer-img" />
    <button class="viewer-close" on:click={() => (viewerSrc = null)}>✕</button>
  </div>
{/if}

<style>
  .flight-badge { font-size: .7rem; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--sky); margin-bottom: 10px; }
  .is-intl .flight-badge { color: var(--terra); }

  .flight-row { display: flex; align-items: center; gap: 8px; }

  .flight-city { display: flex; flex-direction: column; gap: 1px; flex: 1; }
  .flight-city.right { align-items: flex-end; }

  .iata { font-size: 1.15rem; font-weight: 700; color: var(--ink); line-height: 1; }
  .city-name { font-size: .74rem; color: var(--ink-soft); }
  .time { font-size: .9rem; font-weight: 600; color: var(--sky); }

  .flight-arrow { display: flex; flex-direction: column; align-items: center; gap: 1px; flex: 0 0 auto; }
  .airline { font-size: .72rem; color: var(--ink-soft); }
  .arrow { color: var(--sky); font-size: .82rem; }
  .code { font-size: .72rem; font-weight: 700; color: var(--ink-soft); letter-spacing: .04em; }

  .badges-row { margin-top: 8px; }
  .flight-transport { margin-top: 6px; display: flex; flex-direction: column; gap: 2px; }
  .transport-how  { font-size: .8rem; color: var(--ink-soft); }
  .transport-early { font-size: .78rem; font-weight: 700; color: var(--terra); }
  .early-solo { margin-top: 6px; }

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
