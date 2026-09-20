<script lang="ts">
  import type { Accommodation } from '$lib/models/types';
  import { AccommodationModel } from '$lib/models/AccommodationModel';
  import { openModal, flashId } from '$lib/stores/ui';
  import { deleteAccommodation } from '$lib/stores/trip';
  import { dmToLabel } from '$lib/utils/dates';
  import Card        from './Card.svelte';
  import ContactInfo from '$lib/components/ui/ContactInfo.svelte';
  import Icon        from '$lib/components/ui/Icon.svelte';

  export let hotel: Accommodation;
  export let compact = false;
  export let past    = false;

  const CITY_LABEL: Record<string, string> = {
    lima:     'Lima',
    arequipa: 'Arequipa',
    cusco:    'Cusco',
    selva:    'Amazonia',
  };

  $: model    = new AccommodationModel(hotel);
  $: flashing = $flashId === hotel.id;
  $: cityLabel = CITY_LABEL[hotel.city] ?? hotel.city;

  let expanded = false;
  $: if ($flashId === hotel.id) expanded = true;

  function edit() { openModal('hotel', hotel); }
  async function remove() { await deleteAccommodation(hotel.id); }
</script>

<Card id={hotel.id} {flashing} {past} flashColor="var(--jade)" cssClass="hotel-card" dayDm={hotel.startDm} endDm={hotel.endDm} collapsible={!compact} bind:expanded onEdit={!compact ? edit : undefined} onDelete={!compact ? remove : undefined}>

  <!-- Badge -->
  <div class="hotel-badge">{cityLabel}</div>

  <!-- Timeline de estancia -->
  <div class="stay-row">
    <div class="stay-side">
      <span class="stay-date font-serif">{dmToLabel(hotel.startDm)}</span>
      <span class="stay-label">Check-in</span>
      {#if hotel.checkIn}<span class="stay-time font-serif">{hotel.checkIn}</span>{/if}
    </div>

    <div class="stay-route">
      <div class="route-track">
        <div class="route-dot"></div>
        <div class="route-line"></div>
        <span class="route-icon"><Icon name="bed" size={14} /></span>
        <div class="route-line"></div>
        <div class="route-dot"></div>
      </div>
    </div>

    <div class="stay-side right">
      <span class="stay-date font-serif">{dmToLabel(hotel.endDm)}</span>
      <span class="stay-label">Check-out</span>
      {#if hotel.checkOut}<span class="stay-time font-serif">{hotel.checkOut}</span>{/if}
    </div>
  </div>

  <!-- Nombre -->
  <div class="hotel-name">{hotel.name}</div>

  <!-- Dirección -->
  {#if hotel.addr}
    <div class="addr-row">
      <a class="addr-map-btn" href={model.mapsUrl} target="_blank" rel="noreferrer" aria-label="Ver en mapa">
        <Icon name="map-pin" size={15} />
      </a>
      <span class="addr-text">{hotel.addr}</span>
    </div>
  {/if}

  <!-- Detalle expandible -->
  <svelte:fragment slot="detail">
    {#if hotel.notes}
      <p class="hotel-notes">{hotel.notes}</p>
    {/if}

    <ContactInfo tel={hotel.tel || undefined} />

    {#if hotel.breakfast}
      <div class="amenity-row">
        <Icon name="coffee" size={14} />
        <span class="amenity-label">Desayuno incluido</span>
      </div>
    {/if}
  </svelte:fragment>
</Card>

<style>
  .hotel-badge {
    font-size: .7rem;
    font-weight: 700;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: var(--jade);
    margin-bottom: 10px;
  }

  /* ── Timeline ──────────────────────────────────────── */
  .stay-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .stay-side {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 0 0 auto;
  }
  .stay-side.right { align-items: flex-end; }

  .stay-date {
    font-size: .9rem;
    font-weight: 600;
    color: var(--jade);
    line-height: 1;
  }

  .stay-label {
    font-size: .64rem;
    color: var(--ink-soft);
    text-transform: uppercase;
    letter-spacing: .06em;
    font-weight: 600;
  }

  .stay-time {
    font-size: .76rem;
    font-weight: 600;
    color: var(--jade);
    line-height: 1;
  }

  .stay-route {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 4px;
    min-width: 0;
  }

  .route-track {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 3px;
    color: var(--jade);
  }

  .route-dot {
    flex-shrink: 0;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--jade);
    opacity: .5;
  }

  .route-line {
    flex: 1;
    height: 1.5px;
    background: repeating-linear-gradient(
      to right,
      rgba(63,125,100,.45) 0px,
      rgba(63,125,100,.45) 5px,
      transparent 5px,
      transparent 9px
    );
  }

  .route-icon { flex-shrink: 0; color: var(--jade); }

  /* ── Nombre y dirección ────────────────────────────── */
  .hotel-name {
    font-size: .88rem;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.2;
  }

  /* ── Detalle ───────────────────────────────────────── */
  .hotel-notes { font-size: .76rem; color: var(--jade); margin: 6px 0 0; line-height: 1.4; }

  .amenity-row {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 2px;
    color: var(--jade);
  }
  .amenity-label {
    font-size: .78rem;
    font-weight: 600;
    color: var(--jade);
  }
</style>
