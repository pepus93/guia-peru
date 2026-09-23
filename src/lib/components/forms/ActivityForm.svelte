<script lang="ts">
  import type { Activity, ActivityType } from '$lib/models/types';
  import { ACTIVITY_TYPES } from '$lib/config/ui';
  import { saveActivity, tripDays } from '$lib/stores/trip';
  import { closeModal } from '$lib/stores/ui';
  import { nanoid } from '$lib/utils/nanoid';
  import { dmToLabel } from '$lib/utils/dates';
  import { TRIP_ID } from '$lib/config';

  export let data: Partial<Activity> | null = null;

  let form: Activity = {
    id:         data?.id    || nanoid('act_'),
    tripId:     data?.tripId || TRIP_ID,
    dayDm:      data?.dayDm  || $tripDays[0]?.d || 1009,
    city:       data?.city   || $tripDays[0]?.city || 'lima',
    type:       data?.type   || 'tour',
    name:       data?.name   || '',
    time:       data?.time   || '',
    duration:   data?.duration || '',
    note:       data?.note   || '',
    meet:       data?.meet   || '',
    end:        data?.end    || '',
    meetQuery:  data?.meetQuery || '',
    endQuery:   data?.endQuery  || '',
    mapsQuery:  data?.mapsQuery || '',
    bookingUrl: data?.bookingUrl || '',
    tel:        data?.tel    || '',
  };

  function onDayChange() {
    const day = $tripDays.find(d => d.d === form.dayDm);
    if (day) form.city = day.city;
  }

  let saving = false;

  async function submit() {
    if (!form.name.trim()) return;
    saving = true;
    try {
      await saveActivity(form);
      closeModal();
    } finally {
      saving = false;
    }
  }
</script>

<h2 class="form-title">{data?.id ? 'Editar plan' : 'Nuevo plan'}</h2>

<form on:submit|preventDefault={submit} class="form">
  <label class="field">
    <span>Día *</span>
    <select bind:value={form.dayDm} on:change={onDayChange}>
      {#each $tripDays as d}
        <option value={d.d}>{dmToLabel(d.d)} · {d.title}</option>
      {/each}
    </select>
  </label>

  <label class="field">
    <span>Tipo</span>
    <select bind:value={form.type}>
      {#each Object.entries(ACTIVITY_TYPES) as [key, info]}
        <option value={key}>{info.label}</option>
      {/each}
    </select>
  </label>

  <label class="field">
    <span>Nombre *</span>
    <input type="text" bind:value={form.name} placeholder="Ej. Free Tour Miraflores" required />
  </label>

  <div class="row-2">
    <label class="field">
      <span>Hora</span>
      <input type="text" bind:value={form.time} placeholder="10:00" />
    </label>
    <label class="field">
      <span>Duración</span>
      <input type="text" bind:value={form.duration} placeholder="~2h" />
    </label>
  </div>

  <label class="field">
    <span>Nota / agencia</span>
    <input type="text" bind:value={form.note} placeholder="Civitatis · propina voluntaria" />
  </label>

  <label class="field">
    <span>Punto de inicio</span>
    <input type="text" bind:value={form.meet} placeholder="Óvalo de Miraflores" />
  </label>

  <label class="field">
    <span>Búsqueda Mapa inicio (Google Maps)</span>
    <input type="text" bind:value={form.meetQuery} placeholder="Óvalo de Miraflores, Lima" />
  </label>

  <label class="field">
    <span>Punto de fin</span>
    <input type="text" bind:value={form.end} placeholder="Parque del Amor" />
  </label>

  <label class="field">
    <span>Búsqueda Mapa fin (Google Maps)</span>
    <input type="text" bind:value={form.endQuery} placeholder="Parque del Amor, Lima" />
  </label>

  <label class="field">
    <span>Teléfono</span>
    <input type="tel" bind:value={form.tel} placeholder="+51..." />
  </label>

  <label class="field">
    <span>URL reserva</span>
    <input type="url" bind:value={form.bookingUrl} placeholder="https://..." />
  </label>

  <div class="form-footer">
    <button type="button" class="btn btn-outline" on:click={closeModal}>Cancelar</button>
    <button type="submit" class="btn btn-primary" disabled={saving}>
      {saving ? 'Guardando…' : 'Guardar'}
    </button>
  </div>
</form>

