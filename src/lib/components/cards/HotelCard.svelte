<script lang="ts">
  import type { Accommodation } from '$lib/models/types';
  import { AccommodationModel } from '$lib/models/AccommodationModel';
  import { openModal, flashId } from '$lib/stores/ui';
  import { deleteAccommodation } from '$lib/stores/trip';
  import CardMenu from './CardMenu.svelte';
  import Card     from './Card.svelte';

  export let hotel: Accommodation;
  export let compact = false;
  export let past    = false;

  $: model    = new AccommodationModel(hotel);
  $: flashing = $flashId === hotel.id;

  function edit() { openModal('hotel', hotel); }
  async function remove() { await deleteAccommodation(hotel.id); }
</script>

<Card id={hotel.id} {flashing} {past} flashColor="var(--jade)" cssClass="hotel-card" dayDm={hotel.startDm}>
  <div class="hotel-header">
    <div class="hotel-info">
      <span class="hotel-name">{hotel.name}</span>
      <span class="hotel-dates">{hotel.dates}</span>
      <span class="hotel-addr">{hotel.addr}</span>
      {#if hotel.notes}
        <span class="hotel-notes">{hotel.notes}</span>
      {/if}
      {#if model.infoBadges.length}
        <div class="pill-line badges-row">
          {#each model.infoBadges as b}<span class="pill {b.cls}">{b.label}</span>{/each}
        </div>
      {/if}
    </div>
    {#if !compact}
      <CardMenu onEdit={edit} onDelete={remove} />
    {/if}
  </div>

  <div class="row-actions">
    {#if hotel.tel}
      <a class="call" href="tel:{hotel.tel}">📞 Llamar</a>
    {/if}
    <a class="maps" href={model.mapsUrl} target="_blank" rel="noreferrer">📍 Mapa</a>
  </div>
</Card>

<style>
  .hotel-header { display: flex; gap: 8px; align-items: flex-start; }
  .hotel-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
  .hotel-name  { font-size: .85rem; font-weight: 700; color: var(--ink); }
  .hotel-dates { font-size: .7rem; color: var(--jade); font-weight: 600; }
  .hotel-addr  { font-size: .68rem; color: var(--ink-soft); }
  .hotel-notes { font-size: .68rem; color: var(--jade); margin-top: 1px; }
  .hotel-times { font-size: .68rem; color: var(--ink-soft); }
  .badges-row  { margin-top: 6px; }
</style>
