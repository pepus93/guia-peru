<script lang="ts">
  import type { Accommodation } from '$lib/models/types';
  import { AccommodationModel } from '$lib/models/AccommodationModel';
  import { openModal, flashId } from '$lib/stores/ui';
  import { deleteAccommodation } from '$lib/stores/trip';
  import Card        from './Card.svelte';
  import ContactInfo from '$lib/components/ui/ContactInfo.svelte';

  export let hotel: Accommodation;
  export let compact = false;
  export let past    = false;

  $: model    = new AccommodationModel(hotel);
  $: flashing = $flashId === hotel.id;

  function edit() { openModal('hotel', hotel); }
  async function remove() { await deleteAccommodation(hotel.id); }
</script>

<Card id={hotel.id} {flashing} {past} flashColor="var(--jade)" cssClass="hotel-card" dayDm={hotel.startDm} endDm={hotel.endDm} onEdit={!compact ? edit : undefined} onDelete={!compact ? remove : undefined}>
  <div class="hotel-header">
    <div class="hotel-info">
      <span class="hotel-name">{hotel.name}</span>
      <span class="hotel-dates">{hotel.dates}</span>
      {#if hotel.addr}
        <a class="hotel-addr-link" href={model.mapsUrl} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 12 16" width="10" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 1C3.79 1 2 2.79 2 5c0 3.25 4 8.5 4 8.5S10 8.25 10 5c0-2.21-1.79-4-4-4z"/>
            <circle cx="6" cy="5" r="1.5"/>
          </svg>
          {hotel.addr}
        </a>
      {/if}
      {#if hotel.notes}
        <span class="hotel-notes">{hotel.notes}</span>
      {/if}
      {#if model.infoBadges.length}
        <div class="pill-line badges-row">
          {#each model.infoBadges as b}<span class="pill {b.cls}">{b.label}</span>{/each}
        </div>
      {/if}
    </div>
  </div>

  <ContactInfo tel={hotel.tel || undefined} />
</Card>

<style>
  .hotel-header { display: flex; gap: 8px; align-items: flex-start; }
  .hotel-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
  .hotel-name  { font-size: .9rem; font-weight: 700; color: var(--ink); }
  .hotel-dates { font-size: .78rem; color: var(--jade); font-weight: 600; }
  .hotel-addr-link {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: .76rem;
    color: var(--sky);
    text-decoration: none;
    margin-top: 1px;
  }
  .hotel-notes { font-size: .76rem; color: var(--jade); margin-top: 1px; }
  .hotel-times { font-size: .76rem; color: var(--ink-soft); }
  .badges-row  { margin-top: 6px; }
</style>
