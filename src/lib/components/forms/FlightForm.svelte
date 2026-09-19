<script lang="ts">
  import type { Flight } from '$lib/models/types';
  import { saveFlight } from '$lib/stores/trip';
  import { closeModal } from '$lib/stores/ui';
  import { nanoid } from '$lib/utils/maps';
  import { TRIP_ID } from '$lib/config';

  export let data: Partial<Flight> | null = null;

  let form: Flight = {
    id:       data?.id    || nanoid('fly_'),
    tripId:   data?.tripId || TRIP_ID,
    date:     data?.date   || '',
    dm:       data?.dm     || 1009,
    dow:      data?.dow    || '',
    intl:     data?.intl   ?? false,
    from:     data?.from   || '',
    fromCity: data?.fromCity || '',
    to:       data?.to     || '',
    toCity:   data?.toCity  || '',
    dep:      data?.dep    || '',
    arr:      data?.arr    || '',
    airline:  data?.airline || '',
    code:     data?.code   || '',
    stops:    data?.stops  || '',
    note:     data?.note   || '',
    transport: data?.transport ? { how: data.transport.how } : undefined,
  };

  let transportHow = form.transport?.how ?? '';

  let saving = false;

  async function submit() {
    if (!form.from || !form.to) return;
    saving = true;
    try {
      form.transport = transportHow.trim() ? { how: transportHow.trim() } : undefined;
      await saveFlight(form);
      closeModal();
    } finally {
      saving = false;
    }
  }
</script>

<h2 class="form-title">{data?.id ? 'Editar vuelo' : 'Nuevo vuelo'}</h2>

<form on:submit|preventDefault={submit} class="form">
  <label class="field">
    <span>¿Internacional?</span>
    <label class="toggle">
      <input type="checkbox" bind:checked={form.intl} />
      <span>{form.intl ? 'Sí' : 'No'}</span>
    </label>
  </label>

  <div class="row-2">
    <label class="field">
      <span>Origen (IATA) *</span>
      <input type="text" bind:value={form.from} placeholder="BCN" required />
    </label>
    <label class="field">
      <span>Ciudad origen</span>
      <input type="text" bind:value={form.fromCity} placeholder="Barcelona" />
    </label>
  </div>

  <div class="row-2">
    <label class="field">
      <span>Destino (IATA) *</span>
      <input type="text" bind:value={form.to} placeholder="LIM" required />
    </label>
    <label class="field">
      <span>Ciudad destino</span>
      <input type="text" bind:value={form.toCity} placeholder="Lima" />
    </label>
  </div>

  <div class="row-2">
    <label class="field">
      <span>Salida</span>
      <input type="text" bind:value={form.dep} placeholder="11:25" />
    </label>
    <label class="field">
      <span>Llegada</span>
      <input type="text" bind:value={form.arr} placeholder="21:45" />
    </label>
  </div>

  <label class="field">
    <span>Aerolínea</span>
    <input type="text" bind:value={form.airline} placeholder="Iberia" />
  </label>

  <label class="field">
    <span>Código vuelo</span>
    <input type="text" bind:value={form.code} placeholder="IB 6825" />
  </label>

  <label class="field">
    <span>Nota (escala, etc.)</span>
    <input type="text" bind:value={form.stops} placeholder="Directo" />
  </label>

  <label class="field">
    <span>Cómo llegar al aeropuerto</span>
    <textarea bind:value={transportHow} placeholder="Taxi desde el centro (~20 min, 15 S/)" rows="2"></textarea>
  </label>

  <div class="form-footer">
    <button type="button" class="btn btn-outline" on:click={closeModal}>Cancelar</button>
    <button type="submit" class="btn btn-primary" disabled={saving}>
      {saving ? 'Guardando…' : 'Guardar'}
    </button>
  </div>
</form>

<style>
  .toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: .84rem; font-weight: 600; }
</style>
