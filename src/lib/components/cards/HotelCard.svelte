<script lang="ts">
  import type { Accommodation } from '$lib/models/types';
  import { CITY_LABELS, FLASH_COLOR } from '$lib/config/ui';
  import { AccommodationModel } from '$lib/models/AccommodationModel';
  import { openModal, flashId } from '$lib/stores/ui';
  import { deleteAccommodation } from '$lib/stores/trip';
  import { dmToLabel } from '$lib/utils/dates';
  import Card      from './Card.svelte';
  import Icon      from '$lib/components/ui/Icon.svelte';
  import RouteTrack from '$lib/components/ui/RouteTrack.svelte';

  export let hotel: Accommodation;
  export let compact   = false;
  export let past      = false;
  export let hasLabel  = false;

  $: model     = new AccommodationModel(hotel);
  $: flashing  = $flashId === hotel.id;
  $: cityLabel = CITY_LABELS[hotel.city] ?? hotel.city;

  function edit() { openModal('hotel', hotel); }
  async function remove() { await deleteAccommodation(hotel.id); }
</script>

<Card id={hotel.id} {flashing} {past} {hasLabel} flashColor={FLASH_COLOR.accommodation} cssClass="hotel-card" dayDm={hotel.startDm} endDm={hotel.endDm} collapsible={false} onEdit={!compact ? edit : undefined} onDelete={!compact ? remove : undefined}>

  <!-- Badge ciudad -->
  <div class="card-badge" style="color: var(--jade)">{cityLabel}</div>

  <!-- Timeline de estancia -->
  <div class="stay-row">
    <div class="stay-side">
      <span class="stay-date font-serif">{dmToLabel(hotel.startDm)}</span>
      <span class="stay-label">Check-in</span>
      {#if hotel.checkIn}<span class="stay-time font-serif">{hotel.checkIn}</span>{/if}
    </div>

    <RouteTrack icon="bed" color="var(--jade)" />

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

  <!-- Teléfono -->
  {#if hotel.tel}
    <div class="addr-row">
      <a class="addr-map-btn" style="--addr-map-color: var(--sky)" href="tel:{hotel.tel}" aria-label="Llamar">
        <Icon name="phone" size={15} />
      </a>
      <span class="addr-text">{hotel.tel}</span>
    </div>
  {/if}

  <!-- Badges -->
  {#if hotel.breakfast}
    <div class="pill-line" style="margin-top:8px">
      <span class="pill pill-gold">
        <Icon name="utensils" size={11} /> Desayuno incluido
      </span>
    </div>
  {/if}

  {#if hotel.notes}
    <p class="hotel-notes">{hotel.notes}</p>
  {/if}

</Card>

<style>
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
    flex: 1;
    min-width: 0;
  }
  .stay-side.right { align-items: flex-end; }

  .stay-date {
    font-size: .9rem;
    font-weight: 600;
    color: var(--jade);
    line-height: 1;
  }

  .stay-label {
    font-size: .72rem;
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

  /* ── Nombre ────────────────────────────────────────── */
  .hotel-name {
    font-size: .88rem;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.2;
  }

  /* ── Notas ─────────────────────────────────────────── */
  .hotel-notes {
    font-size: .76rem;
    color: var(--ink-soft);
    margin: 8px 0 0;
    line-height: 1.4;
  }
</style>
