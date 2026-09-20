<script lang="ts">
  import type { Accommodation } from '$lib/models/types';
  import { saveAccommodation, tripDays } from '$lib/stores/trip';
  import { closeModal } from '$lib/stores/ui';
  import { nanoid } from '$lib/utils/nanoid';
  import { dmToLabel, dmToDateRange } from '$lib/utils/dates';
  import { TRIP_ID } from '$lib/config';

  export let data: Partial<Accommodation> | null = null;

  let form: Accommodation = {
    id:       data?.id       || nanoid('hot_'),
    tripId:   data?.tripId   || TRIP_ID,
    name:     data?.name     || '',
    city:     data?.city     || $tripDays[0]?.city || 'lima',
    dates:    data?.dates    || '',
    startDm:  data?.startDm  ?? ($tripDays[0]?.d || 1009),
    endDm:    data?.endDm    ?? ($tripDays[0]?.d || 1009),
    addr:     data?.addr     || '',
    tel:      data?.tel      || '',
    checkIn:   data?.checkIn   || '',
    checkOut:  data?.checkOut  || '',
    breakfast: data?.breakfast ?? false,
    notes:     data?.notes     || '',
  };

  // Sincroniza ciudad y fechas cuando cambian los selectores de día
  $: {
    const startDay = $tripDays.find(d => d.d === form.startDm);
    if (startDay) form.city = startDay.city;
    form.dates = dmToDateRange(form.startDm, form.endDm);
  }

  let saving = false;

  async function submit() {
    if (!form.name.trim()) return;
    saving = true;
    try {
      await saveAccommodation(form);
      closeModal();
    } finally {
      saving = false;
    }
  }
</script>

<h2 class="form-title">{data?.id ? 'Editar alojamiento' : 'Nuevo alojamiento'}</h2>

<form on:submit|preventDefault={submit} class="form">
  <label class="field">
    <span>Nombre *</span>
    <input type="text" bind:value={form.name} placeholder="Hotel Límade ★★★" required />
  </label>

  <div class="row-2">
    <label class="field">
      <span>Check-in (día)</span>
      <select bind:value={form.startDm}>
        {#each $tripDays as d}
          <option value={d.d}>{dmToLabel(d.d)}</option>
        {/each}
      </select>
    </label>
    <label class="field">
      <span>Check-out (día)</span>
      <select bind:value={form.endDm}>
        {#each $tripDays as d}
          <option value={d.d}>{dmToLabel(d.d)}</option>
        {/each}
      </select>
    </label>
  </div>

  <label class="field">
    <span>Dirección</span>
    <input type="text" bind:value={form.addr} placeholder="Calle Bellavista 112, Miraflores…" />
  </label>

  <label class="field">
    <span>Teléfono</span>
    <input type="tel" bind:value={form.tel} placeholder="+51..." />
  </label>

  <div class="row-2">
    <label class="field">
      <span>Check-in</span>
      <input type="text" bind:value={form.checkIn} placeholder="desde las 15:00" />
    </label>
    <label class="field">
      <span>Check-out</span>
      <input type="text" bind:value={form.checkOut} placeholder="hasta las 12:00" />
    </label>
  </div>

  <label class="field field-check">
    <input type="checkbox" bind:checked={form.breakfast} />
    <span>Desayuno incluido</span>
  </label>

  <label class="field">
    <span>Notas</span>
    <input type="text" bind:value={form.notes} placeholder="Aparcamiento gratuito, etc." />
  </label>

  <div class="form-footer">
    <button type="button" class="btn btn-outline" on:click={closeModal}>Cancelar</button>
    <button type="submit" class="btn btn-primary" disabled={saving}>
      {saving ? 'Guardando…' : 'Guardar'}
    </button>
  </div>
</form>
