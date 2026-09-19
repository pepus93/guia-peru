<script lang="ts">
  import type { Activity } from '$lib/models/types';
  import { ACTIVITY_TYPES } from '$lib/models/types';
  import { ActivityModel } from '$lib/models/ActivityModel';
  import { mapsUrl } from '$lib/utils/maps';
  import { openModal } from '$lib/stores/ui';
  import { deleteActivity } from '$lib/stores/trip';
  import CardMenu from './CardMenu.svelte';

  export let activity: Activity;
  export let compact = false;

  $: model    = new ActivityModel(activity);
  $: typeInfo = model.typeInfo;

  function edit() { openModal('activity', activity); }
  async function remove() { await deleteActivity(activity.id); }
</script>

<div class="card act-card">
  <div class="act-header">
    <span class="act-icon">{typeInfo.icon}</span>
    <div class="act-info">
      <span class="act-type">{typeInfo.label}{activity.time ? ` · ${activity.time}` : ''}{activity.duration ? ` (${activity.duration})` : ''}</span>
      <span class="act-name">{activity.name}</span>
      {#if activity.meet}<span class="act-place">📍 {activity.meet}{activity.end ? ` → 🏁 ${activity.end}` : ''}</span>{/if}
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
    {#if activity.meetQuery}
      <a class="btn btn-secondary" href={mapsUrl(activity.meetQuery)} target="_blank" rel="noreferrer">📍 Mapa inicio</a>
    {/if}
    {#if activity.endQuery}
      <a class="btn btn-secondary" href={mapsUrl(activity.endQuery)} target="_blank" rel="noreferrer">🏁 Mapa fin</a>
    {/if}
    {#if activity.mapsQuery && !activity.meetQuery}
      <a class="btn btn-secondary" href={mapsUrl(activity.mapsQuery)} target="_blank" rel="noreferrer">📍 Mapa</a>
    {/if}
    {#if activity.tel}
      <a class="btn btn-secondary" href="tel:{activity.tel}">📞 Llamar</a>
    {/if}
    {#if activity.bookingUrl}
      <a class="btn btn-secondary" href={activity.bookingUrl} target="_blank" rel="noreferrer">🎫 Ver reserva</a>
    {/if}
  </div>
</div>

<style>
  .act-card {
    --flash-color: var(--clay);
  }
.act-header { display: flex; gap: 9px; align-items: flex-start; }

  .act-icon { font-size: 1.1rem; margin-top: 1px; flex-shrink: 0; }

  .act-info { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }

  .act-type   { font-size: .62rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-soft); }
  .act-name   { font-size: .82rem; font-weight: 700; color: var(--ink); line-height: 1.2; }
  .act-note   { font-size: .72rem; color: var(--ink-soft); }
  .act-place  { font-size: .68rem; color: var(--ink-soft); margin-top: 2px; }
  .badges-row { margin-top: 5px; }

</style>
